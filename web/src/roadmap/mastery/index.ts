import type { DebugItem, Mastery, PredictItem, TransferItem } from '../types'
import m1 from './phase1.md?raw'
import m2 from './phase2.md?raw'
import m3 from './phase3.md?raw'
import m4 from './phase4.md?raw'
import m5 from './phase5.md?raw'
import m6 from './phase6.md?raw'

/**
 * 掌握闭环的数据源。
 *
 * 为什么单独放 markdown：每天要写少量可运行代码（预测题、坏代码），
 * 塞进 TS 字符串要么疯狂转义，要么全是 \n 拼接，改一次错一次。
 * 这里用和讲解一致的 `<!--day N-->` 分天，指令以 `::` 开头。
 *
 * 指令表：
 *   ::pre       前置知识（单行）
 *   ::predict   开始一道读前预测题，后接代码；参数是语言
 *   ::ask       该题的问题（可续行）
 *   ::ans       该题的答案（可续行，可含代码块）
 *   ::debug     开始一道排错题，后接有问题的代码；参数是语言
 *   ::sym       排错题的「观察到的现象」
 *   ::code      排错题的坏代码（也可以直接跟在 ::debug 后面）
 *   ::transfer  开始一道迁移挑战
 *   ::scene     新场景描述
 *   ::hint      卡住时的第一步提示（不是答案）
 *   ::crit      一条掌握判据（可多条）
 */
const sources: Record<number, string[]> = {
  1: [m1],
  2: [m2],
  3: [m3],
  4: [m4],
  5: [m5],
  6: [m6],
}

function splitDays(raw: string): Record<number, string> {
  const out: Record<number, string> = {}
  const re = /<!--day (\d+)-->/g
  const marks: { day: number; start: number; at: number }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(raw)) !== null) {
    marks.push({ day: Number(m[1]), start: m.index + m[0].length, at: m.index })
  }
  marks.forEach((mk, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].at : raw.length
    out[mk.day] = raw.slice(mk.start, end).trim()
  })
  return out
}

/** 逐行扫描，把 :: 指令折叠成结构 */
function parseDay(body: string): Mastery {
  const out: Mastery = { predict: [], debug: [], transfer: [], criteria: [] }

  let predict: PredictItem | null = null
  let debug: DebugItem | null = null
  let transfer: TransferItem | null = null

  /** 当前正在接收文本的字段；遇到下一条指令时清空 */
  type Target = { obj: any; key: string } | null
  let target: Target = null
  /** 代码收集模式：解析到 ::predict / ::code 之后，纯文本行都算代码 */
  let codeMode = false

  const pushLine = (line: string) => {
    if (target) {
      const prev = target.obj[target.key]
      target.obj[target.key] = prev ? `${prev}\n${line}` : line
    }
  }

  for (const raw of body.split('\n')) {
    const line = raw.replace(/\s+$/, '')
    const trimmed = line.trim()

    if (trimmed.startsWith('::')) {
      const sp = trimmed.indexOf(' ')
      const cmd = (sp < 0 ? trimmed.slice(2) : trimmed.slice(2, sp)).trim()
      const arg = sp < 0 ? '' : trimmed.slice(sp + 1).trim()
      codeMode = false
      target = null

      switch (cmd) {
        case 'pre':
          out.prereq = arg
          target = { obj: out, key: 'prereq' }
          break

        case 'predict':
          predict = { code: '', lang: arg || 'go', ask: '', answer: '' }
          out.predict.push(predict)
          debug = null
          transfer = null
          codeMode = true
          break

        case 'debug':
          debug = { symptom: '', code: '', lang: arg || 'go', ask: '', answer: '' }
          out.debug.push(debug)
          predict = null
          transfer = null
          codeMode = true
          break

        case 'code':
          if (debug) {
            if (arg) debug.code = arg
            codeMode = true
          }
          break

        case 'sym':
          if (debug) {
            debug.symptom = arg
            target = { obj: debug, key: 'symptom' }
          }
          break

        case 'ask':
          if (predict) {
            predict.ask = arg
            target = { obj: predict, key: 'ask' }
          } else if (debug) {
            debug.ask = arg
            target = { obj: debug, key: 'ask' }
          } else if (transfer) {
            transfer.ask = arg
            target = { obj: transfer, key: 'ask' }
          }
          break

        case 'ans':
          if (predict) {
            predict.answer = arg
            target = { obj: predict, key: 'answer' }
          } else if (debug) {
            debug.answer = arg
            target = { obj: debug, key: 'answer' }
          } else if (transfer) {
            transfer.answer = arg
            target = { obj: transfer, key: 'answer' }
          }
          break

        case 'transfer':
          transfer = { scene: '', ask: '', answer: '' }
          out.transfer.push(transfer)
          predict = null
          debug = null
          target = { obj: transfer, key: 'scene' }
          break

        case 'scene':
          if (transfer) {
            transfer.scene = arg
            target = { obj: transfer, key: 'scene' }
          }
          break

        case 'hint':
          if (transfer) {
            transfer.hint = arg
            target = { obj: transfer, key: 'hint' }
          }
          break

        case 'crit':
          out.criteria.push(arg)
          target = { obj: out.criteria as any, key: String(out.criteria.length - 1) }
          break

        default:
          break
      }
      continue
    }

    if (codeMode) {
      // 有些天的代码写成了 ```go 围栏，有些天直接裸写。
      // 组件渲染时会自己再套一层围栏，这里必须把原始围栏行吃掉，否则会出现嵌套 ``` 直接露在页面上。
      const fence = /^```\s*([\w+#-]*)\s*$/.exec(trimmed)
      if (fence) {
        const lang = fence[1]
        if (lang && predict) predict.lang = lang
        else if (lang && debug) debug.lang = lang
        continue
      }
      if (predict) predict.code = predict.code ? `${predict.code}\n${line}` : line
      else if (debug) debug.code = debug.code ? `${debug.code}\n${line}` : line
      continue
    }

    if (!trimmed) continue
    pushLine(line)
  }

  // 收尾：去空白、过滤空项
  out.criteria = out.criteria.map((c) => c.trim()).filter(Boolean)
  out.predict = out.predict.filter((p) => p.ask && p.code)
  // 排错题不强制要求「现象」段落：很多题把现象直接写进了提问里
  out.debug = out.debug.filter((d) => d.ask && (d.symptom || d.code))
  out.transfer = out.transfer.filter((t) => t.scene && t.ask)

  return out
}

export const masteries: Record<number, Record<number, Mastery>> = {}
for (const [phase, parts] of Object.entries(sources)) {
  const bag: Record<number, Mastery> = {}
  for (const [day, body] of Object.entries(splitDays(parts.join('\n\n')))) {
    bag[Number(day)] = parseDay(body)
  }
  masteries[Number(phase)] = bag
}
