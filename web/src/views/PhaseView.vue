<script setup lang="ts">
import { computed } from 'vue'
import { findPhase, roadmap } from '../roadmap/data'
import { useProgress } from '../composables/useProgress'
import { hrefOf } from '../composables/useRouter'
import MarkdownBlock from '../components/MarkdownBlock.vue'
import Checklist from '../components/Checklist.vue'

const props = defineProps<{ phaseId: number }>()

const phase = computed(() => findPhase(props.phaseId))
const { dayDone, dayProgress, critProgress, isAcceptDone } = useProgress()

const idx = computed(() => roadmap.phases.findIndex((p) => p.id === props.phaseId))
const prevPhase = computed(() => roadmap.phases[idx.value - 1] ?? null)
const nextPhase = computed(() => roadmap.phases[idx.value + 1] ?? null)

const doneCount = computed(() =>
  phase.value ? phase.value.days.filter((d) => dayDone(props.phaseId, d.day)).length : 0,
)
const pct = computed(() =>
  phase.value && phase.value.days.length
    ? Math.round((doneCount.value / phase.value.days.length) * 100)
    : 0,
)

const nextDayNo = computed(
  () => phase.value?.days.find((d) => !dayDone(props.phaseId, d.day))?.day ?? -1,
)

function acceptDoneAll() {
  const p = phase.value
  if (!p) return false
  return p.checklist.every((_, i) => isAcceptDone(p.id, i))
}
</script>

<template>
  <div v-if="phase" class="page">
    <nav class="crumbs">
      <a href="#/">学习路线</a>
      <span class="crumb-sep">›</span>
      <span>阶段 {{ phase.id }}</span>
    </nav>

    <header class="phase-hero">
      <div class="ph-top">
        <span class="ph-no">阶段 {{ phase.id }}</span>
        <span class="ph-weeks">{{ phase.weeks }} · {{ phase.days.length }} 天</span>
      </div>
      <h1 class="ph-name">{{ phase.name }}</h1>
      <p class="ph-core">{{ phase.core }}</p>
      <p class="ph-accept"><b>阶段验收</b>：{{ phase.acceptance }}</p>
      <div class="ph-progress">
        <div class="ph-track"><div class="ph-fill" :style="{ width: pct + '%' }"></div></div>
        <span class="ph-pct">{{ doneCount }}/{{ phase.days.length }} 天 · {{ pct }}%</span>
      </div>
    </header>

    <section class="ph-days">
      <div class="ph-days-head">
        <h2>📅 逐日清单</h2>
        <p>每天一个知识点、一套完整教学流程。点进去就是当天的学习页。</p>
      </div>

      <a
        v-for="d in phase.days"
        :key="d.day"
        class="pd-row"
        :class="{ done: dayDone(phase.id, d.day), next: d.day === nextDayNo }"
        :href="hrefOf({ name: 'day', phase: phase.id, day: d.day })"
      >
        <span class="pd-check" aria-hidden="true">{{ dayDone(phase.id, d.day) ? '✓' : '' }}</span>
        <span class="pd-no">D{{ d.day }}</span>
        <span class="pd-main">
          <span class="pd-title">
            {{ d.title }}
            <span v-if="d.tag" class="day-tag" :class="`tag-${d.tag}`">{{ d.tag }}</span>
            <span v-if="d.lesson?.depth === 'core'" class="depth-chip">硬骨头</span>
            <span v-else-if="d.lesson?.depth === 'light'" class="depth-chip depth-light">速通</span>
          </span>
          <span class="pd-sub">
            判据 {{ critProgress(phase.id, d.day).done }}/{{ critProgress(phase.id, d.day).total }}
            · 任务 {{ dayProgress(phase.id, d.day).done }}/{{ dayProgress(phase.id, d.day).total }}
            · 约 {{ d.hours }} 小时
            <template v-if="d.lesson"> · 读 {{ d.lesson.readMin }} 分钟</template>
          </span>
        </span>
        <span v-if="d.day === nextDayNo" class="pd-next">下一站</span>
        <span class="pd-go">→</span>
      </a>
    </section>

    <details class="kpt">
      <summary>📖 阶段知识点速查（中途忘了回来翻，不用从头读）</summary>
      <MarkdownBlock :content="phase.md" />
    </details>

    <section class="accept-block">
      <div class="accept-title">
        ✅ 阶段验收
        <span class="accept-count">{{ acceptDoneAll() ? '已通过' : '离开这一阶段前必须过' }}</span>
      </div>
      <Checklist :phase-id="phase.id" :items="phase.checklist" />
    </section>

    <nav class="pn-nav">
      <a v-if="prevPhase" class="pn-link" :href="hrefOf({ name: 'phase', phase: prevPhase.id })">
        <span class="pn-dir">← 上一阶段</span>
        <span class="pn-name">{{ prevPhase.id }}. {{ prevPhase.name }}</span>
      </a>
      <span v-else class="pn-link disabled"><span class="pn-dir">← 上一阶段</span><span class="pn-name">已是第一个阶段</span></span>

      <a v-if="nextPhase" class="pn-link right" :href="hrefOf({ name: 'phase', phase: nextPhase.id })">
        <span class="pn-dir">下一阶段 →</span>
        <span class="pn-name">{{ nextPhase.id }}. {{ nextPhase.name }}</span>
      </a>
      <span v-else class="pn-link right disabled"><span class="pn-dir">下一阶段 →</span><span class="pn-name">已是最后一个阶段</span></span>
    </nav>
  </div>
</template>
