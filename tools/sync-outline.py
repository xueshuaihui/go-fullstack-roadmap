#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从磁盘上真实存在的日卡反向生成 docs/outline.tsv。

用法：python3 tools/sync-outline.py [--dry]
为什么需要它：批量生产时部分批次被中途截停，没来得及写 docs/fragments/*.tsv。
outline.tsv 是 index.html 的唯一源，缺行 = 那张卡没有入口、进度也不计，所以
**以磁盘为准反推**，再用手写清单（outline.tsv 旧行 + docs/fragments/*.tsv）里
更精细的 increment 覆盖。

规则：
- 只收录磁盘上存在的卡（导航链与 index 分组因此与实际一致）。
- title 取自 <title>（去掉「S1·D1 · 」前缀与站点后缀）；minutes/difficulty 取自 day-meta chip。
- increment 优先用手写清单里的，缺失则写「见卡面「今日增量」」。
"""
import glob
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TSV = os.path.join(ROOT, "docs", "outline.tsv")
COLS = ["key", "stage", "kind", "title", "minutes", "difficulty", "increment"]

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

MINUTES = [(re.compile(r"(\d+)\s*分钟"), lambda m: m.group(1) + "min"),
           (re.compile(r"(\d+)\s*小时"), lambda m: m.group(1) + "h")]


def card_files():
    out = {}
    for pat in ("server/s*/w*.html", "frontend/f*/w*.html"):
        for p in glob.glob(os.path.join(ROOT, pat)):
            key = os.path.basename(p)[:-5]
            if re.match(r"^w\d{2}[df]\d$", key):
                out[key] = p
    return out


def minutes_of(chips):
    for c in chips:
        for rx, fmt in MINUTES:
            m = rx.search(c)
            if m:
                return fmt(m)
    return "30min"


def difficulty_of(chips):
    for c in chips:
        m = re.search(r"[★☆☆]{5}", c)
        if m:
            return m.group(0)
    return "★★☆☆☆"


def parse(path, key):
    txt = io.open(path, encoding="utf-8").read()
    t = re.search(r"<title>(.*?)</title>", txt, re.S)
    title = t.group(1).split(" | ")[0] if t else key
    # <title> 形如「S1·D1 · 标题」「F2·w05 · 标题」「F5 · 标题」，剥掉最前面的阶段标签
    parts = title.split(" · ", 1)
    if len(parts) == 2 and re.match(r"^[SF]\d(?:·(?:D\d+|w\d+))?$", parts[0].strip()):
        title = parts[1]
    title = title.strip()
    dm = re.search(r'<div class="day-meta">(.*?)</div>', txt, re.S)
    chips = re.findall(r'<span class="chip[^"]*">([^<]*)</span>',
                       dm.group(1)) if dm else []
    chips = chips[1:]  # 第一枚是阶段标签，由 fix-meta.py 生成
    week = int(key[1:3])
    is_front = key[3:].startswith("f")
    return {
        "key": key,
        "stage": WEEK_FSTAGE[week] if is_front else WEEK_STAGE[week],
        "kind": "frontend" if is_front else "server",
        "title": title,
        "minutes": minutes_of(chips),
        "difficulty": difficulty_of(chips),
        "increment": "见卡面「今日增量」" if not is_front
                     else "前端卡（无服务端增量）：见卡面「动手改」与「定位题」",
    }


def curated():
    rows = {}
    paths = [TSV] + sorted(glob.glob(os.path.join(ROOT, "docs", "fragments", "*.tsv")))
    for p in paths:
        if not os.path.exists(p):
            continue
        lines = [l.rstrip("\n") for l in io.open(p, encoding="utf-8") if l.strip()]
        if not lines:
            continue
        start = 1 if lines[0].split("\t") == COLS else 0
        for line in lines[start:]:
            parts = line.split("\t")
            if len(parts) == len(COLS):
                rec = dict(zip(COLS, parts))
                if rec["key"] not in rows and rec["increment"].strip():
                    rows[rec["key"]] = rec
    return rows


def sort_key(k):
    week = int(k[1:3])
    return (0 if k[3] == "d" else 1, week, int(k[4:]))


def main():
    dry = "--dry" in sys.argv
    files = card_files()
    hand = curated()
    rows = []
    drift = []
    filled = 0
    for key in sorted(files, key=sort_key):
        rec = parse(files[key], key)
        if key in hand:
            rec["increment"] = hand[key]["increment"]
            filled += 1
            if hand[key]["title"] != rec["title"]:
                drift.append("%s：清单标题 %r ≠ 卡面标题 %r（以卡面为准）"
                             % (key, hand[key]["title"], rec["title"]))
        rows.append(rec)
    body = "\t".join(COLS) + "\n" + "\n".join(
        "\t".join(r[c] for c in COLS) for r in rows) + "\n"
    print("outline：%d 行（磁盘 %d 张卡）；其中 increment 来自手写清单 %d 行"
          % (len(rows), len(files), filled))
    for d in drift:
        print("  标题漂移 " + d)
    gap = 154 - len(rows)
    if gap:
        print("注意：磁盘缺 %d 张卡未收录（生成 index 时会显示为「待生成」）" % gap)
    if not dry:
        with io.open(TSV, "w", encoding="utf-8") as f:
            f.write(body)
        print("已写 docs/outline.tsv")
    else:
        print("--dry 未落盘")


if __name__ == "__main__":
    main()
