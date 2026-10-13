#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 docs/fragments/*.tsv 合并进 docs/outline.tsv。

用法：python3 tools/merge-fragments.py [--keep]
默认合并成功后删除 fragments 目录下的 .tsv（--keep 保留）。
合并后必须再跑 python3 tools/build-index.py。

规则：
- outline.tsv 是唯一源；fragment 只是各批产出的临时清单。
- 按 key 去重。同 key 若字段不一致，以 fragment 为准并打印 WARN（说明 outline 里那行是旧的）。
- 输出顺序：服务端行（按 key 字典序）在前，前端行在后——与既有 outline.tsv 布局一致。
"""
import glob
import io
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TSV = os.path.join(ROOT, "docs", "outline.tsv")
FRAG_DIR = os.path.join(ROOT, "docs", "fragments")

COLS = ["key", "stage", "kind", "title", "minutes", "difficulty", "increment"]


def read_tsv(path):
    """outline.tsv 必须有表头；fragment 允许漏写表头（部分批次如此），按列序补齐。"""
    rows = {}
    with io.open(path, encoding="utf-8") as f:
        lines = [l.rstrip("\n") for l in f if l.strip()]
    if not lines:
        sys.exit("%s 是空文件" % path)
    start = 0
    if lines[0].split("\t") == COLS:
        start = 1
    elif os.path.basename(path) == "outline.tsv":
        sys.exit("%s 表头不对：期望 %s，实际 %s"
                 % (path, COLS, lines[0].split("\t")))
    else:
        print("  注意：%s 没写表头，按 %s 列序解析" % (os.path.basename(path), COLS))
    for ln, line in enumerate(lines[start:], start + 1):
        parts = line.split("\t")
        if len(parts) != len(COLS):
            sys.exit("%s:%d 列数 %d ≠ %d：%s"
                     % (path, ln, len(parts), len(COLS), line[:80]))
        rec = dict(zip(COLS, parts))
        if rec["key"] in rows:
            sys.exit("%s:%d key 重复：%s" % (path, ln, rec["key"]))
        rows[rec["key"]] = rec
    return rows


def sort_key(k):
    # w01d1 → (0, 1, 1)；w01f1 → (1, 1, 1)。服务端在前，再按周、按当日序号。
    week = int(k[1:3])
    tail = k[3:]
    group = 0 if tail.startswith("d") else 1
    return (group, week, int(tail[1:]))


def write_tsv(path, rows):
    keys = sorted(rows, key=sort_key)
    with io.open(path, "w", encoding="utf-8") as f:
        f.write("\t".join(COLS) + "\n")
        for k in keys:
            f.write("\t".join(rows[k][c] for c in COLS) + "\n")
    return len(keys)


def main():
    keep = "--keep" in sys.argv
    base = read_tsv(TSV)
    frags = sorted(glob.glob(os.path.join(FRAG_DIR, "*.tsv")))
    if not frags:
        sys.exit("docs/fragments/ 下没有 .tsv，无需合并")

    added, updated = 0, 0
    for path in frags:
        rows = read_tsv(path)
        for k, rec in rows.items():
            if k not in base:
                base[k] = rec
                added += 1
            elif base[k] != rec:
                print("WARN %s 与 outline.tsv 不一致，以 fragment 为准：%s"
                      % (os.path.basename(path), k))
                base[k] = rec
                updated += 1
        print("  %s：%d 行" % (os.path.basename(path), len(rows)))

    n = write_tsv(TSV, base)
    print("outline.tsv 现有 %d 行（新增 %d，覆盖 %d）/ 目标 154" % (n, added, updated))

    server = sum(1 for r in base.values() if r["kind"] == "server")
    front = sum(1 for r in base.values() if r["kind"] == "frontend")
    print("  服务端 %d/132　前端 %d/22" % (server, front))

    if not keep:
        for path in frags:
            os.remove(path)
        print("已清理 fragments（--keep 可保留）")


if __name__ == "__main__":
    main()
