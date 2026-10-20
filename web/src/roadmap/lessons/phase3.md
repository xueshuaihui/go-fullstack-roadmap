<!--day 1 | light-->
#### 一个 HTTP 服务的最小闭环
```go
func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json; charset=utf-8")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"message":"hello"}`))
    })

    srv := &http.Server{Addr: ":8080", Handler: mux}
    log.Println("listen :8080")
    if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
        log.Fatal(err)
    }
}
```
`http.ErrServerClosed` 是正常关闭的信号，不是错误——**不判断它，优雅关闭时程序会以 fatal 退出**。

#### 响应写的顺序不能乱
`Header().Set` → `WriteHeader(status)` → `Write(body)`。一旦 `Write` 了第一次，状态码和头就发出去了，再改无效（会有 `superfluous WriteHeader call` 警告）。

#### 一个请求在服务端到底经过了什么
```
TCP 连接 → net/http 解析请求行与头 → 匹配 mux 模式 → 中间件链 → handler
        → 写状态码与头 → 写 body → （keep-alive）复用连接
```
为什么要背这条链：**每一环都可能成为你的 bug 位置**。404 是路由没匹配，405 是方法不对，400 是 body 解析失败，500 是 handler 内 panic 或业务错误，而「响应体是空的」往往是没写 `Write` 或中间件提前 return 了。

#### `net/http` 的三个默认行为，会咬人
1. **默认没有超时**。`&http.Server{Addr: ":8080"}` 的 `ReadTimeout`/`WriteTimeout` 都是 0，意味着一个慢客户端可以永久占住连接（Slowloris）。现在就该加上，别等到阶段六。
2. **默认会 panic 后关闭连接**。handler 里 panic 时 `net/http` 会打印堆栈并断开这条连接，但不会杀进程——这看起来安全，实际上客户端拿到的是「连接被重置」，不是 500。
3. **默认不限制请求体大小**。`r.Body` 是无界的，一个 1GB 的 POST 会把内存吃光。用 `http.MaxBytesReader` 兜住（D2 会写）。

#### 监听地址写 `:8080` 而不是 `localhost:8080`
`:8080` 等价于 `0.0.0.0:8080`，监听所有网卡；`localhost:8080` 只监听回环。**手机连不上、容器外访问不了，十次有八次是这里写成了 localhost。** 安全边界应该由防火墙和反向代理控制，而不是靠只监听回环。

#### 判据
```bash
curl -i localhost:8080/hello
# HTTP/1.1 200 OK   Content-Type: application/json; charset=utf-8
```
再访问 `/nope` 看到 404，说明 mux 在正常工作。

::q 为什么 `ListenAndServe` 返回 `http.ErrServerClosed` 时不算错误？
::a 因为这是 `srv.Shutdown()` 被调用后的正常返回，表示服务器已停止接受新连接。把它当错误 `log.Fatal` 会让优雅关闭变成非零退出码，容器编排会误判为崩溃重启。
::q 调用 `WriteHeader` 之后再 `Header().Set` 为什么无效？
::a 响应头在 `WriteHeader`（或首次 `Write`）时就被序列化发送给客户端，之后再修改内存里的 header map 不会影响已发出的响应。所以所有头必须在写状态码之前设置。
::q 不设 `Content-Type` 会发生什么？
::a Go 会用 `http.DetectContentType` 嗅探前 512 字节猜类型，JSON 可能被猜成 `text/plain`，浏览器或前端就不会按 JSON 解析。显式设置是唯一可靠做法。

<!--day 2 | core-->
#### 读请求体：`json.Decoder` 而不是 `ReadAll + Unmarshal`
```go
func createEntry(w http.ResponseWriter, r *http.Request) {
    var in struct {
        Amount   int64  `json:"amount"`
        Category string `json:"category"`
        Date     string `json:"date"`
        Note     string `json:"note"`
    }

    dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20))
    dec.DisallowUnknownFields()          // 拒绝多余字段（严格模式）
    if err := dec.Decode(&in); err != nil {
        http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
        return
    }
    ...
}
```
三个点：
- `MaxBytesReader` 限制请求体大小，防超大 body 打爆内存。
- `DisallowUnknownFields` 让「字段名拼错」立刻 400，而不是静默忽略后落库为空值。**这在联调阶段能省大量时间。**
- `Decode` 直接读流，不需要先 `ReadAll`。

#### 请求体的三个常见错误
1. **`r.Body` 只能读一次**。读两次第二次拿到空。需要多次读就 `io.ReadAll` 后 `io.NopCloser(bytes.NewReader(b))` 重置。
2. **JSON 数字默认解析到 `float64`**，如果目标字段是 `int64`，`json.Decoder` 会做转换但**超出精度会静默出问题**。金额建议在契约里就用整数分，或者用 `json.Number`。
3. **`null` 和缺字段都会得到零值**，无法区分「没传」和「传了 0」。需要区分就用指针字段 `*int64`。

第 2 点值得亲眼看一次，它决定了你会不会在金额上栽跟头：

```go
var v struct {
    A int64 `json:"a"`
}
json.Unmarshal([]byte(`{"a": 9007199254740993}`), &v)
fmt.Println(v.A)   // 9007199254740992 —— 末位被抹掉了，且没有报错
```
原因是 JSON 数字先变成 `float64`（53 位有效位）再转 `int64`。家庭账本的金额远到不了这个量级，但「**静默截断**」这个行为本身要记住：凡是 JSON 里的大整数（订单号、雪花 ID、金额分），都可能被精度吃掉。真需要精确就用 `json.Number` 或字符串传。

#### 报错对照：这四个报错能定位 90% 的联调问题
| 报错原文 | 原因 | 修法 |
| :--- | :--- | :--- |
| `unexpected EOF` | body 为空，或 `Content-Length` 与实际不符（curl 忘了 `-d`） | 客户端检查是否真的发了 body |
| `json: cannot unmarshal string into Go struct field .amount of type int64` | 前端传了 `"3550"`（字符串），后端要 `int64` | 契约里定死类型；要兼容就在 DTO 用 `json.Number` 或自定义 `UnmarshalJSON` |
| `json: unknown field "amout"` | 字段名拼错，`DisallowUnknownFields` 打开了 | 按报错里的字段名改前端，别急着关掉严格模式 |
| `http: request body too large` | 超过 `MaxBytesReader` 的 1MB | 确认不是把文件当 JSON 传了；正常账目请求不该超过几 KB |

#### 先跑通一个最小 echo 服务
把下面这段存成 `main.go`，`go run .` 之后就能验证今天的全部知识点——它同时是 D3 路由、D4 信封的地基：

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
)

type EchoIn struct {
    Amount   int64  `json:"amount"`
    Category string `json:"category"`
    Date     string `json:"date"`
    Note     string `json:"note,omitempty"`
}

func echo(w http.ResponseWriter, r *http.Request) {
    var in EchoIn
    dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20))
    dec.DisallowUnknownFields()
    if err := dec.Decode(&in); err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        // 把解析错误原样带回，联调时非常有用；生产环境可换成固定文案
        json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
        return
    }
    buf, err := json.Marshal(in)
    if err != nil {
        http.Error(w, `{"error":"encode"}`, http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
    w.WriteHeader(http.StatusCreated)
    w.Write(buf)
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("POST /echo", echo)
    log.Println("listen :8080")
    log.Fatal(http.ListenAndServe(":8080", mux))
}
```
注意错误分支里也是「先设头、再 `WriteHeader`、最后写 body」——顺序颠倒会触发 `http: superfluous response.WriteHeader call`，头已经发出去，状态码改不动了。

#### 写响应：先编码到 buffer，再一次性写
```go
w.Header().Set("Content-Type", "application/json; charset=utf-8")
w.WriteHeader(http.StatusCreated)
if err := json.NewEncoder(w).Encode(resp); err != nil {
    // 此时头已发，只能记日志
    log.Printf("encode response: %v", err)
}
```
`Encode` 是流式的，出错时头可能已经发出去了。所以严格场景应该先 `json.Marshal` 到 `[]byte`，成功后再 `WriteHeader + Write`——这样编码失败还能返回 500。

#### 5 分钟最小验证：三个坏请求，看状态码是不是 400
服务跑起来后，先别写业务，专打坏请求：

```bash
curl -si -X POST localhost:8080/echo -d '' | head -1            # 400：空 body
curl -si -X POST localhost:8080/echo -d '{"amount":"3550"}' | head -1  # 400：类型不符
curl -si -X POST localhost:8080/echo -d '{"amout":3550}' | head -1     # 400：未知字段
```
三条都必须是 `400`，且**没有一条是 500**。500 意味着错误没被拦在解析层，直接漏到了业务代码——那种 500 在线上最难查，因为日志里只有 panic 栈，看不出是客户端传错。

#### 判据
```bash
curl -i -X POST localhost:8080/ledger \
  -H 'Content-Type: application/json' \
  -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}'
# 201 + JSON

curl -i -X POST localhost:8080/ledger -d '{"amount":"abc"}'
# 400，而不是 500

curl -i -X POST localhost:8080/ledger -d '{"amount":3550,"amout":1}'
# 400，报错里明确指出 unknown field
```
最后一条是「严格模式的收益证明」：如果不开 `DisallowUnknownFields`，这个请求会**成功**，然后你在库里发现 `note` 是空的，回头查半天才发现前端字段拼错。宁可 400 报出来。

::q 为什么推荐 `json.NewDecoder(r.Body)` 而不是 `io.ReadAll` + `json.Unmarshal`？
::a 前者直接流式解码，不用把整个 body 复制到内存；配合 `MaxBytesReader` 可以在超限时立即中断。后者要先把全部内容读进内存，大 body 会占用更多内存，还需要自己处理读取错误。
::q `DisallowUnknownFields` 打开后，前端多传一个字段会怎样？
::a `Decode` 返回错误，通常会响应 400。这是有意的严格性：字段名拼错（`amout` vs `amount`）会立刻暴露，而不是被静默忽略后写入零值。联调阶段能避免「数据不对但不报错」的排查地狱。
::q JSON 里的 `null` 和一个缺失的字段，解码到 `int64` 字段有什么区别？
::a 没有区别，两者都得到零值 0。要区分「未提供」和「显式传 0/null」，字段类型必须用指针 `*int64`：缺失时为 nil，显式 null 也是 nil，显式 0 则是指向 0 的指针。PATCH 语义必须用指针。

<!--day 3 | normal-->
#### Go 1.22 的路由：模式里带方法
```go
mux.HandleFunc("POST /ledger", createEntry)
mux.HandleFunc("GET /ledger", listEntries)
mux.HandleFunc("GET /ledger/{id}", getEntry)
mux.HandleFunc("DELETE /ledger/{id}", deleteEntry)
```
方法写在模式最前面，路径参数用 `{name}` 占位，handler 里 `r.PathValue("id")` 取出。

三条行为要知道：
1. **方法不匹配返回 405**，不是 404。这对客户端很重要——404 意味着「资源不存在」，405 意味着「路径对了但方法错了」。
2. `GET /ledger/{id}` 不会匹配 `GET /ledger`，也不会匹配 `GET /ledger/1/extra`。
3. `{path...}` 可以匹配剩余全部路径，用于静态文件。

#### 最具体的模式胜出
```go
mux.HandleFunc("GET /ledger/summary", summary)  // 更具体
mux.HandleFunc("GET /ledger/{id}", getEntry)    // 更泛化
```
`/ledger/summary` 会命中第一个，不会进 `{id}`。**但这也意味着如果你把 `{id}` 的解析写成 `strconv.ParseInt`，`summary` 永远走不到那个分支**——顺序无关，靠具体度匹配。

这条规则有一个不直观的推论：**注册顺序完全不影响匹配**，只影响「同级冲突」时的报错。所以不要把「先注册的先命中」这种老框架经验带过来，`{id}` 写在 `summary` 前面也一样。

#### 冲突的模式会让程序启动就 panic
```go
mux.HandleFunc("GET /ledger/{id}", getEntry)
mux.HandleFunc("GET /ledger/{name}", getByName)   // 启动即 panic
```
报错原文是 `panic: pattern "GET /ledger/{name}" (registered at ...) conflicts with pattern "GET /ledger/{id}"`。这是 Go 1.22 mux 的一个优点：**路由冲突在启动时暴露，不在凌晨三点被第一个用户触发**。看到这个 panic 不要慌，它说的是「两个模式的匹配集合完全重叠，我无法决定用哪个」，改成一个就完事。

注意区分两种情况：`/ledger/{id}` 与 `/ledger/summary` 是**包含关系**（更具体的赢），不 panic；`{id}` 与 `{name}` 是**等价关系**（无法分先后），panic。

#### 查询参数：`r.URL.Query()` 永远返回字符串
```go
q := r.URL.Query()
month := q.Get("month")              // 没传时是 ""
if month == "" {
    month = time.Now().Format("2006-01")
}
limit, err := strconv.Atoi(q.Get("limit"))
if err != nil || limit <= 0 || limit > 100 {
    limit = 20                       // 非法值直接兜底，不报错
}
```
两个约定：「**没传**」和「传错」都走默认值，不返回 400（分页参数不值得让整个请求失败）；**默认值要写死上限**（`limit > 100` 就压到 20），否则 `?limit=100000` 就是一次内存放大攻击。

#### 路径参数一定要校验
```go
idStr := r.PathValue("id")
id, err := strconv.ParseInt(idStr, 10, 64)
if err != nil {
    writeErr(w, http.StatusBadRequest, "invalid id")
    return
}
```
不校验的后果：`/ledger/abc` 会被当成 0 去查库，然后返回 404，日志里看不出是「参数错」还是「真的没有这条」。

还有一个隐蔽情况：`PathValue` 在模式没匹配到该参数时返回**空字符串**，不报错。所以「ID 是空的」和「ID 不合法」在代码里长得一样，必须先判空再 `ParseInt`，否则空串也会走到「不合法」分支，错误信息写不准。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 启动 `panic: pattern ... conflicts with ...` | 两个模式匹配集合等价（`{id}` vs `{name}`） | 保留一个，另一个换成不同路径 |
| `GET /ledger/` 返回 404 | 注册的是 `/ledger`，末尾多一个斜杠不算同一个模式 | 客户端别带尾斜杠，或额外注册 `GET /ledger/{$}` |
| `r.PathValue("id")` 总是空串 | 模式写成了 `/ledger/:id`（旧框架语法）或忘了 `{}` | 改成 `{id}`；同时确认 Go ≥ 1.22 |
| 405 但响应体是空的 | 默认 405 只带 `Allow` 头 | 需要 JSON 体就自己包一层 mux 做 method 分发（阶段三 D13 的中间件思路） |

#### 5 分钟最小验证：路由表一次打完
```bash
go run . &
for m in GET POST PUT DELETE; do
  printf '%-7s ' "$m"; curl -s -o /dev/null -w '%{http_code}\n' -X $m localhost:8080/ledger
done
curl -si localhost:8080/ledger/1 | grep -i '^allow'   # 405 时看 Allow
```
第一条循环应该输出 `200 201 405 405`。如果没有 405 而是 404，说明你只注册了 `GET /ledger`，**方法限定没生效**——多半是写成了 `mux.HandleFunc("/ledger", ...)`。

#### 判据
```bash
curl -i localhost:8080/ledger            # 200
curl -i -X POST localhost:8080/ledger     # 201
curl -i -X PUT localhost:8080/ledger      # 405
curl -i localhost:8080/ledger/abc         # 400（校验生效）
curl -i localhost:8080/ledger/999         # 404
```

::q `POST /ledger` 存在，请求 `GET /ledger` 时返回 405 还是 404？
::a 在 Go 1.22 的 mux 里，如果路径已注册但方法不匹配，返回 405 并带 `Allow` 头。这是更准确的语义。老版本 mux 或手写路由通常是 404，容易误导前端。
::q `GET /ledger/{id}` 会不会匹配 `/ledger/summary`？
::a 不会，如果同时注册了 `GET /ledger/summary`，因为它更具体，优先级更高。但如果没有注册它，`/ledger/summary` 会命中 `{id}` 分支，此时 `PathValue("id")` 是 `"summary"`，数字解析失败——所以参数校验必须要写。
::q 为什么路径参数 `"abc"` 应该返回 400 而不是 404？
::a 400 表示「请求本身有问题」（客户端传了非数字 ID），404 表示「请求合法但资源不存在」。混淆两者会让排查方向完全错误：看到 404 会去查数据库，实际是参数格式错。日志和监控上也应该能区分。

<!--day 4 | core-->
#### 统一信封解决的是「客户端要处理几种形状」
没有信封时，成功返回 `{...}`，失败返回 `{"error": "..."}`，客户端每处调用都要写两套解析。统一信封把所有响应变成同一种结构：

```go
type Response[T any] struct {
    Code    string `json:"code"`            // 业务码，如 "OK" / "INVALID_ARGUMENT"
    Message string `json:"message"`
    Data    T      `json:"data,omitempty"`
    ReqID   string `json:"request_id,omitempty"`
}
```

两个关键设计决定：
1. **`code` 是字符串而不是数字**。`"INVALID_AMOUNT"` 比 `40013` 可读、可 grep、不会因为加字段而改号。
2. **HTTP 状态码表达传输层结果，`code` 表达业务结果**。两者不是冗余——`200 + code=PARTIAL_SUCCESS` 是合法的，`401 + code=TOKEN_EXPIRED` 也是非常常见的组合。

#### 泛型让 handler 不写重复代码
```go
func OK[T any](w http.ResponseWriter, data T) {
    writeJSON(w, http.StatusOK, Response[T]{Code: "OK", Message: "success", Data: data})
}

func Fail(w http.ResponseWriter, status int, code, msg string) {
    writeJSON(w, status, Response[any]{Code: code, Message: msg})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
    buf, err := json.Marshal(v)
    if err != nil {
        http.Error(w, `{"code":"INTERNAL"}`, http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
    w.WriteHeader(status)
    w.Write(buf)
}
```
注意 `Fail` 用 `Response[any]`：失败时 `data` 是 nil，`omitempty` 会把它省掉，响应更干净。

#### `omitempty` 在这里埋了一个坑
`Data T` 加了 `omitempty`，当 `T` 是 `int64` 而值是 `0`、或是 `""`、`false` 时，**整个 `data` 字段会消失**。于是 `OK(w, 0)` 返回的是 `{"code":"OK","message":"success"}`，前端 `res.data` 是 `undefined`，做加法得到 `NaN`。

这不是理论问题：`GET /summary` 返回本月总支出 0 元时就会命中。三种处理方式，按推荐度排：

1. **`Data` 不加 `omitempty`**，失败时显式输出 `"data": null`。结构永远稳定，前端不用判存在性。代价是失败响应多 15 字节。
2. 给「零值有意义」的接口写专用 DTO（`SummaryResp{ Total int64 }`），`Total` 不加 omitempty，外层照旧。
3. 用 `*T`，nil 才省略。但这样每个调用点都要取地址，很快你会写 `&total` 写到烦。

`json.Marshal` 对 `omitempty` 的判定有个更奇怪的边界：**struct 永远不算空**，哪怕所有字段都是零值也照样输出 `{}`。所以「data 里嵌了一个全零的结构体」不会被省略，只有标量零值会被省略——同一个 tag，两种行为。

#### 状态码与 code 的搭配约定
| 场景 | HTTP | code | 说明 |
| :--- | :--- | :--- | :--- |
| 查询成功 | 200 | `OK` | |
| 创建成功 | 201 | `OK` | 201 是传输层语义，body 结构不变 |
| 参数格式错 | 400 | `INVALID_ARGUMENT` | 带 `field` 指出哪个字段 |
| 未登录 / token 过期 | 401 | `UNAUTHENTICATED` / `TOKEN_EXPIRED` | 两者前端处理不同：一个跳登录，一个先刷新 |
| 越权访问别人的数据 | 403 | `FORBIDDEN` | 不要用 404 掩盖，账本场景要能审计 |
| 资源不存在 | 404 | `NOT_FOUND` | |
| 冲突（邮箱已注册） | 409 | `EMAIL_TAKEN` | |
| 服务端 bug | 500 | `INTERNAL` | message 固定文案，细节只进日志 |

这张表先定下来，后面每个 handler 都往里填。**新加一个 code 要改这张表**——它是契约的一部分，散落在代码里的字符串最后一定会拼错（`INVALID_ARGUMENT` 和 `INVALID_ARGUMENTS` 同时存在）。把 code 定义成常量，编译期就能挡住拼写错误：

```go
const (
    CodeOK       = "OK"
    CodeInvalid  = "INVALID_ARGUMENT"
    CodeNotFound = "NOT_FOUND"
    CodeInternal = "INTERNAL"
)
```

#### `writeJSON` 里三个不能省的顺序
```go
w.Header().Set("Content-Type", "application/json; charset=utf-8")  // ① 必须在 WriteHeader 之前
w.WriteHeader(status)                                              // ② 只能调用一次
_, _ = w.Write(buf)                                                // ③ 错误只能忽略
```
① 反了就是 `Content-Type` 丢失，浏览器按 `text/plain` 处理，前端 `res.json()` 直接抛错；② 调两次会打印 `http: superfluous response.WriteHeader call`，第二次的状态码被丢弃且**不会报错给客户端**；③ 客户端断开时 `Write` 会返回 error，但那时响应已经开始发了，除了记日志没有别的补救。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `http: superfluous response.WriteHeader call from ...` | 在 `writeJSON` 之前已经 `WriteHeader` 或 `http.Error` 过一次 | 保证每条分支只写一次头；`http.Error` 也算写头 |
| 前端 `res.json is not a function` / `Unexpected token <` | `Content-Type` 没设，或 500 时返回了 `http.Error` 的纯文本 | 统一走 `writeJSON`，别混用 `http.Error` |
| `{"code":"OK","message":"success"}` 少 `data` | `omitempty` 吃掉了零值 | 去掉 `omitempty`，或改用专用 DTO |
| 中文变成 `\u9910\u996e` | `json.Marshal` 默认转义 HTML 与部分字符 | 可读性要求高时用 `Encoder.SetEscapeHTML(false)`；语义上无影响 |

#### 5 分钟最小验证：三次请求，顶层字段必须一样
```bash
curl -s localhost:8080/ledger | jq -c 'keys'          # ["code","data","message"]
curl -s localhost:8080/ledger/999 | jq -c 'keys'      # ["code","message"]
curl -s localhost:8080/summary | jq -c '.data'        # 0 元时也要有 data
```
前两条用 `jq keys` 对比，失败响应少一个 `data` 是可以接受的（只要前端判空），但第三条暴露的正是上面那个 `omitempty` 坑——**总支出为 0 时必须能拿到 `0`，而不是 `undefined`**。

#### 分页响应的形状
```go
type Page[T any] struct {
    Items  []T   `json:"items"`
    Total  int64 `json:"total"`
    Limit  int   `json:"limit"`
    Offset int   `json:"offset"`
}
```
`Items` 为空时要保证是 `[]` 而不是 `null`——初始化成 `make([]T, 0)`，否则前端 `data.items.map` 直接崩。

#### 判据
```bash
curl -s localhost:8080/ledger | jq .
# { "code": "OK", "message": "success", "data": { "items": [], "total": 0, ... } }
curl -s localhost:8080/ledger/999 | jq .
# { "code": "NOT_FOUND", "message": "entry not found" }
```
两种情况顶层字段一致，只有 `code` 和 HTTP 状态不同。

::q 既然有 HTTP 状态码，为什么还需要业务 `code`？
::a HTTP 状态码只有几十个，无法表达具体业务原因。比如 400 可能是「金额为负」「日期格式错」「分类不存在」，客户端需要区分并高亮不同字段。`code` 提供稳定的机器可读标识，状态码只用来表达大类（成功/客户端错/服务端错）。
::q 为什么 `Items` 要初始化成空切片而不是 nil？
::a nil 切片经 `json.Marshal` 会变成 `null`，前端 `items.map(...)` 或 `items.length` 直接抛错。空切片序列化成 `[]`，客户端可以无条件当作数组处理。这类「前端因为 null 崩」的问题排查成本很高，在服务端一行就能避免。
::q 泛型 `Response[T]` 相比 `map[string]any` 拼响应，实际收益是什么？
::a 编译期就能保证 `Data` 的类型正确，handler 写错字段会编译失败；`map[string]any` 只能靠运行时和测试发现，而且没有 IDE 补全。此外泛型不产生额外的接口装箱开销，JSON 输出结构也更稳定。

<!--day 5 | light-->
#### 今天的产出：一张能 curl 的骨架
```go
func newRouter(svc *ledger.Service) http.Handler {
    mux := http.NewServeMux()
    mux.HandleFunc("POST /ledger", createEntry(svc))
    mux.HandleFunc("GET /ledger", listEntries(svc))
    mux.HandleFunc("GET /ledger/{id}", getEntry(svc))
    mux.HandleFunc("GET /summary", summary(svc))
    return mux
}

// handler 用闭包注入依赖，返回 http.HandlerFunc
func createEntry(svc *ledger.Service) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) { ... }
}
```
**闭包注入是 Go 里最轻的依赖注入**：不用全局变量，不用框架，测试时传入假的 svc 就行。

#### 目录
```
cmd/api/main.go         装配
internal/httpapi/       handler（本阶段新建）
internal/ledger/        Service + 接口
internal/store/         SQLite 实现
```
handler 单独一个包，因为它属于「传输层」，和领域逻辑分开——这样后面加 gRPC 或 CLI，领域层不用动。

#### 先定契约，再写实现
骨架日的正确顺序是：**先把路由表和响应形状定下来，再逐个填实现**。原因是形状一旦定错，后面每个 handler 都要跟着改。

```go
// 先把四个响应类型写出来，handler 里先 return 空数据
type CreateResp struct{ ID int64 `json:"id"` }
type ListResp struct {
    Items  []ledger.Entry `json:"items"`
    Total  int64          `json:"total"`
    Limit  int            `json:"limit"`
    Offset int            `json:"offset"`
}
```
**`Items` 声明为切片而不是 `any`**，这样「返回 null 还是 []」的问题在类型层面就暴露了。

#### handler 只做三件事
```go
func createEntry(svc *ledger.Service) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var in ledger.CreateInput
        if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&in); err != nil {
            Fail(w, http.StatusBadRequest, "INVALID_JSON", "请求体不是合法 JSON")
            return
        }
        id, err := svc.Create(r.Context(), in)
        if err != nil { writeError(w, r, err); return }   // 错误交给统一处理
        OKStatus(w, http.StatusCreated, CreateResp{ID: id})
    }
}
```
三件事：**解码 → 调 Service → 写响应**。校验、事务、SQL 都不在这里。目测一下这个函数：11 行，没有一个 `if` 是在判断业务规则——这就是分层的体感。

#### 为什么 svc 用具体类型而不是接口
`newRouter(svc *ledger.Service)` 里传的是具体类型，这是有意的：**接口应该定义在使用方，而 router 并不需要「换掉 Service」**——它需要的就是完整的业务能力。给 Service 抽接口只会得到一个和实现一模一样的大接口，没有任何解耦价值。要替换的是 `Store`，不是 `Service`。

#### 判据
四个路由都能返回统一信封（哪怕数据是假的）。这一步不追求功能，追求「形状对了」。

再加一条更实用的判据：**把四个路由的响应示例写进 `docs/api.md`，然后照着文档写 curl**。如果 curl 的返回和文档对不上，说明形状没定住——现在就改，别等到前端开始对接。骨架日省下的十分钟，会在联调那天变成两小时。

::q 为什么 handler 用「返回闭包的函数」而不是全局变量持有 svc？
::a 全局变量让依赖隐式、测试时无法替换、并发初始化有风险。闭包把依赖固定在函数创建时，测试可以传 mock，生产传真实实现，且没有全局状态。这是 Go 标准库和大多数项目的主流做法。
::q 为什么把 handler 放在 `internal/httpapi` 而不是跟 Service 放一个包？
::a 传输层和领域层的变更原因不同：改 API 形状（加字段、改状态码）不应该触碰业务规则，改业务规则也不应该影响路由。分包后依赖方向明确（httpapi → ledger），也让 handler 的测试不需要加载业务实现。
::q 骨架日为什么要求「路由和响应形状先跑通、数据可以是假的」？如果反过来先写业务逻辑，会付出什么代价？
::a 因为响应形状是前端、测试、后续所有 handler 共同依赖的契约。先定形状，后面每个 handler 只是往里填数据，改一处不影响别人；反过来先写业务，等发现 `items` 该是分页对象而不是数组时，四个 handler、前端解析、验收脚本要同时改。**骨架日的产出不是功能，是「形状正确 + 能 curl 通」**，这是后面三天不再返工的前提。

<!--day 6 | normal-->
#### 写入路径的四步，缺一步都出事
```go
func (s *Service) Create(ctx context.Context, in CreateInput) (int64, error) {
    if in.Amount <= 0 {
        return 0, &ValidationError{Field: "amount", Msg: "必须为正数（单位分）"}
    }
    if in.Category == "" {
        return 0, &ValidationError{Field: "category", Msg: "不能为空"}
    }
    if _, err := time.Parse("2006-01-02", in.Date); err != nil {
        return 0, &ValidationError{Field: "date", Msg: "格式应为 YYYY-MM-DD"}
    }
    return s.store.Insert(ctx, ledger.Entry{...})
}
```
四步：**解析 → 校验 → 转换 → 持久化**。校验必须在持久化之前，且错误要能定位到字段。

#### 校验放在 handler 还是 Service
- **格式校验**（JSON 能不能解析、字段类型对不对）→ handler。
- **业务校验**（金额必须为正、日期不能是未来太远、分类必须存在）→ Service。

放错地方的代价：校验写在 handler 里，CLI 或后台任务调用 Service 时就绕过了规则。**业务规则只有一份，且在 Service 层。**

#### 201 与 Location 头
```go
w.Header().Set("Location", fmt.Sprintf("/ledger/%d", id))
OKStatus(w, http.StatusCreated, map[string]int64{"id": id})
```
创建成功返回 201 是约定，`Location` 让客户端知道新资源在哪。不是强制的，但成本极低。

#### 金额从进入 handler 那一刻起就是 int64
```go
type CreateInput struct {
    Amount   int64  `json:"amount"`   // 分
    Category string `json:"category"`
    Date     string `json:"date"`
    Note     string `json:"note"`
}
```
不要这样写：
```go
Amount float64 `json:"amount"`     // ❌ 前端传 35.5，乘 100 得 3549.999...
```
`35.5 * 100` 在 float64 下是 `3549.9999999999995`，`int64()` 截断后变 `3549`，**少一分**。这类 bug 在测试里很难复现（大部分金额刚好精确），但用户对账时一定会发现。接口契约里就规定「分」，前端负责乘 100 并取整。

#### 并发写入：现在就该想清楚
「先查有没有重复，再插入」在两个并发请求下都会通过检查。真正可靠的只有数据库唯一约束。即使今天还没加约束，写代码时也要形成习惯：**能交给数据库的判断，不要交给应用层的 if。**

#### 幂等：重复提交怎么办
用户手抖点两次「保存」，会写两条一模一样的账。三种处理：
1. 前端禁用按钮（治标，刷新页面就失效）。
2. 请求带 `Idempotency-Key`，服务端记录已处理的 key（重）。
3. 接受重复，提供删除（家庭账本最实际）。

**知道有这个问题、并做出明确选择**，比假装它不存在好。今天先在注释里写清楚选了哪条。

#### 判据
```bash
curl -i -X POST localhost:8080/ledger -d '{"amount":0,"category":"餐饮","date":"2026-10-19"}'
# 400 + code=INVALID_ARGUMENT + message 指出 amount

curl -i -X POST localhost:8080/ledger -d '{"amount":3550,"category":"餐饮","date":"2026/10/19"}'
# 400，date 格式错误
```

::q 业务校验为什么不该写在 handler 里？
::a 因为 handler 只是众多入口之一（还有 CLI、定时任务、消息消费）。规则写在 handler，其他入口就会绕过它，导致数据不一致。规则集中在 Service，所有入口共享同一份约束。
::q 创建成功为什么要返回 201 而不是 200？
::a 201 明确表示「新资源已创建」，并配合 `Location` 头给出资源地址，客户端可以据此跳转或缓存。200 只表示请求成功，语义上不含「新建」。REST 客户端的重试逻辑也可能据此区分。
::q 日期校验用 `time.Parse("2006-01-02", s)` 而不是正则，好处是什么？
::a `time.Parse` 会真正校验日期合法性（`2026-02-30` 会失败），正则只能校验形状（两位月两位日），无法发现 2 月 30 日这种不存在日期。而且解析成功还能直接拿到 `time.Time` 用于后续计算。

<!--day 7 | core-->
#### 分页的两个参数、三个坑
```go
limit := parseIntDefault(r.URL.Query().Get("limit"), 20)
offset := parseIntDefault(r.URL.Query().Get("offset"), 0)

if limit <= 0 || limit > 100 {
    limit = 20                     // 上限防「一次拉全表」
}
if offset < 0 {
    offset = 0
}
```
三个坑：
1. **不设上限**：`?limit=1000000` 直接把内存打爆，是常见的低强度攻击面。
2. **不校验负数**：`offset=-1` 会让 SQL 报错或行为诡异。
3. **字符串直接拼进 SQL**：`limit` 是从 URL 来的，必须转成 int 再用占位符。虽然它是数字，但「URL 参数一律当不可信输入」这条规则不该有例外。

#### 一次查询两件事：数据 + 总数
```go
rows, err := db.QueryContext(ctx,
    `SELECT id, amount, category, date, note FROM entries
     WHERE date LIKE ? ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`,
    month+"%", limit, offset)
...
var total int64
db.QueryRowContext(ctx, `SELECT COUNT(*) FROM entries WHERE date LIKE ?`, month+"%").
    Scan(&total)
```
**`ORDER BY` 必须带唯一列兜底**（这里是 `id DESC`）。只按 `date` 排序时，同一天的多条记录顺序不确定，翻页会出现「第 1 页和第 2 页有重复/漏记录」。

两条语句之间有一个容易被忽略的时间差：`COUNT` 和 `SELECT` 不是同一快照。如果这两条之间有人插入了一条记录，`total` 会比实际多 1，前端算出的总页数就多一页，最后一页是空的。家庭账本几乎不会遇到，但**知道它存在**能让你在排查「最后一页空」时不用怀疑人生。真要一致，就包进同一个只读事务。

也能一条语句搞定，SQLite 3.25+ 支持窗口函数：

```go
// 一次扫描同时拿到本页数据和总数；数据量大时比 COUNT 全表更快（只扫一次索引）
`SELECT id, amount, category, date, note, COUNT(*) OVER() AS total
   FROM entries WHERE date LIKE ? ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`
```
代价是当 offset 超出范围时结果集为空，**连 `total` 也拿不到**（没有行了）。所以要么保留两条语句，要么在空结果时补一条 `COUNT`。新手建议先用两条语句，逻辑更直白。

#### 为什么这里不优化「深度分页」
`LIMIT ? OFFSET 100000` 会让 SQLite 扫描并丢弃前 10 万行。教科书解法是键集分页（`WHERE (date, id) < (?, ?)`）。但家庭账本一天记 3 条，十年一万条，`offset` 最大也就几千——**优化的收益是几毫秒，成本是接口签名从 `offset` 变成 `cursor`，前端要重写翻页逻辑**。

这里要建立的判断力是：**知道问题在哪、知道代价，然后有理由地不做**。判断标准写下来：单表行数 < 10 万且 offset < 1 万时，offset 分页完全够用；超过就上键集分页。这条写进代码注释，比「以后再说」有用。

#### `total` 的语义要定清楚
- `total` = 满足筛选条件的**总条数**（与 limit/offset 无关）。
- 不是「本页条数」，也不是「剩余条数」。

定不清楚的后果：前端算总页数 `ceil(total/limit)` 会错，分页器显示「第 1 页 / 共 1 页」但实际有 5 页。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `?limit=-1` 返回**全部数据** | SQLite 里 `LIMIT -1` 表示不限制 | 负数必须在 Go 侧归零，不能靠数据库兜底 |
| `no such column: entries.amount` | 建表时列名不同（如 `value`），或 `SELECT` 里的列与 `Scan` 顺序不一致 | 先 `sqlite3 ledger.db '.schema entries'` 对齐 |
| 翻页出现重复记录 | `ORDER BY` 只按 `date`，同日多条顺序不稳定 | 追加唯一列 `id DESC` |
| `offset` 很大时最后一页重复上一页的数据 | 排序不稳定 + 两次查询之间数据变动 | 同上，加唯一列；必要时固定 `ORDER BY` 的所有列 |

#### 5 分钟最小验证：两页拼起来必须等于全量
```bash
# 造 5 条同一天的数据，故意让 date 相同，逼出排序不稳定的问题
for i in 1 2 3 4 5; do curl -s -X POST localhost:8080/ledger \
  -d "{\"amount\":$((i*100)),\"category\":\"测试\",\"date\":\"2026-10-19\"}" > /dev/null; done

curl -s 'localhost:8080/ledger?limit=2&offset=0' | jq -r '.data.items[].id' > /tmp/p1
curl -s 'localhost:8080/ledger?limit=2&offset=2' | jq -r '.data.items[].id' > /tmp/p2
curl -s 'localhost:8080/ledger?limit=2&offset=4' | jq -r '.data.items[].id' > /tmp/p3
cat /tmp/p1 /tmp/p2 /tmp/p3 | sort | uniq -d    # 期望：无输出（没有重复）
cat /tmp/p1 /tmp/p2 /tmp/p3 | wc -l            # 期望：等于 total
```
`sort | uniq -d` 是检查「跨页重复」最快的手段，比人眼对比强得多。如果这里出现 ID，别怀疑 `LIMIT`，去改 `ORDER BY`。

#### 判据
```bash
curl -s 'localhost:8080/ledger?limit=2&offset=0' | jq '.data | {total, n: (.items|length)}'
# total=5, n=2
curl -s 'localhost:8080/ledger?limit=2&offset=4' | jq '.data | {total, n: (.items|length)}'
# total=5, n=1
```
两次的 `total` 必须相同，`n` 随 offset 变化。

::q `ORDER BY date DESC` 单独用，翻页时为什么可能重复或漏数据？
::a 同一天可能有多条记录，它们的相对顺序由数据库实现决定且不保证稳定。不同次查询（尤其加了 LIMIT/OFFSET）可能给出不同顺序，导致某条记录在两页都出现、另一条被跳过。加上唯一列（如 `id DESC`）后排序全序确定，翻页才稳定。
::q `total` 应该表示什么？如果前端要用它算总页数，必须是哪种语义？
::a 应该是「满足筛选条件的总记录数」，与当前 limit/offset 无关。前端算总页数用 `ceil(total/limit)` 才成立。如果返回的是「剩余条数」，分页器会算错。
::q 为什么 `limit` 也要做上限校验，即使它已经转成了 int？
::a 因为攻击者或误用可以传 `limit=1000000`，服务端会尝试一次拉出全表并序列化成 JSON，内存和带宽都可能被打爆，属于低成本的拒绝服务。上限（如 100）是必要的保护，同时也能让响应时间可预测。

<!--day 8 | core-->
#### 边界值的清单，逐条过
| 输入 | 期望行为 |
| :--- | :--- |
| `limit=0` | 用默认值 20，不返回空列表 |
| `limit=-5` | 用默认值 20 |
| `limit=101` | 截到 100 或返回 400，二选一但要一致 |
| `offset=0` | 第一页 |
| `offset` 超过 total | 返回空 `items`，`total` 照常 |
| `offset=-1` | 归零或 400 |
| `month=2026-13` | 400，不是空列表 |
| `month=` 空 | 用当前月 |

「**返回空列表**」和「返回错误」的选择要有理由：`offset` 超出范围是合法请求（客户端可以乐观翻页），返回空列表更友好；`month=2026-13` 是非法输入，必须 400，否则前端以为「这个月没记账」。

#### 空列表 vs 越界，语义不同
```go
if len(items) == 0 && offset > 0 && int64(offset) >= total {
    // 不是错误，就是翻过头了；返回空 items
}
```
日志里要能区分「这个月真的没数据」和「翻页翻过头」——否则监控上看不出来是用户行为异常还是数据缺失。

#### 时间范围校验
```go
func validMonth(s string) bool {
    _, err := time.Parse("2006-01", s)
    return err == nil
}
```
`time.Parse("2006-01", "2026-13")` 会失败，这是最省事的校验方式。空字符串单独处理成默认当前月。

#### 把规则写成一个纯函数，才有得测
边界表放在脑子里没法验证。把「参数归一化」抽成一个不碰数据库的纯函数，今天剩下的时间就用来给它写表驱动测试：

```go
// normalizePaging 是所有分页参数唯一的入口，handler 不自己判边界
func normalizePaging(limit, offset int) (int, int) {
    if limit < 0 {
        limit = 0
    }
    if limit == 0 {
        limit = defaultLimit      // 20
    }
    if limit > maxLimit {
        limit = maxLimit          // 100
    }
    if offset < 0 {
        offset = 0
    }
    return limit, offset
}
```

注意 `limit=101` 的处理是**截到 100，不是回到 20**。区别看着小，语义差很远：用户传 101 是「我要尽可能多」，回到 20 会让他以为上限就是 20；截到 100 是「给你能给的最多」，符合意图。同理 `limit=0` 回到 20 而不是返回空——0 在多数客户端里等于「没传」。

```go
package ledger

import "testing"

func TestNormalizePaging(t *testing.T) {
    cases := []struct {
        name                  string
        inLimit, inOffset     int
        wantLimit, wantOffset int
    }{
        {"没传参数", 0, 0, 20, 0},
        {"负数回落", -5, -1, 20, 0},
        {"超上限截断到 100", 101, 0, 100, 0},
        {"正常值原样放行", 50, 40, 50, 40},
        {"恰好等于上限", 100, 0, 100, 0},
    }
    for _, c := range cases {
        t.Run(c.name, func(t *testing.T) {
            gotL, gotO := normalizePaging(c.inLimit, c.inOffset)
            if gotL != c.wantLimit || gotO != c.wantOffset {
                t.Fatalf("normalizePaging(%d,%d) = (%d,%d), want (%d,%d)",
                    c.inLimit, c.inOffset, gotL, gotO, c.wantLimit, c.wantOffset)
            }
        })
    }
}
```
`t.Run` 让每条用例成为独立子测试，失败时报错会带用例名（`--- FAIL: TestNormalizePaging/超上限截断到_100`），一眼看出哪条规则破了。**这就是表驱动测试的全部价值：用例和断言混在一起时，你只能看到「挂了」，看不到「哪条规则挂了」。**

#### `has_more` 怎么算
```go
hasMore := int64(offset+len(items)) < total
```
不能用 `total > limit`：`total=100, limit=20, offset=80` 时最后一条应该 `has_more=false`，而 `100>20` 永远为 true，前端会一直请求下一页。判据是「已经取回的位置有没有到末尾」，即 `offset + 本页条数 < total`。

也不要让前端自己算 `offset+len(items) < total`——服务端已经知道这两个值，客户端各自实现一遍，迟早有一处写反。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `no test files` | 测试文件名不是 `_test.go`，或不在同一个包目录 | 命名改成 `paging_test.go`，与被测文件同目录 |
| `--- FAIL: TestNormalizePaging/超上限截断到_100` | 实现和表格约定不一致（比如 101 回到了 20） | 以表格为准改实现，别改测试 |
| `undefined: normalizePaging` | 测试文件用了 `package ledger_test` 但函数未导出 | 要么同包（`package ledger`），要么导出函数 |
| 测试通过但线上仍返回全表 | handler 里没调用 `normalizePaging`，自己又判了一遍 | 边界只允许有一个入口，搜一遍 `limit` 出现的位置 |

#### 判据
写一个 `paging_test.go`，表驱动跑上面 8 行，全部通过才算今天完成。**分页 bug 是那种「上线三个月后才被用户发现」的类型**，必须靠测试挡住。

```bash
go test ./internal/ledger -run TestNormalizePaging -v
# 期望 5 个 PASS，0 个 FAIL
go test ./... -count=1     # 全仓测试，确认没影响别的
```
`-count=1` 关掉测试缓存，避免「改了代码但结果没变」的错觉——Go 默认会缓存通过的测试结果，新手经常被这个骗一次。

::q `offset` 超过总数时，返回空列表和返回 404 哪个更合适？
::a 返回空列表。因为请求本身合法（参数都在允许范围内），只是没有数据，客户端可以据此判断「到底了」。返回 404 会让客户端误以为「分页接口不存在」，也不符合「集合资源」的语义。
::q `limit=0` 为什么不该直接返回空列表？
::a 因为多数客户端把「不传 limit」等同于 `limit=0`（零值），若按 0 处理会导致「忘了传参数就拿到空数据」这种极难排查的问题。约定是 0 或负数一律回落到默认值。
::q 为什么 `month=2026-13` 必须报 400 而不是返回空？
::a 因为 13 月不存在，是非法输入。返回空会让用户以为「这个月没有记账」，掩盖了前端拼参数的错误。非法输入与合法但无数据必须区分，这是 API 可用性的一部分。

<!--day 9 | normal-->
#### 换存储层，handler 一行不改
这是分层第一次兑现价值。Service 依赖 `Store` 接口，把内存实现换成 SQLite 实现，只需要改 `main` 里的一行装配：

```go
// 之前
svc := ledger.NewService(memstore.New())
// 之后
svc := ledger.NewService(store.New(db))
```
如果这一步需要改 handler，说明依赖方向错了。

#### 内存实现也要认真写
```go
type Mem struct {
    mu      sync.Mutex
    entries []ledger.Entry
    nextID  int64
}

func (m *Mem) Insert(ctx context.Context, e ledger.Entry) (int64, error) {
    if err := ctx.Err(); err != nil { return 0, err }   // 尊重取消
    m.mu.Lock()
    defer m.mu.Unlock()
    m.nextID++
    e.ID = m.nextID
    m.entries = append(m.entries, e)
    return e.ID, nil
}
```
内存实现不是「临时代码」，它是**测试替身**。要保证语义和 SQLite 一致（ID 自增、返回顺序、空列表非 nil），否则测试通过但生产失败。

#### 这是对「接口抽象」的第一次真实检验
换实现时你要盯住三件事：
1. **handler 有没有改**——一行都不该改。
2. **Service 有没有改**——不该改。
3. **`main` 改了几行**——应该只有装配那一行。

如果 Service 里出现了 `if isSQLite { ... }` 之类的分支，说明抽象漏了：内存实现和 SQLite 实现的语义没有对齐（比如排序规则、空列表、ID 自增行为），只能在上层打补丁。

#### SQLite 实现里必须注意的四点
```go
func (s *SQLite) ListByMonth(ctx context.Context, month string) ([]ledger.Entry, error) {
    rows, err := s.db.QueryContext(ctx, `
        SELECT id, amount, category, date, note FROM entries
        WHERE date LIKE ? ORDER BY date DESC, id DESC`, month+"%")
    if err != nil { return nil, fmt.Errorf("list: %w", err) }
    defer rows.Close()

    out := make([]ledger.Entry, 0, 16)      // ① 初始化空切片，不返回 nil
    for rows.Next() {
        var e ledger.Entry
        if err := rows.Scan(&e.ID, &e.Amount, &e.Category, &e.Date, &e.Note); err != nil {
            return nil, fmt.Errorf("scan: %w", err)
        }
        out = append(out, e)
    }
    return out, rows.Err()                   // ② 检查遍历错误
}
```
③ **`ORDER BY` 加唯一列兜底**，否则同一天多条记录顺序不稳（D8 会讲）。
④ **`Scan` 顺序必须与 `SELECT` 列顺序严格一致**，错一位不会报错，只会把分类塞进金额。

#### 建表语句放哪
今天可以用「启动时 `CREATE TABLE IF NOT EXISTS`」，但要在代码里留一行注释：**阶段五会换成 `goose` 迁移**。带着「这是临时方案」的自觉写代码，才不会把它固化成架构。

#### 判据
```bash
go run . add -amount 3550 ...   # 用 HTTP 也行
curl -s localhost:8080/ledger | jq '.data.items | length'
```
换成 SQLite 后，重启进程数据还在；换成内存实现后重启就没了——这个对比就是「持久化」的定义。

::q 为什么内存实现里也要检查 `ctx.Err()`？
::a 因为测试替身要模拟真实实现的行为。真实实现会因 ctx 取消而返回错误，如果内存实现忽略 ctx，测试就测不出「handler 是否正确传播了取消」，掩盖真实环境的问题。
::q 换存储实现时如果必须改 handler，说明什么？
::a 说明 handler 直接依赖了具体实现（比如直接用了 `*store.SQLite` 的方法或它的类型），或者业务逻辑泄漏到了 handler 里。依赖方向应该始终是 handler → Service → 接口，实现只在 main 里出现。
::q 换存储实现时，内存版要模拟 SQLite 的哪些行为？漏掉哪一条会导致「测试全绿、生产失败」？
::a 至少四条：① 空结果返回 `make([]T,0)` 而不是 nil（否则 JSON 里是 `null`）；② ID 自增从 1 开始、删除后不复用；③ 排序稳定（`date DESC, id DESC`）；④ 查不到时返回 `ErrNotFound` 而不是零值 + nil。最容易漏的是第 ①条：内存版返回 nil，测试里 `len(items)==0` 通过，但前端拿到 `null` 直接崩。**测试替身要模拟「可观察行为」，不是模拟数据结构。**

<!--day 10 | light-->
#### 持久化验证：三步走
```bash
# 1. 写入
curl -X POST localhost:8080/ledger -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}'
# 2. 杀掉进程（Ctrl+C 或 kill）
# 3. 重启后再查
curl -s localhost:8080/ledger | jq '.data.total'   # 应为 1
```
这一步必须亲手做一次。**很多「数据丢了」的问题，其实是 DSN 写成了 `:memory:`，或者工作目录变了导致打开了另一个 db 文件。**

#### 直接查库的三种方式
```bash
sqlite3 ledger.db 'select count(*) from entries'          # 最简单
sqlite3 ledger.db '.schema entries'                       # 看建表语句
sqlite3 -header -column ledger.db 'select * from entries limit 5'
```
`-header -column` 让输出带列名并自动对齐，比默认的 `|` 分隔好读得多。排查「到底写进去了没有」，永远先绕开服务直接查库。

#### `-wal` 和 `-shm` 是什么
启用 WAL 后目录里会多出两个文件：
- `ledger.db-wal` 是预写日志，**最新写入可能还在这里，尚未合并进主库文件**。
- `ledger.db-shm` 是共享内存索引，进程异常退出后可能残留。

后果：**只备份 `ledger.db` 可能丢掉最近的写入。** 正确做法：
```bash
sqlite3 ledger.db ".backup 'backup.db'"    # 在线一致备份
```
或者停服务后三个文件一起拷。直接 `cp ledger.db` 在写入进行中可能拿到不一致的快照。

#### 数据文件的权限
`ls -l ledger.db` 看属主。服务以非 root 用户运行时，如果文件属主是 root，写入会失败并报 `attempt to write a readonly database`——错误信息指向「只读」，实际是权限问题。生产环境应固定绝对路径并明确属主。

#### 排查清单
1. DSN 是 `file:ledger.db` 还是 `:memory:`？
2. 启动时的工作目录在哪？相对路径会跟着变。
3. `ls -l ledger.db` 的修改时间是否是刚才？
4. `sqlite3 ledger.db 'select count(*) from entries'` 直接查库，绕过服务。

第 4 条是分界线：**库里有没有数据**决定了问题在写入端还是读取端。

::q 重启后数据消失，最先应该检查什么？
::a 先绕过服务直接查库：`sqlite3 ledger.db 'select count(*) from entries'`。如果库里有数据，问题在读取端（DSN 不一致、查询条件错）；如果库里没有，问题在写入端（用了内存库、写入失败但错误被吞、事务回滚）。
::q 相对路径 `ledger.db` 有什么隐患？
::a 它相对于进程的当前工作目录。用不同方式启动（`./api` 与 `cd /var/lib && /opt/api`）会打开不同的文件，表现为「数据莫名消失」。生产环境应该用绝对路径或明确配置的数据目录。
::q 写完一条数据后立刻执行 `ls -l ledger.db`，主库文件大小没变、修改时间也没更新，这说明数据丢了吗？跑什么命令能确认？
::a 不说明丢了。开了 WAL（`PRAGMA journal_mode=WAL`）后，新写入先落在 `ledger.db-wal`，要等 checkpoint 才合并进主库。这时 `ls -l ledger.db-wal` 会看到它有大小、时间刚更新。确认方式是绕过服务直接查：`sqlite3 ledger.db 'select count(*) from entries'`——它会自动读 WAL，能看到最新数据；或者 `sqlite3 ledger.db 'PRAGMA journal_mode;'` 确认是不是 `wal`。

<!--day 11 | normal-->
#### 404 的三种来源，必须区分
```go
func (s *Service) Get(ctx context.Context, id int64) (ledger.Entry, error) {
    e, err := s.store.Get(ctx, id)
    if errors.Is(err, sql.ErrNoRows) {
        return ledger.Entry{}, ErrNotFound       // 业务语义
    }
    if err != nil {
        return ledger.Entry{}, fmt.Errorf("get entry: %w", err)
    }
    return e, nil
}
```
- **参数非法**（`/ledger/abc`）→ 400。
- **资源不存在**（`ErrNotFound`）→ 404。
- **数据库故障** → 500。

三种都返回 404 是常见错误：真出故障时前端和监控都以为是「用户访问了不存在的记录」，故障被掩盖。

#### handler 侧的分流
```go
if errors.Is(err, ledger.ErrNotFound) {
    Fail(w, http.StatusNotFound, "NOT_FOUND", "entry not found")
    return
}
Fail(w, http.StatusInternalServerError, "INTERNAL", "internal error")
```
`errors.Is` 能穿透 `fmt.Errorf("%w")` 的包装——这就是阶段一 D6 说的「`%w` 影响控制流」在这里的具体兑现。

#### 不要泄漏内部错误信息
生产环境不要把 `sql` 错误原文返回给客户端（可能含表名、字段名）。**给客户端 code + 通用 message，给日志完整错误 + request_id。**

#### `PathValue` 拿到的永远是字符串
```go
id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
if err != nil || id <= 0 {
    Fail(w, http.StatusBadRequest, "INVALID_ARGUMENT", "id 必须是正整数")
    return
}
```
`ParseInt` 的三个参数分别处理：进制（10）、位宽（64）、返回值类型。**`id <= 0` 也要挡**——`/ledger/0` 和 `/ledger/-1` 语法合法但业务上不存在，直接拒绝比查一次库更省事，也避免把 `-1` 传进 SQL。

#### 删除：幂等还是报错
```go
func (s *Service) Delete(ctx context.Context, userID, id int64) error {
    n, err := s.store.DeleteEntry(ctx, userID, id)
    if err != nil { return err }
    if n == 0 { return ErrNotFound }
    return nil
}
```
REST 语义上 `DELETE` 应该是**幂等**的：删两次都返回成功。但那样会掩盖「ID 拼错」的问题。家庭账本选「第二次返回 404」更实用——前端能提示「这条记录已经不存在了，可能已被删除」。

**关键是选定一种并在接口文档里写清楚**，不要让前端靠猜。

#### 软删除要不要现在做
`deleted_at` 字段 + GORM 的软删除，好处是「误删可恢复」，坏处是**每条查询都要带 `deleted_at IS NULL`**（GORM 自动加，但原生 SQL 要手写），一旦漏掉就会把已删数据查出来。

家庭账本建议先做硬删除（连 `DELETE FROM`），把「回收站」作为后续需求。**不要在还没搞清楚查询边界时引入软删除**，它会让你每一处 SQL 都要多一份心智负担。

#### 判据
```bash
curl -i localhost:8080/ledger/999999   # 404 + code=NOT_FOUND
curl -i localhost:8080/ledger/abc      # 400 + code=INVALID_ARGUMENT
# 把 db 路径改成不可写，重启后请求 → 500 + code=INTERNAL，日志有完整原因
```

::q 为什么数据库故障不能返回 404？
::a 404 表示「请求的资源不存在」，是客户端可理解的正常结果。数据库故障是服务端问题，返回 404 会让客户端放弃重试、让监控看不到错误率上升，故障被静默掩盖。必须 500 并记录日志。
::q `errors.Is(err, ledger.ErrNotFound)` 为什么能穿透多层包装？
::a 因为每层都用 `fmt.Errorf("...: %w", err)` 包装，保留了 `Unwrap()` 链。`errors.Is` 会沿链逐层比较。如果某层用了 `%v`，链断裂，这里就判断不到。
::q 为什么不把 `sql` 错误原文返回给客户端？
::a 会泄漏内部结构（表名、字段名、SQL 片段），给攻击者提供信息；对用户也毫无意义。正确做法是返回稳定的 `code` 和通用文案，完整错误写进日志并用 request_id 关联。

<!--day 12 | normal-->
#### 按月聚合的 SQL
```sql
SELECT category, SUM(amount) AS total
FROM entries
WHERE user_id = ? AND date LIKE ?
GROUP BY category
ORDER BY total DESC;
```
如果用 GORM（阶段五）：
```go
db.Model(&Entry{}).
    Select("category, SUM(amount) as total").
    Where("user_id = ? AND date LIKE ?", uid, month+"%").
    Group("category").
    Scan(&rows)
```
`Scan` 到自定义结构体，**不要 Scan 到 `Entry`**——它没有 `total` 字段，会静默丢掉聚合结果。

#### 响应结构
```go
type Summary struct {
    Month string          `json:"month"`
    Total int64           `json:"total"`
    ByCategory []CategorySum `json:"by_category"`
}
type CategorySum struct {
    Category string `json:"category"`
    Total    int64  `json:"total"`
    Percent  int    `json:"percent"`   // 预留，便于前端画图
}
```
`Total` 建议单独查一次 `COALESCE(SUM(amount),0)`，而不是把各分类相加——分类相加在有 `NULL` 分类或过滤条件不一致时会算错。

#### `LIKE '2026-10%'` 和范围查询的实际差别
```sql
-- A: 前缀匹配
WHERE date LIKE '2026-10%'
-- B: 半开区间
WHERE date >= '2026-10-01' AND date < '2026-11-01'
```
两者都能走索引，但 B 更稳：
- B 的边界是**显式日期**，改月份时不会因为字符串拼接出错（`'2026-1'` 会匹配到 `2026-10`、`2026-11`、`2026-12`）。
- B 在跨年时不会出错（`LIKE '2026-12%'` 的下一月是 `2027-01`，需要特殊处理）。
- B 可以处理「不足两位的月份」写法（如果数据里有 `2026-1-05`）。

**建议：接口层接收 `2026-10`，内部转成半开区间再查。** 这层转换放在 Service 里，SQL 里就不出现 `LIKE`。

#### 月份参数必须校验
```go
_, err := time.Parse("2006-01", month)
if err != nil {
    return Summary{}, &ValidationError{Field: "month", Msg: "格式应为 YYYY-MM"}
}
```
不校验的话，`month=2026-1` 会静默匹配到 10/11/12 月的数据，统计结果翻十倍而没有任何报错。

#### 空分类与 NULL
如果历史数据里 `category` 为空字符串，`GROUP BY` 会把它单独成一组，前端显示一个没有名字的分类。两种处理：
- 建表时 `NOT NULL DEFAULT '未分类'`。
- 查询时 `CASE WHEN category = '' THEN '未分类' ELSE category END`。

**选一种，别让空分类流到前端**——那是把数据质量问题转嫁给用户。

#### 判据
```bash
# 先用 sqlite3 CLI 手算一遍，作为「正确答案」
sqlite3 -header -column ledger.db \
  "SELECT category, SUM(amount) FROM entries WHERE date LIKE '2026-10-%' GROUP BY category;"

# 再和接口返回值逐项对照，数字必须一模一样
curl -s 'localhost:8080/summary?month=2026-10' | jq .data
# by_category 按金额降序，total 等于各项之和
```
`sqlite3` 是本项目唯一的手工核对工具：接口算错了，你得先知道「对」长什么样才有得比。`-header -column` 两个参数能让输出对齐、带列名，比默认的 `|` 分隔好读得多。
再插一条 0 元记录，确认它不影响总额但会出现在分类里（这个边界决定你的 SQL 是否需要 `HAVING SUM(amount) > 0`）。

::q 为什么 `Scan` 聚合结果时不要用 `Entry` 结构体？
::a `Entry` 没有 `total` 字段，GORM 会静默忽略这一列，你拿到的是空结构体或零值，且不报错。必须定义专用结构体（如 `CategorySum`）承载聚合列，字段名与 SQL 别名对应。
::q `total` 用「各分类相加」和「单独 SUM 一次」，哪个更可靠？
::a 单独 SUM 更可靠。分类相加依赖两个查询的条件完全一致，且分类中若有 NULL 或空字符串会被 GROUP BY 单独成组，容易漏算。单独一次 `SELECT COALESCE(SUM(amount),0)` 语义明确，也不受分组影响。
::q `WHERE date LIKE '2026-1%'`（月份少写一位）会返回什么？为什么半开区间写法不会出这个问题？
::a 会匹配 `2026-10`、`2026-11`、`2026-12` 三个月的全部数据——前缀匹配对「位数不足」毫无抵抗力，统计结果直接翻三倍且不报错。半开区间用显式边界 `>= '2026-10-01' AND < '2026-11-01'`，边界由 `time.Parse("2006-01", month)` 校验过的值算出，`2026-1` 会在解析阶段就被拒成 400。**前缀匹配依赖「格式永远规整」，而这正是外部输入最不可靠的地方。**

<!--day 13 | core-->
#### 中间件解决的是「每个 handler 都要写一遍」的问题
先看不用中间件时代码长什么样。四个 handler，每个都要记日志：

```go
func list(w http.ResponseWriter, r *http.Request) {
    start := time.Now()
    defer func() { log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start)) }()
    // ↑ 这四行在 create / get / update / delete 里一模一样
    ...
}
```
复制四遍只是开始。等阶段四要加认证、阶段六要加 CORS 和限流，每个 handler 前面会堆五六行「和业务毫无关系」的代码，而且**总有一个人会忘记加**——忘记加日志只是少一条记录，忘记加认证就是数据泄漏。

中间件把这段代码从「每个 handler 内部」搬到「handler 外面一层」，写一次，全站生效。这是它的全部价值，没有别的玄机。

#### 中间件的类型签名，只有一个正确答案
```go
type Middleware func(http.Handler) http.Handler
```
它接收「下一个 handler」，返回「包装后的 handler」。所以它可以做三件事：**请求前做事、请求后做事、决定要不要调下一个**。

```go
func WithLogging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)                      // 调用下游
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}
```
注意 `http.HandlerFunc(...)` 这层转换：普通函数 `func(w, r)` 需要转成实现了 `ServeHTTP` 的类型才能满足 `http.Handler`。忘了这层转换，编译报错是 `cannot use func literal (type func(http.ResponseWriter, *http.Request)) as type http.Handler`——看到这个就知道少了个 `http.HandlerFunc`。

#### 一个能跑的最小洋葱，先看顺序再谈别的
```go
package main

import (
    "log"
    "net/http"
)

func tagged(name string) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            log.Println("[" + name + "] before")
            next.ServeHTTP(w, r)
            log.Println("[" + name + "] after")
        })
    }
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /ping", func(w http.ResponseWriter, r *http.Request) {
        log.Println("handler")
        w.Write([]byte(`{"code":"OK"}`))
    })

    var h http.Handler = mux
    h = tagged("inner")(h)
    h = tagged("outer")(h)

    log.Fatal(http.ListenAndServe(":8080", h))
}
```
`curl localhost:8080/ping` 一次，日志必须是 `[outer] before → [inner] before → handler → [inner] after → [outer] after`。**这条顺序就是「洋葱」的全部含义**：进入时从外到内，返回时从内到外。中间件里 `next.ServeHTTP` 之前写的代码属于「进入」，之后写的属于「返回」。

#### 套的顺序 = 执行的顺序（洋葱）
```go
h := mux
h = WithAuth(h)        // 最内层
h = WithRateLimit(h)
h = WithLogging(h)     // 最外层
srv.Handler = h
```
请求进来先过 `WithLogging`，再到 `WithRateLimit`，最后 `WithAuth`。**返回时反序。** 记住「后套的在外层」。

后续阶段的固定顺序（阶段六 D13 会再强调）：
```
Recovery → CSRF → RateLimit → Auth → handler
```
`Recovery` 必须在最外层，才能捕获内层所有 panic。

顺序错了会怎样，`WithLogging` 和 `WithAuth` 这一对最能说明问题：

| 套法 | 未登录请求的日志 | 后果 |
| :--- | :--- | :--- |
| `WithLogging(WithAuth(mux))`（日志在外） | 有 `status=401` | 能看到「多少请求被拒」，正常 |
| `WithAuth(WithLogging(mux))`（日志在内） | **什么都没有** | 认证先返回，日志中间件根本没执行；401 全部隐形 |

所以「日志放最外层」不是风格偏好，是**不然你会丢掉最需要统计的那部分请求**。

#### 中间件不该做的事
- **不要在里面写业务逻辑**（查账本、算统计）。中间件只处理横切关注点：日志、认证、限流、CORS、恢复。
- **不要用中间件做参数校验**。它拿不到业务上下文，做出来的校验会和 handler 重复且不一致。
- **不要每个路由单独套一份**，容易漏。统一套在 mux 外层。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `cannot use ... as http.Handler` | 忘了 `http.HandlerFunc` 转换 | 包一层再返回 |
| 中间件里的日志一条都不打 | 套在了 `mux` 上，但 `srv.Handler` 赋值的是原来的 `mux` 变量 | 把包装后的 handler 赋给 `srv.Handler`，别复用旧变量 |
| `runtime error: invalid memory address` 在中间件里 | `next` 是 nil（套的顺序写错，或 `WithXxx(nil)`） | 装配时保证最后一个是 mux |
| 日志里所有请求 status 都是 200 | 只套了日志，没套状态码记录器 | 见今天的下一节（D14） |

#### 传递数据的正确方式
```go
type ctxKey struct{ name string }
var userIDKey = ctxKey{"userID"}

// 中间件里
ctx := context.WithValue(r.Context(), userIDKey, uid)
next.ServeHTTP(w, r.WithContext(ctx))     // 必须 WithContext，否则下游拿不到

// handler 里
uid, ok := r.Context().Value(userIDKey).(int64)
```
用自定义 key 类型避免撞键；取出来必须断言并判 `ok`。

#### 判据
套两个中间件，观察日志顺序：
```
[outer] before
[inner] before
handler
[inner] after
[outer] after
```
顺序不对说明套反了。

::q 中间件为什么必须是 `func(http.Handler) http.Handler` 这个签名？
::a 因为它需要「包装」任意下游 handler，且自身也要能被当作 handler 使用。这个签名让中间件可以任意嵌套组合，最终产物仍是 `http.Handler`，可以直接赋给 `srv.Handler`。任何别的签名都会失去组合能力。
::q 为什么 `Recovery` 必须放在最外层？
::a 因为它要捕获内层所有中间件和 handler 的 panic。放在内层的话，外层中间件（如日志、限流）在 panic 传播时已经中断，无法记录完整请求信息，进程也可能因此退出。
::q 中间件里用 `r.WithContext(ctx)` 而不是直接改 `r.Context()`，为什么？
::a `http.Request` 是不可变的（按值传递），`r.Context()` 返回的是内部字段的值，直接修改副本不会影响下游。`WithContext` 返回一个带新 ctx 的浅拷贝请求，把这份新请求传给 `next` 才能让下游读到值。

<!--day 14 | core-->
#### 日志中间件要拿到「真实状态码」，而 `ResponseWriter` 不告诉你
```go
type statusRecorder struct {
    http.ResponseWriter
    status int
    bytes  int
}

func (s *statusRecorder) WriteHeader(code int) {
    s.status = code
    s.ResponseWriter.WriteHeader(code)
}

func (s *statusRecorder) Write(b []byte) (int, error) {
    if s.status == 0 { s.status = http.StatusOK }   // 隐式 200
    n, err := s.ResponseWriter.Write(b)
    s.bytes += n
    return n, err
}
```
两个细节决定这段代码对不对：
1. **不重写 `Write`，状态码永远是 0**——handler 只调 `Write` 不调 `WriteHeader` 时，实际返回的是 200，但记录器不知道。
2. **`WriteHeader` 可能被调用多次**，后者无效。记录第一次即可（这里直接覆盖，但实际响应仍是第一次的，建议只在 `status == 0` 时记录）。

#### 日志该带哪些字段
```go
log.Printf("method=%s path=%s status=%d dur=%s bytes=%d req_id=%s",
    r.Method, r.URL.Path, rec.status, time.Since(start), rec.bytes, reqID)
```
结构化日志（阶段五 D16）会用 `slog` 输出成 JSON，字段固定才有法聚合。**`path` 不要记完整 URL（含 query 里的敏感参数），必要时只记 path。**

#### 为什么不能只记「请求进来了」
没有状态码和耗时，日志只能证明「有人访问过」，无法回答「哪个接口慢」「错误率多少」。这两个字段是所有可观测性的最小集合。

#### 包装的代价：`ResponseWriter` 上还挂着别的接口
`statusRecorder` 只嵌入了 `http.ResponseWriter`，于是包装后的对象**只剩三个方法**。原来底层那个 writer 可能还实现了：

- `http.Flusher`（`Flush()`）——SSE、流式导出靠它把缓冲区推给客户端；
- `http.Hijacker`（`Hijack()`）——WebSocket 升级、自定义 TCP 协议靠它接管连接；
- `io.ReaderFrom`（`ReadFrom()`）——`io.Copy` 时会走 `sendfile`，少了它就退化成用户态拷贝。

一旦被包装，在 handler 里写 `w.(http.Flusher)` 断言会**失败**，流式响应变成「全部攒完再发」。阶段五的 CSV 流式导出就会撞上这个坑，报错或表现为「进度不动」。

现在不用急着写 `Flush()` 转发，但要知道两件事：① 断言失败时用 `comma-ok` 而不是裸断言，否则直接 panic；② 需要逐字节兼容时，用 Go 1.20 的 `http.NewResponseController(w).Flush()`，它会沿着包装链找到真正支持 `Flush` 的那一层——比手写四个转发方法可靠。

#### 5 分钟最小验证：三种写法的状态码各是什么
```go
// 三个 handler，分别用三种方式写响应
mux.HandleFunc("GET /a", func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("a"))                       // 隐式 200
})
mux.HandleFunc("GET /b", func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusNotFound)         // 显式 404，无 body
})
mux.HandleFunc("GET /c", func(w http.ResponseWriter, r *http.Request) {
    http.Error(w, "boom", http.StatusInternalServerError)  // 500 + 文本
})
```
```bash
for p in a b c; do curl -s -o /dev/null -w "$p=%{http_code} " localhost:8080/$p; done; echo
# 期望：a=200 b=404 c=500
grep -c 'status=' /tmp/server.log     # 期望 3，每条请求恰好一行
```
如果 `/a` 记成 `status=0`，说明 `Write` 没被重写；如果出现两行同路径日志，说明中间件被套了两次（常见于既在 `NewRouter` 里套、又在 `main` 里套）。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 日志 `status=0` | handler 只调 `Write`，`statusRecorder.Write` 没补默认 200 | 在 `Write` 里判 `if s.status == 0 { s.status = 200 }` |
| `interface conversion: *statusRecorder is not http.Flusher` | 包装丢了 `Flush` 方法 | 用 `http.NewResponseController`，或显式转发 `Flush` |
| 同一请求两行日志 | 中间件套了两层 | 只在一个地方套（建议 `NewRouter` 内部） |
| 日志里 `dur=0s` | `start` 在 `next.ServeHTTP` 之后才取 | 把 `start := time.Now()` 放在调用之前 |

#### 判据
```bash
curl -s localhost:8080/ledger/999999 > /dev/null
# 日志里 status=404，不是 200
```
如果记成 200，说明 `statusRecorder` 没生效（可能 handler 里用了 `http.Error`，它内部调 `WriteHeader`，能被捕获；但如果中间件漏传包装器就不会）。

::q 为什么需要包装 `ResponseWriter` 才能拿到状态码？
::a `http.ResponseWriter` 接口没有读状态码的方法。要记录就必须在调用 `WriteHeader` 时截获。包装器实现同一接口，把调用转发给原始 writer 并顺便记录，是标准做法。
::q 只重写 `WriteHeader` 不重写 `Write`，会漏什么？
::a 会漏「隐式 200」。handler 直接 `w.Write(...)` 而不显式 `WriteHeader` 时，Go 自动发送 200，但你的记录器从未被通知，`status` 保持 0，日志里就会出现 status=0 或空值。
::q 日志路径里为什么不该记录完整 query string？
::a query 里可能含 token、手机号、搜索关键词等敏感信息，写入日志会造成泄漏和合规问题。需要排障时可以只记录白名单参数，或对值做脱敏。

<!--day 15 | core-->
#### 集中式错误处理：handler 只返回 error
```go
type HandlerFunc func(w http.ResponseWriter, r *http.Request) error

func Wrap(h HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if err := h(w, r); err != nil {
            writeError(w, r, err)
        }
    }
}

func writeError(w http.ResponseWriter, r *http.Request, err error) {
    var ve *ledger.ValidationError
    switch {
    case errors.As(err, &ve):
        Fail(w, http.StatusBadRequest, "INVALID_ARGUMENT", ve.Error())
    case errors.Is(err, ledger.ErrNotFound):
        Fail(w, http.StatusNotFound, "NOT_FOUND", "entry not found")
    case errors.Is(err, context.DeadlineExceeded):
        Fail(w, http.StatusGatewayTimeout, "TIMEOUT", "request timeout")
    default:
        log.Printf("internal error: %v req_id=%s", err, reqID(r))
        Fail(w, http.StatusInternalServerError, "INTERNAL", "internal error")
    }
}
```
这个 switch 就是**整个服务的错误语义地图**。新增错误类型只改这一处。

#### 三条规则
1. **错误映射集中在一处**，handler 里只 `return err`，不写 `http.Error`。
2. **未知错误一律 500 且不泄漏细节**，同时必须记日志——否则 500 变成了「什么都没发生」。
3. **`context.Canceled` 不该记成 500**：客户端主动断开是正常现象，记成 500 会污染错误率。通常返回 499（非标准）或直接不写响应。

#### 输入校验要用同一个错误类型
```go
type ValidationError struct {
    Field string
    Msg   string
}
func (e *ValidationError) Error() string { return e.Field + ": " + e.Msg }
```
好处：`errors.As` 能一次识别所有字段级错误，响应里能带上 `field` 供前端高亮。

#### 别忘了 panic：错误地图之外还有一条路

`writeError` 处理的是「返回了 error」的情况，但 handler 里也可能直接 panic（nil 解引用、切片越界、断言失败）。没有 recover，`net/http` 会打印堆栈并断开连接，客户端看到的是「连接被重置」而不是 500——**监控上这次请求直接消失**。

```go
func WithRecovery(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if rec := recover(); rec != nil {
                slog.Error("panic recovered",
                    "panic", rec,
                    "path", r.URL.Path,
                    "stack", string(debug.Stack()),   // 必须记堆栈
                )
                Fail(w, http.StatusInternalServerError, "INTERNAL", "internal error")
            }
        }()
        next.ServeHTTP(w, r)
    })
}
```

两个细节：`debug.Stack()` 只有在这里拿才有意义（出了 defer 就没了）；`WithRecovery` 必须是最外层中间件，否则它包不住内层中间件的 panic。

#### 一页错误码表：写进 README，前后端共用

| HTTP | code | 触发条件 | 前端动作 |
| :--- | :--- | :--- | :--- |
| 400 | `INVALID_ARGUMENT` | 字段校验失败（含 `field`） | 高亮对应输入框 |
| 400 | `INVALID_JSON` | 请求体不是合法 JSON | 提示「请求格式错误」，多为前端 bug |
| 401 | `UNAUTHORIZED` | 缺 token | 跳登录 |
| 401 | `TOKEN_EXPIRED` | token 过期 | 静默刷新或提示重登 |
| 401 | `INVALID_CREDENTIALS` | 登录邮箱或密码错 | 统一提示「邮箱或密码错误」 |
| 404 | `NOT_FOUND` | 资源不存在或不属于当前用户 | 显示「记录不存在」并返回列表 |
| 409 | `EMAIL_TAKEN` | 注册邮箱已存在 | 提示改用登录 |
| 500 | `INTERNAL` | 未预期错误 | 提示「稍后重试」，带上 `request_id` |
| 504 | `TIMEOUT` | `context.DeadlineExceeded` | 提示超时，可重试 |

这张表的用处：**前端不需要猜「400 是哪种 400」**，后端也不需要每次解释。新增错误码时只改这张表和 `writeError` 的 switch，两处必须同时改——这是 review 时的检查点。

#### 5 分钟最小验证：四类错误各打一次

```bash
$ curl -s -o /dev/null -w '%{http_code}\n' -X POST localhost:8080/ledger -d '{"amount":0}'          # 400
$ curl -s -o /dev/null -w '%{http_code}\n' localhost:8080/ledger/abc                                # 400
$ curl -s -o /dev/null -w '%{http_code}\n' localhost:8080/ledger/999999                             # 404
$ curl -s localhost:8080/ledger/999999 | jq -r '.code'                                              # NOT_FOUND
```

再加一条：临时在某个 handler 里写 `panic("test")`，请求它必须返回 **500 + `code=INTERNAL`**，且日志里有 panic 值和堆栈。**没验证过 recover 的服务，等于没有 recover。**

#### 判据
```bash
# 三类错误各打一次，确认状态码和 code 正确
curl -i -X POST localhost:8080/ledger -d '{"amount":0}'
curl -i localhost:8080/ledger/999999
# 停掉数据库（改错路径重启），再请求 → 500，日志有详细原因但响应无细节
```

::q 为什么「未知错误返回 500」还必须写日志？
::a 因为 500 对客户端和监控只是一个数字，不含任何原因。如果不记日志，故障就变成「有错误率但没有线索」，只能靠复现。日志要带完整错误链和 request_id，才能从告警直接定位到具体请求。
::q `context.Canceled` 为什么不该算作 500？
::a 它表示客户端主动断开（关页面、超时取消），不是服务端故障。记成 500 会拉高错误率、触发误报警。这类请求通常也不需要写响应体，因为对端已经走了。
::q 错误映射集中在 `writeError` 里，新增一种业务错误需要改几处？
::a 一处：在 switch 里加一个 `errors.As`/`errors.Is` 分支。handler 只需要 `return` 新错误，不用关心 HTTP 状态码。这正是集中处理的价值——错误到 HTTP 的映射只存在一份。

<!--day 16 | core-->
#### `OFFSET` 为什么会随页深变慢
```sql
SELECT ... FROM entries ORDER BY id LIMIT 20 OFFSET 100000;
```
数据库必须**先按顺序扫描并丢弃前 100000 行**，才能返回接下来的 20 行。成本是 O(offset)，页越深越慢。`EXPLAIN QUERY PLAN` 能看到它走了索引但仍然要逐行跳过。

游标分页（keyset）：
```sql
SELECT ... FROM entries WHERE id < ? ORDER BY id DESC LIMIT 20;
```
直接从索引定位到 `id < ?` 的位置开始取 20 行，成本 O(1)，与页深无关。**代价是不能跳页**，只能「下一页」。

#### 两种分页的取舍
| | OFFSET | 游标 |
| :--- | :--- | :--- |
| 跳页 | ✅ | ❌ |
| 深页性能 | ❌ O(n) | ✅ O(1) |
| 数据变动时稳定性 | 会重复/漏 | 稳定 |
| 实现复杂度 | 低 | 中 |

**家庭账本的现实**：一个月几百条，`OFFSET` 完全够。但接口设计上要预留 `cursor` 参数，等数据量真的上来再切，不用改前端契约。

#### 预留设计
```go
type ListQuery struct {
    Limit  int
    Offset int
    Cursor string   // 预留：base64("2026-10-19|42")
}
// 响应里带上 next_cursor，客户端下次原样回传
type Page[T any] struct {
    Items      []T    `json:"items"`
    Total      int64  `json:"total"`
    NextCursor string `json:"next_cursor,omitempty"`
}
```

#### 游标要编码，不要直接暴露 SQL 条件
```go
func encodeCursor(date string, id int64) string {
    return base64.RawURLEncoding.EncodeToString([]byte(fmt.Sprintf("%s|%d", date, id)))
}

func decodeCursor(s string) (string, int64, error) {
    b, err := base64.RawURLEncoding.DecodeString(s)
    if err != nil { return "", 0, err }
    parts := strings.SplitN(string(b), "|", 2)
    if len(parts) != 2 { return "", 0, errors.New("bad cursor") }
    id, err := strconv.ParseInt(parts[1], 10, 64)
    return parts[0], id, err
}
```
为什么要编码：
1. 客户端不该看到、也不该构造排序键的内部结构。
2. 以后换排序字段（改成按金额排序）时，游标格式可以变而不破坏契约。
3. 但要**校验解码结果**——客户端会传垃圾字符串，`base64` 成功不代表内容是合法的。

#### 同时传 `offset` 和 `cursor` 怎么办
必须定规则，否则行为不确定：
```go
if q.Cursor != "" {
    // 游标优先，忽略 offset
} else {
    // 用 offset
}
```
**接口文档里写清楚「cursor 优先」**，并在响应里回显实际使用的分页方式（或直接不返回 `total`，避免前端误算页数）。

#### 游标分页下 `total` 会变贵
因为要「下一页」很快，但「总共多少条」仍然要 `COUNT(*)` 全表统计。数据量大时，这个 count 比取数据本身还慢。

三个选择：
- 保留 `COUNT(*)`，接受成本（家庭账本没问题）。
- 只在第一页返回 `total`，后续页返回空。
- 用近似值（`EXPLAIN` 的 row estimate），不精确但快。

**知道这个取舍，比背「游标分页更快」有用。**

#### 判据
```sql
EXPLAIN QUERY PLAN SELECT * FROM entries ORDER BY id LIMIT 20 OFFSET 50000;
-- 观察是否出现 "SCAN" 而非 "SEARCH ... USING INDEX"
```
能解释「为什么游标分页不会随页深变慢」，今天就过。

::q `OFFSET 100000 LIMIT 20` 为什么会慢？慢在哪一步？
::a 数据库必须按排序顺序产生前 100020 行，然后丢弃前 100000 行，只返回最后 20 行。丢弃的动作本身要读取索引/数据行，成本与 offset 成正比。所以是「扫描成本」而不是「返回成本」导致慢。
::q 游标分页为什么不能跳页？
::a 因为游标是「上一页最后一条记录的位置」，只能据此往后取。要跳到第 50 页，必须知道第 49 页末尾的位置，而那个位置无法从 `page=50` 直接算出。这是用「不能随机访问」换「恒定成本」。
::q 数据在翻页期间被插入，OFFSET 分页会出现什么现象？
::a 会出现重复或遗漏：新记录插到前面时，后续页的 offset 整体后移，导致某条记录在两页都出现；删除则导致某条被跳过。游标分页基于稳定位置，不受这种位移影响。

<!--day 17 | light-->
#### 回归脚本：把 curl 变成可重复的检查
```bash
#!/usr/bin/env bash
set -euo pipefail
BASE=${BASE:-http://localhost:8080}

# 1. 健康
curl -fsS "$BASE/ledger?limit=1" > /dev/null

# 2. 创建
ID=$(curl -fsS -X POST "$BASE/ledger" \
  -H 'Content-Type: application/json' \
  -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}' | jq -r '.data.id')

# 3. 读回
curl -fsS "$BASE/ledger/$ID" | jq -e '.data.amount == 3550' > /dev/null

# 4. 404
code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/ledger/99999999")
[ "$code" = "404" ] || { echo "expected 404, got $code"; exit 1; }

echo "all checks passed"
```
`-f` 让 curl 在 4xx/5xx 时返回非零，`set -e` 让脚本立即失败。**没有这两点，脚本永远「通过」**。

#### 脚本要放在仓库里
`scripts/smoke.sh`，每次改完跑一遍。它的价值不在今天，在阶段四加认证、阶段五改 GORM 之后——那时你会改到很多共享代码，一个 20 行的脚本能挡住大部分回归。

#### 没写过 bash？这四行先看懂再抄

上面那段脚本里出现的语法，如果有一个不认识，抄下来也改不动。逐条过：

```bash
set -euo pipefail     # 三个开关合在一起：e=命令失败就退出；u=用到未定义变量就报错；o pipefail=管道里任一环失败就算失败
BASE=${BASE:-http://localhost:8080}   # 取环境变量 BASE，为空时用冒号右边的默认值
ID=$(curl ... | jq -r '.data.id')     # $( ) 把命令的输出当值赋给变量；| 把左边输出交给右边
[ "$code" = "404" ] || { echo 失败; exit 1; }   # [ ] 是判断；|| 是「前面失败才执行后面」
```

四个最容易踩的点：

1. **`${BASE:-默认值}` 不是字符串拼接**，它的意思是「BASE 有值就用它，没值或为空就用默认值」。写成 `$BASE:-xxx` 会被解析成「变量 `BASE:-xxx`」。
2. **`$(...)` 里的失败不会让 `set -e` 生效**（某些 shell 版本），所以拿到的可能是空字符串而不是错误。关键变量要额外判断：`[ -n "$TOKEN" ] || exit 1`。
3. **`[ ]` 里面的空格是语法，不是风格**。`[ "$a"="b" ]` 会被当成一个整体参数，永远为真——少一个空格，判断就静默失效。
4. **`||` 后面的 `{ }` 里必须有分号和空格**：`|| { echo x; exit 1; }`。写成 `|| { echo x; exit 1 }` 会报语法错。

#### `jq` 只需要会这四种

| 写法 | 作用 | 典型用途 |
| :--- | :--- | :--- |
| `jq .` | 格式化整个 JSON | 肉眼看结构 |
| `jq -r '.data.id'` | 取字段，去掉引号 | 拿 ID 存进变量 |
| `jq -e '.data.amount == 3550'` | 断言，false 时**退出码非 0** | 脚本里做判断 |
| `jq '.data.items \| length'` | 取数组长度 | 断言条数 |

`-e` 是断言能进脚本的关键：没有它，`jq` 即使算出 `false` 也返回 0，脚本照样「通过」。macOS 自带的 jq 版本较老，`jq --version` 低于 1.6 时建议 `brew install jq`。

#### `curl -fsS` 三个字母分别是什么

- `-f`：HTTP >= 400 时返回**非零退出码**（不加的话 500 也算成功）。
- `-s`：静默，不打印进度条。
- `-S`：即使静默，也把错误信息打出来（配合 `-s` 用，否则报错时一片空白）。

排查「脚本说通过但服务其实挂了」时，先检查这三个字母。**回归脚本的第一原则是「失败要吵」，不是「输出好看」。**

#### 报错对照

| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `jq: command not found` | 没装 jq | `brew install jq`，或把取值改成 `grep -o '"id":[0-9]*'` |
| `parse error: Expected value before EOF` | curl 没拿到内容（服务没起），jq 拿到空串 | 先 `curl -v` 确认服务在，再用 `-fsS` |
| 脚本中途退出但没有报错信息 | `set -e` 生效，失败命令自己没输出 | 每步加 `echo "[step] 名称"`，定位到具体步骤 |
| `expected 404, got 000` | 连接失败时 `%{http_code}` 是 `000`，不是 404 | 先断言「能连上」，再断言业务状态码 |
| 第二次运行报 409/唯一约束冲突 | 用了固定数据（同一个邮箱、同一天） | 用 `$(date +%s)` 造唯一值 |

#### 5 分钟最小验证：先让脚本「失败一次」

新建 `scripts/smoke.sh`，只写三行：

```bash
#!/usr/bin/env bash
set -euo pipefail
curl -fsS http://127.0.0.1:8080/healthz > /dev/null
```

`chmod +x scripts/smoke.sh` 后**在服务没启动的情况下**跑它，必须看到非零退出（`echo $?` 应该是 22 或 7，不是 0）。这一步比写完整脚本重要：**先证明它能红，才有资格相信它绿。**

::q 为什么 `curl` 要加 `-f`？
::a `-f`（fail）让 curl 在 HTTP 状态码 >= 400 时返回非零退出码，配合 `set -e` 脚本会立即失败。不加的话 curl 对 500 也返回 0，脚本永远显示「通过」，完全失去回归价值。
::q 这个 smoke 脚本在后续阶段最大的价值是什么？
::a 它把「接口行为」固化成了可执行断言。阶段四加认证后所有接口都需要 token，阶段五换 GORM 后 SQL 行为可能微变，这些改动都可能悄悄破坏某个边界；脚本能在几秒内告诉你哪条断了。
::q 你想断言「列表里有 2 条记录」，写成 `curl -s ... | jq '.data.items | length'` 后怎么让脚本自动判断？为什么不能只 `echo` 出来看？
::a 要写成 `[ "$(curl -s ... | jq '.data.items | length')" = "2" ] || { echo "期望 2 条，实际 $n"; exit 1; }`。`echo` 只是把数字打印给人看，脚本不会因此失败——**人看一眼的断言不是断言**。另外要注意：`jq -e` 用于布尔断言，`length` 返回数字时 `-e` 对 0 会返回 1（认为假），所以数字断言用字符串比较更稳。

<!--day 18 | light-->
#### 阶段验收清单（逐条打勾，不许「差不多」）
```bash
# 1. 创建两笔
curl -s -X POST localhost:8080/ledger -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}'
curl -s -X POST localhost:8080/ledger -d '{"amount":1200,"category":"交通","date":"2026-10-19"}'
# 2. 重启进程
# 3. 两笔都在
curl -s 'localhost:8080/ledger?limit=20' | jq '.data.total'    # 2
# 4. 分页生效
curl -s 'localhost:8080/ledger?limit=1&offset=1' | jq '.data.items | length'  # 1
# 5. summary 正确
curl -s 'localhost:8080/summary?month=2026-10' | jq '.data.total'  # 4750
```

#### 复盘：三个阶段各自留下了什么资产
| 阶段 | 留下的东西 | 后面怎么用 |
| :--- | :--- | :--- |
| 一 | 错误包装、切片语义、连接生命周期 | 阶段五 500/404 分流、GORM 连接池 |
| 二 | 竞态模型、context 传播 | 阶段五 请求级 ctx、阶段六 优雅关闭 |
| 三 | 统一信封、中间件、错误地图 | 阶段四 认证中间件、阶段六 CSRF |

**这张表不是总结，是依赖关系。** 任何一项没打牢，后面都会以「奇怪的 bug」形式回来找你。

#### 验收红了怎么办：按现象回查，不要整段重读

| 现象 | 最可能的断点 | 回去看 |
| :--- | :--- | :--- |
| 创建返回 200 而不是 201 | 状态码没显式写，或用了 `OK` 而不是 `OKStatus` | 阶段三 D4 / D6 |
| 重启后 `total` 变成 0 | DSN 写成 `:memory:`，或工作目录变了 | 阶段三 D10 |
| `summary` 的 total 比分类之和小 | 分类相加漏了空分类，或 `COALESCE` 没写 | 阶段三 D12 |
| `?limit=1&offset=1` 返回 2 条 | `limit` 没生效（拼进 SQL 没走占位符） | 阶段三 D7 |
| 分页两次请求 `total` 不同 | 没有一次算出总数，或 `total` 语义写成了「剩余条数」 | 阶段三 D7 |
| 404 和 400 分不清 | `ErrNoRows` 在包装之后才判断，或 `PathValue` 没校验 | 阶段三 D11 |
| 日志里 status 一直是 0 | `ResponseWriter` 包装器漏了 `Write` | 阶段三 D14 |

**用法：先跑验收命令，看到哪一个红，只回那一行对应的一天。** 不要因为一条红了就把整个阶段重读一遍——那是效率最低的做法，而且会让你怀疑自己。

#### 复盘要写下三样东西，不是「我学完了」

```markdown
## 阶段三复盘（2026-11-xx）

### 1. 我踩过的三个坑（带报错原文）
- `superfluous WriteHeader call`：在 middleware 里先 Write 了 body，handler 里再写状态码 → 顺序必须 Header → WriteHeader → Write
- 分页第 2 页出现第 1 页的记录：`ORDER BY date DESC` 缺唯一列兜底，同一天多条顺序不稳
- `sql: database is closed`：先 `db.Close()` 再 `srv.Shutdown()`，在途请求拿到已关闭的池

### 2. 我说不清但能跑通的地方（下一阶段重点补）
- 为什么 `http.MaxBytesReader` 要传 w？（提示：它要在超限时写 413）

### 3. 我能不看资料写出来的东西
- 统一信封的 writeJSON、中间件套的顺序、带 user_id 的查询
```

第 2 项最重要：「**能跑通但说不清**」就是下一个阶段的隐患。把它们列出来，阶段四遇到相关代码时回头补，比现在硬啃有效。

#### 5 分钟最小验证：让验收脚本一次跑完

```bash
$ ./scripts/api-test.sh; echo "exit=$?"
```

必须看到 `exit=0` 且每一步都打了 PASS。如果某一步没打印就退出了，说明 `set -e` 在那一行生效——回去给那一步加 `echo` 和「期望 vs 实际」。

::q 到阶段三结束时，API 已经能被 Vue 调用，此时最缺的是什么？
::a 认证与数据隔离。任何人只要知道地址就能读写全部账目，也没有「这笔账属于谁」的概念。这是阶段四要解决的，也是从「能跑」到「能用」的分界线。
::q 为什么要在进入下一阶段前做一次完整回归？
::a 因为接下来要重构（加认证中间件、换 GORM），重构的前提是有可信的行为基线。基线不存在时，任何异常都无法判断是「新引入的 bug」还是「本来就这样」。
::q 验收时 `?limit=1&offset=1` 返回了 2 条，你会从哪一行代码开始查？为什么不是先去看 SQL？
::a 先看 handler 里 `limit` 的取值与校验（`parseIntDefault` / 上限截断），确认传进 Service 的到底是多少；再看 Service 是否把参数原样传给 store。理由是：分页参数在到达 SQL 之前会经过三层，「参数没传对」比「SQL 写错」概率高得多，而且查起来快。只有当参数确认无误后再看 SQL 的 `LIMIT ? OFFSET ?` 是否真的用了占位符。**排错要从最便宜的一层开始。**
