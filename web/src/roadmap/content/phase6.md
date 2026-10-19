**解决什么问题**：API 写完，要让它跑在家里的设备上，配置不硬编码，服务能优雅停止，依赖无已知漏洞，前端能安全访问。

### 知识点

**1. 配置管理**
- Viper 或 koanf：YAML 配置文件 + 环境变量覆盖 + 默认值；配置绑定到结构体，在 `main` 一次性注入。
- JWT 密钥、数据库密码走环境变量或 secrets，**不写入代码和配置文件**。

**2. 多阶段 Dockerfile 与 docker compose**
- `golang` 镜像编译 → 小镜像运行二进制；`.dockerignore`。
- compose：端口映射、卷挂载（SQLite 文件持久化）；迁移作为独立步骤或嵌入启动流程。

**3. 健康检查**
- `GET /healthz` 返回 200。

**4. 优雅关闭：`http.Server` 超时是前提**
```go
srv := &http.Server{
    Addr:              ":8080",
    Handler:           mux,
    ReadHeaderTimeout: 5 * time.Second,
    ReadTimeout:       30 * time.Second,
    WriteTimeout:      30 * time.Second,
    IdleTimeout:       120 * time.Second,
}
```
**关闭顺序**：
1. `signal.NotifyContext` 监听 `SIGTERM` / `SIGINT`。
2. **先 `srv.Shutdown(ctx)`** ：停止接受新请求，等待进行中请求完成（`ctx` 控制超时）。
3. **再 `db.Close()`** 。`Shutdown` 完成后直接关闭即可。

**5. CORS**
- Vue 开发服务器与后端不同源时，后端设置 `Access-Control-Allow-Origin`，或 Vite 代理，部署时反向代理同源转发。

**6. 依赖漏洞扫描**
- `go install golang.org/x/vuln/cmd/govulncheck@latest`，运行 `govulncheck ./...`，作为 `docker build` 前的固定步骤。

**7. Cookie 安全属性与 CSRF（纵深防御，不是二选一）**

如果选择 `HttpOnly` Cookie 传递 JWT，**必须同时设置三道属性**：
- `HttpOnly: true`：JavaScript 无法读取。
- `Secure: true`（生产环境）：仅通过 HTTPS 传输。
- `SameSite: Lax` 或 `Strict`：限制跨站请求携带 Cookie。

**但 `SameSite` 不能替代 CSRF 中间件**。IETF 明确指出：Lax 模式对依赖不安全 HTTP 方法（如 POST）的 CSRF 提供了合理的纵深防御，但作为通用类别的 CSRF 防御并不充分。**SameSite 是第一道防线，CSRF 中间件是第二道防线**。

**🔧 中间件顺序（修复）** ：

`gorilla/csrf` 的 `csrf.Protect()` **必须是第一个业务中间件，包裹整个路由器**，而不是挂在路由之后。如果 CSRF 中间件放在路由匹配之后，健康检查、静态文件等未匹配路径会绕过校验。

推荐顺序：**Recovery → CSRF → RateLimit → Auth**

- **Recovery** 在最外层，捕获包括 CSRF 中间件在内的 panic。
- **CSRF** 紧随其后，尽早拦截未通过 CSRF 校验的请求，避免无效请求消耗限流配额。
- **RateLimit** 对通过 CSRF 的请求施加流量控制。
- **Auth** 最后，只对合法请求做身份验证。

如果选择 `Authorization: Bearer` 头 + `localStorage`，不需要 CSRF，但需权衡 XSS 风险。**家庭内网场景下，Cookie + CSRF 是更安全的选择。**

**8. Redis（可选，不纳入主线）**
- 只有当统计接口确实成为瓶颈时，再引入 `go-redis/v9` 和 Cache-Aside。缓存故障必须降级查库。

### 练手项目：可部署的家庭账本

- 后端 Docker 化，`docker compose up -d` 运行。
- 配置通过文件+环境变量管理，敏感信息不硬编码。
- 服务收到 `SIGTERM` 时按 **Shutdown → db.Close()** 的顺序优雅停止，`http.Server` 有显式超时。
- `govulncheck ./...` 无已知漏洞。
- 如果使用 Cookie 方案：`HttpOnly + Secure + SameSite` 全开，POST/PUT/DELETE 受 CSRF 保护，`csrf.Protect()` 包裹整个路由器。
- Vue 前端能完成登录、添加账目、查看列表、统计、预算标志。
