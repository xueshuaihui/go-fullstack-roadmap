import type { Roadmap } from './types'

import goalMd from './content/goal.md?raw'
import prefaceMd from './content/preface.md?raw'
import redisMd from './content/redis.md?raw'
import overviewMd from './content/overview.md?raw'
import pacingMd from './content/pacing.md?raw'
import phase1Md from './content/phase1.md?raw'
import phase2Md from './content/phase2.md?raw'
import phase3Md from './content/phase3.md?raw'
import phase4Md from './content/phase4.md?raw'
import phase5Md from './content/phase5.md?raw'
import phase6Md from './content/phase6.md?raw'
import timelineMd from './content/timeline.md?raw'
import remindersMd from './content/reminders.md?raw'

import { phase1Days } from './days/phase1'
import { phase2Days } from './days/phase2'
import { phase3Days } from './days/phase3'
import { phase4Days } from './days/phase4'
import { phase5Days } from './days/phase5'
import { phase6Days } from './days/phase6'
import { lessons } from './lessons'
import { masteries } from './mastery'
import type { DayTask } from './types'

/** 把「每日讲解 + 掌握闭环」挂到对应的天上 */
function withLessons(phaseId: number, days: DayTask[]): DayTask[] {
  return days.map((d) => ({
    ...d,
    lesson: lessons[phaseId]?.[d.day],
    mastery: masteries[phaseId]?.[d.day],
  }))
}

export const roadmap: Roadmap = {
  title: '家庭账本 · 学习路线',
  subtitle: 'Go 后端 + Vue 前端 · 服务端视角 · 94 天逐日计划',
  goalMd,
  prefaceMd,
  redisMd,
  overviewMd,
  pacingMd,
  phases: [
    {
      id: 1,
      name: 'Go 语法与数据库入门',
      weeks: '2–3 周',
      core: 'Go 语法、错误处理、接口、SQLite',
      acceptance: '命令行账本，关掉终端数据还在',
      md: phase1Md,
      checklist: ['`add` 两笔', '关终端', '重开', '`list` 两笔都在', '`sum` 数字正确'],
      days: withLessons(1, phase1Days),
    },
    {
      id: 2,
      name: '并发、接口与分包',
      weeks: '1–2 周',
      core: 'goroutine、channel、竞态、context、分包',
      acceptance: '-race 报告出现又消失',
      md: phase2Md,
      checklist: ['能解释“`main` 为什么依赖接口而不是具体类型”', '`-race` 报告出现过并被修复'],
      days: withLessons(2, phase2Days),
    },
    {
      id: 3,
      name: 'HTTP 服务端与 REST API',
      weeks: '3 周',
      core: 'net/http、路由、中间件、REST、统一响应、分页',
      acceptance: 'curl 增查，重启不丢，分页可用',
      md: phase3Md,
      checklist: [
        'curl 创建两笔',
        '**重启**',
        '两笔都在',
        '分页生效',
        'summary 正确',
        '**此时 API 已可被 Vue 调用**',
      ],
      days: withLessons(3, phase3Days),
    },
    {
      id: 4,
      name: '用户认证与数据隔离',
      weeks: '2 周',
      core: '密码哈希（Argon2id / bcrypt cost 12）、JWT、认证中间件、数据隔离',
      acceptance: 'A 看不到 B 的账，响应无密码字段',
      md: phase4Md,
      checklist: ['A 创建一笔', 'B 登录看不到', '无 token 返回 401', '任何响应无密码哈希'],
      days: withLessons(4, phase4Days),
    },
    {
      id: 5,
      name: '分层、GORM、迁移、统计、预算与测试',
      weeks: '4–5 周',
      core:
        '分层、GORM（Session 隔离 + 请求级 Context 字段）、迁移、连接池、统计、预算、CSV 导出、测试、集中错误处理、结构化日志',
      acceptance: 'go test 全绿，迁移可执行，日志带 request ID',
      md: phase5Md,
      checklist: [
        '`go test ./...` 全绿',
        'curl 走通全流程',
        '迁移可执行',
        '日志中能用 request ID 定位请求',
        '能解释“`Session` 的 `NewDB` 和 `Context` 字段各自解决什么问题”，以及为什么这比 `WithContext` 的隐式绑定更确定',
      ],
      days: withLessons(5, phase5Days),
    },
    {
      id: 6,
      name: '配置、部署与收尾',
      weeks: '2–3 周',
      core:
        '配置管理、Docker、优雅关闭（Server 超时 + Shutdown 顺序）、健康检查、CORS、govulncheck、Cookie 安全 + CSRF',
      acceptance: '手机浏览器完成完整操作，服务可优雅停止，无已知依赖漏洞',
      md: phase6Md,
      checklist: [
        '手机浏览器完成“登录 → 添加账目 → 列表看到 → 统计正确 → 超预算有标志”',
        '`docker stop` 时服务优雅退出',
        '`govulncheck` 通过',
        'CSRF 中间件位置正确，`/healthz` 不在 CSRF 豁免路径之外暴露风险',
      ],
      days: withLessons(6, phase6Days),
    },
  ],
  timelineMd,
  remindersMd,
}

/** 全部天数 */
export const totalDays = roadmap.phases.reduce((n, p) => n + p.days.length, 0)

/** 全部单项任务数 */
export const totalTasks = roadmap.phases.reduce(
  (n, p) => n + p.days.reduce((m, d) => m + d.tasks.length, 0),
  0,
)

/* ---------- 按天拆分页面后需要的查询助手 ---------- */

export function findPhase(id: number) {
  return roadmap.phases.find((p) => p.id === id)
}

export function findDay(phaseId: number, day: number) {
  return findPhase(phaseId)?.days.find((d) => d.day === day)
}

/** 全局顺序的每日索引：用于「第 N / 94 天」与上/下一天 */
export interface DayRef {
  phaseId: number
  phaseName: string
  day: number
  title: string
}

export const allDayRefs: DayRef[] = roadmap.phases.flatMap((p) =>
  p.days.map((d) => ({ phaseId: p.id, phaseName: p.name, day: d.day, title: d.title })),
)

export function dayRefIndex(phaseId: number, day: number) {
  return allDayRefs.findIndex((x) => x.phaseId === phaseId && x.day === day)
}

/** 跨阶段的上一天 / 下一天 */
export function dayNeighbor(phaseId: number, day: number, delta: number): DayRef | null {
  const i = dayRefIndex(phaseId, day)
  if (i < 0) return null
  return allDayRefs[i + delta] ?? null
}
