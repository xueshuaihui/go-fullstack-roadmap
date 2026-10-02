# 全站修订基准（CANONICAL）

内部编辑基准，不对外展示。所有周次内容修订必须对齐本表；本表未覆盖的新决策须在交付时列明，由主 agent 回写本表。

## 1. 项目演进链

| 周 | 项目 | Go 模块名 | 说明 |
|---|---|---|---|
| W1 | hello-go → todo-api | `hello` / `todo-api` | 单文件 package main 阶段，internal/ 分包推迟到 W2 |
| W2 | gin-api | `gin-api` | 首次引入 internal/ 分层 + pkg/response + interface repository |
| W3 | goblog | `goblog` | 新模块，但 day1 必须有"从 gin-api 继承清单"（response 包/错误码/中间件/三层） |
| W4 | goblog（延续） | `goblog` | 禁止出现 studyblog；W3 项目原地加 auth/config/logger |
| W5 | url-aggregator | `url-aggregator` | 独立并发练习，单 main.go |
| W6 | blog-web（前端） | — | day5 末"仓库归置"：mv 为 `goblog/frontend/`，后端目录化为 `goblog/backend/` |
| W7 | goblog monorepo | `goblog` | `goblog/{backend,frontend}`；服务器路径 `/opt/goblog` |
| W8 | goblog（延续） | `goblog` | 禁止 import 前缀 `blog/`；服务器路径 `/opt/goblog` |

W7 起 compose：`name: goblog`，服务名 `mysql / backend / frontend / migrate(profiles: tools) / caddy(prod)`，container_name `goblog-mysql` 等。W3 教学期 MySQL 容器就叫 `goblog-mysql`（库 `goblog`、用户 `goblog`/`goblog123`、root `goblogroot`、`3306:3306`）；W7D3 需教"先 `docker rm -f` 学习期旧容器再 up"。

## 2. 路由与响应契约（W2 起全站统一）

- 前缀：`/api/v1`（W3/W4 补上；W7 nginx `location /api/` 可匹配 /api/v1，措辞统一写 /api/v1；W6 `VITE_API_BASE=/api/v1`）。
- 健康检查：`GET /health`（无前缀），返回统一 Body：`{"code":0,"message":"ok","data":{"status":"ok"}}`。W8 的 /healthz 一律改 /health。
- 响应包 `pkg/response`（模块根，非 internal/，W2 起沿用；import 路径 `goblog/pkg/response`）：`response.Body{Code,Message,Data}`、`response.OK(c, data)`、`response.Created(c, data)`、`response.Fail(c, httpStatus, code, msg)`。禁止 `resp` 别名与 3 参 OK。jwtutil 位于 `internal/pkg/jwtutil`（W4 起）。

### 错误码表（唯一版本）

| code | 含义 | HTTP |
|---|---|---|
| 0 | 成功 | 2xx |
| 1001 | 资源不存在（通用） | 404 |
| 1002 | 密码错误 | 401 |
| 1003 | 权限不足/禁止 | 403 |
| 1004 | 参数错误 | 400 |
| 1005 | 未认证/token 无效 | 401 |
| 1006 | 用户名已存在 | 409 |
| 2001 | 文章不存在 | 404 |
| 5000 | 服务器内部错误 | 500 |

禁止出现 1000、5001、"404 用 code=404"。NoRoute 返回 404+1001。

## 3. goblog 数据模型基准（W3 建立，W4/6/7/8 增量）

```go
type User struct {
    gorm.Model                    // ID uint / CreatedAt / UpdatedAt / DeletedAt
    Username string `gorm:"type:varchar(32);uniqueIndex;not null" json:"username"`
    Nickname string `gorm:"type:varchar(32)" json:"nickname"`
    Email    string `gorm:"type:varchar(128);uniqueIndex" json:"email"`
    Password string `gorm:"type:varchar(72);not null" json:"-"`
    Role     Role   `gorm:"column:role;type:tinyint;not null;default:0;index" json:"role"` // W7 迁移 000002 引入
    Articles []Article `gorm:"foreignKey:UserID" json:"articles,omitempty"`
}
type Role int8
const ( RoleUser Role = iota; RoleAdmin )   // W8 正式讲，W7 迁移列已就位

type Article struct {
    gorm.Model
    Title      string `gorm:"type:varchar(120);not null"`
    Content    string `gorm:"type:text"`
    Summary    string `gorm:"type:varchar(255)" json:"summary"`   // W3 起即有（W6 前端依赖）
    CoverImage string `gorm:"type:varchar(255)" json:"cover_image"` // W3 起即有（W8 头像/封面上传复用）
    Views      int64  `gorm:"default:0"`
    UserID     uint   `gorm:"index"`
    User       User   `gorm:"foreignKey:UserID" json:"user,omitempty"` // 序列化键叫 user，前端适配（不叫 author）
    Tags       []Tag  `gorm:"many2many:article_tags"`
}
```

- ID 一律 `uint`（Claims 里 `UserID uint json:"uid"`）。
- 列表返回 `PageResult{list,total,page,size,total_page}`。
- 登录入参 `{username,password}`（不是 email）；密码策略 ≥8 位含字母数字（W4 passwordStrong）；示例密码一律 ≥8 位。

## 4. 鉴权基准（W4 建立）

- 双密钥：`JWT_SECRET`（access）+ `JWT_REFRESH_SECRET`（refresh）。AccessTTL=15m，RefreshTTL=7d。
- `Claims{UserID uint "uid"; Role int8 "role"(W8 加); Type string "typ"; RegisteredClaims}`；`typ` 取值 "access"/"refresh"，Parse 校验 wantType。
- 中间件签名 `middleware.Auth(secret string) gin.HandlerFunc`；context 键统一：`c.Set("userID", uint)`、`c.Set("role", model.Role)`（W8）、`c.Set("request_id", string)`；读取 `c.GetUint("userID")`。禁止 "uid" 裸键与 GetInt8。
- 登录响应 `data:{user, access_token, refresh_token}`；refresh 请求 `{refresh_token}` → 同登录字段。前端 W6 适配 snake_case。
- `GET /api/v1/users/me`（Auth 保护）：W4 提供，返回当前 user；W6D4 并发 401 实验用它。
- 仅作者可改/删：W4 summary 前移为 **W4 day5 前的一节完整实现**（放 day4 或 day5 正文，含 `2001/1003`），给完整 handler 代码。

## 5. 环境变量（W4 config 起统一）

`PORT / GIN_MODE / DB_HOST / DB_PORT / DB_USER / DB_PASS / DB_NAME / JWT_SECRET / JWT_REFRESH_SECRET`（+W7 `AUTO_MIGRATE`、+W8 `UPLOAD_DIR / CORS_ORIGIN`）。
- config 由 DB_* 拼 DSN；禁止 MYSQL_DSN / SERVER_PORT / DB_PASSWORD 等别名。
- .env 值对齐：DB_NAME=goblog、DB_USER=goblog、DB_PASS=goblog123、DB_HOST=localhost（容器内为 mysql）。
- compose 中 mysql 镜像官方变量（MYSQL_ROOT_PASSWORD 等）与后端变量分两段展示，注释区分。

## 6. 迁移编号（W7 起，golang-migrate，成对 up/down）

- `000001_init_users`（列与 §3 模型一致：无 bio、password 列名、含 nickname/email/summary 等；admin 用户由 seed 迁移建）
- `000002_add_role_to_users`（role TINYINT NOT NULL DEFAULT 0）
- `000003_init_articles`（articles + tags + article_tags）
- `000004_seed_admin`（UPDATE role=1 WHERE username='admin'）
- W8 新增：`000005_add_comments`、`000006_add_avatar_to_users`（avatar varchar(255)）
- W8 禁止另起 000003 role 迁移；comments 表必须带编号与 down。

## 7. 前端基准（W6 建立）

- 目录 `goblog/frontend/`（W6 期叫 blog-web）；`src/api/http.js` **named export** `http`，`baseURL:'/api/v1'`，拦截器拆 Body.code≠0→reject、成功返回 `body.data`。W8 一律 `import { http } from '../api/http'`，禁止 default api + 手工 `data.data`。
- `hooks/useAuth.js`：localStorage（`accessToken/refreshToken/user`）为唯一状态源 + 自定义事件广播，保证跨组件同步。
- 路由：`/ /login /register /post/new /post/:id /post/:id/edit /me`，W8 增 `/admin`。禁止 /article/:id、/editor/:id?。
- `components/ProtectedRoute.jsx` named export；NavBar named export；W8 复用 W6 文件用 diff 展示。
- 前端字段对齐后端：文章 `{id,title,content,summary,cover_image,views,user:{id,nickname},created_at}`；列表 `{list,total,page,size,total_page}`。
- Vite 事实：`preview.proxy` 默认继承 `server.proxy`，文案按此写。

## 8. 伏笔兑现分配

| 伏笔 | 出处 | 兑现位置 |
|---|---|---|
| strings.Builder | W1D1 | W3D4 新增"字符串拼接与 strings.Builder"小节 |
| SetTrustedProxies | W4D4 | W7D2（nginx XFF 一节内兑现 `r.SetTrustedProxies`） |
| CI | W4D5 已教 workflow | W8D4 改为"升级 W4 的 workflow：-race 全量 + 覆盖率上传"，给完整 yml |
| repository 接口 | W1D4/W2 预告 | W2D4 正式教 interface + UserRepository + MemRepo 实现 |
| panic/recover | W2D3 使用 | W2D3 讲义内补半页最小教学 |
| Redis 黑名单 | W4D2 | 改为"课程范围外"前瞻句，不承诺周次 |
| url-aggregator 联调 | W5S | 删除该承诺，改为通用复盘 |

## 9. 术语/语法前置规则

任何页面练习/示例只能使用：本页已讲 + 之前页面已讲 + 明确标注"第 X 周正式讲，今天照抄"的能力。range、接口、goroutine 等首次出现必须有最小讲解或照抄标注。每页多个 `func main` 片段必须给"文件怎么放"约定（W1D2 已立：每节独立目录或只保留一个 main）。

## 10. 不变项

- 页面结构/样式类名、data-key 命名（wNdNx）、day-nav 链接、footer 格式不动。
- docs/index.md 是源规划，只在周主题级别对齐，不逐句同步。
- 各周"扩展阅读"外链允许外部资源（标注"可选"），正文主体必须自足。

## 11. W1 定稿基准（已修订，后续周引用以此为准）

- 模块链：D1 `hello`（hello-go/）→ D2/D3 实验模块 `proj`（每小节一子目录）→ D4 起正式项目 `github.com/你的用户名/todo-api`（单目录全 package main：go.mod/model.go/store.go/repo.go/filerepo.go/main.go）；D5 临时模块 hello-http 用完即删。W2 起换新模块 gin-api 并首次引入 cmd/+internal/ 分层。
- `Todo{ID int; Title string; Done bool; CreatedAt string}`（json: id/title/done/created_at,omitempty）；哨兵 `ErrNotFound`→404、`ErrEmptyTitle`→400。
- `TodoRepository{ List() ([]Todo, error); Get(id int) (Todo, error); Create(title string) (Todo, error); Complete(id int) (Todo, error); Delete(id int) error }`；实现 MemRepo（含 sync.Mutex）与 FileRepo（NewFileRepo(path) (*FileRepo, error)）。
- W1 响应是裸 JSON；`{code,message,data}` 包装从 W2 起。
- 前瞻锚点已锁定：指针→W1D2、接口→W1D4、%w/errors.Is→W1D4、strings.Builder→W3D4、goroutine+Mutex→W5D1–D3、拆包→W2、统一响应→W2。
- W1D5 有 git 教学节（锚点 day5.html#push），summary 验收指向它。

## 12. W5 交付时确立的补充规则

- code-label 标"可跑/完整 main.go"的代码块必须自带 package main+import；标"片段/伪码"的必须旁边给可跑版或最小前置定义。
- 验收命令禁止 `| tail -N` / `| head -N` 截关键字段。
- HTTP 状态可按语义细化（如上游失败 502），业务码仍走 §2 表（5000）；url-aggregator 等独立练习项目可不挂 /api/v1。
- httptest 分工：W4D5=NewRecorder（进程内测 handler），W5S=NewServer（要真实 URL 的并发测试）。
- W4D4 的 context/goroutine"第 5 周教"伏笔已在 W5D1/D2/D4 三处兑现。
- 对照组（serial）不与被测组共用同一条超时 ctx。
