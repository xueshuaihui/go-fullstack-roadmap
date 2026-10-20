<!--day 1 | normal-->
#### 分层的目的是「改动只影响一层」
```
internal/
├── httpapi/     传输层：解析请求、写响应
├── ledger/      领域层：业务规则 + 接口定义
└── store/       存储层：SQL / GORM
```
依赖方向单向：`httpapi → ledger ← store`。注意 `store` 是**指向** `ledger`（实现它的接口），两者不互相依赖。

判断分层是否成立的三个问题：
1. 改 HTTP 状态码，需要动 SQL 吗？
2. 换数据库，需要动 handler 吗？
3. 写业务测试，需要起 HTTP 服务吗？

三个都「不需要」才算分对了。有一个「需要」，说明边界漏了。

#### 每层该放什么、不该放什么
| 层 | 该放 | 不该放 |
| :--- | :--- | :--- |
| httpapi | JSON 编解码、状态码、中间件 | 金额校验规则、SQL |
| ledger | 业务规则、事务边界、接口定义 | `net/http`、`gorm` |
| store | SQL、GORM 调用、行→结构体 | 业务判断、错误文案 |

**领域层不知道 HTTP 存在，也不知道 GORM 存在。** 这条守住了，前面说的三个问题才能都答「不需要」。

#### 一次请求穿过三层长什么样
以「查本月总额」为例，看每层各自只做一件事：

```go
// ① httpapi：只负责 HTTP
func (h *Handler) summary(w http.ResponseWriter, r *http.Request) {
    uid, ok := userIDFrom(r.Context())
    if !ok { Fail(w, 401, "UNAUTHORIZED", "no user"); return }
    month := r.URL.Query().Get("month")
    if month != "" && !validMonth(month) {
        Fail(w, 400, "INVALID_ARGUMENT", "month 格式应为 YYYY-MM"); return
    }
    data, err := h.svc.Summary(r.Context(), uid, month)   // 只调一次
    if err != nil { writeError(w, err); return }
    OK(w, data)
}

// ② ledger：只负责业务规则
func (s *Service) Summary(ctx context.Context, uid int64, month string) (Summary, error) {
    if month == "" { month = time.Now().Format("2006-01") }
    sums, err := s.store.SumByCategory(ctx, uid, month)
    if err != nil { return Summary{}, fmt.Errorf("summary: %w", err) }
    var total int64
    for _, x := range sums { total += x.Amount }
    return Summary{Month: month, Total: total, Items: sums}, nil
}

// ③ store：只负责 SQL
func (s *Gorm) SumByCategory(ctx context.Context, uid int64, month string) ([]ledger.CategorySum, error) {
    var out []ledger.CategorySum
    err := s.db.WithContext(ctx).Model(&Entry{}).
        Select("category, SUM(amount) AS amount").
        Where("user_id = ? AND date >= ? AND date < ?", uid, month+"-01", nextMonth(month)).
        Group("category").Scan(&out).Error
    return out, err
}
```
注意三层的 `month` 处理各司其职：httpapi 只校验格式，ledger 负责「空就用当前月」，store 只把月份翻译成 SQL 条件。「**默认值**」属于业务规则，写在 ledger；「格式」属于输入校验，写在 httpapi。 混在一起时，换个入口（CLI）就会缺默认值。

#### 常见的错误分层
- `models` 包被三层共用，里面既有 `gorm` tag 又有 `json` tag——领域对象被两个外部协议污染，最后必然冲突（比如 `json:"-"` 的密码字段又要存库）。
- Service 接收 `*http.Request`——领域层依赖传输层，彻底倒挂。
- store 里写业务规则（比如「金额必须为正」）——换个入口就绕过了。

#### 判据
```bash
go list -deps ./internal/ledger | grep -E "net/http|gorm.io"   # 必须为空
```
这条命令是分层的自动检测。有输出就说明领域层被污染。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `import cycle not allowed` | 三层互相引用（handler 里 import store，store 里 import handler） | 只允许 handler → service → repository，反向一律禁止 |
| `undefined: ledger.Entry` | 领域类型定义在 `model` 包里，而 `model` 又 import 了 `ledger` | 领域类型只放在 `ledger`，`model` 只放 DB 结构体（如果确实需要两套） |
| `go list` 检查有输出但「只是测试文件引用了」 | `_test.go` 里 import 了 gorm | 测试也要守边界；需要真的数据库时用 `-tags=integration` 隔离 |
| 改一个字段要动 4 个文件 | 没有 DTO，DB 结构体直接被三层共用 | 传输层用自己的请求/响应结构体，别把 `gorm` tag 带到 JSON 里 |

#### 5 分钟最小验证：用一条命令画出依赖图
```bash
go list -f '{{.ImportPath}} -> {{join .Imports " "}}' ./internal/... | grep -E 'internal/(httpapi|ledger|store)'
```
输出应该长这样（顺序可能不同）：

```
.../internal/httpapi -> .../internal/ledger ...
.../internal/store   -> .../internal/ledger ...
.../internal/ledger  -> context errors fmt time      ← 没有任何 internal 包
```
看两件事：`ledger` 那行**不出现任何 internal 包**；`httpapi` 那行不出现 `store`。这两条成立，分层就是干净的。**依赖图比目录树可信**——目录可以是空的，引用才是真的。

::q 为什么领域层不能导入 `net/http`？
::a 领域逻辑应该能被 HTTP、CLI、定时任务等多种入口复用。导入 `net/http` 意味着规则和传输协议绑定，换入口要复制逻辑，也无法脱离 HTTP 单测。领域层只接受普通参数、返回普通错误。
::q `go list -deps` 检查依赖能发现什么？
::a 能发现「不该有的依赖」，比如领域层导入了 gorm 或 net/http。它把「分层」这条口头约定变成可执行检查，防止重构时悄悄越过边界。
::q 为什么 `models` 大包共用是坏味道？
::a 一个结构体同时被 HTTP 序列化、数据库映射、业务逻辑使用，任何一方的需求都会污染其他方：给 JSON 加字段会影响建表，改 tag 会影响 API 契约。最终只能靠互相妥协，字段越来越乱。按用途拆成 DTO / 领域对象 / 持久化模型，转换显式化。

<!--day 2 | core-->
#### 接口定义在领域层，实现留在存储层
```go
// internal/ledger/store.go
package ledger

import "context"

type Store interface {
    CreateEntry(ctx context.Context, e Entry) (int64, error)
    GetEntry(ctx context.Context, userID, id int64) (Entry, error)
    ListEntries(ctx context.Context, q ListQuery) ([]Entry, int64, error)
    SumByCategory(ctx context.Context, userID int64, month string) ([]CategorySum, error)
    CreateUser(ctx context.Context, email, hash string) (int64, error)
    FindUserByEmail(ctx context.Context, email string) (User, error)
}
```
注意 `GetEntry` 的参数里有 `userID`——**数据隔离是接口契约的一部分**，不是实现细节。这样写不出来「忘了带 user_id」的查询。

#### 手动依赖注入：main 就是接线图
```go
func main() {
    cfg := config.MustLoad()
    db := store.MustOpen(cfg.DBPath)
    defer db.Close()

    st := store.NewGorm(db)
    svc := ledger.NewService(st, cfg.JWTSecret)
    h := httpapi.NewRouter(svc, cfg)

    srv := &http.Server{Addr: cfg.Addr, Handler: h}
    ...
}
```
四行，依赖关系一眼看完。**不需要 DI 框架**——Go 项目里手动注入就是主流做法，因为显式、可读、编译期检查。

#### 什么时候该抽接口，什么时候不该
- **该抽**：跨进程/跨存储的边界（数据库、外部 API、时钟、随机数）。这些是测试难点。
- **不该抽**：纯函数、同包内的辅助逻辑。为它们造接口只会增加噪音。

判据：**这个依赖在测试时需要替换吗？** 需要就抽接口，不需要就别抽。

#### 为什么不用 DI 框架
`wire`、`dig`、`fx` 都能做依赖注入，但对一个 6 个文件的家庭账本来说，它们带来的第一个问题是「**值从哪来的**」变得不可见：报错信息是运行时的 `cannot resolve *store.Gorm`，而手写接线报错是编译期的 `undefined: st`。

什么时候值得上框架？依赖超过 30 个、或者需要按环境切换整套实现时。到那时你会自然感觉到「main 太长了」，再换也不迟。**先手写，长到痛再抽——这是 Go 社区的主流路径，不是偷懒。**

#### 手写 DI 最容易犯的错：顺序和重复
```go
// ❌ 顺序错：用了还没创建的 st
svc := ledger.NewService(st, cfg.JWTSecret)
st := store.NewGorm(db)

// ❌ 重复创建：两处 NewGorm 会开两个连接池
st1 := store.NewGorm(db)
st2 := store.NewGorm(db)
```
顺序错会编译失败（好事）；重复创建不报错，但两个连接池各自持有 SQLite 连接，写操作会互相等锁，表现为「偶发 `database is locked`」。**一个进程里，每个依赖只 `New` 一次**，这是接线图要遵守的唯一纪律。

#### 判据
```go
// main 里加一行编译期断言
var _ ledger.Store = (*store.Gorm)(nil)
```
再写一个假实现，确认 `ledger.NewService(fake)` 能编译通过——说明 Service 真的只依赖接口。

假实现的写法有个技巧：**先只实现一个方法，让编译错误替你列出所有没实现的方法**。

```go
// internal/ledger/fake_test.go
type fakeStore struct{ entries []Entry }

func (f *fakeStore) CreateEntry(ctx context.Context, e Entry) (int64, error) {
    f.entries = append(f.entries, e)
    return int64(len(f.entries)), nil
}

// 其余方法先不写，编译一次，报错会逐个列出缺哪个
var _ Store = (*fakeStore)(nil)
```
第一次 `go build ./...` 会报 `*fakeStore does not implement ledger.Store (missing method GetEntry)`，改完再报下一个。**这比对着接口文件手抄六个方法签名可靠得多**，也不会漏。

```bash
go build ./... && go vet ./...
go test ./internal/ledger -run TestNothing -count=1   # 只为确认包能编译
```

::q 为什么 `GetEntry` 的参数里要显式包含 `userID`？
::a 让数据隔离成为接口契约的一部分。实现方拿不到 userID 就没法正确过滤，写错会编译失败；调用方也无法「忘记传」。把安全条件放进类型签名，比靠注释提醒可靠得多。
::q 什么情况下不该为某个依赖抽接口？
::a 测试时不需要替换的依赖不必抽。比如纯计算函数、标准库的时间格式化，抽接口只会增加一层间接和 mock 维护成本，收益为零。判断标准就是「测试需不需要替换它」。
::q 手写依赖注入相比 DI 框架的优势是什么？
::a 依赖关系全部显式写在 main 里，能被 grep、能被编译器检查，出问题一眼看到；框架靠反射和标签，出错时报错位置远离原因，学习与调试成本高。Go 项目规模通常不需要框架。

<!--day 3 | normal-->
#### 重构顺序：先建新壳，再搬逻辑，最后删旧的
1. 新建 `internal/ledger`，定义 `Entry`、`Store` 接口、`Service`。
2. 把 handler 里的校验逻辑搬进 `Service`（一次只搬一个方法）。
3. 新建 `internal/store`，用 GORM 或原生 SQL 实现接口。
4. `main` 改成装配新结构。
5. 每搬完一个方法就跑一次 smoke 脚本。

**不要一次性重写全部**。重构的核心是「每一步都可运行、可回滚」，一次性重写等于赌博。

#### 每步都要有的保护
```bash
./scripts/smoke.sh      # 阶段三 D17 写的脚本
go test ./...           # 已有的测试
```
如果 smoke 挂了，立刻回到上一步，不要「先往下做，最后一起修」——那时的错误已经不在原地了。

#### 搬运顺序：从「最独立」的方法开始
先搬 `Create`（只依赖 store 的一个方法，没有分支），再搬 `List`（带分页参数），最后搬 `Update`/`Delete`（要处理 `RowsAffected`）。**每搬一个就跑一次 smoke**，不要攒着。

判断某个 handler 是否搬干净了，看三件事：
```bash
grep -n "sql\.\|db\.Query\|db\.Exec" internal/httpapi/    # 应为空
grep -n "http\." internal/ledger/                          # 应为空
grep -n "fmt.Sprintf("SELECT" -r internal/                 # 应为空（防拼接）
```

#### 重构中最容易出现的「隐性行为变化」
- **错误语义变了**：原来 handler 里 `if err != nil { 500 }`，搬到 Service 后忘了把 `sql.ErrNoRows` 转成 `ErrNotFound`，于是「不存在」从 404 变成了 500。
- **顺序变了**：原来先校验再查库，现在先查库再校验，多了一次无谓查询，还可能把「不存在」的错误提前暴露。
- **默认值变了**：原来 handler 里 `limit` 缺省 20，搬到 Service 后没设默认，变成 0 → 返回空列表。

这三类都不会导致编译失败，只能靠 smoke 和断言测试抓。**这也是为什么重构前必须先写验收脚本。**

#### 判据
重构完成后：
```bash
git diff --stat        # 看清改了哪些文件
./scripts/smoke.sh     # 全过
```
并且 `httpapi` 包里**不再出现任何 SQL 字符串**（`grep -r "SELECT" internal/httpapi` 应为空）。

::q 为什么重构要「一次搬一个方法」而不是整体重写？
::a 整体重写无法定位问题来源，一旦行为不一致，你面对的是几百行新代码而不是一处改动。逐步搬迁每步都能跑 smoke，出错时原因就在刚刚那一步，回滚成本也低。
::q 重构过程中 smoke 脚本挂了，应该先继续还是先修？
::a 必须先修。带着已知失败继续往下走，后续改动会叠加在错误状态上，最终无法判断是哪一步引入的问题。重构的前提是每一步都可运行。
::q 搬到一半 `smoke.sh` 红了，怎么在十分钟内定位是哪一步引入的？
::a 按「每搬一个方法 → 跑一次 smoke → 绿了才提交」的节奏走，红了就是**最后一次提交**的问题，`git stash` 或 `git checkout` 回上一个绿的提交对比即可。如果没按这个节奏，就先看 smoke 报的是哪一条：404 变 500 → 错误没转译（`ErrNoRows` 漏了）；字段缺失 → DTO 少映射；条数不对 → 默认值（`limit` 从 20 变 0）。**报错位置比报错内容更快指向层。**

<!--day 4 | core-->
#### 接入 GORM 前必须做的三件事
```go
db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{
    Logger: gormlogger.Default.LogMode(gormlogger.Warn),  // 生产只记慢查询和错误
    NowFunc: func() time.Time { return time.Now().UTC() }, // 时间统一 UTC
})
```
1. **日志级别**：开发用 `Info` 看 SQL，生产必须降到 `Warn`。`Info` 会把每条 SQL 打进日志，既慢又泄漏数据。
2. **时间统一 UTC**：`NowFunc` 固定时区，避免服务器时区变化导致 `created_at` 混乱。
3. **底层 `*sql.DB` 要单独配置**：
```go
sqlDB, err := db.DB()
sqlDB.SetMaxOpenConns(1)
sqlDB.SetMaxIdleConns(1)
sqlDB.SetConnMaxLifetime(0)
```
**GORM 的连接池就是你配的这个 `*sql.DB`**，不配等于用默认值（`MaxOpenConns` 无限）。

#### SQLite 的两个必要 PRAGMA
```go
dsn := "file:ledger.db?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)&_pragma=foreign_keys(1)"
```
- `busy_timeout`：遇到锁时等待而不是立刻返回 `database is locked`。
- `journal_mode(WAL)`：读写不互相阻塞。启用 WAL 后可以考虑「读池多连接 + 写池 1 连接」。
- `foreign_keys(1)`：SQLite 默认**不启用**外键约束，不显式打开，`FOREIGN KEY` 形同虚设。

#### 版本要求
GORM 用 **v2.3.19 及以上**（含若干 session/context 相关修复）。`go get gorm.io/gorm@latest` 后看 `go.mod` 确认。

#### 连接池该配几个：SQLite 的答案和 MySQL 不一样
教科书上的「`MaxOpenConns = CPU × 2 + 磁盘数`」是给网络数据库的。SQLite 是**单文件 + 库级写锁**，配多了只会互相等锁：

| 参数 | SQLite 建议 | 理由 |
| :--- | :--- | :--- |
| `MaxOpenConns` | **1**（或读写分离时读池 4 / 写池 1） | 只有一个写者，多余连接排队等待，还容易撞 `database is locked` |
| `MaxIdleConns` | 与 MaxOpen 相同 | 小于 MaxOpen 会导致连接频繁创建销毁，SQLite 建立连接要重新打开文件 |
| `ConnMaxLifetime` | `0`（不限）或几小时 | 本地文件没有服务端超时，不需要主动断 |

配成 1 之后，并发请求会**在连接池里排队**，而不是在数据库里抢锁。排队是可控的（可以设 `ConnMaxIdleTime` 和请求超时），抢锁是不可控的（`busy_timeout` 到了就报错）。

如果启用了 WAL 且读多写少，可以开两个 `*sql.DB`：读池 `MaxOpenConns=4`、写池 `=1`，分别包一层。这是后期优化，**D4 这天先配 1，把功能跑通**。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `database is locked (5) (SQLITE_BUSY)` | 多连接同时写，或没设 `busy_timeout` | DSN 加 `_pragma=busy_timeout(5000)`，并把 `MaxOpenConns` 降到 1 |
| `no such table: entries` | 没跑迁移；或 DSN 的相对路径指向了另一个文件 | 先确认 `sqlite3 <dsn 里的路径> '.tables'` |
| `Stats().MaxOpenConnections` 是 0 | 没调用 `SetMaxOpenConns`，Go 默认「无限」 | 显式设置；`0` 在 Go 里表示无限制 |
| 日志里每条 SQL 都在刷 | GORM logger 是 `Info` | 生产改 `Warn`；`Info` 还会把参数值打进日志，有泄漏风险 |
| `foreign key constraint failed` 但表里没外键 | `foreign_keys` 没开，写完才发现约束从未生效 | DSN 加 `_pragma=foreign_keys(1)`；已建的表要重建才生效 |

#### 5 分钟最小验证：三条命令确认配置真的生效
```go
sqlDB, err := db.DB()
if err != nil { log.Fatal(err) }
var mode string
db.Raw("PRAGMA journal_mode").Scan(&mode)
var fk int
db.Raw("PRAGMA foreign_keys").Scan(&fk)
var busy int
db.Raw("PRAGMA busy_timeout").Scan(&busy)
log.Printf("journal=%s fk=%d busy=%d maxopen=%d", mode, fk, busy, sqlDB.Stats().MaxOpenConnections)
```
期望输出 `journal=wal fk=1 busy=5000 maxopen=1`。**四个值任何一个不对，都说明 DSN 或配置没生效**——这行日志值得留在 `main` 里长期打印，是排查数据库问题的第一手信息。

#### 判据
```go
sqlDB, _ := db.DB()
stats := sqlDB.Stats()
fmt.Println(stats.MaxOpenConnections)   // 必须是 1，不是 0
```
`0` 表示「无限」，说明你忘了配置。

::q 为什么生产环境要把 GORM 日志级别降到 `Warn`？
::a `Info` 会打印每条 SQL 及其参数，高并发下日志量巨大、拖慢响应，而且参数里可能含邮箱、金额等敏感数据，造成泄漏。`Warn` 只记录慢查询和错误，既保留排障能力又控制成本。
::q SQLite 的 `foreign_keys` 为什么要显式打开？
::a SQLite 出于历史兼容默认关闭外键约束，即使建表语句写了 `FOREIGN KEY` 也不会生效。必须在连接 DSN 或 `PRAGMA` 里显式开启，否则删父表不会阻止、插子表不会校验，数据完整性完全靠应用层。
::q `sqlDB.Stats().MaxOpenConnections` 返回 0 意味着什么？
::a 意味着没有设置上限（无限连接）。这在 SQLite 上会导致并发写时频繁 `database is locked`，在 Postgres 上会耗尽数据库连接数。必须显式设置，SQLite 建议从 1 开始。

<!--day 5 | normal-->
#### 模型定义：三个 tag 各有各的用途
```go
type Entry struct {
    ID       int64  `gorm:"primaryKey" json:"id"`
    UserID   int64  `gorm:"index;not null" json:"user_id"`
    Amount   int64  `gorm:"not null" json:"amount"`            // 分
    Category string `gorm:"size:32;index;not null" json:"category"`
    Date     string `gorm:"size:10;index;not null" json:"date"` // YYYY-MM-DD
    Note     string `gorm:"size:255;not null;default:''" json:"note"`
    CreatedAt time.Time `json:"created_at"`
}
func (Entry) TableName() string { return "entries" }
```
- `gorm` tag：列类型、索引、约束。
- `json` tag：API 契约。
- **两者混在一个结构体上是有代价的**：一旦 API 需要改字段名，就会牵动数据库层。规模变大后应拆成 `Entry`（领域）+ `entryRow`（持久化）+ DTO。

#### 金额用 `int64`，日期用 `string`
- `Amount int64` 存分，**不用 `float64`**——阶段一 D2 埋的伏笔在这里兑现。
- `Date string`（`YYYY-MM-DD`）而不是 `time.Time`：SQLite 存储简单、`LIKE '2026-10%'` 可直接用、不受时区影响。如果要用 `time.Time`，必须统一 UTC，否则跨时区会串日期。

#### 索引：先想清楚查询模式
```go
UserID int64 `gorm:"index:idx_user_date,priority:1"`
Date   string `gorm:"index:idx_user_date,priority:2"`
```
复合索引 `(user_id, date)` 能同时服务：
- `WHERE user_id = ?` （最左前缀）
- `WHERE user_id = ? AND date LIKE '2026-10%'`

**顺序不能反**。`(date, user_id)` 就无法高效支持「某用户的某月」之外的查询，而且对「只按 user_id 查」无效。

#### 判据
```sql
-- 迁移后检查实际建出来的索引
SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name='entries';
```
确认 `idx_user_date` 存在且列顺序是 `(user_id, date)`。

#### 拆 DTO 到底从哪天开始
先给结论：**单表、单客户端、字段少于 10 个时，一个结构体挂两种 tag 完全够用**，别为了「架构正确」提前拆。出现下面任一信号再拆：

```go
// 信号一：两个协议要的字段名不一样
type Entry struct {
    Amount int64 `gorm:"not null" json:"amount"`        // 想改 API 的金额单位成「元」
}                                                       // 改 json 不影响 gorm，但语义已经分叉

// 信号二：有些字段只能存不能传
PasswordHash string `gorm:"not null" json:"-"`          // 靠 tag 挡住，漏一处就是泄漏

// 信号三：查询结果形状和表不一样（聚合）
type CategorySum struct { Category string; Amount int64 }  // 没有对应的表
```
拆法很轻：

```go
// store/entry_row.go —— 只给数据库看
type entryRow struct {
    ID       int64  `gorm:"primaryKey"`
    UserID   int64  `gorm:"index:idx_user_date,priority:1"`
    Amount   int64
    Category string
    Date     string
    Note     string
}
func (entryRow) TableName() string { return "entries" }

// ledger/entry.go —— 业务与 API 共用
type Entry struct {
    ID int64 `json:"id"`; UserID int64 `json:"-"`; Amount int64 `json:"amount"`
    Category string `json:"category"`; Date string `json:"date"`; Note string `json:"note"`
}
```
然后写两个纯函数 `toRow(Entry) entryRow` / `fromRow(entryRow) Entry`。代价是 20 行样板，收益是「改 API 不会动到表」。**家庭账本到阶段五结束都还不需要拆**，知道拆法就够了。

#### 不要用 `AutoMigrate` 上线
`db.AutoMigrate(&Entry{})` 很方便，但它只做加法（建表、加列、加索引），**不做改类型、不删列、不处理数据回填**。开发期用它省事，生产必须走 D9 的 goose 迁移文件——因为上线那天你需要的是「可审阅、可回滚、有版本号」的 DDL，而不是程序启动时悄悄改表结构。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 表名变成 `entries` 之外的复数形式（如 `entry_s`） | GORM 复数化规则猜错 | 显式写 `TableName()` |
| `unsupported type: time.Time` 或日期比较结果不对 | 用了 `time.Time` 但没统一 UTC | 日期改 `string`，或全链路 UTC |
| `index idx_user_date already exists` | 迁移重复执行 | 用 goose 管理版本，不要重复跑同一段 SQL |
| 加了字段但查出来是零值 | `AutoMigrate` 加了列，旧行是 NULL，`Scan` 到非指针字段失败 | 给新列设 `default`，或迁移里回填 |

#### 5 分钟最小验证：让 GORM 自己交代建表语句
```go
stmt := db.Session(&gorm.Session{DryRun: true}).Migrator().CreateTable(&Entry{})
log.Println(stmt.Statement.SQL.String())
```
输出应该包含 `CREATE TABLE`、`entries`、`amount integer`、`date text`，以及索引创建语句。**先读一遍它生成的 SQL，再让它真正执行**——比建完再去 `sqlite_master` 里猜快得多。

```bash
sqlite3 ledger.db '.schema entries'
sqlite3 ledger.db 'PRAGMA index_list(entries);'
```
第二条会列出每个索引的 `name / unique / origin`，`origin=c` 表示是 `CREATE INDEX` 建的，`u` 表示是 `UNIQUE` 约束自动建的。看到两个功能相同的索引，就回去删掉一个。

::q 复合索引 `(user_id, date)` 的顺序为什么不能反？
::a 索引按定义的列顺序构建，只有「最左前缀」能被利用。`(user_id, date)` 支持「按 user_id 查」和「按 user_id+date 查」；`(date, user_id)` 只支持「按 date 查」，而账本的查询几乎都带 user_id，等于白建。
::q 为什么日期存 `string` 而不是 `time.Time`？
::a 账本的日期是「日历日」，没有时刻和时区语义。存字符串 `YYYY-MM-DD` 简单、可前缀匹配、不受时区转换影响。用 `time.Time` 则要处理 UTC/本地时区转换，跨时区时容易出现「10 月 19 日的账跑到 18 日」。
::q 一个结构体同时挂 `gorm` 和 `json` tag，什么时候会出问题？
::a 当 API 契约和数据库结构出现分歧时：比如某个字段要存库但绝不能返回（密码哈希），或 API 要改字段名而数据库列名不能动。混在一起就只能靠 `json:"-"` 之类的补丁，容易漏。规模变大后应拆分模型与 DTO。

<!--day 6 | core-->
#### 这是本阶段最容易做错的一天，慢一点
`*gorm.DB` 不是「一个连接」，而是一个**带状态的链式构造器**。它内部有 `Statement`，记录当前的条件、表名、选中列等。所以：

```go
q := db.Where("user_id = ?", 1)
q.Where("amount > ?", 100)     // ❌ 污染了 q 的 Statement
```
同一个 `db` 实例在多个请求间共享时，链式条件会互相污染——**A 用户的查询条件可能出现在 B 用户的查询里**。这不是理论风险，是真实发生过的越权事故。

#### 两个机制，各解决一半问题
| 机制 | 作用 | 不解决 |
| :--- | :--- | :--- |
| `Session(&gorm.Session{NewDB: true})` | 克隆实例，清空链式条件 | 不绑定 context |
| `WithContext(ctx)` | 设置 Statement 的 context | 实现上是 `Session(&Session{Context: ctx})`，**不保证清空条件** |

所以需要**同时**做两件事，而 `Session` 结构体本身带 `Context` 字段，可以一次完成：

```go
func (r *Repo) GetEntry(ctx context.Context, userID, id int64) (ledger.Entry, error) {
    var e Entry
    tx := r.db.Session(&gorm.Session{NewDB: true, Context: ctx})
    err := tx.Where("id = ? AND user_id = ?", id, userID).First(&e).Error
    if errors.Is(err, gorm.ErrRecordNotFound) {
        return ledger.Entry{}, ledger.ErrNotFound
    }
    if err != nil {
        return ledger.Entry{}, fmt.Errorf("GetEntry(%d): %w", id, err)
    }
    return toDomain(e), nil
}
```
三个要点：
1. **`NewDB: true`** 保证这次查询从干净状态开始，不继承任何链式条件。
2. **`Context: ctx`** 把请求作用域的 ctx 直接绑到 session，取消和超时会传播到驱动层（`QueryContext`）。
3. **`ctx` 必须是请求作用域的**，绝不能是 `context.Background()`，也不能存进 `Repo` 结构体。

#### 为什么不能把 ctx 存进结构体
```go
// ❌ 请求结束 ctx 就被取消，之后所有查询立刻失败
type Repo struct {
    db  *gorm.DB
    ctx context.Context
}
```
请求结束 → `r.Context()` 被 cancel → 结构体里的 ctx 永久失效。GORM 会把 `context canceled` 一路返回，表现为「服务跑一会儿就全部超时」。

#### 判据
写一个并发测试：两个 goroutine 分别用 `user_id=1` 和 `user_id=2` 各查 100 次，断言结果不串。
```go
go test -race ./internal/store -run TestSessionIsolation
```
这个测试是「链式条件污染」的唯一可靠防线。

::q `WithContext(ctx)` 为什么不够？它内部不就是 `Session` 吗？
::a `WithContext` 等价于 `Session(&Session{Context: ctx})`，它替换了 context 字段，但**不会重置已有的链式条件**（`Statement`）。如果这个 `*gorm.DB` 上已经累积了 `Where`，条件仍会带过去。要彻底隔离必须同时 `NewDB: true`。
::q 为什么 GORM 的 ctx 必须用请求作用域的，不能用 `context.Background()`？
::a 用 `Background()` 意味着请求取消、超时都无法中断数据库操作，慢查询会一直占用连接直到自然结束，高并发下连接池被拖满。请求级 ctx 能让取消信号传导到驱动层，及时释放资源。
::q 把 ctx 存进 Repo 结构体会导致什么问题？
::a ctx 与单次请求绑定，请求结束即被取消。结构体是长生命周期对象，下次使用时持有的是已取消的 ctx，所有查询立即返回 `context canceled`。表现为服务运行一段时间后全部超时，且重启后暂时恢复。

<!--day 7 | core-->
#### 用实验看清两个机制的差别
不要只背结论，跑一遍：

```go
base := db.Where("amount > 0")   // 故意留一个链式条件

// 实验一：WithContext
q1 := base.WithContext(context.Background())
var n1 int64
q1.Table("entries").Count(&n1)
fmt.Println(q1.Statement.SQL.String())   // 仍然带 amount > 0

// 实验二：Session NewDB
q2 := base.Session(&gorm.Session{NewDB: true})
var n2 int64
q2.Table("entries").Count(&n2)
fmt.Println(q2.Statement.SQL.String())   // 干净，只有 COUNT
```

用 `db.Debug()` 可以看到实际执行的 SQL，也可以直接打印 `Statement.SQL`。**亲眼看到条件残留，比记住文档有效。**

#### 三种写法对照
```go
// ❌ 直接用共享 db，链式条件会污染
r.db.Where("user_id = ?", uid).Find(&list)

// ⚠️ 只 WithContext，ctx 有了但条件没清
r.db.WithContext(ctx).Where("user_id = ?", uid).Find(&list)

// ✅ 一次完成隔离 + ctx
r.db.Session(&gorm.Session{NewDB: true, Context: ctx}).
    Where("user_id = ?", uid).Find(&list)
```
第三种是**唯一推荐形态**。建议在 Repo 里封装一个方法，避免每次都手写：
```go
func (r *Repo) session(ctx context.Context) *gorm.DB {
    return r.db.Session(&gorm.Session{NewDB: true, Context: ctx})
}
```
所有方法都以 `r.session(ctx)` 开头。**把正确做法变成默认路径，比记住规则可靠。**

#### 为什么「从 session 开始」就够了，而「复用中间变量」不行

GORM 只在**链式调用的第一步**保证给你一份干净的 `Statement`。一旦你拿到 `q := base.Where(...)`，`q` 就已经带上了条件；再对它继续 `Where`，新条件会并进同一份 `Statement`——于是第二次查询会连第一次的条件一起带上。

```go
q := r.session(ctx).Where("user_id = ?", 1)
q.Where("amount > ?", 100).Find(&a)   // WHERE user_id = 1 AND amount > 100
q.Find(&b)                            // ⚠️ WHERE user_id = 1 AND amount > 100 —— 条件还在
```

正确写法是每次重新取：

```go
r.session(ctx).Where("user_id = ?", 1).Where("amount > ?", 100).Find(&a)
r.session(ctx).Find(&b)               // 干净
```

**这条规则的收益不在今天，在并发下**：两个请求共用 `r.db` 时，一旦某处复用了带条件的中间变量，A 用户的 `user_id` 就可能出现在 B 用户的查询里。这类 bug 不报错、只在数据上体现，而且极难复现——所以要用「每次都新建」而不是「记得别复用」来防。

#### 事务里怎么办
```go
tx := r.session(ctx).Begin()
defer tx.Rollback()
// 事务内的每一步都要用 tx，而不是 r.db
if err := tx.Create(&e).Error; err != nil { return err }
return tx.Commit().Error
```
**事务内不能再用 `r.session(ctx)`**，那会拿到池子里的另一个连接，等于脱离事务。这是一个高频错误。

#### 判据
```go
var e Entry
err := r.session(ctx).Where("id = ?", id).First(&e).Error
// 用 db.Debug() 看 SQL：不能出现上一次查询残留的条件
```
再跑并发隔离测试，确认无串数据。

#### 5 分钟最小验证：一个临时测试看清「污染」
```go
func TestSessionIsolation(t *testing.T) {
    db := newTestDB(t).Debug()          // Debug 会把 SQL 打到测试输出
    base := db.Session(&gorm.Session{NewDB: true}).Where("user_id = ?", 1)

    var a, b []entryRow
    base.Where("amount > ?", 100).Find(&a)
    base.Find(&b)                       // 期望：不带 amount > 100
}
```
跑 `go test -run TestSessionIsolation -v`，对比两条打印出来的 SQL。**第一条带两个条件是对的，第二条只该带 `user_id`**。如果第二条也带着 `amount > 100`，说明 `base` 被复用了——这正是把 `Where` 的结果存进变量带来的问题，正确做法是每次从 `r.session(ctx)` 起链。

顺便记住：`Statement.SQL.String()` 只有在语句**执行之后**才有内容。想提前看 SQL 用 `db.DryRun = true`（或 `Session(&gorm.Session{DryRun: true})`）。

::q 事务内为什么不能调用 `r.session(ctx)` 取新的 DB 实例？
::a 那会从连接池拿另一条连接，与当前事务不在同一个事务上下文里，导致「事务内的写入」和「事务外的查询」看到不同数据，回滚也管不到。事务内所有操作必须复用 `tx`。
::q `NewDB: true` 会不会影响性能（每次都克隆）？
::a 它只克隆结构体和 Statement，不新建数据库连接，开销是内存分配级别，可忽略。相比「条件污染导致越权或查错数据」的代价，这点开销完全值得。
::q 把 `session(ctx)` 封装成一个私有方法，好处是什么？
::a 把「正确的默认路径」固化下来，所有查询自动获得隔离和 ctx 绑定，不依赖每个人的记忆。新人加方法时照抄一行即可，降低出错概率——这比写文档强调规则有效得多。

<!--day 8 | core-->
#### `Updates` 忽略零值，这是设计不是 bug
```go
db.Model(&Entry{}).Where("id = ?", id).Updates(Entry{Amount: 0})
// 生成的 SQL 里没有 amount = 0
```
GORM 用结构体更新时只更新非零字段（0、""、nil 都被跳过）。所以「把金额改成 0」「把备注清空」这类操作会静默失败——**接口返回成功，数据没变**。

三种正确写法：
```go
// 1. map：所有列都参与更新
db.Model(&Entry{}).Where("id = ?", id).Updates(map[string]any{"amount": 0})

// 2. Select 指定列
db.Model(&Entry{}).Where("id = ?", id).Select("amount", "note").Updates(Entry{Amount: 0})

// 3. 指针字段 + Select
```
第三种写法在这里容易讲不清，直接看代码——用 `*int64` 表示「这个字段要不要更新」：

```go
type EntryPatch struct {
    Amount *int64  `json:"amount"`
    Note   *string `json:"note"`
}
// 前端传 {"amount":0} → Amount 指向 0，Select("*") 或逐字段挑出非 nil 的列名
db.Model(&Entry{}).Where("id = ? AND user_id = ?", id, uid).
    Select("amount").Updates(EntryPatch{Amount: &zero})
```
三种写法怎么选，一句话：**内部代码用 `map`（简单直接），对外 API 用指针结构体（能区分「没传」和「传了 0」）**。`Select` + 结构体的写法最不推荐——它把「哪些列可更新」写成了一个字符串列表，加字段时容易忘。

#### `Save` 是另一个极端：它会写所有字段
```go
db.Save(&Entry{ID: 1, Amount: 3550})   // 其他字段被写成零值！
```
`Save` 的逻辑是「有主键就 UPDATE 全字段，没主键就 INSERT」。这意味着你只传了 `ID` 和 `Amount`，`category`、`date`、`user_id` 会被**覆盖成零值**——一条数据就这样被悄悄清空了。

更危险的是 `Save` 带 `user_id = 0` 时会把归属改掉，等于把这条账「送」给了 uid 0。**家庭账本里禁用 `Save`**，统一用 `Updates(map)` + `Where`，只有「整对象替换」的语义才用它。

#### 更要命的是「全表更新」
```go
db.Model(&Entry{}).Updates(map[string]any{"note": "x"})   // ❌ 没有 Where，全表被改
```
GORM 默认阻止无 `WHERE` 的全局更新（返回 `WHERE conditions required`），但**用 `Session{AllowGlobalUpdate: true}` 或某些链式写法可以绕过**。规则：**任何 Update/Delete 必须显式带 `Where`，并且带 `user_id`。**

#### CRUD 的正确形态
```go
func (r *Repo) UpdateEntry(ctx context.Context, userID, id int64, patch map[string]any) error {
    res := r.session(ctx).
        Model(&Entry{}).
        Where("id = ? AND user_id = ?", id, userID).
        Updates(patch)
    if res.Error != nil {
        return fmt.Errorf("UpdateEntry(%d): %w", id, res.Error)
    }
    if res.RowsAffected == 0 {
        return ledger.ErrNotFound     // 不存在或不属于该用户
    }
    return nil
}
```
`RowsAffected == 0` 的处理不能省，理由和阶段四 D11 一样：它是「越权或无此记录」的信号。

#### `First` / `Find` / `Take` 的区别
- `First`：按主键升序取第一条，无记录返回 `ErrRecordNotFound`。
- `Take`：不排序取第一条，无记录同样返回错误。
- `Find`：取多条，无记录**不报错**，返回空切片。

所以列表查询用 `Find` 且**不要**判断 `ErrRecordNotFound`；单条查询用 `First` 并必须判断。

#### 判据
```go
// 创建后把 amount 改成 0
patch := map[string]any{"amount": int64(0)}
err := repo.UpdateEntry(ctx, uid, id, patch)
// 查询确认库里真的是 0，而不是旧值
```

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `WHERE conditions required` | 无 `Where` 的全局更新，GORM 拦截了 | 加 `Where`；**不要**用 `AllowGlobalUpdate` 绕过 |
| 接口返回 200 但数据没变（备注清空失败） | 结构体 `Updates` 跳过零值 | 改 `map` 或指针 + `Select` |
| `ErrRecordNotFound` 出现在列表接口 | 用 `First` 查列表 | 列表用 `Find`，它不报这个错 |
| 更新后 `created_at` 变成零值 | 用了 `Save` 传了不完整的结构体 | 禁用 `Save`，用 `Updates` |
| 删除后还能查到 | 配了软删除（`gorm.DeletedAt`），普通查询自动过滤但数据还在 | 这是预期行为；用 `Unscoped()` 才能查到 |

#### 5 分钟最小验证：一次更新，三个断言
```go
// 用 Debug() 打开 SQL 打印，肉眼确认 WHERE 和 SET 里都有该有的列
res := db.Debug().Model(&Entry{}).
    Where("id = ? AND user_id = ?", id, uid).
    Updates(map[string]any{"amount": int64(0), "note": ""})
log.Printf("rows=%d err=%v", res.RowsAffected, res.Error)
```
要看三件事：SQL 里 `SET` **同时包含** `amount=0` 和 `note=''`（证明零值没被跳过）；`WHERE` 里**包含** `user_id`（证明隔离没丢）；`rows=1`（证明真的改到了）。

如果 `rows=0` 而记录确实存在，先查 `user_id` 是不是传错了——**这是「更新静默失败」最常见的真实原因**，不是 GORM 的问题。

::q `Updates(Entry{Amount: 0})` 为什么不生效？
::a GORM 用结构体更新时忽略零值字段（0、""、false、nil），以免误把未赋值的字段写成零。要更新为零值必须用 `map[string]any` 或 `Select` 显式指定列。
::q `Find` 查不到数据会返回 `ErrRecordNotFound` 吗？
::a 不会。`Find` 用于多条查询，无结果时返回空切片和 nil 错误。只有 `First`/`Take` 这类单条查询在无记录时返回 `ErrRecordNotFound`。混淆两者会导致「空列表被当成 500」。
::q 为什么 Update 之后要检查 `RowsAffected`？
::a 它告诉你实际改了几行。0 行意味着条件没匹配上——可能是 ID 不存在，也可能是 `user_id` 不匹配（越权）。不检查就会把「什么都没改」当成功返回，用户以为保存了但数据没变。

<!--day 9 | core-->
#### 事务的两种写法
```go
// 1. 手动控制
tx := r.session(ctx).Begin()
defer tx.Rollback()
if err := tx.Create(&e).Error; err != nil { return err }
if err := tx.Model(&Budget{}).Where(...).Update("used", gorm.Expr("used + ?", e.Amount)).Error; err != nil { return err }
return tx.Commit().Error

// 2. 回调（推荐）
err := r.session(ctx).Transaction(func(tx *gorm.DB) error {
    if err := tx.Create(&e).Error; err != nil { return err }
    if err := tx.Model(&Budget{}).Where(...).Update("used", gorm.Expr("used + ?", e.Amount)).Error; err != nil { return err }
    return nil
})
```
回调版的优势：**panic 也会回滚**（内部有 recover 并重新抛出），且不会忘记 Commit/Rollback。

#### 事务内的 ctx 不会自动传下去
`Transaction(func(tx *gorm.DB) error)` 的 `tx` **已经继承了外层 session 的 Context**（因为我们用 `r.session(ctx)` 开启），所以事务内不需要再 `WithContext`。

但如果是 `db.Begin()` 手动开启（没有走 session），事务内的 `tx` 就**没有绑定 ctx**，需要每步 `tx.WithContext(ctx)`。

**结论：统一用 `r.session(ctx).Transaction(...)`，事务内直接用 `tx`，最不容易错。**

#### 事务的三条纪律
1. **事务要短**：不要在事务里做 HTTP 调用、发消息、等锁。SQLite 下写事务持有全局写锁，长事务会让所有写入排队。
2. **不要在事务里 `return nil` 后又继续用 `tx`**：回调返回后事务已提交，`tx` 不再有效。
3. **不要在事务内取新 session**：`r.session(ctx)` 会拿另一条连接，脱离事务。

#### 隔离级别与 SQLite 的现实
SQLite 实际是「串行化」写：同一时刻只有一个写事务。所以「两个事务同时改余额」不会出现丢失更新——第二个会等 `busy_timeout` 或直接失败。这简化了很多问题，但也意味着**长事务会阻塞全部写入**。

#### 完整实现：一次事务写两张表
「记一笔账 + 累加预算已用金额」是最典型的双写场景，拆开写必然出现「账记了但预算没变」：

```go
func (r *Repo) CreateEntryWithBudget(ctx context.Context, e ledger.Entry) (int64, error) {
    var id int64
    err := r.session(ctx).Transaction(func(tx *gorm.DB) error {
        row := entryRow{UserID: e.UserID, Amount: e.Amount, Category: e.Category, Date: e.Date, Note: e.Note}
        if err := tx.Create(&row).Error; err != nil {
            return fmt.Errorf("insert entry: %w", err)
        }
        id = row.ID

        // 预算可能不存在：用 RowsAffected 判断，不要用 ErrRecordNotFound
        res := tx.Model(&budgetRow{}).
            Where("user_id = ? AND month = ? AND category = ?", e.UserID, e.Date[:7], e.Category).
            Update("used", gorm.Expr("used + ?", e.Amount))
        if res.Error != nil {
            return fmt.Errorf("update budget: %w", res.Error)
        }
        // 没有预算记录是正常情况（不是所有分类都设了预算），不返回错误
        return nil
    })
    return id, err
}
```
两个细节值得停一下：

1. **`Update("used", gorm.Expr("used + ?", ...))` 是原子操作**，不要写成「先查 used 再写回 used+n」。后者在并发下会丢更新，而这条 SQL 由数据库保证 `used = used + n` 的原子性。
2. **`RowsAffected == 0` 在这里不是错误**。预算表里没这个分类的预算，说明用户没设预算，业务上完全正常。这跟 D8 的更新语义相反——**同样的 `0 行`，在两个场景里含义不同**，必须按业务判断。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `transaction has already been committed or rolled back` | 在回调返回后继续用 `tx`（比如起了 goroutine 异步写） | 所有写操作必须在回调内完成；异步任务另开事务 |
| `sql: transaction has already been committed` | 手动 `Begin()` 后重复 `Commit()` | 用 `Transaction(...)` 回调，别手写 |
| 第二步失败但第一步的数据还在 | 用了两个独立 session / 两个连接，不在同一事务 | 事务内只用 `tx`，不要再 `r.session(ctx)` |
| `database is locked` 在事务里出现 | 事务内又开了另一个写事务 | 事务内不要嵌套 `Transaction`，或用 `tx.Transaction`（SavePoint） |

#### 5 分钟最小验证：两步都验，包括 panic
```go
// ① 错误回滚：让第二步故意失败
err := r.session(ctx).Transaction(func(tx *gorm.DB) error {
    if err := tx.Create(&entryRow{UserID: 1, Amount: 100, Category: "x", Date: "2026-10-19"}).Error; err != nil { return err }
    return errors.New("boom")
})
// 断言：err != nil，且 select count(*) 没变

// ② panic 回滚：回调里直接 panic
func() {
    defer func() { recover() }()   // 拦住 panic，否则进程退出
    _ = r.session(ctx).Transaction(func(tx *gorm.DB) error {
        tx.Create(&entryRow{UserID: 1, Amount: 100, Category: "x", Date: "2026-10-19"})
        panic("boom")
    })
}()
// 断言：count 仍然没变
```
② 是最容易被忽略的一条：**很多人以为只有 `return err` 才回滚**。实际上 GORM 在回调里 recover 了 panic、回滚、再重新抛出，所以你在外层必须自己 recover，否则整个进程挂掉——而生产环境里一个 handler 的 panic 如果没被 Recovery 中间件接住，就是一次 502。

```bash
# 用 sqlite3 直接核对，别信接口返回
sqlite3 ledger.db 'select count(*) from entries where category = "x";'
```
期望两次实验后都是 `0`。

#### 判据
```go
// 故意让第二步失败
err := repo.CreateWithBudget(ctx, e, "不存在的分类")
// 断言：entries 表里没有新增记录
```
这条断言必须通过，否则事务没生效。

::q `Transaction` 回调里 `return err` 和 `return nil` 分别发生什么？
::a 返回非 nil 时 GORM 自动回滚；返回 nil 时自动提交。所以回调内不要自己 Commit/Rollback，否则会与外层控制冲突（重复提交会报错）。
::q 事务内为什么不能调外部 HTTP 接口？
::a 事务持有数据库锁，网络调用可能耗时几百毫秒甚至超时，期间所有需要该锁的操作全部阻塞，容易引发雪崩。正确做法是先完成外部调用，再把结果放进短事务里落库。
::q 手动 `Begin()` 和 `session(ctx).Transaction()` 在 ctx 传递上的差别？
::a `session(ctx).Transaction()` 的 `tx` 继承了 session 的 ctx，事务内自动带上取消和超时；`db.Begin()` 得到的 `tx` 未必绑定 ctx，事务内每步都要显式 `WithContext(ctx)`，漏一处就失去取消能力。

<!--day 10 | normal-->
#### 为什么不用 `AutoMigrate` 管生产
`AutoMigrate` 会「按结构体差异改表」，听起来很方便，但：
1. **没有版本记录**：你不知道数据库现在是第几版，也无法知道某次部署是否执行过。
2. **不能回滚**：改错了没有 `down`。
3. **删列/改类型不处理**：它只加不删，字段改名会变成「新增一列 + 旧列留着」，数据静默丢失。
4. **并发部署出问题**：多实例同时启动会同时改表。

所以：**`AutoMigrate` 只用于本地和测试**，生产用版本化迁移。

#### goose 的三步
```go
// migrations/embed.go
package migrations

import "embed"

//go:embed *.sql
var FS embed.FS
```
```go
// main.go 或独立命令
goose.SetBaseFS(migrations.FS)
if err := goose.SetDialect("sqlite3"); err != nil { ... }
if err := goose.Up(sqlDB, "."); err != nil { ... }
```

#### 迁移文件成对，且必须写 down
```sql
-- +goose Up
CREATE TABLE entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);
CREATE INDEX idx_entries_user_date ON entries(user_id, date);

-- +goose Down
DROP INDEX idx_entries_user_date;
DROP TABLE entries;
```
文件名：`00001_create_entries.sql`，序号递增，**已执行的迁移文件永不修改**——改了也不会重新执行，只会让新老环境不一致。

#### 迁移要不要在启动时自动跑
- 单实例、家庭部署：启动时跑 `goose.Up` 可以接受，简单。
- 多实例：**必须独立执行**（部署流程里单独一步），否则并发迁移会互相冲突。

阶段六 D6 会把迁移做成部署流程里的独立步骤。

#### 判据
```bash
goose -dir migrations sqlite3 ledger.db up
goose -dir migrations sqlite3 ledger.db status     # 显示 Applied
goose -dir migrations sqlite3 ledger.db down       # 能回滚
```
`down` 一定要验证一次——没验证过的回滚等于没有回滚。

#### 版本记录存在哪
goose 会在同一个库里建一张 `goose_db_version` 表，每次 `Up` 写一行 `(version_id, is_applied, tstamp)`。所以：

```bash
sqlite3 ledger.db 'select version_id, is_applied from goose_db_version order by id;'
# 1|1
# 2|1        ← 最后一条是当前版本
```
这张表是「数据库现在是第几版」的唯一真相来源。**不要手动去改它**——除非你非常清楚在做什么（D11 的「已有数据的老库怎么让 goose 认为 00001 已执行」就是唯一合理的场景）。

它还有一个副作用：迁移和业务表在同一个库文件里。备份、导出数据时要记得这张表也在里面，不然恢复后 goose 会以为一条都没执行，重跑一遍全部 `CREATE TABLE` 直接报错。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `goose: no migrations found` | `-dir` 指错，或文件没匹配 `NNNNN_name.sql` | 确认路径与文件名格式；`goose status` 会列出它看到的文件 |
| `migration 1: ERROR: table entries already exists` | 老库已经有表，goose 认为 00001 没执行 | 补一条版本记录，或先把 00001 写成 `CREATE TABLE IF NOT EXISTS` |
| `no up migration found` / `no down migration found` | SQL 里漏了 `-- +goose Up` 或 `-- +goose Down` 注释 | 两个标记块都要有，且顺序不能反 |
| `down` 执行完表还在 | Down 里只删了索引，忘了 `DROP TABLE` | Down 必须与 Up 完全对称 |
| 修改了 00001 但库没变化 | 已执行的迁移不会重跑 | 新建 `00002_xxx.sql`，永不改历史文件 |

#### 5 分钟最小验证：空库与有数据的库各跑一遍
```bash
# ① 空库：从 0 到最新，必须干净通过
rm -f /tmp/fresh.db
goose -dir migrations sqlite3 /tmp/fresh.db up
sqlite3 /tmp/fresh.db '.tables'

# ② 回滚一步再前进，验证 down 与 up 对称
goose -dir migrations sqlite3 /tmp/fresh.db down
goose -dir migrations sqlite3 /tmp/fresh.db up

# ③ 有数据的库：迁移不能丢数据
sqlite3 ledger.db 'select count(*) from entries;'   # 记下数字
goose -dir migrations sqlite3 ledger.db up
sqlite3 ledger.db 'select count(*) from entries;'   # 必须一致
```
三条里最容易被跳过的是 ③。「**迁移把数据弄丢了**」是上线事故的经典形态，而它只在有数据的库上才暴露。养成习惯：任何迁移，先在一个有真实数据的副本上跑一遍。

```bash
cp ledger.db /tmp/rehearsal.db
goose -dir migrations sqlite3 /tmp/rehearsal.db up
```
用副本排练，成本几乎为零。

::q `AutoMigrate` 在生产环境的三个致命问题是什么？
::a 没有版本记录（不知道当前结构版本）、不能回滚（改错无法退）、字段改名会变成新增列导致数据静默丢失。此外多实例并发启动会同时改表，可能互相阻塞或产生不一致。
::q 为什么已经执行过的迁移文件不能修改？
::a 迁移工具按版本号记录已执行，改文件内容不会重新执行。于是老环境保持旧结构、新环境用新结构，出现「同样代码在不同环境行为不同」的隐蔽问题。修正应该新增一个迁移文件。
::q 迁移的 `down` 为什么必须验证一次？
::a 没验证过的回滚脚本往往有错（漏删索引、依赖顺序错），真正需要回滚时才发现执行失败，那时已经在故障中。上线前跑一次 `up → down → up` 是最低要求。

<!--day 11 | normal-->
#### 切换步骤：先补迁移，再关掉 AutoMigrate
1. 用 goose 写出与当前结构一致的 `00001_init.sql`。
2. 在空库上执行，确认结构与 `AutoMigrate` 建出来的一致（对比 `sqlite_master`）。
3. 关掉启动时的 `AutoMigrate`。
4. 在已有数据的库上验证：迁移能正常执行、数据没丢。

第 2 步的对比不能省——**你手写的 SQL 和 GORM 生成的 DDL 在类型、默认值、索引名上常有差异**，直接切会导致新老环境结构不一致。

#### 对比结构的方法
```sql
SELECT type, name, sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name;
```
把两份输出 diff 一下，重点看：
- 列类型（`INTEGER` vs `BIGINT`）
- `NOT NULL` 与默认值
- 索引名和列顺序
- 是否有 `AUTOINCREMENT`

#### 已有数据的库怎么过渡
如果已经有 `AutoMigrate` 建的表和数据：
- 用 `goose fix` 或手动插入版本记录，让 goose 认为 00001 已执行。
- 或者写 `00001` 为 `CREATE TABLE IF NOT EXISTS`，让它对已有库幂等。

**不要 DROP 重建**，那会丢数据。生产环境的表结构变更永远是「增量」的。

#### 判据
```bash
# 空库
rm -f test.db && goose -dir migrations sqlite3 test.db up
sqlite3 test.db "select count(*) from entries"    # 表存在，0 行

# 有数据的库
cp ledger.db backup.db
goose -dir migrations sqlite3 ledger.db up
sqlite3 ledger.db "select count(*) from entries"  # 行数不变
```

#### 把迁移做成子命令，而不是启动副作用
```go
func main() {
    if len(os.Args) > 1 && os.Args[1] == "migrate" {
        if err := runMigrate(os.Args[2:]); err != nil {   // up / down / status
            log.Fatalf("migrate: %v", err)
        }
        return
    }
    runServer()      // 正常启动，这里不再调 goose
}

func runMigrate(args []string) error {
    sqlDB, err := sql.Open("sqlite3", cfg.DBPath)
    if err != nil { return err }
    defer sqlDB.Close()

    goose.SetBaseFS(migrations.FS)
    if err := goose.SetDialect("sqlite3"); err != nil { return err }

    cmd := "up"
    if len(args) > 0 { cmd = args[0] }
    switch cmd {
    case "up":     return goose.Up(sqlDB, ".")
    case "down":   return goose.Down(sqlDB, ".")
    case "status": return goose.Status(sqlDB, ".")
    default:       return fmt.Errorf("未知迁移命令: %s", cmd)
    }
}
```
同一个镜像既能当服务、又能当迁移工具（`docker compose run --rm api migrate up`），**不需要额外打一个二进制**。阶段六 D6 会把这条命令接进 compose 的独立服务。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 新库起来后 `no such table` | 忘了执行 `migrate up`（AutoMigrate 已关掉） | 启动流程加一步；本地用 `make migrate` |
| 已有库报 `table entries already exists` | goose 认为 00001 未执行 | 插版本记录，或把 00001 写成幂等 DDL |
| `goose: no migrations found` | `embed` 路径与 `SetBaseFS` 的相对路径不一致 | `//go:embed *.sql` + `goose.Up(sqlDB, ".")` |
| 新老环境结构不一致 | 手写 DDL 与 GORM 生成的有差异 | 用 `sqlite_master` 逐条 diff 后再切 |

#### 5 分钟最小验证：切完还能回滚
```bash
go build -o /tmp/app . && /tmp/app migrate status
/tmp/app migrate down && sqlite3 ledger.db '.tables'    # 表没了
/tmp/app migrate up   && sqlite3 ledger.db '.tables'    # 表回来了
```
最后再看一眼数据：`sqlite3 ledger.db 'select count(*) from entries'`。如果 `down` 里是 `DROP TABLE`，数据当然没了——**这正是「生产别轻易 down」的原因**：迁移能回滚结构，回滚不了数据。

::q 手写迁移 SQL 和 `AutoMigrate` 生成的结构可能有哪些差异？
::a 列类型（`INTEGER`/`BIGINT`、`TEXT`/`VARCHAR`）、默认值写法、`NOT NULL` 约束、索引名称与列顺序、是否 `AUTOINCREMENT`。这些差异在 SQLite 上部分不影响行为，但会让新老环境不一致，日后排查困难。
::q 已有数据的库如何让 goose 认为初始迁移已执行？
::a 可以用 `goose fix` 生成基线，或手动往 `goose_db_version` 表插入对应版本记录；也可以把 00001 写成 `CREATE TABLE IF NOT EXISTS` 并让索引创建幂等，使其在已有库上安全执行。绝不要 DROP 重建。
::q 单实例部署时把 `goose.Up` 放在启动流程里也能跑，为什么后面还要改成独立步骤？
::a 单实例确实能跑，问题是它把「结构变更」和「进程启动」耦合了：多副本会并发迁移；迁移失败表现为「服务起不来」而不是「部署失败」，回滚时不知道该退代码还是退结构；也无法在迁移前插入备份步骤。拆成独立命令后，「备份 → 迁移 → 起服务」变成可审阅、可重试的三步。

<!--day 12 | normal-->
#### 分类表：从字符串到实体
```go
type Category struct {
    ID     int64  `gorm:"primaryKey"`
    UserID int64  `gorm:"index:idx_cat_user_name,unique,priority:1"`
    Name   string `gorm:"size:32;index:idx_cat_user_name,unique,priority:2"`
    Icon   string `gorm:"size:16"`
}
```
复合唯一索引 `(user_id, name)` 保证「同一用户不能有两个同名分类」，但不同用户可以有同名分类。**这就是「唯一约束要带作用域」的例子**——只对 `name` 加唯一，会让第二个用户无法创建「餐饮」。

#### Entry 与 Category 的关联
```go
type Entry struct {
    ...
    CategoryID int64    `gorm:"index"`
    Category   Category `gorm:"foreignKey:CategoryID"`
}
```
`Preload("Category")` 会发第二条 SQL 加载关联（N+1 中的 1+1）。列表页如果要显示分类名，两种选择：
- `Preload`：多一次查询，代码简单。
- JOIN + 自定义结构体：一次查询，但要自己 Scan。

**列表 20 条时用 Preload 完全够**，不要在数据量小的时候过早优化。

#### 关联的坑
1. **零值外键**：`CategoryID: 0` 会尝试关联 `id=0`，`Preload` 结果为空但不报错。要么允许 NULL（用 `*int64`），要么强制校验存在性。
2. **软删除**：GORM 的 `DeletedAt` 会让 `Preload` 自动过滤已删记录，但**不会阻止外键指向已删分类**。需要在删除分类时检查是否被引用。
3. **级联**：SQLite 必须显式 `PRAGMA foreign_keys=ON`，否则 `ON DELETE CASCADE` 不生效（阶段五 D4 已配置）。

#### 删除一个分类，三种做法
分类被账目引用后，「删除」这个动作在业务上没有唯一答案。三种处理都要能说清代价：

| 做法 | 实现 | 优点 | 代价 |
| :--- | :--- | :--- | :--- |
| 禁止删除 | 先 `COUNT(*) FROM entries WHERE category_id = ?`，>0 返回 409 | 数据最干净，历史可追溯 | 用户被卡住，只能先改账 |
| 迁移到「未分类」 | 事务里 `UPDATE entries SET category_id = ?` 再删 | 用户无感 | 丢失原始分类信息，统计会变 |
| 级联删除账目 | `ON DELETE CASCADE` | 实现最省事 | **删一个分类等于删一批账**，极度危险 |

家庭账本选第一种，并且给出可操作的提示：

```go
func (s *Service) DeleteCategory(ctx context.Context, uid, id int64) error {
    n, err := s.store.CountEntriesByCategory(ctx, uid, id)
    if err != nil { return fmt.Errorf("count refs: %w", err) }
    if n > 0 {
        return fmt.Errorf("%w: 该分类下还有 %d 笔账目，请先修改或删除", ErrCategoryInUse, n)
    }
    return s.store.DeleteCategory(ctx, uid, id)
}
```
把 `n` 带进错误信息，前端就能直接显示「还有 12 笔账目，请先处理」——**错误信息里带可行动的数字，比一句「操作失败」有用十倍**。

#### 判据
```sql
-- 两个用户各自建「餐饮」，必须都成功
INSERT INTO categories (user_id, name) VALUES (1, '餐饮');
INSERT INTO categories (user_id, name) VALUES (2, '餐饮');
-- 同一用户重复建，必须失败
INSERT INTO categories (user_id, name) VALUES (1, '餐饮');  -- UNIQUE constraint failed
```

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 第二个用户建「餐饮」报唯一冲突 | 唯一索引只有 `name`，漏了 `user_id` | 改成 `(user_id, name)` 复合唯一 |
| `Preload` 后 `Category.Name` 是空串 | 外键是 0，或分类被软删除了 | 校验外键 > 0；查已删分类用 `Unscoped().Preload` |
| 列表接口发了 21 条 SQL | 在循环里 `Preload`，或对每条记录单独查分类 | `Preload` 只能写在主查询上，一次加载全部 |
| 删分类后账目还在但分类名空白 | 外键约束没开，删了父行留下悬空引用 | `PRAGMA foreign_keys=1`；删除前先查引用 |

#### 5 分钟最小验证：一次看穿 N+1
```bash
# 打开 GORM 的 Info 日志，请求一次列表，数一下 SQL 条数
curl -s 'localhost:8080/ledger?limit=20' > /dev/null
grep -c 'SELECT' /tmp/server.log
```
20 条数据时，期望是 **2 条**（1 条主查询 + 1 条 Preload）。如果是 21 条，说明在循环里查分类——这是 N+1 的指纹。「**日志里的 SQL 条数**」比任何性能工具都直观，养成看它的习惯。

::q 为什么分类的唯一索引要包含 `user_id`？
::a 因为分类是用户私有的。只对 `name` 加唯一会导致第二个用户无法创建「餐饮」，这是典型的「约束范围错了」。复合唯一 `(user_id, name)` 才能表达「同一用户内不重名」。
::q `Preload` 和 `JOIN` 该怎么选？
::a 数据量小、代码清晰优先时用 `Preload`（两次简单查询，易读易维护）。列表很大或需要按关联字段排序/过滤时用 `JOIN` + 自定义结构体，一次查询完成。过早优化会牺牲可读性，收益却很小。
::q 删除分类时需要注意什么？
::a 要检查是否还有账目引用它，否则会留下悬空外键（SQLite 未开启外键约束时甚至不会报错）。业务上通常禁止删除已被引用的分类，或改为软删除并保留历史记录的关联。

<!--day 13 | core-->
#### 聚合查询：GORM 的 `Select` + `Scan` 组合
```go
type CategorySum struct {
    Category string `json:"category"`
    Total    int64  `json:"total"`
}

func (r *Repo) SumByCategory(ctx context.Context, userID int64, month string) ([]CategorySum, error) {
    var rows []CategorySum
    err := r.session(ctx).
        Model(&Entry{}).
        Select("category, SUM(amount) AS total").
        Where("user_id = ? AND date LIKE ?", userID, month+"%").
        Group("category").
        Order("total DESC").
        Scan(&rows).Error
    if err != nil {
        return nil, fmt.Errorf("SumByCategory: %w", err)
    }
    return rows, nil
}
```
三个要点：
1. **`Scan` 到专用结构体**，字段名要和 SQL 别名一致（`total`）。
2. **`Order("total DESC")` 用的是别名**，SQLite 支持，Postgres 也支持。若要跨库，改成 `ORDER BY SUM(amount) DESC`。
3. **空结果返回 nil 切片**，上层要转成 `[]` 再序列化。

#### 同时算总额，别用分类相加
```go
var total int64
err := r.session(ctx).
    Model(&Entry{}).
    Select("COALESCE(SUM(amount), 0)").
    Where("user_id = ? AND date LIKE ?", userID, month+"%").
    Scan(&total).Error
```
分类相加在有空分类、过滤条件不一致时会算错。**单独查一次，成本极低，语义明确。**

#### 百分比在服务端算还是前端算
建议服务端算，返回 `percent`（整数），避免前端各自实现导致四舍五入不一致。注意除零：总额为 0 时百分比一律 0。

```go
for i := range rows {
    if total > 0 {
        rows[i].Percent = int(math.Round(float64(rows[i].Total) * 100 / float64(total)))
    }
}
```

#### 三个会让统计「看起来对但差一点」的地方

1. **百分比之和不是 100**。每个分类各自四舍五入，累加可能是 99 或 101。前端要显示「合计 100%」就得做「最大余数法」：先取整，再把差额补给余数最大的那一项。家庭账本可以直接在文档里注明「百分比为近似值」，比悄悄差 1% 好。
2. **0 元记录要不要出现在分类里**。`GROUP BY` 会把金额为 0 的分类也列出来（`SUM=0`）。想过滤就加 `HAVING SUM(amount) > 0`；想保留就在前端显示为「0 元」。**两种都行，但要在接口文档里写清楚**，否则前端画饼图会出现一个 0% 的空扇区。
3. **空分类**。`category = ''` 会单独成为一组。要么建表时 `NOT NULL DEFAULT '未分类'`，要么查询时 `CASE WHEN category = '' THEN '未分类'`。**别让空字符串流到前端**——那是把数据质量问题转嫁给用户。

#### 聚合查询要不要加索引

```sql
-- 看它到底走了什么
EXPLAIN QUERY PLAN
SELECT category, SUM(amount) FROM entries
WHERE user_id = 1 AND date >= '2026-10-01' AND date < '2026-11-01'
GROUP BY category;
```

期望看到 `SEARCH entries USING INDEX idx_user_date (user_id=?)`。如果出现 `SCAN entries`，说明复合索引没用上——最常见的原因是索引建成了 `(date, user_id)`（顺序反了），或者查询条件对列做了函数运算（`substr(date,1,7) = ?`）。

`GROUP BY` 本身会建临时 B 树做聚合，数据量大时无法避免；但**先过滤再聚合**（WHERE 走索引）和**先聚合再过滤**（HAVING）的成本差一个数量级。

#### 5 分钟最小验证：三种边界各造一条数据

```bash
# 0 元记录
curl -s -X POST localhost:8080/api/v1/ledger -H "Authorization: Bearer $T" \
  -d '{"amount_cents":0,"category":"其他","date":"2026-10-19"}'
# 空分类（如果允许）
curl -s -X POST localhost:8080/api/v1/ledger -H "Authorization: Bearer $T" \
  -d '{"amount_cents":100,"category":"","date":"2026-10-19"}'

curl -s "localhost:8080/api/v1/summary?month=2026-10" -H "Authorization: Bearer $T" | jq .data
```

检查三件事：`total` 是否等于各分类之和、`percent` 是否处理了 0 元项、空分类是否被归到「未分类」。**边界数据不是测试的补充，是测试的主体**——正常数据几乎不会出问题。

#### 判据
```bash
# 1) 用 sqlite3 CLI 手算，作为「正确答案」
sqlite3 -header -column ledger.db \
  "SELECT category_id, SUM(amount) AS total FROM entries \
   WHERE user_id = 1 AND date LIKE '2026-10-%' GROUP BY category_id;"

# 2) 接口结果逐项对照，数字必须一致
curl -s "localhost:8080/summary?month=2026-10" -H "Authorization: Bearer $T" | jq .data
# by_category 按 total 降序，各项相加 == total，percent 之和 ≈ 100
```
聚合类接口最容易「看起来对、其实错」——差几百块钱在页面上不显眼。**先手算再对照**是唯一可靠的核对方式，`sqlite3` 的 `-header -column` 让输出带列名并对齐。
再插一笔不同类型的账，确认新分类出现在列表里且顺序正确。

::q `Scan` 聚合结果时，结构体字段名必须和什么对应？
::a 必须和 SQL 的列别名对应（如 `AS total` → `Total`）。GORM 按列名映射到字段，名字不匹配会得到零值且不报错——这类 bug 很隐蔽，必须靠断言测试发现。
::q 为什么总额要单独查一次 `COALESCE(SUM(amount),0)`？
::a 分类相加依赖两个查询条件完全一致，且如果存在 NULL 分类或被 `HAVING` 过滤的分类，结果会偏小。单独查一次语义明确、成本很低，也避免「部分之和 ≠ 总额」这种对不上账的问题。
::q 百分比为什么建议在服务端计算？
::a 保证所有客户端（Web、Android）得到一致结果，避免各自实现四舍五入造成显示差异。同时服务端能统一处理除零（总额为 0）这类边界，客户端只需渲染。
