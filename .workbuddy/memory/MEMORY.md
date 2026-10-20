# 项目长期笔记 · 家庭账本学习路线（study-plans）

## 内容结构约定（改内容前必读）

- 讲解：`web/src/roadmap/lessons/phaseN.md`，按 `<!--day N | core|normal|light-->` 分天，自测用 `::q` / `::a`，必须放在当天最后。
- 掌握闭环：`web/src/roadmap/mastery/phaseN.md`，按 `<!--day N-->` 分天，指令 `::pre/predict/ask/ans/debug/sym/code/transfer/scene/hint/crit`。
- 每日任务：`web/src/roadmap/days/phaseN.ts`（title/hours/tasks/deliver/pitfall/tag）。
- 阶段五讲解拆两片：`lessons/phase5.md`（D1–D13）+ `phase5b.md`（D14–D26）。
- 解析器：`lessons/index.ts`（切天 + 剥自测 + 估时 280 字/分钟、代码 22 行/分钟、每题 0.8 分钟）、`mastery/index.ts`（逐行状态机；进入新题块必须把其他指针置 null）。

## 内容质量基线（2026-10-20 逐日体检后确立）

每天至少满足：
1. 有「可照抄」的最小示例；阶段一/二必须是能 `go run` 的完整 main，后续阶段可以是可贴进项目的完整函数或命令块。
2. 正文 ≥600 字、≥3 个代码块；硬骨头日 ≥900 字。
3. 自测 ≥3 题（第三题要「可观察结果型」，问「跑一下会看到什么」，不是「请解释」）。
4. 有「5 分钟最小验证」与「报错对照（现象 → 原因 → 修法）」两个小节。
5. 排错 ≥1、迁移 ≥1、判据 ≥4 且可动手验证。

## 已知坑

- 代码块不要用 ``` 围栏写进 `mastery/*.md` 的 predict/debug（解析器已兼容过滤，但裸写更稳）。
- `DayView` 的七步顺序、`useProgress` v4 完成口径（任务全勾 + 判据全勾）不要随意改，涉及 localStorage key。
- **markdown-it 加粗会静默失效**（页面露出 `**`），是 CommonMark delimiter run 规则，不是解析器 bug：
  - 收尾 `**` 前是中文标点（`」`、`。`、`：`）时判为 right-flanking 失败 → `**「X」Y**` 不渲染，要写 `「**X**」Y`。
  - 收尾 `**` 前是标点、后是汉字时同样失败 → `**整句。**但…` 要改成 `**整句**。但…`（句号移出加粗范围）。
  - 检测方式：逐行剥掉行内 code 再 `md.renderInline`，输出残留 `**` 才报（直接 grep `**` 会被 `a***@x.com`、`"***"`、`::placeholder` 骗）。
- 行内 code 里不要写转义反引号（`` `CREATE TABLE \`entries\`` ``）：code span 会提前闭合并把整行吞成字面量，改成不含反引号的分段写法。

## 当前状态（2026-10-20）

94 天全部通过五项硬基线：平均正文 1176 字、最短 603 字、自测 282 题、无一天代码块 <3、任务描述全部 ≥250 字。改动 67 天，体检报告在 `docs/day-by-day-audit.html`。
