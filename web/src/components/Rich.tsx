/**
 * 极简 markdown 内联渲染。
 *
 * 日卡的正文里 agent 会自然地写出 **粗体** 和 `行内代码`。
 * 这里只处理这两类标记 + 换行，不引第三方库——
 * 引一个 markdown 库要多几十 KB，而日卡的正文格式很受控。
 *
 * 安全：走 React 元素而非 dangerouslySetInnerHTML，天然免疫注入。
 */

/** 行内代码 */
function InlineCode({ children }: { children: string }) {
  return (
    <code
      style={{
        fontFamily: 'var(--mono)',
        fontSize: '0.9em',
        background: 'var(--surface-2)',
        padding: '1px 5px',
        borderRadius: 4,
        color: '#0c447c',
      }}
    >
      {children}
    </code>
  )
}

/** 把一段文本切成 React 节点数组。key 用下标即可，静态内容不会重排。 */
function parseInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // 依次匹配 **粗体** 与 `代码`
  const re = /(\*\*([^*]+)\*\*)|(`([^`]+)`)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[2] !== undefined) {
      nodes.push(
        <strong key={`${keyBase}-b${i}`} style={{ fontWeight: 600 }}>
          {m[2]}
        </strong>,
      )
    } else if (m[4] !== undefined) {
      nodes.push(<InlineCode key={`${keyBase}-c${i}`}>{m[4]}</InlineCode>)
    }
    last = m.index + m[0].length
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/** 渲染可能含 markdown 内联标记的正文 */
export function Rich({ text, id }: { text: string; id: string }) {
  if (!text) return null
  // 代码块类的长文本不走内联解析（步骤里的 detail 可能含命令）
  return <>{parseInline(text, id)}</>
}

/** 步骤详情里可能含反引号包的多行命令，单独处理 */
export function RichSteps({ text, id }: { text: string; id: string }) {
  if (!text) return null
  // 把 ``` 包裹的块转成 <pre>
  const parts = text.split(/```/)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <pre
            key={`${id}-pre${i}`}
            style={{ margin: '8px 0', fontSize: 12.5, padding: '10px 12px' }}
          >
            <code>{p.replace(/^[a-z]*\n/, '')}</code>
          </pre>
        ) : (
          <Rich key={`${id}-t${i}`} text={p} id={`${id}-${i}`} />
        ),
      )}
    </>
  )
}
