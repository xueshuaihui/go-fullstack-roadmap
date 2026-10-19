<script setup lang="ts">
import { reactive, watch, computed, nextTick } from 'vue'
import { roadmap } from '../roadmap/data'
import { useProgress } from '../composables/useProgress'
import { route, hrefOf } from '../composables/useRouter'

const { phaseProgress, nextDay, doneDays, totalDays, dayDone, dayProgress } = useProgress()

/** 手风琴：同时只展开一个阶段，94 天不会把侧栏撑成无底洞 */
const openPhases = reactive(new Set<number>([nextDay.value?.phaseId ?? roadmap.phases[0].id]))

/** 路由变了就跟着展开所在阶段：从「下一天」跨阶段时也跟得上 */
watch(
  () => route.value,
  (r) => {
    if (r.name !== 'day' && r.name !== 'phase') return
    const pid = r.phase
    if (!openPhases.has(pid)) {
      openPhases.clear()
      openPhases.add(pid)
    }
  },
  { immediate: true },
)

const dayId = (phaseId: number, day: number) => `p${phaseId}-d${day}`

const isDayRoute = (phaseId: number, day: number) =>
  route.value.name === 'day' && route.value.phase === phaseId && route.value.day === day

const isPhaseRoute = (id: number) =>
  (route.value.name === 'phase' && route.value.phase === id) ||
  (route.value.name === 'day' && route.value.phase === id)

const homeOn = (anchor: string) => {
  if (route.value.name !== 'home') return false
  return (route.value.anchor ?? 'goal') === anchor
}

const isNext = (phaseId: number, day: number) =>
  nextDay.value?.phaseId === phaseId && nextDay.value?.day === day

const todayHref = computed(() => {
  const n = nextDay.value
  return n ? hrefOf({ name: 'day', phase: n.phaseId, day: n.day }) : null
})

/* ---------- 长阶段的天列表：切到某天时把那一行滚进侧栏可视区 ---------- */
const listEls = new Map<number, HTMLElement>()

function setListRef(id: number, el: unknown) {
  if (el) listEls.set(id, el as HTMLElement)
  else listEls.delete(id)
}

function revealDay(phaseId: number, day: number) {
  const list = listEls.get(phaseId)
  if (!list) return
  const row = list.querySelector<HTMLElement>(`[data-day="${day}"]`)
  if (!row) return
  const top = row.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop
  if (top < list.scrollTop || top + row.offsetHeight > list.scrollTop + list.clientHeight) {
    list.scrollTop = Math.max(0, top - list.clientHeight / 2 + row.offsetHeight / 2)
  }
}

watch(
  () => route.value,
  (r) => {
    if (r.name !== 'day') return
    nextTick(() => revealDay(r.phase, r.day))
  },
  { immediate: true },
)

function togglePhase(id: number) {
  if (openPhases.has(id)) openPhases.delete(id)
  else {
    openPhases.clear()
    openPhases.add(id)
  }
}

/** 天条目的状态：全掌握 / 做了一半 / 未开始 */
function dayState(phaseId: number, day: number): 'done' | 'partial' | 'todo' {
  if (dayDone(phaseId, day)) return 'done'
  return dayProgress(phaseId, day).done > 0 ? 'partial' : 'todo'
}
</script>

<template>
  <nav class="toc">
    <a v-if="todayHref" class="today-nav" :href="todayHref">
      <span class="today-nav-label">今天</span>
      <span class="today-nav-text">
        阶段 {{ nextDay?.phaseId }} · 第 {{ nextDay?.day }} 天
      </span>
      <span class="today-nav-progress">{{ doneDays }}/{{ totalDays }}</span>
    </a>
    <div v-else class="today-nav alldone">
      <span class="today-nav-label">全部完成 🎉</span>
      <span class="today-nav-text">{{ totalDays }} 天都掌握了</span>
    </div>

    <div class="toc-title">目录</div>

    <a class="toc-item" :class="{ on: homeOn('goal') }" :href="hrefOf({ name: 'home', anchor: 'goal' })">
      最终目标
    </a>
    <a
      class="toc-item"
      :class="{ on: homeOn('overview') }"
      :href="hrefOf({ name: 'home', anchor: 'overview' })"
    >
      阶段总览
    </a>
    <a
      class="toc-item"
      :class="{ on: homeOn('pacing') }"
      :href="hrefOf({ name: 'home', anchor: 'pacing' })"
    >
      每日节奏
    </a>

    <div class="toc-group">阶段 · 按天导航</div>

    <div v-for="p in roadmap.phases" :key="p.id" class="toc-phase-wrap">
      <div class="toc-phase-row" :class="{ on: isPhaseRoute(p.id) }">
        <button
          class="toc-caret"
          type="button"
          :aria-expanded="openPhases.has(p.id)"
          :aria-label="`${openPhases.has(p.id) ? '收起' : '展开'}阶段 ${p.id} 的天列表`"
          @click="togglePhase(p.id)"
        >
          ›
        </button>
        <a class="toc-phase-main" :href="hrefOf({ name: 'phase', phase: p.id })">
          <span class="toc-phase-name">{{ p.id }}. {{ p.name }}</span>
          <span class="toc-phase-progress">
            {{ phaseProgress(p.id).daysDone }}/{{ p.days.length }}
          </span>
        </a>
      </div>

      <ul v-show="openPhases.has(p.id)" :ref="(el) => setListRef(p.id, el)" class="toc-days">
        <li v-for="d in p.days" :key="d.day">
          <a
            class="toc-day"
            :class="{ on: isDayRoute(p.id, d.day), done: dayState(p.id, d.day) === 'done' }"
            :href="hrefOf({ name: 'day', phase: p.id, day: d.day })"
            :data-day="d.day"
            :title="`第 ${d.day} 天 · ${d.title}`"
          >
            <span class="td-dot" :class="dayState(p.id, d.day)">
              {{ dayState(p.id, d.day) === 'done' ? '✓' : '' }}
            </span>
            <span class="td-no">D{{ d.day }}</span>
            <span class="td-title">{{ d.title }}</span>
            <span v-if="isNext(p.id, d.day)" class="td-next">今</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="toc-group">收尾</div>
    <a class="toc-item" :class="{ on: route.name === 'timeline' }" :href="hrefOf({ name: 'timeline' })">
      时间线
    </a>
    <a
      class="toc-item"
      :class="{ on: route.name === 'reminders' }"
      :href="hrefOf({ name: 'reminders' })"
    >
      贯穿全程的提醒
    </a>
  </nav>
</template>
