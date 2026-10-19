<!--day 1-->
::pre 完成阶段二；知道 TCP 端口、HTTP 请求/响应的粗略结构。
::predict go
func main() {
    http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "hello")
    })
    http.ListenAndServe(":8080", nil)
}
::ask 服务启动后，用浏览器访问 `http://localhost:8080/hello/`（带尾斜杠）会怎样？
::ans 会返回 301 重定向到 `/hello`，或 404，取决于注册方式。用 `http.HandleFunc("/hello", ...)` 注册的是**精确路径**，`/hello/` 不匹配，Go 的 ServeMux 会尝试重定向到 `/hello`（因为 `/hello/` 可以被当作「子树」的根，而父路径存在）。想匹配子树要注册 `"/hello/"`。**`net/http` 的路径匹配规则是「精确优先、然后最长前缀」，末尾有没有斜杠是两套语义**，这是最常见的 404 来源之一。
::predict go
srv := &http.Server{Addr: ":8080", Handler: mux}
log.Fatal(srv.ListenAndServe())
::ask 这个 server 有什么隐患？
::ans **没有任何超时**。`ReadTimeout`/`WriteTimeout`/`IdleTimeout`/`ReadHeaderTimeout` 默认全是 0，即「永不超时」。一个只发半截请求头的客户端可以永久占住连接（Slowloris），几百个这样的连接就能耗尽文件描述符。生产必须设：`ReadHeaderTimeout: 5s`、`ReadTimeout: 30s`、`WriteTimeout: 30s`、`IdleTimeout: 120s`。**「能用」和「能扛」之间差的就是这几个超时**，而且它们不会在功能测试里暴露。
::debug go
http.HandleFunc("/ledger", handle)
http.ListenAndServe("localhost:8080", nil)
::sym 本机能访问，手机/另一台机器访问 `http://192.168.1.10:8080` 连不上，容器外也访问不了。
::ask 为什么？正确写法是什么？这样做安全吗？
::ans `localhost:8080` 只监听回环接口（127.0.0.1），外部流量进不来。改为 `:8080`（等价 `0.0.0.0:8080`）监听所有网卡。安全性不该靠「只绑回环」来保证——那样连家里其他设备都用不了。正确做法是绑 `0.0.0.0` + 防火墙限制来源网段，或者前面放反向代理只暴露它。**「监听地址」和「访问控制」是两件事，别用前者替代后者**。
::transfer
::scene 你要写一个最小可用的 `/hello`，返回统一 JSON `{"code":0,"message":"ok","data":{"msg":"hello"}}`，并保证 5 秒内 curl 能看到结果。
::ask 写出完整代码，并说明为什么要显式设置 `Content-Type`。
::hint 不设 Content-Type 时，浏览器/客户端会怎么猜？
::ans 
```go
mux := http.NewServeMux()
mux.HandleFunc("GET /hello", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
    w.WriteHeader(http.StatusOK)
    io.WriteString(w, `{"code":0,"message":"ok","data":{"msg":"hello"}}`)
})
srv := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second}
log.Fatal(srv.ListenAndServe())
```
不设 Content-Type 时 Go 会做 MIME 嗅探（`http.DetectContentType`），JSON 通常被猜成 `text/plain`，前端 `res.json()` 可能报错或需要额外处理。**`WriteHeader` 必须在写 body 之前调用**，一旦写了 body，再设状态码就无效了（会有 `superfluous WriteHeader call` 日志但被忽略）。
::crit `curl -i` 能看到 `200` 与 `Content-Type: application/json`
::crit server 设了至少 `ReadHeaderTimeout`，能说出不设的具体风险
::crit 监听 `:8080` 而非 `localhost:8080`，并能解释两者差别
::crit 知道 `WriteHeader` 之后再改状态码无效

<!--day 2-->
::pre 完成 D1；知道 JSON 的键值结构。
::predict go
type Req struct {
    Amount   int64  `json:"amount"`
    Category string `json:"category"`
}
var r Req
err := json.NewDecoder(req.Body).Decode(&r)
::ask 如果客户端发的 `amount` 是字符串 `"35.5"`，会发生什么？多发一个未知字段 `"foo":"bar"` 呢？
::ans 类型不匹配会报错：`json: cannot unmarshal string into Go struct field Req.amount of type int64`。未知字段**默认被忽略**，不报错。这个默认很危险：客户端把 `amount` 写成 `Amount`（大写），服务端拿到的就是 0，还返回 201。想严格校验可以用 `dec.DisallowUnknownFields()`，让未知字段直接报错——**在「字段名写错要立刻发现」的场景（比如内部 API）值得开**。
::predict go
var r Req
dec := json.NewDecoder(req.Body)
dec.Decode(&r)
dec.Decode(&r)
::ask 第二行 Decode 会怎样？一次请求里 body 能被读几次？
::ans 第二次 Decode 返回 `io.EOF`（body 已读完），或者如果 body 里有两个 JSON 值，会读到第二个。`r.Body` 是**一次性流**，读完就没了。所以「先 Decode 一次看结构，再 Decode 一次取数据」这种写法是错的。需要重复读就先 `io.ReadAll` 存下来（但要注意大小限制）。**`r.Body` 不能重读，这是新手最常踩的坑之一**。
::debug go
func create(w http.ResponseWriter, r *http.Request) {
    var in CreateInput
    if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
        http.Error(w, err.Error(), 400)
        return
    }
    w.WriteHeader(201)
}
::sym 前端发 `{"amount": 3550, "category": "餐饮"}`，控制台报 `unexpected end of JSON input`；另一次发超大 body 直接把内存打满。
::ask 这两个问题分别怎么修？
::ans 第一个：如果前端用的是 `fetch` 但没设 `Content-Type: application/json`，或者 body 是空字符串，`Decode` 就会报 `EOF` / `unexpected end`。要在服务端区分「空 body」（`io.EOF` → 400 参数缺失）和「格式错」（400 JSON 格式错），错误信息不能直接把内部错误抛给用户。第二个：`r.Body` 无大小限制，用 `http.MaxBytesReader(w, r.Body, 1<<20)` 包一层（1MB），超限返回 413。**入参大小必须有上限**，否则一个请求就能把服务打挂。
::transfer
::scene 你要写一个统一的「读 JSON 入参」函数，供所有 handler 用。
::ask 这个函数要处理哪几种失败？每种对应什么状态码和业务 code？写出签名。
::hint 想想空 body、格式错、类型错、字段缺失、超大 body。
::ans 
```go
func decodeJSON[T any](w http.ResponseWriter, r *http.Request) (T, bool) {
    var v T
    if r.Body == nil { Fail(w, 400, "EMPTY_BODY", "请求体为空"); return v, false }
    dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20))
    dec.DisallowUnknownFields()
    if err := dec.Decode(&v); err != nil {
        var maxErr *http.MaxBytesError
        switch {
        case errors.As(err, &maxErr): Fail(w, 413, "BODY_TOO_LARGE", "请求体超过 1MB")
        case errors.Is(err, io.EOF): Fail(w, 400, "EMPTY_BODY", "请求体为空")
        default: Fail(w, 400, "INVALID_JSON", "请求体不是合法 JSON")
        }
        return v, false
    }
    return v, true
}
```
关键是**不要 `err.Error()` 直接回给客户端**——那会泄漏内部结构（字段名、包名）。给用户看的是稳定的业务 code 和中文提示，细节进日志。泛型让每个 handler 少写 10 行。
::crit 能说出未知字段默认被忽略的风险，并知道 `DisallowUnknownFields` 的作用
::crit 知道 `r.Body` 一次性，不重复 Decode
::crit 入参有 1MB 上限，超限返回 413
::crit 错误响应不回显 `err.Error()`，用稳定的业务 code

<!--day 3-->
::pre 完成 D2；知道 REST 里 GET/POST/PUT/DELETE 的语义。
::predict go
mux := http.NewServeMux()
mux.HandleFunc("GET /ledger/{id}", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, r.PathValue("id"))
})
::ask 访问 `/ledger/42` 输出什么？访问 `/ledger/` 呢？访问 `/ledger/42/extra` 呢？
::ans `/ledger/42` → `42`。`/ledger/` → 404（`{id}` 匹配一个非空段，空段不匹配）。`/ledger/42/extra` → 404（`{id}` 不跨斜杠）。Go 1.22 的模式语法里 `{id}` 只匹配单段，要匹配剩余路径用 `{rest...}`。**这是 Go 1.22 新增的能力，别再手写 `strings.Split(r.URL.Path, "/")`**——手写解析会在尾斜杠、编码字符、空段上出错。
::predict go
mux.HandleFunc("POST /ledger", h)
r, _ := http.NewRequest("GET", "/ledger", nil)
// 路由匹配结果？
::ask GET 请求会命中这个 handler 吗？如果不命中返回什么？
::ans 不会命中，ServeMux 返回 **405 Method Not Allowed** 并带上 `Allow: POST` 头。这是 1.22 路由的重要改进：方法不匹配是 405 而不是 404。区分这两者对排查很关键——**404 是「路径错了」，405 是「路径对了但方法错了」**，前端调错方法时能立刻看出来。
::debug go
mux.HandleFunc("GET /ledger/{id}", h)
// 客户端请求 /ledger/%2Fetc%2Fpasswd
::ask `r.PathValue("id")` 拿到的是什么？直接拼进 SQL 会怎样？
::ans 拿到的是**解码后**的 `//etc/passwd`（`%2F` 被解码成 `/`）。如果直接拼进 SQL 就有注入风险（虽然这个例子更像路径穿越）。这里要建立两个习惯：① 路径参数**必须校验类型和范围**（`strconv.ParseInt` + `> 0`），不能直接信任；② SQL 一律用占位符 `?`，不做字符串拼接。**框架负责路由解码，不负责安全校验**。
::transfer
::scene 你要设计账本的 5 个路由：创建、列表、单条详情、更新、删除。
::ask 写出完整的模式注册表，并说明每个的「成功状态码」应该是什么。
::hint 创建 201，删除 204 还是 200？更新要不要返回资源？
::ans 
```go
mux.HandleFunc("POST   /api/v1/ledger",      h.Create)   // 201 + Location
mux.HandleFunc("GET    /api/v1/ledger",      h.List)     // 200
mux.HandleFunc("GET    /api/v1/ledger/{id}", h.Get)      // 200
mux.HandleFunc("PATCH  /api/v1/ledger/{id}", h.Update)   // 200（返回更新后的资源）
mux.HandleFunc("DELETE /api/v1/ledger/{id}", h.Delete)   // 204（无 body）
```
理由：201 表示「创建成功且资源已存在」，配 `Location: /api/v1/ledger/42` 让客户端知道去哪拿；204 表示「成功但没有响应体」，删除最适合；更新用 PATCH 而不是 PUT，因为账本只改部分字段（PUT 语义是整体替换，要求客户端把所有字段都传全）。**状态码是契约的一部分，定错就要靠文档补救**。
::crit 能用 `{id}` 匹配单段，并知道 `{rest...}` 用于剩余路径
::crit 知道方法不匹配返回 405 且带 `Allow` 头，能区分 404 与 405
::crit 路径参数一律 `ParseInt` + 范围校验，不直接信任
::crit 5 个路由的成功状态码符合 REST 语义，删除返回 204

<!--day 4-->
::pre 完成 D3；知道泛型的基本写法。
::predict go
type Response[T any] struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Data    T      `json:"data"`
}
func OK[T any](w http.ResponseWriter, data T) {
    json.NewEncoder(w).Encode(Response[T]{Code: 0, Message: "ok", Data: data})
}
// 调用
OK(w, nil)
::ask 响应里的 `data` 字段是什么？符合预期吗？
::ans 是 `"data": null`。因为 `nil` 传给泛型 T 时 T 被推断成 `any` 之类，序列化成 null。如果前端期望「成功时 data 一定存在」，null 会引发判空。两种处理：成功但无数据时用 `struct{}{}`（序列化成 `{}`），或者让前端接受 null。**「空」在 JSON 里有三种形态：`null`、`{}`、`[]`**，选哪个要全项目统一，不能这里 null 那里 []。
::predict go
func Fail(w http.ResponseWriter, status, code int, msg string) {
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(Response[any]{Code: code, Message: msg})
}
// 调用 Fail(w, 400, 1001, "参数错误")
::ask 客户端收到什么状态码？body 里的 code 是什么？两者关系是什么？
::ans 状态码 400，body 里 `code: 1001`。这是「双轨」设计：**HTTP 状态码表达传输层结果**（成功/客户端错/服务端错），**业务 code 表达具体原因**（1001 参数错、1002 未登录、2001 余额不足）。好处是网关/负载均衡能按状态码做通用处理（重试 5xx、不重试 4xx），客户端按 code 做精细分支。坏处是两套数字要维护，容易不一致——所以要有统一常量表。
::debug go
func Fail(w http.ResponseWriter, status, code int, msg string) {
    json.NewEncoder(w).Encode(...)
    w.WriteHeader(status)
}
::sym 客户端收到的状态码永远是 200，body 里却写着 code=1001。
::ask 为什么？Go 的响应写入顺序规则是什么？
::ans 因为先 Encode 写了 body，Go 在第一次写 body 时会**隐式调用 `WriteHeader(200)`**，之后再调 `WriteHeader(400)` 无效（只会打一条 `superfluous response.WriteHeader call` 日志）。所以顺序必须是：**设 Header → WriteHeader → 写 body**。这个错误不会导致编译失败，测试里如果只看 body 不看状态码也发现不了——所以测试必须断言状态码。
::transfer
::scene 你要给前端一份「错误码表」，覆盖账本的所有失败场景。
::ask 设计 code 的分段规则，并给出至少 6 个具体 code（含 HTTP 状态码映射）。
::hint 按「客户端错 / 认证 / 业务规则 / 服务端」分段。
::ans 分段建议：`1xxx` 参数与请求、`2xxx` 认证授权、`3xxx` 业务规则、`5xxx` 服务端。示例：
| code | HTTP | 含义 |
| 1001 | 400 | 参数格式错误 |
| 1002 | 404 | 资源不存在 |
| 2001 | 401 | 未登录/token 无效 |
| 2002 | 403 | 无权访问该资源 |
| 3001 | 409 | 邮箱已注册 |
| 3002 | 422 | 超出预算 |
| 5001 | 500 | 内部错误 |
规则：① **同一 code 永远对应同一 HTTP 状态**；② code 一旦发布不能改语义（只能新增）；③ 500 类不暴露内部细节，只给 request_id。**错误码表要作为接口文档的一部分维护**，否则前端只能靠猜字符串。
::crit 成功/失败的响应结构共用同一顶层（code/message/data）
::crit 知道 `WriteHeader` 必须在写 body 之前，测试会断言状态码
::crit 空数据在 JSON 里的形态全项目统一（null / {} / []）
::crit 有一张错误码表，code 与 HTTP 状态一一对应

<!--day 5-->
::pre 完成 D4；能写出统一信封和 5 个路由。
::predict go
func NewRouter(svc *ledger.Service) http.Handler {
    mux := http.NewServeMux()
    h := &Handler{svc: svc}
    mux.HandleFunc("POST /ledger", h.Create)
    return mux
}
type Handler struct{ svc *ledger.Service }
::ask 这个设计有什么问题？如果以后要加中间件、要测试 handler，会卡在哪？
::ans 问题一：`Handler` 直接依赖 `*ledger.Service` 具体类型，测试时必须构造真的 Service（连带真的 Store），没法用 fake。问题二：路由和 handler 耦合在一个函数里，加中间件要改这个函数。改法：`Handler` 依赖一个**自己定义的小接口**（只含用到的方法），路由函数接受 `http.Handler` 便于包中间件。**「能不能单独测一个 handler」是检验分层是否到位的最快标准**。
::predict go
type Handler struct {
    svc *ledger.Service
    db  *sql.DB
}
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
    // 直接查库做唯一性校验
    var n int
    h.db.QueryRow("SELECT count(*) FROM entries WHERE ...").Scan(&n)
}
::ask 这行代码违反了哪条分层原则？后果是什么？
::ans 违反了「handler 不碰 SQL」。后果：① 业务规则散落在 HTTP 层，CLI 或其他入口复用时拿不到；② 测试 handler 必须有真数据库；③ 事务边界无法在 Service 层统一管理。**判断标准：把 HTTP 层整个删掉，业务逻辑还完整吗？** 如果答案是否，说明逻辑放错了层。
::debug bash
curl -i -X POST localhost:8080/ledger -d '{"amount":100}'
# HTTP/1.1 404 Not Found
::ask 路由明明注册了 `POST /ledger`，为什么 404？
::ans 三个常见原因：① 注册时写成了 `mux.HandleFunc("/ledger", ...)`（没有方法前缀，1.22 语义下这是「所有方法」但路径是精确匹配，理论上能命中）——真正的高频原因是**注册在了另一个 mux 上**（比如用了 `http.HandleFunc` 全局 mux，却把自定义 mux 传给 server）；② 路径多了前缀（`/api/v1/ledger` vs `/ledger`）；③ 服务没重启，跑的是旧二进制。排查顺序：先 `curl -v` 看实际请求行，再在注册处打日志确认 mux 被用了，最后看进程启动时间。**404 先怀疑「请求没到你以为的那个 mux」**。
::transfer
::scene 你要在阶段三结束时交出一个「API 骨架」，所有接口返回假数据但契约完整。
::ask 列出这个骨架必须包含的东西（至少 6 项），并说明为什么先做骨架而不是先做功能。
::hint 想想前端什么时候能开始联调。
::ans ① 5 个路由全部注册、返回正确的状态码与信封；② 请求/响应的 DTO 类型定义（字段名、单位、可空性）；③ 错误码表与统一 `Fail`；④ 一个 `GET /healthz`；⑤ 至少一个真实实现的接口（比如 List 返回空数组）；⑥ 一份 `curl` 示例或 OpenAPI 片段。先做骨架的理由：**前端可以立刻开始对接，接口形状的争议在写业务前暴露**。等业务写完再改字段名，前端要返工一遍。骨架日的产出不是「能用的功能」，是「不会再变的契约」。
::crit 5 个路由都能被 curl 命中，状态码正确
::crit Handler 依赖接口而非具体 Service，能单独用 fake 测试
::crit handler 里搜不到 `sql.` / `db.Query`
::crit 骨架日结束时，接口字段与错误码已定稿，前端可开始联调

<!--day 6-->
::pre 完成 D5：路由与信封可用。
::predict go
type CreateInput struct {
    Amount   int64  `json:"amount"`
    Category string `json:"category"`
    Date     string `json:"date"`
}
func (in CreateInput) Validate() error {
    if in.Amount <= 0 { return errors.New("金额必须大于 0") }
    return nil
}
// 客户端传 amount: -100
::ask 只校验 `> 0` 够吗？还有哪些必须校验的？
::ans 不够。至少还要：① 金额上限（防止误输入 999999999 撑爆统计，比如 ≤ 100 万分 = 1 万元）；② 分类非空且在允许集合内；③ 日期能被 `time.Parse("2006-01-02")` 解析且不在未来（家庭账本记未来账无意义）；④ 备注长度按 rune 限制。**校验的原则是「凡是能在这里挡住的脏数据，绝不留给数据库或前端」**，但也不要过度（比如校验分类必须是某个枚举，会让用户无法自定义）。
::predict go
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
    in, ok := decodeJSON[CreateInput](w, r)
    if !ok { return }
    id, err := h.svc.Create(r.Context(), in)
    if err != nil {
        Fail(w, 500, 5001, "创建失败")
        return
    }
    OK(w, map[string]int64{"id": id})
}
::ask 这里把所有错误都当 500，会有什么问题？
::ans 会把「用户参数错」报成「服务器错」。具体后果：① 前端无法区分「我填错了」和「服务挂了」，只能统一提示「稍后再试」；② 监控上 5xx 报警会被用户输入错误刷爆，真正的故障被淹没；③ 网关可能对 5xx 做重试，而参数错误重试一万次也没用。正确做法是 `errors.Is/As` 分类：`ErrValidation` → 400、`ErrConflict` → 409、其他 → 500。**错误映射是 API 质量的分水岭**。
::debug bash
curl -X POST localhost:8080/ledger -H 'Content-Type: application/json' \
  -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}'
# {"code":0,"message":"ok","data":{"id":0}}
::ask 创建成功了，但 id 是 0。可能的原因？
::ans ① SQLite 的 `LastInsertId()` 拿的是 `Result` 的返回值，如果用的是 `INSERT ... ON CONFLICT DO NOTHING` 且实际没插入，LastInsertId 返回上一次的或 0；② 代码里 `id, _ := res.LastInsertId()` 忽略了 error；③ 更常见：**返回的是结构体里没赋值的字段**（比如 `Entry{ID: ...}` 忘了填）。排查：直接 `sqlite3 db 'select max(id) from entries'` 对比。**「写成功了但 id 是 0」几乎总是「返回值没取对」，不是数据库问题**。
::transfer
::scene 用户连点两次「保存」，产生两条一模一样的账目。
::ask 三种处理方案的优缺点，你会选哪个？为什么？
::hint 前端禁用、幂等键、允许重复后删除。
::ans ① **前端禁用按钮**：成本最低，但刷新页面、网络重发、多标签页都挡不住，只能减少概率；② **Idempotency-Key**：客户端生成 UUID 放 header，服务端存 key→结果，重复请求返回首次结果。可靠但有存储成本，且要处理 key 过期；③ **数据库唯一约束**（同一用户+日期+金额+分类+备注）→ 409：最简单可靠，但会误伤「真的同一天买了两杯一样的咖啡」。家庭账本选 ③ 的宽松版：允许重复，但在列表里标「疑似重复」，让用户自己删。**关键不是选哪个，而是明确写下「我们接受哪种重复」**。
::crit 创建接口覆盖金额、分类、日期、备注四类校验，且错误码区分
::crit 错误按类型映射状态码，不会全部 500
::crit 创建成功返回的 id 非零，且能被 `GET /ledger/{id}` 查到
::crit 对「重复提交」有明确选择，并写进注释或文档

<!--day 7-->
::pre 完成 D6：能创建、能按 id 查。
::predict go
// GET /ledger?limit=20&offset=0
limit := 20
offset := 0
if v := r.URL.Query().Get("limit"); v != "" {
    limit, _ = strconv.Atoi(v)
}
rows, _ := db.Query("SELECT ... LIMIT ? OFFSET ?", limit, offset)
::ask 如果客户端传 `limit=abc` 或 `limit=-5`，会发生什么？
::ans `Atoi` 报错被忽略，`limit` 变成 0，SQL 变成 `LIMIT 0` → 返回空列表，客户端以为「没数据」。`limit=-5` 在 SQLite 里 `LIMIT -5` 表示「不限条数」，直接返回全表——**一个负参数就能把整库拉出来**。必须显式校验：`if limit <= 0 || limit > 100 { limit = 20 }`。**分页参数不做上下界校验，是性能事故的常见入口**。
::predict go
type ListResp struct {
    Items  []Entry `json:"items"`
    Total  int64   `json:"total"`
    Limit  int     `json:"limit"`
    Offset int     `json:"offset"`
}
var items []Entry   // 没有 make
// 查询无结果
json.NewEncoder(w).Encode(ListResp{Items: items, ...})
::ask 响应里的 `items` 是什么？前端 `data.items.map(...)` 会怎样？
::ans `"items": null`，前端 `null.map` 直接抛 `TypeError`。修法：`items := make([]Entry, 0, limit)`，或者用 `Items []Entry` 但初始化。**「空列表必须是 `[]` 不是 `null`」是 API 契约的一部分**，前后端都要约定清楚。这类问题在数据为空时才会暴露，联调初期经常被忽略，上线后「新用户打开页面白屏」。
::debug sql
SELECT * FROM entries ORDER BY date DESC LIMIT 20 OFFSET 40
::ask 翻到第 3 页时，如果这期间用户新增了一条今天的账目，会出现什么现象？
::ans 会出现**重复或漏项**：新增的记录排在最前（date DESC），原来第 1 页的第 20 条被挤到第 2 页，而第 2 页已经读过了，于是第 3 页开头会重复出现一条已看过的记录（或反之漏掉一条）。这不是 bug，是 offset 分页的固有语义：**「第 N 页」在数据变化时不是稳定快照**。账本场景用户通常能接受，但如果你要做「无限滚动」，必须换游标分页（`WHERE (date, id) < (?, ?)`）。
::transfer
::scene 你要实现 `GET /ledger?month=2026-10&limit=20&offset=0`，返回该月分页。
::ask 写出查询 SQL 与参数校验逻辑，并说明为什么 `total` 要单独查一次。
::hint 一条 SQL 能不能同时拿到「当前页」和「总数」？
::ans 
```go
// 校验
if limit <= 0 || limit > 100 { limit = 20 }
if offset < 0 { offset = 0 }
if _, err := time.Parse("2006-01", month); err != nil { return 400 }

// 两条 SQL
var total int64
db.QueryRowContext(ctx, `SELECT COUNT(*) FROM entries WHERE user_id=? AND date>=? AND date<?`, uid, start, end).Scan(&total)
rows, err := db.QueryContext(ctx, `SELECT id,amount,category,date,note FROM entries
    WHERE user_id=? AND date>=? AND date<? ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`,
    uid, start, end, limit, offset)
```
`total` 必须单独查：`LIMIT` 会截断结果集，`COUNT(*)` 需要的是全量。虽然可以 `COUNT(*) OVER()` 窗口函数一次拿到，但 SQLite 支持有限、且会拖慢分页查询——**两条简单查询比一条复杂查询更好维护**。注意 `ORDER BY` 必须有唯一列（`id`）兜底，否则同一天多条记录的页边界会抖动。
::crit limit 有上下界（1-100），offset 非负，非法值有默认而非报错
::crit 空结果返回 `[]` 而非 `null`
::crit 月份参数校验格式，SQL 用半开区间不用 LIKE
::crit `ORDER BY` 带唯一列兜底，能解释 offset 分页在数据变动时的重复/漏项

<!--day 8-->
::pre 完成 D7：列表能分页。
::predict go
// offset=1000, limit=20, 表里有 10 万条
// SQLite 如何执行 OFFSET？
::ask OFFSET 1000 是「直接跳到第 1000 条」还是「先读再丢」？复杂度是多少？
::ans 是**先读再丢**：数据库要扫描并跳过前 1000 行，才能返回第 1001-1020 行。成本 O(offset)，随页深线性增长。这就是「深分页慢」的本质——不是索引没建，是 OFFSET 的语义决定的。优化方向是**游标分页**（keyset）：`WHERE (date, id) < (?, ?) ORDER BY date DESC, id DESC LIMIT 20`，利用索引直接定位起点，复杂度 O(1)（相对页深）。
::predict sql
SELECT * FROM entries ORDER BY date DESC LIMIT 20 OFFSET 999980;
::ask 在 100 万行的表上，这条查询大概多久？为什么？
::ans 可能要几百毫秒到几秒。它要扫描近 100 万行并丢弃，再取 20 行——**读的数据量和「取多少」无关，和「跳过多少」有关**。这也是为什么「最后一页」总是最慢的。如果业务允许，改成「按时间倒序 + 游标」后，无论翻多深都是毫秒级。
::debug sql
SELECT COUNT(*) FROM entries WHERE user_id = 1;
-- 12 万行，耗时 400ms
-- 而分页查询本身只要 3ms
::ask 为什么 count 比分页查询还慢？三种优化选择是什么？
::ans `COUNT(*)` 要遍历全部匹配行（即使有索引，也要走完整个索引区间），而分页查询只取 20 行就停。选择：① **保留 count**，接受成本（家庭账本 12 万行 400ms 可以接受，但要注意别每页都查）；② **只在第一页返回 total**，后续页返回 `-1` 或省略，前端不再显示总页数；③ **近似值**：`SELECT MAX(rowid) FROM entries` 或用 `EXPLAIN QUERY PLAN` 的估算行数，不精确但 O(1)。**知道「total 很贵」比背「要用游标分页」更实用**。
::transfer
::scene 你要给列表接口预留游标分页能力，但暂时不实现。
::ask 接口参数和响应要怎么设计，才能「现在用 offset，以后换 cursor 不改契约」？
::hint 响应里加一个字段，客户端「有就用，没有就回退 offset」。
::ans 请求：`?limit=20&offset=0&cursor=`（cursor 为空则用 offset）。响应：`{items, total, limit, offset, next_cursor}`。规则写进文档：**`next_cursor` 非空时，客户端应优先用它请求下一页；为空表示没有更多**。服务端实现可以先只填 `next_cursor: null`，等真正切换时再填值，客户端代码不用改。**向前兼容的关键是「现在就多返回一个字段」**，而不是等换实现时再改契约。
::crit 能说出 OFFSET 的成本是 O(offset)，不是 O(limit)
::crit 知道深分页慢的根因，能写出 keyset 分页的 WHERE 条件
::crit 知道 `COUNT(*)` 可能比分页查询贵，能说出三种取舍
::crit 响应里预留了 `next_cursor` 字段，文档写明优先级规则

<!--day 9-->
::pre 完成 D7-D8；Store 接口已定义。
::predict go
type Store interface {
    Create(ctx context.Context, e Entry) (int64, error)
}
// 内存实现
func (s *memStore) Create(ctx context.Context, e Entry) (int64, error) {
    s.nextID++
    e.ID = s.nextID
    s.items = append(s.items, e)   // 存的是副本
    return e.ID, nil
}
// SQLite 实现
func (s *sqlStore) Create(ctx context.Context, e Entry) (int64, error) {
    res, err := s.db.ExecContext(ctx, "INSERT ...", e.Amount, ...)
    return res.LastInsertId()
}
::ask 两个实现的行为完全一致吗？有哪几处可能不同？
::ans 至少四处：① **ID 起点**：内存从 1 开始，SQLite 的 rowid 也是 1，但删除后行为不同（SQLite 可能复用，`AUTOINCREMENT` 才不复用）；② **时间精度**：内存存 time.Time，SQLite 存字符串，精度可能从纳秒降到秒；③ **排序**：内存按插入顺序，SQLite 按 `ORDER BY`；④ **空值**：内存零值是 `""`，SQLite 可能是 NULL。**「换实现时行为不变」是接口的核心承诺**，但语言层面无法强制——只能靠同一套测试跑两个实现来验证。
::predict go
// 内存实现测试通过，切到 SQLite 后这个测试挂了
if got[0].ID != 1 { t.Fatal("id 应为 1") }
::ask 这个测试有什么问题？
::ans 它断言了「实现细节」而不是「行为契约」。ID 从几开始是实现的自由，测它等于把测试绑死在某个实现上。应该断言「创建后能用返回的 id 查到同一条记录」——这是行为，两个实现都该满足。**测试要针对契约写，才能一套测试跑所有实现**（这也是「面向接口编程」在测试上的直接收益）。
::debug bash
go test ./...        # 全绿（用的是内存实现）
# 部署到真实环境后
sqlite3 ledger.db 'select count(*) from entries'   # 0
# 但接口返回 200
::ask 为什么测试全绿，线上却没数据？
::ans 最可能：`main` 里注入的还是内存实现（比如切换代码写了但没启用，或环境变量判断反了）。其次是**事务没提交**（D12 讲过的形态），或者写到了另一个数据库文件（相对路径 + 不同 CWD）。系统性的防法是：**启动时打一条日志，明确写出「使用哪个 Store 实现 + 数据库文件绝对路径」**，让「连错库」变成一眼可见的事实，而不是靠猜。
::transfer
::scene 你要把内存实现换成 SQLite，同时保证所有已有测试仍然通过。
::ask 步骤是什么？哪一步最容易漏？
::hint 先写测试还是先换实现？
::ans 步骤：① 先把「跑在内存实现上的测试」整理成表驱动，确保覆盖 Create/List/Sum 的主路径与边界；② 为 SQLite 实现加一个 `newTestStore(t)`，用 `file::memory:?cache=shared` 或临时文件；③ **用同一组测试函数跑两个实现**（`for name, factory := range map[string]func() Store{...}`）；④ 切换 main 的注入。最容易漏的是 ③——大多数人换完实现只跑原来的测试，而原测试只覆盖内存实现，等于没验证 SQLite。**「同一套契约测试跑所有实现」是把重构风险降到最低的手段**。
::crit 内存与 SQLite 两个实现跑同一套契约测试，全部通过
::crit 测试断言行为（能查回来）而不是实现细节（ID 从 1 开始）
::crit 启动日志明确输出「Store 实现 + 数据库绝对路径」
::crit 切换实现时 `main` 只改装配那几行，Service 与 Handler 零改动

<!--day 10-->
::pre 完成 D9：SQLite 实现可用。
::predict bash
./ledger-api &
curl -X POST localhost:8080/ledger -d '{"amount":100,...}'
kill %1
./ledger-api &
curl localhost:8080/ledger
::ask 重启后能查到刚才那条吗？如果查不到，最可能的原因是什么？
::ans 正常情况下能查到——数据在 SQLite 文件里，与进程无关。查不到的三个高频原因：① **DSN 是相对路径**，两次启动的 CWD 不同，写到了两个文件；② **事务没提交**（`Begin` 后忘了 `Commit`），进程退出时回滚；③ **用的是内存实现**（`file::memory:` 或进程内 map），重启即丢。**「重启不丢」是区分「真持久化」和「假持久化」的唯一标准**，也是阶段三的硬验收。
::predict bash
sqlite3 ledger.db '.tables'
# entries
ls -l ledger.db*
# ledger.db  ledger.db-wal  ledger.db-shm
::ask 如果只备份 `ledger.db`，会丢数据吗？
::ans 会。开了 WAL 之后，最新的写入先落在 `ledger.db-wal`，满足条件才 checkpoint 回主库。只拷主文件可能丢掉最近的事务。正确备份：`sqlite3 ledger.db ".backup 'backup.db'"`（在线一致性备份），或者停服务后三个文件一起拷。**「备份了一个文件」和「备份了数据库」不是一回事**，这个差异只有在恢复时才会暴露——那时已经晚了。
::debug bash
# 服务跑在容器里，数据目录挂载为 /data
docker run -v $(pwd)/data:/data myapp
# 重启容器后数据没了
::ask 三个可能原因？
::ans ① **挂载路径与 DSN 不一致**：DSN 写的是 `ledger.db`（相对 CWD，容器内是 `/app`），而挂载在 `/data`，数据写进了容器层，随容器删除而消失；② **挂载的是文件而不是目录**，宿主机文件不存在时 Docker 会创建一个空目录，SQLite 打不开；③ **以非 root 运行但挂载目录属主是 root**，写入失败（错误信息是 `readonly database`，容易误判）。排查：进容器 `ls -l /data` 看文件在不在，`os.Getwd()` 打日志看 CWD。**「数据丢了」先查「写到哪去了」，不要先怀疑数据库**。
::transfer
::scene 你要写一个「重启不丢」的自动化验收。
::ask 脚本怎么写才能证明「数据真的在磁盘上」，而不是被进程内缓存骗了？
::hint 关键是「杀掉进程」而不是「重启 handler」。
::ans 
```bash
DB=$(mktemp -d)/ledger.db
./ledger-api -db "$DB" & PID=$!
sleep 0.5
curl -fsS -X POST localhost:8080/ledger -H 'Content-Type: application/json' \
  -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}' > /dev/null
kill -TERM $PID; wait $PID            # 真杀进程，触发优雅关闭
./ledger-api -db "$DB" & PID=$!
sleep 0.5
COUNT=$(sqlite3 "$DB" 'select count(*) from entries')
[ "$COUNT" = "1" ] || { echo "重启后数据丢失"; kill $PID; exit 1; }
curl -fsS localhost:8080/ledger | grep -q 3550 || { echo "API 读不到"; exit 1; }
kill -TERM $PID; wait $PID
```
两个关键点：**杀进程**（不是重启 handler，那验证不了持久化）、**直接查库 + 走 API 双向验证**（只查库证明写进去了，只查 API 可能读到缓存）。用 `mktemp -d` 保证每次从空库开始。
::crit 杀掉进程重启后，数据仍能通过 API 查到
::crit DSN 用绝对路径，能说出相对路径在容器/不同 CWD 下的风险
::crit 知道 WAL 下要备份三个文件或用 `.backup`，不只拷主库
::crit 验收脚本真的 kill 了进程，且从空库开始跑

<!--day 11-->
::pre 完成 D9-D10；列表与创建都通。
::predict go
idStr := r.PathValue("id")
id, _ := strconv.ParseInt(idStr, 10, 64)
row := db.QueryRowContext(ctx, "SELECT ... WHERE id = ?", id)
var e Entry
err := row.Scan(&e.ID, &e.Amount, ...)
if err != nil {
    Fail(w, 500, 5001, "查询失败")
    return
}
::ask 查不到记录时返回什么？合理吗？
::ans 返回 500。`Scan` 在无结果时返回 `sql.ErrNoRows`，这里没区分就直接当 500 了。正确做法：`if errors.Is(err, sql.ErrNoRows) { Fail(w, 404, 1002, "账目不存在") }`。**`ErrNoRows` 是正常业务分支，不是异常**——「不存在」和「数据库坏了」必须分开，否则监控会被正常请求刷出 5xx。
::predict go
// GET /ledger/0 和 GET /ledger/-1
::ask 这两个请求应该返回什么？直接查库会怎样？
::ans 都应该返回 400（参数非法）。`id=0` 查库返回无结果（如果 id 从 1 开始），`id=-1` 也查不到——技术上「能用」，但语义上「0 和负数不是合法 ID」。直接在 handler 入口挡掉更省一次查询，也避免把负数传进 SQL（某些数据库对负数索引有奇怪行为）。**「语法合法但业务非法」的参数，应该在边界一刀切掉**。
::debug go
func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
    id, _ := strconv.ParseInt(r.PathValue("id"), 10, 64)
    e, err := h.svc.Get(r.Context(), id)
    if err != nil {
        Fail(w, 404, 1002, "账目不存在")   // 所有错误都 404
        return
    }
    OK(w, e)
}
::ask 这里把「所有错误」都当 404，会掩盖什么？
::ans 掩盖了真正的服务端故障：数据库连接断了、SQL 写错了、超时了，客户端全都收到「账目不存在」，于是用户以为记录被删了，运维也看不到 5xx 报警。正确做法：Service 层用 `ErrNotFound` 哨兵区分「查不到」，其他错误原样包装上抛，handler 里 `errors.Is` 判断后分别映射 404 / 500。**「404 兜一切」是短期省事、长期最贵的写法**。
::transfer
::scene 账本要支持「软删除」（`deleted_at` 字段），删除后 `GET` 应返回 404，但管理员能恢复。
::ask 查询要加什么条件？最容易漏的地方是哪？
::ans 所有面向普通用户的查询都要加 `deleted_at IS NULL`：`Get`、`List`、`Sum`、`Export`——**四处以上，漏一处就会把已删数据暴露出来**。容易漏的是聚合查询（`SUM` 会把已删的算进去）和「唯一性校验」（已删的记录占着唯一键，导致无法重新创建）。更好的做法是用 GORM 的软删除（自动加条件）或数据库视图，把「过滤」变成默认行为而不是每次记得写。**如果一个规则需要在 N 个地方重复，就应该把它下沉到一层**。
::crit `id` 非正整数返回 400，不查库
::crit `ErrNoRows` 映射为 404，其他错误映射 500，不混用
::crit 能说出软删除会影响到的全部查询点（含聚合与唯一性校验）
::crit 单条详情响应不含内部字段（如 `deleted_at`），除非明确需要

<!--day 12-->
::pre 完成 D11；会用 `GROUP BY`。
::predict sql
SELECT category, SUM(amount) AS total
FROM entries
WHERE user_id = ? AND date LIKE ?
GROUP BY category
::ask 这个查询的结果里，如果某分类一条记录都没有，会出现吗？
::ans 不会。`GROUP BY` 只对**存在的行**分组，没有行就没有组。如果前端期望「10 个分类都显示，没有的显示 0」，服务端必须补零：要么在应用层用分类表左连接，要么把分类列表和结果做 merge。**「没有数据」和「数据为 0」在 SQL 里是两件事**，前端图表经常因此少几根柱子。
::predict go
rows, err := db.QueryContext(ctx, `SELECT category, SUM(amount) FROM entries
    WHERE date LIKE ? GROUP BY category`, month+"%")
for rows.Next() {
    var c string
    var total int64
    rows.Scan(&c, &total)
    m[c] = total
}
::ask 这段有两个问题，分别是什么？
::ans ① `rows.Scan` 的 error 被忽略，NULL 或类型不符时静默失败；② `defer rows.Close()` 没有（虽然这里读完了会自动关，但出错提前 return 时不会）；③ `SUM` 在空组不会出现，但**如果 category 是 NULL，`Scan` 进 string 会报错**——要用 `sql.NullString` 或 `COALESCE(category,'未分类')`。**聚合查询里 `SUM` 返回 NULL 是常态**（空集或全 NULL），`COALESCE(SUM(amount),0)` 是标配。
::debug bash
curl 'localhost:8080/summary?month=2026-10'
# {"data":{"total":0,"by_category":[]}}
# 但数据库里明明有 5 条 10 月的记录
::ask 三个可能原因？
::ans ① **月份格式**：库里 `date` 是 `2026-10-19`，但查询用了 `LIKE '2026-10'`（少了 `%`），匹配不上；② **user_id 不对**：鉴权还没做，用了 `user_id=0` 或某个默认值；③ **时区/日期截断**：写入时 `time.Now().Format(...)` 用的 UTC，本地 10 月 1 日凌晨的记录变成 9 月 30 日。排查方式：`sqlite3 db "select date from entries limit 5"` 看真实存储值，再手写同样条件的 SQL 跑一遍。**「统计为 0」先怀疑 WHERE 条件，不要怀疑聚合函数**。
::transfer
::scene 你要返回「月度总额 + 按分类小计 + 笔数」，且前端图表需要全部分类（没有的补 0）。
::ask 用一条 SQL 还是多条？怎么补零？
::hint 想想分类表是否独立存在。
::ans 用两条：① `SELECT category, SUM(amount) total, COUNT(*) cnt FROM entries WHERE ... GROUP BY category`；② `SELECT name FROM categories WHERE user_id=?` 拿全部分类，然后在应用层 merge，缺失的填 0。一条 SQL 做左连接也可以：`categories LEFT JOIN (聚合子查询)`，但 SQLite 的写法较啰嗦、且分类表为空时行为要额外处理。**「补零」是展示逻辑，放在应用层比塞进 SQL 更好维护**——SQL 只负责「有什么」，展示层负责「缺什么」。
::crit `SUM` 用 `COALESCE` 兜底，空月份返回 0 而非报错
::crit 月份用半开区间，`date` 存储格式统一为 `YYYY-MM-DD`
::crit 分类小计能补零，前端拿到全部分类
::crit 统计接口返回笔数，而不只是金额

<!--day 13-->
::pre 完成 D1-D12；知道 `http.Handler` 是接口。
::predict go
func logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Println("before")
        next.ServeHTTP(w, r)
        log.Println("after")
    })
}
mux.Handle("/ledger", logging(http.HandlerFunc(h.List)))
::ask `next.ServeHTTP` 前后各打一条日志，能覆盖所有情况吗？
::ans 不能。如果 `h.List` 里 panic，`after` 不会打印（除非 recover）；如果中间调用了 `w.WriteHeader` 后 handler 又提前 return，`after` 仍会打印但你可能读不到状态码（因为 `ResponseWriter` 没包装，拿不到已写状态）。中间件的正确姿势是**包一层 `ResponseWriter` 记录状态码和字节数**，并在 defer 里写日志，这样 panic 也能记录。
::predict go
mux := http.NewServeMux()
mux.HandleFunc("/ledger", h.List)
handler := logging(mux)
srv := &http.Server{Handler: handler}
::ask 如果 `logging` 只包了某个路由，会有什么问题？
::ans 只包单路由时，未注册的路径（404）、其他路由都不会经过它，日志里看不到 404 请求——而这恰恰是最需要排查的流量（扫描器、前端拼错路径）。**中间件应该包住整个 mux**，而不是逐个路由挂。同理，CSRF、限流、CORS 都应该在最外层包整个路由器，否则总有路径漏掉。
::debug go
type respWriter struct {
    http.ResponseWriter
    status int
}
func (w *respWriter) WriteHeader(code int) {
    w.status = code
    w.ResponseWriter.WriteHeader(code)
}
// middleware
rw := &respWriter{ResponseWriter: w}
next.ServeHTTP(rw, r)
log.Println(rw.status)   // 期望 200，实际 0
::ask 为什么 status 是 0？
::ans 因为 handler 如果**没有显式调用 `WriteHeader`**（直接 `w.Write(...)`），Go 会隐式写 200，但走的是内嵌 `ResponseWriter` 的方法（不是你的包装类型的方法），所以 `rw.status` 一直是 0。修法：在包装类型的 `Write` 方法里也记录状态（写 body 时如果 status 为 0 就设成 200）：
```go
func (w *respWriter) Write(b []byte) (int, error) {
    if w.status == 0 { w.status = http.StatusOK }
    return w.ResponseWriter.Write(b)
}
```
**这是「包装 ResponseWriter」最经典的一个坑**，只重写 `WriteHeader` 是不够的。
::transfer
::scene 你要按顺序挂 `Recovery → 日志 → 鉴权` 三个中间件。
::ask 从外到内还是从内到外？写出组装代码并说明理由。
::hint 哪个必须最先执行？panic 发生在鉴权里怎么办？
::ans 组装：`handler := Recovery(Logging(Auth(mux)))`——**写在前面的在最外层**。理由：Recovery 必须在最外层，才能捕获包括 Logging、Auth 在内的所有 panic；Logging 在 Auth 外层，才能记录「被鉴权拒绝的请求」（401 也要有日志）；Auth 在内层，只对合法请求做校验。如果顺序反了（Auth 在外），未登录请求的 panic 就没人兜；如果 Recovery 在内，Logging 里的 panic 会杀进程。**中间件顺序 = 责任链，想清楚「谁要看到谁的失败」**。
::crit 中间件包住整个 mux，不是逐路由挂
::crit 包装 `ResponseWriter` 时同时重写 `WriteHeader` 和 `Write`
::crit 能用 `defer` 在 panic 时也记录日志
::crit 中间件顺序有明确理由（Recovery 最外、Logging 次之、Auth 最内）

<!--day 14-->
::pre 完成 D13；会用中间件。
::predict go
start := time.Now()
next.ServeHTTP(w, r)
log.Printf("%s %s %d %v", r.Method, r.URL.Path, status, time.Since(start))
::ask 这条日志在高并发下会有什么问题？还缺什么关键信息？
::ans 问题一：**多条日志会交错**，`log.Printf` 单条是原子的，但多行输出（比如 panic 栈）会混在一起，无法归属到某个请求。问题二：缺 **request ID**——同一个请求的多条日志（进入、SQL、错误）无法串起来，排查时只能靠时间戳猜。问题三：`r.URL.Path` 不含 query，查「哪个参数导致的错误」时信息不足（但也要注意别把敏感参数打进日志）。修法：用 `log/slog` 结构化输出 + 请求开始生成 `request_id` 放进 context。
::predict go
// request ID 中间件
id := r.Header.Get("X-Request-ID")
if id == "" { id = uuid.NewString() }
ctx := context.WithValue(r.Context(), reqIDKey, id)
next.ServeHTTP(w, r.WithContext(ctx))
::ask 这个写法有两个隐患，分别是什么？
::ans ① **无条件信任客户端传的 `X-Request-ID`**：恶意客户端可以传相同的 ID 制造日志混淆，或传超长字符串撑爆日志。应该校验格式（如 UUID/长度 ≤ 64），不合法就重新生成。② **`context.WithValue` 的 key 必须是非导出类型**：如果 key 是 string，不同包可能用同一个字符串 key 互相覆盖。要用 `type ctxKey int; const reqIDKey ctxKey = 1`。**「用 string 当 context key」是 Go 里明确反对的做法**。
::debug bash
# 日志里看到
2026-10-19 10:00:01 POST /ledger 500 12ms
2026-10-19 10:00:01 GET /ledger 200 3ms
# 但错误响应里给的 request_id 是 abc-123
# 日志里搜 abc-123：没有
::ask 为什么搜不到？问题出在哪？
::ans 说明**错误响应里的 request_id 和日志里记录的不是同一个来源**。常见原因：响应里用的是 handler 里现生成的 UUID，日志里用的是中间件生成的另一个；或者日志里压根没打 request_id 字段。修法：中间件生成一次，放进 `context`，**handler、Service、日志全部从 context 取同一个值**；错误响应也从 context 取。**request_id 的价值在于「唯一且一致」**，两处各生成一个就等于没有。
::transfer
::scene 你要定义一套日志字段规范，让「按 request_id 串起一次请求」成为可能。
::ask 列出必备字段，并说明哪些字段绝对不能打。
::hint 想想排查一个 500 需要哪些信息，以及哪些会泄漏隐私。
::ans 必备：`ts`（时间）、`level`、`request_id`、`method`、`path`（不含 query 敏感项）、`status`、`duration_ms`、`user_id`（已鉴权时）、`error`（错误摘要）、`bytes`。可选：`client_ip`（注意合规）、`user_agent`。**绝对不能打**：`Authorization` 头、密码、`Set-Cookie`、完整请求体（可能含金额/备注等隐私）、SQL 参数原值（用占位符数量代替）。**日志是排障工具，不是数据副本**——把用户账目明细打进日志，等于凭空造了一个不受管控的数据库。
::crit 每条请求日志都有 request_id，且响应体里的 ID 与日志一致
::crit 日志用结构化格式（slog/zap），字段名统一
::crit 不信任客户端传入的 request ID，做了格式与长度校验
::crit context key 用自定义类型，不用裸 string

<!--day 15-->
::pre 完成 D13-D14；有日志与中间件基础。
::predict go
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
    in, ok := decodeJSON[CreateInput](w, r)
    if !ok { return }
    if err := in.Validate(); err != nil {
        Fail(w, 400, 1001, err.Error())
        return
    }
    ...
}
::ask 这种「每个 handler 自己写 if err → Fail」的模式，随着接口变多会怎样？
::ans 会重复几十遍同样的映射逻辑，且容易出现「这个接口 400、那个接口 422」的不一致。更好的做法是**让 handler 只返回 error，由统一中间件转换**：handler 签名变成 `func(w, r) error`，外面套一层 `errorMapper`，用 `errors.As` 判断错误类型并映射状态码。这样「参数错 → 400」只定义一次，所有接口行为一致。**重复的错误映射是 bug 的温床**。
::predict go
type ValidationError struct{ Field, Msg string }
func (e *ValidationError) Error() string { return e.Msg }
// 中间件里
var ve *ValidationError
if errors.As(err, &ve) {
    Fail(w, 400, 1001, ve.Msg)
}
::ask `errors.As` 的第二个参数为什么必须是指向指针的指针？
::ans 因为 `errors.As` 需要**把找到的错误值写回给你**，所以传的是「存放指针的变量的地址」。`&ve` 里 `ve` 是 `*ValidationError`，`&ve` 是 `**ValidationError`。如果传 `ve`（nil 指针），As 无法写入，会 panic：`errors: target must be a non-nil pointer`。记忆方法：**`Is` 判等用值，`As` 取值用地址**。
::debug go
func writeError(w http.ResponseWriter, err error) {
    switch err.(type) {          // 类型断言
    case *ValidationError:
        Fail(w, 400, 1001, err.Error())
    case *NotFoundError:
        Fail(w, 404, 1002, err.Error())
    default:
        Fail(w, 500, 5001, "内部错误")
    }
}
// 但 err 是 fmt.Errorf("create: %w", &ValidationError{...})
::ask 这个 switch 会命中 ValidationError 吗？
::ans 不会，会走到 default → 500。因为 `err.(type)` 只看**最外层类型**，而最外层是 `*fmt.wrapError`。必须用 `errors.As(err, &ve)` 沿链查找。**只要项目里用了 `%w` 包装（应该用），类型断言就不能用于错误分类**，这是 `errors.As` 存在的唯一理由。
::transfer
::scene 定义完整的错误类型体系，覆盖参数、未找到、冲突、未授权、内部错误。
::ask 每种用什么形式（哨兵/自定义类型/包装）？给出定义与映射表。
::hint 需要携带字段信息的用类型，只需要判等的用哨兵。
::ans 
```go
var (
    ErrNotFound  = errors.New("not found")
    ErrForbidden = errors.New("forbidden")
    ErrConflict  = errors.New("conflict")
)
type ValidationError struct{ Field, Msg string }
func (e *ValidationError) Error() string { return e.Field + ": " + e.Msg }
```
映射：`ValidationError` → 400/1001（`errors.As`）；`ErrNotFound` → 404/1002（`errors.Is`）；`ErrForbidden` → 403/2002；`ErrConflict` → 409/3001；其他 → 500/5001 且只回 request_id。Service 层只管返回语义错误，**不 import `net/http`**——这一条能验证分层是否干净。包装时用 `%w` 保留链。
::crit handler 只返回 error，状态码映射集中在一处
::crit 错误分类全部用 `errors.Is`/`errors.As`，无类型断言、无字符串匹配
::crit Service 层不 import `net/http`，错误类型与 HTTP 解耦
::crit 500 响应只给 request_id，不回显内部错误

<!--day 16-->
::pre 完成 D7-D8；理解 offset 的成本。
::predict sql
-- keyset 分页：按 (date, id) 倒序
SELECT * FROM entries
WHERE user_id = ? AND (date, id) < (?, ?)
ORDER BY date DESC, id DESC LIMIT 20
::ask SQLite 支持行值比较 `(a,b) < (?,?)` 吗？如果不支持该怎么写？
::ans SQLite 3.15+ 支持行值比较，但为了兼容性和索引利用，更稳妥的写法是展开：
```sql
WHERE user_id = ?
  AND (date < ? OR (date = ? AND id < ?))
ORDER BY date DESC, id DESC LIMIT 20
```
注意索引要建 `(user_id, date DESC, id DESC)` 才能让这个条件走范围扫描。**行值比较在 MySQL/PostgreSQL 上支持较好，SQLite 建议展开写**，可移植性更好。
::predict go
// 第一页返回的 next_cursor 是 base64("2026-10-19|42")
// 客户端原样传回 ?cursor=2026-10-19|42   （未编码）
::ask 会出什么问题？
::ans `|` 在 URL query 里不是保留字符，但 `+`、`&`、`=` 是——如果游标里含这些字符，会被 URL 解析截断或转义错。所以游标**必须 base64url 编码**（`base64.RawURLEncoding`，无 padding、用 `-` `_` 替代 `+` `/`）。另外要防「客户端伪造游标」：解码后校验格式（两段、日期可解析、id 是正整数），不合法返回 400 而不是 500。**游标是不透明字符串，服务端必须当作不可信输入处理**。
::debug go
cursor := r.URL.Query().Get("cursor")
b, _ := base64.StdEncoding.DecodeString(cursor)
parts := strings.Split(string(b), "|")
id, _ := strconv.ParseInt(parts[1], 10, 64)
::ask 这段代码在恶意输入下会怎样？
::ans 两处 panic 风险：① `parts[1]` 在 `parts` 长度 < 2 时越界 panic（客户端传 `cursor=abc` 解码后是乱码，可能没有 `|`）；② `ParseInt` 的错误被忽略，id 变 0，可能查出错误的数据。必须：先判断 `len(parts) == 2`，再校验 `err == nil`，全部失败返回 400。**任何来自客户端的字符串，在用之前都要假设它是垃圾**——`strings.Split` + 下标访问是 panic 的高发组合。
::transfer
::scene 你的列表接口同时支持 `offset` 和 `cursor`。
::ask 两者都传时怎么办？响应里怎么表达「当前用的是哪种」？
::hint 必须有一条确定规则，不能让行为依赖实现顺序。
::ans 规则：**`cursor` 优先，非空时忽略 `offset`**，并在文档里写死。响应回显：`{items, limit, total?, next_cursor, paging: "cursor"|"offset"}`——让客户端知道服务端实际用了哪种，避免「我传了 cursor 但结果像 offset」的困惑。另一个决策：游标模式下 `total` 是否返回。建议**只在第一页（无 cursor 时）返回 total**，后续页返回 `null` 或省略，因为深分页时 `COUNT(*)` 比取数据还贵。
::crit 能写出 keyset 分页的 WHERE 条件，并说明索引怎么配合
::crit 游标用 base64url 编码，解码后校验段数与类型，不合法返回 400
::crit 同时传 offset 和 cursor 时规则明确（cursor 优先）
::crit 响应回显分页方式，游标模式下 total 的返回策略明确

<!--day 17-->
::pre 完成 D1-D16；所有接口都能 curl 通。
::predict bash
curl -s localhost:8080/ledger | jq '.data.items | length'
::ask 如果服务没启动，这条命令输出什么？脚本会怎么继续？
::ans 输出空（`curl -s` 静默失败），`jq` 报 `parse error: Expected value before EOF`，但**脚本默认会继续往下执行**——于是后面的断言全部基于空数据，可能「碰巧通过」。修法：`curl -fsS`（`-f` 让 4xx/5xx 返回非零，`-S` 显示错误），配合 `set -euo pipefail`，任一命令失败立即退出。**验收脚本最怕的不是失败，是「失败但不退出」**。
::predict bash
set -e
TOKEN=$(curl -s -X POST /login -d '...' | jq -r '.data.token')
curl -s -H "Authorization: Bearer $TOKEN" /ledger
::ask `set -e` 能保证 `TOKEN` 一定拿到吗？
::ans 不能。`$(...)` 里 curl 失败时，`set -e` **不会**让脚本退出（命令替换里的失败被吞掉，除非 `set -o pipefail` 且是管道）。`TOKEN` 可能是 `null` 或空字符串，后续请求带着 `Bearer null` 变成 401，脚本报错在「意料之外的地方」。修法：显式检查 `[ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] || { echo "登录失败"; exit 1; }`。**`set -e` 不是万能的，命令替换、管道、条件语句里都有例外**。
::debug bash
#!/usr/bin/env bash
set -e
BASE=http://localhost:8080
curl -s $BASE/healthz
echo "ok"
::ask 这个脚本有什么问题？（提示：healthz 返回 500 时）
::ans `curl -s` 对 500 也返回 0（curl 只要收到响应就成功），`set -e` 不会触发，脚本照样输出 `ok`。必须用 `curl -f`（fail on HTTP error）或显式检查状态码：`code=$(curl -s -o /dev/null -w '%{http_code}' $BASE/healthz); [ "$code" = 200 ] || exit 1`。**「HTTP 500 但 curl 退出码 0」是验收脚本最常见的假绿来源**。
::transfer
::scene 写一个覆盖「注册 → 登录 → 创建 → 列表 → 统计 → 删除」的回归脚本。
::ask 脚本结构怎么组织？失败时怎么定位到具体步骤？
::hint 每个步骤打印名字，断言失败时输出「期望 vs 实际」。
::ans 
```bash
#!/usr/bin/env bash
set -euo pipefail
BASE=${BASE:-http://localhost:8080}
step() { printf '\n[%s] %s\n' "$1" "$2"; }
fail() { echo "FAIL: $1 (期望 $2, 实际 $3)"; exit 1; }

step 1 "注册"
EMAIL="e2e-$(date +%s)@x.com"
code=$(curl -s -o /tmp/r.json -w '%{http_code}' -X POST "$BASE/register" \
  -H 'Content-Type: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"correct-horse-1\"}")
[ "$code" = 201 ] || fail "注册状态码" 201 "$code"

step 2 "登录"
TOKEN=$(curl -fsS -X POST "$BASE/login" ... | jq -r '.data.token')
[ -n "$TOKEN" ] && [ "$TOKEN" != null ] || fail "token" non-empty "$TOKEN"
...
```
三个要点：**每步编号 + 名称**（失败时一眼定位）、**断言带期望与实际**、**用时间戳造唯一数据**（否则第二次跑就撞唯一约束）。最后 `trap 'rm -f /tmp/r.json' EXIT` 清理。
::crit 脚本 `set -euo pipefail`，且用 `curl -f` 或断言状态码
::crit 每步有编号与名称，失败输出「期望 vs 实际」
::crit 数据用时间戳/随机后缀，脚本可重复运行
::crit 数值断言（金额、条数）而不只是状态码

<!--day 18-->
::pre 完成 D1-D17；回归脚本能跑通。
::predict bash
go vet ./... && go build ./... && ./scripts/e2e.sh
::ask 三条都通过，能说明阶段三完成了吗？
::ans 不能。它们只证明「能编译、静态检查过、脚本覆盖的路径正确」。阶段三的验收还要求：重启不丢（脚本必须杀进程）、分页边界正确（`limit=0`、`offset` 超界、空结果）、错误码映射正确（404 vs 500）、日志能按 request_id 追踪。**「CI 绿」和「验收通过」之间差的是「验收清单有没有被逐条覆盖」**。
::predict go
// 分页边界测试
cases := []struct{ limit, offset int }{{0, 0}, {-1, 0}, {101, 0}, {20, 999999}}
::ask 这四个用例分别期望什么行为？
::ans ① `limit=0` → 用默认值 20（不是返回空）；② `limit=-1` → 默认 20（不能变成「不限」）；③ `limit=101` → 默认 20 或 400（要有明确策略，建议 clamp 到 100）；④ `offset=999999` → 返回空数组 + 正确的 total，不是 500。**边界测试的价值在于「把未定义的灰色地带变成明确行为」**，否则线上遇到时只能临时拍脑袋。
::debug bash
# 阶段验收时发现
curl 'localhost:8080/ledger?limit=20&offset=0'   # 20 条
curl 'localhost:8080/ledger?limit=20&offset=20'  # 20 条
curl 'localhost:8080/ledger?limit=20&offset=40'  # 0 条
# 但总数是 45
::ask 哪里有问题？
::ans 第 2 页返回了 20 条，说明总共有 40 条被读到；第 3 页返回 0 条，但总数是 45——第 41-45 条丢了。可能原因：① `offset` 计算用了 `page*limit` 但 `page` 从 1 开始（第 3 页算出 offset=60，跳过 41-60）；② SQL 里 `LIMIT ? OFFSET ?` 的参数顺序传反了（变成 `LIMIT offset OFFSET limit`，SQLite 不报错但结果荒谬）；③ 数据在两次请求之间被删了 5 条。**参数顺序传反是 Go 里不会编译报错、只能靠测试抓的典型错误**。
::transfer
::scene 写阶段三的验收报告，要能让别人复现。
::ask 报告里必须包含哪几项？
::hint 想想「别人拿到报告后能不能一条命令重跑」。
::ans ① **环境**：Go 版本、启动命令、数据库路径；② **接口清单**：5 个路由 + 状态码 + 示例请求响应；③ **验收项对照表**：每条要求 → 用什么命令验证 → 实际输出（贴关键行）；④ **边界用例结果**：limit/offset 非法值、404、405、空结果；⑤ **持久化证据**：kill 进程前后对比；⑥ **已知问题**：明确写出没做的（比如鉴权还没做、cursor 只有字段没实现）；⑦ **复现脚本路径**。**报告的核心不是「我做了」，是「你可以验证我做了」**。
::crit 验收清单每一项都有对应的可执行命令与输出
::crit 边界用例（limit 非法、404、405、空结果）全部有明确行为
::crit 有 kill 进程验证持久化的证据
::crit 报告里诚实列出未完成项，而不是回避
