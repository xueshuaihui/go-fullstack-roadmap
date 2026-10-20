<!--day 1 | light-->
#### 今天只解决一件事
把「写 → 编 → 跑」这条链路跑通。Go 的编译产物是**单个静态二进制**：没有解释器、不依赖虚拟机、目标机器上不需要装 Go。后面所有「服务为什么在别人机器上跑不起来」的排查，都建立在你对这一点的手感上。

#### 三个命令的分工，别混着用
- `go build -o ledger .`：编译当前目录的 main 包，产出 `ledger`，**不运行**。部署时用的就是它。
- `go run .`：编译到临时目录并立刻执行，适合试错，**产物不留**。别拿它当「运行方式」，它每次都重编。
- `go install`：编译并安装到 `$GOPATH/bin`。装工具（`goose`、`govulncheck`）走这条，装完可以直接在终端敲命令名。

#### `go.mod` 不是配置文件
`go mod init ledger` 写下的 `module ledger`，是这个模块的**导入路径前缀**。包之间互相引用时写 `ledger/internal/store`，Go 按前缀解析，**不按目录相对路径**。所以改目录名不会静默改坏 import，改了就得改 import。

`go.sum` 是依赖校验和，防止别人在远端替换同名版本；两个文件都要提交，别把 `go.sum` 加进 `.gitignore`。

```go
package main

import "fmt"

func main() {
    fmt.Println("ledger")
}
```

#### 从空目录到跑起来：六条命令，逐条看清楚

下面的 `$` 是提示符，不要输入它。假设你从家目录开始。

```bash
$ mkdir -p ~/code/ledger && cd ~/code/ledger   # 建目录并进入；之后所有命令都在这里执行
$ pwd                                          # 必须打印 /Users/你的名字/code/ledger
$ go mod init ledger                           # 生成 go.mod，模块名就叫 ledger
$ cat go.mod                                   # 应看到两行：module ledger / go 1.2x
$ ls                                           # 应看到 go.mod
$ go run .                                     # 现在还没有 .go 文件，会报 no Go files
```

然后把上一段 `package main` 那三行贴进 `main.go`（用编辑器新建，不要用 `echo` 拼，容易带坏引号），再跑：

```bash
$ go run .          # ledger
$ go build -o ledger . && ./ledger   # ledger（这次产物留在磁盘上）
$ ls -lh ledger     # 能看到一个几 MB 的可执行文件
```

六条命令里最容易错的是第 3 条和第 6 条：`go mod init` 必须在**你要放代码的那个目录**里执行，跑错目录就会在别处生成 `go.mod`，然后当前目录永远报 `cannot find main module`。

#### 三个必遇的报错，先认一遍

| 你看到的 | 真正的原因 | 修法 |
| :--- | :--- | :--- |
| `go: cannot find main module` | 当前目录（或它的任何上级）没有 `go.mod` | `cd` 到有 `go.mod` 的目录，或在当前目录 `go mod init` |
| `no Go files in /.../ledger` | 目录里没有 `.go` 文件，或文件名叫 `main_test.go` | `ls` 确认有 `main.go`，且首行是 `package main` |
| `package main is not in std` / `cannot find package` | `go run` 后面跟了一个不存在的路径 | 用 `go run .`（当前包），不要写 `go run ledger` |

读报错有个固定顺序：**先看最后一行**（真正的错误类型），**再看它上面提到的文件和行号**。Go 把「谁调用谁」打印在中间，那不是错误本身。

#### 5 分钟最小验证

不用等任务，先证明工具链是活的：

```bash
$ go version && go env GOMOD && gofmt -l .
```

- `go version` 有输出 → 编译器在。
- `go env GOMOD` 打印 `.../go.mod` 的绝对路径 → 你在模块里；打印 `/dev/null` → 不在模块里。
- `gofmt -l .` 无输出 → 格式合规；输出文件名 → 跑 `gofmt -w .`。

三条都符合预期，今天的地基就算打好了，剩下三小时可以放心折腾任务。

#### 判据：四条命令全过才算跑通
```bash
go run .                          # 输出 ledger
go build -o ledger . && ./ledger  # 输出 ledger
gofmt -l .                        # 必须无输出（有输出=格式不合规）
go vet ./...                      # 必须无输出
```
`gofmt -l` 列的是「需要格式化的文件」，空输出才叫合规；`go vet` 查的是「能编译但大概率是 bug」的写法，跟风格无关。

::q `go run .` 里的 `.` 能省吗？省了会发生什么？
::a 不能省。Go 的构建命令都以**包**为参数，`.` 表示「当前目录对应的包」。省掉后 Go 不知道要构建谁，会报 `no go files in ...` 之类的错。同理 `go build ./...` 的 `./...` 表示「当前目录及其子目录下所有包」。
::q `gofmt -l .` 输出了 `main.go`，说明什么？怎么修？
::a 说明这个文件格式不合规（缩进、对齐、括号位置）。修法：`gofmt -w main.go` 直接写回，或编辑器保存时自动格式化。注意它不是「有 bug」，只是格式。
::q 为什么 `go.sum` 必须提交，而 `ledger` 这个二进制不该提交？
::a `go.sum` 记录依赖的哈希，保证不同机器拉到的是同一份依赖，属于源码的一部分。二进制是构建产物，能由源码重新生成，提交它会导致仓库膨胀、且二进制和源码可能不一致。惯例是 `.gitignore` 里写上二进制名。

<!--day 2 | core-->
#### 为什么先讲类型：这不是语法细节
Go 是静态强类型，**没有任何隐式转换**。`int` 和 `int64` 是两个完全不同的类型，`a + b` 直接编译失败。初学者会觉得这是麻烦，但它把「精度丢失」「溢出」这类问题从**运行时**提前到了**编译期**——账本这类算钱的程序，这个性质是救命的。

#### 零值：声明即可用，但不等于能用
```go
var n int        // 0
var s string     // ""
var ok bool      // false
var p *Entry     // nil
var m map[string]int // nil
```
Go 没有「未初始化」状态，每个变量一出生就有确定的零值。但零值合法 ≠ 可以操作：
- `m["a"] = 1` 对 nil map 写入 → **panic: assignment to entry in nil map**
- `p.Name` 对 nil 指针解引用 → **panic: invalid memory address**
- `s[0]` 对空字符串取下标 → **panic: index out of range**

所以「零值可用」的真正含义是：**读**是安全的，**写之前要先 make 或取地址**。

#### 转换、解析、格式化是三件事
```go
i := 42
f := float64(i)   // 42.0  显式拓宽，安全
j := int(3.9)     // 3     直接截断，不四舍五入

n, err := strconv.Atoi("42")  // 字符串 → int，可能失败
s := strconv.Itoa(42)         // int → 字符串，不会失败
u, err := strconv.ParseFloat("3.14", 64)
```
区分点：**类型转换**（`float64(i)`）在编译期完成，不会失败；**解析**（`Atoi`）处理的是外部输入，一定返回 `err`，必须检查。

#### 金额为什么从第一天就不用 float64
```go
fmt.Println(0.1 + 0.2)        // 0.30000000000000004
fmt.Println(0.1+0.2 == 0.3)   // false
```
float64 是二进制浮点，`0.1` 无法精确表示。账本要求分毫不差，两条路：用 `int64` 存「分」，或引入 decimal 库。**这个决定会在阶段五建 `Entry` 模型时兑现**，今天先建立成条件反射：看到 `float64` 算钱，就当 bug 处理。

#### 判据
```go
a, b := 3, 2
fmt.Println(a / b)          // 1，整数除法截断
fmt.Println(float64(a)/float64(b)) // 1.5
```
能解释上面两行为什么不同，今天就算过。

::q `var s []int` 之后直接 `s = append(s, 1)` 会 panic 吗？
::a 不会。nil 切片是 `len=0, cap=0`，`append` 会自动分配底层数组并返回新切片。会 panic 的是 **nil map 写入**，这两者行为不同，容易混。
::q `int(3.9)` 和 `math.Round(3.9)` 有什么区别？
::a `int(3.9)` 是类型转换，直接截断小数部分得到 3；`math.Round(3.9)` 是数学四舍五入，返回 float64 的 4。算钱时用截断会系统性少算，用四舍五入要考虑「银行家舍入」的争议——所以干脆用整数分。
::q 为什么 `strconv.Atoi` 要返回 error，而 `strconv.Itoa` 不用？
::a `Atoi` 的输入来自外部（命令行、HTTP 请求、文件），可能是 `"abc"`、`"3.9"`、`""`，必须能表达失败。`Itoa` 的输入是内存里的 int，任何 int 都能转成字符串，不存在失败路径，所以不返回 error。

<!--day 3 | core-->
#### 先看清切片是什么，再谈扩容
切片不是「数组的别名」，它是一个**三字段结构体**：

```
type slice struct {
    array unsafe.Pointer  // 指向底层数组
    len   int             // 当前长度
    cap   int             // 从 array 起可用的容量
}
```

关键结论由此推出：**切片按值传递，但三个字段里的指针指向同一块内存**。所以「传切片进函数」「切片赋值」都不会复制元素，改元素会互相看见；但 `append` 可能换一块新数组，于是两边就分家了。

#### 值语义与共享，用一段代码看清
```go
arr := [5]int{1, 2, 3, 4, 5}
s := arr[1:3]        // len=2 cap=4，指向 arr[1]

s[0] = 99
fmt.Println(arr)     // [1 99 3 4 5]  ← 改切片，数组变了

s = append(s, 7)     // cap 还有空间，原地写 arr[3]
fmt.Println(arr)     // [1 99 3 7 5]  ← 仍然影响底层数组

s = append(s, 8, 9, 10, 11)  // 超出 cap=4，重新分配
s[0] = 1
fmt.Println(arr)     // [1 99 3 7 5]  ← 这次不再影响
```
三行 `fmt.Println` 的差异，就是「共享底层数组」和「扩容后独立」的分界。**不看 cap 就猜 append 会不会影响原数组，一定会错。**

#### 两种命运：原地写 vs 重新分配
- `len < cap`：`append` 直接写 `array[len]`，`len++`，底层数组不变 → **调用方能看到这次写入**。
- `len == cap`：分配新数组（通常是 2 倍，超过 1024 元素后按 1.25 倍增长），拷贝旧元素，返回新切片 → **调用方看不到**。

所以 `f(s []int)` 里 `append` 的结果**必须返回给调用方**，否则新元素丢失，这是最常见的 bug 之一。

#### 三索引切片：控制 cap，切断共享
```go
s := arr[1:3:3]   // len=2, cap=2
s = append(s, 100) // 立刻触发重新分配，不会污染 arr[3]
```
`arr[low:high:max]` 的 `max` 决定 cap。**当你要把子切片传给不受控的代码，又不想它写坏原数组时，用三索引把 cap 卡死。**

#### 边界与坑
- `s[1:10]` 越界：上界可以到 `cap`，但 `len` 以外访问会 panic（`s[1:10]` 若 10 > cap 直接 panic）。
- 大数组切一小段长期持有 → 整块底层数组无法回收。要长期持有就 `copy` 一份出来。
- `nil` 切片和空切片 `[]int{}` 在 `len`/`append`/`range` 上行为一致，`json.Marshal` 结果不同（`null` vs `[]`）。API 返回列表时想要 `[]`，就初始化为空切片。

#### 判据
```go
s := make([]int, 0, 4)
s = append(s, 1)
fmt.Println(len(s), cap(s))  // 1 4
```
不看讲解能说出：`arr := [3]int{}; s := arr[:]; s = append(s, 9); fmt.Println(arr)` 输出什么？（答案在自测第 2 题）

::q `s := make([]int, 3)` 之后 `s[0] = 1` 会 panic 吗？`append(s, 1)` 呢？
::a `s[0]=1` 不会 panic，因为 `len=3`，三个元素都已存在（值为 0），是**可写**的。`append(s,1)` 也不 panic，会追加到第 4 位并扩容。容易混的是 `make([]int, 0, 3)`：`len=0`，这时 `s[0]=1` 就 panic 了——容量存在不代表长度存在。
::q `arr := [3]int{1,2,3}; s := arr[:]; s = append(s, 9); fmt.Println(arr)` 输出什么？
::a 输出 `[1 2 3]`。`arr[:]` 得到的切片 `len=3, cap=3`，已经满了，`append` 必须重新分配新数组，新元素写在新数组里，`arr` 一个字节都没变。如果把 `arr` 换成 `[4]int`，cap 变成 4，输出就会是 `[1 2 3 9]`。
::q 函数内 `append` 了切片但没返回，为什么调用方「有时」能看到新元素？
::a 因为能不能看到取决于**是否重新分配**：`len<cap` 时新元素写进了共享的底层数组，调用方按原 `len` 切片看不到，但如果它自己再 `append` 或直接按索引访问 cap 区间，就能读到那块内存。这种「有时能、有时不能」正是最危险的状态，所以规则必须是：**append 的结果一律返回**。

<!--day 4 | normal-->
#### map 的两个必知语义
```go
m := make(map[string]int)
v, ok := m["a"]      // v=0, ok=false —— 用 ok 区分「不存在」和「值是 0」
delete(m, "a")       // 删不存在的 key 不报错
```
只用 `v := m["a"]` 判断存在性是错的：存了 `0` 和没存，返回的 `v` 都是 `0`。**凡是用零值本身有意义的场景（计数、金额），必须用 `v, ok` 双返回值。**

#### 遍历无序是语言保证，不是实现巧合
```go
for k := range m { ... }   // 顺序随机，每次运行都可能不同
```
需要稳定顺序就显式排序：
```go
keys := make([]string, 0, len(m))
for k := range m { keys = append(keys, k) }
sort.Strings(keys)
for _, k := range keys { fmt.Println(k, m[k]) }
```
这条规矩在阶段五的**报表输出**里会直接影响结果可复现性——同一份数据两次导出的行序不同，测试就没法比对。

#### 并发写 map 会直接崩
```go
// 两个 goroutine 同时 m[k] = v
// fatal error: concurrent map writes
```
不是数据错乱，是**运行时直接杀进程**，`recover` 都拦不住。要用 `sync.RWMutex` 或 `sync.Map`（阶段二会展开）。今天只需要记住：map 不是并发安全的。

#### 字符串：字节、rune、拼接
```go
s := "账本"
fmt.Println(len(s))                    // 6 —— 字节数
fmt.Println(len([]rune(s)))            // 2 —— 字符数
fmt.Println(s[0])                      // 232 —— 一个字节，不是字符
for i, r := range s { ... }            // i 是字节偏移，r 是 rune
```
Go 的字符串是**只读字节序列**，UTF-8 编码。中文一个字 3 字节，所以 `len` 和「字数」不是一回事，`s[0]` 拿到的是半个字。

拼接：
- 少量：`a + b`，简单但每次都分配新串。
- 循环内：用 `strings.Builder`，预分配 `Grow`，避免 O(n²)。
- 格式化：`fmt.Sprintf`，可读但慢。

#### 术语预告：这里出现的 goroutine 是什么

上面说「两个 goroutine 同时写 map 会崩」，但你还没学过 goroutine。现在只需要建立一个够用的印象：**goroutine 是 Go 运行时调度的轻量执行单元，`go f()` 就能让 `f` 在另一条执行线上跑**。它便宜（初始栈约 2KB），但不是免费的——多条执行线同时碰同一块内存，就会出问题。

这一句在阶段二 D1 会展开成一整天，今天不必深究。但记住这个顺序：**先知道「并发会咬人」，再学「怎么用并发」**，比反过来安全。

#### 三张必须记住的「崩法」对照

| 代码 | 运行时结果 | 为什么 |
| :--- | :--- | :--- |
| `var m map[string]int; m["a"]=1` | `panic: assignment to entry in nil map` | nil map 没有底层哈希表，写入无处可放 |
| `var s []int; s[0]=1` | `panic: index out of range [0] with length 0` | nil 切片 len=0，没有第 0 个元素 |
| 两个 goroutine 同时 `m[k]=v` | `fatal error: concurrent map writes` | 运行时检测到并发写，**直接杀进程**，`recover` 拦不住 |

注意前两个是 `panic`（可以 `recover`），第三个是 `fatal error`（不能）。这也是为什么「保险起见加个 recover」不能替代正确的并发设计。

#### 5 分钟最小验证：中文到底占几个字节

```go
s := "你好Go"
fmt.Println(len(s))                    // 8
fmt.Println(len([]rune(s)))            // 4
fmt.Println(utf8.RuneCountInString(s)) // 4
fmt.Println(s[0], s[1], s[2])          // 228 189 160（三个字节拼出「你」）
```

四个输出必须和你预期一致。如果 `len(s)` 你猜的是 4，说明「字符串长度」在你脑子里还是「字数」——这正是后面做分类名截断、导出 CSV 时会踩的坑。

#### 判据
```go
m := map[string][]int{}
m["a"] = append(m["a"], 1)   // 对 nil value 的 append 是安全的
```
能解释为什么这行不用先初始化 `m["a"]`，以及为什么 `m["b"][0] = 1` 会 panic。

::q `m := map[string]int{}; if m["x"] == 0 { ... }` 这段判断有什么隐患？
::a 无法区分「key 不存在」和「key 存在但值为 0」。如果业务上 0 是合法值（比如某分类本月支出为 0），这行会把「有记录且为 0」误判成「没记录」。正确写法是 `v, ok := m["x"]; if !ok || v == 0`，或者更明确地分开两次判断。
::q 为什么 `for k := range m` 的顺序不能依赖？
::a Go 故意在每次 range 时随机化起始位置，强制开发者不依赖顺序。如果业务需要稳定输出（CSV 导出、报表、测试断言），必须自己把 key 取出来排序。依赖 map 顺序的代码在本地可能一直「正确」，上线后偶发错乱。
::q `strings.Builder` 相比 `s += part` 在循环里的优势是什么？
::a `s += part` 每次都分配一个新字符串并拷贝全部旧内容，n 次拼接是 O(n²) 的内存拷贝。`Builder` 内部是可变字节切片，按需扩容，均摊 O(n)，还能用 `Grow` 一次性预分配避免多次扩容。

<!--day 5 | core-->
#### 值接收者和指针接收者，差别只有一句话
方法接收者是**值**，调用时复制一份；是**指针**，传的是地址，方法内改字段能影响原对象。

```go
type Entry struct { Amount int64 }

func (e Entry) Double()  { e.Amount *= 2 }   // 改的是副本，调用方看不到
func (e *Entry) Double2() { e.Amount *= 2 }  // 改的是原对象
```

#### 但真正难的是「方法集」，它决定谁能满足接口
Go 的规则很短，但后果很大：

| 接收者 | `T` 的方法集 | `*T` 的方法集 |
| :--- | :--- | :--- |
| `func (t T)` | ✅ 包含 | ✅ 包含 |
| `func (t *T)` | ❌ **不包含** | ✅ 包含 |

所以：
```go
type Saver interface{ Save() error }
func (r *Repo) Save() error { ... }

var s Saver = Repo{}    // 编译错误：Repo does not implement Saver
var s Saver = &Repo{}   // 正确
```
**只要有一个方法用了指针接收者，这个类型就只有 `*T` 满足接口，`T` 不满足。** 这条规则在阶段五写 Repository 时会天天遇到（`*repo` 实现了接口，`repo` 没有）。

#### 什么时候必须用指针接收者
1. 方法要修改接收者（几乎所有 `Set`/`Update`/`append` 类操作）。
2. 结构体较大（几十字节以上），复制成本不划算。
3. 结构体含 `sync.Mutex` 等不可复制字段——复制会破坏锁语义，`go vet` 会直接报 `copylocks`。
4. 同一个类型上混用两种接收者 → **统一成指针**。混用是维护灾难：你永远记不清哪个方法改得动数据。

#### 构造器：为什么返回指针
```go
func NewLedger(path string) (*Ledger, error) {
    db, err := sql.Open("sqlite", path)
    if err != nil { return nil, fmt.Errorf("open ledger: %w", err) }
    return &Ledger{db: db}, nil
}
```
返回 `*Ledger` 而不是 `Ledger`：一是避免复制内部状态，二是让「构造可能失败」这件事通过 `error` 显式暴露，调用方不可能忘掉检查。Go 没有构造函数语法，`NewXxx` 是纯约定，但全生态都遵守。

#### 判据
```go
type Counter struct{ n int }
func (c Counter) Inc()  { c.n++ }
func (c *Counter) Inc2() { c.n++ }

c := Counter{}
c.Inc();  fmt.Println(c.n)  // 0
c.Inc2(); fmt.Println(c.n)  // 1
```
能不看讲解说出这两个 0 和 1 的原因，以及 `var _ Saver = Repo{}` 这类「编译期断言」的写法。

::q 一个类型有 3 个方法用值接收者、1 个用指针接收者，`T` 能满足接口吗？
::a 取决于接口要求哪些方法。如果接口只要那 3 个值接收者方法，`T` 和 `*T` 都满足。但只要接口里包含那个指针接收者的方法，就只有 `*T` 满足。实践上更该注意的是：**同类型混用接收者是坏味道**，应该统一，否则调用方要不停在 `T` 和 `&T` 之间猜。
::q 为什么含 `sync.Mutex` 的结构体不能用值接收者？
::a 值接收者会复制整个结构体，`Mutex` 也被复制，于是锁变成了「两把独立的锁」，互斥失效；解锁时还可能复制出未加锁状态，`go vet` 报 `copylocks`。正确做法是指针接收者，且结构体本身也以指针传递。
::q `func NewX() *X` 返回指针，和返回 `X` 相比最实际的好处是什么？
::a 调用方拿到的是同一个对象，后续方法（尤其是指针接收者的）能真正修改它；返回值也不必整体复制。配合 `(T, error)` 双返回值，还能把「构造失败」变成强制检查项——返回 `X` 时零值可能是「看起来正常但其实是坏的」对象。

<!--day 6 | core-->
#### 错误不是异常，是被传递的值
Go 里 `error` 是一个接口：
```go
type error interface { Error() string }
```
任何实现了 `Error() string` 的类型都是 error。函数把错误**当返回值返回**，调用方**必须显式检查**。没有 try/catch，也就没有「异常静默穿过三层栈」这种事——代价是每个可能失败的地方都得写 `if err != nil`。

#### 三种错误来源，处理方式不同
1. **哨兵错误（sentinel）**：`sql.ErrNoRows`、`gorm.ErrRecordNotFound`。用 `errors.Is` 判断。这类错误是**预期内的分支**，不是故障。
2. **包装错误**：`fmt.Errorf("create entry: %w", err)`。保留原始错误链，供上层判断。
3. **自定义错误类型**：需要携带结构化信息（字段名、冲突 ID）时定义 `type ValidationError struct{ Field string }`，用 `errors.As` 取出。

#### `%w` 和 `%v` 的区别，是这道题的分水岭
```go
err1 := fmt.Errorf("open db: %v", base)  // 只是文本拼接，链断了
err2 := fmt.Errorf("open db: %w", base)  // 保留链，errors.Is(err2, base) == true

fmt.Println(errors.Is(err1, base)) // false
fmt.Println(errors.Is(err2, base)) // true
```
`%v` 之后 `errors.Is/As` 全部失效，上层没法判断「到底是数据库连不上，还是记录不存在」。**包装一律用 `%w`，只在确实要切断语义时才用 `%v`。**

#### 判断方式：不要用 `==` 比字符串
```go
// ❌ 脆弱：字符串改了、被包装了就失效
if err.Error() == "record not found" { ... }

// ✅ 判断身份
if errors.Is(err, sql.ErrNoRows) { ... }

// ✅ 判断类型并取出字段
var ve *ValidationError
if errors.As(err, &ve) {
    fmt.Println(ve.Field)
}
```
`errors.Is` 会沿 `Unwrap()` 链逐层比对，`errors.As` 会沿链找第一个类型匹配。**这就是 `%w` 的意义所在。**

#### 包装的层次要在日志里可读
```go
func (r *repo) Get(ctx context.Context, id int64) (*Entry, error) {
    var e Entry
    err := r.db.QueryRowContext(ctx, "SELECT ... WHERE id = ?", id).Scan(&e.ID, &e.Amount)
    if err != nil {
        return nil, fmt.Errorf("repo.Get(id=%d): %w", id, err)
    }
    return &e, nil
}
```
最终日志里是 `api: load entry: repo.Get(id=42): sql: no rows in result set`——**从调用链倒着读就能定位**。只写 `fmt.Errorf("failed")` 的代码，出故障时等于没日志。

#### 边界与坑
- `if err != nil { return err }` 允许，但丢失上下文；跨包边界必须补一层包装。
- 不要在循环里 `errors.Is` 判同一个错误多次；判断一次，转成业务分支。
- 错误字符串小写开头、不带标点（Go 惯例），因为它会被拼接进上层句子。
- `err == nil` 是唯一可靠的「成功」判据，别用 `err.Error() == ""`。

#### 判据
写一个 `func mustInt(s string) (int, error)`，然后：
```go
v, err := mustInt("abc")
fmt.Println(errors.Is(err, strconv.ErrSyntax)) // 应为 true
```
如果为 false，说明你包装时用了 `%v`。

::q `fmt.Errorf("load: %v", err)` 和 `%w` 在实际排障中造成什么差别？
::a 用 `%v` 只保留文本，错误链被切断，上层 `errors.Is(err, sql.ErrNoRows)` 永远返回 false，于是「记录不存在」会被当成「数据库故障」返回 500。用 `%w` 保留链，上层能正确分流出 404 和 500。差别不在日志文本，在**控制流**。
::q `errors.Is` 和 `errors.As` 各自解决什么问题？
::a `errors.Is(err, target)` 判断链上是否存在**等于** `target` 的错误（用于哨兵值）。`errors.As(err, &target)` 判断链上是否存在**类型匹配**的错误，并把它赋值给 `target`（用于自定义错误类型，需要取出字段时）。前者比身份，后者比类型。
::q 为什么 `err.Error()` 返回的字符串不适合做程序判断依据？
::a 字符串是给人看的，随时会因为改文案、加包装前缀而变；而且不同包可能返回相同文案的不同错误。判断必须基于错误身份（`Is`）或类型（`As`）。用字符串比较的代码在本地能过，重构一次就悄悄失效。

<!--day 7 | core-->
#### 接口是「调用方需要什么」，不是「实现方有什么」
Go 的接口是**隐式实现**的：不需要 `implements` 声明，只要方法集齐全就自动满足。更重要的是设计原则——**接口应该定义在使用方所在的包**，由使用方声明「我需要什么能力」，而不是实现方导出「我能做什么」。

```go
// internal/ledger/service.go —— 使用方声明需求
type Store interface {
    Insert(ctx context.Context, e Entry) (int64, error)
    ListByMonth(ctx context.Context, month string) ([]Entry, error)
}

type Service struct { store Store }   // 只依赖接口
```
`internal/store` 包里的 `*SQLiteStore` 完全不知道 `ledger.Store` 的存在，但它实现了它。**换实现只改 main 里的一行装配，Service 不动。**

#### 为什么这一步决定后面能不能测试
```go
type fakeStore struct{ entries []Entry }
func (f *fakeStore) Insert(ctx context.Context, e Entry) (int64, error) { ... }
func (f *fakeStore) ListByMonth(ctx context.Context, m string) ([]Entry, error) { ... }
```
Service 的测试不需要数据库、不需要锁文件、毫秒级跑完。如果 Service 直接依赖 `*sql.DB`，这段测试就写不出来——这是「接口解耦」最实际的价值，不是教材话术。

#### 接口要小
```go
// ❌ 一个包罗万象的接口，任何 mock 都要实现 12 个方法
type Repository interface { Create; Get; List; Update; Delete; Count; Sum; Export; ... }

// ✅ 按使用场景拆
type Reader interface { Get(ctx, id) (*Entry, error) }
type Writer interface { Create(ctx, e) (int64, error) }
```
**接口越大，mock 越痛，复用越差。** 一个方法一个接口在 Go 里是正常做法（`io.Reader`、`io.Writer` 都只有一个方法）。

#### nil 接口陷阱：这个坑必踩一次
```go
type MyErr struct{}
func (e *MyErr) Error() string { return "boom" }

func bad() error {
    var p *MyErr = nil
    return p          // 返回的 error 非 nil！
}

fmt.Println(bad() == nil)  // false
```
原因：接口值由「类型 + 值」两部分组成。`p` 是 `*MyErr` 类型的 nil 指针，装进接口后**类型部分非空**，所以接口本身不等于 nil。判断 `err != nil` 成立，但调用 `err.Error()` 可能 panic。

规避：函数内不要声明具体类型的 nil 变量再当 error 返回，直接 `return nil`，或 `return (*MyErr)(nil)` 之前想清楚调用方怎么判。

#### 判据
```go
var _ Store = (*SQLiteStore)(nil)  // 编译期断言：不满足就编译失败
```
在 store 包里写这一行，能提前发现「方法签名写错了」，而不是等到 main 装配时报错。

::q 为什么接口要定义在调用方（使用方）包里，而不是实现方包里？
::a 因为接口描述的是「使用方需要什么」，只有使用方知道自己要哪些方法。定义在实现方包里，等于让使用方被迫接受实现方给出的方法集合，接口容易变胖，且使用方为了测试还得依赖实现方包。定义在使用方包里，依赖方向就是使用方 → 自己的接口，实现方反向「恰好」满足，避免了包循环依赖。
::q `var p *MyErr = nil; var err error = p; err == nil` 的结果？为什么？
::a 结果是 false。接口值包含动态类型和动态值两部分，`p` 虽然值为 nil，但类型是 `*MyErr`，赋给接口后类型部分非空，所以接口整体不等于 nil。这是 Go 里最经典的陷阱之一，用 `err != nil` 判断会误判为「有错误」。
::q 一个接口有 8 个方法，会带来什么具体成本？
::a 每个 mock、每个测试替身都要实现全部 8 个方法，哪怕只用到 1 个；任何实现方要新增能力都得改接口，所有实现全部编译失败；接口变得难以复用，最后往往演变成「什么都能干但谁都不满意」的大接口。所以按使用场景拆成若干小接口。

<!--day 8 | normal-->
#### defer 的三条规则
```go
func f() {
    defer fmt.Println("1")
    defer fmt.Println("2")
    fmt.Println("body")
}
// 输出：body 2 1 —— 后进先出
```
1. **后进先出（LIFO）**：多个 defer 按逆序执行。所以「先开的资源后关」自然成立。
2. **参数在 defer 语句处求值**，不是执行处：
```go
i := 0
defer fmt.Println(i)  // 捕获 0
i = 9                 // 不影响上面
```
3. **能改返回值（命名返回值时）**：
```go
func f() (n int) {
    defer func() { n++ }()
    return 5      // 实际返回 6
}
```
非命名返回值时改不到，因为 return 已经把值复制走了。

#### 循环里 defer 是陷阱
```go
for _, p := range paths {
    f, _ := os.Open(p)
    defer f.Close()      // ❌ 全部堆到函数结束才关
}
```
文件句柄会累积到函数返回，循环一万次就是「too many open files」。正确做法是包一层函数，让 defer 的粒度等于一次迭代：
```go
for _, p := range paths {
    func() {
        f, err := os.Open(p)
        if err != nil { return }
        defer f.Close()
        // 处理 f
    }()
}
```

#### panic / recover：只在「程序不该继续」时用
- `panic` 用于不可恢复的编程错误（数组越界、断言失败、初始化缺配置）。
- `recover` 只能在 `defer` 里生效，且只能捕获**同一个 goroutine** 的 panic。
- **HTTP 服务的 panic 必须被中间件兜住**（阶段三 D14 会写），否则单个请求打崩整个进程。
- 业务错误用 `error` 返回，不要用 panic 做控制流——那等于把显式错误变成隐式跳转。

```go
defer func() {
    if r := recover(); r != nil {
        log.Printf("panic: %v\n%s", r, debug.Stack())
    }
}()
```

#### 到底该 error 还是 panic：一张判断表

| 情形 | 用什么 | 理由 |
| :--- | :--- | :--- |
| 用户输入不合法（金额为负、日期格式错） | `error` | 预期内的分支，调用方要能区分并返回 400 |
| 文件不存在、记录查不到 | `error`（哨兵值） | 正常业务状态，不是故障 |
| 配置缺失、端口被占用、迁移失败 | `panic` 或启动即 `log.Fatal` | 程序无法进入正确状态，继续跑只会更糟 |
| 数组越界、nil 解引用、类型断言失败 | 运行时自动 panic | 编程错误，应当在测试期暴露 |
| HTTP handler 里任何未预期的 panic | 中间件 `recover` 兜住转 500 | 单个请求不能拖垮整个进程 |

一条经验法则：**能被调用方合理处理的，用 `error`；处理不了的，才让程序停。**

#### recover 的三个边界（不知道就会白写）

1. **只能捕获同一个 goroutine 的 panic**。你起的 `go func(){...}()` 里 panic，外层 `defer recover` 收不到——那个 goroutine 仍然会把进程带走。所以后台任务要**自己在顶部写 recover**。
2. **必须在 `defer` 里直接调用**。`defer func(){ recover() }()` 有效；`defer recover()` 无效（此时 recover 已被当作普通函数调用，返回 nil）。
3. **recover 之后函数不会「继续」**。它只是阻止 panic 继续向上传播，当前函数从 defer 之后直接返回，返回值是零值（或命名返回值当前的值）。

#### 报错对照：三个和 defer 有关的现场

| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `too many open files` | 循环里 `defer f.Close()`，句柄堆到函数结束 | 循环体包一层匿名函数，或显式 `f.Close()` |
| 服务「卡死但 CPU 为 0」 | 某处 `Lock()` 后 panic/提前 return，`Unlock` 没执行 | 一律 `defer mu.Unlock()`（阶段二 D5） |
| `panic: runtime error: ...` 但日志里没有堆栈 | recover 吞掉了 `r` 却没打 `debug.Stack()` | recover 里必须记录堆栈，否则等于销毁证据 |

#### 5 分钟最小验证：亲手看一次 recover

```go
func main() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("recovered:", r)   // recovered: boom
        }
    }()
    panic("boom")
    // fmt.Println("这行永远不会执行")
}
```

跑通后把 `defer` 那三行注释掉再跑一次：这次会看到 `panic: boom` 和完整堆栈，**退出码是 2**。两次输出的差别，就是「优雅降级」和「进程死亡」的差别。

#### 第一周复盘：三个自检问题
1. 能不能不看资料写出「切片扩容前后，append 是否影响原数组」的判断？
2. 能不能说出「为什么 `%w` 影响的是控制流而不只是日志」？
3. 能不能解释「指针接收者决定了 `T` 还是 `*T` 满足接口」？

三个都答得出，第一周就算过；有一个含糊，回对应那天重读，别往下赶。

::q `defer fmt.Println(i)` 之后的 `i = 9` 会影响输出吗？为什么？
::a 不会。defer 的参数在**语句执行时**就求值并保存，`fmt.Println(i)` 的参数此刻是 0，之后 i 变成 9 与已保存的副本无关。要打印最终值，得用闭包 `defer func(){ fmt.Println(i) }()`，闭包捕获的是变量本身。
::q 循环里 defer 关闭文件为什么会耗尽句柄？
::a defer 注册在**函数**返回时执行，不是「迭代」结束时。循环一千次就注册一千个 Close，全部堆到函数返回才执行，期间句柄一直占用。解决方法是把循环体包成匿名函数，让 defer 的生效范围收缩到单次迭代。
::q 为什么 HTTP handler 里的 panic 必须有中间件兜底？
::a 因为 panic 会终止整个 goroutine 并沿调用栈向上传播，如果没有 recover，`net/http` 的默认行为是打印堆栈并**关闭这条连接**，但在自己起的 goroutine（比如异步任务）里 panic 会直接让进程退出。统一在中间件里 recover，才能保证单个请求的异常不影响其他用户。

<!--day 9 | normal-->
#### 先从「表」想起，不要先想 ORM
账本只需要两张表起步：`entries`（账目）和后面的 `users`。今天手写 SQL，目的是让你在后面用 GORM 时知道它替你做了什么。

```sql
CREATE TABLE entries (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    amount   INTEGER NOT NULL,              -- 单位：分
    category TEXT    NOT NULL,
    date     TEXT    NOT NULL,              -- 'YYYY-MM-DD'
    note     TEXT    NOT NULL DEFAULT ''
);

CREATE INDEX idx_entries_date ON entries(date);
```

#### 三个必须现在就想清楚的决定
1. **金额存 `INTEGER`（分）**，不用 `REAL`。SQLite 的 `REAL` 是浮点，`0.1+0.2` 的问题会原样搬进数据库。
2. **日期存 `TEXT`（ISO 8601）**。SQLite 没有原生日期类型，`'YYYY-MM-DD'` 的字典序等于时间序，`LIKE '2026-10%'` 和 `BETWEEN` 都能用，还不受时区影响。
3. **`NOT NULL` + 默认值**。SQLite 对类型的约束很宽松（`TEXT` 列能存数字），所以约束要写足，把错误挡在写入前。

#### 单表增查的四种基本形态
```sql
INSERT INTO entries (amount, category, date, note)
VALUES (3550, '餐饮', '2026-10-19', '午饭');

SELECT id, amount, category, date, note
FROM entries
WHERE date LIKE '2026-10%'
ORDER BY date DESC, id DESC
LIMIT 20 OFFSET 0;

SELECT category, SUM(amount) AS total
FROM entries
WHERE date LIKE '2026-10%'
GROUP BY category
ORDER BY total DESC;

SELECT COALESCE(SUM(amount), 0) FROM entries WHERE date LIKE '2026-10%';
```
`COALESCE` 那行是为了让「本月没有记录」返回 `0` 而不是 `NULL`——`SUM` 对空集返回 NULL，直接 Scan 进 `int64` 会报错。**这个坑在阶段五写统计接口时会真实出现。**

#### 判据
用 `sqlite3 ledger.db` 交互式执行上面的建表和插入，然后：
```sql
SELECT COUNT(*) FROM entries;                        -- 2
SELECT SUM(amount) FROM entries WHERE date LIKE '2026-10%';  -- 正确
SELECT category, SUM(amount) FROM entries GROUP BY category;
```
三条都能出正确结果，说明你对 `WHERE`/`GROUP BY`/聚合函数的分工清楚了。

#### 报错对照
| 报错原文 | 原因 | 修法 |
| :--- | :--- | :--- |
| `Error: no such table: entries` | 建表语句没执行，或连到了另一个 db 文件 | 先 `.tables` 确认；`open` 时用绝对路径 |
| `Error: table entries already exists` | 重复执行建表 | 用 `CREATE TABLE IF NOT EXISTS`（迁移里再讨论为什么生产不该这么写） |
| `Error: datatype mismatch` | 往 `INTEGER` 列塞了 `'35.5'` 这种字符串 | SQLite 弱类型但会拦明显不合法值；金额一律先转成整数分 |
| `Error: no such column: total` | 在 `WHERE` 里引用了 `SELECT` 里的别名 | `WHERE` 先于 `SELECT` 执行；改用子查询或重复写聚合表达式 |
| 查出来中文是乱码 | 终端编码不是 UTF-8 | `export LANG=en_US.UTF-8`，或用 DB Browser 看 |

#### 5 分钟最小验证：让 SQLite 自己解释它怎么查
```bash
sqlite3 ledger.db '.schema entries'
sqlite3 ledger.db "EXPLAIN QUERY PLAN SELECT * FROM entries WHERE date LIKE '2026-10%' ORDER BY date DESC LIMIT 20;"
```
第二条会打印一行 `SEARCH entries USING INDEX idx_entries_date (date>? AND date<?)` 之类的计划。**今天只要看到「USING INDEX」就够了**，看不懂细节没关系——阶段五 D14 会专门讲。现在建立的习惯是：**先问数据库怎么执行，再讨论快不快**。

::q 为什么金额字段不用 `REAL`？
::a `REAL` 是二进制浮点，无法精确表示 0.1、0.2 这类十进制小数，累加会产生误差（`0.1+0.2=0.30000000000000004`）。账本要求分毫不差，所以用 `INTEGER` 存「分」，所有计算在整数域完成，展示时再除以 100。
::q `WHERE date LIKE '2026-10%'` 为什么能按月筛选？换成 `MONTH(date)=10` 有什么问题？
::a 因为日期存的是 `'YYYY-MM-DD'` 定长文本，月份部分位置固定，前缀匹配即可。用 `MONTH(date)` 这类函数会让**索引失效**（对列做函数运算无法用上索引），且 SQLite 的日期函数对格式敏感、还涉及时区，性能与正确性都更差。
::q `SUM(amount)` 在没有匹配行时返回什么？为什么这会引发 bug？
::a 返回 `NULL`，不是 0。直接把 `NULL` Scan 进 `int64` 会报 `converting NULL to int64 is unsupported`。修复方式是 `COALESCE(SUM(amount), 0)`，或者在 Go 里用 `sql.NullInt64` 接收再判断。

<!--day 10 | core-->
#### `database/sql` 是抽象层，驱动才是实现
```go
import (
    "database/sql"
    _ "modernc.org/sqlite"   // 空白导入：只为触发驱动的 init() 注册
)

db, err := sql.Open("sqlite", "file:ledger.db?_pragma=busy_timeout(5000)")
```
两点必须理解：
- **`sql.Open` 不会真的连数据库**，它只校验参数、准备连接池。真正建立连接发生在第一次执行语句时。所以 `Open` 成功不代表数据库可用。
- **空白导入**是为了执行驱动包的 `init()`，它内部调用 `sql.Register("sqlite", ...)`。没有它，运行时报 `unknown driver "sqlite"`。

`modernc.org/sqlite` 是纯 Go 实现，不依赖 CGO，交叉编译无坑。代价是比 CGO 版略慢，家庭账本完全够用。

#### 第一个必做的验证：Ping
```go
if err := db.PingContext(ctx); err != nil {
    return fmt.Errorf("ping db: %w", err)
}
```
没有这一步，配置写错（路径不可写、目录不存在）会在第一个真实请求时才爆，而且报错位置离原因很远。

#### 连接池参数，SQLite 必须显式设
```go
db.SetMaxOpenConns(1)          // SQLite 单写者，先设 1 最安全
db.SetMaxIdleConns(1)
db.SetConnMaxLifetime(0)       // 不主动过期，SQLite 是本地文件
```
`SetMaxOpenConns(1)` 的含义是「同时只允许一个连接」：所有查询串行化，彻底避免 `database is locked`。代价是并发度低——家庭账本一天几百次请求，完全无所谓。**先正确，再谈性能。**

如果你后面启用了 `PRAGMA journal_mode=WAL`，可以拆成写池（1 连接）和读池（多连接），这是阶段五 D4 的内容。

#### 建表语句放哪
```go
const schema = `
CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT ''
);`

if _, err := db.ExecContext(ctx, schema); err != nil {
    return fmt.Errorf("create schema: %w", err)
}
```
今天先用这段「启动即建表」，阶段五会换成 `goose` 迁移。**但你要知道它的问题**：没有版本记录、不能回滚、改动表结构时老数据怎么办全靠人脑记。用它只是为了让今天能跑起来。

#### 判据
```go
db, _ := sql.Open("sqlite", "file:ledger.db")
db.SetMaxOpenConns(1)
if err := db.PingContext(context.Background()); err != nil { log.Fatal(err) }
```
跑完 `ls -l ledger.db` 能看到文件；杀掉进程再跑一次，表还在（`CREATE TABLE IF NOT EXISTS` 不会报错）。

::q `sql.Open` 返回 nil error，是否说明数据库一定可用？
::a 不一定。`Open` 只做参数校验和连接池初始化，**不建立真实连接**。路径不可写、目录不存在、驱动参数错误都要等到第一次 `Ping` 或执行语句时才暴露。所以 `Open` 之后必须 `PingContext` 验证。
::q 为什么 `import _ "modernc.org/sqlite"` 要用下划线？
::a 下划线表示「只执行包的 init()，不使用它的导出名」。驱动的 init 里会调用 `sql.Register` 把驱动注册到 `database/sql` 的全局表里，`sql.Open("sqlite", ...)` 正是靠这张表找到实现。如果去掉下划线又不使用包内符号，编译会报「imported and not used」。
::q `SetMaxOpenConns(1)` 对 SQLite 解决了什么问题？代价是什么？
::a 解决多连接同时写导致的 `database is locked`（SQLite 同一时刻只允许一个写事务）。代价是查询完全串行，吞吐受限于单连接；对家庭账本这种低并发场景可接受，但要知道这是「用并发换确定性」。

<!--day 11 | core-->
#### 四个方法，各自对应什么 SQL 形态
| 方法 | 用于 | 返回 |
| :--- | :--- | :--- |
| `ExecContext` | INSERT / UPDATE / DELETE / DDL | `sql.Result`（可拿 `LastInsertId`、`RowsAffected`） |
| `QueryRowContext` | 确定最多一行的 SELECT | `*sql.Row`，`.Scan()` 时若无行返回 `sql.ErrNoRows` |
| `QueryContext` | 多行 SELECT | `*sql.Rows`，**必须 Close** |
| `PrepareContext` | 同一语句反复执行 | `*sql.Stmt`，**必须 Close** |

#### 写入：拿回自增 ID 与影响行数
```go
res, err := db.ExecContext(ctx,
    `INSERT INTO entries (amount, category, date, note) VALUES (?, ?, ?, ?)`,
    e.Amount, e.Category, e.Date, e.Note)
if err != nil {
    return 0, fmt.Errorf("insert entry: %w", err)
}
id, err := res.LastInsertId()
if err != nil {
    return 0, fmt.Errorf("last insert id: %w", err)
}
return id, nil
```
`LastInsertId` 只对自增主键有意义；`RowsAffected` 用来判断 UPDATE/DELETE 是否真的改到了行——**更新了 0 行通常意味着 ID 不存在或不属于当前用户**，这个信号在阶段四做数据隔离时非常重要。

#### 查询单行：`ErrNoRows` 不是故障
```go
var e Entry
err := db.QueryRowContext(ctx, `SELECT id, amount, category, date, note FROM entries WHERE id = ?`, id).
    Scan(&e.ID, &e.Amount, &e.Category, &e.Date, &e.Note)
if errors.Is(err, sql.ErrNoRows) {
    return nil, ErrNotFound   // 转成业务语义
}
if err != nil {
    return nil, fmt.Errorf("get entry %d: %w", id, err)
}
```
注意顺序：**先判 `ErrNoRows`，再判其他错误**。反过来写会把「不存在」也包成 500。

#### 查询多行：`Close` 和 `rows.Err()` 都不能漏
```go
rows, err := db.QueryContext(ctx, `SELECT id, amount FROM entries WHERE date LIKE ? ORDER BY date DESC`, month+"%")
if err != nil { return nil, err }
defer rows.Close()          // 必须

var out []Entry
for rows.Next() {
    var e Entry
    if err := rows.Scan(&e.ID, &e.Amount); err != nil {
        return nil, fmt.Errorf("scan: %w", err)
    }
    out = append(out, e)
}
if err := rows.Err(); err != nil {   // 遍历中途的错误在这里
    return nil, fmt.Errorf("iterate: %w", err)
}
```
`rows.Err()` 为什么必须检查：`Next()` 返回 false 有两种原因——正常结束，或**中途出错**（连接断开、上下文取消）。只看 `Next()` 会把「查询失败」当成「查到 0 行」，这是最隐蔽的一类 bug：报表少了数据，但日志一片正常。

#### Scan 的类型映射
- `INTEGER` → `int64`（不要用 `int`，跨平台宽度不一）
- `TEXT` → `string`
- 可空列 → `sql.NullString` / `sql.NullInt64`，或建表时就 `NOT NULL DEFAULT ''`
- `Scan` 的目标必须是指针，数量与列数严格一致，否则报 `expected N destination arguments`

#### 判据
```go
id, _ := insert(...)
e, err := get(id)      // 拿到刚插入的
_, err = get(999999)   // errors.Is(err, ErrNotFound) == true
```
两条都成立，且 `get` 的实现里 `ErrNoRows` 先判。

::q `rows.Next()` 返回 false，一定是「没有更多数据」吗？
::a 不一定。也可能是遍历中途出错（网络断开、context 被取消、驱动内部错误）。必须再检查 `rows.Err()` 才能区分。只看 `Next()` 会把失败当成空结果，导致统计数字偏小却不报错。
::q 为什么 `QueryRowContext` 的错误要在 `Scan` 之后判断？
::a 因为 `QueryRowContext` 本身几乎不返回错误，它把执行延迟到 `Scan`。`Scan` 会返回三类错误：没有行（`sql.ErrNoRows`）、列数不匹配、类型转换失败。所以 `if err := row.Scan(...); err != nil` 是唯一正确的判断点。
::q `UPDATE` 成功返回但 `RowsAffected() == 0`，说明什么？
::a 说明没有行被改动。可能是 ID 不存在、可能值本来就没变（某些数据库会算作 0 行），也可能是 `WHERE user_id = ?` 不匹配——**最后一种在阶段四就是数据越权的信号**。业务上应把「更新 0 行」当条件不满足处理，而不是当成功。

<!--day 12 | core-->
#### 预编译语句：省的是解析，不是拼字符串
```go
stmt, err := db.PrepareContext(ctx, `INSERT INTO entries (amount, category, date) VALUES (?, ?, ?)`)
if err != nil { return err }
defer stmt.Close()

for _, e := range batch {
    if _, err := stmt.ExecContext(ctx, e.Amount, e.Category, e.Date); err != nil {
        return fmt.Errorf("insert %s: %w", e.Category, err)
    }
}
```
服务端会缓存这条语句的执行计划，循环里只传参数。**批量导入（CSV 迁移历史账目）时收益明显。**

但注意：`Prepare` 也需要 `Close`，否则语句句柄泄漏。而且在 `SetMaxOpenConns(1)` 下，长时间持有 `Stmt` 会占住连接。

#### 参数占位符为什么必须用 `?`
```go
// ❌ 字符串拼接：SQL 注入 + 类型问题
q := fmt.Sprintf("SELECT * FROM entries WHERE category = '%s'", cat)

// ✅ 占位符：参数与语句分离，驱动负责转义
db.QueryContext(ctx, "SELECT * FROM entries WHERE category = ?", cat)
```
拼接的问题不只是注入。类别名里带单引号（`O'Brien`）会直接语法错误；日期格式差异会导致隐式转换。**占位符是唯一正确写法，没有例外。**

#### 事务：`Begin` / `Commit` / `Rollback` 的三段式
```go
tx, err := db.BeginTx(ctx, nil)
if err != nil { return fmt.Errorf("begin: %w", err) }
defer tx.Rollback()   // 已提交后再 Rollback 返回 ErrTxDone，可安全忽略

for _, e := range entries {
    if _, err := tx.ExecContext(ctx, `INSERT ...`, e.Amount, e.Category, e.Date); err != nil {
        return fmt.Errorf("insert: %w", err)   // defer 会回滚
    }
}
if err := tx.Commit(); err != nil {
    return fmt.Errorf("commit: %w", err)
}
return nil
```
`defer tx.Rollback()` 是标准写法：**成功提交后这次 Rollback 是无害的空操作**，失败路径则自动回滚。少了它，任何提前 return 都会留下悬挂事务，占着锁直到连接关闭。

#### 为什么批量插入必须用事务
不用事务时，每条 INSERT 都是一次独立提交：SQLite 每次都要 fsync 日志文件。插入 1000 条 = 1000 次磁盘同步，可能要几十秒。放进一个事务，只在 Commit 时同步一次，通常能快 10–100 倍。

这不是「优化技巧」，是**写入语义**问题：中途失败时，事务保证要么全进要么全不进；非事务下你会留下半份数据。

#### `BeginTx` 的第二个参数
```go
tx, err := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})
```
SQLite 实际上以「串行化」为默认，`Isolation` 通常不用改。但 `ctx` 必须传：请求被取消或超时时，事务要跟着回滚，否则会一直占着写锁。

#### 判据
```go
err := insertBatch(ctx, []Entry{{...}, {Amount: -1}})  // 故意让第二条失败
```
预期：表里**一条都没有**。如果第一条进去了，说明你没用事务或没 `defer Rollback`。

::q `defer tx.Rollback()` 在 `Commit()` 成功之后执行，会不会把已提交的数据撤销？
::a 不会。提交后事务已结束，`Rollback` 返回 `sql.ErrTxDone`，是一个无害的空操作。所以标准写法就是「begin 之后立刻 defer rollback，成功路径显式 commit」，不需要在 defer 里判断状态。
::q 为什么批量插入 1000 条，用事务比不用快一个数量级？
::a 不用事务时每条 INSERT 都是独立事务，SQLite 每次提交都要把日志 fsync 到磁盘，1000 次同步是主要开销。放进一个事务后只在 Commit 时同步一次，磁盘 I/O 从 1000 次降到 1 次。这同时也是原子性保证的来源。
::q 用 `fmt.Sprintf` 拼 SQL 有哪些具体风险（除注入外）？
::a 三类：一是值里含引号（`O'Brien`）导致语法错误；二是类型/格式问题，比如时间字符串格式不一致被隐式转换；三是无法复用执行计划，每次都是新语句，性能更差。占位符把「语句」和「数据」彻底分离，这三类问题一次性消除。

<!--day 13 | normal-->
#### 连接是稀缺资源，生命周期要显式管理
`*sql.DB` **不是连接，是连接池**。它持有 0 到 N 条真实连接，按需创建、空闲复用、超时回收。所以要管理的是三件事：同时开多少、空闲留多少、一条连接活多久。

```go
db.SetMaxOpenConns(1)     // 同时最多 1 条
db.SetMaxIdleConns(1)     // 空闲池保留 1 条
db.SetConnMaxLifetime(0)  // 永不过期（本地文件场景）
db.SetConnMaxIdleTime(0)
```
不设 `MaxOpenConns` 的默认值是**无限**，高并发下会把数据库连接打满（Postgres 上很致命）；SQLite 上则是频繁 `database is locked`。

#### 关闭：`defer db.Close()` 放在 main 里
```go
func main() {
    db, err := openDB(cfg.DBPath)
    if err != nil { log.Fatal(err) }
    defer db.Close()   // 进程退出前释放所有连接
    ...
}
```
`db.Close()` 会等待所有在用连接归还。所以顺序很重要：**先停 HTTP 服务，再关 DB**（阶段六 D8 会写优雅关闭，那时这个顺序就是正确性问题）。

#### 一条查询从进入到归还，经过了什么
1. 业务代码调 `QueryContext`。
2. 池子有空闲连接 → 直接复用；没有且未达上限 → 新建；已达上限 → **阻塞等待**（或 ctx 超时）。
3. 执行 SQL，`rows` 持有这条连接。
4. `rows.Close()` 或遍历结束 → 连接归还池子。
5. 连接空闲超过 `MaxIdleConns` → 被真正关闭。

**第 4 步是关键：`rows` 不 Close，连接永远不归还。** 在 `MaxOpenConns(1)` 下，一次泄漏就会让整个服务卡死在下一次查询上——这是「服务突然无响应但 CPU 为 0」的典型原因。

#### 判据
```go
// 故意漏掉 rows.Close()，然后连续查两次
for i := 0; i < 3; i++ {
    rows, _ := db.QueryContext(ctx, "SELECT 1")
    _ = rows            // 不 Close
}
```
在 `MaxOpenConns(1)` 下，第三条会**永久阻塞**。这个实验做一遍，比读十遍文档有用。

::q `db.SetMaxOpenConns(1)` 之后，如果某个函数忘了 `rows.Close()`，会发生什么？
::a 那条连接被 `rows` 一直占着，池子里唯一可用的连接被耗尽。之后任何查询都会阻塞在「等待可用连接」上，直到 ctx 超时或进程退出。表现为服务整体无响应、CPU 却接近 0——排查时很容易误判成死锁。
::q `*sql.DB` 需要每次请求都 `Close` 吗？
::a 不需要，也不应该。`*sql.DB` 是长生命周期的连接池，全进程一个实例，只在程序退出时 `Close` 一次。每次请求要关的是 `*sql.Rows` 和 `*sql.Stmt`，它们才持有具体连接。
::q 为什么「先停 HTTP 服务，再 db.Close()」的顺序不能反？
::a 反过来的话，正在处理的请求会拿到一个已关闭的池，查询直接报 `sql: database is closed`，用户看到 500。正确顺序是先 `srv.Shutdown` 停止接受新请求并等待在途请求完成，确认没有请求再用 `db.Close()` 释放连接。

<!--day 14 | normal-->
#### 把前 13 天拼成一个能用的东西
目标只有一个：`add` 写进去，`list` 读出来，**关掉终端数据还在**。不做花活。

今天最容易踩的不是语法，而是**顺序**：先写 `add` 还是先跑通 `main`？正确顺序是**先把「命令能进来」跑通**——进来一个 `add`，打印一行 `"would add"` 就够。因为参数解析、子命令分发这一层一旦定型，后面填业务只是往里塞代码；反过来先写 SQL，你会一边调 `database/sql` 一边怀疑是不是 `os.Args` 切错了，两个变量同时动，bug 无法定位。

所以今天的四个里程碑按这个顺序推进，每完成一个就手动跑一次：

| 里程碑 | 完成标志 | 跑不通时先看哪 |
| :--- | :--- | :--- |
| ① 命令分发 | `./ledger` 打印用法；`./ledger foo` 打印「未知命令」 | `os.Args` 下标 |
| ② 参数解析 | `./ledger add -amount 35.5 -category 餐饮` 打印解析出的值 | flag 名与 `-` 前缀 |
| ③ 落库 | 跑完 `sqlite3 ledger.db 'select * from entries'` 能看到行 | 表是否建过、字段数 |
| ④ 读回 | `./ledger list` 打印表格，对齐 | `Flush()` 是否调用 |

#### 一条要守一整年的纪律：金额只在边界上转换
命令行里人输入的是「元」（`35.5`），数据库里存的是「分」（`3550`）。转换只能发生两次，而且必须都在边界：

- **入口**：`ParseFloat` → `math.Round(x*100)` → `int64`，之后一律是分；
- **出口**：`float64(分)/100` → `%.2f`，只用于打印。

中间任何一层（查询、求和、比较、传参）出现 float，都是 bug 的种子。为什么必须 `Round`？`35.5*100` 在二进制浮点里可能算出 `3549.9999999999995`，直接 `int64()` 截断就变成 `3549`——少一分钱，而且只在某些金额上出现，对账时极难查。

```go
func parseYuanToCents(s string) (int64, error) {
    v, err := strconv.ParseFloat(s, 64)
    if err != nil {
        return 0, fmt.Errorf("amount 不是合法数字: %q", s)
    }
    if v <= 0 {
        return 0, fmt.Errorf("amount 必须为正数，收到 %q", s)
    }
    return int64(math.Round(v * 100)), nil   // Round 不是可选项
}
```

#### 装配：main 只做接线
```go
func main() {
    db, err := openDB("ledger.db")
    if err != nil { log.Fatalf("open db: %v", err) }
    defer db.Close()

    if len(os.Args) < 2 {
        fmt.Fprintln(os.Stderr, "用法: ledger <add|list> [参数]")
        os.Exit(2)
    }

    switch os.Args[1] {
    case "add":
        if err := runAdd(db, os.Args[2:]); err != nil {
            log.Fatalf("add: %v", err)
        }
    case "list":
        if err := runList(db); err != nil {
            log.Fatalf("list: %v", err)
        }
    default:
        fmt.Fprintf(os.Stderr, "未知命令: %s\n", os.Args[1])
        os.Exit(2)
    }
}
```
结构上就三块：**装配（main）→ 解析参数（flag）→ 执行（runXxx）**。`os.Exit` 只在 main 里出现，`runXxx` 只返回 error，这样后面要改成 HTTP 服务时，`runXxx` 可以原样变成 handler 的业务函数。

#### `flag` 解析：注意它和位置参数混用
```go
func runAdd(db *sql.DB, args []string) error {
    fs := flag.NewFlagSet("add", flag.ContinueOnError)
    amount := fs.String("amount", "", "金额（元，如 35.5）")
    category := fs.String("category", "", "分类")
    date := fs.String("date", time.Now().Format("2006-01-02"), "日期 YYYY-MM-DD")
    note := fs.String("note", "", "备注")
    if err := fs.Parse(args); err != nil {
        return fmt.Errorf("解析参数: %w", err)   // 注意：-h 也会走到这里
    }
    cents, err := parseYuanToCents(*amount)
    if err != nil {
        return err
    }
    if *category == "" {
        return fmt.Errorf("category 不能为空")
    }
    if _, err := time.Parse("2006-01-02", *date); err != nil {
        return fmt.Errorf("date 必须是 YYYY-MM-DD，收到 %q", *date)
    }

    _, err = db.ExecContext(context.Background(),
        `INSERT INTO entries (amount, category, date, note) VALUES (?, ?, ?, ?)`,
        cents, *category, *date, *note)
    return err
}
```
参数校验在**写库之前**完成，错误信息指出是哪个字段——这条习惯会一路延续到 HTTP 层（阶段三 D15 的输入校验）。

两个细节值得单独记一笔：

- **用 `flag.ContinueOnError` 而不是 `flag.ExitOnError`**。后者会在解析失败时直接 `os.Exit(2)`，你的 `runAdd` 就再也测不了——测试里传一个坏参数，整个测试进程被干掉。前者把错误交回给你，退出码由 `main` 决定。
- **`flag` 遇到第一个非 `-` 开头的参数就停止解析**。`./ledger add 35.5 -category 餐饮` 里 `35.5` 被当成位置参数，`category` 收不到值且不报错（`fs.Args()` 里能看到它）。所以要么全用 `-name value`，要么在 `Parse` 之后检查 `fs.NArg() == 0` 并在非零时报错。这一步能挡掉「参数没生效但程序不响」的诡异现象。

#### 报错对照：今天最可能遇到的四条
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `flag provided but not defined: -amout` | 参数名打错，flag 不认缩写 | 用 `-h` 看当前子命令支持哪些参数 |
| `./ledger add` 后什么也没输出、退出码 0 | `flag` 吃掉了参数但校验没触发（amount 传了空串时 `ParseFloat` 报错被忽略） | 检查是否 `_ = err` 把错误丢了 |
| `no such table: entries` | 数据库文件是新建的，建表语句没跑 | 在 `openDB` 里执行 `CREATE TABLE IF NOT EXISTS` |
| `database is locked` | 上一次运行异常退出，留下了锁；或同时开了两个进程写 | 关闭其它 `./ledger` 进程；确认 `db.Close()` 被 defer 了 |

#### 5 分钟最小验证：先证明「能在终端里活下来」
在写任何业务代码前，跑这三条，确认环境没问题：

```bash
go run . add -amount 0.01 -category 测试 && echo "写入 ok"
sqlite3 ledger.db 'select count(*) from entries;'   # 期望 >= 1
go run . list | head -3
```
第一条要能打印 `写入 ok`。如果它报 `flag provided but not defined`，说明 `go run .` 后面跟的参数被 Go 工具链当成自己的参数了——`go run .` 之后的所有参数都会传给程序，正常情况下没问题；真出问题时用 `go build -o ledger . && ./ledger add ...` 排除工具链干扰。

#### 用 `text/tabwriter` 对齐输出
```go
w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
fmt.Fprintln(w, "ID\t金额\t分类\t日期\t备注")
for _, e := range entries {
    fmt.Fprintf(w, "%d\t%.2f\t%s\t%s\t%s\n", e.ID, float64(e.Amount)/100, e.Category, e.Date, e.Note)
}
w.Flush()
```
`float64(e.Amount)/100` 只在**展示层**出现，存储和计算全程是 int64 分。这条分界线要守住。

`tabwriter` 有两个必踩的点：① **列数必须一致**，某行少一个 `\t` 就会把后面所有列左移，表头错位；② **不 `Flush()` 什么都不输出**——它是缓冲的，程序正常结束时不会自动刷。还有一个不算坑但要接受的事实：中文是双宽字符，`tabwriter` 按字节算宽度，含中文的列会比预期宽一点，对齐仍然成立，只是不紧凑。别为了「好看」去手写空格填充，那会在英文分类名上崩掉。

#### 判据
```bash
go build -o ledger .
./ledger add -amount 35.5 -category 餐饮 -date 2026-10-19 -note 午饭
./ledger add -amount 12 -category 交通 -date 2026-10-19
./ledger list
./ledger add -amount -3 -category 餐饮      # 期望非 0 退出码 + 明确报错
```
`list` 两行都在，金额显示 `35.50` 和 `12.00`；第四条必须被拒，而不是写进一条负数。再补一条最容易漏的：`sqlite3 ledger.db 'select amount from entries'` 应该看到 `3550`、`1200` —— 如果看到 `35` 或 `3550.0`，说明转换放错了层。

::q 为什么 `float64(e.Amount)/100` 只允许出现在展示层？
::a 因为浮点除法会引入精度误差（比如 3550/100 在二进制下可能不精确）。存储、累加、比较必须全程用整数分，只在最后给人看的一步转成小数。如果中途转 float 再转回来，误差会累积，对账时出现「差一分」。
::q `runAdd` 里为什么用 `flag.NewFlagSet` 而不是全局 `flag`？
::a 全局 `flag` 会注册到 `flag.CommandLine`，多个子命令的参数名会冲突（`add` 和 `sum` 都想用 `-month`）。用独立的 `FlagSet` 让每个子命令有自己的参数空间，也便于测试时反复解析。
::q 把 `os.Exit` 限制在 main 里，对后续改造有什么好处？
::a `os.Exit` 会跳过所有 defer（连接不关、文件不刷），也无法被测单元测试覆盖。让 `runXxx` 只返回 error，main 统一决定退出码，这样这些函数能直接被测试调用，将来改造成 HTTP handler 时业务逻辑可以原样搬过去。

<!--day 15 | light-->
#### `sum`：第一次做聚合
```go
func runSum(db *sql.DB, args []string) error {
    fs := flag.NewFlagSet("sum", flag.ContinueOnError)
    month := fs.String("month", time.Now().Format("2006-01"), "月份 YYYY-MM")
    if err := fs.Parse(args); err != nil { return err }

    var total int64
    err := db.QueryRowContext(context.Background(),
        `SELECT COALESCE(SUM(amount), 0) FROM entries WHERE date LIKE ?`, *month+"%").
        Scan(&total)
    if err != nil { return fmt.Errorf("sum: %w", err) }
    fmt.Printf("%s 合计 %.2f 元\n", *month, float64(total)/100)
    return nil
}
```
`COALESCE` 保证空月份返回 0 而不是 NULL——现在把它写成条件反射。

#### 阶段验收：逐条跑，别凭感觉
```bash
./ledger add -amount 3550 -category 餐饮 -date 2026-10-19 -note 午饭
./ledger add -amount 1200 -category 交通 -date 2026-10-19
# 关掉终端，重新打开
./ledger list                 # 两笔都在
./ledger sum -month 2026-10  # 4750 分 → 47.50 元
```
只要有一条不成立，就回到对应那天：`list` 没有 → D11 的 `rows.Err`；`sum` 报错 → D9 的 `COALESCE`；重启丢数据 → D10 的连接参数写成了 `:memory:`。

#### 顺手给 `list` 加上 `-limit`，把「默认值」练成肌肉记忆
```go
func runList(db *sql.DB, args []string) error {
    fs := flag.NewFlagSet("list", flag.ContinueOnError)
    limit := fs.Int("limit", 20, "最多显示多少条")
    if err := fs.Parse(args); err != nil { return err }

    if *limit <= 0 || *limit > 200 {
        *limit = 20                       // 非法值兜底，不报错
    }
    rows, err := db.QueryContext(context.Background(),
        `SELECT id, amount, category, date, note FROM entries
         ORDER BY date DESC, id DESC LIMIT ?`, *limit)
    if err != nil { return fmt.Errorf("list: %w", err) }
    defer rows.Close()
    ...
}
```
注意 `LIMIT ?` 用占位符而不是字符串拼接（虽然它是 int，习惯要一致）。这条规则在阶段三会被放大成「URL 参数一律不可信」。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `sum` 打印 `0.00` 但库里明明有数据 | `date` 存的是 `2026-1-5`（月份没补零），`LIKE "2026-10%"` 匹配不到 | 入库前统一 `time.Parse` 再 `Format("2006-01-02")` |
| `converting NULL to int64 is unsupported` | 忘了 `COALESCE`，空月份 `SUM` 返回 NULL | `COALESCE(SUM(amount), 0)` |
| `sum` 输出 `4750.00` 而不是 `47.50` | 展示层忘了 `/100` | 只在打印时转元；也可以定义 `func yuan(c int64) string` |
| `flag provided but not defined: -month` | 子命令写错（`sum` 用了 `list` 的 FlagSet） | 每个子命令一个独立 `FlagSet` |

#### 5 分钟最小验证：空月份与跨年两件事
```bash
./ledger sum -month 2025-01     # 期望 "0.00 元"，不是报错、不是 NULL
./ledger add -amount 100 -category 测试 -date 2025-12-31
./ledger sum -month 2025-12     # 期望 1.00
./ledger sum -month 2026-01     # 必须还是 0.00，不能把 12 月的算进来
```
最后一条是「跨年边界」——`LIKE "2026-01%"` 天然不会匹配 `2025-12-31`，但如果你哪天改成 `BETWEEN` 却把月份算错一天，它就会串。**先用手跑一遍边界，以后改成 SQL 聚合时才有个对照。**

#### 复盘：这 15 天你到底拿到了什么
不是「会写 Go」，而是四件具体的事：
1. 知道 `append` 何时共享、何时新分配（D3）。
2. 知道错误包装为什么影响控制流（D6）。
3. 知道接口定义在使用方、指针接收者决定方法集（D5/D7）。
4. 知道 `rows` 不 Close 会占死连接（D11/D13）。

这四条在后面每一个阶段都会被重新用到。**说不出来就是没拿到**，别用「我大概知道」糊过去。

::q 为什么 `sum` 要用 `COALESCE(SUM(amount), 0)`？
::a 因为 `SUM` 在没有匹配行时返回 `NULL`，Scan 到 `int64` 会报类型转换错误。`COALESCE` 把 NULL 换成 0，让「本月没记账」这个正常场景返回 0 而不是报错。
::q 如果 `list` 重启后是空的，但文件存在且非空，最可能的原因是什么？
::a 最可能是 `sql.Open` 的 DSN 写成了 `:memory:` 或 `file::memory:?cache=shared`，每次启动都是新的内存库；也可能是写入用了不同的工作目录（相对路径 `ledger.db` 在不同目录下指向不同文件）。排查方式是 `ls -l` 看文件修改时间、`SELECT COUNT(*)` 直接查库。
::q 阶段一到此为止，最该留下来反复看的是哪一天？
::a D13（连接生命周期）和 D6（错误包装）。前者是后面所有「服务无响应」类故障的根因模型，后者决定你在阶段三能不能正确区分 404 和 500。语法细节可以查，这两块是判断力。
