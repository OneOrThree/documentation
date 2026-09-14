#!/usr/bin/env python3
"""IA-R61.html의 트리 데이터와 IA-R61-tree.svg의 좌표로 draw.io XML(01-ia.drawio.xml)을 만든다.

설계 쪽 R61 원본에는 IA draw.io 파일이 없어서, 사이트에 표시하는 트리와 같은 배치로 생성한다.
- 상자 위치·크기·라벨: IA-R61-tree.svg의 <g class="node" data-id transform="translate(x,y)">
- 상하위 연결(실선): IA-R61.html 데이터 JSON의 tree
- 관련 기능 연결(점선): 같은 JSON의 relations
- 영역 제목: SVG의 큰 글자 <text>
sync-r61-html.py가 호출한다. 단독 실행: python3 scripts/make-ia-drawio.py <원본 폴더> <출력 경로>
"""
import json
import re
import sys
import xml.etree.ElementTree as ET

FILL = {"personal": "#eef4e4", "social": "#e7f2fa", "mixed": "#f2f3f3"}
STROKE = {"personal": "#b8cba3", "social": "#bdd4e5", "mixed": "#c9cece"}


def read_nodes(svg):
    """SVG의 노드 상자 → {id: (x, y, label, sub, experience)}"""
    nodes = {}
    for m in re.finditer(
        r'<g class="node([^"]*)" data-id="([^"]+)" transform="translate\(([\d.]+),([\d.]+)\)"[^>]*>(.*?)</g>',
        svg,
        re.S,
    ):
        cls, nid, x, y, body = m.groups()
        exp = re.search(r"experience-(\w+)", cls)
        label = re.search(r'class="label"[^>]*>([^<]*)<', body)
        sub = re.search(r'class="sub"[^>]*>([^<]*)<', body)
        nodes[nid] = (
            float(x),
            float(y),
            label.group(1) if label else nid,
            sub.group(1) if sub else "",
            exp.group(1) if exp else "mixed",
        )
    return nodes


def read_headings(svg):
    """영역 제목 텍스트(굵은 18px) → [(x, y, text)]"""
    body = re.sub(r'<g class="node.*?</g>', "", svg, flags=re.S)
    return [
        (float(x), float(y), t)
        for x, y, t in re.findall(
            r'<text x="([\d.]+)" y="([\d.]+)" font-size="18" font-weight="700"[^>]*>([^<]*)</text>', body
        )
    ]


def tree_edges(node, out):
    for child in node.get("children", []):
        out.append((node["id"], child["id"]))
        tree_edges(child, out)
    return out


def build(src_dir, out_path):
    html = open(f"{src_dir}/IA-R61.html", encoding="utf8").read()
    data = json.loads(re.search(r'<script id="data" type="application/json">(.*?)</script>', html, re.S).group(1))
    svg = open(f"{src_dir}/IA-R61-tree.svg", encoding="utf8").read()
    nodes = read_nodes(svg)
    size = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)

    mxfile = ET.Element("mxfile", host="app.diagrams.net")
    diagram = ET.SubElement(mxfile, "diagram", id="ia", name="GROMO · 정보 구조 R61")
    model = ET.SubElement(
        diagram, "mxGraphModel", page="1", pageWidth=str(int(float(size.group(1)))), pageHeight=str(int(float(size.group(2))))
    )
    root = ET.SubElement(model, "root")
    ET.SubElement(root, "mxCell", id="0")
    ET.SubElement(root, "mxCell", id="1", parent="0")

    def vertex(cid, value, style, x, y, w, h):
        cell = ET.SubElement(root, "mxCell", id=cid, value=value, style=style, vertex="1", parent="1")
        ET.SubElement(cell, "mxGeometry", x=str(x), y=str(y), width=str(w), height=str(h)).set("as", "geometry")

    def edge(cid, source, target, style, value=""):
        cell = ET.SubElement(root, "mxCell", id=cid, value=value, style=style, edge="1", parent="1", source=source, target=target)
        ET.SubElement(cell, "mxGeometry", relative="1").set("as", "geometry")

    for i, (x, y, text) in enumerate(read_headings(svg)):
        vertex(
            f"heading-{i}", text,
            "text;html=1;align=left;verticalAlign=middle;fontSize=18;fontStyle=1;fontColor=#637b6c;strokeColor=none;fillColor=none;",
            x, y - 18, 260, 24,
        )

    for nid, (x, y, label, sub, exp) in nodes.items():
        value = label if not sub else f'{label}<br><font style="font-size:9px" color="#888888">{sub}</font>'
        is_root = nid == "root"
        style = (
            "rounded=1;whiteSpace=wrap;html=1;align=left;spacingLeft=6;fontSize=12;fontColor=#333333;"
            f"fillColor={FILL[exp]};strokeColor={'#333333' if is_root else STROKE[exp]};strokeWidth={'1.5' if is_root else '1'};"
        )
        vertex(nid, value, style, x, y, 215, 40)

    line = "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=none;strokeColor=#909090;strokeWidth=1.1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;"
    n_edges = 0
    for parent, child in tree_edges(data["tree"], []):
        if parent in nodes and child in nodes:
            edge(f"e-{parent}-{child}", parent, child, line)
            n_edges += 1
    for i, rel in enumerate(data.get("relations", [])):
        if rel["source"] in nodes and rel["target"] in nodes:
            edge(
                f"rel-{i}", rel["source"], rel["target"],
                "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;dashed=1;endArrow=block;strokeColor=#6d8bb0;fontSize=11;fontColor=#4f6d90;",
                rel.get("label", ""),
            )
            n_edges += 1

    ET.indent(mxfile, space="  ")
    with open(out_path, "w", encoding="utf8") as f:
        f.write("<?xml version='1.0' encoding='utf-8'?>\n")
        f.write(ET.tostring(mxfile, encoding="unicode"))
    return len(nodes), n_edges


if __name__ == "__main__":
    n, e = build(sys.argv[1], sys.argv[2])
    print(f"[ia-drawio] {n} nodes, {e} edges → {sys.argv[2]}")
