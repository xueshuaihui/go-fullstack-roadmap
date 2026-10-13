#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""全站一致性复核。用法：python3 tools/check-site.py

只读，不改任何文件。基准：docs/CANONICAL.md §1/§2/§3/§5.1/§13/§16。
退出码 0 = 全绿；1 = 有 ERROR（必须修）；WARN 需人工过一眼。
"""
import glob
import io
import os
import re
import sys
from collections import Counter, OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STAGE_WEEKS = OrderedDict([
    ("s1", [1, 2]), ("s2", [3, 4]), ("s3", [5, 6]), ("s4", [7, 8, 9]),
    ("s5", [10, 11]), ("s6", [12, 13, 14, 15, 16]), ("s7", [17, 18, 19, 20]),
    ("s8", [21, 22]),
])
FSTAGE_WEEKS = OrderedDict([
    ("f1", [1, 2, 3, 4]), ("f2", [5, 6]), ("f3", [7, 8, 9]),
    ("f4", [10, 11, 12, 13, 14, 15, 16]), ("f5", [17, 18, 19, 20]),
    ("f6", [21, 22]),
])

WEEK_STAGE = {w: st.upper() for st, ws in STAGE_WEEKS.items() for w in ws}
WEEK_FSTAGE = {w: st.upper() for st, ws in FSTAGE_WEEKS.items() for w in ws}

ALLOWED_CODES = {0, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009,
                 1010, 3001, 3002, 3003, 3004, 4001, 4002, 5000}

# 任何语境都不许出现。
FORBIDDEN = [
    "MySQL", "mysql", "goblog", "todo-api", "url-aggregator", "blog-web",
    "family-ledger", "homecube-learn", "/Users/xuesh",
]
# 只允许出现在「禁止 / 作废 / 别名 / 反例」这类讲解里（CANONICAL §5/§6.5/§8.1/§13）。
NEGATIVE = [
    "/api/v1", "SERVER_PORT", "DB_PASSWORD", "POSTGRES_DSN", "MYSQL_DSN",
    "PageResult", "total_page", "| tail -", "| head -",
]
NEG_OK = ("禁止", "不许", "不要", "不能", "别写", "作废", "违规", "别名", "自创",
          "反例", "出现即", "这类", "没有版本", "而不是", "一律不", "不加的话",
          "门禁", "探针", "probe", "检测", "旧", "老名", "该被", "必须不")

ALLOWED_CLASSES = set("""site-header logo page crumb day-meta chip alt goals check callout
js warn note tip day-nav hint site-footer week-card week-mini fill pct progress-panel hero
kicker stack weeks theme foot grade task task-title strip strip-item sunday todo code-label
k s c n t sub""".split())

errors, warns = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warns.append(msg)


def read(path):
    with io.open(path, encoding="utf-8") as f:
        return f.read()


def rel(path):
    return os.path.relpath(path, ROOT)


def expected_cards():
    out = []
    for st, weeks in STAGE_WEEKS.items():
        for w in weeks:
            for d in range(1, 7):
                out.append(("server/s%s/w%02dd%d.html" % (st[1:], w, d),
                            "w%02dd%d" % (w, d)))
    for st, weeks in FSTAGE_WEEKS.items():
        for w in weeks:
            out.append(("frontend/%s/w%02df1.html" % (st, w), "w%02df1" % w))
    return out


def check_inventory():
    cards = expected_cards()
    missing = [p for p, _k in cards if not os.path.exists(os.path.join(ROOT, p))]
    if missing:
        warn("缺 %d 张日卡（未生成）" % len(missing))
    on_disk = set()
    for pat in ("server/s*/w*.html", "frontend/f*/w*.html"):
        for p in glob.glob(os.path.join(ROOT, pat)):
            on_disk.add(rel(p))
    expected_paths = {p for p, _k in cards}
    for extra in sorted(on_disk - expected_paths):
        err("多出来的日卡文件（周号/序号不在 22 周 × 6 天的表里）：%s" % extra)
    for st in list(STAGE_WEEKS) + list(FSTAGE_WEEKS):
        base = "server" if st.startswith("s") else "frontend"
        ov = os.path.join(ROOT, base, st, "overview.html")
        if not os.path.exists(ov):
            warn("缺阶段总览：%s/%s/overview.html" % (base, st))
    return [p for p in sorted(on_disk)]


def scan_forbidden(txt, r):
    """FORBIDDEN 见即报；NEGATIVE 只允许活在「禁止/作废/反例」这类讲解里。"""
    for word in FORBIDDEN:
        if word in txt:
            err("%s：命中禁用串 %r" % (r, word))
    for word in NEGATIVE:
        start = 0
        while True:
            i = txt.find(word, start)
            if i < 0:
                break
            window = txt[max(0, i - 300):i + 300]
            if not any(w in window for w in NEG_OK):
                err("%s：出现 %r，且上下文没有「禁止/作废/反例」类措辞（§16④）" % (r, word))
            start = i + len(word)


def check_card(path, key):
    txt = read(path)
    r = rel(path)
    is_front = "f1" in key[3:]

    m = re.search(r'<body[^>]*data-day="([^"]+)"', txt)
    if not m:
        err("%s：body 上没有 data-day" % r)
    elif m.group(1) != key:
        err("%s：data-day=%s，应为 %s" % (r, m.group(1), key))

    for asset in ('href="../../assets/style.css"', 'src="../../assets/app.js"'):
        if asset not in txt:
            err("%s：资源引用不对，缺 %s" % (r, asset))

    ckeys = re.findall(r'data-key="(%sc\d+)"' % key, txt)
    gkeys = re.findall(r'data-key="(%sg\d+)"' % key, txt)
    mkeys = re.findall(r'data-key="(%sm\d+)"' % key, txt)
    if len(ckeys) != 5:
        err("%s：完成检查 %d 条，必须恰好 5 条" % (r, len(ckeys)))
    if sorted(ckeys) != ["%sc%d" % (key, i) for i in range(1, 6)]:
        err("%s：完成检查 key 不是 c1..c5：%s" % (r, ckeys))
    if not 3 <= len(gkeys) <= 4:
        err("%s：今日目标 %d 条，应为 3-4 条" % (r, len(gkeys)))
    if sorted(gkeys) != ["%sg%d" % (key, i) for i in range(1, len(gkeys) + 1)]:
        err("%s：今日目标 key 不连续：%s" % (r, gkeys))
    if is_front and not 2 <= len(mkeys) <= 4:
        err("%s：前端卡「动手改」勾选项 %d 条，应为 2-4 条" % (r, len(mkeys)))

    others = (set(re.findall(r'data-key="([^"]+)"', txt))
              - set(ckeys) - set(gkeys) - set(mkeys))
    if others:
        err("%s：出现 g/m/c 之外的 data-key：%s" % (r, sorted(others)))

    h2s = re.findall(r"<h2>([^<]+)</h2>", txt)
    # 四锚点相对顺序（§3.1）：今日目标 → 常见坑 → 今日名词卡 → 完成检查
    anchors = ["今日目标", "常见坑", "今日名词卡", "完成检查"]
    pos = []
    for a in anchors:
        hit = [i for i, h in enumerate(h2s) if h.startswith(a)]
        if not hit:
            err("%s：缺锚点段「%s」" % (r, a))
        else:
            pos.append(hit[0])
    if pos != sorted(pos):
        err("%s：锚点段顺序不对，实际 h2 = %s" % (r, h2s))
    if is_front:
        for a in ("动手改", "定位题"):
            if not any(h.startswith(a) for h in h2s):
                err("%s：前端卡缺「%s」段（§3.1 / §12 硬要求）" % (r, a))
    else:
        for a in ("知识讲义", "今日增量"):
            if not any(h.startswith(a) for h in h2s):
                err("%s：服务端卡缺「%s」段" % (r, a))
    if not any(h.startswith("卡壳时查") for h in h2s):
        err("%s：缺「卡壳时查什么」段（§3.1 两种版式都必须有）" % r)

    if '<div class="crumb">' not in txt:
        err("%s：缺面包屑" % r)

    if '<nav class="day-nav">' not in txt:
        err("%s：缺 day-nav" % r)
    if key not in txt.split("<footer")[-1]:
        warn("%s：footer 里没有 key" % r)

    for cls in re.findall(r'class="([^"]+)"', txt):
        for c in cls.split():
            if c not in ALLOWED_CLASSES:
                err("%s：类名 %r 不在 §3.1 白名单" % (r, c))
    if re.search(r'\sstyle="', txt):
        err("%s：出现内联 style（§3.1 禁止）" % r)

    scan_forbidden(txt, r)
    if re.search(r"PRD\s*[0-9０-９]", txt) or "PRD 第" in txt:
        err("%s：正文出现 PRD 章节号引用（§16③ 禁止）" % r)

    # 错误码：严格口径只看 code 赋值处（"code": 1001 / code=1001），
    # 其余四位数只列 WARN 供人工过一眼（金额、毫秒、年份会混进来）。
    for code in set(int(x) for x in
                    re.findall(r'code"?\s*[:=]\s*(\d{3,4})', txt)):
        if code not in ALLOWED_CODES:
            err("%s：code=%d 不在 §5.1 表内" % (r, code))
    stray = set(int(x) for x in
                re.findall(r"\b(1\d{3}|3\d{3}|4\d{3}|5\d{3})\b", txt)) - ALLOWED_CODES
    if stray:
        warn("%s：出现表外四位数 %s（金额/毫秒示例可忽略，若是错误码必须改）"
             % (r, sorted(stray)))

    # 标签位口径（§16①，由 tools/fix-meta.py 统一生成）
    week = int(key[1:3])
    if is_front:
        st = WEEK_FSTAGE[week]
        tag, chip = "%s·w%02d" % (st, week), "%s · WEEK %02d" % (st, week)
    else:
        st = WEEK_STAGE[week]
        first = min(w for w, s in WEEK_STAGE.items() if s == st)
        k = (week - first) * 6 + int(key[4:])
        tag, chip = "%s·D%d" % (st, k), "%s · DAY %d" % (st, k)
    t = re.search(r"<title>([^<]*)</title>", txt)
    if not t or not t.group(1).startswith(tag + " · "):
        err("%s：<title> 应以「%s · 」开头，实际 %r（跑 tools/fix-meta.py）"
            % (r, tag, t.group(1) if t else None))
    c = re.search(r'<div class="day-meta">\s*<span class="chip">([^<]*)</span>', txt)
    if not c or c.group(1) != chip:
        err("%s：day-meta 第一枚 chip 应为 %r，实际 %r（跑 tools/fix-meta.py）"
            % (r, chip, c.group(1) if c else None))

    return set(ckeys) | set(gkeys) | set(mkeys) | others


FILE_RE = re.compile(r"^[\w.\-]+\.(?:html|css|js|png|jpg|jpeg|svg|ico|woff2?)$")


def check_links(paths, card_keys):
    """所有站内 href/src 必须能解析到真实文件。

    只校验 basename 像静态文件的路径 —— 前端卡里 `:src="face.icon"`、
    `LOCAL_ICONS[face.code]` 这类模板表达式不是路径，不能当死链。
    """
    scan = list(paths)
    for pat in ("server/s*/overview.html", "frontend/f*/overview.html",
                "index.html"):
        scan += glob.glob(os.path.join(ROOT, pat))
    for p in scan:
        txt = read(p)
        base = os.path.dirname(p)
        for m in re.finditer(r'(?:href|src)="([^"]+)"', txt):
            u = m.group(1)
            if u.startswith(("http://", "https://", "#", "mailto:")):
                continue
            target = os.path.normpath(os.path.join(base, u.split("#")[0]))
            if os.path.exists(target):
                continue
            name = os.path.basename(target)
            if not FILE_RE.match(name):
                continue
            stem = name[:-5]
            if name.endswith(".html") and stem in card_keys:
                # 卡名在 outline 里但文件还没生成 —— 在途缺口，不是写错的链接
                warn("%s：链接指向未生成的卡 %s" % (rel(p), u))
            else:
                err("%s：链接指向不存在的文件 %s" % (rel(p), u))


def check_index(paths):
    idx = read(os.path.join(ROOT, "index.html"))
    linked = set(re.findall(r'data-day="([^"]+)"', idx))
    on_disk = {os.path.basename(p)[:-5] for p in paths}
    for k in sorted(on_disk - linked):
        err("index.html 没有收录 %s（进度会漏计；跑 merge-fragments + build-index）" % k)
    for k in sorted(linked - on_disk):
        err("index.html 链接了不存在的日卡 %s" % k)

    tsv = os.path.join(ROOT, "docs", "outline.tsv")
    if os.path.exists(tsv):
        rows = [l.split("\t")[0] for l in read(tsv).splitlines()[1:] if l.strip()]
        for k in sorted(set(rows) - on_disk):
            err("outline.tsv 有 %s 但文件不存在" % k)
        for k in sorted(on_disk - set(rows)):
            err("文件存在但 outline.tsv 缺 %s" % k)
        dup = [k for k, n in Counter(rows).items() if n > 1]
        for k in dup:
            err("outline.tsv key 重复：%s" % k)


def check_overviews(seen):
    allkeys = set(seen)
    for pat in ("server/s*/overview.html", "frontend/f*/overview.html"):
        for p in sorted(glob.glob(os.path.join(ROOT, pat))):
            txt = read(p)
            if "data-day" in txt:
                err("%s：阶段总览不该有 data-day" % rel(p))
            keys = re.findall(r'data-key="([^"]+)"', txt)
            if len(keys) < 4:
                warn("%s：判据勾选项只有 %d 条" % (rel(p), len(keys)))
            for k in keys:
                if k in allkeys:
                    err("%s：判据 key %s 与别的页撞了" % (rel(p), k))
            allkeys |= set(keys)
            scan_forbidden(txt, rel(p))
            for cls in re.findall(r'class="([^"]+)"', txt):
                for c in cls.split():
                    if c not in ALLOWED_CLASSES:
                        err("%s：类名 %r 不在 §3.1 白名单" % (rel(p), c))
    return allkeys


def main():
    paths = check_inventory()
    planned = {k for _p, k in expected_cards()}
    seen = set()
    for p in paths:
        key = os.path.basename(p)[:-5]
        seen |= check_card(p, key)
    check_index(paths)
    check_links(paths, planned)
    allk = check_overviews(seen)
    idx = read(os.path.join(ROOT, "index.html"))
    scan_forbidden(idx, "index.html")

    print("日卡文件 %d 张（目标 154）　data-key %d 个（含总览判据）"
          % (len(paths), len(allk)))
    for w in warns:
        print("WARN  " + w)
    for e in errors:
        print("ERROR " + e)
    print("\n%d ERROR / %d WARN" % (len(errors), len(warns)))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
