<!--day 1 | normal-->
#### goroutine 便宜，但不是免费
```go
go func() {
    fmt.Println("异步")
}()
fmt.Println("主线程")
```
输出顺序不确定：主 goroutine 可能先打印再退出，子 goroutine 还没跑就被杀掉。**`main` 返回 = 进程结束，所有 goroutine 一起死**，没有「等待未完成任务」这回事。这是新手第一次写并发时最常见的「代码没执行」原因。

每个 goroutine 初始栈只有 2KB 左右，可以轻松开十万个。但「便宜」指的是栈，不是没有成本：调度、内存、锁竞争都是真实开销。

#### 三个必须建立的直觉
1. **启动顺序 ≠ 执行顺序**。`go f()` 只是把任务交给调度器，什么时候跑、在哪个核上跑都不确定。
2. **闭包捕获变量，不是捕获值**。
```go
for i := 0; i < 3; i++ {
    go func() { fmt.Println(i) }()   // ❌ 可能打印 3 3 3
}
```
Go 1.22 起循环变量每轮独立，这个问题在 `for i :=` 里已被修复；但如果你写的是 `for _, v := range` 并对 `v` 取地址，仍要显式传参 `go func(v int){...}(v)` 才最稳。

3. **goroutine 里的 panic 会杀死整个进程**，不像 HTTP handler 有 `net/http` 兜底。任何自己起的 goroutine 都要自带 `recover`，否则一个越界就让服务整体退出。

#### 判据
```go
var wg sync.WaitGroup
for i := 0; i < 3; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        fmt.Println(n)
    }(i)
}
wg.Wait()
```
三行都打印出来（顺序不定），进程不会提前退出。如果你没写 `wg.Wait()`，很可能一行都没有。

::q 为什么 `main` 函数里的 `go func(){...}()` 经常「没执行」？
::a 因为 `main` 返回时进程立即结束，运行时不会等待未完成的 goroutine。子 goroutine 可能还没来得及被调度就被终止。要保证执行完，必须用 `sync.WaitGroup`、channel 或 `context` 显式同步。
::q 起 100 个 goroutine 每个都 panic，会发生什么？
::a 第一个未 recover 的 panic 就会导致整个进程退出（打印堆栈后 exit 2），其余 99 个随之被杀。所以每个 goroutine 顶部的 `defer recover()` 不是可选项，尤其在后台任务里。
::q Go 1.22 对循环变量做了什么改变？
::a 每次迭代都创建新的循环变量实例，闭包捕获的是当轮变量，因此 `for i := range` 里的 `go func(){ use(i) }()` 不再共享同一个 `i`。这修复了历史上有名的「全部打印最后一个值」的问题，但显式传参仍然是更清晰的写法。

<!--day 2 | core-->
#### channel 的本质：带锁的队列 + 阻塞语义
```go
ch := make(chan int)        // 无缓冲
ch := make(chan int, 10)    // 有缓冲，容量 10
```
- **无缓冲**：发送和接收必须**同时就绪**，任一方单独行动都会阻塞。它是「同步点」，不是「容器」。
- **有缓冲**：缓冲未满可发送、非空可接收，否则阻塞。

这三条规则推出来的后果：
```go
ch := make(chan int)
ch <- 1        // 永久阻塞：没有接收者（fatal error: all goroutines are asleep - deadlock!）
```
运行时能检测到「所有 goroutine 都卡住」并直接 panic，这比静默挂起好，但报错信息指向的是最后一行，真正的原因可能在上游。

#### 关闭的规则，只有一条要记
**只有发送方 close，接收方永远不 close。** 向已关闭的 channel 发送会 panic，从已关闭的 channel 接收会立刻返回零值且 `ok == false`。

```go
close(ch)
v, ok := <-ch   // v=0, ok=false
for v := range ch { ... }  // 关闭且排空后自动退出循环
```
`range` 是消费 channel 的标准写法：它会一直读到 channel 关闭。所以「谁发送谁关闭」的规矩不是风格问题——接收方 close 会让发送方 panic。

#### 用 channel 做「结果收集」
```go
func sumAll(ctx context.Context, nums []int) int {
    ch := make(chan int, len(nums))
    var wg sync.WaitGroup

    for _, n := range nums {
        wg.Add(1)
        go func(v int) {
            defer wg.Done()
            ch <- v * v
        }(n)
    }

    go func() { wg.Wait(); close(ch) }()  // 关键：等所有发送方结束再关

    total := 0
    for v := range ch {
        total += v
    }
    return total
}
```
三个要点：
1. 缓冲设成 `len(nums)`，发送方不会因为没人收而阻塞。
2. **`close` 必须等所有发送方完成**，否则 `ch <- v` 会 panic 在已关闭的 channel 上。所以用 `wg.Wait()` 起一个专门的 goroutine 来关。
3. `range ch` 负责收完并退出。

#### 什么时候不该用 channel
Go 的官方建议是：**「通过通信共享内存」只在数据所有权需要转移时用**；如果只是多个 goroutine 读写同一份结构，`sync.Mutex` 更简单、更快、更好读。用 channel 实现一个计数器（发一个 1、收一个 1）是典型的反模式。

#### 判据
```go
ch := make(chan int, 2)
ch <- 1
ch <- 2
close(ch)
for v := range ch { fmt.Println(v) }  // 1 2，不 panic
```
能解释「为什么这里不会 panic，而无缓冲版本会」。

::q `ch := make(chan int); close(ch); ch <- 1` 会怎样？
::a panic：`send on closed channel`。向已关闭的 channel 发送是运行时错误，不是阻塞。所以关闭权必须唯一地掌握在发送方手里，且关闭后不再发送。
::q 为什么关闭 channel 前要等所有发送方结束？
::a 因为 `close` 后任何发送都会 panic。如果用 `wg.Wait()` 在独立的 goroutine 里关闭，就保证了「所有发送 goroutine 已 `Done`」才执行 close，接收方 `range` 也就能安全地读到排空为止。
::q 无缓冲 channel 和有缓冲 channel 在语义上最本质的区别是什么？
::a 无缓冲是**同步点**：发送完成意味着接收方已经拿到值，天然构成一次握手。有缓冲是**队列**：发送只代表值进了缓冲，接收方何时处理完全未知。前者用于同步、后者用于解耦，混用会导致「以为同步了其实没有」的时序 bug。

<!--day 3 | core-->
#### `select` 是 channel 的 switch
```go
select {
case v := <-ch1:
    fmt.Println("ch1", v)
case ch2 <- 42:
    fmt.Println("写入 ch2")
default:
    fmt.Println("都不就绪")
}
```
规则：多个 case 同时就绪时**随机选一个**（防止饥饿）；有 `default` 时永不阻塞；没有 `default` 且全不就绪时阻塞。

#### 超时：`time.After` 是最常用的写法
```go
select {
case v := <-ch:
    return v, nil
case <-time.After(2 * time.Second):
    return 0, fmt.Errorf("等待结果超时")
}
```
`time.After` 返回一个 channel，到点后写入。代价是**在超时到来前它不会被回收**——放在循环里会累积定时器。循环场景用 `time.NewTimer` 并显式 `Stop`。

#### 取消：`<-ctx.Done()`
```go
select {
case v := <-ch:
    return v, nil
case <-ctx.Done():
    return 0, ctx.Err()
}
```
`ctx.Done()` 是一个「取消时关闭」的 channel。这是 Go 里最标准的取消传播方式——**不要自己造一个 `done chan struct{}` 到处传**，因为 context 还带截止时间和值，能一路传到数据库驱动。

#### `for select` 的经典形态
```go
for {
    select {
    case job, ok := <-jobs:
        if !ok { return nil }   // 上游关闭
        if err := handle(job); err != nil { return err }
    case <-ctx.Done():
        return ctx.Err()
    }
}
```
注意 `ok` 判断：channel 关闭后 `<-jobs` 会立刻返回零值，不判断就会陷入「疯狂处理空 job」的死循环，CPU 打满。

#### `select` 不能做什么
- 不能保证优先级：想让取消优先于正常任务，必须**先写一个非阻塞的检查**：
```go
select {
case <-ctx.Done(): return ctx.Err()
default:
}
select { ... }   // 再做正常分支
```
- 不能用于「等待所有」：那需要 `WaitGroup`。
- `nil` channel 在 select 里**永远不就绪**，可以用来动态禁用某个分支（把 channel 设为 nil 即可）。

#### 判据
```go
ch := make(chan int)
ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
defer cancel()
select {
case <-ch:
    fmt.Println("收到")
case <-ctx.Done():
    fmt.Println("超时:", ctx.Err())   // context deadline exceeded
}
```
100ms 后必须打印超时，且进程不挂住。

::q `select` 里两个 case 同时就绪，会选哪个？
::a 随机选一个。Go 的实现会在就绪的 case 中随机挑选，以避免固定顺序导致某些分支长期饥饿。这意味着**不能依赖 select 的顺序做优先级控制**，需要优先级时必须显式写两段 select。
::q channel 已关闭，`case job, ok := <-jobs` 不判断 `ok` 会怎样？
::a 会陷入死循环。关闭的 channel 永远「就绪」并返回零值，`ok` 为 false 但你忽略了它，于是每轮都拿到一个空 job 立刻处理，CPU 打满却不报错。必须用 `if !ok { return }` 退出。
::q `time.After` 放在循环里为什么可能泄漏？
::a 每次调用都会创建一个定时器，即使 select 提前走到了别的分支，这个定时器仍要在到期后才被回收。高频循环里会累积大量待回收定时器，造成内存和调度压力。正确做法是用 `time.NewTimer` + `defer timer.Stop()`，或复用一个 timer 并 `Reset`。

<!--day 4 | core-->
#### 竞态不是「偶发 bug」，是有确定成因的 bug
```go
var counter int
var wg sync.WaitGroup
for i := 0; i < 1000; i++ {
    wg.Add(1)
    go func() { defer wg.Done(); counter++ }()
}
wg.Wait()
fmt.Println(counter)   // 通常小于 1000
```
`counter++` 在机器层面是三步：读 → 加 → 写。两个 goroutine 交错执行 `R R W W`，其中一次自增被覆盖。**结果每次都不同，取决于调度**。

`go run -race main.go` 会明确告诉你哪两行冲突：
```
WARNING: DATA RACE
Write at 0x... by goroutine 7:
  main.main.func1()
Previous read at 0x... by goroutine 6:
```
**看到 `DATA RACE` 才算证据。** 「我觉得这里可能有并发问题」不算。

#### WaitGroup 的三个错误用法
```go
// ❌ 1. Add 写在 goroutine 里
go func() { wg.Add(1); defer wg.Done(); ... }()
// 竞争：Wait 可能在 Add 之前就返回

// ❌ 2. 传值而不是传指针
func worker(wg sync.WaitGroup) { ... }  // 复制了计数器，Done 作用在副本上

// ❌ 3. Add 的数量和 Done 的次数不匹配
```
正确形态永远是：**在启动 goroutine 之前 `Add(1)`，goroutine 内 `defer Done()`**。

#### `-race` 能查什么、不能查什么
能查：真实发生的数据竞争（读写冲突、无同步的并发访问）。
不能查：**逻辑竞争**（比如「先查余额再扣款」这种业务上的 TOCTOU，两个事务都读到 100，各自扣 80）。这类问题要靠数据库事务或锁解决，`-race` 帮不上。

#### 判据
```bash
go run -race main.go   # 出现 WARNING: DATA RACE
```
把这段输出保存下来，它是你后面「修好了」的对照基线。修完再跑，必须完全无输出。

::q `counter++` 为什么会丢更新？
::a 它不是原子操作，编译后是「加载 → 加一 → 存回」三条指令。两个 goroutine 若都先加载了旧值 5，各自加一存回 6，两次自增只生效一次。修复要么加锁，要么用 `atomic.Int64`。
::q `wg.Add(1)` 放在 goroutine 内部为什么危险？
::a 因为 `wg.Wait()` 可能在某个 goroutine 执行 `Add` 之前就看到计数为 0 而返回，导致 `main` 提前结束、任务没跑完。规范是：`Add` 必须在启动 goroutine 的**那一侧、启动之前**调用。
::q `-race` 没报错，是否说明并发逻辑一定正确？
::a 不是。`-race` 只检测同一个内存地址的读写冲突，检测不到业务逻辑上的时序问题（如「先查后改」的竞态）、死锁、goroutine 泄漏。它只是必要条件，不是充分条件。

<!--day 5 | core-->
#### Mutex：把「读-改-写」变成原子段落
```go
type Counter struct {
    mu sync.Mutex
    n  int64
}

func (c *Counter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.n++
}
```
`defer Unlock` 的意义不是省字，而是**保证 panic 时也会解锁**。手写 `Unlock` 在中间 return 或 panic 时会留下死锁。

#### 锁的粒度：太小无效，太大串行
```go
// ❌ 锁住整个处理流程，并发退化成串行
mu.Lock()
data := fetchFromDB()   // 慢操作在锁内
process(data)
mu.Unlock()

// ✅ 只锁共享状态的读写
data := fetchFromDB()
mu.Lock()
cache[key] = data
mu.Unlock()
```
判据：**锁内不允许出现 I/O、网络调用、channel 阻塞操作**。锁内做的事应该只有「几个字段的读写」。

#### 读写分离用 `RWMutex`
```go
type Cache struct {
    mu sync.RWMutex
    m  map[string]Entry
}

func (c *Cache) Get(k string) (Entry, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    v, ok := c.m[k]
    return v, ok
}
func (c *Cache) Set(k string, v Entry) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.m[k] = v
}
```
多个读可以并发，写独占。**读多写少才划算**；写频繁时 `RWMutex` 比 `Mutex` 更慢（维护读者计数有额外开销）。

#### 三个容易踩的坑
1. **复制含 Mutex 的结构体** → 锁失效，`go vet` 报 `copylocks`。所以这类结构体一律用指针传递。
2. **重入死锁**：Go 的 `Mutex` 不可重入，`Lock` 里再 `Lock` 同一把锁会永久阻塞。需要重入说明设计有问题，拆函数而不是换锁。
3. **锁的顺序**：多个锁必须全局统一获取顺序（如先 A 后 B），否则两个 goroutine 交叉持锁会死锁。

#### 原子操作：单个字段的轻量替代
```go
import "sync/atomic"

var hits atomic.Int64
hits.Add(1)
fmt.Println(hits.Load())
```
适用于「一个数字的加减/替换」，比 Mutex 快。但**一旦逻辑涉及多个字段的一致性，就必须用锁**——原子操作保护不了「A 和 B 要同时改」。

#### 判据
```bash
go run -race main.go   # 无输出
go test -race ./...     # 全绿
```
加上 Mutex 后，1000 次并发自增的结果必须**每次都是 1000**，连跑十次。

::q `defer mu.Unlock()` 相比在函数末尾写 `mu.Unlock()` 好在哪里？
::a 保证任何返回路径（包括中途 return 和 panic）都会解锁。手写 Unlock 时，一旦函数中间 `return` 或发生 panic，锁不会被释放，后续所有 Lock 永久阻塞，表现为服务整体卡死。
::q 为什么 `RWMutex` 在读多写少时才划算？
::a 它需要维护读者计数、唤醒等待者，写锁还要等待所有读锁释放。读多写少时并发收益大于这套额外开销；写频繁时等待链条变长，性能反而不如普通 Mutex。
::q 锁内调用数据库查询会造成什么后果？
::a 一次慢查询（几十毫秒到几秒）期间，所有需要同一把锁的 goroutine 全部阻塞，并发度退化为 1，请求排队雪崩。如果查询还依赖网络，故障时会把整个服务拖死。锁内只应操作内存中的少量字段。

<!--day 6 | core-->
#### context 解决的是「取消信号的传播」
一个 HTTP 请求进来，可能在 handler 里查了三次数据库、调了一次外部 API。用户关掉页面后，这些工作应该**尽快停下**，否则资源白烧。context 就是把这一个「停」的信号，沿着调用链自动传下去。

```go
ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
defer cancel()   // 必须调用，否则定时器泄漏
```
三件事必须同时做到：
1. `ctx` 作为**第一个参数**一路传下去（`func Get(ctx context.Context, id int64)`）。
2. 每一层都把 `ctx` 交给下游（`db.QueryRowContext(ctx, ...)`）。
3. `WithTimeout`/`WithCancel` 的 `cancel` 一定 `defer` 调用，即使提前成功返回。

#### `Done()` / `Err()` 的语义
```go
select {
case <-ctx.Done():
    return ctx.Err()   // context.Canceled 或 context.DeadlineExceeded
case <-time.After(time.Second):
}
```
`Done()` 返回一个只读 channel，取消时关闭。`Err()` 给出原因——**这两个要配合使用**：只等 `Done()` 不知道是超时还是主动取消，日志里就没法区分「用户断开」和「后端太慢」。

#### 三条铁律
1. **不要把 `ctx` 存进结构体字段**。它是请求作用域的，存起来就意味着复用了一个已取消的 ctx。
2. **不要传 `nil` context**。不确定时用 `context.TODO()`，至少能静态检查出来。
3. **不要在长生命周期组件里保留 `r.Context()`**。请求结束 ctx 就取消，后台任务拿着它一定失败。

第 3 条在阶段五会变成具体规则：**GORM 只接受请求作用域的 ctx，不能把它存进 repo 结构体**。

#### 值传递：`WithValue` 只放请求元数据
```go
type ctxKey string
const userIDKey ctxKey = "userID"

ctx := context.WithValue(r.Context(), userIDKey, int64(42))
uid, ok := ctx.Value(userIDKey).(int64)
```
规矩：
- key 用**自定义类型**（不要用 string），避免不同包撞 key。
- 只放「横切关注点」：request ID、用户 ID、trace ID。**不要放业务参数**，那会让函数签名失去表意能力。
- 取出来必须做类型断言并判断 `ok`，否则 nil 断言 panic。

#### 取消如何真正生效
取消是**协作式**的：ctx 取消只关闭 channel，不会杀 goroutine。下游必须自己检查 `ctx.Done()` 或使用支持 ctx 的 API（`QueryContext`、`http.NewRequestWithContext`）才会真正中断。

```go
// ❌ 取消不了：用的是不带 ctx 的 API
db.Query("SELECT ...")

// ✅ 取消能传到驱动层
db.QueryContext(ctx, "SELECT ...")
```

#### 判据
```go
ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
defer cancel()
time.Sleep(100 * time.Millisecond)
fmt.Println(ctx.Err())   // context deadline exceeded
```
再验证一次「取消能传到数据库」：用 `QueryContext` 跑一条 `SELECT` 并在 10ms 后取消，应当返回 `context deadline exceeded` 而不是正常结果。

::q `WithTimeout` 之后忘记调用 `cancel()` 会怎样？
::a 定时器会一直存活到超时时刻，期间持有对 ctx 的引用，造成内存和定时器泄漏。如果这个 ctx 又被存进 map 或结构体，泄漏会持续累积。所以 `defer cancel()` 是无条件要写的，即使函数正常返回。
::q 为什么不能把 `ctx` 存进结构体字段？
::a context 的生命周期绑定单次请求，请求结束即取消。存进结构体意味着下次复用这个对象时仍持有已取消的 ctx，所有下游调用会立刻失败。需要跨调用传递的应该是请求参数，不是 ctx。
::q `ctx.Done()` 关闭后，下游 goroutine 会自动停止吗？
::a 不会。关闭 channel 只是一个信号，goroutine 必须自己检查（`select { case <-ctx.Done(): }`）或调用支持 ctx 的 API 才会退出。没有检查点的纯计算循环，即使 ctx 取消也会跑完。

<!--day 7 | normal-->
#### 一个目录一个包，包名是「职责」不是「层级」
```
ledger/
├── go.mod
├── main.go                  package main
├── internal/
│   ├── store/               package store    —— 数据存取
│   └── ledger/              package ledger   —— 领域逻辑 + 接口定义
```
`internal/` 是 Go 的强制可见性规则：**`internal` 下的包只能被同一父目录树内的代码导入**。外部项目想 import `ledger/internal/store` 会直接编译失败。这不是约定，是编译器保证。

#### 导出规则：首字母大写
- `func Insert` / `type Entry` → 导出，包外可见。
- `func insert` / `type entry` → 包内私有。

导出的东西就是你的 API 面。原则：**导出得越少，以后改起来越自由。** 结构体字段同理，只在必须序列化时才导出。

#### 包依赖必须是单向的
```
main → ledger → store
```
反过来 store 导入 ledger 就形成环，Go 直接拒绝编译（`import cycle not allowed`）。

常见的环是怎么产生的：store 需要返回 `ledger.Entry` 类型 → 于是导入 ledger；ledger 又导入 store 用它的函数 → 成环。解法有两种：
1. 把共享类型放到独立的 `internal/model` 包，两边都导入它。
2. 让接口定义在使用方（阶段一 D7 的原则），store 只返回自己包内的类型，由 ledger 层转换。

**第二种更好**：转换代码是显式的，依赖方向清晰。

#### 命名惯例
- 包名小写、单词、不用下划线：`store`、`ledger`，不要 `store_pkg`。
- 避免 `util`、`common`、`base` ——它们最终会变成垃圾场。
- 调用处读起来要通顺：`store.New(...)` 而不是 `store.NewStore(...)`（后者口吃）。

#### 判据
```bash
go list -deps ./... | head       # 看依赖树
go build ./...                   # 无环、无未使用导入
```
再写一行「故意让 store 导入 ledger」的代码，确认编译器报 `import cycle` —— 见过一次，以后就不会设计出环。

::q `internal/` 目录的作用是什么？
::a 限制导入范围：`internal` 下的包只能被以它父目录为根的树内代码导入。外部模块尝试导入会在编译期被拒绝。它用于把「实现细节」锁在项目内部，避免被别人依赖后再也改不动。
::q 什么是 import cycle，为什么会发生？
::a 两个包互相导入，Go 不允许这种环（会导致初始化顺序无法确定）。典型成因是共享类型放错了地方：A 定义类型、B 使用，后来 B 也定义了 A 需要的类型。解法是把共享类型下沉到第三个包，或把接口定义在使用方让依赖单向。
::q 为什么不该建 `util` 包？
::a 它没有明确职责，任何「不知道放哪」的函数都会扔进去，最终变成几十个不相关函数的集合。结果是谁都依赖它，它依赖所有人，改一个函数要重新验证整个项目。按职责命名（`money`、`render`、`validate`）才能让依赖关系有意义。

<!--day 8 | normal-->
#### 重构的目标不是「分层好看」，是「能测、能换」
重构前后行为必须完全一致——所以**先跑一遍 D14/D15 的验收命令，把输出存下来**，重构完逐条对比。没有基线就不叫重构，叫重写。

#### 第一步：把 SQL 挪进 store，接口定义在使用方
```go
// internal/ledger/service.go
package ledger

import "context"

type Entry struct {
    ID       int64
    Amount   int64    // 分
    Category string
    Date     string
    Note     string
}

// 接口在使用方声明：Service 只关心这四件事
type Store interface {
    Insert(ctx context.Context, e Entry) (int64, error)
    Get(ctx context.Context, id int64) (Entry, error)
    ListByMonth(ctx context.Context, month string) ([]Entry, error)
    SumByMonth(ctx context.Context, month string) (int64, error)
}

type Service struct{ store Store }

func NewService(s Store) *Service { return &Service{store: s} }
```
注意：`ledger` 包**不认识 sql**，也不认识 `store` 包。

#### 第二步：store 实现接口，自己管 SQL
```go
// internal/store/sqlite.go
package store

import (
    "context"
    "database/sql"
    "ledger/internal/ledger"
)

type SQLite struct{ db *sql.DB }

func New(db *sql.DB) *SQLite { return &SQLite{db: db} }

func (s *SQLite) Insert(ctx context.Context, e ledger.Entry) (int64, error) {
    res, err := s.db.ExecContext(ctx,
        `INSERT INTO entries (amount, category, date, note) VALUES (?, ?, ?, ?)`,
        e.Amount, e.Category, e.Date, e.Note)
    if err != nil { return 0, fmt.Errorf("store.Insert: %w", err) }
    return res.LastInsertId()
}

var _ ledger.Store = (*SQLite)(nil)   // 编译期断言
```
这里 store 导入 ledger（为了用 `Entry` 类型），方向是 store → ledger。而 ledger 只依赖自己定义的 `Store` 接口，不导入 store。**依赖单向，无环。**

#### 第三步：main 只做装配
```go
func main() {
    db, err := openDB(cfg.DBPath)
    if err != nil { log.Fatal(err) }
    defer db.Close()

    st := store.New(db)
    svc := ledger.NewService(st)
    // 命令行模式传 svc，HTTP 模式也传 svc
    runCLI(svc)
}
```
`main` 变成一张接线图，三行业务代码都不在里面。这是后面换 HTTP、加中间件、写测试的前提。

#### 判据
```bash
go build ./...
go run . list          # 输出必须和重构前逐字一致
go list -deps ./internal/ledger | grep store   # 应当为空
```
最后一条是关键：**ledger 包不应该依赖 store 包**。如果有输出，说明接口放错位置了。

::q `go list -deps ./internal/ledger` 里出现 store 包，说明什么问题？
::a 说明 ledger 反向依赖了实现包，依赖方向变成双向（store 为了实现接口也要导入 ledger），进一步就会 import cycle。正确形态是 ledger 只定义接口、不导入任何实现，实现方单向导入 ledger。
::q 重构前为什么必须先跑一遍验收命令？
::a 因为重构的定义是「外部行为不变」。没有重构前的输出作基线，就无法判断改动是否等价，只能靠人眼读代码，而人眼一定会漏。有了基线，任何差异立刻暴露。
::q 为什么 `Entry` 定义在 ledger 包而不是 store 包？
::a 因为它是业务概念，被 Service、CLI、将来的 HTTP 层共同使用。定义在 store 里会让上层被迫依赖存储层。放在领域包，存储层只负责「把领域对象存下去」，职责更清晰。

<!--day 9 | light-->
#### 并发导出：按月分文件，每个 goroutine 一个文件
```go
func exportAll(ctx context.Context, svc *ledger.Service, months []string, dir string) error {
    var wg sync.WaitGroup
    errCh := make(chan error, len(months))

    for _, m := range months {
        wg.Add(1)
        go func(month string) {
            defer wg.Done()
            entries, err := svc.ListByMonth(ctx, month)
            if err != nil {
                errCh <- fmt.Errorf("export %s: %w", month, err)
                return
            }
            if err := writeCSV(filepath.Join(dir, month+".csv"), entries); err != nil {
                errCh <- fmt.Errorf("write %s: %w", month, err)
            }
        }(m)
    }

    wg.Wait()
    close(errCh)
    for err := range errCh { return err }   // 返回第一个错误
    return nil
}
```
关键点：**每个 goroutine 写自己的文件**，没有共享状态，所以不需要锁。并发不是目的，「无共享」才是能安全并发的条件。

如果必须共享（比如都往一个 CSV 追加），就要么加锁，要么改成 channel 汇总由单一 goroutine 写——后者通常更简单。

#### 阶段验收
```bash
go test -race ./...       # 全绿
go run -race . list       # 无 DATA RACE
go run . export           # 多个月份的 csv 都能打开
```
然后回答三个问题（答不出回对应天）：

1. 为什么 `main` 依赖 `Store` 接口而不是 `*store.SQLite`？（D8）
2. `-race` 报告长什么样，你是怎么让它消失的？（D4/D5）
3. `ctx` 从命令行传到 SQL 一共经过几层？（D6）

::q 为什么「每个 goroutine 写自己的文件」就不需要加锁？
::a 因为没有共享可变状态——各自的文件句柄、各自的 buffer，互不影响。数据竞争的必要条件是「同一内存被并发读写」，没有共享就没有竞争。设计并发时优先考虑「切分数据」而不是「加锁保护共享数据」。
::q 多个 goroutine 都出错时，为什么只返回第一个错误？
::a 因为调用方通常只关心「这次导出失败了」，返回第一个足够定位；返回全部需要聚合错误（Go 1.20 的 `errors.Join`）。但要注意用带缓冲的 errCh，否则无人接收时发送方会阻塞，造成 goroutine 泄漏。
::q 为什么 `close(errCh)` 必须在 `wg.Wait()` 之后？
::a `range errCh` 依赖 channel 关闭才退出。如果先 close，尚未发送完的 goroutine 会 panic 在已关闭的 channel 上；如果既不 close 也不 Wait，range 会永久阻塞。顺序必须是「等所有发送方结束 → 关闭 → 接收方退出」。
