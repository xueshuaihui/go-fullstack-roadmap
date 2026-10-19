import { roadmap } from '../roadmap/data'
import { stripMarkdown } from '../markdown'
import type { SearchEntry } from '../roadmap/types'

function pushLines(entries: SearchEntry[], href: string, section: string, md: string) {
  md.split('\n').forEach((line) => {
    const text = stripMarkdown(line)
    // 过滤分隔行、纯符号行
    if (text.length < 2) return
    if (/^[:\-\s|]+$/.test(text)) return
    entries.push({ href, section, text })
  })
}

/**
 * 每条索引都带目标页面地址：命中某天就跳到那天的页面，命中阶段内容就跳到阶段页。
 */
export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []

  pushLines(entries, '#/home/goal', '最终目标', roadmap.goalMd)
  pushLines(entries, '#/home/goal', '前置说明', roadmap.prefaceMd)
  pushLines(entries, '#/home/goal', 'Redis 定位', roadmap.redisMd)
  pushLines(entries, '#/home/overview', '阶段总览', roadmap.overviewMd)
  pushLines(entries, '#/home/pacing', '每日节奏', roadmap.pacingMd)

  roadmap.phases.forEach((p) => {
    p.days.forEach((d) => {
      const href = `#/day/${p.id}/${d.day}`
      const prefix = `阶段 ${p.id} · D${d.day}`
      entries.push({ href, section: `${prefix} · 第 ${d.day} 天`, text: stripMarkdown(d.title) })
      d.tasks.forEach((t) => {
        entries.push({ href, section: `${prefix} 任务`, text: stripMarkdown(t) })
      })
      if (d.deliver) {
        entries.push({ href, section: `${prefix} 交付`, text: stripMarkdown(d.deliver) })
      }
      if (d.pitfall) {
        entries.push({ href, section: `${prefix} 卡点`, text: stripMarkdown(d.pitfall) })
      }
      // 讲解正文与自测也进入索引：以前只能搜到任务标题，讲解内容搜不到
      if (d.lesson) {
        pushLines(entries, href, `${prefix} 讲解`, d.lesson.body)
        d.lesson.quiz.forEach((q) => {
          entries.push({ href, section: `${prefix} 自测`, text: stripMarkdown(q.q) })
        })
      }
      if (d.mastery) {
        d.mastery.predict.forEach((x) => {
          entries.push({ href, section: `${prefix} 预测`, text: stripMarkdown(x.ask) })
        })
        d.mastery.debug.forEach((x) => {
          entries.push({ href, section: `${prefix} 排错`, text: stripMarkdown(x.symptom) })
        })
        d.mastery.transfer.forEach((x) => {
          entries.push({ href, section: `${prefix} 迁移`, text: stripMarkdown(x.scene) })
        })
        d.mastery.criteria.forEach((c) => {
          entries.push({ href, section: `${prefix} 判据`, text: stripMarkdown(c) })
        })
      }
    })

    pushLines(entries, `#/phase/${p.id}`, `阶段 ${p.id} · ${p.name}`, p.md)

    p.checklist.forEach((item) => {
      entries.push({
        href: `#/phase/${p.id}`,
        section: `阶段 ${p.id} · 验收`,
        text: stripMarkdown(item),
      })
    })
  })

  pushLines(entries, '#/timeline', '时间线', roadmap.timelineMd)
  pushLines(entries, '#/reminders', '贯穿全程的提醒', roadmap.remindersMd)

  return entries
}
