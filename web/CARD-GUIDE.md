# 日卡生成规范

所有 agent 写日卡前必读。目标是让**零基础前端背景的学员看完就能动手，不需要再查别的资料**。

## 数据格式

写入 `~/www/study-plans/web/public/cards/{stage}.json`（小写文件名，如 `S4.json` → `public/cards/S4.json`）。

接口定义见 `web/src/data/types.ts`。**字段必须完全对齐，一个都不能少。**

```json
[
  {
    "id": "s4-d1",
    "stage": "S4",
    "day": 1,
    "week": 13,
    "title": "标题要具体，不要泛泛",
    "goal": "今天学完后，你能……（用「能」开头的具体动作）",
    "duration": "60 分钟",
    "why": {
      "problem": "为什么这个问题存在。必须用一个具体场景说明「不做会怎样」，不是抽象定义",
      "naive": "新手最容易犯的错。要写他脑子里那个想当然的念头",
      "right": "正确做法与理由"
    },
    "concepts": [
      {
        "name": "概念名",
        "explanation": "至少 200 字。先讲它解决什么问题，再讲它是什么。**必须与 TypeScript/JavaScript 对比**",
        "analogy": "生活类比，读者是前端，用前端能懂的类比优先"
      }
    ],
    "code": {
      "lang": "go | bash | sql | json | text | tsx",
      "filename": "路径，如 lab/s4/d01/main.go",
      "content": "最后一步整体对拍用的**完整文件**，仍然必须可运行。Go 必须含 package main 与 func main()",
      "run": "具体到能复制执行的命令，含 cd 到项目根",
      "expect": "**真实运行输出**，不是手写想象。要具体到能逐字对照",
      "build": [
        {
          "n": 1,
          "title": "≤20 字的动作句，说清这一步在加什么",
          "add": "这一步新增的代码行块（必须是 content 里的连续行）",
          "place": "加在哪儿：相对上一步的位置",
          "note": "为什么先加它，而不是留到后面才加",
          "check": "这一步做完能看到什么（见「check 铁律」）"
        }
      ]
    },
    "steps": [
      { "n": 1, "title": "步骤名", "detail": "具体操作，含命令。多行命令用 ``` 包起来", "time": "10 分钟" }
    ],
    "pitfalls": [
      { "wrong": "错误做法或错误认知，要写得像读者真实会想的那样", "right": "正确做法", "why": "为什么会这样，要讲清机理" }
    ],
    "quiz": [
      { "q": "问句，要考理解不是考记忆", "options": ["A选项","B选项","C选项","D选项"], "answer": 0, "explain": "为什么是这个答案，要讲清理由" }
    ],
    "task": {
      "title": "今天要完成的产出",
      "acceptance": ["可判定的验收标准", "..."],
      "hint": "卡住了看这里。要给具体的排查步骤，不是泛泛鼓励"
    },
    "tomorrow": "明天学什么，一句话"
  }
]
```

## 数量硬指标（每张卡）

| 字段 | 下限 | 说明 |
|---|---|---|
| `concepts` | 3 个 | 每个 `explanation` ≥200 字 |
| `pitfalls` | 3 条 | **必须是 Go/JS 不同的坑**，或「这个操作 JS 里没坑但 Go 有」 |
| `quiz` | 4 题 | `answer` 是 options 的下标（0 起） |
| `steps` | 5 步 | 每步带 `time` |
| `task.acceptance` | 3 条 | 每条都要能用「是/否」判定 |

## 内容原则

### 1. 零基础友好

**不能用术语代替解释。** 说「这是工作区」之前要先说「你电脑里存着的那些文件」。

每个新概念的三段式：
1. **它解决什么问题**（用具体场景）
2. **它是什么**（这时候才给定义）
3. **和 TypeScript 怎么对应**（读者的最强武器）

### 2. 必须与 TypeScript 对比

读者有 React/TS 基础，这是他最快的学习路径。每个 Go 概念都要对照：

| Go | TypeScript / JavaScript |
|---|---|
| `struct` | interface / type，但**值语义**，赋值是复制 |
| `:=` | `let` |
| 零值 | `undefined`，但 Go 的零值是「可用」的值（0 / "" / false / nil） |
| `interface` 隐式实现 | `implements` 显式声明 |
| `error` 返回 | try/catch + throw |
| `defer` | try/finally |
| goroutine | Promise / 异步任务 |
| channel | 消息队列 / EventEmitter |
| `nil` | `null` + `undefined`（Go 只有 nil） |
| map | object / Map |
| slice | array，但**长度可变、共享底层** |
| 指针 `*T` | 引用，但 Go 的指针不能算术、有 nil |

### 3. 代码必须能跑

**这台机器有 Go**：

```bash
export PATH="$HOME/.workbuddy/binaries/go1.22.5/bin:$PATH"
go version   # go1.22.5 darwin/amd64
```

验证沙箱在 `/tmp/s3v`（已配好 gin + gorm 离线依赖），可以直接用：

```bash
cd /tmp/s3v
mkdir -p lab/s4/d01
# 写代码到 lab/s4/d01/main.go
gofmt -l lab/s4/d01/        # 格式检查，应无输出
go vet ./lab/s4/d01/        # 静态检查，应无输出
go run ./lab/s4/d01 > /tmp/o1.txt 2>&1
go run ./lab/s4/d01 > /tmp/o2.txt 2>&1
diff /tmp/o1.txt /tmp/o2.txt && echo "输出确定✅"
```

**`expect` 必须是真实 stdout。** 手写想象会错，而且错得很难发现。

**并发类代码必须输出确定**：用 channel 或 `sync.WaitGroup` 收集后排序，不要写「顺序可能不同」这种敷衍。真正的非确定值（goroutine 绝对数量、耗时）要在 `expect` 里明确标注哪些是变量、该断言什么关系。

### 4. 「今天的代码」要分步长出来（`code.build`）

一次性把上百行成品甩给读者，违背循序渐进。每张卡的「今天的代码」必须是 **逐步引导 → 逐步完善 → 最后一次性完整输出对拍**：`code.build` 是分段增量，`content` 仍是最终那份完整文件。

- `content` / `run` / `expect` 的语义变成「最后一步整体对拍用的完整文件」——**它仍然必须真的可运行**，老规矩一条没减。`build` 只是它的分段展示与增量说明，不是另一份代码。
- `build` 在类型上是可选（迁移期允许缺），但**你新写/改写的卡必须给**。4–6 步是常用区间，长文件可到 8 步。步骤与这张卡的 `steps[]` 呼应即可，不必一一对应。
- 前端渲染：有 `build` → 标题「今天的代码（分 N 步长出来）」+ N 个步骤卡 + 末尾**默认折叠**的「完整文件（对拍用，共 X 行）」；没有 `build` → 退回整块渲染。

**硬性不变量（脚本会机械校验，必须成立）**

把各步 `add` 去掉尾部换行后按 `n` 升序拼接、按 `\n` 切行，得到的行数组，必须与 `content` 去掉尾部换行后按 `\n` 切出的行数组**逐行完全相等**。等价说法：文件是按行顺序一段一段长出来的，每一步的 `add` 都是它的连续片段，不重不漏。

切的时候照抄这段，别手搓字符串（手抄一定会漏行/多空格）：

```python
lines = content.rstrip('\n').split('\n')
def seg(a, b):                       # 1 基、闭区间：第 a 行到第 b 行
    return '\n'.join(lines[a - 1:b]) + '\n'
```

两条实操规矩：

1. **切点只落在「一整段声明结束」的那一行**（Go 里就是函数 / struct 收尾的 `}`），不要从函数中间切——那一步的中间状态连语法都不完整。
2. **段与段之间的那个空行归下一步 `add` 的开头**，不要留在上一步末尾。`add` 尾部的换行会被剥掉，留在末尾等于这个空行没写；两步都写就变成重复一行，校验一定失败。

**切点优先照抄文件自己已经画出来的分段线。** 卡里的 `content` 绝大多数已经用 `// ===== xxx =====`、`-- =====` 这类注释把文件分成了职责段（全站 1000+ 处），那就是原作者留下的天然步骤边界：**分隔线那一行归下一步的开头**，`title` 直接继承它的小标题（如「platform/response：统一响应体」），不要另起一套说法。**只有当一张卡的分段线不足、或分段线切出来的某一步远超下述上限时**，才落到「规矩 1」按声明边界自己切。

**每一步的行数上限：60 行。** 步数由内容长度决定，不是凑数：

```
步数 = clamp(ceil(content 行数 / 60), 4, 12)      # 短文件也要 4 步起，长文件封顶 12 步
```

- `content` ≤15 行的极短卡：2-3 步即可，别硬切到 4 步。
- 算出来要超过 12 步（即 `content` > 720 行）：**不要硬切成 12 大步**，在报告里把这张卡单列为「这段代码本身该拆成两张日卡」，让主 agent 裁决。切成 8 步、每步 120 行等于没解决问题。

**`check` 铁律（禁止编造）**

`check` 只能写下面两类之一：

1. 本步的文件状态**真的能跑**：给复制即用的命令 + **你在沙箱实跑过的**真实输出。没跑过的输出一个字都不许写。
2. 本步**还跑不起来**（Go 卡很常见，例如只有 package/imports 还没有 func main）：明写「这一步还跑不起来：<为什么>，<哪一步补上什么> 之后才第一次能跑」，这类**不写任何输出**。

Go 卡的典型形态就是前面几步全属第 2 类（没有 func main 就产不出可执行文件，没用到的 import 还会直接编译错误），只有最后一步补完 main 才属第 1 类。这是事实，不要为了好看硬编一个假的中途输出。bash / sql / node 类卡往往每步都能跑，那就逐个实跑再写。

其余字段：`title` ≤20 字动作句；`place` 说相对上一步的位置（如「紧接上一段之后」「在 func main() 里 fmt.Println 之前」）；`note` 讲**教学顺序的理由**（为什么先加它、为什么不晚加），不是复述这段代码在干什么。

样板卡：`web/public/cards/S2.json` 里的 `s2-d1`（6 步），直接照着它的粒度和语气写。

### 5. 没有数据库时怎么办

本机**没有 PostgreSQL**（S0 d3 会用 Docker 起）。

需要真跑数据库的地方，**用 Go 模拟**（内存 slice/map 模拟表），并在卡里明确告诉读者：「这段是逻辑模拟，S3 第 6 天你起真库后要把同样的逻辑跑在真 SQL 上」。

SQL / 迁移内容以**完整可执行的 DDL + 讲解**形式给出，不假装跑过。

**GORM DryRun 技巧**（可在无库时生成真实 Postgres SQL）：

```go
db, _ := gorm.Open(postgres.New(postgres.Config{
    DSN: "host=localhost user=x dbname=x sslmode=disable",
    DisableAutomaticPing: true,
}), &gorm.Config{DryRun: true})
// ... 之后 db.ToSQL(func(tx *gorm.DB) *gorm.DB { return tx.Find(&users) })
```

版本锁：pgx v5.6.0 + gorm.io/driver/postgres v1.6.0（更新的版本要 Go 1.25，本机装不了）。

### 6. 项目上下文

项目是 **HomeCube**（家庭记账 App），三个 Go 服务：

| 服务 | code | 负责 |
|---|---|---|
| HomeOS | `homeos` | 身份、家庭、成员、权限、通知下发、未读、同步、事件总线、动态流、面配置、首页聚合 |
| Calendar | `calendar` | 日历、待办、提醒、周期规则、**到期中心**（唯一聚合与触发方） |
| Finance | `finance` | 账户、流水、分类、预算、周期记账、报表、导出、附件 |

代码仓库 `~/www/homecube`，模块化单体但保留三服务边界。

**十条工程铁律**（写代码时必须遵守，也是教学要点）：

1. 金额一律 `*_cents BIGINT`，禁浮点
2. 业务表软删 `deleted_at` + `deleted_by`
3. 所有写接口带 `client_request_id` 幂等键
4. 列表强制游标分页，不接受无上限返回
5. 预置数据用可空 `family_id` 表达
6. 附件 `uploads/{family_id}/`，≤3 张、≤5MB、jpg/png/webp
7. 图标用图标集名，禁 emoji
8. 表前缀 `{code}_`，迁移放 `migrations/{code}/`，不跨 schema join
9. 模块间禁直查表，跨模块调用收在 `platform` 接口后面
10. 七类命名同源（服务/schema/路由/事件前缀/表前缀/分包/迁移文件）

**三条最容易被忽略但必须讲的**：
- 越权一律返 **404 不返 403**（403 等于告诉攻击者「东西存在」）
- 未设该周期预算要显「未设该周期预算」，**不能把月度预算乘 3 造假**
- 时间窗非法编码返 **400 不回落默认档**（静默回落是最难查的一类 bug）

### 7. 参考文件

| 文件 | 用途 |
|---|---|
| `~/www/study-plans/docs/tech-plan.md` | 技术方案：目录结构、数据模型、接口设计、跨系统协作、鉴权权限 |
| `~/www/study-plans/docs/plan/learning-plan.md` | 学习计划：该阶段的判据与产出清单 |
| `~/www/study-plans/web/public/cards/S3.json` | **内容标杆**，模仿这个深度与风格 |
| `~/www/study-plans/web/public/cards/S2.json` 的 `s2-d1` | **`code.build` 分步样板卡**，模仿它的切分粒度与 `check` 写法 |
| `~/www/study-plans/web/scripts/check_code_build.py` | `code.build` 不变量校验脚本（自检必跑） |
| `~/www/study-plans/docs/prd/prd-homecube.md` | 需求真源（行号见引用时标注） |

## 写法

```python
import json
data = json.load(open('public/cards/S4.json', encoding='utf-8'))  # 若已存在
data.append({...})
json.dump(data, open('public/cards/S4.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
```

`ensure_ascii=False`（中文不转义）、`indent=2`、末尾一个换行。

**只给已有卡补 `code.build` 时**（改卡的标准动作）：

```python
raw = open(path, encoding='utf-8').read()
data = json.loads(raw)
assert json.dumps(data, ensure_ascii=False, indent=2) + '\n' == raw  # 先确认格式能原样往返
card = [c for c in data if c['id'] == 's4-d1'][0]
card['code']['build'] = [...]          # 只加这一个键；content/run/expect 一个字节都不许动
open(path, 'w', encoding='utf-8').write(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
```

`build` 放在 `code` 对象最后一个键（`lang, filename, content, run, expect, build`），Python 3.7+ 的 dict 会按插入顺序保住这个次序。改完拿 `git diff` 眼看一遍：除了新增的 `build` 块，不该有任何别的行变化。

## 自检（必须做，把输出贴给主 agent）

```bash
export PATH="$HOME/.workbuddy/binaries/go1.22.5/bin:$PATH"
cd ~/www/study-plans/web
/Users/xuesh/.workbuddy/binaries/python/versions/3.13.12/bin/python3 -c "
import json
d=json.load(open('public/cards/S4.json',encoding='utf-8'))
wk={}
for c in d: wk.setdefault(c['week'],[]).append(c['day'])
print('总张数:',len(d))
print('W分布:',{w:len(v) for w,v in sorted(wk.items())})
req=['id','stage','day','week','title','goal','duration','why','concepts','code','steps','pitfalls','quiz','task','tomorrow']
print('缺字段:',[c['id'] for c in d if any(k not in c for k in req)] or '无')
print('概念<3:',[c['id'] for c in d if len(c['concepts'])<3] or '无')
print('坑<3:',[c['id'] for c in d if len(c['pitfalls'])<3] or '无')
print('自测<4:',[c['id'] for c in d if len(c['quiz'])<4] or '无')
print('步骤<5:',[c['id'] for c in d if len(c['steps'])<5] or '无')
print('概念<200字:',[c['id'] for c in d for x in c['concepts'] if len(x['explanation'])<200] or '无')
goc=[c['id'] for c in d if c['code']['lang']=='go' and 'package main' not in c['code']['content']]
print('Go卡缺package main:',goc or '无')
nb=[c['id'] for c in d if not c['code'].get('build')]
print('没有build的卡:',nb or '无')
sh=[x['id'] for x in d if x['code'].get('build') for s in x['code']['build'] if len(s['title'])>20]
print('build标题超20字:',sh or '无')
print('概念',sum(len(c['concepts']) for c in d),'坑',sum(len(c['pitfalls']) for c in d),'自测',sum(len(c['quiz']) for c in d))
"
```

**再跑 `code.build` 不变量校验（有 build 就必须过，退出码 0）**：

```bash
# 在仓库根（~/www/study-plans）或 web/ 下都能跑，路径找不到时脚本会自动按 web/ 再找一次
python3 web/scripts/check_code_build.py public/cards/S4.json      # 只查你这个阶段
python3 web/scripts/check_code_build.py                            # 全量：15 个文件、354 张
```

python 用本机这个绝对路径：`/Users/xuesh/.workbuddy/binaries/python/versions/3.13.12/bin/python3`（`python` 不在 PATH）。

它逐张检查：`n` 从 1 连续递增、每步 5 个文本字段非空、各步 `add` 拼接后与 `content` 逐行相等；缺 `build` 只计数不报错（迁移期兼容）。失败会打印卡 id、第几步、期望行数 vs 实际行数、第一处不一致的行号与两侧内容。

全部输出必须达标。**宁可少写几张，也不要产出概念不足 200 字、`expect` 没验证、`check` 编造输出的卡片**——那比不写更糟，因为它看起来完成了。
