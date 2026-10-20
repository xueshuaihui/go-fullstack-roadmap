<!--day 1-->
::pre 知道函数调用会返回；理解「程序按顺序一行行执行」。
::predict go
for i := 0; i < 3; i++ {
    go fmt.Print(i)
}
::ask 这段一定打印 `012` 吗？
::ans 不一定，甚至可能什么都不打印。原因有三：① 每次迭代的 `i` 是同一个变量被改写，goroutine 真正执行时看到的可能是任意值（Go 1.22 起 `for` 循环变量改为每轮独立，所以现在是 0/1/2 各一份，但执行顺序仍不定）；② `main` 打印完就退出，不会等 goroutine，可能一个都没跑完；③ 输出顺序取决于调度。**`go` 只是「发起」，不保证「完成」，也不保证「按顺序」**。要让 main 等，需要 WaitGroup 或 channel。
::predict go
func main() {
    go func() { panic("boom") }()
    time.Sleep(100 * time.Millisecond)
    fmt.Println("alive")
}
::ask 输出什么？
::ans 进程直接崩掉，栈信息里写着 `panic: boom`，`alive` 不会打印。**goroutine 里的 panic 不会只死那一个 goroutine，它会终止整个进程**（除非该 goroutine 内自己 recover）。这跟很多人对「线程池」的直觉相反。所以每个 `go func(){...}` 的入口都该有自己的 `defer recover`，尤其是处理请求的 goroutine。
::debug go
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    go func() {
        defer wg.Done()
        doWork(i)
    }()
}
wg.Wait()
::sym 程序直接 panic：`sync: negative WaitGroup counter`，或者 `doWork` 收到的 i 全是 5。
::ask 缺了什么？为什么会出现负数计数？
::ans 缺 `wg.Add(5)`（或循环内 `wg.Add(1)`）。`Done()` 是 `Add(-1)`，在计数为 0 时再减就 panic。另外 `i` 在 Go 1.22 之前会被所有 goroutine 共享，全部读到循环结束后的值。修法：`wg.Add(1)` 放在 `go` 语句**之前**（不是 goroutine 内部，否则可能在 Wait 之后才 Add）；如果目标是兼容旧版本，把 `i` 作为参数传入 `go func(n int){...}(i)`。
::transfer
::scene 你要并发处理 1000 条账目的分类统计，每条独立，最后合并结果。同事写了「起 1000 个 goroutine，每个查一次库」。
::ask 这样做有什么问题？在 SQLite + MaxOpenConns(1) 下会发生什么？
::hint 想连接池的排队行为，以及 goroutine 的调度成本。
::ans 两个问题：① **1000 个 goroutine 抢 1 个数据库连接**，999 个在排队等连接，等于把并发变成了「排队 + 上下文切换开销」，总耗时比串行还长；② 内存与调度压力，虽然 goroutine 很轻（初始 2KB 栈），但 1000 个仍然没必要。正确做法：用一个固定大小的工作池（比如 4-8 个 worker 从 channel 取任务），或者干脆在 SQL 里一次 `GROUP BY` 算完——**能在数据库里聚合的，不要搬到应用层并发做**。并发的价值在于「等待 IO 时干别的」，不是「把 CPU 活拆碎」。
::crit 能解释 `go f()` 的三不保证：不保证开始、不保证完成、不保证顺序
::crit 知道 goroutine 内 panic 会杀整个进程，会在入口加 recover
::crit `wg.Add` 写在 `go` 之前，且能说出写在内部的竞态风险
::crit 能量化「1000 goroutine 抢 1 连接」为什么比串行更慢

<!--day 2-->
::pre 完成 D1：知道 goroutine 是并发执行流。
::predict go
ch := make(chan int)
ch <- 1
fmt.Println(<-ch)
::ask 输出什么？
::ans **死锁**：`fatal error: all goroutines are asleep - deadlock!`。无缓冲 channel 的发送会阻塞，直到有接收方就绪；这里发送时还没有接收方，主 goroutine 自己卡死，运行时检测到「所有 goroutine 都睡了」直接终止。必须让发送和接收在不同 goroutine：`go func(){ ch <- 1 }()`，或改用带缓冲 `make(chan int, 1)`。
::predict go
ch := make(chan int, 2)
ch <- 1
ch <- 2
ch <- 3
::ask 第三行会怎样？
::ans 阻塞（若在主 goroutine 则死锁）。缓冲为 2 的 channel 只能暂存 2 个，第三个发送必须等有人接收。**缓冲不是「无限队列」，它只是把「必须同时就绪」放宽成「允许积压 N 个」**。设缓冲的依据是「生产者和消费者的速度差有多大」，不是「越大越好」——缓冲越大，出问题时内存占用和「数据积压未处理」的隐蔽性越强。
::debug go
func worker(ch chan int) {
    for v := range ch {
        process(v)
    }
}
func main() {
    ch := make(chan int)
    go worker(ch)
    for i := 0; i < 10; i++ {
        ch <- i
    }
    // 没有 close(ch)
    time.Sleep(time.Second)
}
::ask 功能看起来正常，但 `worker` 永远不会退出。为什么？关闭责任在谁？
::ans `range ch` 只有在 channel 被 close 之后才会结束，否则永远阻塞等待。这里没人 close，worker 就永久挂着（虽然 main 退出后进程结束，但在长期运行的服务里就是 goroutine 泄漏）。规则：**由发送方关闭 channel，且只关一次**；接收方永远不要关。修法：`for` 循环结束后 `close(ch)`。另一个规则：如果多个 goroutine 都在发，就不能随便关——需要一个协调者（额外的 done channel 或 WaitGroup）来保证「所有发送者结束后才关」。
::transfer
::scene 你要实现「生产者读 CSV 的每一行 → 消费者写库」，生产者可能出错（文件损坏）。
::ask channel 只传 `Entry` 够吗？错误怎么传？给出你的设计。
::hint 想想「消费者怎么知道生产者中途失败了」，以及 close 之后还能不能读到值。
::ans 不够，需要传结果结构：`type item struct { e Entry; err error }`，或者两个 channel（`ch chan Entry` + `errCh chan error`）。更简洁的做法是发 `item`，最后一条带 `err`，消费者看到 err 就停止并上报。注意：**close 之后 channel 仍能读出剩余缓冲值**，所以「关闭」不等于「立刻结束」，消费者要先把缓冲读完（`range` 天然如此）。不要用「发送一个特殊零值表示结束」——零值可能是合法数据，必须用 close 语义。
::crit 能复现无缓冲 channel 的死锁，并说出触发条件
::crit 知道缓冲满时发送阻塞，能根据「速度差」而不是「拍脑袋」定缓冲大小
::crit 遵守「发送方 close、只 close 一次、接收方不 close」
::crit 知道 close 后仍可读完缓冲，不会用零值当结束标记

<!--day 3-->
::pre 完成 D2：会用 channel 收发。
::predict go
ch := make(chan int)
select {
case v := <-ch:
    fmt.Println("recv", v)
default:
    fmt.Println("empty")
}
::ask 输出什么？
::ans 输出 `empty`。`select` 在所有 case 都不就绪时，如果有 `default` 就立刻走 default（非阻塞）。没有 default 就阻塞等待。这是实现「尝试读一次，没有就算」的标准写法。**`default` 让 select 变成非阻塞轮询**，但要小心：放在 `for` 循环里会变成忙等，把 CPU 打满。
::predict go
ch := make(chan int, 1)
ch <- 1
select {
case v := <-ch:
    fmt.Println("got", v)
case <-time.After(time.Second):
    fmt.Println("timeout")
}
::ask 输出什么？如果两个 case 同时就绪呢？
::ans 输出 `got 1`。两个 case 同时就绪时，`select` **随机选一个**（伪随机，避免饥饿）。这条规则很重要：不能依赖 select 的优先级，需要优先级时必须显式嵌套（先非阻塞试高优先级，再阻塞等）。
::debug go
for {
    select {
    case v := <-ch:
        handle(v)
    case <-time.After(100 * time.Millisecond):
        return
    }
}
::sym 每轮循环都创建一个新的 Timer，高频运行时 GC 压力大、定时器堆积。
::ask 为什么？怎么改？
::ans `time.After` 每次调用都新建一个 `*Timer`，在循环里就是每 100ms 建一个，旧的要等触发后才被回收。高频路径应改为复用：`t := time.NewTimer(d); defer t.Stop()`，循环内 `if !t.Reset(d) { <-t.C }`（Reset 前要确保通道已排空）。**`time.After` 适合「一次性超时」，循环里必须换成可复用的 Timer**，否则就是定时器泄漏。
::transfer
::scene 一个 worker 要在「收到任务」「收到退出信号」「每 5 秒打一次心跳」三件事之间等待。
::ask 写出 select 骨架，并说明为什么不能把心跳写成 `time.Sleep`。
::hint `time.Sleep` 期间能响应退出信号吗？
::ans 
```go
ticker := time.NewTicker(5 * time.Second)
defer ticker.Stop()
for {
    select {
    case job, ok := <-jobs:
        if !ok { return }
        handle(job)
    case <-ticker.C:
        heartbeat()
    case <-ctx.Done():
        return
    }
}
```
`time.Sleep(5s)` 会让 goroutine 在这 5 秒内**完全无法响应退出信号**，优雅关闭时就要等满 5 秒。`select` 让「等待」变成「同时等三件事，谁先来处理谁」，这是 Go 并发的核心模式。**任何需要「边等边响应」的场景，都不该用 Sleep。**
::crit 知道 `select` 无就绪 case 且无 default 时阻塞，有 default 时非阻塞
::crit 知道多个 case 同时就绪时是随机选择，不依赖优先级
::crit 循环里不用 `time.After`，改用 `NewTimer`/`NewTicker` 并 Stop
::crit 能用 select 同时处理数据、心跳、取消三类事件，且不阻塞退出

<!--day 4-->
::pre 完成 D1-D3：会用 goroutine、channel、select。
::predict go
var count int
var wg sync.WaitGroup
for i := 0; i < 1000; i++ {
    wg.Add(1)
    go func() { defer wg.Done(); count++ }()
}
wg.Wait()
fmt.Println(count)
::ask 输出一定是 1000 吗？
::ans 不一定，可能小于 1000，且结果每次运行都不同。`count++` 是「读-加-写」三步，两个 goroutine 可能同时读到 100，各自加 1 写回 101，两次自增只生效一次。这就是**竞态条件（data race）**。`wg.Wait` 只保证 goroutine 都跑完了，不保证它们之间互斥。
::predict bash
go run -race main.go
::ask `-race` 会输出什么？它的检测原理是什么？
::ans 会输出 `WARNING: DATA RACE`，并给出两个冲突访问的 goroutine 栈：一个 Write at ...、一个 Write at ...，以及「共享变量在哪个地址」。原理是 **happens-before 分析**：运行时记录每次内存访问的向量时钟，若两个访问之间没有同步关系（没有锁、没有 channel 通信），就报 race。注意：**`-race` 只能报告「实际发生」的竞态**，没跑到就不报——所以测试要尽量覆盖并发路径，且 `-race` 下程序会慢 5-10 倍、内存涨 5-10 倍。
::debug go
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        shared = append(shared, i)
    }()
}
wg.Wait()
::sym `-race` 报 DATA RACE 指向 `append` 那一行，且 `shared` 长度经常小于 10。
::ask 为什么 `append` 是竞态的高发点？加 Mutex 就能解决长度问题吗？
::ans `append` 内部做三件事：读 len、写新元素、更新 len。两个 goroutine 同时 append 可能都基于同一个 len 写入同一个位置，一个覆盖另一个，于是长度短了、数据丢了。而且扩容时还会替换底层数组指针，导致并发写不同数组。加 Mutex 包住整个 `append` 能解决（必须包住，不能只包元素写入）。**凡是「读-改-写」复合操作，锁的粒度必须覆盖整个复合操作**，拆开锁就等于没锁。
::transfer
::scene 你要给 `Store` 加一层内存缓存 `map[string]*Entry`，多个 handler goroutine 会同时读写。
::ask 需要哪些锁、加在哪几处？只加一把全局锁够吗？
::hint 想想「读多写少」场景下，`sync.RWMutex` 与 `sync.Mutex` 的差别。
::ans 用 `sync.RWMutex` 保护整个 map：`Get` 用 `RLock`，`Set`/`Delete` 用 `Lock`。注意三件事：① **不能返回 map 内部指针让别人改**——`Get` 应返回副本或只读视图，否则锁外修改仍会竞态；② **锁不能覆盖耗时操作**（比如锁内发 HTTP），否则退化成串行；③ 如果只是「读多写少」且数据量小，`sync.Map` 也可以，但它的 API 用起来别扭、性能优势只在特定模式下存在，优先 RWMutex。**锁的边界是「被保护的数据」，不是「整个函数」**。
::crit 能复现 `count++` 丢失更新，并用 `-race` 看到报告
::crit 知道 `-race` 只报实际发生的竞态，且需要覆盖率
::crit 加锁覆盖整个「读-改-写」复合操作，不拆开
::crit 缓存实现里不把内部指针暴露到锁外

<!--day 5-->
::pre 完成 D4：看到过 DATA RACE 报告。
::predict go
var mu sync.Mutex
var count int
for i := 0; i < 1000; i++ {
    go func() {
        mu.Lock()
        count++
        mu.Unlock()
    }()
}
// 没有 Wait
fmt.Println(count)
::ask 加了锁，输出一定是 1000 吗？
::ans 不一定，通常远小于 1000。锁解决了「写冲突」，但没解决「等不等」——main 可能在大部分 goroutine 执行前就打印并退出。**锁保证正确性，WaitGroup 保证时序**，两件事不能互相替代。这是加锁后最常见的「以为修好了」。
::predict go
var mu sync.Mutex
func f() {
    mu.Lock()
    defer mu.Unlock()
    g()
}
func g() {
    mu.Lock()   // 再次获取同一把锁
    defer mu.Unlock()
}
::ask 调用 f 会怎样？
::ans **死锁**（`fatal error: all goroutines are asleep - deadlock!`）。`sync.Mutex` 不可重入，同一 goroutine 重复 Lock 会永久阻塞。修法：拆出不加锁的内部函数 `gLocked()`，由 f 在持锁时调用；或者重新设计锁的边界，让 g 不假设自己需要锁。「**可重入锁**」在 Go 里不存在，这是刻意设计——它逼你把临界区想清楚，而不是靠递归加锁蒙混。
::debug go
mu.Lock()
if err := doSomething(); err != nil {
    return          // 忘了 Unlock
}
mu.Unlock()
::sym 偶发死锁，重启恢复；压力测试时几乎必现。
::ask 这类 bug 的通用修法是什么？为什么它能躲过测试？
::ans 修法是 `defer mu.Unlock()` 紧跟 `mu.Lock()`，让所有返回路径都解锁。它能躲过测试是因为：只有在「doSomething 返回 err」这条路径上才漏锁，正常数据下不触发；一旦线上出现脏数据走到错误分支，锁永久泄漏，后续所有请求卡死。**`Lock` 和 `defer Unlock` 必须成对写在一起，中间不插任何代码**——这是唯一可靠的纪律。
::transfer
::scene 账本服务有一个 `statsCache`，读很频繁（每次列表都查）、写很少（只在新增账目时失效）。
::ask 用 `Mutex` 还是 `RWMutex`？给出读写两侧的具体代码，并说明一个容易写错的点。
::hint 失效操作用什么锁？「检查-失效」是不是原子？
::ans 用 `RWMutex`：读 `RLock/RUnlock`，失效 `Lock/Unlock`。易错点：「**判断缓存是否存在 → 不存在就回源 → 写回**」不是原子的，两个请求可能同时回源（缓存击穿）。要避免就得在写路径再加一层「单飞」（singleflight）或在锁内做整个回源——但锁内回源会阻塞所有读，通常不可接受。家庭账本量级可以直接接受少量重复回源，**但你要知道自己接受的是什么**。另一个易错点：失效操作用 `Lock` 而不是 `RLock`，用错编译能过、行为错。
::crit 加锁代码里 `Lock` 与 `defer Unlock` 相邻，中间无逻辑
::crit 知道 Mutex 不可重入，能复现自己锁自己的死锁
::crit 能区分「锁保证正确性」和「WaitGroup 保证时序」，两者都用
::crit RWMutex 的写路径用 `Lock`，读路径用 `RLock`，并知道「检查-写入」需要额外原子性

<!--day 6-->
::pre 完成 D1-D5：会并发、会加锁、会等。
::predict go
ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
defer cancel()
select {
case <-time.After(time.Second):
    fmt.Println("work done")
case <-ctx.Done():
    fmt.Println("timeout:", ctx.Err())
}
::ask 输出什么？`ctx.Err()` 是什么值？
::ans 输出 `timeout: context deadline exceeded`。100ms 后 ctx 被取消，`Done()` 通道关闭，select 走 ctx 分支。`ctx.Err()` 区分两种：`context.DeadlineExceeded`（超时）和 `context.Canceled`（主动取消）。**必须区分这两者**——超时是「对方太慢」，取消是「我们不需要了」，日志和重试策略完全不同。
::predict go
func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    go func() {
        time.Sleep(5 * time.Second)
        db.Exec("INSERT ...")     // 用的是全局 db，没有 ctx
    }()
    w.WriteHeader(200)
}
::ask 客户端在 1 秒后断开，这个 INSERT 还会执行吗？
::ans 会。goroutine 里用的是 `db.Exec` 而不是 `ExecContext(ctx, ...)`，ctx 根本没传下去，所以「客户端走了」这件事对写库毫无影响。结果：请求已经结束、资源已释放，后台还在写一条用户不要的数据——这就是「**取消信号没有传播**」。修法：`db.ExecContext(ctx, ...)`，并且不要在 handler 里起不受控的 goroutine（要用也要有自己的生命周期管理）。
::debug go
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
defer cancel()
for i := 0; i < 100; i++ {
    go doWork(ctx)
}
// doWork 内部：select { case <-time.After(2*time.Second): ... case <-ctx.Done(): return }
::sym 1 秒后 ctx 超时，但仍有 goroutine 在跑，甚至跑了 2 秒才结束。
::ask 为什么取消没有立刻生效？`doWork` 里该怎么写才对？
::ans `doWork` 里如果阻塞在 `time.After` 之外的**不可中断操作**（比如 `time.Sleep`、没有 ctx 的 IO、`for` 循环），ctx 取消只是关闭了一个通道，代码不检查就感知不到。`select` 只能中断「等待」，中断不了「正在执行的代码」。正确写法：所有可能阻塞的地方都要 `select` 或传 ctx；纯计算循环里要定期 `if ctx.Err() != nil { return }`。**取消是协作式的，不是抢占式的**——这一点和线程 kill 完全不同。
::transfer
::scene 你的 handler 调用 Service，Service 调用 Store，Store 执行 SQL。要在客户端断开时让 SQL 也尽快结束。
::ask ctx 要怎么一路传下去？有哪些常见的断链点？
::hint 检查每一层的函数签名里有没有 ctx，以及有没有在哪一层「换成了 Background」。
::ans 一路传：`handler` 用 `r.Context()` → `svc.Get(ctx, id)` → `repo.Get(ctx, id)` → `db.QueryRowContext(ctx, ...)`。断链点通常在这几处：① 某一层图省事写了 `context.Background()`；② 在 goroutine 里把 ctx 存进结构体，之后用的时候已经过期；③ GORM 里用了 `db.WithContext(ctx)` 但后续 `Session` 重置丢了 ctx；④ 中间件里用 `context.WithValue` 包了一层但没把父 ctx 传下去。**ctx 必须作为第一个参数显式传递，绝不存进 struct**——这是 Go 的硬约定。
::crit 能区分 `DeadlineExceeded` 与 `Canceled`，并在日志里分开处理
::crit 所有阻塞调用都接受 ctx，且 handler 用 `r.Context()` 而不是 Background
::crit 知道取消是协作式的，纯计算循环里会主动检查 `ctx.Err()`
::crit 不在结构体里存 ctx，也不用 `context.Background()` 替换已有 ctx

<!--day 7-->
::pre 完成 D1-D6；写过多个 `.go` 文件。
::predict go
// 文件 a.go
package store
func Load() int { return 1 }
// 文件 b.go 同目录
package store
func load() int { return 2 }
::ask 两个函数能在同一个包共存吗？包外能调用哪个？
::ans 能共存，名字不同（`Load` vs `load`）。包外只能调 `Load`，因为**首字母大写才是导出**。小写 `load` 是包私有的，同包其他文件可以用。注意：导出与否只看首字母是否 Unicode 大写，`_Load`、`load_` 都是私有的。这条规则简单但没有「private 关键字」的显式感，容易在重构时不小心把内部函数暴露成 API。
::predict go
// internal/store/store.go
package store
type Store struct{ db *sql.DB }
// 外部模块 example.com/other 尝试：
import "example.com/ledger/internal/store"
::ask 能 import 成功吗？
::ans 不能：`use of internal package example.com/ledger/internal/store not allowed`。`internal/` 的规则是：**只有以 `example.com/ledger` 为前缀的包能 import 它**。这让「实现细节」在编译器层面被锁住，比「文档里写请勿使用」可靠得多。项目结构里，`internal/` 放「不打算给外部用」的一切；真要对外的库才放 `pkg/`（而且很多项目干脆不用 pkg）。
::debug bash
go build ./...
# 报错：import cycle not allowed
# package example.com/ledger/internal/ledger imports example.com/ledger/internal/store
# package example.com/ledger/internal/store imports example.com/ledger/internal/ledger
::ask 循环依赖是怎么产生的？正确的依赖方向是什么？
::ans `store` 里用到了 `ledger.Entry` 这个类型，而 `ledger` 又 import `store` 拿接口——两边互相引用。修法：把**共享的类型**下沉到第三个包（比如 `internal/model`），`ledger` 和 `store` 都只依赖 `model`，形成 `store → model`、`ledger → model` 的树，而不是环。**依赖必须是有向无环图（DAG）**，一旦出现环，说明「领域类型」放错了层——通常是最底层的数据结构被放进了上层包。
::transfer
::scene 你要把单文件的 `ledger-cli` 拆成 `main` + `internal/store` + `internal/ledger` 三包。
::ask 画出依赖方向，并说明 `main` 应该依赖接口还是具体类型。
::hint 谁定义接口？main 需要知道 SQLite 吗？
::ans 依赖方向：`main → ledger → store 接口`，`store` 的 SQLite 实现反过来实现接口，在 `main` 里注入。具体说：`ledger` 包定义 `type Store interface { ... }`（使用方定义），`store` 包提供 `NewSQLite(db) *SQLite` 实现它，`main` 里 `svc := ledger.New(store.NewSQLite(db))`。`main` 只依赖 `ledger`，不知道 SQLite 存在。**这样测试 `ledger` 时用内存实现即可，`main` 是唯一需要改动的装配点**。如果 `main` 直接依赖 `*SQLite`，换存储就要改 `main` 甚至 `ledger`。
::crit 能解释「首字母大写 = 导出」，并说出 `internal/` 的可见性边界
::crit 遇到 `import cycle` 会先找「共享类型该放哪」，而不是靠拆函数硬绕
::crit 拆分后 `main` 只做装配，不知道具体存储实现
::crit 接口定义在使用方包，实现方包只提供构造函数

<!--day 8-->
::pre 完成 D7：知道三包怎么分。
::predict go
// internal/ledger/service.go
type Service struct { store Store }
func New(s Store) *Service { return &Service{store: s} }
// internal/store/sqlite.go
func NewSQLite(db *sql.DB) *SQLite { ... }
// main.go
svc := ledger.New(store.NewSQLite(db))
::ask 这里有没有循环依赖？如果 `store` 需要返回 `[]ledger.Entry`，会不会出问题？
::ans 当前没有环，因为 `store` 还没 import `ledger`。一旦 `store` 的方法签名里出现 `ledger.Entry`，`store → ledger`，而 `ledger → store`（接口），立刻成环。解决办法：`Entry` 定义在 `store` 包（数据层），`ledger` import `store` 拿类型和接口——但这样 `ledger` 依赖具体包，测试替换变难。更干净的是 `internal/model` 放 `Entry`，两边都依赖它。「**类型放哪**」决定了依赖图的形状，这是拆分时第一个要想清楚的事。
::predict go
type Store interface {
    Create(ctx context.Context, e Entry) (int64, error)
    ListByMonth(ctx context.Context, month string) ([]Entry, error)
    Sum(ctx context.Context, month string) (int64, error)
}
// 测试里
type fakeStore struct{}
func (f *fakeStore) Create(...) { ... }
::ask 这个接口设计有什么问题？随着功能增加会怎样？
::ans 问题：接口把「读」和「写」混在一起，而且方法会随需求不断膨胀（加分类、加预算、加导出…），最终每个测试的 fake 都要实现十几个方法，其中大部分用不到。更好的做法是**按使用方拆小接口**：`type Reader interface{ ListByMonth; Sum }`、`type Writer interface{ Create }`，Service 只声明自己需要的那几个。Go 的谚语是「接口越大，抽象越弱」，**小接口才可组合**。
::debug bash
go test ./... 
# internal/ledger 编译失败：
# cannot use store.NewSQLite(db) (value of type *store.SQLite) as Store value:
# 	*store.SQLite does not implement Store (wrong type for method ListByMonth)
# 	have ListByMonth(context.Context, string) ([]store.Entry, error)
# 	want ListByMonth(context.Context, string) ([]model.Entry, error)
::ask 报错说明什么？该改哪一边？
::ans 说明两边的 `Entry` 不是同一个类型——`store` 用的是自己包里的 `Entry`，接口要求 `model.Entry`。虽然字段一样，但 Go 的命名类型不Structural兼容，不会自动转换。改法：让 `store` 的方法签名统一用 `model.Entry`（import model），而不是在自己的包里再定义一份。**同一种领域实体只能有一个类型定义**，重复定义会立刻在接口边界炸出来——这其实是好事，编译器帮你发现了「两份模型」的隐患。
::transfer
::scene 重构完成后，你要证明「抽象没有漏」。
::ask 用三条 grep 命令验证 handler 里没有 SQL、Service 里没有 HTTP、Store 里没有业务规则。写出命令并说明期望结果。
::hint 找特征字符串：`sql.`、`http.`、`fmt.Sprintf("SELECT`。
::ans 
```bash
grep -rn "sql\.\|db\.Query\|db\.Exec" internal/httpapi/     # 期望：无输出
grep -rn "http\." internal/ledger/                          # 期望：无输出
grep -rn 'fmt.Sprintf("SELECT' internal/                    # 期望：无输出（防拼接 SQL）
grep -rn "net/http" internal/store/                         # 期望：无输出
```
前三条分别验证「handler 不碰 SQL」「Service 不碰 HTTP」「没有字符串拼 SQL」。第四条验证 store 不依赖 Web 层。**如果某条有输出，不要急着删，先判断它是不是「合理的例外」**——比如 handler 里出现 `http.StatusCreated` 是正常的（那是响应语义），要看的是有没有 `http.Request` 的业务处理。
::crit 拆分后 `go build ./...` 与 `go vet ./...` 全绿
::crit 依赖图无环，且能指出「共享类型放在哪个包、为什么」
::crit 接口按使用方需要拆小，fake 实现的方法数不超过 4 个
::crit 三条 grep 验证通过，或能解释每一处例外为何合理

<!--day 9-->
::pre 完成 D8：三包结构可用、测试能跑。
::predict bash
go test -race ./...
::ask `-race` 全绿说明什么？说明没有 bug 吗？
::ans 只说明「**这次执行到的代码路径上没有检测到数据竞争**」。它不证明：没有逻辑错误、没有死锁（死锁是 hang 不是 race）、没有在未覆盖的分支里藏竞态。所以 `-race` 是必要条件不是充分条件——还要有并发路径的测试覆盖（比如同时起多个 goroutine 调同一个 Service），否则 `-race` 只是在测单线程。
::predict go
func export(months []string) error {
    var wg sync.WaitGroup
    errCh := make(chan error, len(months))
    for _, m := range months {
        wg.Add(1)
        go func() {
            defer wg.Done()
            if err := writeCSV(m); err != nil {
                errCh <- err
            }
        }()
    }
    wg.Wait()
    close(errCh)
    for err := range errCh { return err }
    return nil
}
::ask 这段有问题吗？（提示：看闭包变量）
::ans 有问题：`m` 在 Go 1.22 之前被所有 goroutine 共享，全部 goroutine 可能写同一个月份（现在 1.22+ 每轮独立，但依赖语言版本是脆弱的）。显式传参更安全：`go func(month string){...}(m)`。另外 `errCh` 的缓冲设成 `len(months)` 是对的（保证不会阻塞），但如果错误很多，其实只想要第一个，可以在收到第一个后 cancel 其余——不过那需要 ctx。**并发代码里，闭包捕获循环变量是历史遗留的头号坑，显式传参永远安全**。
::debug bash
go test -race ./internal/ledger
# ok  ...  0.02s
# 但线上偶发 panic: concurrent map writes
::ask 测试全绿，线上却崩。可能的三个原因？
::ans ① **测试没覆盖并发路径**：测试是串行调用的，`-race` 自然看不到竞态；② **竞态发生在测试没触及的代码**（比如某个只在特定参数下走的分支）；③ **map 的并发写在 `-race` 下也会报**，如果没报说明那次执行确实没并发到——`concurrent map writes` 是 runtime 的致命错误，一旦触发进程直接死，且 recover 无效。排查手段：在测试里显式起 N 个 goroutine 同时打同一个方法，跑 `-race`；生产侧靠 pprof/日志定位是哪个 map。「**测试绿**」和「能并发」是两件事。
::transfer
::scene 阶段二验收要求「`-race` 报告出现过又消失」。你要留下可复现的证据。
::ask 设计一个能稳定复现竞态、并在修复后稳定消失的最小实验，写出关键代码与命令。
::hint 关键是「让两个 goroutine 真的重叠」，用 Sleep 或屏障放大窗口。
::ans 
```go
// race_demo_test.go
func TestRace(t *testing.T) {
    var count int
    var wg sync.WaitGroup
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() { defer wg.Done(); count++ }()
    }
    wg.Wait()
    _ = count
}
```
`go test -race -run TestRace -count=1 ./...` → 必出 `WARNING: DATA RACE`，栈指向 `count++`。修复：加 `var mu sync.Mutex`，`mu.Lock(); count++; mu.Unlock()`，再跑 → 无报告。证据留存方式：把两次输出各存一个文件（`race-before.txt` / `race-after.txt`），commit 到仓库。「**报告出现过又消失**」是可以被审计的事实，不是口头声明——这也是阶段二唯一的硬验收。
::crit `go test -race ./...` 全绿，且测试里真的有并发（不是串行调用）
::crit 能复现一次 DATA RACE 并留下 before/after 输出
::crit 并发代码里不靠闭包捕获循环变量，显式传参
::crit 知道 `-race` 全绿 ≠ 无 bug，能说出它覆盖不到的三类问题
