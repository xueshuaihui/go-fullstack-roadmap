**解决什么问题**：你有编程基础，不需要从零学变量和循环。Go 的关键差异是**错误通过返回值传递**、**接口隐式实现**、**切片有底层数组**、**用 `go mod` 管理依赖**。同时引入 SQLite，因为后端的核心特征是数据不活在内存里。

### 知识点

**第 1 周：Go 语法骨架**

| 知识点 | 学到什么程度 |
| :--- | :--- |
| `var` / `:=`、基本类型、**显式类型转换** | 熟练；Go 无隐式转换 |
| 切片：`len`、`cap`、`append`、底层数组共享 | 理解 `s[1:3]` 与扩容行为 |
| map：`make`、`v, ok := m[k]` | 熟练 |
| 结构体 + 方法：**值接收者 vs 指针接收者** | 修改结构体用指针接收者 |
| **错误处理**：`if err != nil`、`fmt.Errorf("%w")` | 每个可能失败的操作都检查 |
| **接口**：隐式实现、**由调用方定义** | 理解接口解耦的意义 |
| `defer` | 用于关闭资源 |
| `go mod init/tidy`、`go run/build/fmt/vet` | 熟练 |

**第 2 周：SQLite 与 `database/sql`**

| 知识点 | 学到什么程度 |
| :--- | :--- |
| SQL 基础：`CREATE TABLE` / `INSERT` / `SELECT` / `WHERE` / `ORDER BY` | 能写单表增查 |
| `database/sql`：`Open` / `Exec` / `Query` / `QueryRow` / `rows.Scan` | 能建表、插入、查询 |
| `modernc.org/sqlite` 纯 Go 驱动 | 无 CGO，跨平台无坑 |
| 持久化生命周期：连接 → 执行 → 关闭 | 程序退出后数据仍在 |

**学习方式**：Tour of Go 快速过语法（2–3 天），遇到切片、接口、错误处理时在本地写例子。SQLite 看 `database/sql` 官方示例，改成账目表。

### 练手项目：命令行账本 `ledger-cli`

- `add -amount 35.5 -category 餐饮 -date 2026-10-19 -note 午饭`
- `list`：按日期倒序
- `sum -month 2026-10`
- 数据存 `ledger.db`
