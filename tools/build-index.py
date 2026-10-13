#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 docs/outline.tsv 生成 index.html。

用法：python3 tools/build-index.py
基准：docs/CANONICAL.md §1（阶段与周映射）、§2（目录）、§3.2（data-day 命名）。
outline.tsv 里有的行才出链接；缺的按「待生成」占位。每批日卡产出后重跑本脚本。

注意：本站远端是 PUBLIC 仓，正文不得出现 PRD 章节号、本机路径、任何私有仓名（CANONICAL §16 明账③）。
"""
import io
import os
from collections import OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TSV = os.path.join(ROOT, "docs", "outline.tsv")
OUT = os.path.join(ROOT, "index.html")

TOTAL_CARDS = 154

STAGES = OrderedDict([
    ("S1", ("Go 与最小 HTTP（标准库 net/http）", [1, 2], "server/s1")),
    ("S2", ("Gin 与三层", [3, 4], "server/s2")),
    ("S3", ("Postgres 与迁移", [5, 6], "server/s3")),
    ("S4", ("鉴权与家庭隔离", [7, 8, 9], "server/s4")),
    ("S5", ("并发与工程化", [10, 11], "server/s5")),
    ("S6", ("财务功能面", [12, 13, 14, 15, 16], "server/s6")),
    ("S7", ("壳基座服务端", [17, 18, 19, 20], "server/s7")),
    ("S8", ("收口与部署", [21, 22], "server/s8")),
])

FSTAGES = OrderedDict([
    ("F1", ("Vue 3 读法", [1, 2, 3, 4], "frontend/f1")),
    ("F2", ("uni-app 工程与路由", [5, 6], "frontend/f2")),
    ("F3", ("状态与对接", [7, 8, 9], "frontend/f3")),
    ("F4", ("组件、样式与列表", [10, 11, 12, 13, 14, 15, 16], "frontend/f4")),
    ("F5", ("壳基座前端", [17, 18, 19, 20], "frontend/f5")),
    ("F6", ("调试与定位", [21, 22], "frontend/f6")),
])

WEEK_STAGE = {}
for _code, (_t, _weeks, _d) in STAGES.items():
    for _w in _weeks:
        WEEK_STAGE[_w] = _code

HEAD = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HomeCube 修炼手册 · 服务端主线 S1-S8 + 前端辅线 F1-F6</title>
<meta name="description" content="从零手写 HomeCube 服务端（Go + Gin + GORM + Postgres）的 22 周路线：132 张服务端日卡 + 22 张周日前端卡，每天一个知识点加一个能收尾的增量。">
<link rel="stylesheet" href="assets/style.css">
<script src="assets/app.js"></script>
</head>
<body>
<header class="site-header">
  <a class="logo" href="index.html">Home<span>Cube</span> Roadmap</a>
  <nav>
    <a href="#how">每周节奏</a>
    <a href="#stages">两条线</a>
    <a href="#server" class="active">22 周路线</a>
    <a href="#goal">终点能力</a>
  </nav>
</header>

<main class="page">
  <section class="hero">
    <div class="kicker">// SERVER-FIRST · 22 WEEKS</div>
    <h1>从零手写 HomeCube 服务端</h1>
    <p>目标是 <b>app 壳基座 + 家庭记账全功能</b>的服务端：<b>72 条接口</b>、约 22-25 张表、一个模块化单体。<br>
    每天一张卡：一个知识点 + 一个当天能收尾的增量。工作日 20-30 分钟，周六 4 小时，周日 2 小时读前端。</p>
    <div class="stack">
      <span class="chip">Go 1.24+</span><span class="chip">Gin</span><span class="chip alt">GORM</span>
      <span class="chip alt">Postgres 16</span><span class="chip">golang-migrate</span><span class="chip">JWT 双 token</span>
      <span class="chip alt">Vue 3</span><span class="chip alt">uni-app</span><span class="chip">Docker Compose</span>
    </div>
    <div class="progress-panel" data-scope="all">
      <div class="row"><span>总体进度（勾选每日「完成检查」自动累计）</span><b>0%</b></div>
      <div class="row sub"></div>
      <div class="bar"><div class="fill"></div></div>
    </div>
  </section>

  <section id="how">
    <h2>每周怎么跑（~10 小时）</h2>
    <table>
      <tr><th>时段</th><th>做什么</th><th>投入</th></tr>
      <tr><td>周一 ~ 周五</td><td>每天一张 <code>d1-d5</code> 卡：读讲义 → 落一个微增量。只允许六类（第六类只给 S8）：加字段/struct、加路由或 handler 骨架、补一个测试、写一条迁移、把假数据换成真查询、工程化收口产物</td><td>20-30 分钟 ×5</td></tr>
      <tr><td>周六</td><td><code>d6</code> 卡：把本周 5 个微增量串成一条完整能力，补齐测试</td><td>约 4 小时</td></tr>
      <tr><td>周日前半</td><td><code>f1</code> 卡：前端线。代码由 agent 写，你的判据是<b>能读懂、能改、能定位 bug 在哪一层</b></td><td>约 2 小时</td></tr>
      <tr><td>周日后半</td><td>费曼复盘（不看资料把本周讲一遍）→ 提交 → 在 <code>notes/</code> 写下周第一天做什么</td><td>约 2 小时</td></tr>
    </table>
    <div class="callout warn"><p><b>收工时仓库必须绿</b>：<code>make build</code> 过、已有测试过。当天做不完说明切得太大，当场再切小——<b>不许留半成品到第二天</b>。</p></div>
    <div class="callout note"><p><b>落后不追赶</b>：顺延，不裁剪判据。服务端与前端两条线各自顺延，互不挪用时间。卡面只写相对序号（S1·D3），不承诺任何日期。</p></div>
    <div class="callout tip"><p>勾选状态存在你自己的浏览器里（localStorage），换设备会清零，属正常现象。</p></div>
  </section>

  <section id="stages">
    <h2>两条线</h2>
    <h3>服务端主线 S1-S8（你亲手写，132 张卡）</h3>
"""

MID = """    <h3>前端辅线 F1-F6（agent 写代码，你学到能改，22 张周日卡）</h3>
"""

MID2 = """    <div class="callout js"><p>前端卡的判据全是「<b>你能不能讲清 / 能不能改</b>」，不是「代码写没写出来」。<b>不许拿「页面能跑」当自己通过了</b>。</p></div>
  </section>

  <section id="server">
    <h2>22 周路线图</h2>
    <div class="weeks">
"""

TAIL = """    </div>
  </section>

  <section id="goal">
    <h2>走完 22 周的你</h2>
    <div class="grade">
      <div><b>Go 与分层</b>徒手写出 handler / service / repo 三层，讲得清每层为什么在那</div>
      <div><b>数据建模</b>Postgres 双 schema、迁移可 up→down→up 重放、每表带 family_id 与软删</div>
      <div><b>鉴权与隔离</b>JWT 双 token + 四级角色矩阵，越权读返 404 与不存在同形</div>
      <div><b>并发</b>能用 -race 证明自己修好了数据竞争，讲得清 channel 与 Mutex 各自该用在哪</div>
      <div><b>财务口径</b>金额整数分、游标分页、时间窗五档、季/年 = 月桶之和且前端二次累加为 0</div>
      <div><b>壳基座</b>面集合四层在服务端一处合成，客户端零裁剪；未读口径唯一、三个出口同值</div>
      <div><b>交付</b>docker compose 起全套，干净机器照着 README 能复现</div>
      <div><b>前端</b>能读懂任意一页、能改字段与样式、能不靠 agent 说出一个 bug 在哪一层</div>
      <div><b>纪律</b>72 条接口逐条划掉，四条历史反例一条没犯</div>
    </div>
  </section>
</main>

<footer class="site-footer">
  HomeCube Roadmap · 已生成 %d/%d 张日卡 · 基准见 <a href="docs/CANONICAL.md">docs/CANONICAL.md</a>
</footer>
</body>
</html>
"""


def load_rows():
    rows = OrderedDict()
    with io.open(TSV, encoding="utf-8") as f:
        head = f.readline().rstrip("\n").split("\t")
        for line in f:
            line = line.rstrip("\n")
            if not line.strip():
                continue
            rec = dict(zip(head, line.split("\t")))
            rows[rec["key"]] = rec
    return rows


def path_for(rec):
    week = int(rec["key"][1:3])
    if rec["kind"] == "server":
        return "%s/%s.html" % (STAGES[WEEK_STAGE[week]][2], rec["key"])
    return "%s/%s.html" % (FSTAGES[rec["stage"]][2], rec["key"])


def link(rec, label):
    return '<a href="%s" data-day="%s">%s</a>' % (path_for(rec), rec["key"], label)


def todo(label):
    return '<span class="todo">%s · 待生成</span>' % label


def strip(items, alt=False):
    out = ['    <div class="strip%s">' % (" alt" if alt else "")]
    for code, (title, weeks, d) in items.items():
        span = len(weeks) * (6 if not alt else 1)
        if not os.path.exists(os.path.join(ROOT, d, "overview.html")):
            out.append('      <span class="strip-item"><b>%s</b>%s'
                       '<span>w%02d-w%02d · %d 张 · 总览待生成</span></span>'
                       % (code, title, weeks[0], weeks[-1], span))
            continue
        out.append('      <a class="strip-item" href="%s/overview.html">'
                   '<b>%s</b>%s<span>w%02d-w%02d · %d 张</span></a>'
                   % (d, code, title, weeks[0], weeks[-1], span))
    out.append("    </div>")
    return "\n".join(out)


def week_card(w, rows):
    stage = WEEK_STAGE[w]
    out = ['      <div class="week-card">']
    out.append('        <h3>w%02d · %s</h3>' % (w, STAGES[stage][0]))
    fseg = [c for c, (_t, ws, _d) in FSTAGES.items() if w in ws]
    theme = "服务端 6 张"
    if fseg:
        theme += "　·　周日 %s" % fseg[0]
    out.append('        <div class="theme">%s</div>' % theme)
    out.append("        <ol>")
    for d in range(1, 7):
        rec = rows.get("w%02dd%d" % (w, d))
        label = "周六 · 串起来" if d == 6 else "D%d" % d
        out.append("          <li>%s</li>"
                   % (link(rec, rec["title"]) if rec else todo(label)))
    out.append("        </ol>")
    if fseg:
        rec = rows.get("w%02df1" % w)
        out.append('        <div class="sunday">周日 · %s</div>'
                   % (link(rec, rec["title"]) if rec else todo("前端卡")))
    ov = os.path.join(ROOT, STAGES[stage][2], "overview.html")
    foot = ('<a href="%s/overview.html">%s 阶段总览</a>' % (STAGES[stage][2], stage)
            if os.path.exists(ov) else '<span class="todo">%s 阶段总览 · 待生成</span>'
            % stage)
    out.append('        <div class="foot">%s<span class="pct"></span></div>' % foot)
    out.append('        <div class="week-mini"><div class="fill"></div></div>')
    out.append("      </div>")
    return "\n".join(out)


def build():
    rows = load_rows()
    parts = [HEAD, strip(STAGES), MID, strip(FSTAGES, alt=True), MID2]
    for w in range(1, 23):
        parts.append(week_card(w, rows))
    parts.append(TAIL % (len(rows), TOTAL_CARDS))
    with io.open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))
    print("index.html 已生成：%d/%d 张日卡有链接" % (len(rows), TOTAL_CARDS))


if __name__ == "__main__":
    build()
