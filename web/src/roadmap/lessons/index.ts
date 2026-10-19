import p1 from './phase1.md?raw'
import p2 from './phase2.md?raw'
import p3 from './phase3.md?raw'
import p4 from './phase4.md?raw'
import p5a from './phase5.md?raw'
import p5b from './phase5b.md?raw'
import p6 from './phase6.md?raw'
import type { Depth, Lesson, QuizItem } from '../types'

/**
 * 每日讲解的分文件来源。一个阶段可以拆成多段（长阶段写作时分片维护），
 * 这里按顺序拼接后再切天。
 */
const sources: Record<number, string[]> = {
  1: [p1],
  2: [p2],
  3: [p3],
  4: [p4],
  5: [p5a, p5b],
  6: [p6],
}

/**
 * 切天。标记格式：`<!--day 7 | core-->`
 * 第二段是可选的难度档：core（硬骨头）/ normal / light。
 */
function splitDays(raw: string): Record<number, { depth: Depth; body: string }> {
  const out: Record<number, { depth: Depth; body: string }> = {}
  const re = /<!--day (\d+)(?:\s*\|\s*(\w+))?-->/g
  const marks: { day: number; depth: Depth; start: number; at: number }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(raw)) !== null) {
    marks.push({
      day: Number(m[1]),
      depth: (m[2] as Depth) || 'normal',
      start: m.index + m[0].length,
      at: m.index,
    })
  }
  marks.forEach((mk, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].at : raw.length
    out[mk.day] = { depth: mk.depth, body: raw.slice(mk.start, end).trim() }
  })
  return out
}

/**
 * 把自测区从正文里剥出来。自测区格式（必须放在当天讲解的最后）：
 *
 * ```
 * ::q 问题（单行，支持行内 Markdown）
 * ::a 答案（可换行，直到下一个 ::q 或文件结束）
 * ```
 */
function splitQuiz(body: string): { text: string; quiz: QuizItem[] } {
  const idx = body.search(/^::q /m)
  if (idx < 0) return { text: body.trim(), quiz: [] }

  const text = body.slice(0, idx).trim()
  const quiz: QuizItem[] = []
  let cur: { q: string; a: string } | null = null

  for (const line of body.slice(idx).split('\n')) {
    const t = line.trim()
    if (t.startsWith('::q ')) {
      if (cur) quiz.push(cur)
      cur = { q: t.slice(4).trim(), a: '' }
    } else if (t.startsWith('::a ')) {
      if (cur) cur.a = t.slice(4).trim()
    } else if (cur && t) {
      cur.a = cur.a ? `${cur.a}\n${line.trim()}` : t
    }
  }
  if (cur) quiz.push(cur)
  return { text, quiz: quiz.filter((q) => q.q) }
}

/** 去掉代码块后的正文字数 */
function proseChars(body: string): number {
  return body.replace(/```[\s\S]*?```/g, '').replace(/\s/g, '').length
}

/** 代码行数（只数围栏内的非空行） */
function codeLines(body: string): number {
  let n = 0
  for (const block of body.match(/```[\s\S]*?```/g) || []) {
    n += block.split('\n').filter((l) => l.trim() && !l.startsWith('```')).length
  }
  return n
}

/**
 * 诚实估算：技术中文精读按 280 字/分钟，代码按 22 行/分钟（要逐行看懂），
 * 每道自测按 0.8 分钟（自己先答，再看答案）。
 * 不用「350 字/分钟」那种把代码当散文的速度。
 */
export function estimateMinutes(chars: number, lines: number, quiz: number): number {
  return Math.max(2, Math.round(chars / 280 + lines / 22 + quiz * 0.8))
}

export const lessons: Record<number, Record<number, Lesson>> = {}
for (const [phase, parts] of Object.entries(sources)) {
  const days = splitDays(parts.join('\n\n'))
  const bag: Record<number, Lesson> = {}
  for (const [day, { depth, body }] of Object.entries(days)) {
    const { text, quiz } = splitQuiz(body)
    const chars = proseChars(text)
    const lines = codeLines(text)
    bag[Number(day)] = {
      body: text,
      quiz,
      depth,
      chars,
      codeLines: lines,
      readMin: estimateMinutes(chars, lines, quiz.length),
    }
  }
  lessons[Number(phase)] = bag
}
