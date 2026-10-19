<!--day 1-->
::pre 完成阶段四；现在 handler、service、store 都混在少数几个文件里。
::predict
```
internal/
  handler.go
  service.go
  store.go
  model.go
```
::ask 这个结构在「加一个新接口」时会遇到什么问题？
::ans 三个：① 文件会无限膨胀，`handler.go` 里同时有账目、分类、预算、导出的 handler，找代码靠搜索；② **看不到依赖方向**——`handler.go` 可以直接调 `store.go`，没人拦得住；③ 测试不好切分，测 handler 却要连带真数据库。按职责分目录（而不是按「层名」分文件）能让「谁能引用谁」在目录结构上可见，也便于用 `go list` 分析依赖。**目录结构不是审美，是约束的载体**。
::predict
```
internal/
  httpapi/     ← handler
  ledger/      ← service
  store/       ← repository
  model/       ← 共享类型
```
::ask `model` 包存在的理由是什么？如果不要它，会怎样？
::ans 如果没有 `model`，`store` 要返回 `[]Entry` 就得自己定义 `Entry`，而 `ledger` 也要 `Entry`——两份同名类型无法互通，接口实现不了（D8 讲过的类型不匹配）。放 `model` 让两边都依赖它，形成 `store → model`、`ledger → model` 的 DAG。**共享的领域类型必须下沉到最底层包**，这是打破循环依赖的标准手段。代价是 `model` 会变成「什么都往里放」的杂物间——要克制，只放真正跨层共享的结构。
::debug
```
internal/
  ledger/
    service.go      import "…/internal/store"
  store/
    sqlite.go       import "…/internal/ledger"   // 为了用 Entry
```
::sym `import cycle not allowed`。
::ask 除了抽 `model`，还有别的解法吗？各自代价？
::ans ① 抽 `model`（推荐）：两边都依赖它，环断了，语义清晰。② 在 `store` 里定义 `Entry`，`ledger` 依赖 `store`：能跑，但 `ledger` 被绑死在存储层，测试时无法脱离 store 包（连 fake 都得 import 它）。③ 用 `any` 或 map 传数据：彻底放弃类型安全，最差。**遇到循环依赖时，第一反应应该是「哪个类型放错了层」，而不是「怎么用接口绕过去」**——绕过只会把问题推到运行时。
::transfer
::scene 为这个项目设计完整的目录树，包含 `cmd/`、`internal/`、`migrations/`。
::ask 画出目录树，并标注每个包的「允许依赖谁」。
::hint 想想「谁能 import 谁」用一句话能不能说清。
::ans
```
cmd/ledger-api/main.go       → 只做装配：config → db → store → service → router
internal/
  config/     → 无内部依赖（只读环境变量/文件）
  model/      → 无内部依赖（纯结构体）
  store/      → model
  ledger/     → model, store(接口在自己的包里定义)
  httpapi/    → ledger, model（不 import store）
  platform/   → 日志、request id 等横切工具，无业务依赖
migrations/   → 纯 SQL，不参与编译
```
一句话规则：**依赖只能从上往下，横切工具不反向依赖业务**。`main` 是唯一知道所有具体实现的地方——它是「组装车间」，不写业务逻辑。验证方法：`go list -deps ./internal/httpapi | grep internal/` 看看有没有意外依赖。
::crit 目录按职责分，`main` 只做装配
::crit 有 `model` 包承载跨层共享类型，依赖图无环
::crit 能说出每个包「允许 import 谁」，并且实际代码符合
::crit `go list -deps` 能验证 httpapi 没有间接依赖 store

<!--day 2-->
::pre 完成 D1：目录骨架已定。
::predict
```go
// internal/ledger/service.go
type Store interface {
    Create(ctx context.Context, e model.Entry) (int64, error)
    Get(ctx context.Context, uid, id int64) (*model.Entry, error)
    List(ctx context.Context, uid int64, q Query) ([]model.Entry, int64, error)
    Update(ctx context.Context, e model.Entry) error
    Delete(ctx context.Context, uid, id int64) error
    Sum(ctx context.Context, uid int64, month string) ([]model.CategorySum, error)
}
```
::ask 这个接口放在 `ledger` 包（使用方）而不是 `store` 包，好处是什么？有什么代价？
::ans 好处：`ledger` 不依赖 `store`，测试时用 fake 实现即可，`store` 变成可替换的插件。代价：① `store` 包必须 import `ledger` 才能声明「我实现了它」——不行，那又成环了。实际做法是**不做显式断言**，靠 `main` 里赋值时编译检查（`var _ ledger.Store = (*store.SQLite)(nil)` 必须写在 `main` 或 `store` 里，写在 store 里就要 import ledger）。这是 Go 的一个真实痛点：接口在 A 包、实现在 B 包、断言又需要互相引用。折中：断言写在 `main.go`（它本来就依赖两边）。
::predict
```go
func New(db *sql.DB) *Service { ... }
func main() {
    db := openDB()
    svc := ledger.New(db)          // 直接传 db
}
```
::ask 这样「手动依赖注入」还剩下什么？问题在哪？
::ans 这不是注入，是把 `db` 直接塞进 `Service`——`ledger` 又依赖了 `*sql.DB`，之前的分层白做了。正确装配：`store := store.NewSQLite(db)`（store 包内部持有 db）→ `svc := ledger.New(store)`（ledger 只看到接口）→ `h := httpapi.New(svc)`。**依赖注入的本质是「高层不知道低层的具体类型」**，如果 `main` 里出现了 `sql.DB` 之外的存储细节（比如 GORM 的 `*gorm.DB`），说明注入点选错了。
::debug
```go
// main.go
svc := ledger.New(store.NewSQLite(db))
h := httpapi.New(svc)
// 测试 httpapi 时
h := httpapi.New(???)   // 要传真的 Service
```
::ask handler 测试为什么会卡住？怎么解？
::ans 因为 `httpapi.New` 接受 `*ledger.Service` 具体类型，测试必须构造真的 Service（连带真的 Store 和真数据库）。解法：`httpapi` 自己定义所需接口（比如 `type Ledger interface{ Create...; List... }`），`New(svc Ledger)`。这样测试传 fake 即可。**每个包都定义自己需要的接口**——`httpapi` 定义 `Ledger` 接口，`ledger` 定义 `Store` 接口，形成「层层向内收窄」的接口链。代价是接口变多，但每个都很小（3-6 个方法），整体反而更清晰。
::transfer
::scene 画出三层接口与实现的完整依赖关系，并说明 `main` 里装配的每一行。
::ask 写出 `main.go` 的装配代码，标注每行的作用。
::hint 从 config 开始，一路到 router。
::ans
```go
func main() {
    cfg, err := config.Load()                    // 1. 配置（失败即退出）
    if err != nil { log.Fatal(err) }

    db, err := store.Open(cfg.DBPath)            // 2. 连接池 + Ping
    if err != nil { log.Fatal(err) }
    defer db.Close()

    if err := store.Migrate(db); err != nil {    // 3. 迁移（部署时也可独立执行）
        log.Fatal(err)
    }

    repo := store.NewSQLite(db)                  // 4. 具体实现
    svc := ledger.New(repo)                      // 5. 依赖接口，不知道 SQLite
    h := httpapi.New(svc, cfg.JWTSecret)         // 6. 依赖接口，不知道 Service 实现
    srv := &http.Server{Handler: h.Router(), ... } // 7. 超时
}
```
关键点：**第 4 行之后，`db` 只出现在 `defer db.Close()` 里**，任何一层的函数签名都不该再出现 `*sql.DB`。这是「装配」与「业务」的分界线。
::crit 每个包定义自己所需的窄接口，不跨层引用具体类型
::crit `main` 只做装配，装配代码不超过 30 行且不含业务判断
::crit 编译期断言（`var _ X = (*Y)(nil)`）写在依赖双方都可见的位置
::crit 能为 handler 传入 fake，测试不需要真数据库

<!--day 3-->
::pre 完成 D2：接口与装配方案已定。
::predict
```go
// 重构前：handler 里有一句
if e.Amount <= 0 { Fail(w, 400, ...); return }
// 重构后搬到 service
func (s *Service) Create(ctx context.Context, in CreateInput) (int64, error) {
    if in.Amount <= 0 { return 0, &ValidationError{...} }
    ...
}
// 但 handler 里原来的 HTTP 校验没删
```
::ask 会发生什么？
::ans 重复校验，且**两处的错误响应可能不一致**（handler 返回 400/1001，service 返回 400/1002），前端无法预期。更糟的是维护时只改一处。重构的原则是「**搬移而不是复制**」：逻辑从 A 移到 B 后，A 处必须删掉。检查方法：重构后 grep 关键判断（`Amount <= 0`），应该只出现一次。**「复制粘贴式重构」是最常见的伪重构**，它让代码看起来分层了，实际规则有两份。
::predict
```go
// 重构前 handler: 查不到返回 404
if errors.Is(err, sql.ErrNoRows) { Fail(w, 404, ...) }
// 重构后 service 返回 sql.ErrNoRows 给 handler
```
::ask 这样分层干净吗？
::ans 不干净：`httpapi` 需要 import `database/sql` 才能判断 `ErrNoRows`，等于 HTTP 层依赖了存储层细节。正确做法：**service 把 `sql.ErrNoRows` 翻译成领域错误 `ledger.ErrNotFound`**，handler 只认领域错误。翻译发生在「跨越层边界」的地方，通常是 repository 或 service 的入口。**每一层只暴露自己语义的错误**，这样换存储实现时上层不用改。
::debug
```bash
# 重构后跑 smoke
curl -X POST /ledger -d '{"amount":0,...}'   # 期望 400
# 实际 500
```
::ask 最可能的原因是什么？
::ans service 返回了 `ValidationError`，但 handler 的错误映射还是旧的（只认 `sql.ErrNoRows` 和「其他 → 500」），所以校验错误掉进了 default → 500。重构时最容易漏的就是**错误映射这一层**：逻辑搬走了，映射没跟上。修法：先把错误映射写成表驱动/集中函数，重构后为每种错误类型各写一个测试用例（400/404/409/500 各一条）。**重构的安全网是「错误路径的测试」，不是「正常路径的 smoke」**。
::transfer
::scene 把 handler 里的业务逻辑搬到 service，你要保证「行为完全不变」。
::ask 列出你会做的检查（至少 5 条），并说明每条抓什么类型的问题。
::hint 从「错误语义、默认值、执行顺序、事务边界、日志」五个角度想。
::ans ① **错误语义**：`sql.ErrNoRows` 是否被翻译成 `ErrNotFound`（404 会变 500）；② **默认值**：`limit` 缺省 20 是否跟着搬了（不搬会变成 0，返回空列表）；③ **执行顺序**：原来「先校验再查库」，搬完是否变成「先查库再校验」（多一次查询 + 错误优先级变了）；④ **事务边界**：原来在 handler 里开事务，搬到 service 后是否还在同一事务（跨层事务最容易丢）；⑤ **日志与 request_id**：原来 handler 打的日志是否还在（丢了排查能力）。这五类都不会编译失败，只能靠对照测试抓。**重构前先写「行为快照」测试，重构后跑同一套**。
::crit handler 里搜不到业务判断（金额、分类、权限规则）
::crit service 返回领域错误，httpapi 不 import `database/sql`
::crit 重构前后同一套接口测试全部通过（含错误路径）
::crit 关键校验只出现一次（grep 验证没有复制残留）

<!--day 4-->
::pre 完成 D3：分层重构完成。
::predict
```go
db, err := gorm.Open(sqlite.Open("ledger.db"), &gorm.Config{})
```
::ask 这行代码建立连接了吗？连接池怎么配？
::ans `gorm.Open` 会**立即 Ping 一次**（除非 `DisableAutomaticPing: true`），所以比 `sql.Open` 更能暴露「连不上」。但连接池不在 GORM 层配，要取出底层 `*sql.DB`：
```go
sqlDB, err := db.DB()
sqlDB.SetMaxOpenConns(1)
sqlDB.SetMaxIdleConns(1)
sqlDB.SetConnMaxLifetime(0)
```
很多人只写 `gorm.Open` 就以为配好了，结果用的是 `database/sql` 的默认值（`MaxOpenConns` 无限制、`MaxIdleConns` 2），在 SQLite 上直接引发 BUSY。**GORM 是 `database/sql` 的上层封装，连接池永远是底层的事**。
::predict
```go
db, _ := gorm.Open(sqlite.Open("file:ledger.db?_pragma=busy_timeout(5000)"), &gorm.Config{
    Logger: logger.Default.LogMode(logger.Info),
})
// 生产环境
```
::ask 生产环境开 `logger.Info` 有什么问题？
::ans 会把**每一条 SQL 和参数**打到日志里，包括金额、备注等用户数据，还可能包含密码哈希（注册时）。后果：日志体积暴涨、隐私泄漏、性能下降（同步写日志）。生产应该用 `logger.Warn` 或 `logger.Error`，只在排查时临时开 Info。更稳妥的做法是接一个自定义 logger，把慢查询（> 200ms）单独记录。**「SQL 日志」和「用户数据」必须有边界**。
::debug
```go
db, _ := gorm.Open(sqlite.Open("ledger.db"), &gorm.Config{})
// 并发写入时
Error: database is locked (5) (SQLITE_BUSY)
```
::ask 除了设 `MaxOpenConns(1)`，还有哪些配置能缓解？
::ans ① DSN 加 `_pragma=busy_timeout(5000)`，让驱动等锁而不是立刻失败；② `_pragma=journal_mode(WAL)` 提升读并发（写仍串行）；③ `_pragma=foreign_keys(1)` 开启外键约束（SQLite 默认关闭，很多人不知道）；④ `_pragma=synchronous(NORMAL)` 在 WAL 下兼顾安全与性能。注意：**这些 pragma 要写在 DSN 里或用 `Exec` 在连接建立时执行**，写在 `gorm.Open` 之后可能只对当前连接生效，池里新连接不会继承。**连接级的配置必须通过 DSN，不能靠初始化时执行一次**。
::transfer
::scene 写一个 `store.Open(path string) (*gorm.DB, error)`，把上面所有配置固化进去。
::ask 写出实现，并说明每个配置的理由。
::hint 注意 DSN 拼接要处理已有参数的情况。
::ans
```go
func Open(path string) (*gorm.DB, error) {
    dsn := path + "?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)&_pragma=foreign_keys(1)&_pragma=synchronous(NORMAL)"
    db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Warn),   // 生产不打全量 SQL
        NowFunc: func() time.Time { return time.Now().UTC() },
    })
    if err != nil { return nil, fmt.Errorf("open db: %w", err) }

    sqlDB, err := db.DB()
    if err != nil { return nil, err }
    sqlDB.SetMaxOpenConns(1)      // SQLite 单写者，避免 BUSY
    sqlDB.SetMaxIdleConns(1)      // 保持连接常驻，避免反复打开文件
    sqlDB.SetConnMaxLifetime(0)   // 本地文件无服务端断连问题

    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()
    if err := sqlDB.PingContext(ctx); err != nil {
        return nil, fmt.Errorf("ping: %w", err)
    }
    return db, nil
}
```
每个配置都有理由，没有一行是「抄来的」：busy_timeout 防瞬时锁冲突、WAL 提读并发、foreign_keys 是 SQLite 默认关闭的坑、UTC 避免时区导致的「跨月」错误。
::crit 从 `db.DB()` 取出 `*sql.DB` 并显式配置三个池参数
::crit pragma 写在 DSN 里，不靠初始化时执行一次
::crit 生产日志级别不是 Info，不打印全量 SQL 与参数
::crit 启动时 `PingContext` 带超时，连不上立即失败

<!--day 5-->
::pre 完成 D4：GORM 已接入。
::predict
```go
type Entry struct {
    ID       int64
    UserID   int64
    Amount   int64
    Category string
    Date     time.Time
}
```
::ask 这个模型直接给 GORM 用，表名和列名会是什么？有什么问题？
::ans 表名默认是结构体的**复数蛇形**：`entries`（GORM 的命名策略）。列名是 `id`、`user_id`、`amount`、`category`、`date`。问题：① `Date time.Time` 在 SQLite 里会存成 `2026-10-19 00:00:00+00:00` 这种带时区的字符串，`LIKE '2026-10%'` 能用但范围比较和字符串比较混用容易出错；② 没有索引声明；③ 没有约束（金额 > 0）。**默认命名能跑，但「能跑」和「可控」是两回事**——生产模型应该显式写 tag。
::predict
```go
Amount int64 `gorm:"not null;check:amount > 0"`
Date   string `gorm:"type:text;index"`
```
::ask `check` 约束在 SQLite 上会生效吗？GORM 会自动建吗？
::ans `AutoMigrate` 会尝试创建 CHECK 约束，但 **SQLite 的 ALTER TABLE 能力有限**——对已存在的表加 CHECK 需要重建表，GORM 的 AutoMigrate 在 SQLite 上经常「静默跳过」这类变更（不报错但也没加上）。所以**约束必须写在迁移 SQL 里**，不能依赖 AutoMigrate。这也说明了 D10 为什么要用 goose：AutoMigrate 在 SQLite 上的行为不可靠，而迁移文件是确定的。
::debug
```go
type Entry struct {
    ID     int64 `gorm:"primaryKey"`
    Amount int64
}
// 查询
var e Entry
db.First(&e, 1)
// 但表里主键列叫 entry_id
```
::ask 什么时候会出现「列名和字段名不一致」？怎么避免？
::ans 当有人显式写了 `gorm:"column:entry_id"`，或者用了自定义 `NamingStrategy`（比如把 `ID` 映射成 `id` 之外的名字），或者表是从旧系统迁移来的。避免方式：**所有字段都显式写 `column` tag**，尤其是 `ID`、`UserID` 这种容易歧义的。显式写 tag 的另一个好处是：模型即文档，看代码就知道表结构长什么样，不用去查 GORM 的命名规则。**隐式约定在跨团队/跨时间时最贵**。
::transfer
::scene 设计 `Entry` 和 `User` 两个模型的完整 tag，包含主键、索引、约束、时间字段。
::ask 写出模型，并说明每个 tag 的作用与「不加会怎样」。
::hint 想查询会怎么用：按用户+日期、按分类聚合、软删除？
::ans
```go
type Entry struct {
    ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
    UserID    int64     `gorm:"not null;index:idx_user_date,priority:1" json:"-"`
    Amount    int64     `gorm:"not null" json:"amount"`                        // 分
    Category  string    `gorm:"type:text;not null;default:未分类" json:"category"`
    Date      string    `gorm:"type:text;not null;index:idx_user_date,priority:2" json:"date"` // YYYY-MM-DD
    Note      string    `gorm:"type:text" json:"note"`
    CreatedAt time.Time `gorm:"not null" json:"created_at"`
    UpdatedAt time.Time `gorm:"not null" json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
```
要点：**联合索引 `(user_id, date)` 用 `priority` 控制列顺序**（顺序错了索引失效）；`json:"-"` 挡住 `user_id` 与软删除字段外泄；`Date` 用 string 而不是 `time.Time`，避免 SQLite 的时区序列化问题；`Amount` 是 int64 存分。**每个 tag 都对应一个具体后果**，不是装饰。
::crit 每个字段都有显式 `column` 或明确的命名策略
::crit 联合索引用 `priority` 明确列顺序，且与查询的 WHERE 顺序一致
::crit 敏感/内部字段用 `json:"-"`，响应不外泄
::crit 知道 CHECK 约束在 SQLite 上要写迁移，不能依赖 AutoMigrate

<!--day 6-->
::pre 完成 D5：模型与 tag 已定。
::predict
```go
func (r *repo) Get(ctx context.Context, uid, id int64) (*model.Entry, error) {
    var e model.Entry
    if err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, uid).First(&e).Error; err != nil {
        return nil, err
    }
    return &e, nil
}
```
::ask 这段代码在「同一个 `*gorm.DB` 被多次复用」时会有什么风险？
::ans `WithContext` 返回的是一个**新的 `*gorm.DB` 实例**（clone），但它内部复用同一个 `Statement` 对象的部分状态。更关键的是：`r.db` 是全局单例，如果上游某处写了 `r.db.Where(...)` 并把这个返回值存起来复用，链式条件会**跨请求累积**（`Statement.Clauses` 被污染）。典型症状：A 查过一次 `user_id=1`，B 的查询莫名带上了 `user_id=1`。用 `Session(&gorm.Session{NewDB: true})` 可以彻底清空链式状态。
::predict
```go
tx := r.db.WithContext(ctx)
tx.Where("user_id = ?", uid).Find(&list)
tx.Where("amount > ?", 100).Find(&list2)
```
::ask 第二条查询的 WHERE 是什么？
::ans 是 `WHERE user_id = ? AND amount > 100`——**`tx.Where` 会修改 `tx` 自身的 Statement**，两次调用在同一个实例上累积。这是 GORM 最常见的一个陷阱：链式方法不是「返回新对象」，而是「修改当前对象并返回自己」（在非 `NewDB` 模式下）。所以要么每次都从 `r.db` 重新开始，要么用 `Session(NewDB: true)` 拿一个干净副本。**「链式调用会互相污染」这一条，能解释 80% 的 GORM 诡异查询**。
::debug
```go
func (r *repo) List(ctx context.Context, uid int64) ([]Entry, error) {
    var out []Entry
    tx := r.db.Session(&gorm.Session{NewDB: true, Context: ctx})
    return out, tx.Where("user_id = ?", uid).Find(&out).Error
}
// 但 ctx 已经在请求结束时取消了
// 下一个请求复用这个 session？
```
::ask 把带 `Context: ctx` 的 session 存到结构体里复用，会怎样？
::ans 那个 session 绑定的 ctx 在请求结束后被 cancel，之后所有用它的查询都会立刻返回 `context canceled`——**服务看起来「突然全挂了」，重启才恢复**。这正是「禁止把 ctx 存进长生命周期对象」的原因（D10 阶段四讲过）。正确做法：每次方法调用都用**当前请求的 ctx** 新建 session：
```go
tx := r.db.Session(&gorm.Session{NewDB: true, Context: ctx})
```
`ctx` 从参数来，生命周期与请求一致，用完即弃。**session 可以复用的是「配置」，不能复用的是「ctx」**。
::transfer
::scene 为 Repository 写一个统一的「取干净 session」辅助函数，并说明它解决的问题。
::ask 写出函数，列出它必须设置的字段与理由。
::hint 想想 `NewDB`、`Context`、`Logger` 三个字段。
::ans
```go
func (r *repo) session(ctx context.Context) *gorm.DB {
    return r.db.Session(&gorm.Session{
        NewDB:   true,   // 清空链式条件，杜绝跨请求/跨语句污染
        Context: ctx,    // 绑定请求作用域，随取消传播到驱动层
        Logger:  r.log,  // 统一日志（可选，便于慢查询追踪）
    })
}
```
解决的问题：① **条件残留**——`NewDB: true` 保证每次从干净状态开始；② **取消传播**——`Context: ctx` 让 SQL 在客户端断开时尽快结束；③ **观测**——统一 logger 便于统一加慢查询阈值。用 `session(ctx)` 替代 `r.db.WithContext(ctx)` 后，「链式污染」和「ctx 不传播」两类问题同时消失。**把正确的用法固化成唯一的入口，比靠每个人记得怎么写可靠**。
::crit Repository 所有方法都通过统一的 `session(ctx)` 取 DB，不直接用 `r.db`
::crit `NewDB: true` 与 `Context: ctx` 同时设置，能解释各自解决什么
::crit 没有把带 ctx 的 session/DB 存进结构体或包级变量
::crit 能复现「链式条件污染」，并说明 `NewDB` 为什么能解决

<!--day 7-->
::pre 完成 D6：已用统一 session。
::predict
```go
// 实验：观察 WithContext 是否清空链式条件
base := db.Where("user_id = ?", 1)
a := base.WithContext(ctx).Where("amount > ?", 100).Find(&x)
b := base.WithContext(ctx).Find(&y)
```
::ask `b` 的 SQL 里有没有 `amount > 100`？
::ans 没有。`WithContext` 内部是 `Session(&Session{Context: ctx})`，它在 clone 时会**复制当前 Statement**，但 `NewDB` 为 false 意味着**保留已有的链式条件**。所以 `b` 会带 `user_id = 1`（来自 base），但不带 `amount > 100`（那是 a 自己的分支）。关键点：**`WithContext` 解决「ctx 绑定」，不解决「条件隔离」**；`NewDB: true` 才解决后者。两者是正交的，必须一起用。
::predict
```go
a := db.Session(&gorm.Session{NewDB: true}).Where("user_id = ?", 1)
b := a.Where("amount > ?", 100)
```
::ask `b` 的 WHERE 有几条？`a` 会不会被 `b` 影响？
::ans `b` 有两条（`user_id` + `amount`）；`a` **会**被影响——因为 `b := a.Where(...)` 修改的是 `a` 的 Statement（非 NewDB 模式下 clone 是浅拷贝共享 Statement）。想真正隔离，`b` 也必须从 `Session(NewDB: true)` 开始，或者用 `a.Session(&gorm.Session{})`（空 Session 会 clone 出独立 Statement）。**这就是为什么「统一 session() 入口」比「记住什么时候该 clone」更可靠**。
::debug
```go
// 用 Debug 观察真实 SQL
tx := db.Session(&gorm.Session{NewDB: true, Context: ctx})
tx.Debug().Where("user_id = ?", 1).Find(&a)
tx.Debug().Where("amount > ?", 100).Find(&b)
```
::ask 第二条 SQL 里会不会有 `user_id = 1`？
::ans 不会——因为每次都从 `NewDB: true` 的 session 开始（这里 `tx` 是同一个变量，但 `Where` 返回新 clone？不，`tx.Where()` 修改 `tx`）。这里有歧义，必须实测。**结论取决于 `tx` 是否被 `Where` 修改**：在 GORM v2 中，`tx.Where()` 在 `NewDB` session 上会 clone 出新实例（因为 `clone == 1` 时先 clone），所以 `tx` 本身不被修改。但这是实现细节，**不要依赖**——正确做法是每次调用都重新 `r.session(ctx)`，而不是复用中间变量。
::transfer
::scene 设计一个对照实验，用可观察的证据证明 `Session{NewDB, Context}` 优于 `WithContext`。
::ask 实验步骤、观察指标、预期结论分别是什么？
::hint 用 `db.Debug()` 或 `DryRun` 拿到 SQL；用 `context.WithCancel` 验证取消传播。
::ans
**实验一（条件隔离）**：
```go
base := db.Where("user_id = ?", 1)
x := base.Session(&gorm.Session{Context: ctx}).Where("amount > 100")
fmt.Println(x.Debug().Find(&[]Entry{}).Statement.SQL.String())   // 观察是否含两条
y := base.Session(&gorm.Session{NewDB: true, Context: ctx}).Where("amount > 100")
fmt.Println(y.Debug().Find(&[]Entry{}).Statement.SQL.String())   // 观察是否只有 amount
```
**实验二（取消传播）**：`ctx, cancel := context.WithCancel(...)`，开一个 `Find` 后 10ms 内 cancel，看是否返回 `context canceled`（真连接下有效，`DryRun` 无效）。
**指标**：生成的 SQL 文本、错误值。
**结论**：`NewDB` 决定条件是否继承，`Context` 决定取消是否传播，二者正交。
**证据形态**：把两段 SQL 打出来存成测试断言——**不是"我知道它更好"，而是"这段代码证明了它不一样"**。
::crit 能用 `Debug()`/`DryRun` 打出真实 SQL 作为证据
::crit 能说出 `WithContext` 与 `Session{NewDB}` 各自解决什么问题（正交）
::crit 理解「链式方法会修改当前实例」，不依赖实现细节
::crit 用 `context.WithCancel` 验证了取消确实传播到驱动

<!--day 8-->
::pre 完成 D6-D7：session 用法正确。
::predict
```go
// 把金额改成 0
db.Model(&Entry{}).Where("id = ?", 1).Updates(Entry{Amount: 0})
```
::ask 金额会被改成 0 吗？
::ans 不会。`Updates` 用结构体时**默认忽略零值字段**（0、""、false、nil），所以 `Amount: 0` 被跳过，SQL 里根本没有 `amount` 这一列。这是 GORM 最著名的坑之一。修法：① 用 map：`Updates(map[string]any{"amount": 0})`；② 用 `Select("amount").Updates(...)` 显式指定字段。**「更新为 0」和「不更新」在结构体里长得一样**，必须用 map 或 Select 区分。
::predict
```go
type Entry struct {
    Amount   int64
    Category string
}
db.Model(&Entry{}).Where("id = ?", 1).Updates(map[string]any{
    "amount":   3550,
    "category": "",
})
```
::ask `category` 会被更新成空字符串吗？
::ans 会。map 形式不忽略零值，`""` 会被写入。这正好和结构体形式相反——**同一个方法，两种入参，两套零值语义**。所以选择哪种形式要明确：想「只更新非零字段」用结构体（比如 PATCH 语义），想「精确设置每个字段」用 map（比如 PUT 语义）。混用会导致「明明传了空值却没生效」或「没想清空却被清空」。
::debug
```go
db.Model(&Entry{}).Where("id = ?", id).Updates(Entry{Amount: amount, Category: cat})
// amount 传 0（用户改成 0 元，业务上非法但校验漏了）
// 结果：更新成功，但 amount 没变
// 而且 RowsAffected = 1（因为 category 变了或没变？）
```
::ask `RowsAffected` 能用来判断「记录是否存在」吗？
::ans **不能**。SQLite 的 `UPDATE` 即使没有实际改变值，`RowsAffected` 也可能返回匹配行数（取决于驱动实现）；而 GORM 在「无字段可更新」时可能返回 0。用「`RowsAffected == 0` 判断不存在」在 UPDATE 上是不可靠的。正确做法：先 `SELECT` 确认存在（在同一事务里），或用 `UPDATE ... WHERE id = ? AND user_id = ?` 后**再查一次**。`DELETE` 的 `RowsAffected` 相对可靠（删了就是 1，没删就是 0）。**「影响行数」的语义在不同数据库/驱动上不一致，不要用它做业务判断**。
::transfer
::scene 实现 PATCH 语义的更新：只更新请求里出现的字段。
::ask 用结构体还是指针还是 map？怎么区分「没传」和「传了零值」？
::hint 想想 `*int64` 的 nil 与指向 0。
::ans 用**指针字段的 DTO**：
```go
type UpdateInput struct {
    Amount   *int64  `json:"amount"`
    Category *string `json:"category"`
    Note     *string `json:"note"`
}
```
`nil` = 没传（不更新），`&0` = 传了 0（要更新成 0，但业务上非法 → 校验拒绝）。构造 map 时只放非 nil 的字段：
```go
updates := map[string]any{}
if in.Amount != nil { updates["amount"] = *in.Amount }
if in.Category != nil { updates["category"] = *in.Category }
```
这样「没传」和「传了零值」在类型层面就分开了。**PATCH 的正确实现必须能表达「字段缺席」**，结构体做不到，指针可以。
::crit 更新为 0/空串时用 map 或 `Select`，不用裸结构体
::crit 知道 map 与结构体的零值语义相反，能说出各自适用场景
::crit 不用 `RowsAffected` 判断记录是否存在
::crit PATCH 用指针字段区分「未传」与「传了零值」

<!--day 9-->
::pre 完成 D8：CRUD 可用。
::predict
```go
func (r *repo) Transfer(ctx context.Context, from, to int64, cents int64) error {
    return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
        if err := tx.Exec("UPDATE ... WHERE id = ?", from).Error; err != nil { return err }
        return tx.Exec("UPDATE ... WHERE id = ?", to).Error
    })
}
```
::ask 事务内的 `tx` 有没有绑定调用方的 ctx？
::ans **没有**。`Transaction` 的回调收到的是 `tx`，它继承的是 `r.db` 的配置，**不会自动带上你 `WithContext(ctx)` 的 ctx**（GORM 的 `Transaction` 内部会创建新 session）。所以在事务内调用 `tx.Exec` 时，取消信号传不到驱动——客户端断开了，事务还在跑。修法：在回调里第一步 `tx = tx.WithContext(ctx)`，或者用 `r.db.Session(&gorm.Session{Context: ctx}).Transaction(...)` 并确认 ctx 被继承（实测）。**「事务内的 ctx 要显式补」是 GORM 的一个真实陷阱**。
::predict
```go
err := db.Transaction(func(tx *gorm.DB) error {
    if err := tx.Create(&a).Error; err != nil { return err }
    if err := tx.Create(&b).Error; err != nil { return err }
    return nil
})
```
::ask 如果第二个 `Create` 失败，第一个会回滚吗？如果回调里 panic 呢？
::ans 第二个返回 err → `Transaction` 自动 rollback，第一个不会留下。**panic 也会 rollback**（GORM 在 defer 里有 recover，rollback 后重新 panic）。这是 `Transaction` 相比手写 `Begin/Commit` 的优势：**回滚路径由框架保证，不依赖你记得写 `defer tx.Rollback()`**。但要注意：回调里如果启动了 goroutine 并让它用 `tx`，那个 goroutine 不受事务生命周期管理——**事务内不要起异步任务**。
::debug
```go
db.Transaction(func(tx *gorm.DB) error {
    tx.Create(&a)             // 错误没检查
    return tx.Create(&b).Error
})
```
::ask 这样写有什么问题？
::ans 如果 `a` 的 Create 失败（比如约束冲突），错误被忽略，`b` 成功，事务提交——**a 没写进去但整体成功了**。事务只保证「返回值非 nil 才回滚」，不检查你内部是否吞了错误。**事务里的每一步都必须检查 error 并 return**，否则事务就是个摆设。这是「事务不等于原子性」的另一种形态：原子性依赖你正确地使用它。
::transfer
::scene 实现「创建账目 + 更新预算已用额度」的双写操作。
::ask 事务边界怎么划？预算更新失败时创建要回滚吗？给出决策与理由。
::hint 想「这两个写操作在业务上是不是一个整体」。
::ans 在同一个事务里：
```go
err := r.session(ctx).Transaction(func(tx *gorm.DB) error {
    tx = tx.WithContext(ctx)              // 补 ctx
    if err := tx.Create(&e).Error; err != nil { return err }
    if err := tx.Model(&Budget{}).
        Where("user_id = ? AND category = ? AND month = ?", uid, e.Category, month).
        UpdateColumn("used", gorm.Expr("used + ?", e.Amount)).Error; err != nil {
        return err
    }
    return nil
})
```
理由：预算的「已用」是账目的派生数据，两者不一致会让用户看到错误的剩余额度。**派生数据要么在同一事务里更新，要么干脆不存（每次实时算）**。家庭账本数据量小，其实更推荐「不存 used，统计时 SUM」——少一个一致性负担。**如果可以选择不冗余，就不要冗余**。
::crit 事务回调内显式补 `WithContext(ctx)`
::crit 事务内每一步都检查 error 并 return，不吞错
::crit 知道 panic 会自动回滚，但事务内不起异步 goroutine
::crit 能判断「哪些写操作必须同事务」，并考虑过「不冗余」的替代方案

<!--day 10-->
::pre 完成 D4-D9：GORM 已能跑通。
::predict
```go
// migrations/00001_init.up.sql
CREATE TABLE entries (...);
-- +goose Down
DROP TABLE entries;
```
::ask 少了什么标记会让 goose 不认这个文件？
::ans 缺少 `-- +goose Up` 标记。goose 要求文件里明确分区：
```sql
-- +goose Up
CREATE TABLE entries (...);

-- +goose Down
DROP TABLE entries;
```
`Up` 段是迁移执行的内容，`Down` 段是回滚。如果只有 `Down` 没有 `Up`，goose 会报「no Up statements」。另外文件名要符合 `NNNNN_name.sql` 格式（如 `00001_create_entries.sql`），编号决定执行顺序。**goose 靠「标记 + 文件名」两个约定工作，缺一个就跑不起来**。
::predict
```sql
-- +goose Up
ALTER TABLE entries ADD COLUMN budget_id INTEGER NOT NULL DEFAULT 0;
-- +goose Down
ALTER TABLE entries DROP COLUMN budget_id;
```
::ask 在 SQLite 上这两条都能执行吗？
::ans `ADD COLUMN` 可以（SQLite 3.35+ 支持 `DROP COLUMN`，更早版本不支持）。**SQLite 的 ALTER TABLE 能力非常有限**：不能改列类型、不能加约束、不能改主键。所以「加一个 NOT NULL 且无默认值的列」会失败（已有行没值）；「删列」在旧版本要重建表。这就是为什么 SQLite 的迁移经常写成「建新表 → 拷数据 → 删旧表 → 重命名」四步。**写 SQLite 迁移前先确认：这条 ALTER 在当前版本支持吗？**
::debug
```bash
goose -dir migrations sqlite3 ledger.db up
# Error: failed to parse migration: no Up statements
```
::ask 除了缺 `-- +goose Up`，还有哪些原因？
::ans ① 标记写成了 `-- +goose up`（**大小写敏感**，必须 `Up`）；② 标记前后有空行问题（goose 要求标记独占一行）；③ 文件里有 BOM 或 CRLF 导致匹配失败（Windows 编辑器常见）；④ 文件名不符合 `NNNNN_` 前缀，goose 直接跳过。排查：`goose status` 看它识别了哪些文件；`file migrations/*.sql` 看编码。**「迁移没执行」先看 goose 有没有识别到这个文件**，不要先怀疑 SQL。
::transfer
::scene 设计项目的迁移序列：初始化表、加索引、加分类表、加预算表。
::ask 写出文件名与每个文件的核心 SQL，说明顺序理由。
::hint 索引要不要单独一个文件？为什么？
::ans
```
00001_create_users.sql           -- users + email 唯一索引
00002_create_entries.sql         -- entries（不含索引）
00003_add_entries_index.sql      -- (user_id, date) 联合索引
00004_create_categories.sql      -- 分类表 + 默认分类种子数据
00005_create_budgets.sql         -- 预算表 + (user_id, category, month) 唯一
```
顺序理由：**先建表再加索引**（索引依赖表存在）；**种子数据放在建表之后**（否则插入失败）；**每个迁移只做一件事**（回滚时能精确撤销）。索引单独成文件的好处是：可以在生产上单独评估「加索引会不会锁表」，而不是和建表混在一起。**迁移文件是「生产变更的单据」，一条变更一张单据**。
::crit 迁移文件有 `-- +goose Up` 与 `-- +goose Down`，文件名符合 `NNNNN_`
::crit 每个迁移只做一件事，能独立回滚
::crit 知道 SQLite 的 ALTER 限制，需要改结构时用「重建表」四步法
::crit 种子数据放在建表之后，且可重复执行（`INSERT OR IGNORE`）

<!--day 11-->
::pre 完成 D10：迁移文件已就绪。
::predict
```go
db.AutoMigrate(&model.User{}, &model.Entry{})
// 换成
//go:embed migrations/*.sql
var migrationsFS embed.FS
goose.SetBaseFS(migrationsFS)
goose.Up(sqlDB, "migrations")
```
::ask `go:embed` 的路径相对于什么？为什么这个方案适合单二进制部署？
::ans 相对于**包含该指令的 .go 文件所在目录**。`go:embed migrations/*.sql` 写在 `internal/store/migrate.go` 里，就会找 `internal/store/migrations/`——通常路径不对。要么把迁移目录放在同目录下，要么用 `//go:embed all:migrations` 配合 `embed.FS` 的子目录。好处：**SQL 文件被打进二进制，部署时只需要一个可执行文件**，不需要额外拷贝 migrations 目录——这对「家用小主机 + 单容器」场景非常合适。
::predict
```go
// 启动时自动迁移
if err := migrate(db); err != nil { log.Fatal(err) }
// 但多个副本同时启动
```
::ask 多个实例同时跑迁移会怎样？
::ans 可能冲突：两个实例同时执行 `ALTER TABLE`，一个成功一个报错（「列已存在」「表已存在」）→ 启动失败。SQLite 有写锁，第二个会等或 BUSY。修法：① **迁移作为部署的独立步骤**（`docker compose run --rm migrate`），应用启动只检查版本不执行；② 或者用 goose 的锁机制（`goose.WithLock`，但 SQLite 支持有限）；③ 家庭账本单实例部署，可以接受「启动时迁移」，但要明确写下这个前提。**「启动时自动迁移」在单实例下方便，在多副本下是事故源**。
::debug
```bash
goose -dir ./migrations sqlite3 ledger.db up
# 应用启动后又报：no such column: deleted_at
```
::ask 迁移执行了，为什么应用还报列不存在？
::ans ① **迁移连的不是同一个库**：goose 用 `ledger.db`（相对当前 shell 的 CWD），应用用的是绝对路径或容器内另一个路径——两个不同的文件；② **迁移只执行了一部分**（某个文件失败，goose 停在那里，后续没跑）；③ 应用的 GORM 模型里有 `deleted_at` 但迁移文件里忘了加这一列（模型先行，迁移没跟上）。排查：`goose status` 看版本号，`sqlite3 db '.schema entries'` 看实际列。**「迁移跑过了」要以「目标库的实际结构」为准，不是以「命令没报错」为准**。
::transfer
::scene 写一个「迁移 + 启动」的部署流程，保证结构变更可控。
::ask 单实例与多实例分别怎么做？给出命令。
::hint 单实例可以启动时迁移，多实例必须独立步骤。
::ans
**单实例（家庭部署）**：
```bash
# 启动时自动跑（幂等，goose 记录版本）
./ledger-api --migrate-only   # 可选：先单独跑一次
./ledger-api
```
**多实例 / 容器**：
```yaml
services:
  migrate:
    image: ledger-api:latest
    command: ["/app/ledger-api", "--migrate-only"]
    volumes: ["./data:/data"]
    restart: "no"
  api:
    image: ledger-api:latest
    depends_on:
      migrate:
        condition: service_completed_successfully
```
关键：**迁移用一次性容器跑完退出，API 等它成功再启动**。这样迁移失败时 API 不会带着旧结构启动，问题在部署阶段就暴露。`--migrate-only` flag 让同一个镜像承担两个角色，不需要额外镜像。
::crit 用 `go:embed` 把迁移打进二进制，部署只需一个文件
::crit 生产不用 `AutoMigrate`，迁移是结构变更的唯一入口
::crit 多实例场景迁移是独立步骤，不是启动时自动执行
::crit 「迁移成功」以目标库实际结构为准（`goose status` + `.schema`）

<!--day 12-->
::pre 完成 D10-D11：迁移可用。
::predict
```go
type Category struct {
    ID     int64  `gorm:"primaryKey"`
    UserID int64
    Name   string
}
type Entry struct {
    CategoryID int64
    Category   Category `gorm:"foreignKey:CategoryID"`
}
db.Preload("Category").Find(&entries)
```
::ask `Preload` 会生成几条 SQL？
::ans 两条：先查 entries，再 `SELECT * FROM categories WHERE id IN (...)`。这是「1+N 变 2」的优化（相比逐行查）。但 `Preload` 只支持「一对多/多对一」的预加载，如果是多对多还要 `Preload("Tags")` 再来一条。**`Preload` 不是 JOIN，是第二条查询 + 内存关联**，所以它不会因为 JOIN 导致行数膨胀，但也无法用 JOIN 的条件过滤。
::predict
```go
// 账目表存 category 字符串（现状）
// 改成 category_id 外键
```
::ask 这个改动会影响哪些地方？值得做吗？
::ans 影响：① 所有 `WHERE category = ?` 要变成 `JOIN categories` 或先查 id；② 统计 SQL 的 `GROUP BY category` 要改成 `GROUP BY category_id` 再关联名字；③ 历史数据要迁移（字符串 → id，未知分类要自动创建）；④ 前端接口的字段可能变（`category` 从名字变成 id）。**代价不小，收益是「改分类名不用改所有账目」+「分类可以有颜色/图标」**。家庭账本如果只有十几个固定分类，字符串足够；如果要用户自定义分类且允许改名，就该上外键。**判断标准：分类是不是一个「有生命周期的实体」**。
::debug
```go
db.Create(&entry)   // entry.CategoryID = 5（不存在的分类）
// 成功
```
::ask 为什么没报外键错误？
::ans SQLite **默认不开启外键约束**，即使建表时写了 `REFERENCES`。必须 `PRAGMA foreign_keys = ON`（且是连接级的，每次连接都要设）。GORM 的 sqlite 驱动可以通过 DSN 的 `_pragma=foreign_keys(1)` 开启。没开的话，`category_id=5` 指向不存在的行也能插入，数据完整性靠应用层保证——而应用层总会漏。**「写了外键」不等于「有外键约束」，SQLite 是唯一需要显式打开的主流数据库**。
::transfer
::scene 决定用外键还是保留字符串分类，给出决策文档。
::ask 列出决策依据（至少 4 条），并给出你的选择和迁移方案。
::hint 从「是否改名、是否有元数据、数据量、查询复杂度」想。
::ans
| 维度 | 字符串 | 外键 |
| 分类改名 | 要 UPDATE 全表 | 改一行 |
| 元数据（颜色/图标/预算） | 无处放 | 自然扩展 |
| 查询复杂度 | 简单 | 需 JOIN |
| 历史数据迁移 | 无 | 需一次性转换 |
**选择**：家庭账本先保留字符串，但把「分类」抽成独立表（只有 `id/name/user_id`），账目存 `category_id`——**为将来的元数据留位置**。迁移步骤：① 建 categories 表并从现有 entries 的 distinct category 生成种子；② entries 加 `category_id` 列；③ `UPDATE entries SET category_id = (SELECT id FROM categories WHERE name = entries.category)`；④ 校验无 NULL；⑤ 保留 `category` 列一个版本作为回滚保险，下个版本删。**迁移要能回滚，就别在同一次变更里删旧列**。
::crit 知道 SQLite 默认不启用外键，必须 DSN 开 `_pragma=foreign_keys(1)`
::crit 理解 `Preload` 是第二条查询，不是 JOIN
::crit 能判断「分类该不该独立成表」，并说出判据
::crit 数据迁移有「先加列、回填、校验、后删旧列」的步骤，可回滚

<!--day 13-->
::pre 完成 D5-D12：模型与关联就绪。
::predict
```go
type CategorySum struct {
    Category string
    Total    int64
}
var out []CategorySum
db.Model(&Entry{}).
    Select("category, SUM(amount) as total").
    Where("user_id = ? AND date >= ? AND date < ?", uid, start, end).
    Group("category").
    Scan(&out)
```
::ask `Scan` 到自定义结构体时，字段名怎么对应？
::ans GORM 按**列名 → 字段名**的蛇形映射：列 `total` 对应字段 `Total`，列 `category` 对应 `Category`。如果 SQL 里写 `SUM(amount) AS total_amount`，字段要叫 `TotalAmount`。**不对应时不会报错，只会是零值**——这是最隐蔽的一类 bug。防法：给字段加 `gorm:"column:total"` 显式指定，或 aliases 与字段名严格一致。
::predict
```go
db.Model(&Entry{}).Where("date LIKE ?", month+"%").Group("category").Count(&n)
```
::ask 这条能拿到「每个分类的条数」吗？
::ans 不能。`Count` 是聚合整个结果集，配合 `Group` 时 GORM 的行为是「返回组数」或拼出不合法的 SQL，取决于版本。要分组计数必须显式 `Select("category, COUNT(*) as cnt").Group("category").Scan(&out)`。**`Count` 只适合「总数」，分组统计必须用 `Select + Group + Scan`**。
::debug
```go
var total int64
db.Model(&Entry{}).Where("user_id = ?", uid).Select("SUM(amount)").Scan(&total)
// total 一直是 0
```
::ask 为什么？
::ans `Scan` 到 `int64` 时，GORM 期望的是一行一列，但 `Select("SUM(amount)")` 的列名是 `SUM(amount)`，而 `Scan(&int64)` 会尝试按位置/名称匹配——通常能工作，但在某些版本/驱动下匹配失败就是 0。更可靠：`Select("COALESCE(SUM(amount), 0) AS total").Scan(&total)` 或 `Row().Scan(&total)`。另外**空集时 `SUM` 返回 NULL，扫进 int64 会失败或得 0**，必须 COALESCE。**聚合查询的「空集」是最容易漏的边界**。
::transfer
::scene 实现 `/summary?month=2026-10`：返回总额、笔数、按分类小计、最大值。
::ask 用一条 SQL 还是多条？写出结构与响应 JSON。
::hint 一条 SQL 能否同时算出「总体」和「分组」？
::ans 用两条更清晰：
```go
// 总体
type Totals struct {
    Total int64 `gorm:"column:total"`
    Count int64 `gorm:"column:cnt"`
    Max   int64 `gorm:"column:max_amount"`
}
db.Model(&Entry{}).Select("COALESCE(SUM(amount),0) AS total, COUNT(*) AS cnt, COALESCE(MAX(amount),0) AS max_amount").
    Where(...).Scan(&totals)

// 分项
var byCat []CategorySum
db.Model(&Entry{}).Select("category, COALESCE(SUM(amount),0) AS total, COUNT(*) AS cnt").
    Where(...).Group("category").Order("total DESC").Scan(&byCat)
```
响应：`{month, total, count, max, by_category:[{category,total,count,ratio}]}`。`ratio` 在应用层算（避免 SQL 里除零）。**「一条 SQL 干完」看起来优雅，但可读性和可维护性往往更差**；两条简单查询加起来也就多一次往返。
::crit 分组统计用 `Select + Group + Scan`，不用 `Count`
::crit 聚合列加 `COALESCE`，空月份返回 0
::crit 自定义结构体字段与别名严格对应，或显式写 `column` tag
::crit 响应含总额/笔数/分类小计，比例在应用层计算

<!--day 14-->
::pre 完成 D13：统计接口可用。
::predict sql
```sql
EXPLAIN QUERY PLAN
SELECT category, SUM(amount) FROM entries
WHERE user_id = 1 AND date >= '2026-10-01' AND date < '2026-11-01'
GROUP BY category;
```
::ask 你希望看到什么？看到 `SCAN entries` 意味着什么？
::ans 希望看到 `SEARCH entries USING INDEX idx_user_date (user_id=? AND date>? AND date<?)`。如果看到 `SCAN entries`，说明**全表扫描**——索引没用上。常见原因：① 索引列顺序是 `(date, user_id)` 而不是 `(user_id, date)`；② 条件里对列做了函数运算（`strftime('%Y-%m', date) = ?`），索引失效；③ 类型不匹配（`user_id` 存成 TEXT，条件传 int）。**`EXPLAIN QUERY PLAN` 是唯一可靠的「索引到底有没有用」的证据**，不要靠猜。
::predict
```sql
-- 索引 (user_id, date)
WHERE user_id = 1 AND strftime('%Y-%m', date) = '2026-10'
```
::ask 这个查询能用上索引吗？
::ans 不能（`date` 部分用不上）。因为索引存的是 `date` 的原始值，而 `strftime(date)` 是**函数运算后的值**，SQLite 无法用索引直接定位。它只能用 `user_id` 做前缀过滤，然后逐行算 `strftime`。这就是为什么一直强调「用半开区间而不是 LIKE/函数」——**任何对索引列的函数包装都会让索引失效**（除非建表达式索引，SQLite 支持但与查询写法强耦合）。
::debug bash
```bash
# 12 万行数据
time sqlite3 ledger.db "SELECT ... WHERE user_id=1 AND date>='2026-10-01'..."
# real 0.4s
```
::ask 有索引但还是很慢，可能是什么原因？
::ans ① **索引没被用上**（先 `EXPLAIN` 确认）；② **回表代价高**：索引只含 `user_id,date`，但查询要 `category,amount`，每行都要回表——如果一个月有 1 万行，就是 1 万次随机读；③ **统计本身贵**：`SUM + GROUP BY` 要遍历所有匹配行，这是 O(n) 的，索引帮不了聚合；④ **SQLite 的页缓存太小**（`PRAGMA cache_size`）。优化方向：覆盖索引 `(user_id, date, category, amount)` 让查询不回表；或者预先聚合到月度汇总表（物化视图思路）。**「加了索引还是慢」通常是因为索引没覆盖查询需要的列**。
::transfer
::scene 给统计接口做一次性能验证，证明索引有效。
::ask 写出验证步骤与判定标准。
::hint 对比「有索引/无索引」的 EXPLAIN 与耗时。
::ans
```bash
# 1. 造 10 万行数据（脚本插入，避免手写）
# 2. 记录无索引基线
sqlite3 db "DROP INDEX IF EXISTS idx_user_date;"
sqlite3 db "EXPLAIN QUERY PLAN SELECT ..."        # 期望 SCAN
time sqlite3 db "SELECT ..." > /dev/null          # 记录耗时

# 3. 建索引，再测
sqlite3 db "CREATE INDEX idx_user_date ON entries(user_id, date);"
sqlite3 db "EXPLAIN QUERY PLAN SELECT ..."        # 期望 SEARCH USING INDEX
time sqlite3 db "SELECT ..." > /dev/null          # 应明显下降

# 4. 验证「函数包装会让索引失效」
sqlite3 db "EXPLAIN QUERY PLAN SELECT ... WHERE strftime('%Y-%m',date)='2026-10'"  # 期望回退 SCAN
```
判定：**有索引必须是 `SEARCH`，耗时至少降一个数量级**；函数包装那条必须变回 `SCAN`（这是反向验证，证明你理解原因）。把四段 EXPLAIN 输出贴进验收报告。
::crit 用 `EXPLAIN QUERY PLAN` 确认走的是 `SEARCH` 而非 `SCAN`
::crit 能解释「函数包装索引列导致失效」，并演示
::crit 有「无索引 vs 有索引」的耗时对比数据
::crit 知道覆盖索引能避免回表，能说出何时需要

<!--day 15-->
::pre 完成 D3-D14：分层与业务已完成。
::predict
```go
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
    id, err := h.svc.Create(r.Context(), in)
    if err != nil {
        switch {
        case errors.Is(err, ledger.ErrNotFound): Fail(w, 404, 1002, "...")
        case errors.Is(err, ledger.ErrForbidden): Fail(w, 403, 2002, "...")
        default: Fail(w, 500, 5001, "内部错误")
        }
    }
}
```
::ask 每个 handler 都这样写，有什么问题？
::ans ① 重复几十遍，改一处状态码要改所有 handler；② 容易漏某个错误类型，导致「本该 400 的变成 500」；③ handler 变长，业务逻辑被错误处理淹没。更好的做法：**handler 只 `return err`，由统一中间件转换**。用 `func(w, r) error` 签名 + 外层包装：
```go
type HandlerFunc func(http.ResponseWriter, *http.Request) error
func (h *Handler) wrap(fn HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if err := fn(w, r); err != nil { h.writeError(w, r, err) }
    }
}
```
**错误映射只写一次，行为全局一致**。
::predict
```go
func (h *Handler) writeError(w http.ResponseWriter, r *http.Request, err error) {
    var ve *ledger.ValidationError
    if errors.As(err, &ve) {
        Fail(w, 400, 1001, ve.Msg)
        return
    }
    slog.Error("request failed", "err", err, "req_id", reqID(r.Context()))
    Fail(w, 500, 5001, "内部错误")
}
```
::ask 这段有什么问题？
::ans ① 顺序有隐患：`ValidationError` 如果被 `fmt.Errorf("%w")` 包装过，`errors.As` 仍能命中（正确）；但 `ErrNotFound` / `ErrConflict` 等哨兵没处理，会全部落到 500。② **500 的响应里没有 `request_id`**——用户报障时你无法定位。③ `slog.Error` 只打了 `err`，没打方法/路径/用户，排查时缺少上下文。修法：完整映射所有领域错误，500 响应带 `request_id`，日志补齐字段。**「内部错误」对用户是黑盒，对运维必须是白盒**。
::debug
```bash
curl -X POST /ledger -d '{"amount":0}'
# {"code":5001,"message":"内部错误"}  ← 期望 1001 参数错误
```
::ask 怎么快速定位是哪一步把 ValidationError 变成了 500？
::ans ① 在 `writeError` 入口打日志 `slog.Debug("map error", "type", fmt.Sprintf("%T", err), "err", err)`，看实际类型；② 常见原因：service 返回的是 `fmt.Errorf("validate: %v", err)`（用 `%v` 而不是 `%w`），包装链断了，`errors.As` 找不到；③ 或者 handler 里 `if err != nil { return fmt.Errorf("create: %w", err) }` 后又在上层被 `errors.New(err.Error())` 重建了一个错误（彻底断链）。**`%v` 和 `%w` 一字之差，决定了错误能否被识别**。
::transfer
::scene 建立完整的错误处理体系，从 service 到 HTTP 响应。
::ask 列出错误类型、映射表、以及「哪些信息给用户、哪些只进日志」。
::hint 想 4xx 与 5xx 的信息披露策略差异。
::ans
| 错误 | HTTP | code | 给用户的信息 | 日志 |
| `ValidationError` | 400 | 1001 | 字段名 + 中文提示 | 完整 |
| `ErrNotFound` | 404 | 1002 | 资源不存在 | 路径 + uid |
| `ErrForbidden` | 403 | 2002 | 无权访问 | 路径 + uid + 资源 id |
| `ErrConflict` | 409 | 3001 | 冲突原因 | 完整 |
| `ErrUnauthorized` | 401 | 2001 | 登录已失效 | 原因（expired/invalid） |
| 其他 `error` | 500 | 5001 | **只给 request_id** | 完整堆栈 + 上下文 |
原则：**4xx 说清「你哪里错了」（帮用户改正）；5xx 什么也不说（防信息泄漏），只给 request_id**。所有 `%w` 包装保留链，映射用 `errors.Is/As`。**不要让 `err.Error()` 直接进 4xx 响应**——它可能包含内部字段名甚至 SQL 片段。
::crit handler 统一 `return error`，映射只在一处
::crit 全部错误用 `errors.Is/As` 分类，无 `%v` 包装断链
::crit 500 响应只含 request_id，不含内部细节
::crit 4xx 的提示是「可操作的中文」，不是原始错误

<!--day 16-->
::pre 完成 D15：错误处理已统一。
::predict
```go
slog.Info("create entry", "user_id", uid, "amount", e.Amount)
```
::ask 这条日志在排查「某个用户说创建失败」时够用吗？
::ans 不够：① 没有 `request_id`，无法和同一次请求的其他日志（HTTP 访问日志、SQL 日志）串起来；② 没有时间戳格式约定（slog 默认带，但要看 handler 配置）；③ 没有结果（成功/失败、耗时）。完整的一条应该是：`slog.Info("create entry", "req_id", rid, "uid", uid, "amount", e.Amount, "entry_id", id, "dur_ms", 12)`。**日志字段的设计目标是「能回答一个具体问题」**，不是「记录尽可能多的东西」。
::predict
```go
// middleware
rid := uuid.NewString()
ctx := context.WithValue(r.Context(), reqIDKey, rid)
w.Header().Set("X-Request-ID", rid)
next.ServeHTTP(w, r.WithContext(ctx))
```
::ask 这个中间件缺了什么关键输出？
::ans 缺**请求完成时的汇总日志**（方法、路径、状态码、耗时、rid）。只有响应头带 ID 不够——出问题时你要能「按 rid 搜日志」，而不是「按时间翻日志」。应该在 `defer` 里输出：
```go
start := time.Now()
defer func() {
    slog.Info("http", "req_id", rid, "method", r.Method, "path", r.URL.Path,
        "status", rw.status, "dur_ms", time.Since(start).Milliseconds())
}()
```
并且用包装过的 `ResponseWriter` 拿到真实状态码（D14 阶段三讲过）。
::debug
```go
slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))
// 日志里出现
{"time":"...","level":"ERROR","msg":"db error","err":"UNIQUE constraint failed: users.email"}
```
::ask 这条日志有什么问题？怎么改？
::ans ① `err` 是字符串，**结构化日志里错误应该保持 error 类型**（`slog.Any("err", err)`），否则丢失了类型信息（无法判断是 ValidationError 还是 DB 错误）；② 没有 `req_id`，无法关联；③ `UNIQUE constraint failed: users.email` 这种底层错误对排查有用，但需要补「哪个用户/哪次请求」；④ 缺少 level 之外的上下文（handler 名）。修法：`slog.Error("create user failed", "err", err, "req_id", rid, "email_hash", hashEmail(email))`——注意邮箱要哈希或掩码，不能明文。**结构化日志的价值在于「字段可被查询」，不是「JSON 好看」**。
::transfer
::scene 定义日志规范：哪些级别、哪些字段、哪些禁止。
::ask 写出规范，并给出一个 500 请求的完整日志链（从进入到结束）。
::hint 一次请求应该有几条日志？
::ans **级别**：`Debug` 开发用（SQL、参数）；`Info` 请求完成、启动/关闭、迁移；`Warn` 可恢复异常（重试、降级、慢查询 > 500ms）；`Error` 需要人介入（5xx、panic、连不上库）。**字段**：`req_id`（必有）、`method`、`path`、`status`、`dur_ms`、`uid`、`err`、`msg`。**禁止**：密码、token、Cookie、完整请求体、SQL 参数原值、完整邮箱/手机号。
**一次 500 的日志链**：
```
INFO  http  req_id=abc method=POST path=/api/v1/ledger status=201 dur_ms=18 uid=7
ERROR entry create failed  req_id=abc uid=7 amount=3550 err="UNIQUE constraint failed"
INFO  http  req_id=abc ... status=500 dur_ms=21
```
三条共用一个 `req_id`，能用一条命令 `grep abc` 拉出全链路。**这就是 request_id 的全部意义**。
::crit 每条请求日志都有 `req_id`，且响应头也返回同一个
::crit 500 场景能用 `grep req_id` 拉出「进入 → 错误 → 结束」完整链
::crit 日志里没有密码/token/完整邮箱
::crit 错误用 `slog.Any("err", err)` 保留类型，不转字符串

<!--day 17-->
::pre 完成 D15-D16；service 层已稳定。
::predict
```go
func TestCreate(t *testing.T) {
    svc := newTestService(t)
    id, err := svc.Create(ctx, CreateInput{Amount: 100, Category: "餐饮", Date: "2026-10-19"})
    if err != nil { t.Fatal(err) }
    if id == 0 { t.Fatal("id 应为非零") }
}
```
::ask 这个测试有几个问题？
::ans ① 只测了「happy path」，没有错误分支；② 断言太弱（`id != 0` 不能证明「存进去的是这条数据」）；③ 用了真实时间 `2026-10-19`，如果业务有「不允许未来日期」的校验，测试会随时间失效（今天是 2026-10-19，明天就变未来）；④ 每次跑都插入数据，多次运行可能撞唯一约束。**表驱动 + 固定时间 + 每例独立数据**是三条基本功。
::predict
```go
cases := []struct{
    name string
    in   CreateInput
    wantErr error
}{
    {"金额为0", CreateInput{Amount: 0}, ErrValidation},
    {"金额为负", CreateInput{Amount: -1}, ErrValidation},
}
for _, c := range cases {
    t.Run(c.name, func(t *testing.T) {
        _, err := svc.Create(ctx, c.in)
        if !errors.Is(err, c.wantErr) { t.Fatalf("got %v want %v", err, c.wantErr) }
    })
}
```
::ask 这个表驱动测试缺了什么？
::ans ① 没有 `t.Parallel()`（表驱动常配并行，但要注意共享状态）；② 每个 case 没有独立的 service/store（前一个 case 的写入会影响后一个）；③ `wantErr` 用 `err` 类型比较，但如果是 `ValidationError`（需要 `errors.As`）就不适用；④ 没有覆盖「合法输入」的正例——只有反例的测试无法证明「正常路径没坏」。**表驱动不是「把 if 换成 for」，每行 case 要有独立的夹具与明确的断言**。
::debug bash
```bash
go test ./internal/ledger -run TestCreate -v
# --- FAIL: TestCreate/金额为0
#     got <nil> want validation error
```
::ask 测试挂了，是测试错了还是代码错了？
::ans 先看**代码是否真的校验了 0**。如果 service 的 `Create` 里只写了 `if in.Amount < 0`，那 0 确实能通过——**测试发现了真实 bug**。如果代码有校验但错误类型不匹配（比如返回 `errors.New("金额必须大于0")` 而不是 `ValidationError`），那是「代码行为对、契约不对」，要统一错误类型。**测试失败时第一反应是「代码错了」，不是「改测试让它过」**——后者是把测试变成装饰。
::transfer
::scene 为 `Create` 写完整的表驱动测试。
::ask 列出至少 8 个 case，并说明每个覆盖什么风险。
::hint 从「金额、分类、日期、备注、权限、重复」六个维度想。
::ans
| case | 输入 | 期望 | 覆盖 |
| 正常 | 100/餐饮/2026-10-01 | 成功，能查回 | 主路径 |
| 金额 0 | 0 | ValidationError | 边界 |
| 金额负 | -1 | ValidationError | 边界 |
| 金额超大 | 1e12 | ValidationError | 溢出/误输 |
| 分类空 | "" | ValidationError | 必填 |
| 分类超长 | 100 字 | ValidationError | 长度 |
| 日期格式错 | "2026/10/01" | ValidationError | 格式 |
| 日期未来 | 明天 | ValidationError | 业务规则 |
| 备注超长 | 200 字 | ValidationError | rune 长度 |
| 用户隔离 | uid=2 查 uid=1 的 | ErrNotFound | 越权 |
十个 case 覆盖六类风险，每个都有明确断言（错误类型 + 关键字段）。**测试的价值在于「它能挡住哪一类回归」**，所以每个 case 都要能说出「如果这行代码被改坏，是哪个 case 报警」。
::crit 表驱动覆盖主路径 + 至少 6 类错误分支
::crit 每个 case 有独立数据，测试可重复运行
::crit 断言具体（错误类型、字段值），不只断言 `err != nil`
::crit 测试失败时先判断「代码错还是测试错」，不改测试来迁就 bug

<!--day 18-->
::pre 完成 D17：service 测试已写。
::predict
```go
req := httptest.NewRequest("POST", "/ledger", strings.NewReader(`{"amount":100}`))
rec := httptest.NewRecorder()
h.Create(rec, req)
// 检查
if rec.Code != 201 { t.Fatal(rec.Code) }
```
::ask 这个测试有什么问题？
::ans ① 没设 `Content-Type: application/json`，如果 handler 检查了它，测试会失败；② 没有注入 uid（`r.Context()` 里没有认证信息），handler 会 401；③ 没有断言响应体内容；④ `httptest.NewRequest` 的 body 是 `io.Reader`，如果 handler 读两次就会失败（真实请求也一样，这是好事）。修法：用 helper 构造「已认证的请求」：
```go
func authedRequest(method, path string, body string, uid int64) *http.Request {
    r := httptest.NewRequest(method, path, strings.NewReader(body))
    r.Header.Set("Content-Type", "application/json")
    return r.WithContext(context.WithValue(r.Context(), uidKey, uid))
}
```
::predict
```go
h := httpapi.New(fakeLedger{})   // fake 返回 ErrNotFound
req := httptest.NewRequest("GET", "/ledger/1", nil)
rec := httptest.NewRecorder()
h.Get(rec, req)
// 期望 404，实际 200
```
::ask 为什么 fake 返回了 ErrNotFound 但状态码是 200？
::ans 可能原因：① fake 的方法签名与接口不匹配，实际调用的是嵌入的零值方法（返回 nil）；② handler 里错误被忽略（`e, _ := svc.Get(...)`）；③ `writeError` 没被调用（直接 `OK(w, e)` 了）。**这类「fake 没生效」的问题，最有效的排查是让 fake 记录「被调用了没有」**：在 fake 里加 `called bool`，测试断言 `fake.called == true`。**否则你可能在测一个空实现**。
::debug
```go
// 测试里
OK(w, nil)
// 断言
var resp map[string]any
json.NewDecoder(rec.Body).Decode(&resp)
if resp["code"].(float64) != 0 { ... }
```
::ask 这段断言有什么脆弱之处？
::ans ① `resp["code"].(float64)` 直接断言，字段缺失时 panic（测试崩而不是失败，报错信息不友好）；② 用 `map[string]any` 断言，绕过了类型检查——如果响应结构改了（`code` 变成 string），只有运行时才发现；③ 没检查 HTTP 状态码。更好：定义与 API 一致的响应结构体（或复用 DTO），解码到结构体，断言具体字段：
```go
type envelope struct {
    Code int `json:"code"`
    Data struct{ ID int64 `json:"id"` } `json:"data"`
}
var got envelope
json.NewDecoder(rec.Body).Decode(&got)
if got.Code != 0 || got.Data.ID == 0 { ... }
```
::transfer
::scene 为 5 个 handler 写测试，其中 3 个需要认证、2 个是公开的。
::ask 怎么组织代码避免重复？给出 helper 设计。
::hint 用一个 `do(t, handler, req)` 返回 `(status, envelope)`。
::ans
```go
func do(t *testing.T, h http.HandlerFunc, req *http.Request) (int, envelope) {
    t.Helper()
    rec := httptest.NewRecorder()
    h(rec, req)
    var env envelope
    if rec.Body.Len() > 0 {
        if err := json.NewDecoder(rec.Body).Decode(&env); err != nil {
            t.Fatalf("响应不是合法 JSON: %v, body=%s", err, rec.Body.String())
        }
    }
    return rec.Code, env
}

func newReq(method, path, body string, uid int64) *http.Request { ... }
// 使用
code, env := do(t, h.Create, newReq("POST", "/ledger", `{...}`, 7))
if code != 201 { t.Fatalf("status=%d body=%+v", code, env) }
```
两个 helper 消掉所有重复；`t.Helper()` 让失败行号指向调用处而不是 helper 内部；解码失败时把 body 打出来（否则你只知道「不是 JSON」，不知道实际返回了什么）。**测试 helper 的质量决定了写测试的痛苦程度**。
::crit 请求构造包含 Content-Type 与认证上下文
::crit fake 记录调用情况，测试断言「确实调用了」
::crit 响应解码到结构体，不裸断言 `map[string]any`
::crit helper 用 `t.Helper()`，失败信息包含 status 与 body

<!--day 19-->
::pre 完成 D17-D18：service 与 handler 测试已写。
::predict
```go
db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
// 两个测试同时跑
```
::ask `cache=shared` 的内存库有什么问题？
::ans 所有用同一个 DSN 的连接**共享同一个内存数据库**——测试之间会互相污染（A 测试插入的数据 B 测试能查到），并行跑时更乱。正确做法：每个测试用**唯一名字**的内存库：`file:test_<uuid>?mode=memory&cache=shared`，并在 `t.Cleanup` 里关闭连接（连接关光后内存库自动销毁）。或者用临时文件：`filepath.Join(t.TempDir(), "test.db")`——更简单，且能验证真实的文件行为（WAL、权限）。
::predict
```go
func newTestRepo(t *testing.T) *repo {
    db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), ...)
    db.AutoMigrate(&model.Entry{})
    return &repo{db: db}
}
```
::ask 用 `AutoMigrate` 建测试表，有什么风险？
::ans 风险是**测试用的表结构与生产不一致**：生产的表由迁移文件创建（含 CHECK、索引、默认值），`AutoMigrate` 建出来的可能少了 CHECK（D5 讲过 SQLite 上 AutoMigrate 会跳过），于是「生产会拒绝的数据，测试能插入」。这会让测试通过但线上失败。正确做法：**测试里跑真实的迁移文件**（`goose.Up` 指向 embed 的 migrations），保证结构与生产完全一致。**测试夹具应该复用生产路径，而不是另建一套**。
::debug
```go
r := newTestRepo(t)
r.Create(ctx, entry1)
var got []model.Entry
r.List(ctx, 1, Query{Month: "2026-10"})
// got 为空
```
::ask 数据明明插了，为什么查不到？
::ans 常见三个原因：① **时间格式**：`entry.Date` 存的是 `2026-10-19`，但查询用 `time.Time` 做条件，序列化后带时分秒，`>= 2026-10-01 00:00:00` 与 `2026-10-19` 字符串比较出问题；② **月份边界算错**：`start/end` 用了 `AddDate(0,1,0)` 但时区不对；③ **每个测试用了不同的内存库**（DSN 里带了随机名），插入和查询连的不是同一个。排查：在测试里 `db.Debug()` 打出插入和查询的 SQL，直接看条件值。**「查不到」永远先看生成的 SQL**。
::transfer
::scene 设计 Repository 测试的夹具策略。
::ask 用内存库还是临时文件？迁移怎么跑？每个测试怎么隔离？
::hint 考虑「WAL 行为、并发、清理」三点。
::ans **推荐临时文件**：`path := filepath.Join(t.TempDir(), "test.db")`。理由：① 行为与生产一致（WAL、文件锁、权限）；② `t.TempDir()` 自动清理，不需要手动删；③ 能跑并发测试（内存 shared cache 在并发下容易出诡异问题）。迁移用真实文件：
```go
func newTestRepo(t *testing.T) (*repo, *gorm.DB) {
    t.Helper()
    db, err := Open(filepath.Join(t.TempDir(), "test.db"))
    if err != nil { t.Fatal(err) }
    if err := Migrate(db); err != nil { t.Fatal(err) }
    t.Cleanup(func() { sqlDB, _ := db.DB(); sqlDB.Close() })
    return &repo{db: db}, db
}
```
**每个测试一个库文件**，天然隔离；**跑真实迁移**，结构与生产一致；`t.Cleanup` 兜底关闭，避免句柄泄漏导致 `t.TempDir` 删不掉。
::crit 每个测试用独立数据库（临时文件或唯一命名的内存库）
::crit 测试跑真实迁移文件，不用 `AutoMigrate`
::crit `t.Cleanup` 关闭连接，无句柄泄漏
::crit 「查不到」时会用 `Debug()` 看真实 SQL，不靠猜

<!--day 20-->
::pre 完成 D17-D19：三层测试都有。
::predict bash
```bash
go test ./... -cover
# internal/httpapi   45.2%
# internal/ledger    78.1%
# internal/store     12.3%
```
::ask 看到 store 只有 12%，第一反应应该是什么？
::ans 不是「赶紧补到 80%」，而是问：**store 里哪些代码没被测到？那些代码的风险高吗？** 如果没覆盖的是「SQL 拼接的正常路径」，风险高；如果是「错误分支的参数校验」，可能由 service 测试间接覆盖。覆盖率是**发现盲区的工具**，不是 KPI——为了数字写「调用一下不断言」的测试，等于自欺欺人。
::predict bash
```bash
go test ./internal/httpapi -coverpkg=./internal/ledger,./internal/store -coverprofile=c.out
go tool cover -func=c.out | tail -5
```
::ask `-coverpkg` 的作用是什么？不加会怎样？
::ans 不加时，覆盖率只统计**被测包自己**的代码——handler 测试里调用了大量 service 代码，但这些行不算进 httpapi 的覆盖率，于是数字虚低，你会误以为「handler 测试没覆盖业务」。加 `-coverpkg=...` 后，service/store 里被 handler 测试执行到的行也算进来，能看出「handler 测试实际覆盖了多少下层逻辑」。**「跨包覆盖」才是有意义的数字**。
::debug bash
```bash
go test -race ./...
# ok
go test -race -count=10 ./internal/ledger
# WARNING: DATA RACE
```
::ask 为什么跑一次没问题，跑十次就报？
::ans 竞态是**概率性**的：单次运行时两个 goroutine 恰好没重叠，跑十次总有一次撞上。`-count=10` 是「用重复换概率」的标准手段。另一个可能是测试之间有共享状态（比如包级变量），`-count` 让第二次运行时状态已被第一次污染——**这也是为什么要每个测试独立夹具**。排查：看 race 报告里的两个栈，一个是测试代码，一个是被测代码，就知道是谁在并发写。
::transfer
::scene 为整个项目定一套测试策略，说明「哪些必须测、哪些不必」。
::ask 给出优先级排序和理由，并说明覆盖率目标怎么定。
::hint 按「出错后的后果」排序，不按「代码行数」。
::ans
| 优先级 | 内容 | 理由 | 目标 |
| P0 | 金额计算/单位换算 | 错一分就是投诉 | ~100% |
| P0 | 数据隔离（user_id） | 错就是越权 | ~100% |
| P0 | 认证与密码 | 错就是安全事故 | ~100% |
| P1 | 错误到状态码映射 | 错会掩盖故障 | 90%+ |
| P1 | 统计/聚合 | 错就是账不对 | 90%+ |
| P2 | 参数校验 | 错是体验问题 | 80% |
| P3 | 配置解析/日志格式 | 错影响运维 | 尽力 |
**覆盖率目标按包定，不设全局数字**：`ledger` 85%+、`httpapi` 80%+、`store` 70%+（SQL 的极端分支难测）。**「P0 100%」比「全局 80%」有意义得多**。
::crit 用 `-coverpkg` 看跨包覆盖，不只看单包数字
::crit `-race -count=10` 至少跑一次，能复现概率性竞态
::crit 覆盖率目标按风险分层，P0 项接近 100%
::crit 不写「调用一下不断言」的凑数测试

<!--day 21-->
::pre 完成 D13：统计接口可用（预算为 stretch goal）。
::predict
```go
// 添加账目时检查预算
var b Budget
db.Where("user_id=? AND category=? AND month=?", uid, cat, month).First(&b)
if b.Amount > 0 && used + e.Amount > b.Amount {
    return ErrBudgetExceeded
}
```
::ask 这个检查有什么问题？
::ans ① **并发下会漏判**：两个请求同时读到 `used = 900`，各自加 100 都判定「没超 1000」，实际到了 1100；② `used` 从哪来？如果每次 `SUM` 查，成本高；如果存字段，又要维护一致性；③ 超预算时**要不要阻止写入**？家庭账本里「超预算是提醒」而不是「禁止记账」——禁止会导致用户记不了账，反而更糟。正确做法：**超预算时写入成功，但响应里带 `budget_exceeded: true` 标志**。**「预算」是提示性约束，不是硬约束**。
::predict
```go
// 用 CHECK 约束做硬限制
ALTER TABLE entries ADD CONSTRAINT chk_budget CHECK (...)
```
::ask 能这么干吗？
::ans 不能：① CHECK 约束只能引用同一行的列，无法聚合其他行（不知道「本月已用多少」）；② SQLite 不支持给已有表加 CHECK（要重建表）；③ 预算按月变化，约束无法表达。**跨行的业务规则必须由应用层（或数据库触发器）实现，CHECK 只管单行内的约束**（比如 `amount > 0`）。
::debug
```bash
curl -X POST /ledger -d '{"amount":5000,"category":"餐饮"}'
# 预算 3000，超出
# 响应 200，但没有任何提示
```
::ask 用户怎么知道超预算了？
::ans 不知道——如果响应里没有标志，前端无法提示。修法：在创建响应里加字段：
```json
{"code":0,"data":{"id":42,"budget":{"limit":3000,"used":8000,"exceeded":true}}}
```
或者提供独立的 `GET /budget/status?month=` 让前端主动查。**「提示」必须有一条明确的数据通道**，不能指望用户自己算。另外前端提示文案要说清「超了多少」，而不只是「超预算」。
::transfer
::scene 设计预算功能的最小可用版本（stretch goal）。
::ask 表结构、检查时机、响应字段分别是什么？哪些可以不做？
::hint 最小版本 = 能设预算 + 能判断超没超。
::ans
**表**：`budgets(id, user_id, category, month, amount)`，唯一索引 `(user_id, category, month)`。
**检查时机**：创建/更新账目后，在同一事务里 `SUM` 当月该分类，再与预算比。**不做「预扣」**（那需要复杂的回滚），只做「事后判断」。
**响应**：创建响应带 `budget: {limit, used, exceeded}`。
**可以不做**：① 预算的时间维度继承（每月自动复制上月预算）；② 分档提醒（80%/100%）；③ 预算调整的历史记录。**先把「设了预算 → 记账时能看到超没超」这条主路径跑通**，其余都是增量。
::crit 超预算不阻止写入，只返回标志（说明这是提示性约束）
::crit 预算是「事后 SUM 判断」，不做预扣/预留
::crit 响应里有明确的 `budget` 字段（limit/used/exceeded）
::crit 能说出最小版本的边界（哪些明确不做）

<!--day 22-->
::pre 完成 D13-D14：统计接口可用。
::predict
```go
rows, _ := db.Query("SELECT date, amount, category, note FROM entries WHERE ...")
w.Header().Set("Content-Type", "text/csv")
w.Write([]byte("date,amount,category,note\n"))
for rows.Next() {
    var d, c, n string
    var a int64
    rows.Scan(&d, &a, &c, &n)
    fmt.Fprintf(w, "%s,%d,%s,%s\n", d, a, c, n)
}
```
::ask 这段 CSV 导出有什么问题？
::ans ① **没有 CSV 转义**：备注里有逗号、引号、换行时，整个文件列错位。必须用 `encoding/csv` 的 `Writer`，它负责加引号、转义、处理换行。② **金额单位**：导出 `3550` 还是 `35.50`？给用户看的应该是元，但 Excel 会把 `35.50` 当数字（可能丢末尾零）。③ **没有 `Content-Disposition`**，浏览器可能直接显示而不是下载。④ **编码**：Excel 打开 UTF-8 CSV 可能乱码，需要 BOM（`\ufeff`）——但加了 BOM 会影响程序解析。**CSV 看起来简单，但转义/编码/单位每个都能出问题**。
::predict
```go
fmt.Fprintf(w, "%s,%s\n", date, note)   // note = "午饭,和同事"
```
::ask Excel 打开后这一行有几列？
::ans 三列（`午饭` 和 `和同事` 被拆开）。`encoding/csv` 遇到含逗号的字段会自动加双引号：`2026-10-19,"午饭,和同事"`。如果字段本身含双引号，会写成 `""` 转义。**手写 CSV 迟早会错，永远用标准库**。
::debug
```bash
curl -o out.csv '/ledger/export?month=2026-10'
# 文件大小正确，但 Excel 打开只有一列，内容是 "date,amount,..."
```
::ask 为什么？
::ans 可能原因：① **`Content-Type` 设成了 `text/plain`**，Excel 按纯文本处理不分列——应该 `text/csv; charset=utf-8`；② 文件的换行是 `\n` 而 Excel（Windows）期望 `\r\n`，导致整个文件被当成一行；③ 用了 `\t` 分隔却命名为 csv。前两个最常见。`encoding/csv` 默认用 `\n`，可以 `w.UseCRLF = true` 修复。**「导出文件打不开」先检查分隔符和换行符**。
::transfer
::scene 实现全量加载版 CSV 导出（stretch goal 的第一版）。
::ask 写出 handler 骨架，说明为什么全量加载在这个量级可接受。
::hint 家庭账本一个月的记录有多少条？
::ans
```go
func (h *Handler) Export(w http.ResponseWriter, r *http.Request, uid int64) error {
    entries, err := h.svc.ListAll(r.Context(), uid, month)   // 全量
    if err != nil { return err }
    w.Header().Set("Content-Type", "text/csv; charset=utf-8")
    w.Header().Set("Content-Disposition", `attachment; filename="ledger-`+month+`.csv"`)
    cw := csv.NewWriter(w)
    cw.UseCRLF = true
    defer cw.Flush()
    cw.Write([]string{"日期", "金额(元)", "分类", "备注"})
    for _, e := range entries {
        cw.Write([]string{e.Date, formatCents(e.Amount), e.Category, e.Note})
    }
    return cw.Error()
}
```
可接受的理由：家庭账本一个月最多几百条，一条 `Entry` 约 100 字节，全量加载不到 100KB。**「流式」是为了「数据量可能无限」的场景，不是所有导出的默认姿势**——先算一下最坏情况的内存占用，再决定要不要复杂化。
::crit 用 `encoding/csv` 而不是手拼字符串，含逗号/引号/换行的字段正确
::crit `Content-Type: text/csv; charset=utf-8` + `Content-Disposition` 触发下载
::crit 金额导出为「元」且保留两位小数（用整数拼接，不用浮点）
::crit 能算出全量加载的最坏内存，判断是否可接受

<!--day 23-->
::pre 完成 D22：CSV 全量导出可用。
::predict
```go
// 流式
rows, _ := db.Query("SELECT ...")
for rows.Next() {
    cw.Write(record)
    cw.Flush()          // 每行 flush
}
```
::ask 每行 `Flush` 有什么问题？
::ans ① **性能差**：每次 Flush 都可能触发一次 write 系统调用，1 万行就是 1 万次；② **响应可能已经发送**：一旦开始写 body，后面的错误就无法再改状态码（客户端会收到「200 + 截断的文件」）。正确做法：用 `bufio.Writer` 或让 `csv.Writer` 自己缓冲（它内部有 bufio，只需要在**最后** Flush），中途不 Flush。代价是「客户端看到的进度不是实时的」，但 CSV 下载不需要实时。**流式的关键是「内存有界」，不是「逐行刷盘」**。
::predict
```go
// 流式导出中途数据库出错
for rows.Next() { ... }
return rows.Err()   // 此时已经写了 3 万行
```
::ask 客户端会收到什么？
::ans 收到 **HTTP 200 + 一个不完整的 CSV 文件**。因为响应头已经发出，无法改成 500。这是流式导出的固有缺陷。缓解手段：① 在开始写之前先做一次「轻量预检」（比如 `COUNT(*)` 确认数据可读），降低中途失败概率；② 在文件末尾写一个「结束标记」行（如 `# END`），客户端/导入方可以校验完整性；③ 明确告知用户「如果文件不完整请重试」。**流式导出必须在「内存」和「错误可恢复性」之间做取舍**，没有两全。
::debug
```bash
curl -o out.csv '/ledger/export?month=2026-10'
wc -l out.csv    # 5001
# 但数据库里有 8000 条
```
::ask 少了的 3000 条去哪了？怎么排查？
::ans 可能原因：① **查询本身有限制**（比如默认 `LIMIT 5000`，或者分页参数没传对）；② **`rows.Next()` 提前结束**：数据库连接中断，`rows.Err()` 有错误但被忽略；③ **写入端提前断开**：客户端超时/取消，`csv.Write` 返回错误但没检查。排查：`rows.Err()` 必须检查；`cw.Error()` 必须检查；日志里记录「导出行数 vs 期望行数」。**「导出条数不对」必须有对账，不能让用户自己数**。
::transfer
::scene 决定这个项目到底用全量还是流式。
::ask 给出决策与判据，并说明如果将来要改流式，接口要不要变。
::hint 想想「多少条数据会让全量加载出问题」。
::ans **决策：先用全量**。判据：单条 `Entry` 约 120 字节，1 万条约 1.2MB，10 万条约 12MB——家庭账本一个月不会超过 1 万条，全量完全可接受。**触发改造的阈值**：单次导出内存超过 50MB（约 40 万条），或导出耗时超过 5 秒。改造时**接口不变**（还是 `GET /ledger/export?month=`），只换内部实现——这正是「先定契约、后优实现」的好处。如果现在就上流式，你会为一个不会发生的问题付出复杂度。
::crit 流式实现只在最后 `Flush`，不逐行刷
::crit 知道流式导出中途失败无法改状态码，有缓解措施
::crit 检查 `rows.Err()` 与 `cw.Error()`，并记录导出行数
::crit 能说出「什么时候该从全量换成流式」的具体阈值

<!--day 24-->
::pre 完成 D1-D23：后端功能基本齐。
::predict
```json
// 前端问：创建账目时 amount 传什么？
// 后端答：分
// 前端又问：那列表返回的呢？
```
::ask 如果接口文档没写清单位，会发生什么？
::ans 前端把「分」当「元」显示，35.5 元显示成 3550 元；或者前端传元、后端当分存，35.5 变成 0.355 元。这类 bug 的特点是**不会报错，只会数字不对**，而且往往在用户投诉后才发现。必须在文档里对每个金额字段标注单位：`amount_cents`（字段名自带单位）比 `amount` + 注释更可靠。**「字段名承载语义」比「文档承载语义」更不容易失效**。
::predict
```json
// 响应
{"code":0,"data":{"items":[...],"total":45}}
// 前端问：total 是「当前页条数」还是「总条数」？
```
::ask 这种歧义怎么系统性避免？
::ans ① **命名精确**：`page_size` / `total_count` / `has_more`，不用 `total`/`count`/`size` 这种多义字段；② **文档给出示例**（含具体数字）；③ **提供 OpenAPI 描述**，让前端能生成类型；④ 联调时前端按文档写，发现不一致立刻改文档而不是「口头约定」。**接口字段的命名是契约的核心，含糊的名字会持续产生误解**。
::debug
```bash
# 前端联调时
POST /api/v1/ledger  → 404
GET  /ledger         → 200
```
::ask 一个带前缀一个不带，问题出在哪？
::ans 路由注册不一致：有的写在 `/api/v1` 前缀下，有的直接挂根路径。修法：**统一用一个 base path 常量**，所有路由注册都基于它：
```go
const base = "/api/v1"
mux.HandleFunc("POST "+base+"/ledger", h.Create)
```
或者用子 mux + `StripPrefix`。**路径前缀不能靠每个人记得写**，否则必然漏。同理，前端也应该把 baseURL 收敛到一个配置项。
::transfer
::scene 写一份「前端联调准备」的接口清单。
::ask 清单里必须包含哪些内容？给出一个接口的完整条目示例。
::hint 想前端实现一个页面需要哪些信息。
::ans 每条包含：**路径与方法、是否需要认证、请求字段（名/类型/单位/必填/约束）、响应字段（含义）、错误码列表、curl 示例**。
示例：
```markdown
### POST /api/v1/ledger  创建账目（需认证）
请求：{ "amount_cents": 3550, "category": "餐饮", "date": "2026-10-19", "note": "午饭" }
- amount_cents: int64, 必填, 1 ~ 10000000（分）
- category: string, 必填, 1-20 字符
- date: string, 必填, YYYY-MM-DD, 不晚于今天
响应 201：{ "code": 0, "data": { "id": 42, "budget": {...} } }
错误：1001 参数错误 / 2001 未登录 / 3001 疑似重复
curl: curl -X POST ... -H "Authorization: Bearer $T" -d '{...}'
```
**「单位、必填、范围」三样缺一不可**，它们是联调时 80% 问题的来源。
::crit 所有金额字段名带单位（`_cents`），文档标注
::crit 路由前缀统一用常量，不存在「有的带前缀有的不带」
::crit 每个接口条目含字段约束、错误码、curl 示例
::crit 分页字段命名无歧义（`page_size`/`total_count`/`has_more`）

<!--day 25-->
::pre 完成 D1-D24：接口清单已交付。
::predict bash
```bash
./scripts/e2e.sh
# 全部通过
```
::ask 端到端脚本全绿，还需要人工验证什么？
::ans ① **浏览器里的真实行为**：Cookie 是否被设置、跨域是否通过、前端拿到的数字显示是否正确；② **并发**：两个用户同时创建，数据是否串；③ **重启**：数据是否还在；④ **异常输入**：超大 body、畸形 JSON、超长字段；⑤ **性能**：列表接口在 1 万条数据下的响应时间。**脚本能覆盖「契约」，覆盖不了「体验」和「并发」**。
::predict
```bash
# 两个用户并发创建
for i in {1..10}; do curl -X POST ... & done; wait
# 检查条数
sqlite3 db 'select count(*) from entries'
# 10
```
::ask 这能证明没有并发问题吗？
::ans 不能。① 10 个请求可能被串行处理（`MaxOpenConns(1)` 下写本来就是串行）；② 没有验证「每个请求的 user_id 是否正确落库」（可能全落到了同一个用户）；③ 没有 `-race`。真正的并发验证要：**多用户并发 + 检查每条记录的 user_id + 服务端开 `-race` 跑**。而且要注意：SQLite 的写串行化会掩盖很多竞态，所以并发测试要用**读操作**（读是并发的）来暴露问题。
::debug
```bash
# e2e 通过，但浏览器里
# 登录后刷新页面 → 又变成未登录
```
::ask 脚本测不出来，为什么？
::ans 因为脚本是「取 token 放 header」，而浏览器是「依赖 Cookie」。刷新后掉登录说明 **Cookie 没被正确设置或没被带上**：① `Set-Cookie` 少了 `Path=/`（只在 `/api/v1/login` 路径生效）；② `Secure: true` 但用 http 访问，浏览器拒绝存；③ `SameSite=Strict` + 跨站前端，Cookie 不发送；④ 没设 `MaxAge`，变成会话 Cookie（关浏览器就没了，但刷新不该掉）。**「脚本通、浏览器不通」几乎总是 Cookie/跨域问题**，这类必须人工在浏览器验证。
::transfer
::scene 设计阶段五的端到端回归清单。
::ask 列出必须覆盖的场景（至少 10 条），标注哪些只能人工验。
::hint 分「契约、并发、持久化、异常、体验」五类。
::ans
| # | 场景 | 类型 |
| 1 | 注册 → 登录 → 创建 → 列表 → 统计 → 删除 全链路 | 脚本 |
| 2 | A 创建，B 看不到 / 改不动 / 删不掉 | 脚本 |
| 3 | 未登录访问业务接口 → 401 | 脚本 |
| 4 | 金额 0/负数/超大 → 400 | 脚本 |
| 5 | 分页翻到最后一页 + 越界 offset | 脚本 |
| 6 | 空月份统计返回 0 | 脚本 |
| 7 | CSV 导出含逗号/引号的备注 | 脚本（解析校验） |
| 8 | kill 进程重启后数据仍在 | 脚本 |
| 9 | 10 用户并发创建，每条 user_id 正确 | 脚本 + `-race` |
| 10 | 浏览器登录 → 刷新仍登录 → 添加 → 列表显示 | **人工** |
| 11 | 手机浏览器访问（局域网 IP）完整流程 | **人工** |
| 12 | 超长备注/超大 body 的错误提示是否友好 | **人工** |
**第 10-12 条是脚本的盲区**，必须人工过一遍——尤其是手机访问（监听地址、CORS、Cookie Secure）。
::crit 回归清单覆盖契约/并发/持久化/异常/体验五类
::crit 多用户并发后校验每条记录 `user_id` 正确
::crit 明确标出「只能人工验证」的项，且真的验了
::crit 浏览器刷新后仍保持登录（Cookie 属性正确）

<!--day 26-->
::pre 完成 D1-D25：功能与非功能项都过了一遍。
::predict
```bash
go test ./... -race -cover
govulncheck ./...
docker compose up -d
```
::ask 三条都通过，阶段五算完成吗？
::ans 还差：① **迁移在生产库上真的执行过**（不只是测试库）；② **GORM 的 session 模式全局一致**（grep 确认没有裸 `r.db.Where`）；③ **日志能用 request_id 串起来**（实际 grep 一次）；④ **预算/CSV 这两个 stretch goal 的完成度有明确说明**（做了多少、没做什么）；⑤ **性能有基线数据**（列表接口 P95）。**「测试绿」是必要条件，验收是「清单逐条有证据」**。
::predict
```bash
grep -rn "r\.db\.Where\|r\.db\.First\|r\.db\.Find" internal/store/
```
::ask 这条 grep 期望什么结果？如果有输出说明什么？
::ans 期望**无输出**（或者输出都在 `session()` 的实现内部）。有输出说明有人绕过了统一的 `session(ctx)`，直接用了 `r.db`——那么「条件污染」和「ctx 不传播」的风险就在那些地方。这是「约定是否被遵守」的机器可验证手段。**凡是重要的编码约定，都应该能用一条 grep 验证**，否则它只是文档里的一句话。
::debug bash
```bash
# 验收时执行
goose -dir migrations sqlite3 ./data/ledger.db status
# Applied At                  Migration
# ==============================================
# (never applied)             00001_create_users.sql
```
::ask 服务已经跑了一周，为什么迁移显示从未执行？
::ans 因为服务跑的是**另一个数据库文件**（相对路径 vs 绝对路径），或者迁移是 `AutoMigrate` 建的（`AutoMigrate` 不会写 goose 的版本表）。这解释了「为什么生产表结构和迁移文件对不上」。修法：① 统一用绝对路径/环境变量指定 DB；② 启动日志打印 DB 绝对路径；③ 如果表已存在但 goose 版本为空，需要用 `goose up` 时加 `--allow-missing` 或手工 `goose stamp` 标记基线。**「迁移版本表」是判断「结构从哪来」的唯一依据**。
::transfer
::scene 写阶段五的验收报告。
::ask 报告必须包含哪些证据？哪些「没做到」要明确写出？
::hint 想「别人怎么复现你的结论」。
::ans
**证据**：
1. `go test ./... -race -coverpkg=...` 输出（含各包覆盖率）
2. `govulncheck ./...` 输出（无漏洞）
3. `goose status` 输出（版本号与生产库一致）
4. `EXPLAIN QUERY PLAN` 四条（有索引/无索引/函数包装/覆盖索引）
5. `grep -rn "r\.db\." internal/store` 输出（无绕过）
6. `grep req_id` 一次真实 500 的完整日志链
7. 列表接口 P95 耗时（1 万条数据下）
8. `go test -count=10 -race` 输出（概率性竞态未复现）
**必须明确写「没做到」**：预算只做了「设置 + 提示」，没做「分档提醒」；CSV 只做了全量加载，流式列为后续；覆盖率 store 包 62%（未达标原因：SQL 错误分支难构造）。**诚实的「未完成清单」比虚假的全绿更有价值**——它是下一阶段的输入。
::crit 报告含测试/扫描/迁移/性能四类可复现证据
::crit `grep` 验证「统一 session」约定被遵守
::crit 有一次真实 500 的完整日志链（req_id 可检索）
::crit 明确列出未完成项与原因，不掩盖
