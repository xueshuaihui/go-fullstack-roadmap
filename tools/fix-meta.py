#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把全部日卡的标签位（<title> 与 day-meta 第一枚 chip）归一到 CANONICAL §16① 口径。

用法：python3 tools/fix-meta.py [--dry]
必须在 merge-fragments.py 之后跑（标题取自 outline.tsv）。

口径：
  服务端 w{NN}d{M}：<title>{S}·D{k} · {标题} | HomeCube 修炼手册</title>，chip = {S} · DAY {k}
  前端   w{NN}f1  ：<title>{F}·w{NN} · {标题} | HomeCube 修炼手册</title>，chip = {F} · WEEK {NN}
  k = 阶段内第几天（每周 6 张），标题取自 outline.tsv。
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TSV = os.path.join(ROOT, "docs", "outline.tsv")

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

TITLE_RE = re.compile(r"<title>.*?</title>", re.S)
CHIP_RE = re.compile(r'(<div class="day-meta">\s*)<span class="chip">[^<]*</span>')


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


def path_of(key):
    week = int(key[1:3])
    st = WEEK_FSTAGE[week] if key[3:].startswith("f") else WEEK_STAGE[week]
    base = "frontend" if st.startswith("F") else "server"
    return os.path.join(ROOT, base, st.lower(), key + ".html")


def meta_for(key, rows):
    week = int(key[1:3])
    title = rows[key]["title"]
    if key[3:].startswith("f"):
        st = WEEK_FSTAGE[week]
        tag = "%s·w%02d" % (st, week)
        chip = "%s · WEEK %02d" % (st, week)
    else:
        st = WEEK_STAGE[week]
        first = min(w for w, s in WEEK_STAGE.items() if s == st)
        k = (week - first) * 6 + int(key[4:])
        tag = "%s·D%d" % (st, k)
        chip = "%s · DAY %d" % (st, k)
    return "<title>%s · %s | HomeCube 修炼手册</title>" % (tag, title), chip


def main():
    dry = "--dry" in sys.argv
    rows = load()
    changed = 0
    for key in sorted(rows):
        p = path_of(key)
        if not os.path.exists(p):
            print("跳过（文件不存在）：%s" % key)
            continue
        txt = io.open(p, encoding="utf-8").read()
        title, chip = meta_for(key, rows)
        new, n1 = TITLE_RE.subn(lambda _m: title, txt, count=1)
        new, n2 = CHIP_RE.subn(lambda m: m.group(1) +
                               '<span class="chip">%s</span>' % chip, new, count=1)
        if n1 == 0 or n2 == 0:
            print("ERROR %s：title 或 day-meta chip 没匹配上（title=%d chip=%d）"
                  % (key, n1, n2))
            continue
        if new != txt:
            changed += 1
            if not dry:
                with io.open(p, "w", encoding="utf-8") as f:
                    f.write(new)
    print("标签位归一：%d/%d 张改动%s"
          % (changed, len(rows), "（--dry 未落盘）" if dry else ""))


if __name__ == "__main__":
    main()
