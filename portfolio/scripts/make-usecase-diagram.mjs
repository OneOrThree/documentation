#!/usr/bin/env node

/**
 * Generate the R61 use-case map as a draw.io source + matching SVG export.
 *
 * The diagram intentionally stays at user-goal level. Screen names and small
 * operations belong in the IA; ordering and state changes belong in the user
 * journey. Keeping those layers separate prevents the old 74-endpoint map from
 * becoming a second, quickly stale IA.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const DIAGRAM_DIR = path.join(ROOT, "diagrams");

const TARGET_VERSION = 3;
const W = 1760;
const H = 1120;

const COLORS = {
  paper: "#ffffff",
  canvas: "#ffffff",
  ink: "#172b3a",
  muted: "#4d5a66",
  border: "#dce4eb",
  band: "#f8fafc",
  green: "#3866a0",
  greenSoft: "#edf4fc",
  purple: "#7860aa",
  purpleSoft: "#f0edfb",
  blue: "#607583",
  blueSoft: "#f2f5f7",
  orange: "#a9682b",
  orangeSoft: "#fff3e8",
};

const areas = [
  {
    id: "area_start",
    index: "01",
    title: "첫 소속과 진입",
    caption: "집중하기 위한 최소 준비",
    x: 280,
    y: 220,
    w: 350,
    h: 250,
    color: COLORS.green,
    soft: COLORS.greenSoft,
    cases: ["섬 만들기·가입", "입항 후 섬 홈 진입", "계정·측정 권한 준비"],
  },
  {
    id: "area_focus",
    index: "02",
    title: "집중 루프",
    caption: "R61의 첫 번째 사용자 가치",
    x: 680,
    y: 220,
    w: 350,
    h: 250,
    color: COLORS.green,
    soft: COLORS.greenSoft,
    cases: ["할 일·목표 시간 설정", "집중·휴식·복귀", "기록·물고기·퀘스트 결과 확인"],
  },
  {
    id: "area_grow",
    index: "03",
    title: "함께 성장",
    caption: "반복 집중을 섬의 변화로 연결",
    x: 1080,
    y: 220,
    w: 350,
    h: 250,
    color: COLORS.purple,
    soft: COLORS.purpleSoft,
    cases: ["집중·폰 사용 퀘스트 참여", "시설 해금·건설", "집중·스크린타임·랭킹 확인"],
  },
  {
    id: "area_life",
    index: "04",
    title: "섬 생활과 표현",
    caption: "필요할 때 선택하는 소셜·개인화",
    x: 480,
    y: 600,
    w: 470,
    h: 270,
    color: COLORS.blue,
    soft: COLORS.blueSoft,
    cases: [
      "공지·편지·이모티콘으로 소통",
      "다른 섬 탐색·방문·이동",
      "개인·공동 꾸미기와 공동 소리 사용",
    ],
  },
  {
    id: "area_operate",
    index: "05",
    title: "섬 운영",
    caption: "방장에게만 열리는 책임",
    x: 1000,
    y: 600,
    w: 390,
    h: 270,
    color: COLORS.orange,
    soft: COLORS.orangeSoft,
    cases: [
      "섬·가입 방식·멤버 관리",
      "공지·퀘스트 생성",
      "시설 선택·공동 구매·외양 적용",
    ],
  },
];

const actors = [
  { id: "actor_user", label: "주민", note: "주요 액터", x: 75, y: 300, color: COLORS.green },
  { id: "actor_host", label: "방장", note: "주민 역할의 확장", x: 75, y: 690, color: COLORS.orange },
  { id: "actor_visitor", label: "방문자", note: "다른 섬 읽기 전용", x: 75, y: 865, color: COLORS.blue },
];

const systems = [
  { id: "system_auth", label: "소셜 로그인", note: "인증", x: 1530, y: 260 },
  { id: "system_screentime", label: "iOS Screen Time", note: "측정·실드", x: 1530, y: 465 },
  { id: "system_scheduler", label: "서버 스케줄러", note: "판정·정산·알림", x: 1530, y: 670 },
];

const edges = [
  { id: "edge_user_start", source: "actor_user", target: "area_start", kind: "actor", points: [[205, 345], [245, 345]] },
  { id: "edge_user_focus", source: "actor_user", target: "area_focus", kind: "actor", points: [[205, 365], [245, 365], [245, 520], [855, 520], [855, 470]] },
  { id: "edge_user_grow", source: "actor_user", target: "area_grow", kind: "actor", points: [[205, 385], [230, 385], [230, 545], [1255, 545], [1255, 470]] },
  { id: "edge_user_life", source: "actor_user", target: "area_life", kind: "actor", points: [[205, 405], [220, 405], [220, 735], [480, 735]] },
  { id: "edge_host_user", source: "actor_host", target: "actor_user", label: "역할 확장", kind: "role", points: [[135, 690], [135, 470]] },
  { id: "edge_host_operate", source: "actor_host", target: "area_operate", kind: "actor", points: [[205, 735], [250, 735], [250, 930], [1195, 930], [1195, 870]] },
  { id: "edge_visitor_life", source: "actor_visitor", target: "area_life", label: "읽기·듣기", kind: "actor", points: [[205, 910], [415, 910], [415, 790], [480, 790]] },
  { id: "edge_auth_start", source: "system_auth", target: "area_start", kind: "system", points: [[1530, 305], [1470, 305], [1470, 170], [455, 170], [455, 220]] },
  { id: "edge_screentime_focus", source: "system_screentime", target: "area_focus", label: "측정·차단", kind: "system", points: [[1530, 510], [1490, 510], [1490, 535], [855, 535], [855, 470]] },
  { id: "edge_screentime_grow", source: "system_screentime", target: "area_grow", label: "폰 사용 기록", kind: "system", points: [[1530, 530], [1455, 530], [1455, 500], [1255, 500], [1255, 470]] },
  { id: "edge_scheduler_grow", source: "system_scheduler", target: "area_grow", label: "판정·보상", kind: "system", points: [[1530, 715], [1460, 715], [1460, 560], [1320, 560], [1320, 470]] },
  { id: "flow_start_focus", source: "area_start", target: "area_focus", label: "집중 시작", kind: "flow", points: [[630, 345], [680, 345]] },
  { id: "flow_focus_grow", source: "area_focus", target: "area_grow", label: "기록·기여", kind: "flow", points: [[1030, 345], [1080, 345]] },
  { id: "flow_grow_life", source: "area_grow", target: "area_life", label: "시설 해금", kind: "flow", points: [[1160, 470], [1160, 560], [715, 560], [715, 600]] },
  { id: "flow_life_focus", source: "area_life", target: "area_focus", label: "다시 집중", kind: "flow", points: [[715, 600], [715, 550], [780, 550], [780, 470]] },
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function cell(id, value, style, geometry, extra = "") {
  return `        <mxCell id="${id}" value="${escapeXml(value)}" style="${style}" parent="1" vertex="1"${extra}>\n          <mxGeometry ${geometry} as="geometry" />\n        </mxCell>`;
}

function childCell(id, parent, value, style, geometry) {
  return `        <mxCell id="${id}" value="${escapeXml(value)}" style="${style}" parent="${parent}" vertex="1" connectable="0">\n          <mxGeometry ${geometry} as="geometry" />\n        </mxCell>`;
}

function edgeCell(edge) {
  const dashed = edge.kind === "system" ? "dashed=1;dashPattern=6 5;" : "";
  const arrow = "endArrow=block;endFill=1;";
  const color = COLORS.blue;
  const points = edge.points
    .slice(1, -1)
    .map(([x, y]) => `              <mxPoint x="${x}" y="${y}" />`)
    .join("\n");
  const [sx, sy] = edge.points[0];
  const [tx, ty] = edge.points.at(-1);
  return `        <mxCell id="${edge.id}" value="${escapeXml(edge.label ?? "")}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=2;strokeColor=${color};fontSize=14;fontColor=#405768;labelBackgroundColor=#ffffff;${dashed}${arrow}" parent="1" edge="1" source="${edge.source}" target="${edge.target}">\n          <mxGeometry relative="1" as="geometry">\n            <mxPoint x="${sx}" y="${sy}" as="sourcePoint" />\n            <mxPoint x="${tx}" y="${ty}" as="targetPoint" />\n            <Array as="points">\n${points}\n            </Array>\n          </mxGeometry>\n        </mxCell>`;
}

function makeDrawio() {
  const areaCells = areas.flatMap((area) => {
    const rows = area.cases.map((label, i) =>
      childCell(
        `${area.id}_case_${i + 1}`,
        area.id,
        label,
        `text;html=1;strokeColor=none;fillColor=none;align=left;fontSize=16;fontColor=${COLORS.muted};`,
        `x="20" y="${78 + i * 34}" width="${area.w - 40}" height="28"`,
      ),
    );
    return [
      cell(
        area.id,
        `${area.title} — ${area.caption}`,
        `rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=${area.soft};strokeColor=${area.color};strokeWidth=1.4;noLabel=1;absoluteArcSize=1;`,
        `x="${area.x}" y="${area.y}" width="${area.w}" height="${area.h}"`,
      ),
      childCell(`${area.id}_index`, area.id, area.index, `text;html=1;strokeColor=none;fillColor=none;align=left;fontSize=14;fontStyle=1;fontColor=${area.color};`, `x="20" y="16" width="36" height="26"`),
      childCell(`${area.id}_title`, area.id, area.title, `text;html=1;strokeColor=none;fillColor=none;align=left;fontSize=21;fontStyle=1;fontColor=${COLORS.ink};`, `x="58" y="14" width="${area.w - 78}" height="32"`),
      childCell(`${area.id}_caption`, area.id, area.caption, `text;html=1;strokeColor=none;fillColor=none;align=left;fontSize=16;fontColor=${COLORS.muted};`, `x="20" y="46" width="${area.w - 40}" height="26"`),
      ...rows,
    ];
  });

  const actorCells = actors.map((actor) =>
    cell(
      actor.id,
      `${actor.label} ${actor.note}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${COLORS.blueSoft};strokeColor=${COLORS.blue};strokeWidth=1.4;fontSize=16;fontStyle=1;fontColor=${COLORS.ink};align=left;spacingLeft=20;`,
      `x="${actor.x}" y="${actor.y}" width="130" height="90"`,
    ),
  );

  const systemCells = systems.map((system) =>
    cell(
      system.id,
      `${system.label} — ${system.note}`,
      `rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=${COLORS.blueSoft};strokeColor=${COLORS.blue};strokeWidth=1.4;fontSize=16;fontStyle=1;fontColor=${COLORS.ink};align=left;spacingLeft=20;absoluteArcSize=1;`,
      `x="${system.x}" y="${system.y}" width="210" height="70"`,
    ),
  );

  const decorations = [
    cell("heading", "Gromo · 핵심 유스케이스", `text;html=1;strokeColor=none;fillColor=none;align=left;fontSize=32;fontStyle=1;fontColor=${COLORS.ink};`, `x="60" y="24" width="1640" height="45"`, ' connectable="0"'),
    cell("subtitle", "2026.09.13 · R61 사용자 목표와 책임 · 시스템 아키텍처 시각 규칙", `text;html=1;strokeColor=none;fillColor=none;align=left;fontSize=17;fontColor=${COLORS.muted};`, `x="60" y="72" width="1640" height="30"`, ' connectable="0"'),
    cell("frame", "", `rounded=1;arcSize=18;whiteSpace=wrap;html=1;fillColor=${COLORS.band};strokeColor=${COLORS.border};strokeWidth=1;noLabel=1;absoluteArcSize=1;`, `x="235" y="135" width="1250" height="820"`, ' connectable="0"'),
    cell("frame_label", "GROMO R61 · 사용자 목표", `text;html=1;strokeColor=none;fillColor=none;align=left;fontSize=19;fontStyle=1;fontColor=#334d61;`, `x="260" y="150" width="500" height="30"`, ' connectable="0"'),
    cell("legend", "실선: 사람의 참여 · 파선: 외부 시스템 의존 · 화살표: 핵심 사용 흐름", `text;html=1;strokeColor=none;fillColor=none;align=left;fontSize=14;fontColor=${COLORS.muted};`, `x="245" y="1000" width="1050" height="24"`, ' connectable="0"'),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-09-13T00:00:00.000Z" agent="OneOrThree diagram generator" version="24.7.17" type="device">
  <diagram id="gromo-r61-usecase" name="Use Case">
    <mxGraphModel dx="1760" dy="1120" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1760" pageHeight="1120" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
${decorations.join("\n")}
${areaCells.join("\n")}
${actorCells.join("\n")}
${systemCells.join("\n")}
${edges.map(edgeCell).join("\n")}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`;
}

function svgText(x, y, value, options = {}) {
  const {
    size = 14,
    weight = 400,
    fill = COLORS.ink,
    anchor = "start",
    family = "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
  } = options;
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
}

function svgArea(area) {
  const cases = area.cases.map((label, i) => {
    const y = area.y + 78 + i * 34;
    return `<g data-cell-id="${area.id}_case_${i + 1}">
      ${svgText(area.x + 20, y + 20, label, { size: 16, fill: COLORS.muted })}
    </g>`;
  }).join("\n");
  return `<g data-cell-id="${area.id}">
    <rect x="${area.x}" y="${area.y}" width="${area.w}" height="${area.h}" rx="12" fill="${area.soft}" stroke="${area.color}" stroke-width="1.4" />
  </g>
  <g data-cell-id="${area.id}_index">
    ${svgText(area.x + 20, area.y + 34, area.index, { size: 14, weight: 700, fill: area.color })}
  </g>
  <g data-cell-id="${area.id}_title">${svgText(area.x + 58, area.y + 34, area.title, { size: 21, weight: 700 })}</g>
  <g data-cell-id="${area.id}_caption">${svgText(area.x + 20, area.y + 61, area.caption, { size: 16, fill: COLORS.muted })}</g>
  ${cases}`;
}

function svgActor(actor) {
  return `<g data-cell-id="${actor.id}">
    <rect x="${actor.x}" y="${actor.y}" width="130" height="90" rx="12" fill="${COLORS.blueSoft}" stroke="${COLORS.blue}" stroke-width="1.4" />
    ${svgText(actor.x + 20, actor.y + 34, actor.label, { size: 21, weight: 700 })}
    ${svgText(actor.x + 20, actor.y + 62, actor.note, { size: 14, fill: COLORS.muted })}
  </g>`;
}

function svgSystem(system) {
  return `<g data-cell-id="${system.id}">
    <rect x="${system.x}" y="${system.y}" width="210" height="70" rx="12" fill="${COLORS.blueSoft}" stroke="${COLORS.blue}" stroke-width="1.4" />
    ${svgText(system.x + 20, system.y + 30, system.label, { size: 18, weight: 700 })}
    ${svgText(system.x + 20, system.y + 53, system.note, { size: 14, fill: COLORS.muted })}
  </g>`;
}

function polylinePath(points) {
  return `M ${points.map(([x, y]) => `${x} ${y}`).join(" L ")}`;
}

function svgEdge(edge) {
  const isSystem = edge.kind === "system";
  const color = COLORS.blue;
  const mid = edge.points[Math.floor(edge.points.length / 2)];
  const extraAttributes = [
    isSystem ? 'stroke-dasharray="7 6"' : "",
    'marker-end="url(#arrow)"',
  ].filter(Boolean).join(" ");
  const label = edge.label
    ? `    <rect x="${mid[0] - 58}" y="${mid[1] - 20}" width="116" height="23" rx="4" fill="${COLORS.paper}" />${svgText(mid[0], mid[1] - 4, edge.label, { size: 14, fill: "#405768", anchor: "middle" })}\n`
    : "";
  return `<g data-cell-id="${edge.id}">
    <path d="${polylinePath(edge.points)}" fill="none" stroke="${color}" stroke-width="2"${extraAttributes ? ` ${extraAttributes}` : ""} />
${label}  </g>`;
}

function makeSvg() {
  return `<!-- Hallmark · pre-emit critique: P5 H4 E4 S5 R5 V5 -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}px" height="${H}px" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="diagramTitle diagramDesc">
  <title id="diagramTitle">Gromo · 핵심 유스케이스</title>
  <desc id="diagramDesc">R61의 사용자 목표와 책임을 시스템 아키텍처 시각 규칙으로 정리한 유스케이스</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${COLORS.blue}" /></marker>
  </defs>
  <g data-cell-id="0"></g>
  <g data-cell-id="1"></g>
  <rect width="${W}" height="${H}" fill="${COLORS.canvas}" />
  ${svgText(60, 58, "Gromo · 핵심 유스케이스", { size: 32, weight: 700 })}
  ${svgText(60, 92, "2026.09.13 · R61 사용자 목표와 책임 · 시스템 아키텍처 시각 규칙", { size: 17, fill: COLORS.muted })}
  <g data-cell-id="frame"><rect x="235" y="135" width="1250" height="820" rx="18" fill="${COLORS.band}" stroke="${COLORS.border}" /></g>
  <g data-cell-id="frame_label">${svgText(260, 169, "GROMO R61 · 사용자 목표", { size: 19, weight: 700, fill: "#334d61" })}</g>
  ${edges.map(svgEdge).join("\n")}
  ${areas.map(svgArea).join("\n")}
  ${actors.map(svgActor).join("\n")}
  ${systems.map(svgSystem).join("\n")}
  <g data-cell-id="legend">${svgText(245, 1018, "실선: 사람의 참여  ·  파선: 외부 시스템 의존  ·  화살표: 핵심 사용 흐름", { size: 14, fill: COLORS.muted })}</g>
  ${svgText(60, 1080, "설계 뷰 · 세부 화면은 IA, 단계와 상태 변화는 유저 저니, 정책은 /spec/use-cases가 정본", { size: 14, fill: COLORS.muted })}
</svg>
`;
}

for (const suffix of ["drawio.xml", "svg"]) {
  const current = path.join(DIAGRAM_DIR, `00-usecase.${suffix}`);
  const previous = path.join(DIAGRAM_DIR, `00-usecase.v${TARGET_VERSION - 1}.${suffix}`);
  if (fs.existsSync(current) && !fs.existsSync(previous)) {
    fs.copyFileSync(current, previous);
    console.log(`[use-case] archived ${path.basename(previous)}`);
  }
}

fs.writeFileSync(path.join(DIAGRAM_DIR, "00-usecase.drawio.xml"), makeDrawio());
fs.writeFileSync(path.join(DIAGRAM_DIR, "00-usecase.svg"), makeSvg());
console.log(`[use-case] generated v${TARGET_VERSION} → diagrams/00-usecase.{drawio.xml,svg}`);
