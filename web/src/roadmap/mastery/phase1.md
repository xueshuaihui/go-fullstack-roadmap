<!--day 1-->
::pre 会用终端：`cd`、`mkdir`、看报错信息；知道什么是「当前目录」。
::predict go
mkdir demo && cd demo
go mod init example.com/demo
go run main.go
::ask 这个目录里**没有** main.go 时，`go run main.go` 和 `go run .` 分别报什么？两条报错的区别说明了什么？
::ans `go run main.go` 报 `stat main.go: no such file or directory`——它是**按文件**找，找不到文件就结束，不会去问「这个包在哪」。`go run .` 报 `no Go files in /.../demo`——它是**按包**找，先解析当前目录属于哪个包，再找包里的 Go 文件。记住这个区别：以后 `go build ./...` 是包级操作，`go run xxx.go` 是文件级操作，混用会出现「明明文件在，却报找不到包」的错觉。
::debug go
$ cd ~/code/ledger
$ cat main.go
package main

func main() { println("hi") }
$ go run .
go: cannot find main module; see 'go help modules'
::sym 文件明明在，`go run .` 却报找不到 main module。
::ask 缺的是什么？为什么「有 main.go」还不够？
::ans 缺 `go.mod`。Go 1.16 之后默认 module 模式：任何构建都必须先确定「模块根在哪」，`go.mod` 就是那个锚点。没有它，Go 不知道 import 路径的解析基准，所以连一个不 import 任何东西的 main 包也不肯编译。修法：`go mod init example.com/ledger`。顺带记住 `go env GOMOD`：正常应指向你的 go.mod，报 `/dev/null` 就是没在模块里。
::predict go
func main() {
    n := 42
}
::ask 这段代码 `go build .` 会成功吗？`go vet ./...` 会替你报出来吗？
::ans 不会成功，`go build` 直接失败：`declared and not used: n`。这是**编译错误**，不是 vet 的告警——Go 把「声明了没用」当硬错误，所以你连可执行文件都拿不到，`go vet` 根本没机会跑（vet 只能分析编译通过的代码）。这也解释了为什么 Go 代码里很少见到「留着以后用」的变量：不要就先删掉，暂时要保留就写 `_ = n` 显式丢弃。**编译错误和 vet 告警的区别**：前者让代码跑不起来，后者是「能跑但大概率是 bug」，比如 `fmt.Printf("%d", "str")` 格式串与参数不匹配。
::transfer
::scene 你要把入口从根目录挪到 `cmd/ledger/main.go`，模块根仍在仓库根，模块名 `example.com/ledger`。入口需要 import 你自己写的 `internal/store`。
::ask import 那一行应该怎么写？目录结构要怎么配合？
::hint 先想「import 路径 = 模块名 + 从模块根到包目录的相对路径」，再想 `internal/` 的可见性规则。
::ans 写 `import "example.com/ledger/internal/store"`。目录必须是 `<模块根>/internal/store/`，且该目录下所有文件同属一个包（`package store`）。`internal` 的特殊性：只有 `example.com/ledger` 这个前缀下的包能 import 它，外部模块 import 会被编译器拒绝——这是语言级的封装，比命名约定可靠。
::crit 能说出 `go run main.go` 与 `go run .` 的查找范围差别，并解释为什么前者在换文件名后会失效
::crit `go env GOMOD` 指向当前项目的 go.mod，删掉 go.mod 后能立刻判断出错误原因
::crit 能在 3 分钟内从零建出一个可 `go run .` 的模块，且 `go vet ./...` 无输出
::crit 能解释 module path、目录路径、import path 三者的对应关系，并举出 `internal/` 的可见性边界

<!--day 2-->
::pre 知道 `int`/`float64`/`string`/`bool` 是什么；写过至少一门语言的变量声明。
::predict go
var a int32 = 100
var b int64 = 200
fmt.Println(a + b)
::ask 这段能编译吗？如果不能，报错信息长什么样？
::ans 不能：`invalid operation: a + b (mismatched types int32 and int64)`。Go **没有任何隐式数值转换**，哪怕 int32 和 int64 在 64 位机器上宽度一样也不行。必须显式写 `int64(a) + b`。这条规则一开始很烦，但它挡住了 C 里那一整类「静默截断」的 bug。
::predict go
var x float64 = 0.1
var y float64 = 0.2
fmt.Println(x + y)
fmt.Println(x + y == 0.3)
::ask 第二行输出 true 还是 false？为什么？
::ans 输出 `0.30000000000000004` 和 `false`。0.1、0.2 在二进制浮点里无法精确表示，相加后与字面量 0.3 的近似值不相等。**这就是金额不能用 float64 的理由**：`35.5 * 100` 会得到 `3549.9999999999995`，`int64()` 截断成 `3549`，少一分。账本从第一天起就用 `int64` 存「分」。
::debug go
func main() {
    var s string
    s = nil
    fmt.Println(len(s))
}
::sym 编译报错：`cannot use nil as string value in assignment`。
::ask 如果确实需要一个「可能不存在」的字符串，应该用什么类型？零值又是什么？
::ans 用 `*string`（零值 nil）或 `sql.NullString`，而不是给 string 赋 nil。要理解的是：**Go 的每种类型都有确定的零值**——string 是 `""`、int 是 0、指针/切片/map/接口是 nil。`var s string` 之后 `len(s)` 完全合法，返回 0。不要带着「未初始化」的直觉写 Go，它没有未定义值。
::transfer
::scene 前端传来金额 35.5 元，接口约定用「分」的整数。你的同事写了 `int64(in.Amount * 100)`。
::ask 找出这行的两个问题，并给出正确写法。
::hint 一个是精度，一个是「谁负责乘 100」的契约归属。
::ans 问题一：`35.5 * 100 = 3549.9999999999995`，截断后 3549，少一分。问题二：让浮点进入服务端就已经违约了——接口应该直接收 `amount_cents` 整数。如果必须收元，用 `math.Round(in.Amount*100)` 再转，但更好的做法是前端算好分再传，服务端只做 `if cents <= 0` 的校验。**能不让浮点进门，就别让它进门。**
::crit 能写出 `int32` 与 `int64` 相加时的两种修法，并说明为什么 Go 选择不做隐式转换
::crit 能当场演示 `0.1+0.2 != 0.3`，并说出这与「金额存分」的因果关系
::crit 能列出 string / int / slice / map / 指针 / 接口 六种类型的零值
::crit 写的任何金额相关代码里没有 float64

<!--day 3-->
::pre 用过数组或列表；知道「下标从 0 开始」。
::predict go
s := []int{1, 2, 3, 4, 5}
a := s[1:3]
a[0] = 99
fmt.Println(s)
::ask 输出什么？`a` 的长度和容量各是多少？
::ans 输出 `[1 99 3 4 5]`——切片不复制数据，`a` 和 `s` 共享同一个底层数组，改 `a[0]` 就是改 `s[1]`。`len(a)=2`，`cap(a)=4`（从下标 1 到原数组末尾）。**切片是「数组的窗口」，不是「数组的一份拷贝」**，这是 Go 里最容易被误解的一处。
::predict go
s := make([]int, 0, 2)
s = append(s, 1, 2)
p := s
s = append(s, 3)
p[0] = 100
fmt.Println(s[0], p[0])
::ask 输出什么？为什么 `p[0]=100` 没有改到 `s[0]`？
::ans 输出 `1 100`。第一次 append 后 len=2 cap=2，再 append 第 3 个元素时容量不够，Go **分配了新数组**并把旧数据拷过去，`s` 指向新数组，`p` 还指着旧数组。于是 `p[0]=100` 只改旧数组，`s[0]` 仍是 1。**任何一次 append 都可能让之前持有的切片「脱钩」**——这就是为什么函数返回切片要连 err 一起返回，而不是靠外部持有的旧切片观察结果。
::debug go
func addOne(s []int) {
    s = append(s, 1)
}
func main() {
    s := make([]int, 0, 4)
    addOne(s)
    fmt.Println(len(s))
}
::sym 输出 `0`，明明在函数里 append 了。
::ask 为什么？两种修法分别是什么？
::ans 因为切片是**值传递**：传进去的是 `{ptr, len, cap}` 三个字段的副本，函数内 append 改的是副本的 len，调用方的 len 不变（底层数组确实可能被写了，但 len 没变所以看不见）。修法一：返回新切片 `func addOne(s []int) []int`，调用方 `s = addOne(s)`。修法二：传 `*[]int`。**只要函数可能改变长度，就必须把切片返回出去**，这是硬规则。
::transfer
::scene 你要读 10 万条账目做 CSV 导出，一开始写 `var out []Entry` 然后循环 append。
::ask 这行有什么性能问题？怎么改？改完大概省多少次内存分配？
::hint 想想 append 扩容的倍数，以及「已知总量」这个信息能换来什么。
::ans `var out []Entry` 的 cap 是 0，前几次 append 会按 1→2→4→8… 反复扩容并拷贝，10 万条大约触发 17 次扩容、累计拷贝约 20 万次元素。已知行数时直接 `out := make([]Entry, 0, n)` 一次分配到位，扩容次数降为 0。如果行数未知，退一步用 `make([]Entry, 0, 1024)` 给个合理起点。「**预分配容量**」是 Go 里性价比最高的优化之一，写循环前先问自己：我知道大概多少个吗？
::crit 能画出 `s[1:3]` 之后两个切片的 ptr/len/cap 三元组，并解释为什么改一个会影响另一个
::crit 能构造出「append 后旧切片看不到新元素」的最小例子
::crit 知道函数内 append 必须返回新切片，并能说明 len 是值传递
::crit 循环 append 前会先判断能否预分配容量

<!--day 4-->
::pre 用过哈希表 / 字典；知道什么是键值对。
::predict go
m := map[string]int{"a": 1, "b": 2, "c": 3}
for k := range m {
    fmt.Print(k)
}
::ask 连跑三次，输出顺序一样吗？为什么？
::ans 不一样，**Go 故意让 map 遍历顺序随机化**。原因不是实现偷懒，而是防止程序依赖顺序：一旦有人写出「按遍历顺序取第一个」，在 map 扩容后行为就会变，这类 bug 极难复现。所以语言层面直接把顺序打散，逼你显式排序。要稳定输出就取出 key 排序：`sort.Strings(keys)`。
::predict go
var m map[string]int
m["a"] = 1
::ask 运行结果是什么？和 `m := map[string]int{}` 有什么区别？
::ans panic：`assignment to entry in nil map`。`var m map[string]int` 只声明不分配，零值是 nil，nil map 可以读（返回零值）、可以 `range`（零次）、可以 `len`（0），但**不能写**。`map[string]int{}` 是空 map，已分配，可写。这个区别在「结构体里的 map 字段忘了初始化」时最容易踩：`type T struct{ M map[string]int }`，`t.M["x"]=1` 直接 panic。
::debug go
s := "héllo"
fmt.Println(len(s))
fmt.Println(s[1])
::sym 输出 `6` 和 `195`，而你以为字符串是 5 个字符、第二个字符是 é。
::ask 为什么？要按「字符」处理应该怎么做？
::ans `len(s)` 返回**字节数**，é 在 UTF-8 里占 2 字节，所以是 6。`s[1]` 取的是第 2 个**字节**（0xC3），打印成数字 195；如果按 `%c` 打印会得到乱码。按字符处理要转 `[]rune(s)`（得到 5 个 rune），或 `for i, r := range s`（i 是字节偏移，r 是 rune）。「**长度**」在 Go 里默认指字节，涉及中文/emoji 时必须主动切换到 rune。
::transfer
::scene 账本的备注字段要限制「最多 50 个字」，你写了 `if len(note) > 50 { return err }`。
::ask 这行对中文用户意味着什么？怎么改才对？
::hint 一个汉字在 UTF-8 里占几个字节？
::ans 一个常用汉字 3 字节，所以 `len > 50` 实际只允许 16 个汉字，用户会觉得「明明没超」。正确写法：`if utf8.RuneCountInString(note) > 50`，或者先 `[]rune(note)` 再判 len。如果产品要的是「显示宽度」（中文算 2），还得再算一层。**凡是给用户看的长度限制，都不能用字节数。**
::crit 写出「遍历同一 map 两次、打印顺序不同」的程序，再用 `sort.Strings` 改成稳定输出
::crit 列出 nil map 能做的三件事（读、`len`、`range`）和唯一不能做的事（写），并跑一次验证写会 panic
::crit 遇到中文/emoji 会主动区分 byte 与 rune，并能写出 rune 计数的写法
::crit 用 `for i, c := range "中文a"` 打印出 `i` 是 0/3/6 而不是 0/1/2

<!--day 5-->
::pre 知道函数、参数、返回值；理解「引用」和「值」的粗略区别。
::predict go
type Counter struct{ n int }
func (c Counter) Inc() { c.n++ }
func main() {
    c := Counter{}
    c.Inc()
    fmt.Println(c.n)
}
::ask 输出什么？
::ans 输出 `0`。值接收者拿到的是**结构体的副本**，`c.n++` 改的是副本。改成 `func (c *Counter) Inc()` 才输出 1。判断规则很简单：**方法要不要改到原对象？要改就用指针接收者**。但更隐蔽的是「结构体较大时值接收者会复制」——一个 200 字节的结构体每次调用都拷 200 字节。
::predict go
type Counter struct{ n int }
func (c *Counter) Inc() { c.n++ }
func main() {
    var c *Counter
    c.Inc()
}
::ask 这段会 panic 吗？
::ans 会 panic：`invalid memory address or nil pointer dereference`。指针接收者的方法里解引用 `c.n`，c 是 nil 就直接炸。**这提醒一件事：指针接收者的方法不检查 nil**，调用前必须保证指针非 nil。对比：值接收者的方法对 nil 指针调用会先解引用再拷贝，同样 panic。
::debug go
type User struct{ Name string }
func (u *User) Rename(n string) { u.Name = n }
func main() {
    m := map[string]User{"a": {Name: "old"}}
    m["a"].Rename("new")
}
::sym 编译错误：`cannot call pointer method on m["a"]` / `cannot assign to struct field m["a"].Name`。
::ask 为什么？两种修法分别是什么？
::ans 因为 map 的元素**不可寻址**：`m["a"]` 不是变量，只是一个值，取不到它的地址，所以调不了指针方法。修法一：存指针 `map[string]*User`（推荐，改的是同一个对象）。修法二：取出→改→放回 `u := m["a"]; u.Rename("new"); m["a"] = u`（注意这是复制后放回）。同理 `[]User` 的元素是**可寻址**的，`s[0].Rename()` 合法——这个差异经常会咬人。
::transfer
::scene 你有一个 `Entry` 结构体（约 120 字节，含 4 个 string 字段），要给 `internal/ledger` 包定义一组方法：`Validate()`、`AmountYuan() string`、`Normalize()`（把分类去空格、日期补零）。
::ask 哪些用值接收者、哪些用指针接收者？给出判断理由。
::ans `Validate()` 和 `AmountYuan()` 用值接收者：只读、不修改，值接收者对调用方零副作用，还能被并发安全地调用。`Normalize()` 必须用指针接收者：它要改原对象。经验规则：**默认值接收者，需要修改时才用指针**；但如果结构体很大（比如 > 64 字节）且调用频繁，即便只读也考虑指针接收者省拷贝。同一个类型的方法集最好统一——混用会让「值能否满足某个接口」变得难以推理。
::crit 能写出值接收者修改无效的最小复现，并解释副本语义
::crit 知道 map 元素不可寻址、slice 元素可寻址，能各举一个会编译失败的例子
::crit 能对一组方法逐个判定该用值还是指针接收者，并说出理由
::crit 理解「指针接收者的方法不判 nil」，调用前会检查

<!--day 6-->
::pre 见过 `if err != nil`；知道函数可以返回多个值。
::predict go
var ErrNotFound = errors.New("not found")
func find(id int) error {
    return fmt.Errorf("find %d: %w", id, ErrNotFound)
}
func main() {
    err := find(1)
    fmt.Println(errors.Is(err, ErrNotFound))
    fmt.Println(err == ErrNotFound)
}
::ask 两行分别输出什么？
::ans `true` 和 `false`。`%w` 把底层错误**包**进新错误，`errors.Is` 会沿链逐层 `Unwrap` 比较，所以能找到；`==` 只比最外层，包装后的错误已经不是 `ErrNotFound` 本身了。**这正是必须用 `errors.Is` 而不能用 `==` 的原因**——只要有人在中间包了一层，`==` 就失效。
::predict go
func f() error {
    var e *MyErr
    return e
}
func main() {
    err := f()
    fmt.Println(err == nil)
}
::ask 输出 true 还是 false？
::ans 输出 `false`。这是个经典陷阱：`e` 是 nil 指针，但返回成 `error` 接口后，接口的「类型」部分非 nil（是 `*MyErr`），「值」部分是 nil，整体不等于 nil。**返回具体类型指针时，nil 指针不等于 nil 接口**。修法：`if e == nil { return nil }`，或者返回 `error` 类型变量而不是具体指针。
::debug go
rows, err := db.Query("select id from entries")
if err != nil { return err }
for rows.Next() {
    var id int64
    if err := rows.Scan(&id); err != nil { return err }
}
return nil
::sym 偶尔会漏掉最后一批数据，或者在数据库断开时「看起来正常但数据不全」。
::ask 这段漏了什么？为什么它不会报错？
::ans 漏了 `rows.Err()`。`for rows.Next()` 返回 false 有两种原因：正常遍历完，或者中途出错。只看循环退出是分辨不出来的，必须 `return rows.Err()` 才能把遍历期的错误带出来。另外 `defer rows.Close()` 也没写——虽然 Next 耗尽会自动关，但提前 return 时不会。**`rows.Next()` 循环后检查 `rows.Err()` 是硬性要求，不是可选项。**
::transfer
::scene Service 层要区分「账目不存在」「无权访问」「数据库故障」三种情况，handler 要分别映射成 404 / 403 / 500。
::ask 用 sentinel error、自定义 error 类型、还是字符串匹配？给出你的方案和理由。
::ans 用 sentinel + 自定义类型组合：`ErrNotFound`/`ErrForbidden` 用 sentinel（`errors.New`），数据库错误原样包装 `fmt.Errorf("get entry: %w", err)`。handler 里用 `errors.Is(err, ErrNotFound)` 判断，而不是 `strings.Contains(err.Error(), "not found")`——字符串匹配在改文案时会静默失效。如果需要带字段（比如哪个字段校验失败），再定义 `type ValidationError struct{ Field, Msg string }` 实现 `Error()`，用 `errors.As` 取出。**错误分类靠类型和哨兵值，绝不靠字符串。**
::crit 能解释 `%w` 与 `%v` 的区别，并演示 `errors.Is` 在多层包装后仍为 true
::crit 能复现「nil 指针不等于 nil 接口」并说出修法
::crit 写任何 `rows.Next()` 循环都会跟 `defer rows.Close()` 和 `rows.Err()`
::crit 错误分类只用 `errors.Is` / `errors.As`，代码里搜不到 `strings.Contains(err.Error()`

<!--day 7-->
::pre 知道什么是方法集；写过至少一个带方法的类型。
::predict go
type Reader interface{ Read() string }
type File struct{}
func (f *File) Read() string { return "data" }
func main() {
    var r Reader = File{}
    _ = r
}
::ask 能编译吗？
::ans 不能：`File does not implement Reader (method Read has pointer receiver)`。指针接收者的方法属于 `*File` 的方法集，不属于 `File`。所以 `*File` 实现了 Reader，`File` 没有。这条规则直接决定了「你该传值还是传指针」：**只要接口方法里有一个是指针接收者，就必须用指针去满足接口。**
::predict go
type Stringer interface{ String() string }
type T struct{}
func (T) String() string { return "t" }
var _ Stringer = (*T)(nil)
::ask 最后一行合法吗？它运行时会不会 panic？
::ans 合法，且不会 panic。`(*T)(nil)` 是「类型为 *T、值为 nil」的指针，`*T` 的方法集包含值接收者的方法，所以满足 Stringer。编译期断言 `var _ Stringer = (*T)(nil)` 只检查类型，不求值。这是 Go 里最常用的**编译期接口断言技巧**，写在包级别，实现漏了方法编译就挂。
::debug go
type Store interface {
    Save(e Entry) error
}
type memStore struct{ m map[int64]Entry }
func (s *memStore) Save(e Entry) error { s.m[e.ID] = e; return nil }
func main() {
    var s Store = memStore{m: map[int64]Entry{}}
    _ = s
}
::sym 编译错误：`memStore does not implement Store`。
::ask 为什么？改哪一处最小？
::ans `Save` 是指针接收者，只有 `*memStore` 满足接口，`memStore{}` 不满足。最小改动是把 `&memStore{...}` 传进去（或将方法改为值接收者，但那样 map 字段虽能改，结构体本身复制仍可能出问题）。**记住：构造函数返回接口时，一定要返回指针**：`func NewStore() Store { return &memStore{...} }`。
::transfer
::scene 你的 `Service` 需要一个「按月份查账目」的能力，当前依赖具体的 `*SQLiteStore`。你想让 `Service` 可测试（用内存实现替换）。
::ask 接口应该定义在哪个包？方法签名怎么写？为什么不在 store 包里定义？
::hint Go 的谚语：接口由使用方定义，而不是实现方。
::ans 接口定义在**使用方**（`internal/ledger`），因为只有使用方知道自己需要哪些方法。签名用领域类型而不是 SQL 类型：`ListByMonth(ctx context.Context, userID int64, month string) ([]Entry, error)`，不要出现 `*sql.Rows`。如果在 store 包定义，使用方就被迫依赖 store 包，实现方新增方法还会撑大接口。「**接口属于调用者**」是 Go 与 Java 最大的差异之一，它让依赖方向始终指向内层。
::crit 能说出值接收者与指针接收者的方法集差异，并写出编译失败的例子
::crit 会在包里写 `var _ Interface = (*T)(nil)` 做编译期断言
::crit 能解释为什么接口定义在使用方，并举出「定义在实现方会怎样变糟」的具体后果
::crit 接口方法签名里不出现具体存储类型（`*sql.Rows`、`*gorm.DB`）

<!--day 8-->
::pre 知道函数调用栈；见过 panic 的堆栈输出。
::predict go
func f() (n int) {
    defer func() { n++ }()
    return 10
}
func main() { fmt.Println(f()) }
::ask 输出什么？
::ans 输出 `11`。`return 10` 分两步：先把 10 赋给命名返回值 n，再执行 defer，最后返回。defer 里 `n++` 改的是命名返回值，所以最终返回 11。**defer 能改命名返回值，这是 recover 之外唯一能「影响返回结果」的合法用法**，也常被用来做统一日志/耗时统计。
::predict go
for i := 0; i < 3; i++ {
    defer fmt.Print(i)
}
::ask 输出什么顺序？
::ans 输出 `210`。defer 是**后进先出**的栈，且**参数在 defer 语句执行时就求值**——所以打印的是当时 i 的副本 0/1/2，只是按逆序执行。如果写成 `defer func(){ fmt.Print(i) }()`，输出会是 `333`，因为闭包捕获的是变量本身，执行时 i 已经是 3。「**defer 的参数立即求值，闭包捕获变量**」这句话能解决 90% 的 defer 困惑。
::debug go
func safeDiv(a, b int) (r int) {
    defer func() {
        if err := recover(); err != nil {
            log.Println("recovered:", err)
        }
    }()
    return a / b
}
func main() {
    fmt.Println(safeDiv(1, 0))
}
::sym 没有 panic，但输出是 `0`，而且调用方完全不知道除零发生了。
::ask 这段「吞掉」了什么？正确的做法是什么？
::ans 吞掉的是错误语义：recover 之后函数正常返回，命名返回值 r 还是 0，调用方以为算出了 0。正确做法是让 recover 把 panic 转成 error：在 defer 里给命名返回值赋一个错误（需要签名有 error），或者干脆不要用 recover 兜业务错误——**除零这种可预判的情况应该显式 `if b == 0 { return 0, ErrDivByZero }`**。recover 只应该出现在「进程不能死」的边界：HTTP 中间件、goroutine 入口。
::transfer
::scene 你在一个 HTTP 服务里给每个 handler 套了 `defer func(){ recover() }()`，想「防止任何 panic 导致进程退出」。
::ask 这个做法能兜住所有 panic 吗？有哪些情况它兜不住、也不该兜？
::hint 想想 panic 发生在别的 goroutine 会怎样，以及 data race 导致的崩溃。
::ans 兜不住三类：① **其他 goroutine 里的 panic**——recover 只对当前 goroutine 有效，handler 里 `go func(){...}()` 内部 panic 仍会杀进程，所以每个自起的 goroutine 入口都要自己的 recover；② **runtime 级致命错误**——并发写 map、栈溢出、OOM 这些是 fatal error，recover 无效；③ 不该兜的：recover 后如果状态已经不一致（比如事务写到一半），继续服务只会造成数据损坏。正确做法：recover 只做「记日志 + 返回 500 + 把请求标记为失败」，不做「假装没事继续跑」。
::crit 能解释 defer 参数立即求值 vs 闭包捕获变量的差异，并各写出一个例子
::crit 会用 defer 修改命名返回值，并说清它为什么合法
::crit 知道 recover 只对当前 goroutine 有效，会在每个 goroutine 入口单独兜
::crit 能列出三类 recover 兜不住的致命错误

<!--day 9-->
::pre 知道「表」「行」「列」；能看懂 `SELECT * FROM t`。
::predict sql
CREATE TABLE entries (
  id INTEGER PRIMARY KEY,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL
);
INSERT INTO entries (amount, category, date) VALUES (3550, '餐饮', '2026-10-19');
INSERT INTO entries (amount, category, date) VALUES (NULL, '交通', '2026-10-19');
::ask 第二条 INSERT 会成功吗？
::ans 失败：`NOT NULL constraint failed: entries.amount`。SQLite 默认**强制** NOT NULL（这点和某些数据库的宽松默认不同）。要允许空值得显式去掉 NOT NULL。设计表时的判断：这个字段「业务上允许不知道吗」——金额不允许，所以 NOT NULL 是正确约束，能在写入时就挡住脏数据。
::predict sql
SELECT * FROM entries WHERE date LIKE '2026-1%';
::ask 这会查出哪些月份？有什么风险？
::ans 会查出 `2026-1`、`2026-10`、`2026-11`、`2026-12` 全部——因为 `LIKE '2026-1%'` 是**前缀匹配**，`2026-10-19` 也以 `2026-1` 开头。这就是「月份参数不校验」的经典事故：用户传 `month=2026-1`，统计结果翻四倍，接口还返回 200。正确做法：参数必须匹配 `^\d{4}-\d{2}$`，查询用半开区间 `date >= '2026-10-01' AND date < '2026-11-01'`。
::debug sql
SELECT category, SUM(amount) FROM entries
WHERE date LIKE '2026-10%'
GROUP BY category
::sym 结果里出现一个 `category` 为空的行，前端显示成一个没有名字的分类。
::ask 空分类是怎么产生的？两种处理方式分别是什么？
::ans 历史数据里 `category` 存了空字符串（或 NULL）。`GROUP BY` 把空值当成独立一组。处理方式一：建表时 `category TEXT NOT NULL DEFAULT '未分类'`，从源头杜绝；方式二：查询时 `CASE WHEN category IS NULL OR category = '' THEN '未分类' ELSE category END`。**别让空分类流到前端**——那是把数据质量问题转嫁给用户，而用户无法修复它。
::transfer
::scene 你要给 `entries` 加索引，加速「某用户某月按日期倒序」的查询：`WHERE user_id = ? AND date >= ? AND date < ? ORDER BY date DESC, id DESC`。
::ask 索引该建哪几列、什么顺序？为什么不是 `(date, user_id)`？
::hint 联合索引的最左前缀原则，以及 ORDER BY 能不能直接吃到索引顺序。
::ans 建 `CREATE INDEX idx_entries_user_date ON entries(user_id, date DESC, id DESC)`。理由：等值条件 `user_id` 放最左，范围条件 `date` 放其后，`id` 作为同一天多条的稳定次序兜底。如果写成 `(date, user_id)`，`user_id` 的等值过滤就用不上最左前缀，只能靠 date 范围扫描再回表过滤。**联合索引顺序 = 等值列在前、范围列在后、排序列尽量跟上**，这一条能覆盖大部分账本查询。
::crit 能解释 NOT NULL 在写入时挡住什么，并举一个「不加约束导致脏数据」的例子
::crit 能现场演示 `LIKE '2026-1%'` 的多匹配问题，并写出半开区间写法
::crit 会给账本建 `(user_id, date)` 联合索引，并说明列顺序的理由
::crit 知道 `GROUP BY` 会把 NULL/空串单独成组，并能写出兜底分类

<!--day 10-->
::pre 会写 `CREATE TABLE` 和基本 `SELECT`；知道什么是数据库驱动。
::predict go
import _ "modernc.org/sqlite"

db, err := sql.Open("sqlite", "ledger.db")
if err != nil {
    log.Fatal(err)
}
fmt.Println("connected")
::ask 这段能证明数据库真的连上了吗？
::ans 不能。`sql.Open` **不建立任何连接**，它只校验参数、创建连接池对象，第一次真正执行查询时才拨号。所以 DSN 写错、文件路径不可写、目录不存在，`sql.Open` 全都返回 nil error，「connected」照常打印。要验证必须 `db.Ping()`。**`sql.Open` 的 err 只代表「参数非法」，不代表「连得上」**，这是新手最容易误判的一处。
::predict go
db.SetMaxOpenConns(1)
db.SetMaxIdleConns(1)
// goroutine A: 开事务，写一条，然后 sleep 2s 再 commit
// goroutine B: 同时执行一条普通 INSERT
::ask B 会怎样？
::ans B 会**阻塞等待**，直到 A 提交或回滚。因为最大连接数是 1，A 的事务独占那唯一连接，B 拿不到连接就排队（受 context 超时约束）。这在 SQLite 下是「正确的疼」：SQLite 只允许一个写者，用 1 个连接能彻底避免 `SQLITE_BUSY`，代价是写操作串行化。**家庭账本这个量级，串行写完全够用；不要为了「并发」把 MaxOpenConns 调到 10，那只会换来随机 BUSY 错误。**
::debug go
db, _ := sql.Open("sqlite", "file:ledger.db?cache=shared")
db.SetMaxOpenConns(10)
// 多个 goroutine 并发 INSERT
::sym 偶发 `database is locked (5) (SQLITE_BUSY)`，重试有时成功有时失败。
::ask 根因是什么？三种修法各自代价如何？
::ans 根因：SQLite 同一时刻只允许一个写事务，多个连接并发写就会撞锁，默认 busy_timeout 很短（modernc 驱动默认为 0），撞上立刻返回 BUSY。修法一：`SetMaxOpenConns(1)`，写串行化，零 BUSY，代价是写吞吐受限（推荐）。修法二：DSN 加 `_pragma=busy_timeout(5000)`，让驱动等 5 秒而不是立刻失败，但高并发下仍会超时。修法三：开 WAL（`_pragma=journal_mode(WAL)`）+ 写池 1 连接 + 读池多连接，兼顾读并发。**先上修法一，需要读并发再上修法三，别一上来就调连接数。**
::transfer
::scene 你的服务启动时 `sql.Open` 成功，但第一次请求就报 `unable to open database file`。
::ask 列出你会依次排查的四个点，以及各自怎么验证。
::hint 从「路径是相对谁的」开始想，再想权限和目录。
::ans ① **工作目录**：DSN 里的相对路径是相对进程 CWD，不是二进制所在目录。用 `os.Getwd()` 打印，或直接改成绝对路径（推荐）。② **目录是否存在**：SQLite 会创建文件，但不会创建父目录，`data/ledger.db` 在 `data/` 不存在时直接失败。③ **写权限**：`ls -ld` 看目录属主，非 root 运行而目录属 root 会失败。④ **文件是否被别的东西占着/只读**：`ls -l` 看权限位。验证顺序就是从「路径 → 存在 → 权限 → 占用」，一步一打印，别靠猜。
::crit 能解释 `sql.Open` 为什么不连库，并坚持用 `PingContext` 验证
::crit 知道 SQLite 默认 `MaxOpenConns(1)` 的理由，能说出调大的具体风险
::crit 能复现 `SQLITE_BUSY` 并给出三种修法及代价
::crit 配置数据库路径时会用绝对路径，并解释相对路径的依赖

<!--day 11-->
::pre 会写 `SELECT`；知道 Go 里 `&x` 是取地址。
::predict go
var name string
var age int
err := db.QueryRow("SELECT name, age FROM users WHERE id = ?", 1).Scan(&age, &name)
::ask 如果表里是 `name='a', age=18`，能正确扫出来吗？
::ans 不能。`Scan` 严格按**列顺序**填充，顺序反了就会把 `name`（字符串）扫进 `age`（int），报 `converting string to int: invalid syntax` 之类。SQLite 是动态类型，甚至可能不报错而是静默塞进奇怪的值。**`Scan` 的参数顺序必须与 SELECT 列顺序逐一对齐**，这是不会编译报错、只能靠人眼保证的一类 bug。写法上建议 `SELECT` 显式列名而不是 `SELECT *`，改表结构时至少能看见。
::predict go
rows, err := db.Query("SELECT id, note FROM entries")
if err != nil { return err }
defer rows.Close()
for rows.Next() {
    var id int64
    var note sql.NullString
    if err := rows.Scan(&id, &note); err != nil { return err }
    fmt.Println(id, note.String)
}
::ask `note` 为什么用 `sql.NullString` 而不是 `string`？
::ans 因为 `note` 列可能为 NULL，而 `*string`/`string` 扫 NULL 会报 `converting NULL to string is unsupported`。`sql.NullString{String, Valid}` 能区分「空字符串」和「NULL」。如果业务上「NULL 等价于空串」，也可以用 `COALESCE(note, '')` 在 SQL 里抹平——**但要想清楚：空串和 NULL 在你的业务里真的等价吗**？账本备注里「用户没填」和「用户填了空」其实没区别，用 COALESCE 更省事。
::debug go
stmt, _ := db.Prepare("INSERT INTO entries(amount) VALUES (?)")
for i := 0; i < 3; i++ {
    stmt.Exec(i)
}
db.Close()
::sym 进程退出前有连接/语句泄漏告警，或者高频插入时句柄数持续上涨。
::ask 缺了什么？`stmt` 和 `rows` 的关闭责任分别是谁的？
::ans 缺 `defer stmt.Close()`。规则：**谁创建的谁关闭**——`db.Prepare` 出来的 `*Stmt` 要自己 Close，`db.Query` 出来的 `*Rows` 要自己 Close，`db.QueryRow` 不需要（内部已处理）。另外 `stmt.Exec` 的 error 也没检查。如果不关闭 Stmt，它持有的底层连接可能一直不归还，最终耗尽连接池。`defer` 放在 `Prepare` 成功之后立刻写，别拖到函数末尾才想起来。
::transfer
::scene 你要批量导入 5000 条账目，同事写了「循环里每次都 `db.QueryRow("SELECT id FROM entries WHERE ...")` 判重，没有就 INSERT」。
::ask 这个做法有几个问题？在不改业务语义的前提下怎么优化？
::hint 想想 5000 次网络/解析往返、以及「先查再插」的并发窗口。
::ans 三个问题：① **N+1 往返**，5000 次查询 + 最多 5000 次插入 = 上万次往返，SQLite 本地也要几秒到几十秒；② **先查再插有竞态**，两个并发导入会同时通过判重然后都插入；③ 每次都重新 prepare SQL，浪费解析。优化：把判重交给数据库唯一约束（`UNIQUE(user_id, date, amount, category)`），用 `INSERT ... ON CONFLICT DO NOTHING` 一条语句完成「不存在才插」；批量放在一个事务里，用 `tx.Prepare` 复用语句。「**先查再写**」几乎总是应该改成「让数据库判」。
::crit 知道 `Scan` 按列顺序填充，写查询时 SELECT 显式列名
::crit 会为可空列选 `sql.NullString` 或 `COALESCE`，并说出两者的取舍
::crit 遵守「谁创建谁关闭」，`Prepare` 后立刻 `defer stmt.Close()`
::crit 能指出「先查再插」的竞态，并改用唯一约束 + `ON CONFLICT`

<!--day 12-->
::pre 知道事务的 ACID 概念；写过 `BEGIN`/`COMMIT`。
::predict go
tx, _ := db.Begin()
tx.Exec("INSERT INTO entries(amount) VALUES (100)")
tx.Exec("INSERT INTO entries(amount) VALUES (200)")
return nil          // 忘了 Commit
::ask 这两条数据会写进去吗？
::ans 不会。没有 `Commit` 的事务在连接归还时会被回滚（`database/sql` 在 `tx` 被 GC 前若未提交，`Close` 时会 rollback）。这是「**写了但没生效**」的经典形态：代码不报错、日志正常、查询看不到。规则：`Begin` 之后立刻写 `defer tx.Rollback()`，成功路径显式 `Commit`——`Rollback` 在已提交后调用返回 `ErrTxDone`，无害。
::predict go
func create(tx *sql.Tx) error {
    if _, err := tx.Exec("INSERT ..."); err != nil { return err }
    return nil
}
// 调用方
tx, _ := db.Begin()
if err := create(tx); err != nil {
    tx.Rollback()
    return err
}
tx.Commit()
::ask 这个模式有什么问题？如果 `create` 内部 panic 呢？
::ans 问题一：`create` 拿到的是 `*sql.Tx`，没有 ctx，无法随请求取消——应该用 `BeginTx(ctx, nil)` 并把 ctx 传下去（或让 tx 由调用方在 ctx 上创建后统一管理）。问题二：panic 时既不会 Rollback 也不会 Commit，连接被占着直到 GC，高并发下会耗尽连接池。修法：`defer func(){ if p := recover(); p != nil { tx.Rollback(); panic(p) } }()`，或者更简单——**把事务边界收敛到一个函数里，用 defer 统一兜底**。
::debug go
tx, _ := db.Begin()
tx.Exec("UPDATE entries SET amount = amount - 100 WHERE id = 1")
tx.Exec("UPDATE entries SET amount = amount + 100 WHERE id = 2")
// 第二条因为 CHECK 约束失败
tx.Commit()
::sym 第二条明明失败了，但第一条的扣款却生效了，账对不上。
::ask 为什么？`Exec` 的返回值被忽略了会怎样？
::ans `Exec` 返回 `(Result, error)`，这里把 error 丢了，所以失败被静默忽略，事务照常 Commit，第一条扣款就落了库。**事务不等于自动回滚**——它只保证「要么全提交、要么全回滚」，前提是你在出错时真的调用了 Rollback。每条 `Exec` 都必须检查 error，任一失败立即 `return err` 让 defer 去回滚。这类 bug 在转账/记账场景里就是真实的资金差错。
::transfer
::scene 转账：A 扣 100、B 加 100，两条 UPDATE 必须在同一事务里。你还要在事务内查一次 A 的余额做校验。
::ask 写出这个函数的骨架（含 ctx、错误处理、defer），并说明校验查询为什么要放在事务内。
::hint 校验放事务外会有什么窗口？
::ans 骨架：
```go
func Transfer(ctx context.Context, db *sql.DB, from, to int64, cents int64) error {
    tx, err := db.BeginTx(ctx, nil)
    if err != nil { return fmt.Errorf("begin: %w", err) }
    defer tx.Rollback()

    var bal int64
    if err := tx.QueryRowContext(ctx, `SELECT balance FROM accounts WHERE id = ?`, from).Scan(&bal); err != nil {
        return fmt.Errorf("load balance: %w", err)
    }
    if bal < cents { return ErrInsufficient }

    if _, err := tx.ExecContext(ctx, `UPDATE accounts SET balance = balance - ? WHERE id = ?`, cents, from); err != nil {
        return fmt.Errorf("debit: %w", err)
    }
    if _, err := tx.ExecContext(ctx, `UPDATE accounts SET balance = balance + ? WHERE id = ?`, cents, to); err != nil {
        return fmt.Errorf("credit: %w", err)
    }
    return tx.Commit()
}
```
校验必须在事务内：放外面就是「查完到扣款之间」的窗口，另一个事务可能已经把钱花掉了（TOCTOU）。SQLite 下用 `BEGIN IMMEDIATE` 或 `UPDATE ... WHERE balance >= ?` 加条件更新更稳。「**读-判断-写**」三步必须在同一个事务里，否则判断就是过期的。
::crit 知道 `Begin` 后必须立刻 `defer tx.Rollback()`，成功路径显式 `Commit`
::crit 事务内的每条 `Exec` 都检查 error，绝不忽略
::crit 能解释「读-判断-写」为什么必须在同一事务内，并举出 TOCTOU 的后果
::crit 事务函数用 `BeginTx(ctx, ...)` 且所有语句带 `Context` 版本

<!--day 13-->
::pre 知道连接池概念；见过「连接泄漏」这个词。
::predict go
db, _ := sql.Open("sqlite", "ledger.db")
db.SetMaxOpenConns(10)
db.SetMaxIdleConns(10)
db.SetConnMaxLifetime(time.Hour)
// 服务运行 3 天后，句柄数持续上涨
::ask 连接池配置看起来很正常，为什么还会泄漏？
::ans 配置只决定「池里最多几个」，不决定「借出的会不会还」。泄漏来自**借了不还**：`rows` 没 Close、`tx` 没 Commit/Rollback、`stmt` 没 Close。每个未归还的连接都占住池里的一个位置，池满之后新请求就卡在 `db.Query` 上直到超时。**排查方法：`db.Stats()` 看 `InUse` 是否只增不减**，这是判断泄漏最快的信号。
::predict go
db.SetMaxIdleConns(0)
// 每个请求：Query → Scan → 返回
::ask 功能正常，但 QPS 上不去，为什么？
::ans `MaxIdleConns(0)` 意味着连接用完立刻关闭，下个请求要重新建连接（SQLite 本地也要打开文件、初始化页缓存）。表现为「功能对但慢」，CPU 花在反复建连上。**`MaxIdleConns` 决定复用，`MaxOpenConns` 决定上限**——两个都要设，且 Idle 通常等于或略小于 Open。默认 `MaxIdleConns` 只有 2，容易被忽略。
::debug go
rows, err := db.Query("SELECT id FROM entries")
if err != nil { return err }
for rows.Next() {
    var id int64
    rows.Scan(&id)
    if id == target {
        return nil        // 提前返回，没 Close
    }
}
::sym 请求量上来之后，服务开始大量超时，重启就恢复。
::ask 泄漏点在哪？为什么重启能恢复？
::ans 提前 `return nil` 时 `rows` 没有关闭，它占用的连接不会归还池。每次命中 target 就漏一个，池满后所有查询都在等连接。重启之所以「恢复」，是因为进程退出把所有连接释放了。修法：`defer rows.Close()` 紧跟 `Query` 之后。**任何在 `for rows.Next()` 里提前 return 的代码，都必须有 defer 兜底**——这是最容易漏的形态。
::transfer
::scene 家庭账本跑在树莓派上，SQLite 单文件。你要为它定一套连接池参数，并说清每个参数的理由。
::ask 给出 `SetMaxOpenConns` / `SetMaxIdleConns` / `SetConnMaxLifetime` 的具体值和理由。
::hint 想 SQLite 的写并发模型，以及「连接建立成本」在这台机器上有多高。
::ans 推荐 `MaxOpenConns(1)`、`MaxIdleConns(1)`、`ConnMaxLifetime(0)`（不限）。理由：SQLite 单写者，1 个连接彻底避免 BUSY，家庭并发（几个人偶尔记账）完全够；Idle 设 1 保证连接常驻复用；Lifetime 不限，因为本地文件连接没有「服务端主动断开」的问题，设短了反而增加重连开销。如果开了 WAL 且读请求明显变多，再考虑「写池 1 + 读池 N」的双池方案。**参数要为场景服务，不要抄云环境的默认值。**
::crit 会用 `db.Stats().InUse` 判断连接泄漏，并解释「只增不减」意味着什么
::crit 知道 `MaxIdleConns` 默认只有 2，会显式设置
::crit 写 `rows` 循环时 `defer rows.Close()` 紧跟 Query，提前 return 也不漏
::crit 能为 SQLite 场景说出「为什么 MaxOpenConns=1」而不是照抄云端配置

<!--day 14-->
::pre 完成 D1-D13：会建表、会增删查、会事务、会关连接。
::predict bash
go run . add -amount 35.5 -category 餐饮 -date 2026-10-19 -note 午饭
::ask `flag` 包解析 `-amount 35.5` 时，`Amount` 变量应该是什么类型？如果用 `float64`，写库前必须做什么？
::ans `flag.Float64`，但**更好的设计是 `flag.String` 收 "35.5" 然后自己 `strconv.ParseFloat` 再用 `math.Round(x*100)` 转成分**。直接 `flag.Float64` 也能用，问题是浮点误差已经在内存里了。写库前必须转成 `int64` 的分：`cents := int64(math.Round(v * 100))`，并校验 `cents > 0`。**CLI 是唯一允许接触「元」的地方，进库前必须变成分。**
::predict go
type Entry struct {
    ID       int64
    Amount   int64
    Category string
    Date     string
    Note     string
}
// list 输出
for _, e := range entries {
    fmt.Printf("%s  %s  %d\n", e.Date, e.Category, e.Amount)
}
::ask 用户看到 `3550` 会不会困惑？输出层该做什么转换？
::ans 会——用户输入 35.5，看到 3550 会以为记错了。输出层必须转回元：`fmt.Printf("%.2f", float64(e.Amount)/100)`，或更安全地用整数拼字符串 `fmt.Sprintf("%d.%02d", c/100, c%100)` 避免浮点。**存储用分、展示用元，转换只发生在边界（输入解析、输出格式化）**，中间层一律是分。这条边界一旦模糊，后期到处都要猜「这个 amount 是分还是元」。
::debug go
flag.Parse()
if flag.NArg() < 1 {
    fmt.Println("用法: ledger-cli add ...")
    os.Exit(1)
}
switch os.Args[1] {
case "add": ...
case "list": ...
default:
    fmt.Println("未知命令")
}
::sym 用户执行 `ledger-cli add -amount 10` 时，`os.Args[1]` 是 `add`；但执行 `ledger-cli -amount 10 add` 时行为诡异。
::ask 混用 `flag.Parse()` 和 `os.Args[1]` 的问题是什么？
::ans `flag.Parse()` 只解析**第一个非 flag 参数之前**的 flag。`ledger-cli add -amount 10` 里 `add` 是非 flag 参数，Parse 到这里就停了，`-amount` 根本没被解析，值还是默认 0。所以「先 Parse 再读 os.Args[1]」这个组合是错的。正确做法：先取子命令 `cmd := os.Args[1]`，再用 `flag.NewFlagSet(cmd, ...)` 为该子命令单独解析 `os.Args[2:]`。**子命令 + flag 必须用 FlagSet，不能用全局 flag**，否则参数顺序一变就静默失效。
::transfer
::scene 用户执行 `add -amount 35.5 -category 餐饮`，你要在写入前做完整校验。
::ask 列出至少 5 条校验，并说明每条失败时应该报什么、退出码是什么。
::hint 从「金额、分类、日期、备注、重复」五个维度想。
::ans ① 金额：`cents > 0`，否则 `amount must be positive`，退出码 2（用法错误）；② 分类：非空且在预置列表内（或允许自定义但要 trim），否则提示可选值；③ 日期：`time.Parse("2006-01-02")` 成功且不在未来（家庭账本记未来账没有意义），失败报格式要求；④ 备注：rune 长度 ≤ 50；⑤ 重复：同一天同金额同分类已有记录时提示「疑似重复，加 -force 强制写入」。校验全部在写库**之前**完成，不要写一半再回滚——CLI 场景没有事务必要，早失败更简单。**退出码要区分「用法错误(2)」和「运行失败(1)」**，脚本才能正确判断。
::crit `add` 和 `list` 都能跑通，数据落在 `ledger.db`
::crit 输入解析、存储、输出三处的单位转换都正确，且中间层只有「分」
::crit 子命令用独立 `FlagSet` 解析，`-amount` 放在子命令前后都不会失效
::crit 至少有 5 条入参校验，且失败时退出码能区分用法错误与运行错误

<!--day 15-->
::pre 完成 D14：`add` 能写入、`list` 能读出。
::predict sql
SELECT strftime('%Y-%m', date) AS m, SUM(amount)
FROM entries GROUP BY m ORDER BY m DESC
::ask 如果 `date` 存的是 `2026-10-19`，这个查询能正确按月汇总吗？有什么前提？
::ans 能，前提是 `date` 一律是 `YYYY-MM-DD` 定长格式。`strftime` 对不合规的字符串返回 NULL，那些行会被分到一个 NULL 组里静默丢失。**依赖字符串格式的聚合，必须保证写入侧已经规范化**——在 D14 的校验里就该挡住 `2026-10-9` 这种。更稳的做法是存 Unix 时间戳或整数 `20261019`，但家庭账本用定长字符串足够，只要写入严格。
::predict go
var total int64
err := db.QueryRow("SELECT COALESCE(SUM(amount),0) FROM entries WHERE date LIKE ?", month+"%").Scan(&total)
::ask 空月份时 `total` 是多少？如果去掉 COALESCE 呢？
::ans 有 COALESCE 时是 0；去掉后 `SUM` 返回 NULL，`Scan` 进 `int64` 会报 `converting NULL to int64 is unsupported`。**聚合函数在空集上返回 NULL，不是 0**，这是聚合查询最常见的坑。所有 `SUM`/`AVG`/`MAX` 都要考虑空集，要么 `COALESCE`，要么用 `sql.NullInt64`。
::debug bash
go run . add -amount 35.5 -category 餐饮 -date 2026-10-19
go run . add -amount 12 -category 交通 -date 2026-10-20
go run . sum -month 2026-10
# 输出 1200
::ask 期望 4750，实际 1200。最可能的三个原因是什么？按可能性排序。
::ans ① **单位错了**：`-amount 12` 可能被当成 12 分而不是 12 元，总和变成 3550+12=3562 也不对，但如果两条都被当成「元→分」转换两次或没转换，会出现 1200 这种量级（12 元=1200 分，只有第二条生效）。② **WHERE 条件漏了第一条**：比如日期比较用了 `>` 而不是 `>=`，或者 `LIKE` 拼成了 `2026-10-2%`。③ **事务没提交**：第一条写了但没 Commit，进程退出后回滚。排查顺序：先 `sqlite3 ledger.db 'select * from entries'` 看库里到底有几条、amount 是多少——**先确认数据，再怀疑代码**。
::transfer
::scene 阶段验收要求「关掉终端数据还在」。你要设计一个能在 2 分钟内跑完的验收脚本。
::ask 写出脚本的步骤（含清理），并说明每步验证的是哪个能力。
::hint 要覆盖「写入 → 进程退出 → 重新读取 → 数值正确」四件事。
::ans 
```bash
#!/usr/bin/env bash
set -euo pipefail
DB=/tmp/ledger-accept.db
rm -f "$DB" "$DB-wal" "$DB-shm"
BIN=./ledger-cli

$BIN -db "$DB" add -amount 35.5 -category 餐饮 -date 2026-10-19 -note 午饭
$BIN -db "$DB" add -amount 12 -category 交通 -date 2026-10-20
# 关键：每条命令都是独立进程，天然验证「跨进程持久化」
[ "$($BIN -db "$DB" list | wc -l)" = "2" ] || { echo "list 条数错"; exit 1; }
[ "$($BIN -db "$DB" sum -month 2026-10)" = "4750" ] || { echo "sum 错"; exit 1; }
sqlite3 "$DB" 'select count(*) from entries' | grep -qx 2 || { echo "库里条数错"; exit 1; }
echo OK
```
每步验证：add 验证写入与校验；独立进程验证持久化（内存实现过不了）；list 验证读取与排序；sum 验证聚合与单位；直查库验证「不是 CLI 自己在骗自己」。**验收脚本必须能被别人一条命令跑，且失败时明确指出哪一步错了**——这是阶段一唯一可交付的「完成证据」。
::crit `sum -month` 输出的数字与手算一致，且空月份返回 0 而不是报错
::crit 能解释 `SUM` 在空集返回 NULL 的坑，代码里有 COALESCE 或 NullInt64
::crit 验收脚本从空库开始跑，全部断言通过，且失败时能定位到具体步骤
::crit 能说出「数据在库里」和「数据在内存里」在验收上如何区分
