import { useEffect, useMemo, useState } from 'react'
import { useProgress } from './data/progress'
import { MILESTONES, SEGMENTS, STAGES, TOTAL_CARDS, TOTAL_WEEKS } from './data/stages'
import { loadAll, loadStage, stageMeta } from './data/cards'
import type { Card } from './data/types'
import { TutorialFlow } from './components/CardBlocks'

type Route =
  | { v: 'home' }
  | { v: 'stage'; code: string }
  | { v: 'card'; id: string }
  | { v: 'search' }

// ---------- 侧栏 ----------
function Sidebar({
  route,
  nav,
  doneCount,
}: {
  route: Route
  nav: (r: Route) => void
  doneCount: (code: string) => number
}) {
  // 当前所在阶段：卡片页从 id 前缀取（s0-d1 → S0），阶段页用路由参数
  const activeCode =
    route.v === 'stage' ? route.code : route.v === 'card' ? route.id.split('-')[0].toUpperCase() : ''

  return (
    <aside className="sidebar">
      {SEGMENTS.map((seg) => (
        <div key={seg.name}>
          <div className="seg-label">
            {seg.name} · {seg.weeks}
          </div>
          {seg.stages.map((code) => {
            const m = stageMeta(code)!
            const n = doneCount(code)
            const on = activeCode === m.code
            const complete = m.cards > 0 && n >= m.cards
            return (
              <button
                key={code}
                className={`stage-item${on ? ' on' : ''}${complete ? ' done' : ''}`}
                onClick={() => nav({ v: 'stage', code })}
              >
                <span className="code">{m.code}</span>
                <span className="nm">{m.name}</span>
                <span className="badge">{complete ? `${n}✓` : m.cards ? `${n}/${m.cards}` : '—'}</span>
              </button>
            )
          })}
        </div>
      ))}
    </aside>
  )
}

// ---------- 首页 ----------
function Home({ nav, done, total }: { nav: (r: Route) => void; done: number; total: number }) {
  return (
    <div className="main narrow">
      <div className="hero">
        <h1>从今天开始，59 周建成 HomeCube</h1>
        <p>
          你有 React / TypeScript 基础，服务端零基础。这里每天一张卡：概念讲清为什么需要、配一段能直接跑的代码、
          列出新手会犯的错，最后给一个当天可验收的产出。看完就能动手，不需要再查别的资料。
        </p>
        <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={() => nav({ v: 'stage', code: 'S0' })}>
            从 S0 第一张卡开始
          </button>
          <button className="btn" onClick={() => nav({ v: 'search' })}>
            搜索全部知识点
          </button>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="v">{TOTAL_WEEKS}</div>
          <div className="k">周（约 13.7 个月）</div>
        </div>
        <div className="stat">
          <div className="v">{TOTAL_CARDS}</div>
          <div className="k">张日卡</div>
        </div>
        <div className="stat">
          <div className="v">15</div>
          <div className="k">个阶段</div>
        </div>
        <div className="stat">
          <div className="v">3</div>
          <div className="k">个服务（homeos / calendar / finance）</div>
        </div>
        <div className="stat">
          <div className="v">{done}</div>
          <div className="k">已完成（今日已产出 {total}）</div>
        </div>
      </div>

      <div className="mini-panel" style={{ marginBottom: 18 }}>
        <h3>每天怎么过</h3>
        <div className="howto">
          <div className="step-card">
            <div className="n">1</div>
            <h4>工作日 1 小时</h4>
            <p>0-10 分跑一遍昨天的东西确认是绿的；10-40 分读今天的卡；40-55 分写代码；最后 5 分写笔记。</p>
          </div>
          <div className="step-card">
            <div className="n">2</div>
            <h4>周六 5 小时</h4>
            <p>把本周 5 个微增量串起来，再做一个功能域的完整链路：契约 → 后端 → 前端 → 联调。</p>
          </div>
          <div className="step-card">
            <div className="n">3</div>
            <h4>周日 5 小时</h4>
            <p>前 3 小时补上周六的尾巴，后 2 小时费曼复盘：不看资料把本周学的讲一遍，讲不下去的就是下周第一个要补的。</p>
          </div>
        </div>
      </div>

      <div className="mini-panel">
        <h3>五道能力里程碑</h3>
        <ul>
          {MILESTONES.map((m) => (
            <li key={m.id}>
              <b>
                W{m.week} {m.name}
              </b>{' '}
              — {m.desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ---------- 阶段页 ----------
function StageView({
  code,
  nav,
  isDone,
  doneCount,
}: {
  code: string
  nav: (r: Route) => void
  isDone: (id: string) => boolean
  doneCount: (code: string) => number
}) {
  const meta = stageMeta(code)
  const [cards, setCards] = useState<Card[] | null>(null)

  useEffect(() => {
    setCards(null)
    loadStage(code).then(setCards)
  }, [code])

  if (!meta) return <div className="main">未知阶段</div>
  const n = doneCount(code)
  const ready = (cards?.length ?? 0) > 0

  return (
    <div className="main">
      <div className="crumb">
        <button onClick={() => nav({ v: 'home' })}>首页</button> / {meta.segment} / {meta.code}
      </div>
      <div className="stage-hero">
        <div className="meta">
          <span className="pill acc">{meta.span}</span>
          <span className="pill">{meta.weeks} 周</span>
          <span className="pill">{meta.cards} 张卡</span>
          {meta.difficulty >= 1.3 && <span className="pill warn">难度系数 {meta.difficulty}</span>}
          {ready && (
            <span className="pill">
              已完成 {n}/{cards?.length}
            </span>
          )}
        </div>
        <h1>
          <span className="code-big">{meta.code}</span>
          {meta.name}
        </h1>
        <p>{meta.summary}</p>
      </div>

      <div className="two-col">
        <div className="mini-panel">
          <h3>通过判据（全过才进下一阶段）</h3>
          <ul>
            {meta.outcomes.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
        <div className="mini-panel">
          <h3>这个阶段要产出什么</h3>
          <ul>
            {meta.artifacts.map((a, i) => (
              <li key={i}>
                <code>{a}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mini-panel">
        <h3>日卡（{cards?.length ?? '…'} 张）</h3>
        {!cards && <p style={{ color: 'var(--text-3)', fontSize: 14 }}>正在加载…</p>}
        {cards && cards.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontSize: 14, margin: 0 }}>
            这一阶段的卡片还在写。已完成的阶段：S0、S1。
          </p>
        )}
        {cards && cards.length > 0 && (
          <div className="card-list">
            {cards.map((c) => (
              <button key={c.id} className="card-row" onClick={() => nav({ v: 'card', id: c.id })}>
                <span className="dn">
                  W{c.week}·D{c.day}
                </span>
                <span className="ti">{c.title}</span>
                {isDone(c.id) && <span className="tick">✓</span>}
                <span className="du">{c.duration}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- 日卡页 ----------
function CardView({
  id,
  nav,
  isDone,
  toggle,
  setLast,
}: {
  id: string
  nav: (r: Route) => void
  isDone: (id: string) => boolean
  toggle: (id: string) => void
  setLast: (id: string) => void
}) {
  const [all, setAll] = useState<Card[] | null>(null)
  const [stage, setStage] = useState<string>('')

  useEffect(() => {
    setAll(null)
    setStage(id.split('-')[0].toUpperCase())
    loadAll().then(setAll)
  }, [id])

  useEffect(() => {
    if (all) setLast(id)
  }, [id, all, setLast])

  if (!all) {
    return (
      <div className="main narrow">
        <p style={{ color: 'var(--text-3)' }}>正在加载…</p>
      </div>
    )
  }

  const idx = all.findIndex((c) => c.id === id)
  const card = idx >= 0 ? all[idx] : undefined

  if (!card) {
    return (
      <div className="main narrow">
        <div className="empty">
          <div className="big">找不到这张卡：{id}</div>
          <div>它可能还没写，或者 id 有误。</div>
          <button className="btn" style={{ marginTop: 16 }} onClick={() => nav({ v: 'stage', code: stage })}>
            回到 {stage}
          </button>
        </div>
      </div>
    )
  }

  const prev = idx > 0 ? all[idx - 1] : null
  const next = idx < all.length - 1 ? all[idx + 1] : null
  const meta = stageMeta(card.stage)

  return (
    <div className="main narrow">
      <div className="crumb">
        <button onClick={() => nav({ v: 'home' })}>首页</button> /{' '}
        <button onClick={() => nav({ v: 'stage', code: card.stage })}>
          {card.stage} {meta?.name}
        </button>{' '}
        / W{card.week}·D{card.day}
      </div>

      <div className="page-head">
        <h1>{card.title}</h1>
        <p>{card.goal}</p>
      </div>

      <TutorialFlow card={card} />

      <div className="card-nav">
        <button className="btn" disabled={!prev} onClick={() => prev && nav({ v: 'card', id: prev.id })}>
          ← 上一张
        </button>
        <span className="spacer" />
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
          {idx + 1} / {all.length}
        </span>
        <button className="btn" disabled={!next} onClick={() => next && nav({ v: 'card', id: next.id })}>
          下一张 →
        </button>
      </div>
    </div>
  )
}

// ---------- 搜索页 ----------
function SearchView({ nav }: { nav: (r: Route) => void }) {
  const [q, setQ] = useState('')
  const [all, setAll] = useState<Card[]>([])
  const [stageFilter, setStageFilter] = useState('')

  useEffect(() => {
    loadAll().then(setAll)
  }, [])

  const results = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return all.filter((c) => {
      if (stageFilter && c.stage !== stageFilter) return false
      if (!kw) return true
      const hay = [
        c.title,
        c.goal,
        c.why.problem,
        c.why.right,
        ...c.concepts.map((x) => x.name + x.explanation),
        ...c.pitfalls.map((x) => x.wrong + x.right + x.why),
        ...c.quiz.map((x) => x.q),
        c.code.content,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(kw)
    })
  }, [q, all, stageFilter])

  const withStage = STAGES.filter((s) => all.some((c) => c.stage === s.code))

  return (
    <div className="main narrow">
      <div className="page-head">
        <h1>搜索全部知识点</h1>
        <p>已收录 {all.length} 张卡。搜「游标」「乐观锁」「404」「nil」这类词，直接跳到讲它的那张卡。</p>
      </div>
      <div className="toolbar">
        <input
          className="search"
          placeholder="输入关键词…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
        <div className="seg-toggle">
          <button className={stageFilter === '' ? 'on' : ''} onClick={() => setStageFilter('')}>
            全部
          </button>
          {withStage.map((s) => (
            <button key={s.code} className={stageFilter === s.code ? 'on' : ''} onClick={() => setStageFilter(s.code)}>
              {s.code}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="empty">
          <div className="big">没有找到「{q}」</div>
          <div>换个词试试，或者清空搜索看全部 {all.length} 张卡。</div>
        </div>
      ) : (
        <div className="card-list">
          {results.map((c) => (
            <button key={c.id} className="card-row" onClick={() => nav({ v: 'card', id: c.id })}>
              <span className="dn">{c.stage}</span>
              <span className="ti">{c.title}</span>
              <span className="du">W{c.week}·D{c.day}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- 应用 ----------
export default function App() {
  const [route, setRoute] = useState<Route>({ v: 'home' })
  const prog = useProgress()

  const nav = (r: Route) => {
    setRoute(r)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  useEffect(() => {
    if (prog.lastCard) setRoute({ v: 'card', id: prog.lastCard })
    // 只在首次挂载时用lastCard 恢复位置
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const doneCount = (code: string) => prog.done.filter((id) => id.startsWith(code.toLowerCase() + '-')).length
  const pct = Math.round((prog.done.length / TOTAL_CARDS) * 100)

  const tab: 'home' | 'search' | 'progress' =
    route.v === 'home' ? 'home' : route.v === 'search' ? 'search' : 'progress'

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="mark">H</span>
          HomeCube 学习站
          <small>零基础全栈 · 59 周</small>
        </div>
        <nav>
          <button className={tab === 'home' ? 'on' : ''} onClick={() => nav({ v: 'home' })}>
            首页
          </button>
          <button className={tab === 'search' ? 'on' : ''} onClick={() => nav({ v: 'search' })}>
            搜索
          </button>
          {prog.lastCard && (
            <button onClick={() => nav({ v: 'card', id: prog.lastCard })}>继续上次</button>
          )}
        </nav>
        <span className="spacer" />
        <div className="progress-chip" title="进度存在浏览器本地，清缓存会丢">
          <div className="progress-bar">
            <i style={{ width: `${pct}%` }} />
          </div>
          <span>
            <b>{prog.done.length}</b> / {TOTAL_CARDS} 张 · {pct}%
          </span>
        </div>
      </header>

      <div className="layout">
        <Sidebar route={route} nav={nav} doneCount={doneCount} />
        {route.v === 'home' && <Home nav={nav} done={prog.done.length} total={doneCount('S0')} />}
        {route.v === 'stage' && (
          <StageView code={route.code} nav={nav} isDone={prog.isDone} doneCount={doneCount} />
        )}
        {route.v === 'card' && (
          <CardView
            id={route.id}
            nav={nav}
            isDone={prog.isDone}
            toggle={prog.toggle}
            setLast={prog.setLast}
          />
        )}
        {route.v === 'search' && <SearchView nav={nav} />}
      </div>
    </div>
  )
}
