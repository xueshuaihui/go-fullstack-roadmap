#!/usr/bin/env python3
"""把 agent 生成的 markdown 代码块转成 JSON 日卡数据。
用法：把含 ```json ... ``` 的文本存到临时文件，跑这个脚本。
"""
import json, re, sys, pathlib

def extract(text):
    blocks = re.findall(r'```json\s*(\[.*?\])\s*```', text, re.S)
    out = []
    for b in blocks:
        try:
            out.extend(json.loads(b))
        except Exception as e:
            print(f'  ! 解析失败: {e}', file=sys.stderr)
    return out

def validate(cards):
    required = ['id','stage','day','week','title','goal','duration','why','concepts',
                'code','steps','pitfalls','quiz','task','tomorrow']
    errs = []
    for c in cards:
        for k in required:
            if k not in c:
                errs.append(f"{c.get('id','?')} 缺字段 {k}")
        for sub in ['problem','naive','right']:
            if sub not in c.get('why',{}):
                errs.append(f"{c.get('id','?')} why 缺 {sub}")
        for k in ['lang','filename','content','run','expect']:
            if k not in c.get('code',{}):
                errs.append(f"{c.get('id','?')} code 缺 {k}")
        for k in ['title','acceptance','hint']:
            if k not in c.get('task',{}):
                errs.append(f"{c.get('id','?')} task 缺 {k}")
    return errs

if __name__ == '__main__':
    src = pathlib.Path(sys.argv[1])
    stage = sys.argv[2]
    text = src.read_text(encoding='utf-8')
    cards = extract(text)
    if not cards:
        print('未提取到任何 JSON 块', file=sys.stderr); sys.exit(1)
    cards = [c for c in cards if c.get('stage','').upper() == stage.upper()]
    errs = validate(cards)
    if errs:
        print('校验失败:', *errs, sep='\n  ', file=sys.stderr); sys.exit(1)
    dst = pathlib.Path(f'public/cards/{stage}.json')
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(json.dumps(cards, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'写入 {dst}：{len(cards)} 张')
