<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { findPhase, dayNeighbor, dayRefIndex, totalDays } from '../roadmap/data'
import { useProgress } from '../composables/useProgress'
import { hrefOf, navigate } from '../composables/useRouter'
import MarkdownBlock from '../components/MarkdownBlock.vue'
import QuizBlock from '../components/QuizBlock.vue'
import DrillBlock from '../components/DrillBlock.vue'

const props = defineProps<{ phaseId: number; day: number }>()

const phase = computed(() => findPhase(props.phaseId))
const d = computed(() => phase.value?.days.find((x) => x.day === props.day))
const prefix = computed(() => `p${props.phaseId}-d${props.day}`)

const {
  dayDone,
  dayProgress,
  critProgress,
  toggleDay,
  isTaskDone,
  toggleTask,
  isCritDone,
  toggleCrit,
} = useProgress()

const prev = computed(() => dayNeighbor(props.phaseId, props.day, -1))
const next = computed(() => dayNeighbor(props.phaseId, props.day, 1))
const serial = computed(() => dayRefIndex(props.phaseId, props.day) + 1)

const crit = computed(() => critProgress(props.phaseId, props.day))
const tasks = computed(() => dayProgress(props.phaseId, props.day))

const NO = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧']

interface Step {
  key: string
  no: string
  name: string
  hint: string
  meta: string
}

/** 当天的教学节奏：按「先猜 → 再读 → 复述 → 排错 → 迁移 → 判据 → 动手」生成，缺哪段就少哪步 */
const steps = computed<Step[]>(() => {
  const day = d.value
  if (!day) return []
  const out: Omit<Step, 'no'>[] = []
  const add = (key: string, name: string, hint: string, meta = '') =>
    out.push({ key, name, hint, meta })

  if (day.mastery?.predict.length) {
    add('predict', '学前自检', '先确认地基，再带着问题往下读', `${day.mastery.predict.length} 道预测`)
  }
  if (day.lesson) {
    add('lesson', '机制讲解', '带着刚才的冲突读，重点看「为什么」', `约 ${day.lesson.readMin} 分钟`)
  }
  if (day.lesson?.quiz.length) {
    add('quiz', '主动回忆', '合上答案，先自己复述一遍', `${day.lesson.quiz.length} 题`)
  }
  if (day.mastery?.debug.length) {
    add('debug', '排错诊断', '会写不等于会修：先定位病灶，再谈改法', `${day.mastery.debug.length} 题`)
  }
  if (day.mastery?.transfer.length) {
    add('transfer', '迁移挑战', '换个没讲过的场景，检验是不是真会', `${day.mastery.transfer.length} 题`)
  }
  if (day.mastery?.criteria.length) {
    add('criteria', '掌握判据', '每条都要能自己动手验证，勾不上就是没学会', `${crit.value.done}/${crit.value.total}`)
  }
  add('tasks', '动手任务', '判据答得出，再动手；全部勾完才收工', `${tasks.value.done}/${tasks.value.total}`)

  return out.map((s, i) => ({ ...s, no: NO[i] ?? `${i + 1}` }))
})

/* ---------- 步骤高亮：滚动时跟着当前小节走 ---------- */
const current = ref<string>('')
let ticking = false
let line = 150

function measure() {
  ticking = false
  const ids = steps.value.map((s) => `s-${s.key}`)
  if (!ids.length) return
  let cur = ids[0]
  for (const id of ids) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= line) cur = id
    else break
  }
  current.value = cur.replace(/^s-/, '')
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(measure)
}

function refreshLine() {
  const probe = document.querySelector<HTMLElement>('.dp-steps')
  const h = probe?.getBoundingClientRect().height ?? 44
  const bar = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--topbar-h') || '51',
  )
  line = bar + h + 26
}

function toStep(key: string) {
  const el = document.getElementById(`s-${key}`)
  if (!el) return
  const offset = line - 20
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
  current.value = key
}

/** 换天（组件复用）时重置步骤高亮 */
watch(
  () => [props.phaseId, props.day],
  () =>
    nextTick(() => {
      refreshLine()
      measure()
    }),
)

/** ← / → 切上一天、下一天：读题时不要误触，所以在输入框里不生效 */
function onKey(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null
  if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return
  if (e.metaKey || e.ctrlKey || e.altKey) return
  if (e.key === 'ArrowLeft' && prev.value) {
    navigate({ name: 'day', phase: prev.value.phaseId, day: prev.value.day })
  } else if (e.key === 'ArrowRight' && next.value) {
    navigate({ name: 'day', phase: next.value.phaseId, day: next.value.day })
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  nextTick(() => {
    refreshLine()
    measure()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div v-if="d" class="page daypage">
    <nav class="crumbs">
      <a href="#/">学习路线</a>
      <span class="crumb-sep">›</span>
      <a :href="hrefOf({ name: 'phase', phase: phaseId })">阶段 {{ phaseId }} · {{ phase?.name }}</a>
      <span class="crumb-sep">›</span>
      <span>第 {{ day }} 天</span>
    </nav>

    <header class="dp-hero">
      <div class="dp-headrow">
        <span class="dp-badge">D{{ day }}</span>
        <div class="dp-headmain">
          <h1 class="dp-title">
            {{ d.title }}
            <span v-if="d.tag" class="day-tag" :class="`tag-${d.tag}`">{{ d.tag }}</span>
            <span v-if="d.lesson?.depth === 'core'" class="depth-chip">硬骨头</span>
            <span v-else-if="d.lesson?.depth === 'light'" class="depth-chip depth-light">速通</span>
          </h1>
          <div class="dp-meta">
            <span>全路线第 {{ serial }}/{{ totalDays }} 天</span>
            <span v-if="d.lesson">讲解 {{ d.lesson.chars }} 字 · 约 {{ d.lesson.readMin }} 分钟</span>
            <span>判据 {{ crit.done }}/{{ crit.total }}</span>
            <span>任务 {{ tasks.done }}/{{ tasks.total }}</span>
            <span>约 {{ d.hours }} 小时</span>
          </div>
        </div>
        <button
          class="dp-donebtn"
          type="button"
          :class="{ on: dayDone(phaseId, day) }"
          @click="toggleDay(phaseId, day)"
        >
          {{ dayDone(phaseId, day) ? '✓ 今天已掌握' : '标记今天已掌握' }}
        </button>
      </div>
      <p class="dp-lead">
        今天的顺序是固定的：先猜再读，读完自己复述，然后修坏代码、换场景、勾判据，最后才动手。
        跳步的话，读得懂≠写得出。
      </p>
    </header>

    <!-- 教学节奏：每一步都能直接跳，滚动时自动高亮当前步 -->
    <nav class="dp-steps" aria-label="当天教学步骤">
      <button
        v-for="s in steps"
        :key="s.key"
        type="button"
        class="dp-step"
        :class="{ on: current === s.key }"
        @click="toStep(s.key)"
      >
        <span class="ds-no">{{ s.no }}</span>
        <span class="ds-body">
          <span class="ds-name">{{ s.name }}</span>
          <span v-if="s.meta" class="ds-meta">{{ s.meta }}</span>
        </span>
      </button>
    </nav>

    <!-- ① 学前自检 -->
    <section v-if="steps.some((s) => s.key === 'predict')" id="s-predict" class="dp-sec">
      <div class="dp-sec-head">
        <span class="dsh-no">①</span>
        <div class="dsh-main">
          <h2 class="dsh-title">学前自检</h2>
          <p class="dsh-hint">先确认地基，再带着问题读；预测写在本机，读完回来对。</p>
        </div>
      </div>

      <div v-if="d.mastery?.prereq" class="prereq">
        <span class="prereq-label">前置</span>
        <div class="prereq-text">
          <MarkdownBlock :content="d.mastery.prereq" inline />
        </div>
      </div>

      <DrillBlock
        v-for="(p, i) in d.mastery?.predict ?? []"
        :key="`p${i}`"
        kind="predict"
        :index="i"
        :code="p.code"
        :lang="p.lang"
        :ask="p.ask"
        :answer="p.answer"
        :id-prefix="prefix"
      />
    </section>

    <!-- ② 机制讲解 -->
    <section v-if="d.lesson" id="s-lesson" class="dp-sec">
      <div class="dp-sec-head">
        <span class="dsh-no">②</span>
        <div class="dsh-main">
          <h2 class="dsh-title">机制讲解</h2>
          <p class="dsh-hint">
            读完要能回答「它为什么这样设计」。没读懂就往上翻，别硬往下走。
          </p>
        </div>
        <span class="dsh-meta">
          {{ d.lesson.chars }} 字 · 代码 {{ d.lesson.codeLines }} 行 · 约 {{ d.lesson.readMin }} 分钟
        </span>
      </div>
      <div class="lesson-body">
        <MarkdownBlock :content="d.lesson.body" />
      </div>
    </section>

    <!-- ③ 主动回忆 -->
    <section v-if="d.lesson?.quiz.length" id="s-quiz" class="dp-sec">
      <div class="dp-sec-head">
        <span class="dsh-no">③</span>
        <div class="dsh-main">
          <h2 class="dsh-title">主动回忆</h2>
          <p class="dsh-hint">合上答案，先在心里（或纸上）说一遍，再点开对。</p>
        </div>
      </div>
      <QuizBlock :items="d.lesson.quiz" :id-prefix="prefix" />
    </section>

    <!-- ④ 排错诊断 -->
    <section v-if="d.mastery?.debug.length" id="s-debug" class="dp-sec">
      <div class="dp-sec-head">
        <span class="dsh-no">④</span>
        <div class="dsh-main">
          <h2 class="dsh-title">排错诊断</h2>
          <p class="dsh-hint">会写不等于会修：先说清「哪里错了」，再说「怎么改」。</p>
        </div>
      </div>
      <DrillBlock
        v-for="(x, i) in d.mastery.debug"
        :key="`d${i}`"
        kind="debug"
        :index="i"
        :code="x.code"
        :lang="x.lang"
        :symptom="x.symptom"
        :ask="x.ask"
        :answer="x.answer"
        :id-prefix="prefix"
      />
    </section>

    <!-- ⑤ 迁移挑战 -->
    <section v-if="d.mastery?.transfer.length" id="s-transfer" class="dp-sec">
      <div class="dp-sec-head">
        <span class="dsh-no">⑤</span>
        <div class="dsh-main">
          <h2 class="dsh-title">迁移挑战</h2>
          <p class="dsh-hint">换一个没讲过的场景还能解，才叫掌握。</p>
        </div>
      </div>
      <DrillBlock
        v-for="(t, i) in d.mastery.transfer"
        :key="`t${i}`"
        kind="transfer"
        :index="i"
        :scene="t.scene"
        :ask="t.ask"
        :hint="t.hint"
        :answer="t.answer"
        :id-prefix="prefix"
      />
    </section>

    <!-- ⑥ 掌握判据 -->
    <section v-if="d.mastery?.criteria.length" id="s-criteria" class="dp-sec dp-sec-crit">
      <div class="dp-sec-head">
        <span class="dsh-no">⑥</span>
        <div class="dsh-main">
          <h2 class="dsh-title">掌握判据</h2>
          <p class="dsh-hint">勾之前先动手验证一遍；勾不上说明这天还没学会，回上一步补。</p>
        </div>
        <span class="dsh-count" :class="{ ok: crit.total > 0 && crit.done === crit.total }">
          {{ crit.done }}/{{ crit.total }}
        </span>
      </div>
      <ul class="dcrit">
        <li
          v-for="(c, i) in d.mastery.criteria"
          :key="i"
          :class="{ done: isCritDone(phaseId, day, i) }"
          @click="toggleCrit(phaseId, day, i)"
        >
          <span class="dc-box">{{ isCritDone(phaseId, day, i) ? '✓' : '' }}</span>
          <div class="dc-text"><MarkdownBlock :content="c" inline /></div>
        </li>
      </ul>
    </section>

    <!-- ⑦ 动手任务 -->
    <section id="s-tasks" class="dp-sec">
      <div class="dp-sec-head">
        <span class="dsh-no">⑦</span>
        <div class="dsh-main">
          <h2 class="dsh-title">动手任务</h2>
          <p class="dsh-hint">判据答得出，再动手；这里全部勾完才算收工。</p>
        </div>
        <span class="dsh-count" :class="{ ok: tasks.total > 0 && tasks.done === tasks.total }">
          {{ tasks.done }}/{{ tasks.total }}
        </span>
      </div>
      <ul class="dtasks">
        <li
          v-for="(t, i) in d.tasks"
          :key="i"
          :class="{ done: isTaskDone(phaseId, day, i) }"
          @click="toggleTask(phaseId, day, i)"
        >
          <span class="dt-box">{{ isTaskDone(phaseId, day, i) ? '✓' : '' }}</span>
          <div class="dt-text"><MarkdownBlock :content="t" inline /></div>
        </li>
      </ul>

      <div v-if="d.deliver" class="day-meta day-deliver">
        <span class="dm-label">交付</span>
        <div class="dm-text"><MarkdownBlock :content="d.deliver" inline /></div>
      </div>
      <div v-if="d.pitfall" class="day-meta day-pitfall">
        <span class="dm-label">卡点</span>
        <div class="dm-text"><MarkdownBlock :content="d.pitfall" inline /></div>
      </div>
    </section>

    <div class="dp-finish">
      <div class="dp-finish-text">
        <b>{{ dayDone(phaseId, day) ? '这一天已掌握' : '还差一点' }}</b>
        <span>
          判据 {{ crit.done }}/{{ crit.total }} · 任务 {{ tasks.done }}/{{ tasks.total }}——
          两项都满了才算真做完。
        </span>
      </div>
      <button class="today-btn" type="button" @click="toggleDay(phaseId, day)">
        {{ dayDone(phaseId, day) ? '取消今天已掌握' : '勾满，标记今天已掌握' }}
      </button>
    </div>

    <nav class="pn-nav day-pn">
      <a v-if="prev" class="pn-link" :href="hrefOf({ name: 'day', phase: prev.phaseId, day: prev.day })">
        <span class="pn-dir">← 上一天</span>
        <span class="pn-name">D{{ prev.day }} · {{ prev.title }}</span>
      </a>
      <span v-else class="pn-link disabled">
        <span class="pn-dir">← 上一天</span><span class="pn-name">这是第一天</span>
      </span>

      <a
        class="pn-link center"
        :href="hrefOf({ name: 'phase', phase: phaseId })"
      >
        <span class="pn-dir">阶段 {{ phaseId }} 目录</span>
        <span class="pn-name">{{ phase?.name }}</span>
      </a>

      <a v-if="next" class="pn-link right" :href="hrefOf({ name: 'day', phase: next.phaseId, day: next.day })">
        <span class="pn-dir">下一天 →</span>
        <span class="pn-name">D{{ next.day }} · {{ next.title }}</span>
      </a>
      <span v-else class="pn-link right disabled">
        <span class="pn-dir">下一天 →</span><span class="pn-name">94 天全部结束</span>
      </span>
    </nav>
  </div>

  <div v-else class="page">
    <p class="empty-page">没有这一天。<a href="#/">回到学习路线</a></p>
  </div>
</template>

<style scoped>
.empty-page {
  padding: 40px 6px;
  color: var(--text-faint);
}
</style>
