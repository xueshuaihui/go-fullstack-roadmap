<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { roadmap, findDay, findPhase } from './roadmap/data'
import { useProgress } from './composables/useProgress'
import { buildSearchIndex } from './composables/useSearch'
import { route, startRouter } from './composables/useRouter'
import Sidebar from './components/Sidebar.vue'
import SearchBox from './components/SearchBox.vue'
import HomeView from './views/HomeView.vue'
import PhaseView from './views/PhaseView.vue'
import DayView from './views/DayView.vue'
import DocView from './views/DocView.vue'

const { doneDays, totalDays, percent, reset } = useProgress()
const searchEntries = buildSearchIndex()
const tocOpen = ref(false)

/**
 * 顶部栏在窄屏会折成两行，高度不固定。
 * 侧边栏吸附位置与锚点偏移都跟着实际高度走。
 */
const topbar = ref<HTMLElement | null>(null)
let ro: ResizeObserver | null = null

onMounted(() => {
  startRouter()
  if (!topbar.value) return
  const apply = () => {
    const h = topbar.value?.offsetHeight ?? 51
    document.documentElement.style.setProperty('--topbar-h', `${h}px`)
  }
  apply()
  ro = new ResizeObserver(apply)
  ro.observe(topbar.value)
})

onUnmounted(() => ro?.disconnect())

/** 页面切换：普通页回到顶部；首页带锚点时滚到对应小节 */
watch(
  route,
  async (r) => {
    tocOpen.value = false
    if (r.name === 'home' && r.anchor) {
      await nextTick()
      const el = document.getElementById(r.anchor)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - (topbar.value?.offsetHeight ?? 51) - 12
        window.scrollTo({ top, behavior: 'smooth' })
      }
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  },
  { immediate: true },
)

/** 标签页标题跟着当前页面走，收藏/历史记录里能分清是哪一天 */
const pageTitle = computed(() => {
  const r = route.value
  if (r.name === 'day') {
    const d = findDay(r.phase, r.day)
    return d ? `D${r.day} · ${d.title} — 家庭账本学习路线` : '家庭账本学习路线'
  }
  if (r.name === 'phase') {
    const p = findPhase(r.phase)
    return p ? `阶段 ${p.id} · ${p.name} — 家庭账本学习路线` : '家庭账本学习路线'
  }
  if (r.name === 'timeline') return '时间线 — 家庭账本学习路线'
  if (r.name === 'reminders') return '贯穿全程的提醒 — 家庭账本学习路线'
  return `${roadmap.title} · ${roadmap.subtitle}`
})

watch(pageTitle, (t) => (document.title = t), { immediate: true })

function onReset() {
  if (confirm('确定清空全部学习进度（掌握判据、每日任务、验收勾选与预测草稿）吗？')) {
    reset()
    try {
      localStorage.removeItem('family-ledger-roadmap:guesses:v1')
    } catch {
      /* ignore */
    }
    location.reload()
  }
}
</script>

<template>
  <div class="app">
    <header ref="topbar" class="topbar">
      <button class="toc-toggle" aria-label="目录" @click="tocOpen = !tocOpen">☰</button>
      <a class="brand" href="#/">
        <span class="brand-main">家庭账本</span>
        <span class="brand-sub">学习路线</span>
      </a>

      <SearchBox :entries="searchEntries" />

      <div class="top-progress">
        <div class="tp-track" :title="`${doneDays} / ${totalDays} 天已完成`">
          <div class="tp-fill" :style="{ width: percent + '%' }"></div>
        </div>
        <span class="tp-label">{{ doneDays }}/{{ totalDays }} 天 · {{ percent }}%</span>
        <button class="btn-reset" @click="onReset">重置</button>
      </div>
    </header>

    <div class="layout">
      <aside class="sidebar" :class="{ open: tocOpen }">
        <Sidebar />
      </aside>

      <main class="content">
        <HomeView v-if="route.name === 'home'" />
        <PhaseView v-else-if="route.name === 'phase'" :phase-id="route.phase" />
        <DayView v-else-if="route.name === 'day'" :phase-id="route.phase" :day="route.day" />
        <DocView
          v-else-if="route.name === 'timeline'"
          kicker="🗓️ 时间线"
          title="时间线"
          sub="每天 3–4 小时的大致节奏。"
          :md="roadmap.timelineMd"
        />
        <DocView
          v-else-if="route.name === 'reminders'"
          kicker="📌 贯穿全程"
          title="贯穿全程的提醒"
          :md="roadmap.remindersMd"
        />
      </main>
    </div>
  </div>
</template>
