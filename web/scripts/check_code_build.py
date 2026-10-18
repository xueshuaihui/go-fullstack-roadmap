#!/usr/bin/env python3
"""校验日卡 code.build 契约（「今天的代码」分步长出来）。

用法：
    python3 web/scripts/check_code_build.py                       # 默认扫 web/public/cards/*.json
    python3 web/scripts/check_code_build.py public/cards/S2.json  # 只查指定文件
    python3 scripts/check_code_build.py S2.json 之类也行：路径找不到时会自动按 web/ 根再找一次

校验内容：
  1. build 缺失（字段不存在或为 null）：只计数，不算失败——迁移期允许。
  2. 硬性不变量：各步 add 去掉尾部换行后按 n 升序拼接、按 \\n 切行，
     必须与 content 去掉尾部换行后按 \\n 切出的行数组逐行完全相等。
  3. n 必须从 1 开始连续递增（顺序即拼接顺序）。
  4. 每步 title / add / place / note / check 五个文本字段都必须非空，add 不能是空串。

退出码：有任何失败则非 0。
"""

import glob
import json
import os
import re
import sys

FIELDS = ('title', 'add', 'place', 'note', 'check')


def strip_trailing_newlines(s: str) -> str:
    """等价于 JS 的 s.replace(/\\n+$/, '')。"""
    return re.sub(r'\n+$', '', s)


def to_lines(s: str) -> list:
    return strip_trailing_newlines(s).split('\n')


def preview(line: str, width: int = 60) -> str:
    """把一行代码压成可打印的单行文本（保留可见字符，制表符转空格）。"""
    t = line.expandtabs(4).replace('\r', '\\r')
    if len(t) > width:
        t = t[:width] + '…'
    return t if t else '<空行>'


def check_build(card_id: str, code: dict) -> list:
    """返回失败信息列表；空列表表示这张卡的 build 通过。"""
    problems = []
    build = code.get('build')

    if not isinstance(build, list):
        return [f'[{card_id}] build 不是数组（实际类型 {type(build).__name__}）']
    if len(build) == 0:
        return [f'[{card_id}] build 是空数组：要么删掉这个字段，要么至少给出 1 步']

    # 字段与 n 连续性
    for i, step in enumerate(build):
        if not isinstance(step, dict):
            problems.append(f'[{card_id}] build 第 {i + 1} 项不是对象')
            continue
        want_n = i + 1
        got_n = step.get('n')
        if got_n != want_n:
            problems.append(
                f'[{card_id}] 第 {want_n} 项的 n = {got_n!r}，'
                f'n 必须从 1 开始连续递增（且数组顺序与 n 一致）'
            )
        for f in FIELDS:
            v = step.get(f)
            if not isinstance(v, str) or v.strip() == '':
                kind = '缺失' if f not in step else ('不是字符串' if not isinstance(v, str) else '为空')
                problems.append(f'[{card_id}] 第 {want_n} 步的 {f} {kind}')

    if problems:
        return problems  # 结构已经不对，行拼接比对没有意义

    content = code.get('content')
    if not isinstance(content, str) or strip_trailing_newlines(content) == '':
        return [f'[{card_id}] content 缺失或为空，无法比对']

    expected = to_lines(content)
    actual = []
    # 每步覆盖的起始行（1 基），用于定位「第几步开始不一致」
    starts = []
    for step in build:
        starts.append(len(actual) + 1)
        actual.extend(to_lines(step['add']))

    if expected == actual:
        return []

    problems.append(
        f'[{card_id}] 不变量失败：content 共 {len(expected)} 行，'
        f'各步 add 拼接后 {len(actual)} 行'
    )
    limit = min(len(expected), len(actual))
    first_diff = None
    for i in range(limit):
        if expected[i] != actual[i]:
            first_diff = i
            break
    if first_diff is None and len(expected) != len(actual):
        first_diff = limit
    if first_diff is not None:
        step_at = 1
        for idx, st in enumerate(starts):
            if st <= first_diff + 1:
                step_at = idx + 1
        exp_txt = preview(expected[first_diff]) if first_diff < len(expected) else '<没有这一行：拼接结果多了内容>'
        act_txt = preview(actual[first_diff]) if first_diff < len(actual) else '<没有这一行：拼接结果少了内容>'
        problems.append(
            f'[{card_id}] 第一处不一致在第 {first_diff + 1} 行（落在第 {step_at} 步）：\n'
            f'      content : {exp_txt}\n'
            f'      build   : {act_txt}'
        )
        problems.append(
            f'[{card_id}] 常见原因：段与段之间的那个空行被两步各算了一次（重复），'
            f'或者谁都没算（漏行）——规则是空行只能归下一步 add 的开头，'
            f'每一步 add 尾部的换行会被剥掉，别指望它带一个空行；'
            f'其余可能就是某段被改写或整段漏掉了'
        )
    return problems


def check_file(path: str) -> tuple:
    """返回 (总张数, 有 build 张数, 通过张数, 失败信息列表)。"""
    with open(path, encoding='utf-8') as fh:
        data = json.load(fh)
    if isinstance(data, dict):  # 兼容 {cards:[...]} 之类的包装
        data = data.get('cards', [])

    total = with_build = passed = 0
    problems = []
    for card in data:
        total += 1
        cid = card.get('id', f'#{total}')
        code = card.get('code')
        if not isinstance(code, dict):
            problems.append(f'[{cid}] 没有 code 对象')
            continue
        if code.get('build') is None:
            continue  # 迁移期允许缺
        with_build += 1
        bad = check_build(cid, code)
        if bad:
            problems.extend(bad)
        else:
            passed += 1
    return total, with_build, passed, problems


def resolve(path: str) -> str:
    """允许从仓库根或 web/ 里任意 cwd 传相对路径。"""
    if os.path.exists(path):
        return path
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    alt = os.path.join(root, path)
    return alt if os.path.exists(alt) else path


def main(argv: list) -> int:
    if argv:
        files = [resolve(p) for p in argv]
    else:
        root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        files = sorted(glob.glob(os.path.join(root, 'public', 'cards', '*.json')))
        if not files:
            print(f'没找到卡片文件：{root}/public/cards/*.json', file=sys.stderr)
            return 2

    g_total = g_build = g_pass = 0
    failures = []
    for path in files:
        try:
            total, with_build, passed, problems = check_file(path)
        except Exception as exc:  # JSON 坏了也要报出来而不是崩
            failures.append(f'{path}: 读取失败 {exc}')
            print(f'{path}: 读取失败 {exc}')
            continue
        g_total += total
        g_build += with_build
        g_pass += passed
        failures.extend(problems)
        status = 'OK' if not problems else 'FAIL'
        print(f'{path}: 共 {total} 张 / 有 build {with_build} 张 / 通过 {passed} 张 [{status}]')
        for p in problems:
            print('  - ' + p)

    print()
    print(f'共 {g_total} 张 / 有 build {g_build} 张 / 不变量通过 {g_pass} 张')
    if failures:
        print(f'失败列表（{len(failures)} 条）:')
        for f in failures:
            print('  * ' + f)
        return 1
    if g_build == 0:
        print('提示：没有任何卡片带 build（迁移期正常）')
    else:
        print('失败列表：无')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
