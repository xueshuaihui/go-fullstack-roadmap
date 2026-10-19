<script setup lang="ts">
import MarkdownBlock from '../components/MarkdownBlock.vue'

const props = defineProps<{
  kicker: string
  title: string
  sub?: string
  md: string
}>()
</script>

<template>
  <div class="page">
    <nav class="crumbs">
      <a href="#/">学习路线</a>
      <span class="crumb-sep">›</span>
      <span>{{ title }}</span>
    </nav>
    <section class="doc-section">
      <div class="sec-kicker">{{ kicker }}</div>
      <h1 class="doc-h1">{{ title }}</h1>
      <p v-if="sub" class="sec-sub">{{ sub }}</p>
      <MarkdownBlock :content="md" />
    </section>
    <footer class="foot">
      <a href="#/">← 回到学习路线</a>
    </footer>
  </div>
</template>
