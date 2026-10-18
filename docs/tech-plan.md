# HomeCube 技术方案

> **版本**：v1.0（2026-10-14）
> **真源**：`docs/prd/prd-homecube.md`（1897 行 23 章）。本文是它的**工程落地版**，不新增产品需求。
> **读者**：项目 owner（前端背景，服务端零基础）+ 本方案要陪跑61 周。
> **配套**：`docs/plan/learning-plan.md`（学习与施工排期）

---

## 〇、本方案与 PRD 的关系

| | PRD | 本文 |
|---|---|---|
| 回答什么 | **做什么**、为什么这么做 | **怎么做**、做成什么形状 |
| 读者 | 产品与架构评审 | 写代码的人 |
| 变更权限 | 三处受控内容需人类批准 | 与 PRD 一致，改动前先改 PRD |

**本文不推翻 PRD 的任何决定。** 发现 PRD 内部矛盾或缺失的地方，一律记入 §九「需定版清单」，**不在本文里偷偷替 PRD 做决定**。

---

## 一、系统形态

### 1.1 三个系统

```
┌─────────────────────────────────────────────────┐
│客户端（uni-app + Vue 3）                        │
│  一套代码 → H5 / Android / iOS                  │
└──────────────────┬──────────────────────────────┘
                   │ 单一 base URL
              ┌────▼─────┐
              │  Nginx   │ 按 /api/{code}/ 前缀转发 + TLS
              └────┬─────┘
       ┌───────────┼───────────┬──────────────┐
   /api/homeos  /api/calendar  /api/finance
       │              │              │
  ┌────▼────┐   ┌─────▼─────┐   ┌────▼─────┐
  │homeos   │   │ calendar  │   │ finance  │
  │底座     │   │时间系统   │   │业务面    │
  └────┬────┘   └─────┬─────┘   └────┬─────┘
       │              │              │
       └──────────────┴──────────────┘
                  │
        ┌─────────▼──────────┐
        │  NATS JetStream   │ 事件总线
        └───────────────────┘
                  │
        ┌─────────▼──────────┐
        │ PostgreSQL         │ 1 集群 / 3 schema
        │ homeos / calendar  │ 每 schema 一个专属账号
        │ / finance          │ 跨 schema SQL 被账号权限禁止
        └───────────────────┘
```

### 1.2 三个系统的定位与边界

| 系统 | code | 定位 | 做什么 | **不**做什么 |
|---|---|---|---|---|
| 家庭操作系统 HomeOS | `homeos` | 底座 | 身份、家庭、成员、权限、协作、通知下发、未读口径、同步、事件总线、动态流、面配置、首页聚合 | 时间三对象（日历/待办/提醒）——**已抽离到 calendar** |
| 时间系统 Calendar | `calendar` | 时间系统 | 日历、待办、提醒、周期规则、**到期中心**（唯一聚合与触发方）、16.4 注册契约的接收方 | **通知下发与未读口径**（归 homeos）、身份权限、业务对象的领域状态 |
| 财务系统 | `finance` | 唯一业务面 | 账户、流水、分类、预算、周期记账、报表、导出、附件引用 | 自建定时器与推送链路 |

**关键分工**（很多实现争议都出在这两句话）：
- **触发归 `calendar`，通知下发归 `homeos`** —— `calendar` 到点发 `calendar.reminder.fired`，`homeos` 消费后落 `Notification`
- **到期权威数据仍在业务面** —— `calendar` 只持有到期登记与完成回写

### 1.3 为什么 `calendar` 必须独立

这是本方案最需要理解的一条。PRD 3.9.1 给的理由：

> 时间系统是唯一被全部业务面横切依赖的能力。留在 HomeOS 里会让它同时承担「连接」和「到期触发」两种职责，而设计原则是「一面一系统、系统有边界」。命名同源规则要求一个 code 对应一个服务、一个 schema、一条迁移序列——横切能力没有自己的 code，就无法被门禁如实描述。抽离后到期中心可与 `svc-homeos` 故障隔离。

翻译成工程语言：

| 维度 | 寄生在 HomeOS 的后果 | 独立后 |
|---|---|---|
| 职责 | HomeOS 同时管「连接」和「到期触发」，故障域混在一起 | 到期中心故障只影响到期，不影响登录与权限 |
| schema | 所有时间表挤在 `homeos_` 里，归属说不清 | `calendar_` 前缀 + 独立 schema，归属一眼可查 |
| 迁移 | 三方共用一条迁移序列，改动互相卡 | 各自一条序列，可独立回滚 |
| 门禁 | 无法按服务校验表名归属 | 每张表有明确的服务归属 |

---

## 二、技术栈

### 2.1 既定选型

| 层 | 选型 | 版本基线 | 说明 |
|---|---|---|---|
| 服务端语言 | **Go** | 1.22+ | |
| HTTP 框架 | **Gin** | | |
| ORM | **GORM** | | 但**复杂聚合走手写 SQL**，不强行 ORM 化 |
| 数据库 | **PostgreSQL** | 15+ | 单集群，每服务一个 schema + 一个专属账号 |
| 消息 | **NATS JetStream** | | 已定选型，不算新增中间件 |
| 客户端 | **uni-app + Vue 3** | | 一套代码出 H5 / Android / iOS |
| 语言 | TypeScript | | |
| 管理台 | Vite + React | | 与 PRD 22.1 既定选型对齐（2026-10-18 定标：PRD 为真源，学习者 React 已熟） |
| 迁移 | golang-migrate | | `up` / `down` 必须可重放 |
| 部署 | Docker Compose | | **不引入 K8s / 服务网格 / 分布式事务** |

### 2.2 明确不引入

| 不做 | 理由 |
|---|---|
| Kubernetes | 家庭级私有部署规模不需要 |
| 服务网格 | 同上 |
| 分布式事务（2PC / SAGA 框架） | 一次写只落一个服务，跨面走事件 |
| Redis | 搜索用 PostgreSQL 全文索引；P1 不引缓存中间件 |
| 独立搜索集群 | 达到容量上限再评估 |
| 分布式追踪全链路采样 | 日志 + 指标带 `family_id` 与 `code` 够用 |

---

## 三、代码组织

### 3.1 目录结构

```
homecube/
├── server/
│   ├── cmd/
│   │   ├── svc-homeos/main.go          进程入口，只做装配
│   │   ├── svc-calendar/main.go
│   │   └── svc-finance/main.go
│   │
│   ├── internal/
│   │   ├── platform/                   ← 所有服务共用，禁止反向依赖业务包
│   │   │   ├── config/                 配置加载（环境变量 → 结构体）
│   │   │   ├── logger/                 结构化日志（带 family_id / code）
│   │   │   ├── response/               统一响应体 + 错误码
│   │   │   ├── db/                     连接池、事务、迁移执行
│   │   │   ├── authz/                  鉴权中间件（PRD 22.2#5 的单一实现）
│   │   │   ├── bus/                    事件总线 SDK（outbox + JetStream）
│   │   │   ├── idempotency/            client_request_id 幂等
│   │   │   └── dto/                    共享 DTO（跨服务复用的才放这里）
│   │   │
│   │   ├── homeos/
│   │   │   ├── handler/                HTTP 层：解析、校验、调 service
│   │   │   ├── service/                业务编排层
│   │   │   ├── repo/                   数据访问层，只碰本schema
│   │   │   └── model/                  本 schema 的实体与表结构
│   │   │
│   │   ├── calendar/                   ← 同上四层
│   │   └── finance/                    ← 同上四层
│   │
│   ├── contracts/
│   │   ├── openapi/
│   │   │   ├── homeos.yaml
│   │   │   ├── calendar.yaml
│   │   │   └── finance.yaml
│   │   ├── events/                     事件目录，未登记的事件不得发布
│   │   │   ├── homeos.yaml
│   │   │   ├── calendar.yaml
│   │   │   └── finance.yaml
│   │   └── data-levels.yaml            数据分级清单，不建表
│   │
│   └── migrations/
│       ├── homeos/homeos_{seq}_{desc}.{up,down}.sql
│       ├── calendar/calendar_{seq}_{desc}.{up,down}.sql
│       └── finance/finance_{seq}_{desc}.{up,down}.sql
│
├── web/                uni-app + Vue 3
├── admin/              Vite + React 管理台
├── deploy/             Dockerfile、docker-compose.yml、nginx.conf
├── notes/              每日笔记
└── Makefile
```

### 3.2 依赖方向红线

```
cmd  →  internal/{homeos,calendar,finance}  →  internal/platform
                                                    ↑
                              任何业务包不得反向依赖业务包
```

**三条硬边界**（违反即 CI 失败）：
1. `internal/finance` **不得 import** `internal/calendar` 或 `internal/homeos` —— 只能通过 `platform` 定义的接口
2. `internal/*/repo` **不得 select 别的 schema 的表**
3. `internal/platform` **不得 import 任何业务包**

**为什么这么严**：这三条守住了，日后从单体拆成三服务就是**机械拆分**；守不住就是重写。

**服务形态口径**：本方案**保留三服务边界与命名空间纪律**（`svc-{code}` / schema / 路由 / 事件前缀 / 表前缀 / 迁移序列 / 分包七类命名各自独立），**学习期允许单进程部署**，**拆进程为 S14 收口动作**。零基础起步时三进程同时调试成本过高，故学习期以一个进程装配三个服务包上线；红线 1（DB 账号即边界）与红线 5（路由分域）在单进程下仍由上述包边界 + 各自的 schema/账号自证，不因单进程而放宽。**S14 推迟的进程级判定逐名**（定版 ㉜ 要点②）：独立进程、独立镜像、独立发布线、杀容器故障注入、镜像级回滚、单服务重启互不影响。**学习期照判的边界与命名域纪律逐名**（定版 ㉜ 要点③，集合以 PRD 14.6 为准）：数据库账号即边界、三 schema 三迁移序列、`/api/{code}/` 路由前缀、事件目录与 outbox/死信、authz SDK 单一实现、CI 按 registry 三域静态命名。此口径与 PRD 一致，照判项以 14.6 的集合为准。

### 3.3 一个服务内的四层

| 层 | 职责 | 不许做 |
|---|---|---|
| `handler` | 解析请求、校验入参、调 service、组装响应 | 写业务逻辑、直接碰 DB |
| `service` | 业务编排、事务边界、跨表一致性 | 直接写 SQL |
| `repo` | 单表CRUD、拼查询条件 | 编排业务流程 |
| `model` | 实体定义、表结构映射 | 写逻辑 |

**为什么要四层**：handler 和 repo 之间如果没有 service，跨表一致性（转账要同时改两个账户）就只能塞进 handler，测试无从下手。

---

## 四、七类命名同源

**一个 code 决定七处命名**（PRD 16.1）：

| 命名 | `homeos` | `calendar` | `finance` |
|---|---|---|---|
| 服务 | `svc-homeos` | `svc-calendar` | `svc-finance` |
| schema | `homeos` | `calendar` | `finance` |
| 路由 | `/api/homeos/*` | `/api/calendar/*` | `/api/finance/*` |
| 事件前缀 | `homeos.` | `calendar.` | `finance.` |
| 表前缀 | `homeos_` | `calendar_` | `finance_` |
| 前端分包 | `pages/homeos`（主包内） | **主包内，不建分包** | `pages/finance` |
| 迁移文件 | `homeos_{seq}_{desc}` | `calendar_{seq}_{desc}` | `finance_{seq}_{desc}` |

**面目录当前三个 code**：`homeos`、`calendar`（两个系统级面，不可停用）+ `finance`（唯一业务面，可开通停用）。

### 4.1 为什么 calendar 不建分包

日历页在**主包**内。理由：首页 B 区「今日区」的 `due_today` 恒需到期数据（PRD 3.9.1）。

>⚠ **PRD 内部矛盾**：`homeos` 的页面也在主包内（17.7 第 4 条把主包内容穷举为 `pages/homeos` + Calendar 三页），但 3.9.1 说「这是全文**唯一的**分包域例外」、22.5 第 4 道也说「calendar 是唯一例外」。本方案按**两个系统级面都不建分包**实现（依22.5 的减法），见 §九 #2。

---

## 五、数据模型

### 5.1 全局通用列

**每一张业务表都必须有**（PRD 22.2#9 + 14.7）：

```sql
id           UUID PRIMARY KEY,
family_id    UUID NOT NULL,                    -- 多租户隔离的唯一依据
version      INTEGER NOT NULL DEFAULT 1,       -- 乐观锁
deleted_at   TIMESTAMPTZ,                       -- 软删，不物理删
deleted_by   UUID,
created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
```

**三条铁律**：
1. **金额一律 `*_cents BIGINT`**，禁止浮点（浮点在累加与比较上必然出偏差）
2. **软删而非物理删** —— 分类与账户更是**只提供停用/归档，连软删都不给**
3. **每条查询都带`WHERE family_id = ?`** —— 这是多租户隔离的唯一执行点

### 5.2 HomeOS 表（14 张）

#### 身份与权限

| 表 | 关键字段 | 说明 |
|---|---|---|
| `homeos_family` | `name`、`avatar`、`timezone`、`currency`、`feature_flags` | `timezone` 与 `currency` 都必须有；`feature_flags` **只放非面开关**，不含面开关 |
| `homeos_family_module` | `family_id`、`code`、`enabled`、`enabled_at`、`enabled_by`、`version` | **本家庭启用哪些面的唯一权威源**。`UNIQUE(family_id, code)`。**无行即未启用**。两个系统级面不写此表 |
| `homeos_member` | `family_id`、`user_id`（**可空**）、`name`、`relation`、`role`、`avatar`、`status`、`guardian_id` | `user_id` 可空 = 无账号被记录成员（儿童/老人）。`relation` 是家庭内称谓（爸爸/奶奶）的权威字段 |
| `homeos_role` | `name`、`permissions` | 固定四种：owner / member / ward / guest。**已退出成员是展示态，不是角色** |
| `homeos_permission` | `scope`、`resource`、`action`、`condition` | `scope ∈ module/data/action` |

#### 协作与通知

| 表 | 关键字段 | 说明 |
|---|---|---|
| `homeos_notification` | `member_id`、`type`、`content`、`read_at`（可空）、`channel`、`dedupe_key` | `type` 固定三类：`budget_alert` / `system` / `reminder`。**未读 = `read_at IS NULL`**，按 `member_id` 聚合，上限显示 `99+`（**唯一口径源**）。L3 内容不得进 `content` |
| `homeos_dynamic` | `family_id`、`source`、`action`、`payload` | **写入路径只有事件总线**，业务面不得直接写 |
| `homeos_vote` | `family_id`、`question`、`options`、`mode`、`deadline` | P1 建表并判定，但**当前无创建入口**（原宿主随面移出） |
| `homeos_file` | `owner_id`、`type`、`url`、`size`、`hash` | **附件的唯一归属在 homeos**。`uploads/{family_id}/`，单笔 ≤3 张、单张 ≤5MB、jpg/png/webp |
| `homeos_rule` | `name`、`condition`、`action`、`priority`、`enabled` | **只留位置不实现** —— 规则引擎交付期待定 |

**不建表**：`DataLevel` 落地为 `contracts/data-levels.yaml` 静态清单。

#### 运行表族（不在业务表内）

`homeos_outbox`、`homeos_event_dedupe`、`homeos_dead_letter`、`homeos_change_log`、`homeos_idempotency`、`homeos_proj_*`、`homeos_search_index`、`homeos_audit_log`、`homeos_event_archive`

>⚠ 见 §九 #1：`homeos_event` 表归属未定义。

### 5.3 Calendar 表（3 张）

| 表 | 关键字段 | 说明 |
|---|---|---|
| `calendar_event` | `family_id`、`source_system`、`source_id`、`title`、`start_at`、`end_at`、`members`、`repeat`、`visibility` | **各面到期型对象的统一聚合载体**。`repeat` 是周期规则载体，**不另建规则表** |
| `calendar_todo` | `family_id`、`member_id`、`title`、`due_at`、`status`、`source_system`、`source_id`、`done_returns_to` | `done_returns_to` 指定完成回写目标 |
| `calendar_reminder` | `owner_id`、`type`、`trigger_at`、`repeat`、`status`、`calendar_event_id` | 到点发 `calendar.reminder.fired` |

**注册幂等键**：`(source_system, source_id, kind)` —— 三张表共用的唯一去重依据。

> ⚠ **`calendar_reminder` 缺 `family_id`** —— PRD 3.9.5 只给了 `owner_id`，但按家庭过滤必须有 `family_id`。这是 PRD 审核发现的阻塞项，本方案补上，见 §九 #3。

### 5.4 Finance 表（16 张）

| 表 | 关键字段 | 说明 |
|---|---|---|
| `finance_account` | `name`、`type`、`balance_cents`、`currency`、`owner_id`、`is_default`、`credit_bill_day`、`repay_day`、`is_archived`、`archived_at` | 每家庭至多一个 `is_default`。**余额非 0 时归档被拒** |
| `finance_transaction` | `account_id`、`type`、`amount_cents`、`category_id`、`member_id`、`tags`、`note`、`receipt`、`occurred_at`、`ledger_id`、`generated_by`、`on_behalf_of`、`to_account_id`、`client_request_id`、`is_private` | **幂等键 `UNIQUE(family_id, client_request_id)`**。`receipt` 是 `file_id` 逻辑引用，**无物理外键**。`generated_by` 标记生成型单据 |
| `finance_category` | `family_id`（**可空=预置**）、`parent_id`、`name`、`icon`、`color`、`type`、`is_active`、`sort_order` | **全家庭唯一费用字典**。图标用图标集名，**禁 emoji** |
| `finance_budget` | `scope`、`period`、`amount_cents`、`used_cents`、`alert_at`、`carry_over` | 主表。**按周期归零的语义在 `budget_period` 上** |
| `finance_budget_period` | `budget_id`、`period`、`amount_cents`、`used_cents`、`carried_in_cents` | 预算周期行。`UNIQUE(budget_id, period)` |
| `finance_recurring_rule` | `ledger_id`、`type`、`amount_cents`、`frequency`、`next_at`、`is_active`、`client_request_id` | 周期记账规则。**本表不自建定时器**，到点触发经 calendar |
| `finance_ledger` | `name`、`type`、`members`、`permission` | **仅为报表分组，不是数据隔离域也不是权限边界** |
| `finance_split` | `ledger_id`、`transaction_id`、`participants`、`shares`、`settled_at` | AA 分摊载体。**Σ各参与人净额 = 0** |
| `finance_settlement` | `split_id`、`from_member`、`to_member`、`amount_cents` | 结算留痕 |

M2 才建：`finance_loan`、`finance_repayment_plan`、`finance_goal`、`finance_liability`、`finance_invoice`

> ⚠ `finance_transaction.is_private` 在 PRD 4.7 的字段表里**没有**，但 15.4 的行级可见性和 18.3#8 的验收都依赖它。本方案补上，见 §九 #4。

### 5.5 金额与时间的硬口径

| 项 | 口径 |
|---|---|
| 金额存储 | `*_cents BIGINT`，**禁浮点** |
| 金额传输 | 参数用整数分，**不用字符串、不用浮点** |
| 时间存储 | `TIMESTAMPTZ`，一律带时区 |
| 时间窗五档 | `day` / `week` / `month` / `quarter` / `year`，编码 `YYYY-MM-DD` / `YYYY-Wnn` / `YYYY-MM` / `YYYY-Qn` / `YYYY` |
| **非法编码** | **返回 400，不回落默认档**（静默回落是最难查的一类 bug） |

---

## 六、接口设计

### 6.1 三条登记面规则

1. **路由必须分域** `/api/{code}/*`，不允许根路径业务接口
2. **未登记即缺陷**：实现里用到但没登记的接口，必须先补进登记表
3. **鉴权不因反代豁免**：Nginx 只做前缀转发与 TLS，鉴权仍在服务内中间件

### 6.2 统一响应体

```json
{
  "code": 0,
  "message": "ok",
  "data": {},
  "request_id": "uuid"
}
```

**错误码分段**：

| 段 | 含义 | 示例 |
|---|---|---|
| 0 | 成功 | |
| 1001-1010 | 认证与令牌 | 1001 token 过期 / 1002 refresh 无效 |
| 3001-3004 | 家庭与成员 | 3001 无此家庭 / 3002 权限不足 |
| 4001-4002 | 业务规则 | 4001 余额非 0 不能归档 |
| 5000 | 服务端错误 | |

**越权一律返 404 不返 403** —— 403 等于告诉攻击者「东西存在」。

### 6.3 游标分页

**不用 offset**（大数据量下会跳数据、且深翻页性能崩）。

请求：`?cursor={last_id}&limit=20`
响应：`{ items: [...], next_cursor: "..." | null }`

排序字段必须有索引，游标值即最后一条的排序键。

### 6.4 接口清单总览

| 系统 | 登记条数 | P1 实施 | 说明 |
|---|---|---|---|
| HomeOS | 51 | ~45 | 砍搜索 1、规则 1、AI 归类 1；补认证 4、头像上传 1 |
| Calendar | 9 | 9 | 全建 |
| Finance | 45 | **区间：~39（若砍）／~44（若不砍）** | 账单 5 条接口是否砍见 §九 #6（待人类拍板，砍/不砍口径尚未统一）；**本行数字在 #6 定版前只是区间，不许当已定数引用**；其余 M1/M2 全建 |
| **合计** | **105** | **区间：~93（若砍 bills 5）／~98（若不砍）** | 随 §九 #6 定版后重算，定版前不引用单值 |

**逐条清单待产出**：按 PRD 3.7（L383-L421）、3.9.6（L493-L500）、4.8（L692-L721）三张登记表展开为可勾选清单，每条带 P1 实施状态。**这一步要在 S2 开工前完成**——它是接口的施工分母。

> 展开时注意：PRD 一行常登记多条接口（如 L404 一行三条 auth），**行数 ≠ 接口数**。

> ⚠ **现行缺口（逐条清单产出前须知）**：实测各阶段卡片里 `/api/calendar/*` 去重已达 **22 条** > 本表登记的 9 条（PRD 3.9.6），`/api/finance/*` 去重 **73 条** > 本表登记的 45 条，均违反 §6.1 第 2 条「未登记即缺陷」。多出的接口名例如 `/registrations`、`/stats`、`/digest`、`/events/{id}/share`，以及 `/reminder`（**单数形**，与登记面的复数 `reminders` 不同形）。**处置**：这些接口要么补入登记面（回到 PRD 3.9.6 / 4.8 登记表），要么由对应阶段卡片改口径收敛回已登记路径；在逐条清单产出前，本表条数不作为放行依据。

### 6.5 三个必须记住的接口口径

**① 首页单请求**

```
GET /api/homeos/home/summary?period=YYYY-MM
```
**首页四区 + 未读红点 + 面矩阵全部由它带出**。前端不得并行请求多个服务拼装。这是可抓包断言的硬约束。

**② 权限快照**

```
GET /api/homeos/permissions/snapshot    If-None-Match: {pver}  → 304
```
只给服务间用，**不对客户端开放**。`family_overrides` 与 `object_acls` 在 P1 **恒返回空数组但保留形状**。

**③ 到期中心读**

```
GET /api/calendar/events?view=day|week|month
```
`homeos` 的 `due_today` 走这条读。**调用必须声明超时 ≤300ms、重试 ≤1 次、失败降级**。

---

## 七、跨系统协作

### 7.1 读取的三种方式（封闭集合，且仅此三种）

| 方式 | 适用 | 约束 |
|---|---|---|
| **① 只读 HTTP** | 实时查询 | 超时 **≤300ms**、重试 **≤1 次**、**必须声明降级结果**。禁止跨 schema SQL（含只读视图） |
| **② 事件 + 本地投影** | 高频渲染 | 投影表 `{code}_proj_{来源域}`，只允许本服务订阅器写，可随时重建。**渲染密集的他面数据一律走此路，不在请求链路上 fan-out** |
| **③ 逻辑 id 引用** | 金额、附件 | 只存对方 `id`，**无物理外键、禁止存金额副本**。孤儿引用进每日对账 |

**禁止**：一次请求内同步 fan-out 超过 1 个他服务。

### 7.2 写只有一条路：事件

```
业务面写自己的表
   ↓ 同一事务内写outbox
提交
   ↓ 投递器
NATS JetStream（subject = {code}.{object}.{action}）
   ↓ 订阅方（独立 consumer group）
落自己的表
```

**不存在跨服务分布式事务。** 一次写只落在一个服务，跨面效果一律最终一致。

### 7.3 到期注册契约

```
finance 有 due_at
   ↓ 同一事务内登记注册意图 → outbox
{code}.due.registered
   ↓ svc-calendar 消费，幂等键 (source_system, source_id, kind)
落 calendar_reminder / calendar_event
   ↓ 到点
calendar.reminder.fired
   ↓ svc-homeos 消费
落 homeos_notification（分型 reminder）
   ↓ 用户点完成
calendar.todo.completed → 回写来源面对象
```

**三条不可破的规则**：
1. 业务面**不得自建定时器与推送链路**
2. 业务对象删除 → 注册项**级联失效**
3. 在到期中心完成 → **必须回写业务对象状态**，不回写视为缺陷

### 7.4 事件信封（13 字段）

```json
{
  "event_id": "uuid",
  "type": "finance.budget.exceeded",
  "source": "finance",
  "business_id": "budget_id:period",
  "family_id": "uuid",
  "member_id": "uuid",
  "payload": {},
  "version": "1.0",
  "created_at": "ISO8601",
  "idempotency_key": "finance.budget.exceeded:{business_id}",
  "causation_id": null,
  "attempt": 0,
  "delivery": "stream"
}
```

**最容易搞错的三个字段**：
- `event_id` **不作幂等键**，只用于单条追溯
- `business_id` 是**信封字段**，由发布方按约定填，**不是对象 id**
- `idempotency_key` = `event_type + business_id`

### 7.5 当前事件目录

| 事件 | 发布方 | 消费方 | `business_id` |
|---|---|---|---|
| `calendar.reminder.fired` | calendar | homeos | `{reminder_id}:{fire_date}` |
| `calendar.todo.completed` | calendar | 来源面 | `{todo_id}` |
| `{code}.due.registered` | finance | calendar | `{source_id}:{due_at}` |
| `{code}.due.revoked` | finance | calendar | `{source_id}` |
| `finance.bill.paid` | finance | calendar | `{bill_id}` |
| `finance.budget.exceeded` | finance | homeos | `{budget_id}:{period}` |
| `finance.transaction.created` | finance | homeos（动态流） | `{transaction_id}` |
| `homeos.permission.updated` | homeos | 全部 | 待定版 |
| `homeos.family.module.updated` | homeos | 全部 + 客户端 | `{family_id}:{code}:{version}` |
| `{code}.audit.recorded` | 全部 | homeos | `{record_id}` |

**事件治理**：at-least-once +消费端幂等；重试指数退避最多 3 次；超限进死信；**不承诺全局有序**，只承诺同一 `(source_system, source_id)` 分区内有序。

### 7.6 降级词四态（不可混用）

| 词 | 含义 |
|---|---|
| **未启用** | 本家庭没挂载这个面（`homeos_family_module` 无行） |
| **即将上线** | 这个面还没出生（服务不存在） |
| **暂不可用** | 面已启用，但本次服务不可达或分包校验失败 |
| **依赖未就绪** | 本面可用，但它依赖的另一面没出生 |

`homeos` 与 `calendar` **恒启用恒出生**，二者不可达时只记「暂不可用」。

### 7.7 故障隔离

| 故障 | 表现 | 恢复 |
|---|---|---|
| `svc-calendar` 不可达 | **只影响到期**，首页今日区显示「暂不可用」+ 保留到期入口 | 恢复后**不得补发风暴** |
| `svc-finance` 不可达 | 首页财务格「暂不可用」，其余区照常 | 恢复后正常 |
| `svc-homeos` 不可达 | 整个 App 登录态受影响 | — |
| 权限 SDK 不可达 | **拒绝写、允许读已缓存**，落审计 | — |

---

## 八、鉴权与权限

### 8.1 四级角色

| 角色 | 可登录 | 关键限制 |
|---|---|---|
| **owner** 管理员 | 是 | 唯一可转让/解散；**不能移除自己** |
| **member** 成人成员 | 是 | 不能管理成员与邀请 |
| **ward** 儿童/老人 | **可无账号** | 由 `guardian_id` 指向监护人，代管写入带 `on_behalf_of` |
| **guest** 访客 | 是（临时） | 限时只读，默认 30 天，可撤销，**不可导出** |

「已退出成员」是展示态不是角色：数据留家庭，作者显示「已退出成员」。

### 8.2 三维权限模型

```
Permission(scope, resource, action, condition)
```

| scope | 取值 | 判定输入 |
|---|---|---|
| `module` | 某面整体可见/可用 | **唯一输入是 `homeos_family_module`** |
| `data` | 当前会话家庭 / 本账本 / 本人 / 指定成员 | token 内的 `family_id` |
| `action` | `read` / `create` / `update` / `delete` / `export` / `invite` / `admin` | |

`condition`：时间窗（访客有效期）、字段（L3 需二次确认）、对象归属（`author == me`）。

**判定顺序**：显式拒绝 > 角色默认矩阵 > 家庭级覆盖 > 对象级 ACL。

### 8.3 P1 的鉴权边界

**P1 只实现三层**：
1. 角色默认矩阵
2. `scope=module` 的面挂载判定
3. 字段级可见性（含**私密流水的行级可见性**——这条 P1 必须做）

**P1 不做**：家庭级覆盖、通用对象级ACL（这两层随规则引擎出生，交付期待定）。

响应里 `family_overrides` / `object_acls` **恒返回空数组但保留形状**。

> ⚠ **不许混层**：私密流水的行级可见性属「字段与行级」，**不是**「对象级 ACL」。混了会让私密流水无层可落。

### 8.4 权限矩阵（25 格）

| 系统 | owner | member | ward（有账号） | ward（无账号） | guest |
|---|---|---|---|---|---|
| HomeOS（成员/权限/设置） | **A** | R + M（写监护对象基础字段） | — | 监护人代写 | — |
| HomeOS · 面配置 | **A** | R（只读渲染） | R | — | R |
| Calendar · 时间与到期对象 | **A** | M（不可删他人） | M | 监护人代写 | M（勾选完成） |
| HomeOS · 协作对象 | **A** | M（不可删他人） | M | 监护人代写 | M |
| 财务 | A | M 写 + R 全家庭读 | **—** | 被记录（无写） | **—** |

图例：**A** = 全部、**M** = 仅自己的、**R** = 只读、**—** = 无权限。

>⚠ **PRD 内部矛盾**：财务行给 ward 与 guest 是「—」（无权限），但 15.4 说「财务金额全家可读」、15.3 下方说「儿童默认不能记账（**无写权限**）」——后者预设了有读权限。本方案按**「—」为准**（与 17.8「可见集为 0 格」自洽），见 §九 #5。

### 8.5 token 里放什么

**放**：`uid`（用户）、`mid`（成员）、`fam`（当前会话家庭）、`role`（角色快照）、`pver`（权限版本）、`typ`（token 类型）

**不放**：密码、敏感字段、其他家庭的列表

**双 token**：
- `access`：15 分钟过期，带角色快照
- `refresh`：30 天，**存哈希不存明文**，每次使用即轮换（旧 token 立即作废）

**登出 / 重置密码 → 该用户所有 refresh token 立即失效**，不等自然过期。

### 8.6 权限缓存

- 进程内缓存 TTL 60 秒 + 数据库层 `pver` 比对
- 收到 `homeos.permission.updated` **立即失效**
- **生效时限 ≤1 秒**

---

## 九、需定版清单

**本方案不替 PRD 做决定。** 以下是实施前必须由人拍板的：

| # | 事项 | 冲突/缺失 | 建议 | 状态 |
|---|---|---|---|---|
| 1 | `homeos_event` 表去留 | 3.6 列为业务实体，但既不在 16.2 也不在 22.5 后缀白名单 → 门禁 2 必失败。而事件日志的权威载体是 JetStream 流本身 | **不建表**，把 3.6 的 `Event` 实体改名为 `Outbox` | 仍待人类拍板（§5.2 处仅标「归属未定义」，无定版落点） |
| 2 | 分包域例外 | 3.9.1 与 22.5 都说「calendar 是唯一例外」，但 22.5 的口径是减去**两个**域 | 统一为「两个系统级面都不建分包」 | 已定版 → §4.1（两个系统级面都不建分包；与 PRD 22.5 第 4 道同源） |
| 3 | `calendar_reminder` 缺 `family_id` | 3.9.5 只给 `owner_id`，但按家庭过滤必须有 | **补 `family_id`** | 已定版 → §5.3（本方案补 `family_id`）。**待回写 PRD**：PRD 3.9.5 的 calendar_reminder 字段表（第 487 行）尚未回写 `family_id` |
| 4 | `finance_transaction` 缺 `is_private` | 15.4 行级可见性、18.3#8 验收都依赖它，4.7 字段表里没有 | **补 `is_private`** | 已定版 → §5.4（`is_private` 已入字段表）。待回写 PRD 4.7 字段表 |
| 5 | 15.3「—」vs 15.4「全家可读」 | 财务行给 ward/guest 是无权限，但 15.4 说全家可读 | 按 15.3 的「—」为准，改 15.4 措辞 | 已定版 → §8.4（ward/guest 财务行按「—」为准） |
| 6 | 账单 5 条接口是否砍 | 若砍，`finance_bill` 表、16.4 的 M1 注册行、3.9.3「本机制有样本不空转」四处同时失去对象 | **建议不砍**，改 family-ledger 的范围 | 仍待人类拍板（§6.4 登记「砍 bills 5」与本章建议「不砍」口径相左，须统一） |
| 7 | 主键类型 | PRD 未定义，10.2 信封示例用 uuid | **建议 uuid** | 已定版 → §5.1（通用列 `id UUID PRIMARY KEY`） |
| 8 | `homeos.permission.updated` 的 `business_id` | 10.4 只钉死了四条 | 建议 `{family_id}:{member_id}:{version}` | 仍待人类拍板（§7.5 事件目录对本条仍标「待定版」） |
| 9 | `calendar_todo` 的子任务字段 | 3.9.2 要求支持子任务，3.9.5 无对应字段，且 3.9.5 声明「不新增字段」 | 本期不做，或复用 `parent_id` | 仍待人类拍板（§5.3 `calendar_todo` 无子任务字段，建议未落正文） |
| 10 | 5 条补登记接口的路径 | PRD 只说要补，没给路径 | 按命名同源推得 `/api/homeos/auth/*` 与 `/api/homeos/files` | 仍待人类拍板（路径未落 §6.4，逐条清单待产出） |

---

## 十、工程约定

### 10.1 十条硬约定

| # | 约定 |
|---|---|
| 1 | 金额一律 `*_cents BIGINT`，禁浮点 |
| 2 | 业务表软删 `deleted_at` + `deleted_by` |
| 3 | 所有写接口带 `client_request_id` 幂等键 |
| 4 | 列表强制游标分页，不接受无上限返回 |
| 5 | 预置数据用可空 `family_id` 表达 |
| 6 | 附件 `uploads/{family_id}/`，≤3 张、≤5MB、jpg/png/webp |
| 7 | 图标用图标集名，**禁 emoji** |
| 8 | 表前缀 `{code}_`，迁移放 `migrations/{code}/`，不跨 schema join |
| 9 | 模块间禁直查表，跨模块调用收在 `platform` 接口后面 |
| 10 | 七类命名同源 |

### 10.2 CI 五道门禁

与 PRD 22.5 同源同名，**共五道**，任一命中即阻断合并或发布：

| # | 门禁 | 检查什么 |
|---|---|---|
| 1 | **迁移门禁** | 迁移只重放本服务序列、只碰本 schema，测试库可全量重放 |
| 2 | **归属门禁** | 业务表必须命中 16.2 或运行表白名单；前缀与所在服务一致；无跨域同构实体 |
| 3 | **验收门禁** | 十八章指标接入自动化测试报告，**未达标不得进灰度**；发布按家庭白名单灰度，回滚 = 切回原镜像 tag + 恢复备份。`go test -race` 绿并入本道（属 CI test/build 阶段的自动化测试报告项） |
| 4 | **分域与鉴权门禁** | 路由全在 `/api/{code}/*`；handler 内无自写角色判定；业务表带 `version` 与软删；无跨 schema SQL；跨服务只读声明了超时重试降级；前端分包集合 = registry 域集合减去两个系统级面 |
| 5 | **契约门禁** | OpenAPI 与事件目录进版本控制，向后兼容检查（删字段、改类型、改必填、改 subject 命名须升 version）；发布的事件必须在目录内 |

### 10.3 架构红线（自第一行代码起生效）

PRD 22.2 明确这几条**不接受「先这样以后再改」**：

1. **数据库账号即边界** —— 禁止跨 schema SQL、DBLink、只读视图、共用账号
2. **跨面读取三选一** —— 不引入第四种方式
3. **联动一律走事件** —— 禁止在请求链路上同步调用他服务写接口
4. **鉴权单一实现** —— handler 内禁止自写角色判定分支
5. **路由必须分域**
6. **写模型必须有 version 与软删**

### 10.4 Makefile 命令

```bash
make build          # 编译三个服务
make test           # 跑全部测试
make race           # -race 检测
make lint           # vet + golangci-lint
make migrate-up     # 迁移正向
make migrate-down   # 迁移回滚
make dev            # 本地起全套
make verify         # 五道门禁全跑
```

---

## 十一、部署

### 11.1 形态

单家庭自托管。Docker Compose 起全套：三个服务 + Postgres + NATS JetStream + Nginx。

**发布顺序**：两个系统级面（`svc-homeos`、`svc-calendar`）先于 `svc-finance`。

**单服务可独立升级**：换镜像 tag 即可，不影响其他服务。

### 11.2 备份与恢复

| 项 | 口径 |
|---|---|
| 全量备份 | 每日 |
| 增量 | binlog / WAL 连续归档 |
| **RPO** | **≤ 15 分钟** |
| **RTO** | **≤ 30 分钟** |
| 演练 | **未演练的备份视为无效备份** |

**不允许只恢复单个 schema** —— 跨面数据有引用关系。

---

## 十二、与 PRD 的偏离与取舍

| 项 | PRD | 本方案 | 理由 |
|---|---|---|---|
| 全局搜索 | P1-M1 交付 | 关键词部分做，自然语言留位置 | PRD 内部对此有两处口径，本轮未解决 |

---

*本方案与 PRD 同源。**PRD 变更后本文须复核三类口径**：一是 CI 五道门禁（§10.2 与 PRD 22.5 逐道对照），二是接口清单（§6.4 与 PRD 各登记表条数），三是数据表数（§5.2 / §5.3 / §5.4 的 HomeOS 14 张 / Calendar 3 张 / Finance 16 张）。另重点核 §九「需定版清单」十项是否已有结论。*
