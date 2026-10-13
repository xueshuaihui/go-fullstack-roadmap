#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把全部日卡的 day-nav 归一成一条时间线。

用法：python3 tools/fix-nav.py [--dry]
必须在 merge-fragments.py + build-index.py 之后跑（依赖 outline.tsv 的标题）。

时间线：w01d1 … w01d6 → w01f1 → w02d1 …（每周五个微增量 + 周六串起来 + 周日前端卡）。
href 用相对路径（server/sX/ 与 frontend/fY/ 之间要跨两级），标题从 outline.tsv 取。
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TSV = os.path.join(ROOT, "docs", "outline.tsv")

STAGE_DIR = {"S1": "server/s1", "S2": "server/s2", "S3": "server/s3",
             "S4": "server/s4", "S5": "server/s5", "S6": "server/s6",
             "S7": "server/s7", "S8": "server/s8",
             "F1": "frontend/f1", "F2": "frontend/f2", "F3": "frontend/f3",
             "F4": "frontend/f4", "F5": "frontend/f5", "F6": "frontend/f6"}
WEEK_STAGE = {}
for _s, _w in (("S1", [1, 2]), ("S2", [3, 4]), ("S3", [5, 6]),
               ("S4", [7, 8, 9]), ("S5", [10, 11]),
               ("S6", [12, 13, 14, 15, 16]), ("S7", [17, 18, 19, 20]),
               ("S8", [21, 22])):
    for w in _w:
        WEEK_STAGE[w] = _s
WEEK_FSTAGE = {}
for _s, _w in (("F1", [1, 2, 3, 4]), ("F2", [5, 6]), ("F3", [7, 8, 9]),
               ("F4", list(range(10, 17))), ("F5", [17, 18, 19, 20]),
               ("F6", [21, 22])):
    for w in _w:
        WEEK_FSTAGE[w] = _s

NAV_RE = re.compile(r'<nav class="day-nav">.*?</nav>', re.S)


def load():
    rows = {}
    with io.open(TSV, encoding="utf-8") as f:
        head = f.readline().rstrip("\n").split("\t")
        for line in f:
            line = line.rstrip("\n")
            if line.strip():
                rec = dict(zip(head, line.split("\t")))
                rows[rec["key"]] = rec
    return rows


def order():
    out = []
    for w in range(1, 23):
        for d in range(1, 7):
            out.append("w%02dd%d" % (w, d))
        out.append("w%02df1" % w)
    return out


def short_title(rec):
    t = rec["title"]
    t = re.sub(r"^周六 · ", "", t)
    t = re.sub(r"^周日 · ", "", t)
    m = re.split(r"[：:，,]", t, 1)
    if len(m[0]) >= 8:
        t = m[0]
    return t[:30]


def label(key, rows):
    """S 线用「阶段·第几天」，F 线用「阶段·wNN」。"""
    week = int(key[1:3])
    if key[3:].startswith("d"):
        st = WEEK_STAGE[week]
        first_week = min(w for w, s in WEEK_STAGE.items() if s == st)
        n = (week - first_week) * 6 + int(key[4:])
        return "%s·D%d" % (st, n), st
    st = WEEK_FSTAGE[week]
    return "%s·w%02d" % (st, week), st


def path_of(key):
    week = int(key[1:3])
    st = WEEK_FSTAGE[week] if key[3:].startswith("f") else WEEK_STAGE[week]
    return os.path.join(STAGE_DIR[st], key + ".html")


def link(src_key, dst_key, hint, rows):
    href = os.path.relpath(path_of(dst_key), os.path.dirname(path_of(src_key)))
    return '<a href="%s"><span class="hint">%s</span>%s</a>' % (
        href, hint, short_title(rows[dst_key]))


def stage_of(key):
    week = int(key[1:3])
    return WEEK_FSTAGE[week] if key[3:].startswith("f") else WEEK_STAGE[week]


def overview_link(key, hint):
    st = stage_of(key)
    return ('<a href="overview.html"><span class="hint">%s</span>%s 阶段总览</a>'
            % (hint, st))


def build_nav(key, idx, keys, rows):
    """纯时间线：d1..d6 → 本周日 f1 → 下周一 d1。阶段总览由页头「本阶段」入口负责，
    只有全课程第一张与最后一张的 day-nav 指向总览。"""
    is_front = key[3:].startswith("f")
    prev_key = keys[idx - 1] if idx else None
    next_key = keys[idx + 1] if idx < len(keys) - 1 else None

    if prev_key is None:
        left = overview_link(key, "← 回到 ")
    else:
        plab, _ = label(prev_key, rows)
        if is_front:
            hint = "← 本周六 · %s" % plab
        elif key[4:] == "1":
            hint = "← 上周日 · %s" % plab
        else:
            hint = "← 昨天 · %s" % plab
        left = link(key, prev_key, hint, rows)

    if next_key is None:
        right = overview_link(key, "本阶段验收清单 →")
    else:
        nlab, _ = label(next_key, rows)
        if is_front:
            hint = "下周一 · %s →" % nlab
        elif key[4:] == "6":
            hint = "本周日 · %s →" % nlab
        else:
            hint = "明天 · %s →" % nlab
        right = link(key, next_key, hint, rows)

    return '<nav class="day-nav">\n    %s\n    %s\n  </nav>' % (left, right)


def main():
    dry = "--dry" in sys.argv
    rows = load()
    keys = [k for k in order() if k in rows]
    missing = [k for k in order() if k not in rows]
    if missing:
        print("注意：outline.tsv 缺 %d 行，导航会跨过它们（先跑 merge-fragments）"
              % len(missing))
    changed = 0
    for idx, key in enumerate(keys):
        p = os.path.join(ROOT, path_of(key))
        if not os.path.exists(p):
            print("跳过（文件不存在）：%s" % key)
            continue
        txt = io.open(p, encoding="utf-8").read()
        nav = build_nav(key, idx, keys, rows)
        new, n = NAV_RE.subn(lambda _m: nav, txt, count=1)
        if n == 0:
            print("ERROR %s：找不到 day-nav，未改" % key)
            continue
        if new != txt:
            changed += 1
            if not dry:
                with io.open(p, "w", encoding="utf-8") as f:
                    f.write(new)
    print("day-nav 归一：%d/%d 张改动%s" % (changed, len(keys), "（--dry 未落盘）" if dry else ""))


if __name__ == "__main__":
    main()
