# 全站修订基准（CANONICAL）· HomeCube 耦合版

内部编辑基准，**不对外展示、不在站点任何页面渲染**。所有日卡内容修订必须对齐本表；本表未覆盖的新决策须在交付时列明，由主 agent 回写本表。

> **2026-10-13 全站重写**：本站原为「Go 全栈 8 周修炼手册」（产物 goblog 博客），已整体改写为 **HomeCube 学习路线**（产物 = app 壳基座 + family-ledger 全功能的服务端）。旧基准的 goblog / todo-api / url-aggregator / blog-web / MySQL / React 六条演进链**全部作废**，仅在 §16 明账里留一条回捞指针。
>
> **改任何一页前必须先读本文件**；批量生产日卡的子 agent 必须以本文件 + `notes/api-scope.md`（路径见 §10）为唯一输入。

---

## 1. 阶段链与日历周映射

两条线：**服务端主线 S1-S8**（用户亲手写，工作日 + 周六）+ **前端辅线 F1-F6**（agent 写代码，用户周日学到能读懂/能改/能定位）。

| 阶段 | 主题 | 日历周 | 服务端卡 | 前端卡（周日） |
|---|---|---|---|---|
| S1 | Go 与最小 HTTP（标准库 net/http） | w01-w02 | 12 | F1 ×2 |
| S2 | Gin 与三层 | w03-w04 | 12 | F1 ×2 |
| S3 | Postgres 与迁移 | w05-w06 | 12 | F2 ×2 |
| S4 | 鉴权与家庭隔离 | w07-w09 | 18 | F3 ×3 |
| S5 | 并发与工程化 | w10-w11 | 12 | F4 ×2 |
| S6 | 财务功能面 | w12-w16 | 30 | F4 ×5 |
| S7 | 壳基座服务端 | w17-w20 | 24 | F5 ×4 |
| S8 | 收口与部署 | w21-w22 | 12 | F6 ×2 |
| **合计** | | **22 周** | **132** | **22** |

- 132 + 22 = **154 张日卡**，另加 8 张服务端阶段总览 + 6 张前端阶段总览 + 1 张 index = **169 页**。
- **工期口径**：≈22 周（服务端）叠前端线后 ≈26-32 周。按 ~10h/周：服务端 8h（工作日 20-30min ×5 + 周六 4h）+ 前端 2h（周日前半）+ 周日后半（复盘 + 提交）。
- **落后不追赶，顺延不裁剪判据**；两条线各自顺延，互不挪用时间。

## 2. 站点目录与页面清单

```
index.html                        全站导航 + 两条线进度追踪
assets/{style.css,app.js}         样式与进度持久化（app.js 已按 §3 契约重写）
docs/{CANONICAL.md,index.md}      内部基准（本文件）+ 源规划
docs/outline.tsv                  **日卡清单唯一源**：key/stage/kind/title/minutes/difficulty/increment
docs/fragments/*.tsv              各批产出的临时清单（表头与 outline.tsv 完全一致）
tools/build-index.py              从 outline.tsv 生成 index.html（每批日卡产出后重跑）
tools/merge-fragments.py          把 docs/fragments/*.tsv 并进 outline.tsv（去重、排序、报冲突）
tools/check-site.py               全站一致性复核（只读；ERROR 必须修，WARN 人工过一眼）
server/
  s1/overview.html                阶段总览（判据、需要哪几课、产出物）
  s1/w01d1.html … w02d6.html      每周 6 张：d1-d5 工作日微增量、d6 周六大增量
  s2/ … s8/                       同上
frontend/
  f1/overview.html
  f1/w01f1.html … w04f1.html      每周 1 张，挂在该周周日
  f2/ … f6/
```

- 服务端卡数分布：S1=12、S2=12、S3=12、S4=18、S5=12、S6=30、S7=24、S8=12（= 132 ✓，每周 6 张 × 该阶段日历周数）。
- 前端卡数分布：F1=4（w01-w04）、F2=2（w05-w06）、F3=3（w07-w09）、F4=7（w10-w16）、F5=4（w17-w20）、F6=2（w21-w22）= **22 ✓**（22 周每周日一张，无空周）。
- **F1 全四张（w01f1-w04f1）用日卡内嵌的 SFC 片段教学**，不依赖 agent 产出（那时 `web/` 还不存在）。**agent 在 S3·D1（w05）第一次介入**：脚手架 `web/` 与请求层，F2 起（w05f1）才读真实页面。
- **`weeks/` 目录整体删除**，不保留 goblog 页面，不做 `legacy/` 归档（用户 2026-10-13 选定「原地覆盖，旧内容不留」）。

## 3. 页面模板与进度追踪契约（钉死，不许各页自创）

### 3.1 HTML 骨架（顺序与类名固定）

```html
<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{S?·D?} · {标题} | HomeCube 修炼手册</title>
<meta name="description" content="…">
<link rel="stylesheet" href="../../assets/style.css">
<script src="../../assets/app.js"></script>
</head>
<body data-day="{key}">
<header class="site-header">
  <a class="logo" href="../../index.html">Home<span>Cube</span> Roadmap</a>
  <nav><a href="../../index.html">总览</a><a href="overview.html">本阶段</a></nav>
</header>
<main class="page"><article>
  <div class="crumb">…</div>
  <div class="day-meta"><span class="chip">…</span><span class="chip alt">预计 …</span><span class="chip">难度 ★☆☆☆☆</span></div>
  <h1>…</h1>
  <section class="goals"><h2>今日目标</h2><ul class="check">…</ul></section>
  …正文段（两种版式见下）…
  <section><h2>常见坑…</h2><table>…</table></section>
  <section><h2>今日名词卡</h2><table>…</table></section>
  <section><h2>卡壳时查什么</h2>…</section>
  <section><h2>完成检查（全部勾掉才算毕业）</h2><ul class="check">…</ul></section>
  <nav class="day-nav">…</nav>
</article></main>
<footer class="site-footer">HomeCube Roadmap · {key} · 明天见 ⟩</footer>
</body></html>
```

**正文段有两种版式，按线选一种，不许混：**

| | 服务端日卡（S 线） | 前端周日卡（F 线） |
|---|---|---|
| 讲义 | `<h2>知识讲义</h2>`（一段；内部小标题用 h3） | 若干个 `<h2>1. …</h2>` `<h2>2. …</h2>` 编号小节，**不写「知识讲义」这个标题** |
| 动手 | `<h2>今日增量（在学习仓里落盘）</h2>` | `<h2>动手改（今天的判据现场）</h2>` + `<h2>定位题（…）</h2>`（定位题用 `.task`/`.task-title`） |
| 可选段 | 需要时在最前面加「课前须知」等过渡段 | 阶段最后一张加「F? 收口：判据逐条自测」 |
| `卡壳时查什么` | **必须有** | **必须有**（通常指向服务端课号，如「S4·D2」） |

四个锚点段在两种版式里都必须存在且按此相对顺序：`今日目标` → `常见坑` → `今日名词卡` → `完成检查`。段标题允许带后缀（如「常见坑（新手 100% 会踩）」），`tools/check-site.py` 按前缀匹配。

**「在学习仓里落盘」是固定措辞**：正文里不许出现学习仓的真实目录名（§16③），首次出现时定义「仓库根 = 你 clone 出来的学习仓根目录」，后文命令一律 `cd <你的学习仓根目录>`、目录树一律写 `<repo>/`。

可用类名（仅限这些）：`site-header / logo / page / crumb / day-meta / chip / chip alt / goals / check / callout js / callout warn / callout note / callout tip / day-nav / hint / site-footer / week-card / week-mini / fill / pct / progress-panel / hero / kicker / stack / weeks / theme / foot / grade / task / task-title / strip / strip-item / sunday / todo / code-label`。语法高亮 span：`k`(关键字) `s`(字符串) `c`(注释) `n`(数字) `t`(类型)。CSS 变量 `--text-dim` 等沿用 `assets/style.css`，**不新增内联样式**（旧页里那一条 `style="color:var(--text-dim)"` 的说明段是历史遗留，新页改用 `.callout note`）。

### 3.2 data-key / data-day 命名

| 页型 | `data-day` | 目标项 key | 完成检查项 key |
|---|---|---|---|
| 服务端日卡 | `w{NN}d{N}`，NN=01..22，N=1..6 | `w{NN}d{N}g{i}` | `w{NN}d{N}c{i}` |
| 前端周日卡 | `w{NN}f1` | `w{NN}f1g{i}` | `w{NN}f1c{i}` |
| 阶段总览 | 无 `data-day` | — | — |

- 周号**补零两位**（`w01` 不是 `w1`），因为总周数 22 > 9，字典序必须等于时间序。
- 全站 `data-key` 必须唯一，且**每一张卡的 key 都被 `index.html` 收录**（否则进度统计漏计）。
- 每页「完成检查」固定 **5 条**（`c1..c5`）；「今日目标」3-4 条（`g1..g4`）；前端卡「动手改」的小勾选项 2-4 条（`m1..m4`）。
- **只有 `c+数字` 结尾的 key 计入进度**（app.js 的口径），`g*` 与 `m*` 只持久化勾选状态、不参与百分比。
- 阶段总览页无 `data-day`，其判据勾选项用 `{阶段小写}o{i}`（如 `s1o1`、`f4o1`），**不得与任何日卡 key 相撞**。

### 3.3 app.js 契约

`assets/app.js` 只做三件事，重写后必须继续满足：

1. `ul.check input[type=checkbox]` 的勾选按 `data-key` 存 `localStorage`，刷新后恢复。
2. 按 `body[data-day]` 写 `localStorage["pf-"+day] = "done/total"`，**只统计 key 以 `c+数字` 结尾的项**。
3. `statsInRange` 遍历改为：服务端 `w{NN}d1..d6`（NN 按 index 上声明的周集合），前端 `w{NN}f1`。**未访问过的天按 `0/5` 计**。旧实现硬编码 `d=1..5`、`w1..w8`，已作废。

**index.html 由 `tools/build-index.py` 从 `docs/outline.tsv` 生成，不手写**。进度归集不靠周号区间：index 上每张日卡链接自带 `data-day="wNNdN"`，`app.js` 按「链接所在的 `.week-card` / `section` / 全文档（`data-scope="all"`）」聚合，未访问过的天按 `0/5` 计。这样加周、加卡都不用改 `app.js`。

**新增日卡的流程**：① 往 `docs/outline.tsv` 追加一行 ② 写 HTML ③ 跑 `python3 tools/build-index.py`。三步缺一不可——漏了 ③ 那张卡在 index 上就没有入口，进度也不计。

**批量生产时**（子 agent 并行写多张卡）改为四步：① 子 agent 只写 HTML + `docs/fragments/<批次>.tsv`，**不碰 outline.tsv、不跑 build-index、不 commit** ② 主 agent 跑 `python3 tools/merge-fragments.py` 合并 ③ 跑 `python3 tools/build-index.py`（应报 154/154）④ 跑 `python3 tools/check-site.py`，ERROR 清零才算这批验收通过。

## 4. 目标项目基准

| 项 | 值 |
|---|---|
| 学习仓 | `~/www/homecube-learn/`（**PRIVATE**，用户新建；本站是 PUBLIC 仓，二者内容不得混推） |
| 形态 | **模块化单体**（一个 Go 进程，两个业务模块 + 一个平台模块）。不是 PRD 的七服务拓扑 |
| Go 模块名 | `homecube`（`go.mod` 里就这一个，全期不换） |
| 目录 | `server/cmd/homecube/main.go`、`server/internal/{homeos,finance,platform}/`、`server/pkg/response/`、`server/migrations/{homeos,finance}/`、`web/`（agent 产出）、`Makefile`、`docker-compose.yml` |
| 技术栈 | Go 1.24+ / Gin / GORM / **Postgres 16** / golang-migrate / JWT(HS256) / 单测 `testing`+`httptest` |
| 前端栈 | **Vue 3 + uni-app + Pinia**（不是 React，不是 Vite SPA） |

**import 路径基准**：`homecube/pkg/response`、`homecube/internal/platform/...`。`pkg/response` 在**模块根**（不在 `internal/` 下），S1 起沿用全期不改。

**跨模块纪律**：`internal/finance` 不得 select `homeos_*` 表；跨模块调用点一律收在 `internal/platform` 的接口后面（S4 建 `FamilyDirectory`、S7 建 `DueRegistry`）。日后要拆服务，只换接口实现。

## 5. 路由与响应契约

- **路由分域**（PRD 22.2 第 8 条，禁扁平根路径）：`/api/homeos/*` 与 `/api/finance/*`。**没有版本号段**——禁止 `/api/v1/...` 出现在任何页面。
- **健康检查**：`GET /healthz`（无前缀，PRD 14.7），返回统一 Body：`{"code":0,"message":"ok","data":{"status":"ok"}}`。S1 D1 的第一个端点就是它。
- **教学期练手端点**：S1 允许 `GET /api/ping`（裸练 response 包），**S2 D1 必须删除**——留着就是 family-ledger 反例③「注册了但没实现/没用了的假入口」。
- **响应包 `homecube/pkg/response`**：`response.Body{Code int, Message string, Data any}`、`response.OK(c, data)`、`response.Created(c, data)`、`response.Fail(c, httpStatus, code, msg)`、`response.FailErr(c, err)`（按 §5.1 映射哨兵错误）。禁止 `resp` 别名、禁止 3 参 `OK`。
- **NoRoute** 返回 404 + 1001。
- `jwtutil` 位于 `internal/platform/jwtutil`（S4 起）。

### 5.1 错误码表（唯一版本）

| code | 含义 | HTTP |
|---|---|---|
| 0 | 成功 | 2xx |
| 1001 | 资源不存在。**越权读一律返回本码**（与"真不存在"同形，不泄露存在性） | 404 |
| 1002 | 认证失败（凭证错误；防枚举——"手机号不存在或验证码错"统一本码） | 401 |
| 1003 | 权限不足（角色矩阵拒绝 / 面未启用 / 字段不可见 / 非作者改他人数据） | 403 |
| 1004 | 参数错误 | 400 |
| 1005 | 未认证 / token 无效或过期 / `pver` 已失效 | 401 |
| 1006 | 唯一约束冲突（手机号、邀请码、同家庭内账户名） | 409 |
| 1007 | 时间窗编码非法（§6.4，**不回落**到默认档） | 400 |
| 1008 | 幂等冲突：`client_request_id` 已用过且请求体不同 | 409 |
| 1009 | 版本冲突：`version` 乐观锁不匹配（响应体带双版本 payload） | 409 |
| 1010 | 业务状态不允许（余额非 0 归档、停用最后一个面、删除有子级或有流水的分类、唯一 owner 未转让即移除） | 409 |
| 3001 | 家庭不存在或当前账号无权访问 | 404 |
| 3002 | 邀请无效 / 已过期 / 已使用 | 400 |
| 3003 | 验证码错误或已过期 | 400 |
| 3004 | 账号家庭数已达上限（≤5） | 409 |
| 4001 | 金额非法（≤0、超出账户可用余额、转账两端同账户） | 400 |
| 4002 | 附件超限（>3 张 / 单张 >5MB / 格式非 jpg·png·webp） | 400 |
| 5000 | 服务器内部错误 | 500 |

**禁止**出现 1000、5001、"404 用 code=404"、以及任何上表之外的码。

**「该周期未设预算」不是错误**：报表接口正常返回 200，payload 带 `budget_unset: true` 标记，**不得返回折算值**（PRD 红线）。

**HTTP 状态可按语义细化**（如上游失败 502），但业务码仍走上表。

## 6. 数据模型基准

### 6.1 命名与归属

- 表名 `{code}_{snake}`：`homeos_user` / `homeos_family` / `homeos_member` / `finance_transaction` …
- schema 分离：`homeos` / `finance` 两个 schema，**不跨 schema join**；迁移各自独立序列（§8）。
- **每张业务表都带 `family_id BIGINT NOT NULL`**（预置数据例外，见 6.3），**每条查询都带 `WHERE family_id = ?`**——这个条件由 `platform` 的 scope helper 注入，不允许 handler 手写裸 SQL 判定（PRD 22.5 第 4 道门禁的教学版）。

### 6.2 通用列

```
id            BIGSERIAL PRIMARY KEY          -- Go 侧 int64，全期不换 uint
family_id     BIGINT NOT NULL                -- 预置数据可空，见 6.3
created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
deleted_at    TIMESTAMPTZ NULL               -- 软删
deleted_by    BIGINT NULL                    -- 谁删的（软删必须成对）
version       INT NOT NULL DEFAULT 1         -- 乐观锁，写一次 +1
```

金额一律 `*_cents BIGINT`（**禁止浮点、禁止 `NUMERIC` 存了又在 Go 侧转 float64**）。Go 侧金额类型 `int64`，序列化时由前端除以 100 显示。

### 6.3 预置数据

用**可空的 `family_id`** 表达：`NULL` = 系统预置（如财务二级分类的默认树），非空 = 家庭自定义。查询时 `WHERE family_id = ? OR family_id IS NULL`。

### 6.4 时间窗五档（横切要求）

| 档 | 编码 | 例 |
|---|---|---|
| day | `YYYY-MM-DD` | `2026-10-13` |
| week | `YYYY-Wnn` | `2026-W42` |
| month | `YYYY-MM` | `2026-10` |
| quarter | `YYYY-Qn` | `2026-Q4` |
| year | `YYYY` | `2026` |

**非法编码返回 400 + 1007，不回落**到任何默认档。前端 shell 的时间窗切换器只暴露**月/季/年三档**（PRD ⑬），服务端接受五档——不是矛盾：多出的两档给 family-ledger 全功能的日/周视图用。

### 6.5 列表返回：游标分页（**旧 `PageResult` 口径作废**）

```json
{"code":0,"message":"ok","data":{"list":[…],"next_cursor":"…","has_more":true}}
```

- 游标**不透明**：服务端把 `(排序键, id)` base64 编码；客户端不得解析、不得自造。
- **禁止 offset 分页**（PRD 14.7：列表强制游标分页、不接受无上限返回）。
- 非分页的小集合（分类树、面目录、成员列表）直接返回 `{"list":[…]}`，**不带** `next_cursor`/`has_more`。
- 导出接口的行数**必须等于**同筛选条件下的查询行数（family-ledger 反例①）——S6 的判据。

### 6.6 角色

```go
type Role int8
const (
    RoleOwner  Role = 1  // 管理员：唯一可转让/解散；不能移除自己
    RoleMember Role = 2  // 成人成员：默认角色，可写业务数据，不能管成员与邀请
    RoleWard   Role = 3  // 儿童/老人：可无账号；有账号时仅有限写权限，guardian_id 指向监护人
    RoleGuest  Role = 4  // 访客：限时只读，默认有效期 30 天，可撤销，不可导出
)
```

「已退出成员」**不是第五个角色**，是 `homeos_member.status` 的一个取值（历史作者标记，数据留家庭）。

## 7. 鉴权与权限基准（S4 建立）

- **双密钥**：`JWT_SECRET`（access）+ `JWT_REFRESH_SECRET`（refresh）。AccessTTL = 15m，RefreshTTL = 7d。HS256。
- **Claims**：
  ```go
  type Claims struct {
      UserID   int64 `json:"uid"`
      MemberID int64 `json:"mid"`   // 当前会话家庭里的成员 id
      FamilyID int64 `json:"fam"`   // 当前会话家庭（多家庭切换即换 token）
      Role     Role  `json:"role"`  // 角色快照
      Pver     int   `json:"pver"`  // 权限版本；角色变更即 +1，旧 token 失效
      Type     string `json:"typ"`  // "access" / "refresh"
      jwt.RegisteredClaims
  }
  ```
  `Parse` 必须校验 `wantType`。**切换家庭 = 重新签发 token**，不做进程内切上下文。
- **中间件签名**：`middleware.Auth(secret string) gin.HandlerFunc`。context 键统一：
  `c.Set("userID", int64)` / `c.Set("memberID", int64)` / `c.Set("familyID", int64)` / `c.Set("role", model.Role)` / `c.Set("pver", int)` / `c.Set("request_id", string)`。
  读取 `c.GetInt64("familyID")`、`c.GetInt64("userID")`。**禁止**裸键 `"uid"`/`"fid"`、**禁止** `GetInt8` 读角色。
- **登录响应**：`data:{user, member, family, access_token, refresh_token}`；refresh 请求 `{refresh_token}` → 同登录字段。
- **权限判定只有一份实现**：`internal/platform/authz`。业务 handler **不得**自写角色判定分支，也不得出现家庭归属裸 SQL（PRD 22.2 第 5 条 / 22.5 第 4 道门禁的教学版）。判定顺序（P1 口径，PRD 15.2 定版㉖）：**显式拒绝 > 角色默认矩阵 > 字段级可见性**；「家庭级覆盖」与「对象级 ACL」两层不做。
- **越权读返 404 + 1001**（与不存在同形），**不是 403**。越权**写**才返 403 + 1003。
- **私密流水行级可见性必须实现**（PRD 15.2 的"不得混层的例外"）：命中 `is_private` 的行仅作者与 owner 可读。
- 密码策略：≥8 位含字母数字；示例密码一律 ≥8 位。登录入参 `{phone, password}` 或 `{phone, code}`（验证码登录）。

## 8. 环境变量与迁移编号

### 8.1 环境变量（S3 config 起统一）

`PORT / GIN_MODE / DB_HOST / DB_PORT / DB_USER / DB_PASS / DB_NAME / DB_SSLMODE / JWT_SECRET / JWT_REFRESH_SECRET`（+S3 `AUTO_MIGRATE`、+S6 `UPLOAD_DIR`、+S7 `CORS_ORIGIN`）。

- config 由 `DB_*` 拼 Postgres DSN。**禁止** `MYSQL_DSN` / `POSTGRES_DSN` / `SERVER_PORT` / `DB_PASSWORD` 等别名。
- `.env` 值对齐：`DB_NAME=homecube`、`DB_USER=homecube`、`DB_PASS=homecube123`、`DB_HOST=localhost`（容器内为 `postgres`）。
- compose：`name: homecube`，服务名 `postgres / server / web / migrate(profiles: tools)`，container_name `homecube-postgres` 等。官方镜像变量（`POSTGRES_PASSWORD` 等）与后端变量分两段展示、注释区分。

### 8.2 迁移编号

`server/migrations/{code}/{code}_{seq}_{desc}.{up,down}.sql`，`seq` 四位从 `0001` 起，**两个 code 各自独立计数**：

```
homeos/homeos_0001_init_user.up.sql / .down.sql
homeos/homeos_0002_init_family.sql …
finance/finance_0001_init_account.sql …
```

- 成对 up/down，**每条 down 必须真能回滚**（S3 的判据之一）。
- 禁止跨 code 引用（`finance` 的迁移里不许出现 `homeos_*`）。
- 第一条 finance 迁移就必须把 `*_cents BIGINT`、`family_id`、软删列、`version` 一次建对——**不许先建 float 再改**。

## 9. 前端基准（Vue 3 + uni-app，agent 写、用户学）

- 目录 `web/`；请求层 `src/api/http.js` **named export** `http`，`baseURL: '/api'`（路由自带 `/api/homeos`、`/api/finance`，**不再叠版本段**），拦截器拆 `body.code !== 0 → reject`、成功返回 `body.data`；401 → refresh → **重放一次**。
- 状态：Pinia。`useAuthStore`（token + 会话持久化）、`useFamilyStore`（当前家庭上下文，**切换家庭只归 shell**）、`useShellStore`（未读计数 + 时间窗 `period`，**全站唯一一份**）。
- **`pages.json` 不得出现 `tabBar` 字段**（family-ledger 反例④；底栏由 shell 自绘）。CI 第一查这条。
- 路由三段式 `pages/{code}/{feature}/{action}`；分包集合 = 已出生面域 **减去 `homeos`**（HomeOS 页面在主包）。
- **面清单只能来自服务端 `faces[]`**，客户端不得二次裁剪、不得硬编码（PRD 17.7 第 4 条）。
- 颜色只能引用 shell 的主题令牌，**禁止硬编码色值**（PRD 17.9）。
- 游标分页的前端侧：下拉刷新重置游标、触底加载续读，判据是**不重复、不漏、能续读**。
- **PIN 应用锁是纯客户端能力**（本地散列，不出端，无服务端接口）。

## 10. 接口分母（72 条，已锁死）

唯一权威源：`/Users/xuesh/www/homecube-learn/notes/api-scope.md`（PRIVATE 仓，**不复制进本站**，见 §16 明账③）。

- 总数 **72** = PRD 3.7/4.8 登记面取 67 + 补登记 5（认证 4 + 头像 1）。舍弃 38 条，理由逐条写在该文件 §二。
- 六处登记缺口已于 2026-10-13 全部拍板（全采纳默认）：账单 bills 5 条 **OUT**、流水标签 **不做**、PIN **不加接口**、主题落 settings、币种只存不算汇率、个人数据导出 **OUT**。
- 阶段消费：S2 = 分类 6 条走通三层 → S3 换 DB → **S4 = 认证 7 + 家庭 7 + 成员邀请 10 = 24 条** → S5 = 报表并发 → **S6 = 财务 30 条** → **S7 = 面配置 3 + 首页 2 + 到期 8 + 通知 3 + 设置 2 = 18 条** → S8 不新增。24+18=42，42+30=**72** ✓
- **日卡里出现的任何接口路径都必须在这 72 条内**。要加接口，先改 `api-scope.md` 并说明理由，不许直接写进日卡。

## 11. 伏笔兑现分配

| 伏笔 | 埋点 | 兑现位置 |
|---|---|---|
| 指针 | S1·D1 | S1·D2 正式讲 |
| 接口与隐式实现 | S1·D1 名词卡 | S1·D4 正式讲 |
| `%w` / `errors.Is` | S1·D3 | S1·D4 正式讲 |
| `strings.Builder` | S1·D3 常见坑 | S5 报表拼接处兑现 |
| repository 接口 | S1·D4 | S2·D4 正式教 interface + 内存实现 |
| panic/recover | S2·D3 中间件里使用 | S2·D3 讲义内补半页最小教学 |
| `client_request_id` 幂等键 | S2 首次出现写接口 | S4 建幂等表时正式讲 |
| `SetTrustedProxies` | S5 提一句 | S8 部署（Nginx XFF）一节内兑现 |
| CI workflow | S5·D6 建最小 workflow | S8 升级为 `-race` 全量 + 覆盖率 |
| goroutine / channel / Mutex / context | S1 起只在名词卡出现 | S5·D1-D5 集中教（并发与工程化整段） |
| 游标分页的前端侧 | S3 服务端建好 | F4（w10-w16 的周日卡）兑现 |
| 到期注册走进程内接口 | S4 讲跨模块接口 | S7 建 `DueRegistry` 时兑现「日后换总线只需换实现」 |
| Redis 黑名单 / 事件总线 / NATS | — | **课程范围外**，只作前瞻句，不承诺周次 |

## 12. 术语/语法前置规则

任何页面练习或示例只能使用：**本页已讲 + 之前页面已讲 + 明确标注「S?·D? 正式讲，今天照抄」**的能力。`range`、接口、goroutine、channel、`context`、泛型等首次出现必须有最小讲解或照抄标注。

一页里出现多个 `func main` 片段时，必须给「文件怎么放」的约定（S1·D2 立：每节一个独立子目录，或只保留一个 main）。

**前端卡额外一条**：F 段的判据全是「你能不能讲清 / 能不能改」，**不许拿"页面能跑"当自己通过了**（代码是 agent 写的）。每张 F 卡必须有一个**动手改**的动作（改字段、改样式、改一处 store），以及一道**定位题**（这个 bug 在前端还是服务端，怎么判断）。

## 13. 教学代码规则

- 标「可跑 / 完整 main.go」的代码块必须自带 `package main` + `import`；标「片段 / 伪码」的必须旁边给可跑版或最小前置定义。
- **验收命令禁止 `| tail -N` / `| head -N` 截关键字段。**
- `httptest` 分工：S2/S4 = `NewRecorder`（进程内测 handler）；S5 = `NewServer`（要真实 URL 的并发测试）。
- 并发对照组（serial）**不与被测组共用同一条超时 ctx**。
- **每张日卡的「今日增量」必须落在 PLAN.md §七 允许的五类里**：① 加一个字段/struct/枚举 ② 加一条路由或 handler 骨架（可先返回假数据） ③ 补一个测试用例 ④ 写一条迁移的 up 或 down ⑤ 把一个 handler 从假数据换成真查询。**d6（周六）卡**才允许「把本周 5 个微增量串成一条完整能力」。
- **第六类只给 S8**：⑥ 工程化收口产物（Dockerfile / `.dockerignore` / `docker-compose.yml` / nginx 配置 / CI workflow / 对账与冒烟脚本）。S1-S7 出现即违规——部署物提前引入会让"每天可跑"变成"每天等构建"。
- **收工时仓库必须绿**：`make build` 过、已有测试过。当天做不完 = 切得太大，当场再切小，**不许留半成品到第二天**。
- 假数据只能活在测试与 d1-d5 的 handler 骨架里，**S?·D6 之前必须换成真实现**——否则就是反例③。

## 14. 不变项

- 页面结构、样式类名、`day-nav` 链接形态、footer 格式沿用旧站（§3.1 已钉死）。
- `data-key` 沿用 `wNdNx` 家族，仅按 §3.2 补零并新增 `f1` 后缀。
- `docs/index.md` 是源规划，只在阶段主题级别对齐，不逐句同步。
- 各页「扩展阅读」外链允许外部资源（标注"可选"），**正文主体必须自足**——不许出现"去读 PRD 第 X 章"当正文。
- 站点标题、logo 文案、footer 署名统一为 `HomeCube Roadmap`（旧 `Go FullStack Roadmap` 全站替换）。

## 15. S1 定稿基准（样板批产出后由主 agent 回写细节）

- **模块链**：S1·D1 直接 `git init` 学习仓 + `go mod init homecube`，**不再有 hello/todo-api/gin-api 三个过渡模块**（旧基准的演进链作废）。D1-D4 的语法练习放 `server/playground/{d1,d2,…}/`（每个子目录一个 `package main`，`go.mod` 用 `// +build ignore` 之外的方式隔离：playground 各目录**自带独立 go.mod**，不进主模块）。D5 起进 `server/` 正式骨架。
- S1 产出物：目录骨架 + `Makefile`（`build`/`test`/`run`/`lint`）+ `pkg/response` + 错误码表（§5.1 全表落成常量）+ `GET /healthz` 跑通 + `GET /api/ping`（S2·D1 删）。
- S1 判据：`make build` / `make test` 绿；能徒手讲清 struct 方法与接口的隐式实现、`error` 为什么要包装、指针与值的区别。
- **S1 只用标准库 `net/http`，不引入 Gin**：`GET /healthz` 用 `http.ServeMux` 跑通。Gin 在 **S2·D1** 换入（同一批路由平移过去，并删掉教学期 `GET /api/ping`）——先懂标准库的 handler 签名与 `ResponseWriter`，再懂框架替你做了什么。
- S1 期间的前端卡（w01f1、w02f1）教 Vue 3 读法，教材是**日卡内嵌的 SFC 片段**，此时 `web/` 目录还不存在。

## 16. 明账（风险与被放弃的东西，不再劝，只记）

1. **154 页一次写完的漂移风险**（用户 2026-10-13 选定）。进度一旦顺延，卡面上的周号全部对不上真实日期。**处置**：日卡正文**只写相对序号**（「S1·D3」「本阶段第 3 天」），日历周号 `w01`…`w22` 只允许出现在**标签位**——`data-key`、文件名、`<title>`、面包屑、`day-meta` 第一枚 chip、`day-nav` 的 hint、footer——**不得在正文散文里承诺任何日期或"第几周做完什么"**。标签位口径由 `tools/fix-meta.py` 统一生成：服务端 `<title>` = `{S}·D{k} · {标题}`、chip = `{S} · DAY {k}`（k = 阶段内第几天）；前端 `<title>` = `{F}·w{NN} · {标题}`、chip = `{F} · WEEK {NN}`。
2. **原地覆盖丢掉了已审计的旧文本**。goblog 40 日课是经三轮审计的成稿，重写后不再存在于工作区。**回捞指针**：study-plans 仓 commit `e37c7ad`（重写前最后一次提交）里有完整的 `weeks/w1..w8/`。要复用某段讲解，从那个 commit 取，不要凭记忆重写。
3. **本站远端 `github.com/xueshuaihui/go-fullstack-roadmap` 是 PUBLIC 仓**（已核实）。重写后会把 HomeCube 的接口路径、错误码、权限矩阵、表命名推上公网。**处置**：① `CANONICAL.md` 与 `notes/api-scope.md` **只留本机，不推**（本文件已在 `.gitignore` 口径内待确认）；② 日卡正文**不得**出现 PRD 章节号、任何本机绝对路径、学习仓名与 family-ledger 仓名及其表名/代码——目录树一律写 `<repo>/`，命令一律写 `cd <你的学习仓根目录>`（首次出现时定义「仓库根」一词，后文复用）；③ **任何 push 之前必须先经用户确认**。
4. **旧基准里被整段作废的内容**：§1 项目演进链（hello→todo-api→gin-api→goblog→url-aggregator→blog-web）、MySQL 容器与 `goblog` 库口令、`PageResult{list,total,page,size,total_page}` offset 分页、React + Vite 前端基准、`/api/v1` 前缀、`/health`（改 `/healthz`）、`GET /api/v1/users/me`、错误码 2001（文章不存在）、迁移编号 `000001_init_users` 系列。这些在新页里**一条都不许出现**。
