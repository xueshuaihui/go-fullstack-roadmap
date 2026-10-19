<script setup lang="ts">
import { useProgress } from '../composables/useProgress'
import MarkdownBlock from './MarkdownBlock.vue'

defineProps<{ phaseId: number; items: string[] }>()

const { isAcceptDone, toggleAccept } = useProgress()
</script>

<template>
  <ul class="checklist">
    <li
      v-for="(item, i) in items"
      :key="i"
      :class="{ done: isAcceptDone(phaseId, i) }"
      @click="toggleAccept(phaseId, i)"
    >
      <span class="ck-box">{{ isAcceptDone(phaseId, i) ? '✓' : '' }}</span>
      <div class="ck-text"><MarkdownBlock :content="item" inline /></div>
    </li>
  </ul>
</template>
