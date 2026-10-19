import { ref } from 'vue'

/**
 * 极简 hash 路由：把「首页 / 阶段 / 每天 / 时间线 / 提醒」拆成独立页面。
 * 不引 vue-router —— 只需要五个页面形态，hash 足够，刷新与前进后退都能用。
 */
export type Route =
  | { name: 'home'; anchor?: string }
  | { name: 'phase'; phase: number }
  | { name: 'day'; phase: number; day: number }
  | { name: 'timeline' }
  | { name: 'reminders' }

export function hrefOf(r: Route): string {
  switch (r.name) {
    case 'home':
      return r.anchor ? `#/home/${r.anchor}` : '#/'
    case 'phase':
      return `#/phase/${r.phase}`
    case 'day':
      return `#/day/${r.phase}/${r.day}`
    case 'timeline':
      return '#/timeline'
    case 'reminders':
      return '#/reminders'
  }
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '').replace(/\/+$/, '')
  if (!raw) return { name: 'home' }
  const [head, a, b] = raw.split('/')
  if (head === 'home') return { name: 'home', anchor: a || undefined }
  if (head === 'phase') return { name: 'phase', phase: Number(a) || 1 }
  if (head === 'day') return { name: 'day', phase: Number(a) || 1, day: Number(b) || 1 }
  if (head === 'timeline') return { name: 'timeline' }
  if (head === 'reminders') return { name: 'reminders' }
  return { name: 'home' }
}

export const route = ref<Route>(
  typeof location === 'undefined' ? { name: 'home' } : parseHash(location.hash),
)

let started = false

export function startRouter() {
  if (started || typeof window === 'undefined') return
  started = true
  window.addEventListener('hashchange', () => {
    route.value = parseHash(location.hash)
  })
}

/** 程序化跳转（搜索、上/下一天、今日入口）；普通链接直接用 hrefOf 生成 href 即可 */
export function navigate(r: Route) {
  const href = hrefOf(r)
  if (location.hash === href) {
    // 同一个地址再点一次：同对象不会触发 watch，这里换新对象保证页面回到顶部
    route.value = { ...r }
    return
  }
  location.hash = href
}
