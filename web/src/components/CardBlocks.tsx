import { useState } from 'react'
import type { Card } from '../data/types'
import { Rich, RichSteps } from './Rich'

// ---------- 教程流：讲练结合的五阶段引导 ----------
export function TutorialFlow({ card }: { card: Card }) {
  const t = card.teaching
  const [openPhase, setOpenPhase] = useState<number | null>(0) // 默认展开第一个阶段
  const [userScript, setUserScript] = useState<string>('') // 学习者正在编写的脚本

  // 如果没有 teaching 数据，回退到显示原有结构
  if (!t || t.phases.length === 0) {
    return <LegacyView card={card} />
  }

  return (
    <div className="card-panel tutorial">
      {/* 前置知识检查 */}
      {t.prerequisites.length > 0 && (
        <div className="prereq-box">
          <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>前置知识检查</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {t.prerequisites.map((p, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                <b>{p.topic}</b>（{p.day}）：<code>{p.check}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 最终产出目标 */}
      <div className="goal-box">
        <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>🎯 今日产出</h3>
        <p style={{ margin: 0 }}>
          完成 <code>lab/s0/d3/main.sh</code> 脚本，执行后能：
          ① 起 PostgreSQL 容器 ② 探活等待就绪 ③ 连进去查版本 ④ 看端口映射
        </p>
      </div>

      {/* 五阶段教程 */}
      {t.phases.map((phase, idx) => {
        const isOpen = openPhase === idx
        return (
          <div key={idx} className="phase-accordion">
            <button
              onClick={() => setOpenPhase(isOpen ? null : idx)}
              className={`phase-header${isOpen ? ' open' : ''}`}
            >
              <span>
                阶段 {idx + 1}：{phase.name}
                <span className="phase-duration">{phase.duration}</span>
              </span>
              <span className="phase-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="phase-content">
                {/* 讲解部分 */}
                {renderExplanation(phase, card, idx)}

                {/* 演示部分 */}
                {renderDemo(phase, card, idx, userScript)}

                {/* 练习部分 */}
                {renderPractice(phase, card, idx, userScript, setUserScript)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------- 讲解部分：每个阶段的必要知识 ----------
function renderExplanation(phase: any, card: Card, idx: number) {
  // 阶段 1：预热 - Why + 核心概念类比
  if (idx === 0) {
    return (
      <div className="phase-section explanation">
        <h4 className="section-title">📖 讲解</h4>
        
        <div className="why-simple">
          <div className="why-row-simple">
            <b>问题：</b>
            <Rich text={card.why.problem} id="wp-simple" />
          </div>
          <div className="why-row-simple">
            <b>新手误解：</b>
            <Rich text={card.why.naive} id="wn-simple" />
          </div>
          <div className="why-row-simple">
            <b>正确理解：</b>
            <Rich text={card.why.right} id="wr-simple" />
          </div>
        </div>

        <div className="core-analogy">
          <b>核心类比：</b>
          <p>
            <b>镜像 vs 容器 = class vs new 对象</b>
            <br />
            镜像是只读模板（像编译好的 class），容器是运行实例（像 new 出来的对象）。
            同一个镜像可以起多个容器，就像同一个 class 可以 new 多个对象。
          </p>
        </div>
      </div>
    )
  }

  // 阶段 2：搭建骨架 - docker run 参数讲解
  if (idx === 1) {
    return (
      <div className="phase-section explanation">
        <h4 className="section-title">📖 讲解</h4>
        
        <div className="params-grid">
          <div className="param-item">
            <code>--name</code>
            <span>给容器起名（比随机 ID 好用十倍）</span>
          </div>
          <div className="param-item">
            <code>-e</code>
            <span>设置环境变量（PG 的账号密码全靠它）</span>
          </div>
          <div className="param-item">
            <code>-p</code>
            <span>端口映射（宿主机端口:容器端口）</span>
          </div>
          <div className="param-item">
            <code>-d</code>
            <span>后台运行（否则终端被占住）</span>
          </div>
        </div>

        <div className="key-insight">
          <b>关键点：</b>PostgreSQL 镜像约定读取三个环境变量：
          <code>POSTGRES_USER</code>、<code>POSTGRES_PASSWORD</code>、<code>POSTGRES_DB</code>
        </div>
      </div>
    )
  }

  // 阶段 3：实现探活 - 为什么不能用 sleep
  if (idx === 2) {
    return (
      <div className="phase-section explanation">
        <h4 className="section-title">📖 讲解</h4>
        
        <div className="sleep-problem">
          <b>为什么不能用 sleep 10？</b>
          <p>
            PostgreSQL 启动时间取决于磁盘负载，可能 200ms 也可能 5s。
            sleep 是把「大概」当「确定」用，在 CI 和脚本里必然偶发失败。
          </p>
        </div>

        <table className="approach-table">
          <thead>
            <tr>
              <th>方案</th>
              <th>做法</th>
              <th>可靠性</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>sleep 10</code></td>
              <td>盲目等待固定时间</td>
              <td className="cons-cell">❌ 偶发失败</td>
            </tr>
            <tr>
              <td><code>pg_isready 轮询</code></td>
              <td>反复探活直到返回 0</td>
              <td className="pros-cell">✅ 确定性高</td>
            </tr>
            <tr>
              <td><code>--health-cmd</code></td>
              <td>Docker 内置健康检查</td>
              <td className="pros-cell">✅ 最优雅</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  // 阶段 4：验证与排错 - 常见错误现象
  if (idx === 3) {
    return (
      <div className="phase-section explanation">
        <h4 className="section-title">📖 讲解</h4>
        
        <div className="anti-patterns-intro">
          <p>下面两个反例展示了新手最常犯的两个错误。运行它们，观察错误现象，记住这些「坑」。</p>
        </div>

        {card.pitfalls.slice(0, 2).map((p, i) => (
          <div className="pitfall-simple" key={i}>
            <div className="wrong">
              <b>❌ 错误做法：</b>
              <Rich text={p.wrong} id={`pw-simple-${i}`} />
            </div>
            <div className="right">
              <b>✅ 正确做法：</b>
              <Rich text={p.right} id={`pr-simple-${i}`} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 阶段 5：收口 - 验收标准
  if (idx === 4) {
    return (
      <div className="phase-section explanation">
        <h4 className="section-title">📖 讲解</h4>
        <p>现在你已经完成了脚本的所有部分。下面是验收标准，逐项核对确保都做到了。</p>
      </div>
    )
  }

  return null
}

// ---------- 演示部分：展示代码或运行结果 ----------
function renderDemo(phase: any, card: Card, idx: number, userScript: string) {
  // 阶段 1：展示最终输出样例
  if (idx === 0) {
    return (
      <div className="phase-section demo">
        <h4 className="section-title">👁️ 演示：最终效果</h4>
        <div className="expect-preview">
          <pre><code>{card.code.expect.split('\n').slice(0, 8).join('\n')}</code></pre>
          <p className="expect-note">↑ 这是脚本运行后的完整输出，接下来 4 个阶段你会逐步构建出这个脚本</p>
        </div>
      </div>
    )
  }

  // 阶段 2：展示 skeleton 代码
  if (idx === 1) {
    return (
      <div className="phase-section demo">
        <h4 className="section-title">👁️ 演示：骨架代码</h4>
        <div className="skeleton-code">
          <div className="code-head">
            <span className="lang">bash</span>
            <span className="fname">skeleton.sh（需要填 5 个空）</span>
          </div>
          <pre><code>{`#!/usr/bin/env bash
set -euo pipefail

# TODO 1: 给容器起名
NAME=__________

# TODO 2: 先清理旧容器
docker rm -f "$NAME" 2>/dev/null || true

# TODO 3: 启动 PostgreSQL 容器（补充四个 -e 参数）
docker run --name "$NAME" \\
  __________ \\
  __________ \\
  __________ \\
  __________ \\
  -p 5432:5432 -d postgres:16-alpine

# TODO 4: 探活轮询
attempt=0
until docker exec "$NAME" pg_isready -U "$PG_USER" -d "$PG_DB" >/dev/null 2>&1; do
  attempt=$((attempt+1))
  if [ "$attempt" -gt 40 ]; then
    echo "等了 20 秒还没就绪，日志如下：" >&2
    docker logs --tail 30 "$NAME" >&2
    exit 1
  fi
  sleep 0.5
done
echo "就绪：重试了 $attempt 次"

# TODO 5: 连进去查版本
docker exec -it "$NAME" psql -U "$PG_USER" -d "$PG_DB" -c "__________"

# TODO 6: 看端口映射
docker ps --filter "name=$NAME" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"

# TODO 7: 看数据卷位置
docker inspect "$NAME" --format 'volume {{range .Mounts}}{{.Name}}  {{.Destination}} -> {{.Source}}{{end}}'`}</code></pre>
        </div>
      </div>
    )
  }

  // 阶段 3：展示探活逻辑
  if (idx === 2) {
    return (
      <div className="phase-section demo">
        <h4 className="section-title">👁️ 演示：探活逻辑</h4>
        <div className="probe-code">
          <pre><code>{`attempt=0
until docker exec "$NAME" pg_isready -U "$PG_USER" -d "$PG_DB" >/dev/null 2>&1; do
  attempt=$((attempt+1))
  if [ "$attempt" -gt 40 ]; then
    echo "等了 20 秒还没就绪，日志如下：" >&2
    docker logs --tail 30 "$NAME" >&2
    exit 1
  fi
  sleep 0.5
done
echo "就绪：重试了 $attempt 次"`}</code></pre>
          <p className="code-note">
            ↑ 这段代码会反复执行 pg_isready，直到返回 0（就绪）或重试 40 次（20 秒）后失败
          </p>
        </div>
      </div>
    )
  }

  // 阶段 4：展示反例运行结果
  if (idx === 3) {
    return (
      <div className="phase-section demo">
        <h4 className="section-title">👁️ 演示：反例运行</h4>
        
        <div className="anti-demo">
          <b>反例 1：忘记 -e POSTGRES_PASSWORD</b>
          <pre><code>{`$ docker run --name bad-pg -p 5432:5432 -d postgres:16-alpine
$ docker exec bad-pg psql -U postgres -c "\\l"
                          List of databases
   Name    |  Owner   | Encoding | ...
-----------+----------+----------+---
 postgres  | postgres | UTF8     | ...
 template0 | postgres | UTF8     | ...
 template1 | postgres | UTF8     | ...
(3 rows)

⚠️ 注意：不需要密码就能连上！这是安全漏洞。`}</code></pre>
        </div>

        <div className="anti-demo">
          <b>反例 2：用 sleep 代替探活</b>
          <pre><code>{`$ sleep 10
$ docker exec my-pg pg_isready
/var/run/postgresql:5432 - accepting connections

✅ 这次成功了，但下次磁盘忙时可能失败。`}</code></pre>
        </div>
      </div>
    )
  }

  // 阶段 5：展示完整脚本
  if (idx === 4) {
    return (
      <div className="phase-section demo">
        <h4 className="section-title">👁️ 演示：完整脚本</h4>
        <div className="final-code">
          <div className="code-head">
            <span className="lang">bash</span>
            <span className="fname">main.sh（标准答案）</span>
          </div>
          <pre><code>{card.code.content}</code></pre>
        </div>
      </div>
    )
  }

  return null
}

// ---------- 练习部分：让学习者动手 ----------
function renderPractice(phase: any, card: Card, idx: number, userScript: string, setUserScript: (s: string) => void) {
  // 阶段 1：微测验
  if (idx === 0 && phase.micro_quiz && phase.micro_quiz.length > 0) {
    return (
      <div className="phase-section practice">
        <h4 className="section-title">✍️ 练习：微测验</h4>
        <QuizInline questions={phase.micro_quiz} />
      </div>
    )
  }

  // 阶段 2：填空任务
  if (idx === 1) {
    return (
      <div className="phase-section practice">
        <h4 className="section-title">✍️ 练习：填空</h4>
        <div className="fill-task">
          <p>打开编辑器，创建 <code>lab/s0/d3/my_main.sh</code>，把上面的 skeleton 代码复制过去，然后填补 5 个空白：</p>
          <ol>
            <li>第 5 行：填入容器名称 <code>homecube-pg</code></li>
            <li>第 11-14 行：补充四个 <code>-e</code> 环境变量参数</li>
            <li>第 25 行：实现探活轮询逻辑（参考演示）</li>
            <li>第 38 行：填入查版本的 SQL：<code>SELECT version();</code></li>
            <li>第 44 行：填入 docker inspect 格式化字符串</li>
          </ol>
          <div className="fill-hint">
            <b>提示：</b>四个环境变量分别是 <code>POSTGRES_USER</code>、<code>POSTGRES_PASSWORD</code>、<code>POSTGRES_DB</code>，值都用 <code>$PG_USER</code>、<code>$PG_PASS</code>、<code>$PG_DB</code>（脚本开头已定义）
          </div>
        </div>
      </div>
    )
  }

  // 阶段 3：运行测试
  if (idx === 2) {
    return (
      <div className="phase-section practice">
        <h4 className="section-title">✍️ 练习：运行测试</h4>
        <div className="run-task">
          <p>保存你的 <code>my_main.sh</code>，然后在终端执行：</p>
          <pre><code>{`chmod +x lab/s0/d3/my_main.sh
bash lab/s0/d3/my_main.sh`}</code></pre>
          <p>应该看到类似这样的输出：</p>
          <pre><code>{`== 3. 别用 sleep 猜时间，等它真的能连上 ==
就绪：重试了 3 次`}</code></pre>
          <div className="run-check">
            <b>核对：</b>如果看到「就绪：重试了 X 次」，说明探活逻辑正确。如果报错，检查 until 循环的语法。
          </div>
        </div>
      </div>
    )
  }

  // 阶段 4：对比检查
  if (idx === 3) {
    return (
      <div className="phase-section practice">
        <h4 className="section-title">✍️ 练习：对比检查</h4>
        <div className="compare-task">
          <p>打开你的 <code>my_main.sh</code>，逐项核对：</p>
          <ul className="checklist">
            <li>
              <input type="checkbox" />
              有没有忘记任何一个 <code>-e</code> 参数？
            </li>
            <li>
              <input type="checkbox" />
              探活逻辑是不是用了 <code>until ... pg_isready</code> 而不是 <code>sleep</code>？
            </li>
            <li>
              <input type="checkbox" />
              重试上限是不是设成了 40（20 秒）？
            </li>
            <li>
              <input type="checkbox" />
              失败时有没有打印日志帮助调试？
            </li>
          </ul>
          <div className="compare-hint">
            <b>如果发现错误：</b>对照上面的演示代码修改，然后重新运行测试。
          </div>
        </div>
      </div>
    )
  }

  // 阶段 5：验收清单
  if (idx === 4) {
    return (
      <div className="phase-section practice">
        <h4 className="section-title">✍️ 练习：验收</h4>
        
        <div className="acceptance-list">
          <h4>今日判据（全部勾选才算完成）</h4>
          <ul className="checklist">
            {phase.criteria && phase.criteria.map((c: any, ci: number) => (
              <li key={ci}>
                <input type="checkbox" />
                {c.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="feynman-section">
          <h4>费曼问答（口头回答，答不上来就回去重读）</h4>
          <ol>
            {phase.feynman_questions && phase.feynman_questions.map((q: string, qi: number) => (
              <li key={qi}>{q}</li>
            ))}
          </ol>
        </div>

        <div className="tomorrow-preview">
          <b>明天的预告：</b>
          {phase.next_day_preview}
        </div>
      </div>
    )
  }

  return null
}

// ---------- 内嵌微测验组件 ----------
function QuizInline({ questions }: { questions: { q: string; options: string[]; answer: number; explain: string }[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className="quiz-inline">
      {questions.map((q, qi) => {
        const picked = answers[qi]
        return (
          <div key={qi} className="quiz-question">
            <div className="quiz-q-text">{qi + 1}. {q.q}</div>
            <div className="quiz-options">
              {q.options.map((opt, oi) => {
                const state = picked === undefined ? '' : oi === q.answer ? 'right' : picked === oi ? 'wrong' : ''
                return (
                  <button
                    key={oi}
                    disabled={picked !== undefined}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={`quiz-option ${state}`}
                  >
                    <b>{letters[oi]}.</b> {opt}
                  </button>
                )
              })}
            </div>
            {picked !== undefined && (
              <div className="quiz-explain">{q.explain}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------- 回退视图：当没有 teaching 数据时显示原有结构 ----------
function LegacyView({ card }: { card: Card }) {
  return (
    <div className="legacy-view">
      <WhyBlock card={card} />
      <ConceptsBlock card={card} />
      <CodeBlock card={card} />
      <StepsBlock card={card} />
      <PitfallsBlock card={card} />
      <QuizFullBlock card={card} />
      <TaskFullBlock card={card} />
    </div>
  )
}

function WhyBlock({ card }: { card: Card }) {
  return (
    <div className="card-panel why">
      <h2>为什么要学这个</h2>
      <div className="why-grid">
        <div className="why-row">
          <span className="tag">问题</span>
          <span className="val"><Rich text={card.why.problem} id="wp" /></span>
        </div>
        <div className="why-row">
          <span className="tag bad">新手会犯</span>
          <span className="val"><Rich text={card.why.naive} id="wn" /></span>
        </div>
        <div className="why-row">
          <span className="tag good">正确做法</span>
          <span className="val"><Rich text={card.why.right} id="wr" /></span>
        </div>
      </div>
    </div>
  )
}

function ConceptsBlock({ card }: { card: Card }) {
  return (
    <div className="card-panel concept">
      <h2>知识点（{card.concepts.length}）</h2>
      {card.concepts.map((c, i) => (
        <div className="concept-item" key={i}>
          <h3>{c.name}</h3>
          <p><Rich text={c.explanation} id={`c${i}-e`} /></p>
          {c.analogy && (
            <div className="analogy">
              <b>类比</b> <Rich text={c.analogy} id={`c${i}-a`} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CodeBlock({ card }: { card: Card }) {
  const code = card.code
  // build 是可选字段：迁移期大量卡片还没有，缺省走整块渲染的兼容路径。
  const build = code.build && code.build.length > 0
    ? [...code.build].sort((a, b) => a.n - b.n)
    : null
  const fullLines = code.content.replace(/\n+$/, '').split('\n').length

  const runBoxes = (
    <>
      <div className="run-box">
        <div className="lb">怎么跑</div>
        <div className="cmd">{code.run}</div>
      </div>
      <div className="run-box expect">
        <div className="lb">应该看到什么</div>
        <div className="cmd">{code.expect}</div>
      </div>
    </>
  )

  if (!build) {
    return (
      <div className="card-panel code">
        <h2>今天的代码</h2>
        <div className="code-head">
          <span className="lang">{code.lang}</span>
          <span className="fname">{code.filename}</span>
        </div>
        <pre><code>{code.content}</code></pre>
        {runBoxes}
      </div>
    )
  }

  return (
    <div className="card-panel code">
      <h2>今天的代码（分 {build.length} 步长出来）</h2>
      <div className="code-head">
        <span className="lang">{code.lang}</span>
        <span className="fname">{code.filename}</span>
      </div>

      <div className="build-steps">
        {build.map((s, i) => (
          <div className="build-step" key={s.n}>
            <div className="bs-head">
              <span className="bs-n">{s.n}</span>
              <span className="bs-title">{s.title}</span>
              <span className="bs-span">
                第 {stepStartLine(build, i)}–{stepEndLine(build, i, fullLines)} 行
              </span>
            </div>
            <div className="bs-tag">这一步只加这些</div>
            <pre className="build-code"><code>{s.add.replace(/\n+$/, '')}</code></pre>
            <div className="bs-rows">
              <div className="bs-row">
                <span className="k">加在哪儿</span>
                <span className="v"><Rich text={s.place} id={`bs${s.n}-p`} /></span>
              </div>
              <div className="bs-row">
                <span className="k">为什么先加它</span>
                <span className="v"><Rich text={s.note} id={`bs${s.n}-n`} /></span>
              </div>
              <div className="bs-row check">
                <span className="k">这一步能看到什么</span>
                <span className="v"><Rich text={s.check} id={`bs${s.n}-c`} /></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <details className="full-file">
        <summary>完整文件（对拍用，共 {fullLines} 行）</summary>
        <pre><code>{code.content}</code></pre>
      </details>

      {runBoxes}
    </div>
  )
}

/** build 各步的 add 是 content 的连续行片段，据此算出这一步覆盖到第几行。 */
function stepStartLine(build: NonNullable<Card['code']['build']>, i: number): number {
  let n = 1
  for (let k = 0; k < i; k++) {
    n += build[k].add.replace(/\n+$/, '').split('\n').length
  }
  return n
}

function stepEndLine(
  build: NonNullable<Card['code']['build']>,
  i: number,
  fullLines: number,
): number {
  if (i === build.length - 1) return fullLines
  return stepStartLine(build, i + 1) - 1
}

function StepsBlock({ card }: { card: Card }) {
  return (
    <div className="card-panel steps">
      <h2>今天的步骤（共 {card.steps.length} 步 · {card.duration}）</h2>
      {card.steps.map((s) => (
        <div className="step" key={s.n}>
          <div className="n">{s.n}</div>
          <div>
            <div className="t">{s.title}</div>
            <div className="d"><RichSteps text={s.detail} id={`s${s.n}`} /></div>
            <div className="time">约 {s.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PitfallsBlock({ card }: { card: Card }) {
  return (
    <div className="card-panel pitfall">
      <h2>容易踩的坑（{card.pitfalls.length}）</h2>
      {card.pitfalls.map((p, i) => (
        <div className="pitfall" key={i}>
          <div className="row">
            <span className="k w">错误做法</span>
            <span className="v"><Rich text={p.wrong} id={`pw${i}`} /></span>
          </div>
          <div className="row">
            <span className="k r">正确做法</span>
            <span className="v"><Rich text={p.right} id={`pr${i}`} /></span>
          </div>
          <p className="why"><Rich text={p.why} id={`py${i}`} /></p>
        </div>
      ))}
    </div>
  )
}

function QuizFullBlock({ card }: { card: Card }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const letters = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <div className="card-panel quiz">
      <h2>自测（{card.quiz.length} 题）</h2>
      {card.quiz.map((q, qi) => {
        const picked = answers[qi]
        return (
          <div className="quiz-q" key={qi}>
            <div className="q">
              {qi + 1}. <Rich text={q.q} id={`q${qi}`} />
            </div>
            <div className="quiz-opts">
              {q.options.map((opt, oi) => {
                const state =
                  picked === undefined ? '' : oi === q.answer ? 'right' : picked === oi ? 'wrong' : ''
                return (
                  <button
                    key={oi}
                    className={'quiz-opt ' + state}
                    disabled={picked !== undefined}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  >
                    <span className="letter">{letters[oi]}</span>
                    <span><Rich text={opt} id={`o${qi}-${oi}`} /></span>
                  </button>
                )
              })}
            </div>
            {picked !== undefined && <div className="quiz-exp"><Rich text={q.explain} id={`qe${qi}`} /></div>}
          </div>
        )
      })}
    </div>
  )
}

function TaskFullBlock({ card }: { card: Card }) {
  const [checks, setChecks] = useState<Record<number, boolean>>({})

  return (
    <div className="card-panel task">
      <h2>今天的产出</h2>
      <div className="task-goal"><Rich text={card.task.title} id="tt" /></div>
      <ul className="task-list">
        {card.task.acceptance.map((a, i) => (
          <li key={i}>
            <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!checks[i]}
                onChange={(e) => setChecks((c) => ({ ...c, [i]: e.target.checked }))}
                style={{ marginTop: 5, flexShrink: 0 }}
              />
              <span style={{ opacity: checks[i] ? 0.55 : 1 }}><Rich text={a} id={`ta${i}`} /></span>
            </label>
          </li>
        ))}
      </ul>
      <div className="task-hint">
        <b>卡住了看这里</b>
        <Rich text={card.task.hint} id="th" />
      </div>
      <div className="tomorrow">
        <b>明天</b>
        <Rich text={card.tomorrow} id="tm" />
      </div>
    </div>
  )
}
