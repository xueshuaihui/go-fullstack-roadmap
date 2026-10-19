<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SearchEntry } from '../roadmap/types'

const props = defineProps<{ entries: SearchEntry[] }>()

const query = ref('')
const open = ref(false)
const focused = ref(false)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length === 0) return []
  return props.entries.filter((e) => e.text.toLowerCase().includes(q)).slice(0, 30)
})

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function snippet(text: string): string {
  const q = query.value.trim()
  const lower = text.toLowerCase()
  const idx = lower.indexOf(q.toLowerCase())
  const start = Math.max(0, idx - 24)
  const end = Math.min(text.length, idx + q.length + 48)
  let out = text.slice(start, end)
  if (start > 0) out = '…' + out
  if (end < text.length) out = out + '…'
  return esc(out).replace(new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (m) => `<mark>${m}</mark>`)
}

function jump(href: string) {
  open.value = false
  query.value = ''
  // 直接改 hash，由路由切到目标页面（同一地址再点一次也能回到顶部）
  if (location.hash === href) window.scrollTo({ top: 0, behavior: 'smooth' })
  else location.hash = href
}

function onFocus() {
  focused.value = true
  if (query.value.trim()) open.value = true
}

function onBlur() {
  // 延迟关闭，保证点击结果能触发
  focused.value = false
  setTimeout(() => (open.value = false), 160)
}

function onInput() {
  open.value = query.value.trim().length > 0
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false
    ;(e.target as HTMLInputElement).blur()
  } else if (e.key === 'Enter' && results.value.length > 0) {
    jump(results.value[0].href)
  }
}
</script>

<template>
  <div class="search">
    <input
      v-model="query"
      class="search-input"
      type="search"
      placeholder="搜索知识点 / 命令 / 报错…"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @keydown="onKeydown"
    />

    <div v-if="open && query.trim()" class="search-panel">
      <div v-if="results.length === 0" class="search-empty">没有匹配结果</div>
      <button
        v-for="(r, i) in results"
        :key="i"
        class="search-result"
        @mousedown.prevent="jump(r.href)"
      >
        <span class="sr-section">{{ r.section }}</span>
        <span class="sr-text" v-html="snippet(r.text)"></span>
      </button>
      <div v-if="results.length > 0" class="search-hint">
        共 {{ results.length }} 条结果 · 回车跳到第一条
      </div>
    </div>
  </div>
</template>
