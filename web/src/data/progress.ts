import { useCallback, useEffect, useState } from 'react'

const KEY = 'homecube-progress-v1'

type Store = { done: string[]; lastCard: string }

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { done: [], lastCard: '' }
    const parsed = JSON.parse(raw)
    return {
      done: Array.isArray(parsed.done) ? parsed.done : [],
      lastCard: typeof parsed.lastCard === 'string' ? parsed.lastCard : '',
    }
  } catch {
    return { done: [], lastCard: '' }
  }
}

function save(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* 隐私模式下写不进去，忽略即可，不影响使用 */
  }
}

/** 进度状态。done 是已完成卡片的 id 列表。 */
export function useProgress() {
  const [store, setStore] = useState<Store>(() => load())

  useEffect(() => {
    save(store)
  }, [store])

  const toggle = useCallback((id: string) => {
    setStore((s) => ({
      ...s,
      done: s.done.includes(id) ? s.done.filter((x) => x !== id) : [...s.done, id],
    }))
  }, [])

  const setLast = useCallback((id: string) => {
    setStore((s) => (s.lastCard === id ? s : { ...s, lastCard: id }))
  }, [])

  const isDone = useCallback((id: string) => store.done.includes(id), [store.done])

  const reset = useCallback(() => {
    if (confirm('确定要清空全部进度吗？此操作不可撤销。')) {
      setStore({ done: [], lastCard: '' })
    }
  }, [])

  return { done: store.done, lastCard: store.lastCard, toggle, setLast, isDone, reset }
}
