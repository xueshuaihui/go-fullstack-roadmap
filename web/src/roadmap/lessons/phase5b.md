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

::q `WHERE substr(date,1,7) = '2026-10'` 为什么用不上索引？
::a 索引存的是列的原始值，一旦对列施加函数（`substr`/`date()`/`upper`），数据库必须对每一行计算函数值才能比较，无法利用索引的有序性，只能全表扫描。应改成对列直接做范围或前缀比较。
::q 复合索引 `(user_id, date)` 能被 `WHERE date = ?` 用上吗？
::a 不能。复合索引只能被「最左前缀」利用，单独用 `date` 查询缺少 `user_id` 这一前置列，无法定位。要支持这种查询需要单独为 `date` 建索引，或调整复合索引顺序。
::q 索引过多会带来什么具体代价？
::a 每次写入都要同步更新所有相关索引，降低插入/更新吞吐；占用额外磁盘；优化器选择空间变大，可能选错索引导致查询变慢。应按实际查询模式精简。

<!--day 15 | core-->
#### 错误处理中间件：把「错误→HTTP」的映射收敛到一处
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

#### 判据
```bash
go test ./internal/httpapi -v
# 六个用例全绿；把认证中间件注释掉，401 用例必须变红
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

::q 超预算时应该拒绝写入还是返回标志？
::a 返回标志。账目是既成事实，拒绝写入会导致数据不完整，用户还得先改预算才能记账。预算的作用是提醒而非限制，除非产品明确要求「硬性拦截」。
::q 预算唯一键为什么要包含 `month` 和 `category`？
::a 因为预算是「某用户某月某分类的限额」。缺少 `month` 会导致设置一次后永久生效，无法按月调整；缺少 `category` 则无法分类控制。

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

::q CSV 为什么要加 UTF-8 BOM？
::a Windows 版 Excel 打开无 BOM 的 UTF-8 文件时会按本地编码（如 GBK）解析，中文列名变乱码。加 `\xEF\xBB\xBF` 后 Excel 能识别为 UTF-8。这是兼容性处理，其他工具也能正确忽略 BOM。
::q `csv.Writer.Flush()` 之后为什么还要检查错误？
::a `Write` 只是写入缓冲，真正的 I/O 错误在 `Flush` 时才暴露。不检查 `cw.Error()` 会在磁盘满、连接中断时误判为成功，用户下载到残缺文件。

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

::q 流式导出为什么不能返回 500 错误页？
::a 因为响应头（200）和部分 body 已经发给客户端，HTTP 协议不允许中途修改状态码。此时只能中断连接让客户端感知下载不完整。要避免这种情况，可以在开始写之前先做一次「轻量预检」（如权限、参数校验）。
::q 什么时候流式导出才真的必要？
::a 数据量大到全量加载会占满内存时（几十万行以上），或者希望客户端「边下边处理」时。几千行数据全量加载只需几 MB，代码简单且能正常返回错误，反而更合适。

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

::q 为什么金额在接口层用「分」而不是「元」的浮点数？
::a 浮点数有精度问题，接口层传 `35.5` 再转分可能得到 3549 或 3551。统一用整数分，传输无精度损失，前后端都不用猜。展示层再除以 100。
::q 接口清单在联调前写，能避免什么返工？
::a 字段名不一致、单位不一致（分/元）、分页语义不一致（total 是总数还是剩余）、错误码不一致。这些问题在联调时才暴露，往往要同时改前后端，成本最高。

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

#### 判据
脚本退出码为 0；把某条 SQL 的 `user_id` 条件删掉，脚本应当仍通过（因为只有单个用户）——所以**还要单独跑隔离测试**，两者互补。

::q 为什么端到端脚本仍不能替代数据隔离测试？
::a E2E 通常只用一个用户，无法发现「漏了 user_id 条件」的问题。隔离测试需要两个用户交叉读写，专门验证越权。两类测试覆盖不同风险，缺一不可。
::q 这类脚本应该多久跑一次？
::a 每次改动共享代码后、每次提交前跑一次，CI 里也跑。它耗时几秒，能挡住绝大多数「改了 A 坏了 B」的回归，性价比极高。

<!--day 26 | light-->
#### 阶段验收（逐条执行，不靠感觉）
```bash
go test ./... -race -count=1        # 全绿
goose -dir migrations sqlite3 ledger.db up
./scripts/e2e.sh                     # OK
grep -r "WithContext(" internal/     # 应只在少数必要处，且配合 NewDB
grep -rn "Session(&gorm.Session{NewDB: true, Context: ctx})" internal/store | wc -l   # 每个方法都有
```

#### 复盘：阶段五真正的三个收获
1. **懂了 `Session{NewDB, Context}` 为什么必须成对出现**——一个管条件隔离，一个管取消传播，缺一个就有隐患。
2. **懂了错误分层**：store 用 `%w` 保链，Service 翻译成语义，HTTP 层映射状态码。
3. **懂了测试的分工**：Service 用 fake 测规则，Repository 用内存库测 SQL，Handler 用 httptest 测契约，E2E 测串联。

#### 必须能回答的三个问题（答不出就是没学透）
- `WithContext` 和 `Session{NewDB:true, Context:ctx}` 的差别具体在哪一步？
- 为什么事务内不能再调 `r.session(ctx)`？
- 为什么 `Updates(Entry{Amount:0})` 不生效？

::q 阶段五结束时，最容易被忽略但最危险的一个隐患是什么？
::a 某条 SQL 漏了 `user_id`。它不会报错、不会崩溃，功能测试也全绿，但在多用户场景下就是越权。唯一可靠的防线是专门的隔离测试 + 代码审查时逐条检查 WHERE。
::q 为什么说 `NewDB` 和 `Context` 必须成对？
::a `NewDB` 解决链式条件污染（防止越权/查错数据），`Context` 解决取消与超时传播（防止连接被慢查询占死）。只做前者会失去取消能力，只做后者会留下条件残留。
