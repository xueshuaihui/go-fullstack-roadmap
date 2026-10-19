**解决什么问题**：写**接收请求的那一端**。核心链路：请求 → 路由 → 中间件 → handler 解析 → 业务 → 读写数据库 → 返回统一 JSON。

### 知识点

**1. 服务端视角的 HTTP**
- `http.ListenAndServe(":8080", mux)`
- 路由：`mux.HandleFunc("POST /ledger", handler)`（Go 1.22+）
- Handler：`func(w http.ResponseWriter, r *http.Request)`
- 读体：`json.NewDecoder(r.Body).Decode(&v)`
- 写响应：`Content-Type` → `WriteHeader` → `Encode`
- 路径参数：`r.PathValue("id")`；查询参数：`r.URL.Query().Get("month")`

**2. 统一响应信封**
- 泛型 `Response[T]`：`{code, message, data}`，成功和失败共用同一顶层结构
- Handler 只调用 `OK(w, data)` 或 `Fail(w, status, code, message)`
- HTTP 状态码表达传输层结果，`code` 表达业务结果

**3. 分页：`limit/offset` 起步，知道深分页的代价**
- `GET /ledger?limit=20&offset=0`，返回 `{items, total, limit, offset}`
- `OFFSET` 的本质是**先扫描再跳过**，成本随页深**线性增长**（O(n)）。
- **游标分页**（keyset pagination，`WHERE id > ? LIMIT 20`）利用主键索引做范围扫描，复杂度为 **O(1)**，性能不随页深衰减。
- **本项目的实用策略**：前几页用 `OFFSET`（支持跳页），当 `offset` 超过约 **1000–2000** 时切换到游标分页；接口设计上让客户端可以接受一个 `cursor` 参数，为未来留出空间。家庭账本短期内不会触达这个量级，但**知道“为什么 OFFSET 会慢”** 比记住“以后要换游标”更有价值。

**4. 中间件**
- `func(http.Handler) http.Handler`
- 日志中间件：方法、路径、状态码、耗时

**学习方式（严格按顺序）**：
1. `GET /hello` 返回统一信封，curl 看到 JSON
2. `POST /ledger` 写入内存切片，`GET /ledger` 分页返回
3. 内存换 SQLite：`POST` 写库，`GET` 读库
4. 加 `GET /ledger/{id}` 和 `GET /summary?month=`

**常见卡点**：端口被占用；404（方法或路径不匹配）；JSON 解析失败（检查 `Content-Type` 和双引号）；重启数据丢失（还在用内存）。

### 练手项目：账本 HTTP API

- `POST /ledger`：写 SQLite，返回 201 + 统一信封
- `GET /ledger?limit=&offset=`：分页
- `GET /ledger/{id}`：404 处理
- `GET /summary?month=`
- 日志中间件
