**解决什么问题**：理解 goroutine、channel、竞态和 `context`，后续所有服务端代码都会涉及请求取消和并发安全。同时把阶段一的单文件代码拆成多包。

### 知识点

| 知识点 | 核心内容 |
| :--- | :--- |
| `goroutine` | `go f()` |
| `channel` | 发送/接收阻塞语义 |
| `select` | 多路等待，`default` 非阻塞 |
| `sync.WaitGroup` | `Add` / `Done` / `Wait` |
| **竞态条件** | `go run -race` 检测，`sync.Mutex` 保护 |
| `context` | `WithTimeout` / `WithCancel`，在 goroutine 树中传播取消信号 |
| 包组织 | 一个目录一个包；首字母大写导出；`internal/` 限制外部导入 |

**学习方式**：两个 goroutine 同时 `count++` 一万次 → `-race` 看到 `DATA RACE` → 加 `Mutex` 后报告消失。然后重构阶段一：数据库操作抽到 `internal/store`，`main` 只依赖 `Store` 接口。

### 练手项目：重构 + 并发导出

- 3 个包：`main`、`internal/store`（接口 + SQLite）、`internal/ledger`
- `export` 命令：并发按月份写多个 CSV
- `go test -race ./...` 通过
