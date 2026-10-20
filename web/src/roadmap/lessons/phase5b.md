<!--day 14 | core-->
#### 先看执行计划，再谈优化
```sql
EXPLAIN QUERY PLAN
SELECT category, SUM(amount) FROM entries
WHERE user_id = 1 AND date LIKE '2026-10%'
GROUP BY category;
```
你要看到的理想输出包含 `SEARCH entries USING INDEX idx_entries_user_date (user_id=?)`。如果出现 `SCAN entries`，说明索引没用上——数据量一大就线性变慢。

#### 索引为什么可能失效
| 写法 | 是否走索引 | 原因 |
| :--- | :--- | :--- |
| `WHERE user_id = ? AND date LIKE '2026-10%'` | ✅ | 最左前缀 + 前缀匹配 |
| `WHERE date LIKE '%10%'` | ❌ | 前置通配符无法定位起点 |
| `WHERE substr(date,1,7) = '2026-10'` | ❌ | 对列做函数运算 |
| `WHERE user_id = ? AND date >= '2026-10-01' AND date < '2026-11-01'` | ✅ | 范围扫描，最稳 |

**结论**：想做「按月」筛选，`LIKE '2026-10%'` 和范围查询都可以；一旦对列套函数就退化成全表扫描。

#### 索引不是越多越好
- 每个索引都会让写入变慢（INSERT/UPDATE 要维护索引）。
- 占磁盘空间。
- 优化器可能选错索引。

原则：**按真实查询建索引**，不要「猜着建」。账本的核心查询就两种：按用户+月列列表、按用户+月聚合。一个 `(user_id, date)` 复合索引就够。

#### 判据
```sql
EXPLAIN QUERY PLAN <你的聚合 SQL>;
-- 必须出现 USING INDEX，不能是 SCAN
```
再插入 1 万条测试数据，对比加索引前后的耗时（`EXPLAIN` 看计划比看耗时更稳定）。

#### 覆盖索引：让聚合完全不碰表
`(user_id, date)` 只能定位行，**取 `amount` 和 `category` 还要回表**。如果查询要的列全在索引里，SQLite 会显示 `USING COVERING INDEX`，省掉全部随机读：

```sql
CREATE INDEX idx_entries_cover ON entries(user_id, date, category, amount);
```
代价是索引变大（常驻内存的部分变多）、写入更慢。**只有「这条聚合查询是热路径」时才建覆盖索引**，别一上来就全建。判断方法：看 `EXPLAIN QUERY PLAN` 输出里有没有 `COVERING` 这个词，没有就说明还在回表。

#### 造数据：别手写 10 万条 INSERT
```sql
-- SQLite 的递归 CTE，一条语句造 10 万行
WITH RECURSIVE seq(n) AS (
    SELECT 1 UNION ALL SELECT n + 1 FROM seq WHERE n < 100000
)
INSERT INTO entries (user_id, amount, category, date, note)
SELECT (n % 3) + 1,
       (n * 37) % 20000,
       CASE n % 5 WHEN 0 THEN '餐饮' WHEN 1 THEN '交通' WHEN 2 THEN '购物' WHEN 3 THEN '居住' ELSE '其它' END,
       '2026-' || printf('%02d', (n % 12) + 1) || '-' || printf('%02d', (n % 28) + 1),
       ''
FROM seq;
```
一次执行可能要几十秒，正常。造完先 `ANALYZE`，让优化器拿到真实的统计信息——**没有统计信息时，优化器可能选错索引，你测出来的结论就是假的**。

```sql
ANALYZE;
SELECT COUNT(*) FROM entries;
```

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `SCAN entries` 且没用到索引 | 索引没建、列顺序反了，或对列用了函数 | 对照上面的失效表逐条排查 |
| `USING INDEX` 但依然很慢 | 走了索引却大量回表 | 建覆盖索引，或减少 `SELECT *` |
| 加了索引反而变慢 | 写多读少，或优化器选错 | 删掉不用的索引；跑 `ANALYZE` |
| 两条 SQL 的执行计划不一样 | 统计信息过期，或参数值影响了估算 | 测试前先 `ANALYZE`，保证对比条件一致 |

#### 5 分钟最小验证：同一查询，三个版本的耗时
```bash
for i in 1 2 3; do
  /usr/bin/time -f "%e s" sqlite3 ledger.db \
    "SELECT category, SUM(amount) FROM entries WHERE user_id=1 AND date LIKE '2026-10%' GROUP BY category;" > /dev/null
done
```
跑三遍取中间值（第一遍有冷缓存）。然后 `DROP INDEX idx_entries_user_date` 再跑三遍，对比。**没有对照就没有结论**——「0.02 秒」这个数字本身说明不了任何事，只有和「无索引的 1.8 秒」放在一起才有意义。

::q `WHERE substr(date,1,7) = '2026-10'` 为什么用不上索引？
::a 索引存的是列的原始值，一旦对列施加函数（`substr`/`date()`/`upper`），数据库必须对每一行计算函数值才能比较，无法利用索引的有序性，只能全表扫描。应改成对列直接做范围或前缀比较。
::q 复合索引 `(user_id, date)` 能被 `WHERE date = ?` 用上吗？
::a 不能。复合索引只能被「最左前缀」利用，单独用 `date` 查询缺少 `user_id` 这一前置列，无法定位。要支持这种查询需要单独为 `date` 建索引，或调整复合索引顺序。
::q 索引过多会带来什么具体代价？
::a 每次写入都要同步更新所有相关索引，降低插入/更新吞吐；占用额外磁盘；优化器选择空间变大，可能选错索引导致查询变慢。应按实际查询模式精简。

<!--day 15 | core-->
#### 错误处理中间件：把「错误→HTTP」的映射收敛到一处
先看没有这层时 handler 的样子。四个 handler，每个都要自己判断错误类型：

```go
// ❌ 每处都要写一遍，而且一定会写得不一样
if errors.Is(err, ledger.ErrNotFound) {
    Fail(w, 404, "NOT_FOUND", "not found"); return
} else if errors.Is(err, ledger.ErrEmailTaken) {
    Fail(w, 409, "EMAIL_TAKEN", "taken"); return
} else if err != nil {
    Fail(w, 500, "INTERNAL", "error"); return   // 忘了记日志
}
```
四处复制之后会出现三种偏差：某个 handler 把 `ErrNotFound` 写成了 400、某个忘了记日志、某个把 `err.Error()` 直接回给了客户端。**这些偏差不会让测试失败，只会在线上表现为「同一个错误，不同接口返回不同状态码」**，前端只能每个接口写一套处理。

收敛到一处之后，handler 里只剩一行 `if err != nil { writeError(w, r, err); return }`。新增一种业务错误时，只改 `writeError` 一个地方。

```go
type appError struct {
    Status int
    Code   string
    Msg    string
    Err    error   // 原始错误，只进日志
}

func (e *appError) Error() string { return e.Msg }
func (e *appError) Unwrap() error { return e.Err }

func badRequest(code, msg string) error {
    return &appError{Status: 400, Code: code, Msg: msg}
}
func notFound(msg string) error {
    return &appError{Status: 404, Code: "NOT_FOUND", Msg: msg}
}
```
`Unwrap()` 让 `errors.Is/As` 仍能穿透，兼顾「统一映射」和「保留错误链」。

注意 `Error()` 返回的是 `e.Msg`（给用户看的文案），**不是 `e.Err.Error()`**。这一点很关键：如果 `Error()` 直接透传底层错误，任何一次 `log.Printf("%v", err)` 都会把 SQL 片段写进日志或响应，而这个结构体存在的意义正是「把可展示的文案和不可展示的原因分开」。

#### 中间件里统一翻译
```go
func writeError(w http.ResponseWriter, r *http.Request, err error) {
    var ae *appError
    if errors.As(err, &ae) {
        Fail(w, ae.Status, ae.Code, ae.Msg)
        if ae.Err != nil {
            slog.Error("request failed", "err", ae.Err, "req_id", reqID(r))
        }
        return
    }
    switch {
    case errors.Is(err, ledger.ErrNotFound):
        Fail(w, 404, "NOT_FOUND", "not found")
    case errors.Is(err, context.DeadlineExceeded):
        Fail(w, 504, "TIMEOUT", "upstream timeout")
    case errors.Is(err, ledger.ErrEmailTaken):
        Fail(w, 409, "EMAIL_TAKEN", "email already registered")
    default:
        slog.Error("unhandled error", "err", err, "req_id", reqID(r))
        Fail(w, 500, "INTERNAL", "internal error")
    }
}
```
关键：**默认分支必须记日志**。未知错误静默返回 500，是最难排查的一类问题。

#### 三层错误的职责
- **store**：返回原始错误，用 `%w` 包装，加操作上下文。
- **ledger（Service）**：翻译成业务错误（`ErrNotFound`、`ErrEmailTaken`、`ValidationError`）。
- **httpapi**：把业务错误映射到状态码 + code。

**store 不认识 HTTP，Service 不认识状态码。** 这条守住了，将来加 gRPC 只需要写一套新的映射。

#### 一个真实的分界线：参数校验错误放在哪层
```go
// ledger：只描述「哪里不对」，不管 400
type ValidationError struct {
    Field string
    Msg   string
}
func (e *ValidationError) Error() string { return e.Field + ": " + e.Msg }

// httpapi：在这里决定 400 + 哪个 code
var ve *ledger.ValidationError
if errors.As(err, &ve) {
    Fail(w, 400, "INVALID_ARGUMENT", ve.Msg)   // 还能把 ve.Field 带进 details
    return
}
```
如果反过来让 Service 直接返回 `appError{Status: 400}`，Service 就和 HTTP 绑死了——写 CLI 时你得为一个「金额必须为正」的错误去处理一个没人看的 `Status` 字段。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 500 但日志里什么都没有 | 默认分支没记日志，或日志级别高到吞掉了 Error | 默认分支必须 `slog.Error`，并确认 level 配置 |
| 客户端看到 `sql: no rows in result set` | handler 直接把 `err.Error()` 写进了 message | 统一走 `writeError`，`Msg` 用固定文案 |
| `errors.As` 一直匹配不上 | `appError` 被 `%v` 包装了（而不是 `%w`） | 包装必须用 `%w`，否则链断了 |
| 某个接口状态码和其他接口不一致 | 那个 handler 没走 `writeError`，自己写了一套 | 搜 `Fail(w,` 出现的位置，只允许在 `writeError` 和参数校验里 |

#### 5 分钟最小验证：四类错误，一次打完
```bash
curl -s -o /dev/null -w 'created=%{http_code}\n' -X POST localhost:8080/ledger -d '{"amount":3550,"category":"x","date":"2026-10-19"}'
curl -s -o /dev/null -w 'invalid=%{http_code}\n' -X POST localhost:8080/ledger -d '{"amount":0,"category":"x","date":"2026-10-19"}'
curl -s -o /dev/null -w 'notfound=%{http_code}\n' localhost:8080/ledger/999999
curl -s -o /dev/null -w 'badid=%{http_code}\n' localhost:8080/ledger/abc
```
期望 `201 / 400 / 404 / 400`。四个数字里任何一个变成 500，都说明有一条错误路径没被 `writeError` 接住——**而 500 是最不该出现的，因为它意味着「我们没预料到」**。

再去日志里 grep 一次：`grep 'level=ERROR' /tmp/server.log`。只有真正未预期的错误才该出现在这里；如果 400/404 也在其中，说明日志级别用错了。

#### 判据
```bash
# 四类错误各打一次
curl -i -X POST .../ledger -d '{"amount":0}'      # 400 INVALID_ARGUMENT
curl -i .../ledger/999999                          # 404 NOT_FOUND
curl -i .../register -d '{"email":"a@x.com",...}'  # 409 EMAIL_TAKEN
# 数据库不可用时                                    # 500 INTERNAL + 日志有完整错误
```

::q `appError` 为什么要实现 `Unwrap()`？
::a 让 `errors.Is/As` 能继续沿链判断底层错误。这样上层既能用 `errors.As` 取出 `appError` 拿到状态码，也能用 `errors.Is` 判断底层的 `ErrNotFound`，两种语义都保留。
::q 未知错误为什么必须记日志？
::a 因为默认分支返回的 500 不含任何原因，客户端和监控都只看到「服务端错误」。没有日志就没有排查线索，只能靠复现。日志要带完整错误链和 request_id，才能从告警直达具体请求。
::q Service 层为什么不该知道 HTTP 状态码？
::a 状态码是传输层概念，Service 被 CLI、gRPC、定时任务共用时没有意义。Service 只表达业务语义（不存在、冲突、参数非法），由各传输层自行映射。耦合后换协议就要改业务代码。

<!--day 16 | core-->
#### request ID：一条日志串起一次请求
```go
func WithRequestID(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        id := r.Header.Get("X-Request-ID")
        if id == "" {
            id = newID()   // 随机 16 字节 hex
        }
        ctx := context.WithValue(r.Context(), reqIDKey, id)
        w.Header().Set("X-Request-ID", id)   // 回传给客户端，便于报障
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```
**ID 由入口生成，向下传，向上回显。** 客户端报障时报这个 ID，你就能在日志里 grep 出整条链路。

#### 用 `slog` 而不是 `log.Printf`
```go
slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelInfo,
})))

slog.Info("request",
    "method", r.Method,
    "path", r.URL.Path,
    "status", rec.status,
    "dur_ms", time.Since(start).Milliseconds(),
    "req_id", reqID(r),
)
```
JSON 输出能被日志系统直接解析、按字段聚合。`log.Printf` 的文本行只能靠正则，字段一多就崩。

#### 日志要遵守的三条
1. **不记敏感信息**：密码、token、完整邮箱、cookie。需要时脱敏（`a***@x.com`）。
2. **不记请求体全文**：体积大且可能含隐私，只记长度和关键字段。
3. **错误日志带 `err`**，用 `slog.Error("...", "err", err)`，序列化时会带消息和链。

#### 把 request ID 的支架补齐（少一行都编译不过）

上面两段代码用到 `reqIDKey`、`newID()`、`reqID(r)` 三个东西，必须自己定义：

```go
type ctxKey struct{ name string }

var reqIDKey = ctxKey{"reqID"}           // 用自定义类型，避免和别的包撞键

func newID() string {
    b := make([]byte, 16)
    if _, err := rand.Read(b); err != nil {   // crypto/rand，不是 math/rand
        return fmt.Sprintf("%d", time.Now().UnixNano())   // 极端情况下退化为时间戳
    }
    return hex.EncodeToString(b)
}

func reqID(r *http.Request) string {
    if v, ok := r.Context().Value(reqIDKey).(string); ok {
        return v
    }
    return ""                            // 未经过中间件时不要 panic
}
```

`crypto/rand` 和 `math/rand` 的区别要记牢：后者是可预测的伪随机，用它生成 ID 会让「按 ID 猜请求」变成可能；前者读系统熵池，才是 ID 该用的。

#### 中间件顺序：request ID 必须在日志之前

```go
h = mux
h = WithAuth(h)
h = WithLogging(h)        // 依赖 ctx 里的 ID
h = WithRequestID(h)      // 必须在最外层，先生成 ID
```

套的顺序就是执行顺序（后套的在外层）。如果 `WithRequestID` 套在 `WithLogging` 里面，日志跑的时候 ctx 里还没有 ID，打出来就是空字符串——**表现是「日志里 req_id 全是空」，而不是报错**。

#### 日志字段定了就别改：这是给人聚合用的

| 字段 | 类型 | 规范 |
| :--- | :--- | :--- |
| `request_id` | string | 16 字节 hex，一请求一个 |
| `method` / `path` | string | path 不含 query，避免敏感参数入日志 |
| `status` | int | 真实状态码（需要 `statusRecorder`） |
| `duration_ms` | int64 | 毫秒整数，别打 `1.234567s` |
| `user_id` | int64 | 未登录时打 0 或省略 |
| `err` | error | 仅错误日志带，由 slog 序列化 |

字段名一旦上线就别改（`dur` → `duration_ms` 会让历史日志查不出来）。**规范的价值在于「三个月后还能按同一字段聚合」**，不在于好看。

#### 5 分钟最小验证：一条日志能被 grep 串起来

```bash
$ ./api > /tmp/app.log 2>&1 &
$ curl -s -o /dev/null -D - localhost:8080/api/v1/ledger/999999 | grep -i x-request-id
$ grep "$(grep -o '"request_id":"[^"]*"' /tmp/app.log | head -1 | cut -d'"' -f4)" /tmp/app.log | jq .
```

验收标准：① 响应头里有 `X-Request-ID`；② 同一 ID 能在日志里找到请求行；③ 404 的那条日志 `status=404`、`err` 字段有内容。三条齐了，出故障时你才有「凭一个 ID 追一条链路」的能力。

#### 判据
```bash
curl -i localhost:8080/ledger | grep -i x-request-id
# 响应头有 ID
# 日志里同一 ID 能 grep 到请求行 + 错误行
grep <id> app.log
```

::q request ID 应该由谁生成？
::a 由最外层入口生成（通常是网关或 HTTP 中间件），并回写到响应头。若上游已带 `X-Request-ID` 就沿用，保证跨服务链路一致。让每个服务自己生成会导致同一次请求在日志里有多个 ID。
::q 为什么日志用 JSON 而不是文本行？
::a JSON 有固定字段名，日志系统能直接解析并做聚合查询（按 status、dur 分组），也便于程序处理。文本行需要正则提取，字段一多或格式一变就失效。
::q 日志里哪些内容不能记录？
::a 密码、token、cookie、完整手机号/邮箱、身份证、完整请求体。这些一旦落盘就构成泄漏风险，且很难追溯清理。需要排障时记录脱敏值或哈希值。

<!--day 17 | normal-->
#### 表驱动测试的骨架
```go
func TestCreate_Validation(t *testing.T) {
    cases := []struct {
        name    string
        in      ledger.CreateInput
        wantErr string
    }{
        {"amount 为 0", ledger.CreateInput{Amount: 0, Category: "餐饮", Date: "2026-10-19"}, "amount"},
        {"amount 为负", ledger.CreateInput{Amount: -1, Category: "餐饮", Date: "2026-10-19"}, "amount"},
        {"分类为空", ledger.CreateInput{Amount: 100, Category: "", Date: "2026-10-19"}, "category"},
        {"日期格式错", ledger.CreateInput{Amount: 100, Category: "餐饮", Date: "2026/10/19"}, "date"},
        {"合法输入", ledger.CreateInput{Amount: 100, Category: "餐饮", Date: "2026-10-19"}, ""},
    }

    for _, c := range cases {
        t.Run(c.name, func(t *testing.T) {
            svc := ledger.NewService(&fakeStore{})
            _, err := svc.Create(context.Background(), c.in)
            if c.wantErr == "" {
                if err != nil { t.Fatalf("unexpected error: %v", err) }
                return
            }
            var ve *ledger.ValidationError
            if !errors.As(err, &ve) || ve.Field != c.wantErr {
                t.Fatalf("want field %q, got %v", c.wantErr, err)
            }
        })
    }
}
```
三个设计点：
1. **`name` 是中文描述**：失败时报「amount 为 0」比「case 1」有用得多。
2. **断言字段而不是错误文案**：文案会改，字段名稳定。
3. **每个 case 独立构造 Service**：避免状态泄漏。

#### fakeStore 是测试的核心资产
```go
type fakeStore struct {
    entries []ledger.Entry
    createErr error
}
func (f *fakeStore) CreateEntry(ctx context.Context, e ledger.Entry) (int64, error) {
    if f.createErr != nil { return 0, f.createErr }
    f.entries = append(f.entries, e)
    return int64(len(f.entries)), nil
}
```
它能模拟「存储层报错」，这是真实数据库很难稳定构造的场景（比如超时、唯一冲突）。

#### 第一次写测试，先搞清这四件事

1. **文件名必须以 `_test.go` 结尾，且和被测包同一个目录、同一个包名**。`internal/ledger/service_test.go` 里写 `package ledger`（不是 `ledger_test`），这样才能访问未导出成员；想强制只测公开 API 才用 `package ledger_test`。
2. **测试函数签名固定**：`func TestXxx(t *testing.T)`。`Test` 后面第一个字母必须大写，否则 `go test` 不会执行它——这是「写了测试但一个都没跑」的最常见原因。
3. **`go test ./...` 跑全部，`-run` 按正则筛，`-v` 打印每个子测试**：
```bash
go test ./internal/ledger -v -run 'TestCreate_Validation/amount'
go test ./... -count=1          # 不吃缓存，改完代码立刻重跑
```
4. **`t.Run` 的第二个参数必须是 `func(t *testing.T)`**，不要捕获外层 `t`。子测试里报错要用参数里的 `t`，否则失败会被记到父测试上，定位不到具体 case。

#### fakeStore 必须实现**整个** Store 接口

接口有几个方法，假实现就得写几个，哪怕测试只用到 `CreateEntry`。最省事的写法是把用不到的方法写成「返回零值 + 一个明确的错误」，并在旁边放一行编译期断言：

```go
var _ ledger.Store = (*fakeStore)(nil)   // 缺方法立刻编译失败，不用等运行时

func (f *fakeStore) GetEntry(ctx context.Context, uid, id int64) (ledger.Entry, error) {
    return ledger.Entry{}, ledger.ErrNotFound
}
func (f *fakeStore) ListEntries(ctx context.Context, q ledger.ListQuery) ([]ledger.Entry, int64, error) {
    return nil, 0, nil
}
func (f *fakeStore) SumByCategory(ctx context.Context, uid int64, m string) ([]ledger.CategorySum, error) {
    return nil, nil
}
func (f *fakeStore) CreateUser(ctx context.Context, email, hash string) (int64, error) { return 0, nil }
func (f *fakeStore) FindUserByEmail(ctx context.Context, email string) (ledger.User, error) {
    return ledger.User{}, ledger.ErrNotFound
}
```

接口以后加方法时**编译就会失败**，而不是等某个 case 行为诡异才发现。这是「让编译器替你记住」的典型用法。

#### 表驱动最容易写错的四个地方

| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 子测试全部 PASS，但明显有 case 该失败 | `t.Run` 里用了外层 `t`，或只 `t.Log` 没 `t.Fatalf` | 用参数 `t`，失败必须 `Fatalf`/`Errorf` |
| `go test` 显示 `no test files` | 文件名不是 `_test.go`，或函数名不是 `TestXxx` | 改名；`Test` 后首字母大写 |
| 改了代码结果没变 | 命中测试缓存 | `go test -count=1 ./...` |
| 断言错误文案而不是字段 | 文案改一次测试就红 | 断言 `ValidationError.Field` 或 `errors.Is` |

#### 5 分钟最小验证：先让测试红一次

把 `{"合法输入", ..., ""}` 这一行的 `wantErr` 故意改成 `"amount"`，跑：

```bash
go test ./internal/ledger -run TestCreate_Validation -v
```

必须看到 `--- FAIL: TestCreate_Validation/合法输入`。**没红过的测试不值得信任**——它可能根本没被执行。改回来再跑，全绿才算完成。

#### 判据
```bash
go test ./internal/ledger -v -run TestCreate_Validation
# 5 个子测试全部 PASS，失败时输出中文 case 名
```

::q 表驱动测试里为什么断言 `ValidationError.Field` 而不是错误消息文本？
::a 消息文案会随产品迭代修改，断言文本会让测试频繁误报。字段名是稳定的语义标识，也正好是前端用来高亮输入框的值。断言语义比断言文案更有价值。
::q 为什么需要 `fakeStore` 而不是直接用 SQLite 内存库测 Service？
::a Service 的测试目标是业务规则，不该依赖数据库行为。fake 能精确构造「存储层返回唯一冲突」「返回超时」等难以稳定复现的场景，测试也更快。真正验证 SQL 的测试放在 Repository 层。
::q 每个 case 都新建 Service 有什么好处？
::a 避免测试间状态污染（比如前一个 case 写入的数据影响后一个）。表驱动测试共享状态时，失败顺序依赖执行顺序，排查会非常困难。

<!--day 18 | core-->
#### `httptest` 的两个工具
```go
func TestCreateEntry_BadJSON(t *testing.T) {
    req := httptest.NewRequest(http.MethodPost, "/ledger", strings.NewReader(`{"amount":"abc"}`))
    req.Header.Set("Content-Type", "application/json")
    rec := httptest.NewRecorder()

    router := httpapi.NewRouter(svc, cfg)
    router.ServeHTTP(rec, req)

    if rec.Code != http.StatusBadRequest {
        t.Fatalf("want 400, got %d body=%s", rec.Code, rec.Body.String())
    }
    var resp struct {
        Code string `json:"code"`
    }
    json.Unmarshal(rec.Body.Bytes(), &resp)
    if resp.Code != "INVALID_ARGUMENT" {
        t.Fatalf("want INVALID_ARGUMENT, got %s", resp.Code)
    }
}
```
- `NewRequest`：构造请求（不经过网络）。
- `NewRecorder`：捕获状态码、头、body。

**它测的是整条链路**：路由匹配 + 中间件 + handler + 错误映射。比单独测 handler 更有价值。

#### 必须测的六类用例
| 类型 | 例子 | 断言 |
| :--- | :--- | :--- |
| 正常 | 合法 JSON | 201 + data.id > 0 |
| 语法错 | 非法 JSON | 400 |
| 语义错 | amount=0 | 400 + field |
| 认证缺失 | 无 Authorization | 401 |
| 资源不存在 | id=999999 | 404 |
| 方法错 | PUT /ledger | 405 |

**认证相关的用例特别重要**：它验证「中间件确实套上了」。漏套中间件是灾难级 bug，而它不会导致任何编译错误。

#### 一个容易忽略的点
`httptest.NewRequest` 的 `r.RemoteAddr` 默认是 `192.0.2.1:1234`，如果你的限流或审计依赖真实 IP，测试里要显式设置，否则测不到真实行为。

#### 先搭一个跑得起来的测试骨架
新手写 handler 测试最容易卡在「一堆前置准备」上：建库、装配 svc、造 token。抽成一个 `newTestServer` 辅助函数，每个用例只写「请求 + 断言」：

```go
func newTestServer(t *testing.T) http.Handler {
    t.Helper()                                   // 让失败行号指向调用方，而不是这里
    db := newTestDB(t)                           // 见明天的 D19
    svc := ledger.NewService(store.NewGorm(db), "test-secret")
    return httpapi.NewRouter(svc, config.Test())
}

func TestCreateEntry(t *testing.T) {
    h := newTestServer(t)
    cases := []struct {
        name     string
        body     string
        wantCode int
        wantBiz  string
    }{
        {"合法", `{"amount":3550,"category":"餐饮","date":"2026-10-19"}`, 201, "OK"},
        {"金额为零", `{"amount":0,"category":"餐饮","date":"2026-10-19"}`, 400, "INVALID_ARGUMENT"},
        {"非法 JSON", `{"amount":"abc"}`, 400, "INVALID_ARGUMENT"},
        {"未知字段", `{"amount":3550,"amout":1}`, 400, "INVALID_ARGUMENT"},
    }
    for _, c := range cases {
        t.Run(c.name, func(t *testing.T) {
            req := httptest.NewRequest(http.MethodPost, "/ledger", strings.NewReader(c.body))
            req.Header.Set("Content-Type", "application/json")
            req.Header.Set("Authorization", "Bearer "+testToken(t))
            rec := httptest.NewRecorder()
            h.ServeHTTP(rec, req)

            if rec.Code != c.wantCode {
                t.Fatalf("code=%d want=%d body=%s", rec.Code, c.wantCode, rec.Body.String())
            }
            var resp struct{ Code string `json:"code"` }
            json.Unmarshal(rec.Body.Bytes(), &resp)
            if resp.Code != c.wantBiz {
                t.Fatalf("biz=%q want=%q", resp.Code, c.wantBiz)
            }
        })
    }
}
```
`t.Helper()` 不是可选项：没有它，所有断言失败都会报在你这个辅助函数的第 3 行，你根本不知道是哪个用例挂了。

「**未知字段**」这条用例值得单独留着——它同时验证了 `DisallowUnknownFields` 没被后来的人改掉。这类「安全默认值」最容易被顺手删除，用测试钉住它。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `panic: runtime error: invalid memory address` 在 `NewRouter` | `svc` 或 `cfg` 是 nil | 用同一个辅助函数装配，不要每个测试自己拼 |
| 所有用例都 401 | 忘了带 `Authorization` 头 | 抽 `testToken(t)`，或在辅助函数里默认带上 |
| 断言失败但看不出是哪个用例 | 忘了 `t.Run` 或用例名重复 | 用 `t.Run(c.name, ...)`，名字要唯一 |
| 测试通过但接口其实坏的 | 只断言了状态码 200，没断言 body | 至少断言 `code` 字段和关键数据 |

#### 5 分钟最小验证：让测试先红一次
```bash
go test ./internal/httpapi -run TestCreateEntry -v
```
先故意把断言写成 `wantCode: 200`（错误期望），跑一次，**必须看到 4 个红色 FAIL，每个都带用例名**。然后改回来。

这一步不是形式主义：它同时验证了三件事——测试真的被执行了、失败信息可读、用例名能定位。**很多人写的测试「永远不会失败」，因为他们断言的是自己刚写死的东西。**

#### 判据
```bash
go test ./internal/httpapi -v
# 六个用例全绿
go test ./internal/httpapi -run TestCreateEntry -v
# 4 个子用例全过；注释掉认证中间件后，401 用例必须变红
```
**故意破坏一次，确认测试能抓住。** 测试没抓到问题的测试，等于没写。

::q `httptest.NewRecorder` 相比启动真实服务器，优势是什么？
::a 不需要端口、不经过网络，毫秒级完成，能稳定断言状态码/头/body，也能在同一进程内注入依赖。真实服务器测试更适合端到端验证，单元测试用 recorder 更快更可靠。
::q 为什么「无 token 应返回 401」这个测试特别关键？
::a 它验证认证中间件真的挂在了路由上。漏挂不会导致编译错误、不会影响其他测试，但会让整个接口裸奔。这是典型的「静默失效」，只能靠测试发现。
::q 如何确认一个测试「真的能抓住 bug」？
::a 故意把被测逻辑改坏（注释掉中间件、改错状态码），运行测试确认变红，再恢复。测试永远绿色往往意味着断言太弱或根本没覆盖到。

<!--day 19 | core-->
#### 内存 SQLite 的正确 DSN
```go
func newTestDB(t *testing.T) *gorm.DB {
    t.Helper()
    // 每个测试用独立的内存库，避免相互影响
    dsn := fmt.Sprintf("file:memdb_%s?mode=memory&cache=shared", t.Name())
    db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
    if err != nil { t.Fatalf("open: %v", err) }
    sqlDB, _ := db.DB()
    sqlDB.SetMaxOpenConns(1)      // 内存库多连接会各自看到不同的库
    t.Cleanup(func() { sqlDB.Close() })
    if err := migrations.Up(sqlDB); err != nil { t.Fatalf("migrate: %v", err) }
    return db
}
```
三个关键点：
1. **`mode=memory&cache=shared`**：`file::memory:` 在每次连接时创建新库，多连接会看到不同的数据。带名字 + shared cache 才能让同进程的多个连接共享。
2. **`SetMaxOpenConns(1)`**：内存库在多连接下容易出「表不存在」的怪问题。
3. **用 `t.Cleanup` 关闭**，不用 `defer`（`defer` 在子测试里时机不对）。

#### 为什么用真迁移而不是 AutoMigrate
测试库如果和生产的建表方式不同，SQL 差异就测不出来。**测试环境应该尽量贴近生产**：同一个迁移文件、同样的索引。

#### 一个完整的 Repository 测试
```go
func TestEntry_Isolation(t *testing.T) {
    db := newTestDB(t)
    r := store.NewGorm(db)
    ctx := context.Background()

    id, err := r.CreateEntry(ctx, ledger.Entry{UserID: 1, Amount: 100, Category: "餐饮", Date: "2026-10-19"})
    if err != nil { t.Fatal(err) }

    _, err = r.GetEntry(ctx, 2, id)     // 用户 2 读用户 1 的数据
    if !errors.Is(err, ledger.ErrNotFound) {
        t.Fatalf("越权读取未被阻止: %v", err)
    }
}
```
这个测试的价值在阶段五之后依然存在——**它是数据隔离的回归防线**。

#### 判据
```bash
go test ./internal/store -v -count=1    # 全绿
go test ./internal/store -race          # 无竞态
```
`-count=1` 禁用缓存，确保真的执行了。

#### 为什么这里不用 mock
上一批 handler 测试用的是假 Store（`fakeStore`），这里却要起真库。区别在于**你要验证什么**：

| 测什么 | 用什么 | 原因 |
| :--- | :--- | :--- |
| Service 的业务规则 | 假 Store | 要能构造「存储层返回唯一冲突」这类难复现的错误 |
| Repository 的 SQL | 真库（内存 SQLite） | mock 不会告诉你 `WHERE` 写错、类型不匹配、索引缺失 |

**mock 掉 SQL 层，等于把最需要验证的东西验证掉了。** 「测试全绿、生产 SQL 报错」几乎总是这个原因。

代价是真库测试慢（每个用例几十毫秒），所以数量要控制：Repository 层每个方法 1–2 个用例就够，重点覆盖「SQL 真实行为」——`ORDER BY` 是否稳定、`LIKE` 是否区分大小写、`RowsAffected` 是否如预期。

#### 一个会真的把测试挂住的坑：单连接 + 事务
```go
sqlDB.SetMaxOpenConns(1)     // 只有一个连接
// 事务持有这个连接时，事务外的任何查询都在等
tx := db.Begin()
db.Where("...").Find(&x)     // ← 永远等不到连接，测试超时
```
内存 SQLite 必须限制连接数（否则每个连接看到不同的库），但**限制成 1 之后，事务里就只剩这一个连接**。任何在事务进行中另开一条连接的操作都会死锁，表现为测试卡住直到 10 分钟超时。

两条规避方式：① 事务内只用 `tx`，不要用 `db`；② 需要更多并发时改用**临时文件库**（`t.TempDir()` 下建一个 `.db`），这样连接数可以放开。

```go
// 临时文件库：隔离性靠目录，不靠内存
dsn := filepath.Join(t.TempDir(), "test.db")
```

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `no such table: entries` | 共享缓存下另一个连接连到了空库，或迁移没跑 | 确认 DSN 带同一个 `memdb_<name>`，且 `newTestDB` 里跑了迁移 |
| 测试卡住不返回，10 分钟后超时 | 单连接 + 事务里用了 `db` | 事务内只用 `tx`；或换临时文件库 |
| 两个测试互相看到对方的数据 | DSN 名字写死了，共享了同一个库 | 用 `t.Name()` 拼 DSN，或 `t.TempDir()` |
| `-race` 报数据竞争 | 多个 goroutine 共用一个 `*gorm.DB` 且共享了可变 session | 每个 goroutine 用 `db.Session(&gorm.Session{})` 新建会话 |

#### 5 分钟最小验证：故意写错 SQL，确认测试能抓到
```go
// 把 GetEntry 的 SQL 改成只按 id（漏掉 user_id），跑隔离测试
go test ./internal/store -run TestEntry_Isolation -v
// 必须 FAIL：越权读取未被阻止
```
然后改回来。**这一步证明「这个测试真的在测隔离」**，而不是碰巧通过。所有安全相关的测试都该做一次这样的验证——不然你永远不知道它是防线还是装饰。

::q `file::memory:` 和 `file:testdb?mode=memory&cache=shared` 有什么区别？
::a `file::memory:` 每次建立连接都会创建一个**新的**空库，多连接时彼此不可见，表现为「表不存在」或「刚插的数据查不到」。带名字 + `cache=shared` 让同进程内多个连接共享同一个内存库，行为才接近真实数据库。
::q 测试库为什么建议用真实迁移文件建表？
::a 保证测试环境与生产结构一致。用 `AutoMigrate` 建表可能与迁移文件有类型、索引、默认值差异，导致「测试通过但生产失败」。测试贴近生产才能发现真实问题。
::q `t.Cleanup` 相比 `defer` 在子测试中的优势？
::a `t.Cleanup` 绑定到具体的测试/子测试，在它结束时执行，顺序和时机正确；`defer` 在函数返回时执行，跨子测试或提前 `Fatal` 时可能来不及清理。资源释放用 `t.Cleanup` 更可靠。

<!--day 20 | normal-->
#### 覆盖率看的是「哪没测」，不是「数字多高」
```bash
go test ./... -coverprofile=cover.out
go tool cover -func=cover.out | tail -5
go tool cover -html=cover.out   # 浏览器查看未覆盖代码
```
经验判断：
- **业务规则（校验、金额计算、隔离）必须接近 100%**。
- 简单的 getter/setter、`main` 装配可以低。
- **不要为了数字去测无逻辑代码**，那是自欺。

#### 覆盖率抓不到的东西
- 数据竞争（要 `-race`）。
- 并发时序问题。
- 数据库真实行为（索引、锁、事务隔离）。
- 错误处理分支是否真的可达。

所以「覆盖率 80%」不等于「质量 80%」。它是**发现盲区的工具**，不是目标。

#### `-race` 与 `-count`
```bash
go test -race ./...            # 竞态检测，慢 5-10 倍，CI 必跑
go test -count=1 ./...         # 禁用缓存
go test -run TestX -v ./pkg    # 单测调试
```
`-race` 只能发现**实际执行到**的竞态，所以测试要尽量覆盖并发路径（比如并发创建、并发更新同一行）。

一个最小的可复现竞态，抄下来跑一次，你就知道 `-race` 报什么：

```go
func TestRace(t *testing.T) {
    var wg sync.WaitGroup
    m := map[int]int{}
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func(i int) { defer wg.Done(); m[i] = i }(i)   // 并发写 map
    }
    wg.Wait()
}
```
`go test -race` 会打印 `WARNING: DATA RACE`，并给出两条访问栈（一个读、一个写）和具体行号。**没有 `-race` 时，它多数情况下「看起来正常」**——这正是并发 bug 难查的原因：它不报错，只是偶尔算错。

在账本里，竞态最容易出现在两处：`Budget.used` 的读改写（应当用 SQL 的 `used = used + ?` 而不是 Go 里算）、以及共享的 `*gorm.DB` 被多个 goroutine 复用同一 session。

#### 哪些代码「必须」被测到
按风险排序，前三个优先级最高：
1. **金额计算与单位换算**（分↔元）——错一分就是用户投诉。
2. **数据隔离条件**（`user_id`）——漏掉就是越权。
3. **错误到状态码的映射**——错了会让故障被掩盖。

这三块的覆盖率应该接近 100%，而且断言要具体（断言 `code == "NOT_FOUND"`，不是只断言「有错误」）。

#### 用 `-coverpkg` 看跨包覆盖
```bash
go test ./internal/httpapi -coverpkg=./internal/ledger,./internal/store -coverprofile=c.out
```
默认只统计被测包本身。加了 `-coverpkg` 才能看出「handler 测试实际上覆盖了多少 Service 代码」——这比单包数字更有意义。

#### 判据
```bash
go test ./... -race -count=1
# 全绿且无 DATA RACE
go tool cover -func=cover.out | grep total
# 记下数字，重点看 ledger 包的覆盖率
```

#### 覆盖率的数字到底在数什么
`go test -cover` 报的是**语句覆盖率**：一行代码只要被执行过一次就算覆盖。所以它有三个已知盲区：

- 一个 `if` 的两个分支各写一行，覆盖率 100% 只说明「都进过」，不说明断言都对；
- `switch` 里漏掉一个 `case`，只要那行没被执行，覆盖率会掉，但如果你根本没想到这个 case，就不会去看；
- 表驱动测试里漏了一行数据，覆盖率完全看不出来（代码没变）。

更实用的是看**未覆盖代码的位置**，而不是总数：

```bash
go tool cover -func=cover.out | sort -k3 -n | head -10   # 覆盖率最低的函数
```
这条命令比 `grep total` 有用得多——它直接告诉你「哪个函数没人测」。家庭账本里，如果 `writeError` 或 `DeleteEntry` 出现在这个列表的前几名，那就是该补的地方。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `WARNING: DATA RACE` 指向 `database/sql` 内部 | 多 goroutine 共享同一个 `*gorm.DB` 的 session | 每个 goroutine 用 `db.Session(&gorm.Session{})` |
| 覆盖率一直是 `[no statements]` | 测的是 `main` 包且只有装配代码 | 正常；把逻辑挪进 `internal/` 才有可测语句 |
| `-race` 让测试从 3 秒变 30 秒 | 正常，竞态检测器会插桩 | CI 里接受这个成本；本地调试时可先不带 |
| 覆盖率 90% 但线上仍有 bug | 只测了成功路径 | 看 `cover -html` 里红色的错误分支 |

#### 5 分钟最小验证：让覆盖率掉下来，再补回去
```bash
go test ./internal/ledger -coverprofile=/tmp/c1.out -covermode=count
go tool cover -func=/tmp/c1.out | grep -E 'Summary|total'
# 临时注释掉一个错误分支的测试，再跑一次，看数字变化
```
`-covermode=count` 会记录每行被执行了多少次，`cover -html` 里次数越多颜色越深。**这一眼就能看出「哪些代码是死代码」**——某行 count 为 0 且怎么跑都不变，多半是永远不会走到的分支。

::q 覆盖率高是否代表测试质量高？
::a 不代表。覆盖率只说明「代码被执行过」，不说明断言是否正确、边界是否覆盖、并发是否安全。一段代码可以被执行 100 次而没有任何有效断言。它适合用来发现「完全没测到的盲区」。
::q `-race` 为什么必须在 CI 里跑？
::a 竞态是概率性的，本地跑几次可能都不触发。`-race` 会在运行时检测所有实际执行的读写冲突，配合覆盖并发路径的测试能提前暴露问题。虽然慢，但这是唯一能自动发现数据竞争的手段。
::q 哪些代码可以接受低覆盖率？
::a `main` 的装配代码、纯声明性的常量、简单 getter、以及依赖外部系统的适配层（由端到端测试覆盖）。业务规则、金额计算、权限判断这类逻辑不能低。

<!--day 21 | light-->
#### 预算的最小可用版本
```go
type Budget struct {
    ID       int64  `gorm:"primaryKey"`
    UserID   int64  `gorm:"index:idx_budget,unique,priority:1"`
    Month    string `gorm:"size:7;index:idx_budget,unique,priority:2"`
    Category string `gorm:"size:32;index:idx_budget,unique,priority:3"`
    Amount   int64  `gorm:"not null"`   // 分
}
```
唯一键 `(user_id, month, category)`：一个用户一个月一个分类只能有一条预算。

#### 检查只是「算一下再比较」
```go
func (s *Service) budgetWarning(ctx context.Context, uid int64, month, category string, add int64) (*Warning, error) {
    b, err := s.store.GetBudget(ctx, uid, month, category)
    if errors.Is(err, ledger.ErrNotFound) {
        return nil, nil       // 没设预算就不提示
    }
    if err != nil { return nil, err }

    used, err := s.store.SumCategory(ctx, uid, month, category)
    if err != nil { return nil, err }

    after := used + add
    if after <= b.Amount {
        return &Warning{Exceeded: false}, nil
    }
    return &Warning{
        Exceeded: true,
        Limit:    b.Amount,
        Used:     after,
        Over:     after - b.Amount,
    }, nil
}
```
**返回标志而不是拒绝写入**：记账是事实，预算只是提醒。拒绝写入会让用户被迫先改预算才能记账，体验极差。

#### 这是 stretch goal，可以先不做
标准是：**阶段五的核心（GORM 模式、迁移、统计、错误处理、测试）没做完之前，不要碰预算。** 先用「预算表 + 超限标志」跑通，复杂规则（分周期、共享预算、结转）留到以后。

#### 「先读后写」的窗口：为什么检查要和写入同一个事务
上面的 `budgetWarning` 有个时序问题：它先 `SumCategory` 再让 handler 插入账目，两步之间隔着一个网络往返。两个请求同时来，各自读到 `used=900`（预算 1000），各加 200，都判定「超了但允许」——**结果 used=1300，超了 30%，而两个响应都只提示「超 200」**。

要让提示准确，检查与写入必须在一个事务里：

```go
func (r *Repo) CreateWithBudgetCheck(ctx context.Context, e ledger.Entry, limit int64) (bool, int64, error) {
    var exceeded bool
    var over int64
    err := r.session(ctx).Transaction(func(tx *gorm.DB) error {
        // ① 先把这笔写进去
        row := entryRow{UserID: e.UserID, Amount: e.Amount, Category: e.Category, Date: e.Date, Note: e.Note}
        if err := tx.Create(&row).Error; err != nil { return err }

        // ② 在同一快照里算「写完之后的已用」
        var used int64
        if err := tx.Model(&entryRow{}).
            Where("user_id = ? AND category = ? AND date >= ? AND date < ?", e.UserID, e.Category, e.Date[:7]+"-01", nextMonth(e.Date[:7])).
            Select("COALESCE(SUM(amount),0)").Scan(&used).Error; err != nil { return err }

        if used > limit { exceeded, over = true, used-limit }
        return nil
    })
    return exceeded, over, err
}
```
注意 `used` 已经把本笔算进去了（因为先插入），所以不需要再 `+ add`。**顺序换来的是准确**：读完立刻写，中间没有窗口。

代价写在明面上：事务变长、SQLite 下持有写锁更久。预算只是提示、不阻断，所以这里可以用「读在事务内、判断在事务外」的折中——但**折中要有理由，不能是「没想到」**。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 两条预算记录同时存在 | 唯一键漏了某一列，或分类用了 name 而不是 id | 唯一键覆盖 `(user_id, month, category_id)` |
| `used` 比实际少 | 检查时用了 `date = ?`（只匹配当天）而不是月份范围 | 用 `>= 月初 AND < 下月初` |
| 超限提示的数字对不上 | 检查与写入不在同一事务 | 见上面的 `CreateWithBudgetCheck` |
| 没设预算却报超限 | `ErrNotFound` 没被识别，`b.Amount` 是零值 | `errors.Is(err, ErrNotFound)` 时直接返回 nil |

#### 5 分钟最小验证
```bash
# 设预算 10 元，连记两笔 6 元，第二笔必须带 budget_exceeded
curl -s -X PUT localhost:8080/budgets -H "Authorization: Bearer $T" \
  -d '{"month":"2026-10","category":"餐饮","amount":1000}' | jq -c .data
curl -s -X POST localhost:8080/ledger -H "Authorization: Bearer $T" \
  -d '{"amount":600,"category":"餐饮","date":"2026-10-19"}' | jq -c .data.budget_exceeded   # false
curl -s -X POST localhost:8080/ledger -H "Authorization: Bearer $T" \
  -d '{"amount":600,"category":"餐饮","date":"2026-10-19"}' | jq -c .data.budget_exceeded   # true
```
第二笔之后查 `select sum(amount) from entries where category='餐饮'`，必须是 1200——「**超了但记上了**」才是正确行为。

::q 超预算时应该拒绝写入还是返回标志？
::a 返回标志。账目是既成事实，拒绝写入会导致数据不完整，用户还得先改预算才能记账。预算的作用是提醒而非限制，除非产品明确要求「硬性拦截」。
::q 预算唯一键为什么要包含 `month` 和 `category`？
::a 因为预算是「某用户某月某分类的限额」。缺少 `month` 会导致设置一次后永久生效，无法按月调整；缺少 `category` 则无法分类控制。
::q 预算检查应该放在写账目的事务里，还是事务外？两种选择各自的后果？
::a 放事务内：读到的 `used` 与本次写入是同一快照，不会出现「两个并发请求各读旧值、都判定未超预算」；代价是事务变长，SQLite 下会延长全局写锁。放事务外：事务短，但并发时可能少报超支。家庭账本的正确选择是**事务内做「读 used + 插入」但保持事务极短**（只两条语句，不调外部服务）；而且因为预算只提示、不阻断，轻微不一致是可接受的。

<!--day 22 | light-->
#### 全量加载版 CSV：能跑就行
```go
func exportCSV(w http.ResponseWriter, entries []ledger.Entry) error {
    w.Header().Set("Content-Type", "text/csv; charset=utf-8")
    w.Header().Set("Content-Disposition", `attachment; filename="ledger.csv"`)

    w.Write([]byte{0xEF, 0xBB, 0xBF})   // UTF-8 BOM，Excel 才不乱码
    cw := csv.NewWriter(w)
    defer cw.Flush()

    if err := cw.Write([]string{"日期", "分类", "金额(元)", "备注"}); err != nil {
        return err
    }
    for _, e := range entries {
        if err := cw.Write([]string{
            e.Date, e.Category,
            strconv.FormatFloat(float64(e.Amount)/100, 'f', 2, 64),
            e.Note,
        }); err != nil {
            return err
        }
    }
    return cw.Error()
}
```
两个必做细节：
1. **UTF-8 BOM**：不加的话 Excel 打开中文列名会乱码（这是 Windows Excel 的兼容问题）。
2. **`cw.Error()`**：`Flush` 之后要检查写入错误，否则磁盘满/连接断开时你以为成功了。

#### 金额格式化必须固定两位小数
`strconv.FormatFloat(v, 'f', 2, 64)` 保证输出 `35.50` 而不是 `35.5`。CSV 里的金额列如果小数位不固定，Excel 会当文本处理。

#### 判据
```bash
curl -s "localhost:8080/ledger/export?month=2026-10" -H "Authorization: Bearer $T" -o out.csv
head -2 out.csv     # 表头中文正常
# 用 Excel / Numbers 打开，中文不乱码，金额两位小数
```

#### 全量加载版还有三件事没做对
这个版本「能跑」，但离「能交付」差三处，今天先知道，明天再修其中一处：

1. **文件名固定成 `ledger.csv`**。用户下载两个月份会得到 `ledger.csv` 和 `ledger (1).csv`，分不清哪个是哪个月。应该把月份拼进文件名：
```go
w.Header().Set("Content-Disposition",
    fmt.Sprintf(`attachment; filename="ledger-%s.csv"; filename*=UTF-8''%s`, month, url.PathEscape("账本-"+month+".csv")))
```
2. **没有 `Content-Length`**，浏览器无法显示下载进度，大文件看起来像「卡住了」。全量版其实可以设（数据都在内存里，长度已知）；流式版不能设，这是它要付的代价。
3. **没有转义风险意识**。CSV 里以 `=`、`+`、`-`、`@` 开头的单元格会被 Excel 当公式执行（CSV 注入）。备注里写 `=1+1` 只是显示成 2，写 `=HYPERLINK(...)` 就可能变成钓鱼链接。**对外分享的 CSV 必须给这类单元格加前导单引号**。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| Excel 打开中文乱码 | 少了 UTF-8 BOM | 先 `w.Write([]byte{0xEF,0xBB,0xBF})` |
| 下载下来是空文件 | `defer cw.Flush()` 在函数返回后才执行，但 `w` 早已结束 | `Flush()` 后显式 `cw.Error()`；不要在写完后 `return` 前才刷 |
| 金额显示 `35.5` | 用了 `%v` 或默认格式化 | `strconv.FormatFloat(v,'f',2,64)` |
| 浏览器直接打开而不是下载 | 少了 `Content-Disposition` | 补上，并注意 `filename*` 处理中文 |
| 表头是 `\xef\xbb\xbf日期` | BOM 写在 `csv.Writer` 之后，被当成数据 | BOM 必须在 `csv.NewWriter` 之前写 |

#### 5 分钟最小验证：用三种方式打开同一个文件
```bash
curl -s "localhost:8080/ledger/export?month=2026-10" -H "Authorization: Bearer $T" -o /tmp/out.csv
file /tmp/out.csv                      # 期望 "UTF-8 Unicode (with BOM) text"
head -c 3 /tmp/out.csv | xxd           # 期望 efbbbf
python3 -c "import csv;print(sum(1 for _ in csv.reader(open('/tmp/out.csv',encoding='utf-8-sig'))))"
```
第三条用 Python 数行数，顺便验证 CSV 结构没被备注里的逗号破坏——**如果行数比预期多，说明某列没被正确加引号**（`encoding/csv` 会自动处理，但你自己拼字符串时不会）。

::q CSV 为什么要加 UTF-8 BOM？
::a Windows 版 Excel 打开无 BOM 的 UTF-8 文件时会按本地编码（如 GBK）解析，中文列名变乱码。加 `\xEF\xBB\xBF` 后 Excel 能识别为 UTF-8。这是兼容性处理，其他工具也能正确忽略 BOM。
::q `csv.Writer.Flush()` 之后为什么还要检查错误？
::a `Write` 只是写入缓冲，真正的 I/O 错误在 `Flush` 时才暴露。不检查 `cw.Error()` 会在磁盘满、连接中断时误判为成功，用户下载到残缺文件。
::q 全量加载版在什么数据量下开始出问题？不改代码的话，用什么信号判断已经到边界了？
::a 内存占用大致是「行数 × 单行结构体大小 × 2」（查询结果一份、CSV 缓冲一份），再叠加 JSON/字符串拷贝。10 万行通常还能撑住（几十 MB），百万行会 OOM 或触发容器内存限制。不改代码也能判断：`curl -w 'ttfb=%{time_starttransfer}'` 看首字节时间——如果它随数据量线性增长，说明所有数据都读完了才开始写；`/usr/bin/time -v` 看 RSS 峰值。**TTFB 涨、吞吐不涨，就是「全量加载」的指纹。**

<!--day 23 | light-->
#### 流式导出：不要先把所有数据读进内存
```go
func (h *Handler) exportStream(w http.ResponseWriter, r *http.Request) error {
    w.Header().Set("Content-Type", "text/csv; charset=utf-8")
    w.Header().Set("Content-Disposition", `attachment; filename="ledger.csv"`)
    w.Write([]byte{0xEF, 0xBB, 0xBF})

    cw := csv.NewWriter(w)
    defer cw.Flush()
    cw.Write([]string{"日期", "分类", "金额(元)", "备注"})

    rows, err := h.db.QueryContext(r.Context(),
        `SELECT date, category, amount, note FROM entries WHERE user_id = ? ORDER BY date`, uid(r))
    if err != nil { return err }
    defer rows.Close()

    for rows.Next() {
        var date, cat, note string
        var amount int64
        if err := rows.Scan(&date, &cat, &amount, &note); err != nil { return err }
        cw.Write([]string{date, cat, fmt.Sprintf("%.2f", float64(amount)/100), note})
        cw.Flush()   // 定期刷出，避免客户端等太久
    }
    return rows.Err()
}
```
关键：**边读边写，内存占用与数据量无关**。缺点是一旦出错，响应头已经发出，无法改成 500——只能在 body 里中断连接。

#### 流式导出的代价
- 不能设置 `Content-Length`（长度未知）。
- 出错时无法改状态码。
- 需要处理客户端中途断开（`r.Context()` 被取消，`rows.Next()` 会失败）。

**只有数据量真的很大（十万行以上）才值得**。家庭账本一年几千条，全量加载完全够。这是典型的「知道怎么做，但不一定现在做」。

#### 半份文件的问题：三条可选方案
写到第 3000 行时数据库报错，头已经发出去了，`WriteHeader(500)` 不再有任何作用。用户会拿到一个「看起来完整」的 CSV，少了几百行，而且 Excel 不会报错——**这是最危险的失败方式**。

| 方案 | 做法 | 代价 |
| :--- | :--- | :--- |
| 写临时文件 | 全量写入 `os.CreateTemp`，成功后 `io.Copy` 到响应 | 磁盘换正确性；大文件占用双份空间 |
| 流式 + 尾标记 | 出错时往 body 追加 `# ERROR: ...` 一行，并已设 `X-Export-Status: partial` | 需要消费方配合识别，Excel 用户看不见 |
| 异步任务 | 先返回 202 + 任务 id，导完给下载链接 | 复杂度高，家庭账本没必要 |

家庭账本推荐第一种——数据量小，临时文件成本可忽略，而且「要么完整、要么没有」最符合用户预期：

```go
func (h *Handler) exportToFile(w http.ResponseWriter, r *http.Request, uid int64, month string) error {
    tmp, err := os.CreateTemp("", "ledger-*.csv")
    if err != nil { return err }
    defer os.Remove(tmp.Name())          // 无论成功失败都清掉
    defer tmp.Close()

    if err := h.writeCSV(r.Context(), tmp, uid, month); err != nil {
        // 这里还是「头没发」的状态，可以正常返回 500
        return fmt.Errorf("write csv: %w", err)
    }
    if _, err := tmp.Seek(0, io.SeekStart); err != nil { return err }

    w.Header().Set("Content-Type", "text/csv; charset=utf-8")
    w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="ledger-%s.csv"`, month))
    _, err = io.Copy(w, tmp)
    return err
}
```
**关键差别在「什么时候写响应头」**：先成功生成内容，再一次性发出，就重新获得了「可以返回 500」的能力。

#### 客户端断开：`r.Context()` 会告诉你
```go
for rows.Next() {
    select {
    case <-r.Context().Done():
        return r.Context().Err()     // 客户端关了页面，别继续查了
    default:
    }
    ...
}
```
不检查也能跑，但一个用户点了「取消下载」，服务端会继续把十万行查完、写完（写到已经断开的连接上，得到 `broken pipe`），白白占用数据库和 CPU。**流式接口必须检查 ctx**，这是它和普通接口最大的实现差异。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `http: superfluous response.WriteHeader call` | 先 `WriteHeader(200)` 后出错又想写 500 | 改成「先写临时文件」 |
| 客户端收到 `unexpected EOF` | 中途 `return` 没有 `Flush` | `defer cw.Flush()`，并在返回前查 `cw.Error()` |
| 下载到一半卡住不动 | 缓冲没刷出（默认 4KB） | 每 N 行 `cw.Flush()`；或 `http.NewResponseController(w).Flush()` |
| 内存仍然很高 | 用的是 `db.Find` 而不是 `rows` 逐行扫描 | 必须 `QueryContext` + `rows.Next()` |
| 日志里大量 `context canceled` | 客户端断开后仍在写 | 循环里检查 `r.Context().Done()` |

#### 5 分钟最小验证：两个数字证明它是流式的
```bash
# 造 5 万条数据后
curl -s -o /dev/null -w 'ttfb=%{time_starttransfer}s total=%{time_total}s\n' \
  "localhost:8080/ledger/export?month=2026-10" -H "Authorization: Bearer $T"
/usr/bin/time -l ./scripts/export.sh 2>&1 | grep -i 'maximum resident'
```
流式版的 `ttfb` 应该很小（首行很快就写出来了），`total` 随数据量增长；全量版的 `ttfb ≈ total`。**TTFB 远小于 total，就是流式的指纹**；两者接近，说明数据全读完了才开始写。

::q 流式导出为什么不能返回 500 错误页？
::a 因为响应头（200）和部分 body 已经发给客户端，HTTP 协议不允许中途修改状态码。此时只能中断连接让客户端感知下载不完整。要避免这种情况，可以在开始写之前先做一次「轻量预检」（如权限、参数校验）。
::q 什么时候流式导出才真的必要？
::a 数据量大到全量加载会占满内存时（几十万行以上），或者希望客户端「边下边处理」时。几千行数据全量加载只需几 MB，代码简单且能正常返回错误，反而更合适。
::q 流式导出写到一半数据库报错，响应头已经发出去了，怎么保证用户不会拿到半份 CSV？
::a 状态码已经改不了，只有三条路：① 先写到临时文件，全部成功后再 `io.Copy` 到响应（磁盘换正确性，家庭账本推荐）；② 保持流式，但在末尾追加一行 `# ERROR: ...`，并在响应头加 `X-Export-Status`，让前端/脚本能识别；③ 改成异步任务，导出完成后给下载链接。**不能选的是「什么都不做」**——半份 CSV 会被 Excel 当成完整文件打开，用户不会发现少了两个月的数据。

<!--day 24 | normal-->
#### 接口清单：给前端一份可执行的契约
| 方法 | 路径 | 认证 | 请求 | 响应 `data` |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/register` | 否 | `{email, password}` | `{id, email}` |
| POST | `/login` | 否 | `{email, password}` | `{token, expires_at}` |
| GET | `/ledger` | 是 | `?limit&offset&month` | `{items, total, limit, offset}` |
| POST | `/ledger` | 是 | `{amount, category, date, note}` | `{id}` |
| GET | `/ledger/{id}` | 是 | — | `Entry` |
| DELETE | `/ledger/{id}` | 是 | — | `{}` |
| GET | `/summary` | 是 | `?month` | `{month, total, by_category}` |
| GET | `/ledger/export` | 是 | `?month` | CSV |
| GET | `/healthz` | 否 | — | `{status}` |

写这份表的目的是**在写前端之前发现不一致**：字段名、金额单位（分还是元）、日期格式、分页语义。这些问题在联调时才暴露，返工成本高。

#### 三个必须在契约里写清楚的约定
1. **金额单位是「分」**（int64），前端负责除以 100 展示。
2. **日期是 `YYYY-MM-DD` 字符串**，不是时间戳。
3. **错误响应固定 `{code, message, request_id}`**，前端按 `code` 分支。

#### 联调前自测
用 `curl` 把上表每一行都打一次，保存到一个 `docs/api-examples.http` 文件里。前端可以直接拿去当例子，也方便你回归。

#### 跨域：先想清楚是「代理」还是「CORS」

前端跑在 `localhost:5173`，后端在 `localhost:8080`，浏览器会拦跨域请求。两条路，别同时用：

| 方案 | 做法 | 适用 | 代价 |
| :--- | :--- | :--- | :--- |
| Vite 代理 | `vite.config.ts` 里 `server.proxy['/api'] = 'http://localhost:8080'` | 本地开发 | 生产环境没有 Vite，必须靠网关 |
| 服务端 CORS | 后端返回 `Access-Control-Allow-Origin` 等头 | 前后端分域部署 | 要处理预检、cookie、白名单 |

本地开发推荐代理——它让前端代码里只写 `/api/ledger`，不写死域名。生产环境由 Nginx 或 Caddy 做同源反代，也就不需要 CORS。**只有「前端静态托管在另一个域、后端单独暴露」时才真的需要 CORS。**

如果确实要开 CORS，最小实现（注意 `OPTIONS` 预检必须单独放行）：

```go
func withCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // 不要写 *
        w.Header().Set("Access-Control-Allow-Credentials", "true")             // 带 cookie 时必需
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)   // 预检直接返回 204，不进业务 handler
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

三个坑：`Allow-Origin: *` 与 `Allow-Credentials: true` **不能同时用**（浏览器直接拒绝）；预检请求不带 `Authorization`，所以 CORS 中间件必须排在认证**之前**；`OPTIONS` 不返回 204 会让预检失败，表现为「GET 能通，POST 报跨域」。

#### 种子数据：让前端一打开就有东西看

前端最怕拿到一个空列表，没法验证渲染。给一份可重复执行的种子脚本：

```sql
-- scripts/seed.sql，可反复执行（先删后插，仅限本地）
DELETE FROM entries WHERE user_id IN (1, 2);
DELETE FROM users WHERE id IN (1, 2);

INSERT INTO users (id, email, password_hash, created_at) VALUES
  (1, 'a@example.com', '<本地用哈希>', '2026-10-01'),
  (2, 'b@example.com', '<本地用哈希>', '2026-10-01');

INSERT INTO entries (user_id, amount, category, date, note) VALUES
  (1, 3550, '餐饮', '2026-10-19', '午饭'),
  (1, 1200, '交通', '2026-10-19', '地铁'),
  (1, 8800, '日用', '2026-10-18', '纸巾');
```

```bash
sqlite3 ledger.db < scripts/seed.sql
sqlite3 ledger.db "select user_id, count(*), sum(amount) from entries group by user_id"
```

**种子数据要覆盖边界**：一个用户有数据、一个没有（验证空状态）、一条金额为 0（验证 `COALESCE` 与百分比除零）、一条跨月（验证月份筛选）。

#### `.http` 文件长什么样

VS Code 装 REST Client 插件就能直接点「Send Request」，比手敲 curl 快：

```http
@base = http://localhost:8080/api/v1
@token = 粘贴登录拿到的 token

### 创建
POST {{base}}/ledger
Content-Type: application/json
Authorization: Bearer {{token}}

{"amount_cents": 3550, "category": "餐饮", "date": "2026-10-19"}

### 列表
GET {{base}}/ledger?limit=20&offset=0
Authorization: Bearer {{token}}

### 越权测试（用 B 的 token 读 A 的 id）
GET {{base}}/ledger/1
Authorization: Bearer {{token_b}}
```

把「越权测试」也写进文件，联调时顺手就能验一遍数据隔离有没有漏。

#### 5 分钟最小验证：清单和实现有没有漂

```bash
# 对着清单逐行打，把真实响应贴回文档
curl -s localhost:8080/api/v1/healthz | jq .
curl -s -X POST localhost:8080/api/v1/register -H 'Content-Type: application/json' \
  -d '{"email":"t@x.com","password":"correct horse battery"}' | jq .
```

判据只有一个：**文档里写的字段名、单位、分页语义，和真实响应逐字一致**。只要有对不上的，今天就没完成——联调时它会变成两小时的排查。

::q 为什么金额在接口层用「分」而不是「元」的浮点数？
::a 浮点数有精度问题，接口层传 `35.5` 再转分可能得到 3549 或 3551。统一用整数分，传输无精度损失，前后端都不用猜。展示层再除以 100。
::q 接口清单在联调前写，能避免什么返工？
::a 字段名不一致、单位不一致（分/元）、分页语义不一致（total 是总数还是剩余）、错误码不一致。这些问题在联调时才暴露，往往要同时改前后端，成本最高。
::q 本地开发用 Vite 代理、生产用 Nginx 反代，都是同源，那什么时候才真的需要 CORS？开了 CORS 之后为什么 `OPTIONS` 请求必须单独返回 204？
::a 只有「前端静态资源与 API 部署在不同域名（或不同端口且没有反代）」时才需要 CORS，比如前端放 CDN、API 放独立域名。`OPTIONS` 是浏览器的**预检请求**：它不带 `Authorization`、不带 body，只问「我能不能发这个跨域请求」。如果让它进业务 handler，通常会被认证中间件拦成 401，浏览器看到预检失败就直接放弃真实请求，表现为「POST 全部跨域失败、GET 却正常」。所以 CORS 中间件要排在认证之前，并对 `OPTIONS` 直接 204。

<!--day 25 | normal-->
#### 端到端回归：从注册到导出走一遍
```bash
#!/usr/bin/env bash
set -euo pipefail
BASE=http://localhost:8080
J='Content-Type: application/json'

# 1. 注册 + 登录
curl -fsS -X POST $BASE/register -H "$J" -d '{"email":"e2e@x.com","password":"correct horse battery"}' >/dev/null
TOKEN=$(curl -fsS -X POST $BASE/login -H "$J" -d '{"email":"e2e@x.com","password":"correct horse battery"}' | jq -r '.data.token')

# 2. 建分类（如有）
# 3. 记三笔
for a in 3550 1200 800; do
  curl -fsS -X POST $BASE/ledger -H "$J" -H "Authorization: Bearer $TOKEN" \
    -d "{\"amount\":$a,\"category\":\"餐饮\",\"date\":\"2026-10-19\"}" >/dev/null
done

# 4. 列表 / 分页
TOTAL=$(curl -fsS "$BASE/ledger?limit=2" -H "Authorization: Bearer $TOKEN" | jq '.data.total')
[ "$TOTAL" = "3" ] || { echo "total 错: $TOTAL"; exit 1; }

# 5. 统计
SUM=$(curl -fsS "$BASE/summary?month=2026-10" -H "Authorization: Bearer $TOKEN" | jq '.data.total')
[ "$SUM" = "5550" ] || { echo "sum 错: $SUM"; exit 1; }

# 6. 导出
curl -fsS "$BASE/ledger/export?month=2026-10" -H "Authorization: Bearer $TOKEN" -o /tmp/e2e.csv
grep -q "餐饮" /tmp/e2e.csv || { echo "CSV 内容异常"; exit 1; }

echo "E2E OK"
```

#### 这个脚本最重要的价值
它把「阶段四的认证 + 阶段五的 GORM/统计/导出 + 阶段三的中间件」串成一条链。**任何一处改错，它都会立刻红。** 每次重构后跑一遍，比人肉点页面可靠。

#### 脚本要能自己造数据、自己清理
```bash
EMAIL="e2e-$(date +%s)@x.com"      # 每次用新邮箱，避免唯一约束冲突
trap 'rm -f /tmp/e2e.csv' EXIT     # 退出时清理
```
固定邮箱会让脚本第二次运行就失败（409 EMAIL_TAKEN）。有人于是把它改成「注册失败也继续」，脚本就再也测不出注册问题——**用时间戳生成唯一账号**是标准做法。

#### 断言要具体到值，不要只断言状态码
```bash
SUM=$(curl -fsS "$BASE/summary?month=2026-10" -H "Authorization: Bearer $TOKEN" | jq '.data.total')
[ "$SUM" = "5550" ] || { echo "sum 错: 期望 5550 实际 $SUM"; exit 1; }
```
只断言「HTTP 200」的脚本，在统计逻辑算错时依然是绿的。**数值断言才是真正的回归保护。**

#### 加一个并发用例：这是 SQLite 项目最该测的
```bash
for i in 1 2 3 4 5 6 7 8 9 10; do
  curl -fsS -X POST $BASE/ledger -H "$J" -H "Authorization: Bearer $TOKEN" \
    -d '{"amount":100,"category":"并发","date":"2026-10-19"}' &
done
wait
COUNT=$(sqlite3 data/ledger.db "select count(*) from entries where category='并发';")
[ "$COUNT" = "10" ] || { echo "并发写入丢了: $COUNT"; exit 1; }
```
三个观察点：**不能有 `database is locked`；最终条数必须是 10；`id` 不能重复**。单连接 + `busy_timeout` 的正确配置下，这里应当稳定通过；失败了就回去看阶段五 D4 的连接池配置——**这是「配置对不对」最直接的证据**。

注意 `wait` 不能省，否则 `COUNT` 会在请求还没写完时就执行，你测到的是「脚本太快」而不是「服务有问题」。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 第二次运行就 409 | 邮箱写死了 | `e2e-$(date +%s)@x.com` |
| 脚本在中途静默退出 | `set -e` + `curl` 返回非 0（404/500） | 这是**正确**行为；想看具体错误就临时去掉 `-s` 加 `-i` |
| `jq: error (at <stdin>:1): Cannot index string with "data"` | 接口返回的是错误信封，`data` 不存在 | 先 `echo` 出原始 body 再调 jq |
| `total` 断言失败但页面看着正常 | 之前跑的数据没清，累加了 | 用时间戳账号 + 固定 `month`，或每次跑前重置库 |
| 并发用例偶发失败 | `busy_timeout` 没设，或 `MaxOpenConns` > 1 | 见 D4：`MaxOpenConns(1)` + `busy_timeout(5000)` |

#### 5 分钟最小验证：让脚本在正确的地方红
```bash
./scripts/e2e.sh; echo "exit=$?"
# 期望 exit=0
# 再把 summary 的月份参数改错一个月，重跑
# 期望 exit=1 且打印 "sum 错: 期望 5550 实际 0"
```
**只跑通过一次不算验证过**——必须见过它因为一个真实错误而失败，并且错误信息能直接指向问题。做不到这一点的脚本，出问题时会变成「又一个需要调试的东西」。

#### 判据
脚本退出码为 0；把某条 SQL 的 `user_id` 条件删掉，脚本应当仍通过（因为只有单个用户）——所以**还要单独跑隔离测试**，两者互补。

::q 为什么端到端脚本仍不能替代数据隔离测试？
::a E2E 通常只用一个用户，无法发现「漏了 user_id 条件」的问题。隔离测试需要两个用户交叉读写，专门验证越权。两类测试覆盖不同风险，缺一不可。
::q 这类脚本应该多久跑一次？
::a 每次改动共享代码后、每次提交前跑一次，CI 里也跑。它耗时几秒，能挡住绝大多数「改了 A 坏了 B」的回归，性价比极高。
::q e2e 用例为什么必须用时间戳造唯一邮箱？固定邮箱会第几次失败、报什么？
::a 第二次就失败：`409 EMAIL_TAKEN`（唯一约束）。更糟的是它的表现像「注册接口坏了」，会把排查方向带偏。所以每条 e2e 用 `e2e-$(date +%s%N)@x.com` 或 `$RANDOM` 造唯一值；金额、日期同理，避免「第二次跑就 offset 变了」这类假失败。**可重复运行是回归脚本的第一属性，比覆盖多少接口更重要。**

<!--day 26 | light-->
#### 阶段验收（逐条执行，不靠感觉）
```bash
go test ./... -race -count=1        # 全绿
goose -dir migrations sqlite3 ledger.db up
./scripts/e2e.sh                     # OK
grep -r "WithContext(" internal/     # 应只在少数必要处，且配合 NewDB
grep -rn "Session(&gorm.Session{NewDB: true, Context: ctx})" internal/store | wc -l   # 每个方法都有
```

验收不是「跑一遍看着没问题」，而是**每一条都有明确的通过标准**。把它们写成一张表，逐条打勾：

| 项 | 命令 | 通过标准 |
| :--- | :--- | :--- |
| 单测 + 竞态 | `go test ./... -race -count=1` | 全绿，无 `DATA RACE` |
| 迁移可回滚 | `goose down` 再 `goose up` | 两次都成功，`.tables` 一致 |
| 端到端 | `./scripts/e2e.sh` | 退出码 0，且数值断言通过 |
| 数据隔离 | 双用户测试 | B 读 A 的数据得 404 |
| 会话隔离 | 连续两次查询 | 第二次不会带上第一次的 `Where` |
| 抽象完整 | 换内存实现 | `go build` 通过，Service 未改 |

最后一条是整个阶段五的「总考」：**如果换存储实现需要改 Service，那么这个阶段的核心目标（可替换的存储层）就没达成**——不管测试多绿。

`scripts/e2e.sh` 里没有魔法，就是 `curl` + `jq` 串起来的断言，核心四行长这样：

```bash
#!/usr/bin/env bash
set -euo pipefail
B=http://localhost:8080
T=$(curl -s -X POST $B/login -d '{"email":"a@x.com","password":"pass1234"}' | jq -r .data.token)
ID=$(curl -s -X POST $B/entries -H "Authorization: Bearer $T" \
     -d '{"amount_cents":3550,"category":"food","date":"2026-10-19"}' | jq -r .data.id)
curl -s "$B/summary?month=2026-10" -H "Authorization: Bearer $T" | jq -e '.data.total == 3550'
curl -s -o /dev/null -w '%{http_code}' $B/entries/$ID -H "Authorization: Bearer $OTHER"  # 期望 404
```

`jq -e` 是关键：断言为假时它退出码非 0，`set -e` 会让脚本立刻失败。用 `jq '.data.total' | grep` 那种写法在数值对不上时**不会**让脚本红，这是「脚本绿但功能坏」的常见来路。

#### 复盘：阶段五真正的三个收获
1. **懂了 `Session{NewDB, Context}` 为什么必须成对出现**——一个管条件隔离，一个管取消传播，缺一个就有隐患。
2. **懂了错误分层**：store 用 `%w` 保链，Service 翻译成语义，HTTP 层映射状态码。
3. **懂了测试的分工**：Service 用 fake 测规则，Repository 用内存库测 SQL，Handler 用 httptest 测契约，E2E 测串联。

#### 最后做一次「换实现」演习（30 分钟）
不用真写第二个数据库，只要写一个**内存版 Repository**，然后在 `main` 里换掉：

```go
type memStore struct{ mu sync.RWMutex; entries []ledger.Entry }

func (m *memStore) CreateEntry(ctx context.Context, e ledger.Entry) (int64, error) {
    m.mu.Lock(); defer m.mu.Unlock()
    e.ID = int64(len(m.entries) + 1)
    m.entries = append(m.entries, e)
    return e.ID, nil
}
// 其余方法同理，只要满足 ledger.Store
```
```bash
var _ ledger.Store = (*memStore)(nil)   // 编译期确认
go build ./...                          # 然后只改 main 里一行
```
如果 `go build` 失败，报错会精确告诉你「哪个方法签名不匹配」——这就是抽象在替你干活。**如果 Service 一行都不用改就编过了，说明阶段五的分层是真的**；如果需要改 Service，回去看接口设计，不要改 Service 去迁就实现。

#### 必须能回答的三个问题（答不出就是没学透）
- `WithContext` 和 `Session{NewDB:true, Context:ctx}` 的差别具体在哪一步？
- 为什么事务内不能再调 `r.session(ctx)`？
- 为什么 `Updates(Entry{Amount:0})` 不生效？

::q 阶段五结束时，最容易被忽略但最危险的一个隐患是什么？
::a 某条 SQL 漏了 `user_id`。它不会报错、不会崩溃，功能测试也全绿，但在多用户场景下就是越权。唯一可靠的防线是专门的隔离测试 + 代码审查时逐条检查 WHERE。
::q 为什么说 `NewDB` 和 `Context` 必须成对？
::a `NewDB` 解决链式条件污染（防止越权/查错数据），`Context` 解决取消与超时传播（防止连接被慢查询占死）。只做前者会失去取消能力，只做后者会留下条件残留。
::q 阶段验收里哪一项最容易暴露「抽象漏了」？看到什么信号就该回头改设计？
::a 「换掉存储实现，handler 与 Service 一行都不用改」。如果出现下面任一信号，说明抽象漏了：Service 里出现 `if isSQLite` / `if isMemory` 分支；内存实现必须模拟 SQLite 特有行为（如 `LIKE` 大小写、自增 ID 回填）；handler 里能 import 到 `store` 包的类型。**抽象漏了的典型症状是「上层为了兼容下层而写分支」**，这时改上层没用，要回去改接口。

