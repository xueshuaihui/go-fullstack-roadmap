import type { Card, StageMeta } from './types'
import { STAGES } from './stages'

/**
 * 日卡按阶段存成 public/cards/{stage}.json，运行时按需拉取。
 * 这样加卡只要往 JSON 里追加，不用改前端代码、不用重新构建。
 */

const cache = new Map<string, Card[]>()

export async function loadStage(stage: string): Promise<Card[]> {
  if (cache.has(stage)) return cache.get(stage)!
  const url = `${import.meta.env.BASE_URL}cards/${stage}.json`
  // 大阶段 JSON 达 2MB，弱网下可能截断或超时；失败不写缓存，重试或重新进入本页就能重新拉
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { cache: 'no-cache' })
      if (!res.ok) throw new Error(String(res.status))
      const data: Card[] = await res.json()
      cache.set(stage, data)
      return data
    } catch (err) {
      console.error(`卡片加载失败（第 ${attempt}/3 次）：${url}`, err)
    }
  }
  return []
}

/** 一次性拉全部阶段（用于搜索与统计） */
export async function loadAll(): Promise<Card[]> {
  const lists = await Promise.all(STAGES.map((s) => loadStage(s.code)))
  return lists.flat()
}

export function stageMeta(code: string): StageMeta | undefined {
  return STAGES.find((s) => s.code === code)
}
