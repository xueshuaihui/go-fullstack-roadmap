1. **每个阶段都在改上一个阶段的代码**，不推倒重来。
2. **数据库从第一天就在**，不是单独学“数据库课”。
3. **GORM 从第一行代码就用 `Session(&gorm.Session{NewDB: true, Context: ctx})`**，`ctx` 必须是请求作用域、会在请求结束时被取消；禁止在长生命周期组件中保留 `c.Request.Context()`。
4. **生产环境不用 `AutoMigrate`**，`goose` 迁移文件是表结构变更的唯一入口。
5. **优雅关闭的前提是 Server 有超时**；先 `Shutdown`，再 `db.Close()`。
6. **安全底线**：每个涉及用户数据的查询带 `user_id`；响应无密码哈希；Cookie 方案同时设置 `HttpOnly + Secure + SameSite`，`csrf.Protect()` **包裹整个路由器**（Recovery → CSRF → RateLimit → Auth）；部署前跑 `govulncheck`。
7. **密码哈希**：首选 Argon2id **m=64 MiB, t=3, p=4**；备选 bcrypt **显式 cost=12**。
8. **分页**：前几页用 `limit/offset`；`OFFSET` 超过约 **1000–2000** 后考虑游标分页（`WHERE id > ?`），因为 OFFSET 深分页是 O(n)，游标是 O(1)。
9. **Redis 不着急**：SQLite 够用就不引入，等统计真的慢了再说。
10. **阶段五不必一次做到“完整版”**：预算和流式 CSV 导出是 stretch goal，核心的 GORM context 模式和测试深度优先。
