<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MarkdownBlock from './MarkdownBlock.vue'

/**
 * 一道「必须自己想」的练习：
 * 预测（读前猜结果）/ 排错（给坏代码找病灶）/ 迁移（换场景再解一次）。
 * 答案默认折叠——先自己答，再对答案，否则等于没练。
 */
const props = defineProps<{
  kind: 'predict' | 'debug' | 'transfer'
  index: number
  /** 预测题 / 排错题里的代码 */
  code?: string
  lang?: string
  /** 排错题的现象 */
  symptom?: string
  /** 迁移题的场景 */
  scene?: string
  ask: string
  hint?: string
  answer: string
  idPrefix: string
}>()

const openAnswer = ref(false)
const openHint = ref(false)

const labels = {
  predict: { tag: '读前预测', hint: '先别往下读，写下你的答案' },
  debug: { tag: '排错诊断', hint: '先说清「哪里错了」，再说「怎么改」' },
  transfer: { tag: '迁移挑战', hint: '换了个场景，你还认得出来吗' },
} as const

const meta = computed(() => labels[props.kind])
const anchor = computed(() => `${props.idPrefix}-${props.kind}-${props.index}`)

/** 用 markdown 围栏渲染，复用语法高亮与复制按钮 */
const fence = computed(() => {
  const lang = props.lang || 'text'
  return '```' + lang + '\n' + (props.code || '') + '\n```'
})

/**
 * 预测题要求「先写下猜测」：不写就直接看答案，等于把练习变回阅读。
 * 草稿存本地，刷新不丢，方便第二天回看自己当时错在哪。
 */
const GUESS_KEY = 'family-ledger-roadmap:guesses:v1'

function loadGuess(): string {
  try {
    const raw = localStorage.getItem(GUESS_KEY)
    if (raw) {
      const map = JSON.parse(raw) as Record<string, string>
      return map[anchor.value] ?? ''
    }
  } catch {
    /* ignore */
  }
  return ''
}

const guess = ref(loadGuess())

watch(guess, (val) => {
  try {
    const raw = localStorage.getItem(GUESS_KEY)
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {}
    if (val.trim()) map[anchor.value] = val
    else delete map[anchor.value]
    localStorage.setItem(GUESS_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
})

const hasGuess = computed(() => guess.value.trim().length > 0)
</script>

<template>
  <div class="drill" :class="`drill-${kind}`" :id="anchor">
    <div class="drill-head">
      <span class="drill-tag">{{ meta.tag }} {{ index + 1 }}</span>
      <span class="drill-tip">{{ meta.hint }}</span>
    </div>

    <div v-if="symptom" class="drill-symptom">
      <span class="ds-label">现象</span>
      <div class="ds-text"><MarkdownBlock :content="symptom" inline /></div>
    </div>

    <div v-if="scene" class="drill-scene">
      <span class="ds-label">场景</span>
      <div class="ds-text"><MarkdownBlock :content="scene" inline /></div>
    </div>

    <div v-if="code" class="drill-code">
      <MarkdownBlock :content="fence" />
    </div>

    <div class="drill-ask">
      <span class="da-label">问</span>
      <div class="da-text"><MarkdownBlock :content="ask" inline /></div>
    </div>

    <div v-if="kind === 'predict'" class="drill-guess">
      <input
        v-model="guess"
        type="text"
        class="guess-input"
        placeholder="先写下你的预测：结果是什么、为什么（会保存在本机）"
      />
      <span v-if="hasGuess" class="guess-ok">已记录，读完回来对照</span>
    </div>

    <div class="drill-actions">
      <button v-if="hint" class="drill-btn ghost" @click="openHint = !openHint">
        {{ openHint ? '收起提示' : '卡住了？看提示' }}
      </button>
      <button
        class="drill-btn"
        :class="{ 'need-guess': kind === 'predict' && !hasGuess }"
        @click="openAnswer = !openAnswer"
      >
        {{
          openAnswer
            ? '收起答案'
            : kind === 'predict'
              ? hasGuess
                ? '对答案'
                : '还没写预测，仍要看答案'
              : '我先答过了，对答案'
        }}
      </button>
    </div>

    <div v-if="hint && openHint" class="drill-hint">
      <span class="dh-label">提示（不是答案）</span>
      <MarkdownBlock :content="hint" />
    </div>

    <div v-if="openAnswer" class="drill-answer">
      <div v-if="hasGuess" class="guess-compare">
        <span class="gc-label">你写的</span>
        <span class="gc-text">{{ guess }}</span>
      </div>
      <div class="dan-label">答案与理由</div>
      <MarkdownBlock :content="answer" />
    </div>
  </div>
</template>
