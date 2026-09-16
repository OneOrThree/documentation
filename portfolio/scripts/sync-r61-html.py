#!/usr/bin/env python3
"""R61 IA HTML과 사용자 여정 Markdown을 사이트용 HTML로 만든다.

원본: gachisup-R61-assets/문서/IA-R61.html, User-Journey-R61.md (GROMO_R61_DOCS로 경로 지정 가능)
가공: IA는 헤더·외부 링크·로컬 경로를 제거하고 버튼·범례만 남긴다. 사용자 여정은 Markdown의 9개 여정을 전부 렌더링한다.
원본 draw.io(User-Journey-R61.drawio)와 SVG 두 장은 참고용으로 02-journey.drawio.xml, 02-journey.svg, 01-ia.svg에 복사한다.
IA draw.io는 원본에 없어서 make_ia_drawio.py로 01-ia.drawio.xml을 생성한다.
원본이 바뀔 때마다 다시 실행하면 같은 가공이 재적용된다. 새 버전을 낼 때는 먼저 현재 파일을
<id>.vN.html로 보존하고 manifest의 versions를 갱신한다 (README "HTML 다이어그램의 표시")."""
import os
import re
import shutil
import sys
from html import escape

SRC = os.environ.get("GROMO_R61_DOCS", "/Users/soobin/orca/projects/growing/gachisup-R61-assets/문서")
DST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "diagrams")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_ia_drawio import build as build_ia_drawio  # noqa: E402


def sub1(s, pat, rep, what, flags=re.S):
    s, n = re.subn(pat, rep, s, count=1, flags=flags)
    assert n == 1, f"{what}: 패턴을 못 찾음 (원본 구조가 바뀜)"
    return s


# ---------------- IA ----------------
ia = open(f"{SRC}/IA-R61.html", encoding="utf8").read()
ia = sub1(ia, r"<header>.*?</header>", "", "IA 헤더")
ia = sub1(ia, r'<a href="정책-결정-2026-09-14\.html"[^>]*>.*?</a>', "", "IA 우하단 정책 링크")
ia = sub1(ia, r'<a href="\$\{esc\(x\.file\)\}">\$\{esc\(x\.name\)\}</a>', "${esc(x.name)}", "IA 근거 링크")
ia = re.sub(r'"file": "[^"]*"', '"file": ""', ia)  # 로컬 절대경로 제거
assert "/Users/" not in ia and not re.findall(r'href="[^"]*"', ia), "IA에 링크/경로 남음"
# 범례를 버튼 줄로 이동, 상태줄 숨김
legend = re.search(r'<span class="legend">.*?</span></span>', ia, re.S)
assert legend, "IA 범례 없음"
ia = ia.replace(legend.group(0), "", 1)
tb_end = ia.index("</div>", ia.index('<div class="toolbar">'))
ia = ia[:tb_end] + legend.group(0) + ia[tb_end:]
# 헤더(69px)·상태줄(30px)만큼 캔버스 높이 보정
ia = sub1(ia, r"calc\(100dvh - 158px\)", "calc(100dvh - 59px)", "IA 캔버스 높이", 0)
ia = sub1(ia, r"calc\(100dvh - 220px\)", "calc(100dvh - 121px)", "IA 캔버스 높이(모바일)", 0)
ia = ia.replace(
    "</style>",
    "\n.toolbar .sep,#scope,#search,#reset,.hint,#export,#count{display:none!important}"
    ".status{display:none}.toolbar .legend{margin-left:auto;font-size:11px;color:#777}\n</style>",
    1,
)
assert "소셜 로그인은 기능 해금 조건이 아니다" in ia, "IA 게스트 전체 기능 정책이 빠짐"
assert "게스트는 발송 시 회원 전환이 필요하다" not in ia, "IA에 이전 게스트 제한이 남음"
assert "우리 섬 채팅방" in ia, "IA 채팅방 명칭이 빠짐"
open(f"{DST}/01-ia.html", "w", encoding="utf8").write(ia)

# ---------------- 유저 저니 ----------------
def text_only(value):
    value = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", value)
    return escape(value.strip())


lines = open(f"{SRC}/User-Journey-R61.md", encoding="utf8").read().splitlines()
intro = []
sections = []
current = None
for raw in lines:
    line = raw.strip()
    if line.startswith("# "):
        continue
    if line.startswith("## "):
        current = {"title": line[3:].strip(), "items": [], "notes": []}
        sections.append(current)
        continue
    if not line:
        continue
    if current is None:
        intro.append(line)
        continue
    if line.startswith("- ") and ":" in line:
        label, value = line[2:].split(":", 1)
        current["items"].append((label.strip(), value.strip()))
    else:
        current["notes"].append(line)

assert len(sections) == 9, f"사용자 여정 9개가 필요하지만 {len(sections)}개를 찾음"


def render_journey(section, index):
    start = next(value for label, value in section["items"] if label == "시작")
    finish = next(value for label, value in section["items"] if label == "완료")
    branches = [value for label, value in section["items"] if label == "분기"]
    steps = [(label, value) for label, value in section["items"] if label not in ("시작", "완료", "분기")]
    step_html = "".join(
        f'<li><span>{step_index:02d}</span><div><strong>{text_only(label)}</strong><p>{text_only(value)}</p></div></li>'
        for step_index, (label, value) in enumerate(steps, 1)
    )
    branch_html = ""
    if branches:
        items = "".join(f"<li>{text_only(value)}</li>" for value in branches)
        branch_html = f'<details><summary>분기 {len(branches)}개 보기</summary><ul>{items}</ul></details>'
    note_html = ""
    if section["notes"]:
        note_html = '<div class="notes">' + "".join(f"<p>{text_only(note)}</p>" for note in section["notes"]) + "</div>"
    return f'''<section class="journey" id="journey-{index}">
      <header><span>{index:02d}</span><h2>{text_only(section["title"])}</h2></header>
      <div class="boundary"><article><small>시작</small><p>{text_only(start)}</p></article><b aria-hidden="true">→</b><article><small>완료</small><p>{text_only(finish)}</p></article></div>
      <ol>{step_html}</ol>{branch_html}{note_html}
    </section>'''


journey_css = """
:root{--ink:#252b29;--muted:#66706c;--sea:#315f63;--paper:#f8faf9;--surface:#fff;--rule:#d9dfdc;--sage:#edf4f0}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font:14px/1.65 -apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;word-break:keep-all}main{width:min(1080px,calc(100% - 40px));margin:auto;padding:28px 0 64px}.intro{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}.intro p{margin:0;padding:15px 17px;border:1px solid var(--rule);background:var(--surface);color:var(--muted)}nav{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--rule);margin-bottom:48px}nav a{min-height:52px;display:flex;align-items:center;gap:10px;padding:9px 13px;border-right:1px solid var(--rule);border-bottom:1px solid var(--rule);color:var(--ink);font-weight:650;text-decoration:none}nav a:nth-child(3n){border-right:0}nav a:nth-last-child(-n+3){border-bottom:0}nav span,.journey>header span{font:700 11px/1 ui-monospace,monospace;color:var(--sea)}.journey{padding-bottom:48px;margin-bottom:48px;border-bottom:1px solid #aebbb6;scroll-margin-top:20px}.journey>header{display:flex;align-items:baseline;gap:14px;padding-bottom:16px;border-bottom:2px solid var(--ink)}h2{margin:0;font-size:clamp(23px,3vw,31px);letter-spacing:-.04em}.boundary{display:grid;grid-template-columns:1fr 40px 1fr;align-items:stretch;margin:20px 0}.boundary article{padding:16px 18px;background:var(--surface);border:1px solid var(--rule)}.boundary small{font-weight:750;color:var(--sea)}.boundary p{margin:4px 0 0}.boundary>b{display:grid;place-items:center;color:var(--sea)}ol{display:grid;grid-template-columns:repeat(2,1fr);margin:0;padding:0;list-style:none;border-top:1px solid var(--rule)}ol li{display:grid;grid-template-columns:32px 1fr;gap:8px;padding:15px 16px 17px 0;border-bottom:1px solid var(--rule)}ol li:nth-child(odd){border-right:1px solid var(--rule)}ol li:nth-child(even){padding-left:16px}ol li>span{font:11px/1.5 ui-monospace,monospace;color:var(--sea)}ol strong{font-size:14px}ol p{margin:3px 0 0;color:var(--muted)}details{margin-top:20px;border-block:1px solid var(--rule)}summary{padding:14px 0;color:var(--sea);font-weight:700;cursor:pointer}details ul{list-style:none;margin:0;padding:0 0 14px}details li{padding:5px 0 5px 24px;color:var(--muted)}details li:before{content:'↳';margin-left:-20px;margin-right:8px;color:var(--sea)}.notes{margin-top:18px;padding:14px 17px;border-left:3px solid var(--sea);background:var(--sage)}.notes p{margin:0;color:var(--muted)}.notes p+p{margin-top:6px}@media(max-width:720px){main{width:calc(100% - 24px);padding-top:16px}.intro,nav,ol{grid-template-columns:1fr}.intro{gap:8px}nav a,nav a:nth-child(3n){border-right:0;border-bottom:1px solid var(--rule)}nav a:last-child{border-bottom:0}.boundary{grid-template-columns:1fr}.boundary>b{min-height:30px;transform:rotate(90deg)}ol li,ol li:nth-child(odd),ol li:nth-child(even){border-right:0;padding:14px 0}.journey{padding-bottom:36px;margin-bottom:36px}}
"""
intro_html = "".join(f"<p>{text_only(value)}</p>" for value in intro)
index_html = "".join(
    f'<a href="#journey-{index}"><span>{index:02d}</span>{text_only(section["title"])}</a>'
    for index, section in enumerate(sections, 1)
)
j = f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GROMO 사용자 여정 v5</title><style>{journey_css}</style></head><body><main><div class="intro">{intro_html}</div><nav aria-label="사용자 여정 목차">{index_html}</nav>{"".join(render_journey(section, index) for index, section in enumerate(sections, 1))}</main></body></html>'''
assert j.count('class="journey"') == 9, "사용자 여정 렌더 수가 9개가 아님"
assert "소셜 로그인은 기능 해금 조건이 아니다" in j, "사용자 여정 게스트 전체 기능 정책이 빠짐"
assert "우리 섬 채팅방" in j, "사용자 여정 채팅방 명칭이 빠짐"
open(f"{DST}/02-journey.html", "w", encoding="utf8").write(j)

# 원본 draw.io·SVG도 참고용으로 나란히 둔다 (HTML 형식이라 빌드는 읽지 않음)
for src, dst in (
    ("User-Journey-R61.drawio", "02-journey.drawio.xml"),
    ("User-Journey-R61-overview.svg", "02-journey.svg"),
    ("IA-R61-tree.svg", "01-ia.svg"),
):
    shutil.copy(f"{SRC}/{src}", f"{DST}/{dst}")
# IA는 원본에 draw.io가 없어서 트리 데이터·SVG 좌표로 생성한다
n, e = build_ia_drawio(SRC, f"{DST}/01-ia.drawio.xml")
print(f"synced: diagrams/01-ia.html + User-Journey-R61.md의 9개 여정 → 02-journey.html + 원본 drawio/svg + 01-ia.drawio.xml({n} nodes, {e} edges) — 이어서 npm run build 또는 node scripts/build-diagrams.mjs")
