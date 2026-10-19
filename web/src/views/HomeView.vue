<script setup lang="ts">
import { roadmap } from '../roadmap/data'
import { useProgress } from '../composables/useProgress'
import { hrefOf } from '../composables/useRouter'
import MarkdownBlock from '../components/MarkdownBlock.vue'

const { doneDays, totalDays, doneCriteria, totalCriteria, percent, nextDay, phaseProgress } =
  useProgress()

const dayHref = (phaseId: number, day: number) => hrefOf({ name: 'day', phase: phaseId, day })
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1>{{ roadmap.title }}</h1>
      <p>{{ roadmap.subtitle }}</p>
    </header>

    <!-- 今日入口：每天打开先看这一块，点进去就是一个独立的学习页 -->
    <section class="today" :class="{ alldone: !nextDay }">
      <div class="today-left">
        <div class="today-kicker">今天从这里开始</div>
        <template v-if="nextDay">
          <div class="today-title">
            阶段 {{ nextDay.phaseId }} · 第 {{ nextDay.day }} 天
            <span class="today-sep">/</span>
            {{ nextDay.title }}
          </div>
          <div class="today-sub">
            七步走完这一天：读前预测 {{ nextDay.predict }} 题 → 读 {{ nextDay.readMin }} 分钟讲解 →
            自测 {{ nextDay.quiz }} 题 → 排错 {{ nextDay.debug }} 题 → 迁移 {{ nextDay.transfer }} 题 →
            勾满判据 → 做 {{ nextDay.hours }} 小时任务
          </div>
        </template>
        <template v-else>
          <div class="today-title">全部 {{ totalDays }} 天已完成 🎉</div>
          <div class="today-sub">回到时间线复盘，或直接进入项目迭代。</div>
        </template>
      </div>
      <div class="today-right">
        <div class="today-stats">
          <span><b>{{ doneDays }}</b>/{{ totalDays }} 天掌握</span>
          <span><b>{{ doneCriteria }}</b>/{{ totalCriteria }} 条判据</span>
        </div>
        <a v-if="nextDay" class="today-btn" :href="dayHref(nextDay.phaseId, nextDay.day)">
          进入第 {{ nextDay.day }} 天 →
        </a>
      </div>
    </section>

    <section id="goal" class="doc-section">
      <div class="sec-kicker">🎯 最终目标</div>
      <MarkdownBlock :content="roadmap.goalMd" />
      <div class="callout"><MarkdownBlock :content="roadmap.prefaceMd" /></div>
      <div class="callout amber"><MarkdownBlock :content="roadmap.redisMd" /></div>
    </section>

    <section id="overview" class="doc-section">
      <h2 class="sec-title">🗺️ 阶段总览</h2>
      <p class="sec-sub">六个阶段、94 天，点任一阶段进入它的逐日清单。</p>

      <div class="phase-grid">
        <a
          v-for="p in roadmap.phases"
          :key="p.id"
          class="phase-card"
          :href="hrefOf({ name: 'phase', phase: p.id })"
        >
          <div class="pc-top">
            <span class="pc-no">阶段 {{ p.id }}</span>
            <span class="pc-days">{{ p.days.length }} 天</span>
          </div>
          <div class="pc-name">{{ p.name }}</div>
          <div class="pc-core">{{ p.core }}</div>
          <div class="pc-accept">验收：{{ p.acceptance }}</div>
          <div class="pc-bar">
            <div
              class="pc-fill"
              :style="{ width: (phaseProgress(p.id).daysDone / p.days.length) * 100 + '%' }"
            ></div>
          </div>
          <div class="pc-foot">
            <span>{{ phaseProgress(p.id).daysDone }}/{{ p.days.length }} 天掌握</span>
            <span>{{ p.weeks }}</span>
          </div>
        </a>
      </div>

      <details class="kpt kpt-overview">
        <summary>📋 阶段总览速查表（原文）</summary>
        <MarkdownBlock :content="roadmap.overviewMd" />
      </details>
    </section>

    <section id="pacing" class="doc-section">
      <h2 class="sec-title">⏱️ 每日节奏与拆分口径</h2>
      <p class="sec-sub">94 天是怎么来的，以及落后了怎么调整。</p>
      <MarkdownBlock :content="roadmap.pacingMd" />
    </section>

    <footer class="foot">
      家庭账本学习路线 · 94 天逐日计划 · 当前总进度 {{ percent }}% · 勾选仅保存在本机浏览器
    </footer>
  </div>
</template>
