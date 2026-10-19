/** 概念难度分档：core 是需要两遍才能吃下的硬骨头 */
export type Depth = 'core' | 'normal' | 'light'

/** 一道自测题：先自己回答，再展开对答案 */
export interface QuizItem {
  q: string
  a: string
}

/** 当天讲解 = 教材正文 + 自测 + 元信息 */
export interface Lesson {
  /** Markdown 正文（不含自测区） */
  body: string
  /** 自测题（主动回忆，读一遍不算学会） */
  quiz: QuizItem[]
  depth: Depth
  /** 正文字数（不含代码） */
  chars: number
  /** 代码行数 */
  codeLines: number
  /** 诚实估算：正文 + 代码 + 自测回溯，不是平均 2 分钟 */
  readMin: number
}

/** 读前预测：先猜输出，再读正文。猜错的地方就是今天真正要学的 */
export interface PredictItem {
  /** 代码/命令片段 */
  code: string
  /** 代码语言（用于高亮） */
  lang: string
  /** 让用户在读之前回答的问题 */
  ask: string
  /** 答案：为什么是这个结果 */
  answer: string
}

/** 排错诊断：给出坏代码/坏现象，让用户定位问题。会写不等于会修 */
export interface DebugItem {
  /** 现象：用户能观察到什么 */
  symptom: string
  /** 有问题的代码 */
  code: string
  lang: string
  ask: string
  answer: string
}

/** 迁移挑战：换一个没讲过的场景，检验是不是真的会了 */
export interface TransferItem {
  /** 新场景描述 */
  scene: string
  ask: string
  /** 卡住时看的第一步提示，不是答案 */
  hint?: string
  answer: string
}

/**
 * 掌握闭环。一天的「学会」由这五件事共同定义，
 * 只读讲解不算学会。
 */
export interface Mastery {
  /** 前置知识：不满足就别开始这一天，先回补 */
  prereq?: string
  /** ① 读前预测（放在讲解之前） */
  predict: PredictItem[]
  /** ④ 排错诊断 */
  debug: DebugItem[]
  /** ⑤ 迁移挑战 */
  transfer: TransferItem[]
  /** ⑥ 掌握判据：每条都能自己动手验证，全部打勾才算掌握 */
  criteria: string[]
}

export interface DayTask {
  /** 阶段内的天序号，从 1 开始 */
  day: number
  /** 当日主题 */
  title: string
  /** 建议投入小时数 */
  hours: number
  /** 当天讲解（自带教材，学完直接做当天的任务） */
  lesson?: Lesson
  /** 掌握闭环：预测 / 排错 / 迁移 / 判据 */
  mastery?: Mastery
  /** 可勾选的具体动作，支持行内 Markdown */
  tasks: string[]
  /** 当日交付物：做完后手上应该有什么 */
  deliver?: string
  /** 常见卡点 */
  pitfall?: string
  /** 可选标记 */
  tag?: '复盘' | '里程碑' | '可选'
}

export interface Phase {
  id: number
  /** 阶段标题（不含“阶段N”前缀） */
  name: string
  weeks: string
  core: string
  acceptance: string
  /** 该阶段的正文 Markdown（逐字，来自 content/phaseN.md） */
  md: string
  /** ✅ 阶段验收项，按原文语义拆分，逐字保留 */
  checklist: string[]
  /** 📅 每日任务：最小执行颗粒度 */
  days: DayTask[]
}

export interface Roadmap {
  title: string
  subtitle: string
  goalMd: string
  prefaceMd: string
  redisMd: string
  overviewMd: string
  /** 每日节奏说明 */
  pacingMd: string
  phases: Phase[]
  timelineMd: string
  remindersMd: string
}

export interface SearchEntry {
  /** 结果要跳到的页面地址（hash 路由） */
  href: string
  section: string
  text: string
}
