<script setup lang="ts">
import { reactive } from 'vue'
import type { QuizItem } from '../roadmap/types'
import MarkdownBlock from './MarkdownBlock.vue'

const props = defineProps<{ items: QuizItem[]; idPrefix: string }>()

const opened = reactive(new Set<number>())

function toggle(i: number) {
  if (opened.has(i)) opened.delete(i)
  else opened.add(i)
}

function openAll() {
  props.items.forEach((_, i) => opened.add(i))
}
function closeAll() {
  opened.clear()
}
</script>

<template>
  <div v-if="items.length" class="quiz">
    <div class="quiz-head">
      <span class="quiz-title">自测：先自己答，再点开对</span>
      <span class="quiz-actions">
        <button class="mini-btn" type="button" @click="openAll">全部答案</button>
        <button class="mini-btn" type="button" @click="closeAll">收起</button>
      </span>
    </div>
    <p class="quiz-hint">
      读一遍不算学会。先在心里（或纸上）答出来再点开——答不出说明这一段还得重读，不要直接翻答案。
    </p>
    <ol class="quiz-list">
      <li v-for="(it, i) in items" :key="i" :id="`${idPrefix}-q${i}`" class="quiz-item">
        <div class="quiz-q"><MarkdownBlock :content="it.q" inline /></div>
        <button class="quiz-toggle" type="button" @click="toggle(i)">
          {{ opened.has(i) ? '收起答案' : '我的答案对一下' }}
        </button>
        <div v-show="opened.has(i)" class="quiz-a">
          <MarkdownBlock :content="it.a" />
        </div>
      </li>
    </ol>
  </div>
</template>
