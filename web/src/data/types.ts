// 日卡的数据结构。所有卡片都遵循这个形状。

export type CardLang = 'bash' | 'go' | 'sql' | 'json' | 'text' | 'tsx'

export interface Concept {
  name: string
  explanation: string
  analogy?: string
}

// 「今天的代码」分步长出来的每一步。
// 硬性不变量：把各步 add 去掉尾部换行后按 n 升序拼接、按 \n 切行，
// 必须与 content 去掉尾部换行后按 \n 切出的行数组逐行相等。
export interface CodeBuildStep {
  n: number
  title: string
  add: string
  place: string
  note: string
  check: string
}

export interface CodeSample {
  lang: CardLang
  filename: string
  /** 最终完整文件：最后一步整体对拍用，必须真的可运行 */
  content: string
  run: string
  expect: string
  /** 可选：教学用的分步增量。缺省时前端整块渲染 content（迁移期兼容路径） */
  build?: CodeBuildStep[]
}

export interface Step {
  n: number
  title: string
  detail: string
  time: string
}

export interface Pitfall {
  wrong: string
  right: string
  why: string
}

export interface Quiz {
  q: string
  options: string[]
  answer: number
  explain: string
}

export interface CardTask {
  title: string
  acceptance: string[]
  hint: string
}

// Teaching mode fields (五阶段教学引导)
export interface Prerequisite {
  day: string
  topic: string
  check: string
}

export interface MicroQuiz {
  q: string
  options: string[]
  answer: number
  explain: string
}

export interface FillPoint {
  line: number
  hint: string
  expected_lines: number
}

export interface Approach {
  name: string
  description: string
  pros: string
  cons: string
}

export interface AntiPattern {
  file: string
  description: string
  expected_behavior: string
}

export interface Criterion {
  text: string
  verified_in: string
}

export interface Phase {
  name: string
  duration: string
  content?: string
  micro_quiz?: MicroQuiz[]
  skeleton_file?: string
  fill_points?: FillPoint[]
  approaches?: Approach[]
  solution_file?: string
  feynman_questions?: string[]
  anti_patterns?: AntiPattern[]
  criteria?: Criterion[]
  next_day_preview?: string
}

export interface Teaching {
  prerequisites: Prerequisite[]
  phases: Phase[]
  mode_switch: string
}

export interface Card {
  id: string
  stage: string
  day: number
  week: number
  title: string
  goal: string
  duration: string
  why: { problem: string; naive: string; right: string }
  concepts: Concept[]
  code: CodeSample
  steps: Step[]
  pitfalls: Pitfall[]
  quiz: Quiz[]
  task: CardTask
  tomorrow: string
  teaching?: Teaching
}

// 阶段的元信息（不含卡片内容，内容在 cards/ 下按阶段分文件）
export interface StageMeta {
  code: string
  name: string
  weeks: number
  span: string
  cards: number
  difficulty: number
  segment: string
  summary: string
  outcomes: string[]
  /** 该阶段需要新建的目录/文件，便于当天对照 */
  artifacts: string[]
}

export interface Segment {
  name: string
  weeks: string
  stages: string[]
  tone: string
}
