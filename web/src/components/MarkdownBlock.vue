<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown, renderInline } from '../markdown'

const props = defineProps<{ content: string; inline?: boolean }>()

const html = computed(() =>
  props.inline ? renderInline(props.content) : renderMarkdown(props.content),
)

function onClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const btn = target.closest('.copy-btn') as HTMLButtonElement | null
  if (!btn) return
  const wrap = btn.closest('.code-wrap')
  const code = wrap?.querySelector('code')
  if (!code) return
  const text = code.textContent || ''
  navigator.clipboard
    ?.writeText(text)
    .then(() => {
      btn.textContent = '已复制'
      setTimeout(() => (btn.textContent = '复制'), 1200)
    })
    .catch(() => {
      btn.textContent = '复制失败'
      setTimeout(() => (btn.textContent = '复制'), 1200)
    })
}
</script>

<template>
  <div class="md" :class="{ 'md-inline': inline }" @click="onClick" v-html="html"></div>
</template>
