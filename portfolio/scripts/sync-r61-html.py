#!/usr/bin/env python3
"""R61 설계 원본 HTML(IA·유저 저니)을 사이트용으로 가공해 diagrams/01-ia.html, 02-journey.html에 넣는다.

원본: gachisup-R61-assets/문서/IA-R61.html, User-Journey-R61.html (GROMO_R61_DOCS로 경로 지정 가능)
가공: 헤더·푸터·외부 문서 링크·로컬 경로 제거, IA는 버튼·범례만 한 줄로, 저니는 흐름도만 남기고 프레임에 맞춰 자동 축소.
원본 draw.io(User-Journey-R61.drawio)와 SVG 두 장은 참고용으로 02-journey.drawio.xml, 02-journey.svg, 01-ia.svg에 복사한다.
원본이 바뀔 때마다 다시 실행하면 같은 가공이 재적용된다. 새 버전을 낼 때는 먼저 현재 파일을
<id>.vN.html로 보존하고 manifest의 versions를 갱신한다 (README "HTML 다이어그램의 표시")."""
import os
import re
import shutil

SRC = os.environ.get("GROMO_R61_DOCS", "/Users/soobin/orca/projects/growing/gachisup-R61-assets/문서")
DST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "diagrams")


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
open(f"{DST}/01-ia.html", "w", encoding="utf8").write(ia)

# ---------------- 유저 저니 ----------------
j = open(f"{SRC}/User-Journey-R61.html", encoding="utf8").read()
j = sub1(j, r"<header>.*?</header>", "", "저니 헤더")
j = sub1(j, r"<footer>.*?</footer>", "", "저니 푸터")
assert j.count('class="map"') == 1 and not re.findall(r'href="[^"]*"', j), "저니 구조 이상"
css = (
    "\nbody{overflow:hidden;background:#fff}main{padding:10px 14px 12px}.map{padding:14px 20px}"
    ".highlight-controls{margin-bottom:10px}.band-head{margin-bottom:8px}.node{padding:10px 14px}"
    ".node strong{font-size:16px}.funding{margin:10px 0 10px}.build .node{padding:9px 11px}"
    ".branches{margin-top:6px}.opening{margin:10px 0 8px}.facility{padding:8px 12px 8px}"
    ".facility h3{margin-bottom:5px}.facility small{margin-top:6px}.loop{margin-top:10px;padding-top:8px}\n"
)
js = (
    "<script>\n// 프레임 높이보다 내용이 길면 한 화면에 들어오도록 축소한다\n"
    "const fit=()=>{document.body.style.zoom=1;const r=innerHeight/document.documentElement.scrollHeight;"
    "document.body.style.zoom=Math.min(1,r).toFixed(3)};fit();addEventListener('resize',fit);\n</script>"
)
assert j.count("</style>") == 1 and j.count("</script>") == 1, "저니 style/script 개수 변경"
j = j.replace("</style>", css + "</style>", 1).replace("</script>", "</script>" + js, 1)
open(f"{DST}/02-journey.html", "w", encoding="utf8").write(j)

# 원본 draw.io·SVG도 참고용으로 나란히 둔다 (HTML 형식이라 빌드는 읽지 않음)
for src, dst in (
    ("User-Journey-R61.drawio", "02-journey.drawio.xml"),
    ("User-Journey-R61-overview.svg", "02-journey.svg"),
    ("IA-R61-tree.svg", "01-ia.svg"),
):
    shutil.copy(f"{SRC}/{src}", f"{DST}/{dst}")
print("synced: diagrams/01-ia.html, 02-journey.html + 원본 drawio/svg — 이어서 npm run build 또는 node scripts/build-diagrams.mjs")
