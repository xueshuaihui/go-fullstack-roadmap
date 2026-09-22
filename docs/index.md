**前端转 Go 全栈：8 周完整学习规划（无 Express/Koa 经验版）**。  
目标：**2 个月内能独立上手项目开发**。每周都有可运行、可验证的练手项目。你不需要先补 Node/Express/Koa，直接学 Go + Web 后端通用知识即可。

---

# 一、总目标与技术栈

## 最终目标
8 周后你能独立完成：
- 设计 RESTful API
- 用 Gin 写服务端路由、中间件、参数校验
- 用 GORM 操作 MySQL，设计模型、关联、分页、搜索
- 实现注册、登录、JWT 鉴权、权限控制
- 理解 goroutine、channel、context，并能处理并发任务
- 写单元测试和接口测试
- 用 Docker + Docker Compose 部署全栈项目
- 用 React 与 Go 后端联调
- 独立完成一个可展示、可部署的全栈项目

## 推荐技术栈
- 语言：Go 1.24+（装最新版即可）
- Web 框架：Gin
- ORM：GORM
- 数据库：MySQL 8（用 Docker Compose 启动）
- 认证：JWT（access + refresh 双 token）+ bcrypt
- 配置：godotenv / viper
- 日志：log/slog 或 zap
- 测试：testing + httptest
- 容器：Docker + Docker Compose
- 前端：React（已锁定，全程不再比较 Vue）
- 反向代理：Nginx 或 Caddy

## 时间投入
- 每天 2–3 小时
- 周末 4–6 小时
- 每周 15–20 小时
- 总周期：8 周；如果时间紧，可用末尾 6 周压缩版

## 学习原则
1. 不先学 Express/Koa，直接 Go + Gin。
2. 每天必须写代码，不能只看教程。
3. 每周必须有一个可运行项目，并用 curl/Postman/浏览器验收。
4. 每个项目用 Git 管理，写 README。
5. 先跑通，再优化；先完成，再完美。
6. 遇到错误先读错误信息，再查官方文档。

---

# 二、8 周总览

| 周次 | 主题 | 练手项目 | 验收标准 |
|---|---|---|---|
| 第1周 | Go 基础 + HTTP 后端入门 | 标准库 HTTP 待办服务（CLI 作每日练习） | curl 可访问接口，状态码正确 |
| 第2周 | Gin + REST API 基础 | 内存版用户/文章 CRUD API | Postman 完成完整增删改查 |
| 第3周 | MySQL + GORM + Docker 入门 | 数据库版用户/文章/标签 API（Compose 起 MySQL） | 重启不丢数据，分页搜索关联正常 |
| 第4周 | JWT + 工程化 | JWT 认证博客 API（含 refresh token） | 未登录只读，仅作者可改删，过期可刷新 |
| 第5周 | 并发 + 测试 | 并发 URL 聚合 API | 固定模拟延迟下耗时接近串行 1/5，超时返回部分结果 |
| 第6周 | 全栈联调 | React + Go 博客前端 | 浏览器完成注册登录发文章 |
| 第7周 | 容器化 + 部署 | 全栈 Docker 化 + 云服务器部署 | 本地和云服务器均可访问 |
| 第8周 | 综合项目实战（扩展第 6 周博客） | 博客 + 角色权限 + 文件上传 | 部署上线，README 和 API 文档完整 |

---

# 三、第 1 周：Go 基础 + HTTP 后端入门

## 本周目标
掌握 Go 核心语法，理解 HTTP 服务端基本模型，能写最简单的 HTTP 接口。

## 每日安排
**Day 1：环境与基础语法**
- 安装 Go，理解 Go Modules（`go mod init/tidy`），不需要配置 GOPATH
- 变量、常量、`if/for/switch`
- 函数多返回值、显式错误处理
- 完成 A Tour of Go 前 5 章

**Day 2：结构体与方法**
- `struct` 定义与初始化
- 方法、值接收者、指针接收者
- Go 没有类继承，用组合替代
- 练习：定义 User、Article 结构体

**Day 3：slice、map、defer、文件 I/O**
- slice 的 append、copy、扩容
- map 增删改查
- `defer` 执行顺序
- 读写 JSON 文件

**Day 4：接口、错误处理、包管理**
- interface 隐式实现
- `error` 接口、自定义错误
- `go mod init/tidy`
- `package main` 与库包区别

**Day 5：HTTP 基础 + net/http**
- HTTP 方法、状态码、请求头、响应体
- REST 基本概念
- 用 `net/http` 写 `/health`、`/todos`
- JSON 序列化与反序列化

## 本周练手项目
**标准库 HTTP 待办服务**（本周唯一项目）
- `GET /todos` 返回列表
- `POST /todos` 新增待办
- `PATCH /todos/:id` 标记完成
- `DELETE /todos/:id` 删除
- `GET /health` 返回健康状态
- 数据保存到本地 JSON 文件

> 原"CLI 待办工具"降级为每日练习：Day 3 学文件 I/O 时写一个 `add/list/done` 的小 CLI 练手即可，不作为周末项目，避免双项目超载。

## 验收标准
- `curl localhost:8080/todos` 返回 JSON
- `curl -X POST localhost:8080/todos -d '{"title":"学习Go"}'` 能新增并落盘
- 重启服务后待办仍在（JSON 文件读取）
- 能正确返回 200、201、400、404、500

## 资源
- A Tour of Go
- Go by Example
- MDN HTTP 基础

---

# 四、第 2 周：Gin + REST API 基础

## 本周目标
从零建立服务端路由、中间件、JSON 处理能力，理解 REST API 设计。

## 每日安排
**Day 1：Gin 路由**
- 安装 Gin
- `GET/POST/PUT/DELETE`
- 路径参数 `:id`、查询参数 `?page=1`
- 路由分组 `router.Group`

**Day 2：请求绑定与验证**
- `ShouldBindJSON`
- 结构体 tag：`json:"name" binding:"required"`
- 参数校验与错误返回

**Day 3：中间件**
- 日志中间件
- CORS 中间件
- 鉴权中间件雏形
- 理解 `c.Next()`、`c.Abort()`

**Day 4：项目分层**
- handler / service / repository
- 统一响应结构 `{code, message, data}`
- 错误码设计

**Day 5：接口测试**
- 用 curl 和 Postman 测试
- 写简单接口文档
- 处理 404、参数错误、服务器错误

## 本周练手项目
**内存版用户 + 文章 REST API**

接口：
- `GET /users`
- `POST /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /articles`
- `POST /articles`

数据先存在内存 map 中，不接数据库。

## 验收标准
- Postman 完成完整 CRUD
- 统一返回 `{code, message, data}`
- CORS 允许前端访问
- 参数错误返回 400，资源不存在返回 404

## 资源
- Gin 官方文档
- RESTful API 设计指南

---

# 五、第 3 周：MySQL + GORM + Docker 入门

## 本周目标
掌握用 GORM 操作 MySQL，理解模型定义、迁移、CRUD、关联、分页；顺手掌握 Docker Compose 基础（起一个数据库容器）。

## 每日安排
**Day 1：Docker Compose + MySQL + GORM 入门**
- Docker 基础概念：镜像、容器、卷
- 用 `docker-compose.yml` 启动 MySQL（带数据卷，重启不丢数据）
- 安装 GORM 和 MySQL 驱动，连接数据库
- `AutoMigrate` 建表

**Day 2：模型与 CRUD**
- GORM 模型定义
- `gorm.Model`、主键、索引、非空
- `Create`、`First`、`Where`、`Save`、`Delete`

**Day 3：关联查询**
- 一对多：用户-文章
- 多对多：文章-标签
- `Preload`、`Joins`

**Day 4：分页、搜索、排序**
- `Offset`、`Limit`
- `Where("title LIKE ?", "%keyword%")`
- `Order("created_at desc")`

**Day 5：事务、连接池、软删除**
- `db.Transaction`
- `SetMaxOpenConns`、`SetMaxIdleConns`
- 软删除 `DeletedAt`

## 本周练手项目
**数据库版用户/文章/标签 API**
- 把第 2 周 API 改造成 MySQL 版
- 文章属于用户
- 文章可有多个标签
- 支持分页、搜索

## 验收标准
- 重启服务后数据不丢失
- `GET /users/1/articles?page=1&size=10` 返回正确分页
- 能按标题搜索
- 能查询文章及其标签

## 资源
- GORM 官方文档
- Docker MySQL 基础

---

# 六、第 4 周：JWT + 工程化

## 本周目标
让项目具备生产级基础：认证、配置、日志、优雅关闭、测试。

## 每日安排
**Day 1：密码与注册登录**
- bcrypt 密码哈希
- 注册接口
- 登录接口
- 绝不存明文密码

**Day 2：JWT 鉴权（access + refresh 双 token）**
- 生成/校验 access token（短期，如 15 分钟）
- 生成/校验 refresh token（长期，如 7 天）+ `POST /auth/refresh` 换发接口
- 鉴权中间件
- `Authorization: Bearer <token>`

**Day 3：配置管理**
- `.env` + godotenv 或 viper
- 数据库连接、JWT 密钥、端口配置
- 代码与配置分离

**Day 4：日志、请求 ID、优雅关闭**
- slog 或 zap 结构化日志
- 请求 ID 追踪
- `http.Server` 的 `Shutdown`
- 统一错误码

**Day 5：单元测试与接口测试**
- `testing` 包
- `httptest` 测试 HTTP 接口
- 为 handler、service 写测试

## 本周练手项目
**JWT 认证博客 API**
- 注册、登录、JWT 鉴权（access + refresh）
- 文章 CRUD
- 仅作者可编辑/删除自己的文章
- 统一错误码和请求 ID

## 验收标准
- 未登录用户只能读文章
- 登录用户能创建文章
- 非作者修改/删除返回 403
- token 错误/过期返回 401，携带 refresh token 调 `/auth/refresh` 能换回新 access token
- 日志能输出请求 ID

## 资源
- JWT 官方介绍
- bcrypt 文档
- Go slog/zap 文档

---

# 七、第 5 周：并发 + 性能

## 本周目标
理解 Go 的核心竞争力：goroutine、channel、context，并能用并发解决实际问题。

## 每日安排
**Day 1：goroutine 与 WaitGroup**
- `go func()`
- `sync.WaitGroup`
- 对比 JS `Promise.all`

**Day 2：channel 与 select**
- 无缓冲/有缓冲 channel
- `select` 多路复用
- “通过通信共享内存”

**Day 3：Mutex 与竞态检测**
- `sync.Mutex`
- `sync.RWMutex`
- `go run -race`

**Day 4：context**
- `context.WithTimeout`
- `context.WithCancel`
- 请求超时与取消

**Day 5：并发模式**
- worker pool
- `errgroup`
- 批量任务错误聚合

## 本周练手项目
**并发 URL 聚合 API**
- 接收 URL 列表
- 提供 `delay` 参数或 `/mock-slow` 模拟端点（固定 sleep 1 秒），排除网络波动
- 用 goroutine 并发抓取
- 5 秒超时自动取消
- 聚合结果返回 JSON
- 对比串行与并发耗时

## 验收标准
- 5 个固定 1 秒延迟的模拟端点：串行 ≈ 5s，并发 ≈ 1s
- 某个 URL 超过 5 秒时返回部分结果 + 超时提示
- `go run -race` 无数据竞态

## 资源
- Go 官方博客 “Share Memory By Communicating”
- `errgroup` 文档

---

# 八、第 6 周：全栈联调

## 本周目标
把你已有的 React 能力与 Go API 完整对接，完成一个前后端分离项目。

## 每日安排
**Day 1：登录注册对接**
- React 登录页
- 调用注册/登录接口
- 保存 access/refresh token

**Day 2：文章列表与详情**
- 文章列表页
- 文章详情页
- 分页与搜索

**Day 3：文章创建、编辑、删除**
- 表单提交
- 权限控制
- 错误提示

**Day 4：前端工程化**
- 路由守卫
- axios 拦截器：自动带 token；401 时用 refresh token 静默换发并重试，刷新也失败才跳登录（对接第 4 周 `/auth/refresh`）

**Day 5：CORS、代理、构建**
- 开发环境代理
- 生产环境构建
- 前后端联调问题排查

## 本周练手项目
**React + Go 博客前端**
- 登录/注册
- 文章列表
- 文章详情
- 文章创建/编辑/删除
- 仅作者可操作自己的文章

## 验收标准
- 浏览器完成注册 → 登录 → 发文章 → 编辑 → 删除
- 未登录无法进入编辑页
- access token 过期时前端静默刷新，用户无感知；refresh 过期跳转登录
- 前端可正常调用后端 API

---

# 九、第 7 周：容器化 + 部署

## 本周目标
让项目可一键启动、可上线部署。（Compose 基础已在第 3 周掌握，本周聚焦多阶段构建与真实部署。）

## 每日安排
**Day 1：Go 多阶段 Dockerfile**
- builder 阶段编译
- alpine/scratch 阶段运行
- 静态编译与镜像体积优化

**Day 2：前端构建 + Nginx**
- `npm run build`
- Nginx 托管静态文件
- 反向代理 `/api/*` 到 Go 服务

**Day 3：完整 Compose 编排**
- 把第 6 周项目编排为 backend + frontend/nginx + mysql 多服务
- 服务间网络、依赖顺序 `depends_on`、健康检查
- 环境变量管理

**Day 4：数据库迁移**
- `golang-migrate` 或 GORM 迁移
- 初始化数据
- 版本化管理

**Day 5：部署到云服务器**
- 推送镜像或拉取代码
- 启动 Docker Compose
- 配置域名与 HTTPS（Caddy 或 Nginx + Let's Encrypt）

## 本周练手项目
**第 6 周全栈博客的容器化**
- 后端 Go + Gin + GORM
- 前端 React + Nginx
- MySQL
- Nginx 反向代理

## 验收标准
- `docker compose up` 后前端可访问
- 完整业务流程可跑通
- 云服务器可访问
- 重启容器数据不丢失

---

# 十、第 8 周：综合项目实战

## 本周目标
在第 6/7 周博客项目基础上扩展两个未教过的功能模块（角色权限、文件上传），并完成部署与文档，形成作品集。

> 不再新起"商城后台/简易 CMS"：一周内从零做新系统不现实，扩展既有项目才能交付完整作品。若想做多主题，作为 8 周后的进阶练习。

## 新增学习点（本周现学）
- **角色与权限（RBAC）**：用户表加 `role` 字段（user/admin），权限中间件按角色放行，admin 可管理所有文章与用户
- **文件上传**：Gin `SaveUploadedFile`、类型/大小校验、本地磁盘存储 + 静态路由回显、镜像挂载卷持久化

## 保留功能（已学过，直接复用）
- 用户注册、登录、JWT（access + refresh）
- 文章 CRUD、评论
- 分页、搜索
- Docker 部署

## 每日安排
**Day 1：RBAC + 后端扩展**
- 角色字段与迁移
- 权限中间件
- 管理员接口（用户列表、强制删文）

**Day 2：文件上传**
- 头像/文章封面上传接口
- 校验与存储策略
- 前端上传组件对接

**Day 3：前端权限与收尾**
- 管理员页面/入口按角色显隐
- 评论功能（如未完成）
- 边界情况与错误提示

**Day 4：联调、测试、修 bug**
- 接口测试
- `-race` 检查
- 错误处理复查

**Day 5：部署、README、API 文档**
- Docker Compose 部署上线
- 写 README（含架构图）
- 写 API 文档
- 截图与演示

## 验收标准
- 完整业务流程可跑通（注册 → 登录 → 发文 → 传封面 → 管理员处置）
- 非管理员访问 admin 接口返回 403
- 部署上线，公网可访问
- README 含架构图、API 文档、启动说明
- Git 提交记录清晰

---

# 十一、每周固定节奏模板

## 工作日
- 30 分钟：复习前一天内容
- 90 分钟：学习新知识
- 60 分钟：写代码练习

## 周末
- 4–6 小时：完成本周项目
- 1 小时：验收、复盘、写 README
- 1 小时：补漏、整理笔记

## 每周日必须完成
- 项目能运行
- 验收标准全部通过
- Git 提交
- 写本周总结：学到了什么、卡在哪里、下周怎么改

---

# 十二、推荐项目结构

```text
project/
  cmd/server/main.go
  internal/
    handler/
    service/
    repository/
    model/
    middleware/
    config/
  pkg/
  configs/
  migrations/
  Dockerfile
  docker-compose.yml
  README.md
```

## 分层职责
- handler：接收请求、参数校验、返回响应
- service：业务逻辑
- repository：数据库操作
- model：数据结构
- middleware：日志、鉴权、CORS、恢复
- config：配置加载

---

# 十三、API 设计约定

## 统一响应
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## HTTP 状态码与业务码的关系（第 2 周即定死，前端拦截器依赖此规则）
- HTTP 状态码反映**请求处理结果**：参数错误 400、未认证 401、无权限 403、资源不存在 404、服务器错误 500
- body 里的 `code` 反映**业务错误细分**，与 HTTP 状态码同时出现
- 例：非作者改文章 → HTTP `403` + `{"code": 1003, ...}`；token 过期 → HTTP `401` + `{"code": 1005, ...}`
- 成功一律 HTTP `200/201` + `code: 0`

## 错误码示例
- 0：成功
- 1001：用户不存在
- 1002：密码错误
- 1003：无权限
- 1004：参数错误
- 1005：token 无效或过期

## 分页
```text
GET /articles?page=1&size=10
```

## 鉴权
```text
Authorization: Bearer <token>
```

---

# 十四、6 周压缩版

如果只有 6 周，按下面压缩：

| 周次 | 内容 | 项目 |
|---|---|---|
| 第1周 | Go 基础 + HTTP + Gin 入门 | 内存版待办 API |
| 第2周 | GORM + MySQL + Docker Compose | 数据库版用户/文章 API |
| 第3周 | JWT（双 token）+ 工程化 + 测试 | 认证博客 API |
| 第4周 | 并发 + 性能 | 并发聚合 API |
| 第5周 | 全栈联调 | React + Go 博客 |
| 第6周 | 部署 + 综合项目（RBAC + 文件上传） | 可部署全栈应用 |

---

# 十五、学习资源清单

## Go 基础
- A Tour of Go
- Go by Example
- Effective Go

## Web 与 API
- Gin 官方文档
- MDN HTTP
- RESTful API 设计指南

## 数据库
- GORM 官方文档
- MySQL 基础

## 认证与工程化
- JWT 官方介绍
- bcrypt
- godotenv / viper
- slog / zap

## 部署
- Docker 官方文档
- Docker Compose
- Nginx / Caddy

## 项目参考
- `gin-boilerplate`
- `miniblog`
- `gin-vue-blog`

---

# 十六、常见坑

1. 忽略 Go 的 `error` 返回值。
2. 用写 JS 的方式写 Go，过度使用 `interface{}`。
3. 并发写共享变量不用锁，也不跑 `-race`。
4. 密码明文存储。
5. 不配置 CORS，前端无法访问。
6. 数据库查询 N+1。
7. 不使用 context，请求无法超时取消。
8. 项目结构混乱，所有代码堆在 main.go。
9. 不写 README，项目无法展示。
10. 只学不练，看完就忘。

---

# 十七、最终能力检查清单

8 周后，你应该能：

- [ ] 独立设计 RESTful API
- [ ] 用 Gin 写路由、中间件、参数校验
- [ ] 用 GORM 设计模型、迁移、关联、分页、搜索
- [ ] 实现注册、登录、JWT（access + refresh）、权限控制（RBAC）
- [ ] 实现文件上传与静态回显
- [ ] 理解 goroutine、channel、context
- [ ] 写单元测试和接口测试
- [ ] 用 React 与 Go 后端联调
- [ ] 用 Docker Compose 编排全栈项目
- [ ] 部署到云服务器
- [ ] 完成一个可展示的全栈作品

---

# 附：评审修订记录（2026-09-23）

对照"8 周后能独立上手项目开发"的目标评审后落盘的变更：
1. 时间预算确认为每周 15–20h：第 1 周双项目合并为单一 HTTP 项目（CLI 降级为每日练习）；第 8 周不再新起商城/CMS，改为在第 6 周博客上扩展。
2. 补齐三个"验收要求了但没教"的漏洞：JWT 改为 access + refresh 双 token（第 4 周教、第 6 周 axios 拦截器对接）；角色权限（RBAC）与文件上传安排在第 8 周 Day 1–2 现学。
3. Docker Compose 前移至第 3 周（起 MySQL 时顺手教），第 7 周聚焦多阶段构建与部署。
4. 第 5 周并发验收改为固定模拟延迟（串行 ≈5s / 并发 ≈1s），消除网络波动导致的验收翻车。
5. 明确 HTTP 状态码与业务 code 的双层约定（见十三节），供第 6 周前端拦截器依赖。
6. 前端锁定 React；Go 版本要求更新为 1.24+；删除 GOPATH 配置项。
