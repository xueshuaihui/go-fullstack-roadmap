import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import go from 'highlight.js/lib/languages/go'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import yaml from 'highlight.js/lib/languages/yaml'
import json from 'highlight.js/lib/languages/json'
import javascript from 'highlight.js/lib/languages/javascript'

// 按需注册：只打包用得到的语言，避免 highlight.js 全量 1MB
hljs.registerLanguage('go', go)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: false,
})

// 代码块：语法高亮 + 复制按钮（复制逻辑由 MarkdownBlock 的事件委托处理）
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const info = (token.info || '').trim()
  const lang = info.split(/\s+/)[0] || 'text'
  let code = md.utils.escapeHtml(token.content)

  if (lang && hljs.getLanguage(lang)) {
    try {
      code = hljs.highlight(token.content, { language: lang, ignoreIllegals: true }).value
    } catch {
      /* 高亮失败则退回转义后的原文 */
    }
  }

  const label = lang === 'text' ? 'code' : lang
  return (
    `<div class="code-wrap">` +
    `<div class="code-head"><span class="code-lang">${label}</span>` +
    `<button class="copy-btn" type="button" aria-label="复制代码">复制</button></div>` +
    `<pre class="hljs"><code class="language-${lang}">${code}</code></pre>` +
    `</div>`
  )
}

/** 渲染块级 Markdown（支持表格、代码块、列表、引用） */
export function renderMarkdown(src: string): string {
  return md.render(src)
}

/** 渲染行内 Markdown（用于验收项等单行文本） */
export function renderInline(src: string): string {
  return md.renderInline(src)
}

/** 去掉 Markdown 标记，得到纯文本（用于搜索摘要） */
export function stripMarkdown(src: string): string {
  return src
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
