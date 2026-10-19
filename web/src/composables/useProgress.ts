import { reactive, computed, watch } from 'vue'
import { roadmap } from '../roadmap/data'

/**
 * v4：一天是否「学会」，从「任务勾完」改为「任务勾完 + 掌握判据勾完」。
 * 判据是「你能自己动手验证的事实」，勾不上就说明还没掌握。
 */
const STORAGE_KEY = 'family-ledger-roadmap:progress:v4'
const LEGACY_KEY = 'family-ledger-roadmap:progress:v3'

function taskId(phaseId: number, day: number, index: number): string {
  return `p${phaseId}-d${day}-t${index}`
}

function critId(phaseId: number, day: number, index: number): string {
  return `p${phaseId}-d${day}-k${index}`
}

function acceptId(phaseId: number, index: number): string {
  return `p${phaseId}-a${index}`
}

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return new Set(arr as string[])
    }
    // 老版本的任务勾选照常保留，只是判据从零开始
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const arr = JSON.parse(legacy)
      if (Array.isArray(arr)) return new Set(arr as string[])
    }
  } catch {
    /* 损坏或不可用时从空集合开始 */
  }
  return new Set()
}

const checked = reactive<Set<string>>(load())

watch(
  checked,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...val]))
    } catch {
      /* 静默失败，不影响使用 */
    }
  },
  { deep: true },
)

export interface NextDay {
  phaseId: number
  phaseName: string
  day: number
  title: string
  hours: number
  readMin: number
  quiz: number
  predict: number
  debug: number
  transfer: number
  depth: 'core' | 'normal' | 'light'
}

export function useProgress() {
  const findDay = (phaseId: number, day: number) =>
    roadmap.phases.find((p) => p.id === phaseId)?.days.find((x) => x.day === day)

  /* ---------- 任务级 ---------- */
  const isTaskDone = (phaseId: number, day: number, index: number) =>
    checked.has(taskId(phaseId, day, index))

  function toggleTask(phaseId: number, day: number, index: number) {
    const id = taskId(phaseId, day, index)
    if (checked.has(id)) checked.delete(id)
    else checked.add(id)
  }

  function dayProgress(phaseId: number, day: number) {
    const d = findDay(phaseId, day)
    const total = d?.tasks.length ?? 0
    let done = 0
    for (let i = 0; i < total; i++) if (checked.has(taskId(phaseId, day, i))) done++
    return { done, total }
  }

  /* ---------- 掌握判据级 ---------- */
  const isCritDone = (phaseId: number, day: number, index: number) =>
    checked.has(critId(phaseId, day, index))

  function toggleCrit(phaseId: number, day: number, index: number) {
    const id = critId(phaseId, day, index)
    if (checked.has(id)) checked.delete(id)
    else checked.add(id)
  }

  function critProgress(phaseId: number, day: number) {
    const d = findDay(phaseId, day)
    const total = d?.mastery?.criteria.length ?? 0
    let done = 0
    for (let i = 0; i < total; i++) if (checked.has(critId(phaseId, day, i))) done++
    return { done, total }
  }

  /**
   * 一天完成 = 动手任务全勾完 + 掌握判据全勾完。
   * 没有判据数据的旧天退化为「任务全勾完」。
   */
  const dayDone = (phaseId: number, day: number) => {
    const t = dayProgress(phaseId, day)
    if (t.total === 0 || t.done !== t.total) return false
    const k = critProgress(phaseId, day)
    if (k.total === 0) return true
    return k.done === k.total
  }

  /** 一键勾选/取消整天（任务与判据一起） */
  function toggleDay(phaseId: number, day: number) {
    const d = findDay(phaseId, day)
    if (!d) return
    const all = dayDone(phaseId, day)
    d.tasks.forEach((_, i) => {
      const id = taskId(phaseId, day, i)
      if (all) checked.delete(id)
      else checked.add(id)
    })
    d.mastery?.criteria.forEach((_, i) => {
      const id = critId(phaseId, day, i)
      if (all) checked.delete(id)
      else checked.add(id)
    })
  }

  /* ---------- 阶段级 ---------- */
  function phaseProgress(phaseId: number) {
    const phase = roadmap.phases.find((p) => p.id === phaseId)
    if (!phase) return { daysDone: 0, daysTotal: 0, tasksDone: 0, tasksTotal: 0 }
    let daysDone = 0
    let tasksDone = 0
    let tasksTotal = 0
    phase.days.forEach((d) => {
      const { done, total } = dayProgress(phaseId, d.day)
      tasksDone += done
      tasksTotal += total
      if (dayDone(phaseId, d.day)) daysDone++
    })
    return { daysDone, daysTotal: phase.days.length, tasksDone, tasksTotal }
  }

  /** 阶段验收清单（独立于每日任务） */
  const isAcceptDone = (phaseId: number, index: number) => checked.has(acceptId(phaseId, index))

  function toggleAccept(phaseId: number, index: number) {
    const id = acceptId(phaseId, index)
    if (checked.has(id)) checked.delete(id)
    else checked.add(id)
  }

  function acceptProgress(phaseId: number) {
    const phase = roadmap.phases.find((p) => p.id === phaseId)
    const total = phase?.checklist.length ?? 0
    let done = 0
    for (let i = 0; i < total; i++) if (checked.has(acceptId(phaseId, i))) done++
    return { done, total }
  }

  /* ---------- 全局 ---------- */
  const totalDays = computed(() => roadmap.phases.reduce((n, p) => n + p.days.length, 0))

  const doneDays = computed(() => {
    let n = 0
    roadmap.phases.forEach((p) => {
      p.days.forEach((d) => {
        if (dayDone(p.id, d.day)) n++
      })
    })
    return n
  })

  const doneTasks = computed(() => [...checked].filter((id) => id.includes('-t')).length)

  const totalTasks = computed(() =>
    roadmap.phases.reduce((n, p) => n + p.days.reduce((m, d) => m + d.tasks.length, 0), 0),
  )

  const doneCriteria = computed(() => [...checked].filter((id) => id.includes('-k')).length)

  const totalCriteria = computed(() =>
    roadmap.phases.reduce(
      (n, p) => n + p.days.reduce((m, d) => m + (d.mastery?.criteria.length ?? 0), 0),
      0,
    ),
  )

  const percent = computed(() =>
    totalDays.value === 0 ? 0 : Math.round((doneDays.value / totalDays.value) * 100),
  )

  /** 下一个要学的天：用于「今日」面板 */
  const nextDay = computed<NextDay | null>(() => {
    for (const p of roadmap.phases) {
      for (const d of p.days) {
        if (!dayDone(p.id, d.day)) {
          return {
            phaseId: p.id,
            phaseName: p.name,
            day: d.day,
            title: d.title,
            hours: d.hours,
            readMin: d.lesson?.readMin ?? 0,
            quiz: d.lesson?.quiz.length ?? 0,
            predict: d.mastery?.predict.length ?? 0,
            debug: d.mastery?.debug.length ?? 0,
            transfer: d.mastery?.transfer.length ?? 0,
            depth: d.lesson?.depth ?? 'normal',
          }
        }
      }
    }
    return null
  })

  function reset() {
    checked.clear()
  }

  return {
    isTaskDone,
    toggleTask,
    dayProgress,
    isCritDone,
    toggleCrit,
    critProgress,
    dayDone,
    toggleDay,
    phaseProgress,
    isAcceptDone,
    toggleAccept,
    acceptProgress,
    totalDays,
    doneDays,
    doneTasks,
    totalTasks,
    doneCriteria,
    totalCriteria,
    percent,
    nextDay,
    reset,
  }
}
