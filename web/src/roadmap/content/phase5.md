**解决什么问题**：Handler 里同时有 HTTP 解析、业务判断和 SQL 不可维护。分层让每层只做一件事；GORM 用结构体操作数据库，但 **context 和连接生命周期的管理方式直接决定服务会不会在流量下耗尽连接**；迁移保证表结构变更有据可查；预算和导出让账本真正可用。

> **🔧 密度校准**：本阶段清单较重。**必须完成**的核心是：分层重构、GORM 正确模式、迁移、统计、集中错误处理、结构化日志、基础测试。**预算检查**和**CSV 流式导出**标记为 **stretch goal**——可以先用简化版本（预算返回标志但不做复杂校验；CSV 先全量加载再输出）跑通流程，流式导出和完整的预算规则作为后续迭代。不要把 GORM context 模式和测试深度牺牲在赶进度上。

### 知识点

**1. 分层架构**
- **Handler 层**：解析请求、调 Service、写统一响应
- **Service 层**：业务规则（金额 > 0、分类存在、账目属于当前用户、**预算是否超限**）
- **Repository 层**：数据库操作，对上提供接口
- 依赖方向：Handler → Service → Repository，每层依赖接口
- 手动依赖注入：`main` 组装 `repo → svc → handler`

**2. GORM：`Session` 一次性完成隔离与 context 绑定（🔧 核心修复）**

这是本阶段最容易出错的点。需要精确理解两个机制的区别：

- **`WithContext(ctx)`** 本质上是 `Session(&Session{Context: ctx})` 的语法糖，但它**只替换 session 内部的 `context.Context` 字段，不重建底层连接或 statement 缓存**。在 HTTP handler 中依赖 `WithContext` 的隐式行为，容易导致上下文污染或在 session 复用时连接归还时机不确定。
- **`Session(&gorm.Session{NewDB: true})`** 克隆 `*gorm.DB` 实例，**彻底隔离 Statement 状态**（不继承链式条件），但它不自动绑定 context。
- **`Session` 结构体本身包含 `Context` 字段**，可以直接设置，将请求作用域的 `ctx` 与 session 隔离**一次性完成**。

**正确的 Repository 层模式**：
```go
func (r *repo) GetEntry(ctx context.Context, id uint) (*Entry, error) {
    var e Entry
    tx := r.db.Session(&gorm.Session{NewDB: true, Context: ctx})
    if err := tx.First(&e, id).Error; err != nil {
        return nil, err
    }
    return &e, nil
}
```
- `NewDB: true` 清空链式条件，保证每次查询从干净状态开始。
- `Context: ctx` 将**请求作用域的、会在请求结束时被取消的 `ctx`** 直接绑定到 session，避免 `WithContext` 的隐式替换带来的不确定性。GORM 官方文档确认 `Session.Context` 字段的取消和截止时间会传播到驱动层。
- **禁止**在长生命周期中间件或 goroutine 中**保留并传递** `c.Request.Context()` 给 GORM。

**其他 GORM 要点**：
- **GORM 升级到 v2.3.19+**（含相关修复）。
- **显式配置底层 `sql.DB` 连接池**：`SetMaxOpenConns`、`SetMaxIdleConns`、`SetConnMaxLifetime`。即使 SQLite 单连接，显式配置也让行为可预期。
- **SQLite 连接池**：`SetMaxOpenConns(1)` 是安全起点。**如果启用 `PRAGMA journal_mode=WAL`**，可拆分为**写池（1 连接）** 和**读池（多个连接）**：WAL 支持多读单写，写池 1 连接避免 `SQLITE_BUSY`，读池多连接提升读并发。
- **事务中的 context**：`Transaction()` 回调不自动接收外部 `ctx`，事务内每一步都需要显式设置 `Context` 或使用 `tx.WithContext(ctx)`。
- **零值陷阱**：`Updates` 默认忽略零值字段，更新时用 `Select` 或 `map` 显式指定。
- `gorm.ErrRecordNotFound` 当作正常业务分支处理。

**3. 数据库迁移：`goose` 更适合本项目的嵌入式场景**
- `AutoMigrate` **仅用于本地开发和测试**。
- 生产使用版本化迁移。`goose.SetBaseFS(embed.FS)` 与 `//go:embed` 集成只需一行，适合 SQLite + 单二进制部署。
- 迁移文件成对：`00001_create_entries.up.sql` / `.down.sql`，使用 `-- +goose Up` / `-- +goose Down` 标记。
- 迁移在部署流程中独立执行，不在每次应用启动时自动跑。

**4. 统计与预算**
- 按月份+分类：`Select("category, SUM(amount) as total").Where("user_id = ? AND date LIKE ?", uid, "2026-10%").Group("category").Scan(&results)`
- **预算表**（stretch goal）：`budgets(id, user_id, category, month, amount)`。添加账目时检查超限，响应中返回 `budget_exceeded`。
- **CSV 导出**（stretch goal）：`GET /ledger/export?month=`，优先实现全量加载版本；**流式读取写入 `text/csv`** 作为优化迭代。

**5. 集中式错误处理与结构化日志**
- Handler 返回 `error`，统一中间件转换为 HTTP 响应和统一信封。
- `log/slog` 或 `zap`；每条请求日志包含：方法、路径、状态码、耗时、**request ID**。request ID 在中间件生成并放入 `context`，错误响应中返回。

**6. 测试**
- 表驱动测试：`cases := []struct{...}` + `t.Run`
- Handler 测试：`httptest.NewRequest` + `httptest.NewRecorder`
- Repository 测试：SQLite 内存模式 `file::memory:?cache=shared`
- **连接归还验证**：用 `sqlmock` 的 `ExpectClose()` 断言查询结束后连接被归还（前提是 Repository 的 session 正确绑定了请求 ctx 并能随请求结束释放）。

**学习方式**：重构阶段四 → 引入 GORM（**从第一行 GORM 代码就用 `Session(&gorm.Session{NewDB: true, Context: ctx})`**，`ctx` 必须是请求作用域）→ 写迁移文件替换 `AutoMigrate` → 加分类、统计 → 集中错误处理 + `slog` → 补测试。预算和 CSV 导出按 stretch goal 处理。

### 练手项目：完整账本后端

- 认证 + 账目 CRUD + 分类 + 月度统计（核心）
- 预算检查 + CSV 导出（stretch goal，可先用简化版本）
- `migrations/` 含至少两个迁移文件（`goose` 格式）
- 所有 API 返回统一信封；错误响应含 `request_id`
- Repository 使用 `Session(&gorm.Session{NewDB: true, Context: ctx})`
