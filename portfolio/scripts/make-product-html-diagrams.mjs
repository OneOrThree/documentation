#!/usr/bin/env node

/** Generate the R61 IA and user journey HTML diagrams. */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const DIAGRAM_DIR = path.join(ROOT, "diagrams");
const TARGET_VERSION = 3;

const TOKENS = `
  :root {
    color-scheme: light;
    --paper: #ffffff;
    --canvas: #ffffff;
    --ink: #172b3a;
    --muted: #4d5a66;
    --rule: #dce4eb;
    --rule-strong: #607583;
    --band: #f8fafc;
    --green: #3866a0;
    --green-soft: #edf4fc;
    --purple: #7860aa;
    --purple-soft: #f0edfb;
    --blue: #607583;
    --blue-soft: #f2f5f7;
    --orange: #a9682b;
    --orange-soft: #fff3e8;
    --font-body: "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
`;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function documentShell({ title, description, style, body, script = "" }) {
  return `<!doctype html>
<!-- Hallmark · pre-emit critique: P5 H4 E4 S5 R5 V5 -->
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <style>
${TOKENS}
${style}
  </style>
</head>
<body>
${body}
${script ? `<script>${script}</script>` : ""}
</body>
</html>
`.replace(/[ \t]+$/gm, "");
}

const iaGroups = [
  {
    id: "entry",
    tone: "green",
    eyebrow: "ENTRY",
    title: "시작과 첫 소속",
    note: "건설 없이 첫 집중까지",
    items: [
      ["시작·자동 로그인", "인증과 진행 세션을 확인한다", "모두"],
      ["첫 섬 선택", "혼자 만들기 또는 기존 섬 참여", "모두"],
      ["입항·섬 홈", "확정된 소속과 해금 상태로 진입", "주민"],
    ],
  },
  {
    id: "home",
    tone: "green",
    eyebrow: "ALWAYS",
    title: "섬 홈 · 처음부터",
    note: "R61의 필수 개인 루프",
    items: [
      ["내 배", "내 정보 · 앱 설정 · 보유품 적용", "주민"],
      ["부두", "집중 설정 · 집중/휴식/복귀 · 결과", "주민"],
      ["모닥불", "집중 중 선택하는 휴식 상태", "주민"],
    ],
  },
  {
    id: "foundation",
    tone: "purple",
    eyebrow: "FIXED ORDER",
    title: "첫 성장 · 고정 순서",
    note: "섬 물고기로 여는 기반",
    items: [
      ["마을회관", "통계 · 섬 운영 · 공동 장부 · 다음 시설", "주민 / 방장"],
      ["게시판", "공지 · 집중/폰 사용 퀘스트 · 지난 결과", "주민 / 방장"],
    ],
  },
  {
    id: "choice",
    tone: "blue",
    eyebrow: "CHOOSE",
    title: "후속 시설 · 선택",
    note: "마을 포인트로 기능 확장",
    items: [
      ["전망대", "섬 안/간 랭킹 · 다른 섬 탐색과 이동", "주민 / 방문자"],
      ["우체국", "현재 섬 전체가 읽고 쓰는 편지방", "주민"],
      ["꽃나팔 방송기", "공동 음원 재생 · 집중 화면에서 변경", "주민 / 방문자"],
      ["상점", "개인·공동 꾸미기와 ASMR 구매", "주민 / 방장"],
    ],
  },
];

function iaCard([title, purpose, role], index) {
  return `<article class="node" data-detail>
    <div class="node-head"><span class="node-index">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(title)}</h3></div>
    <p>${escapeHtml(purpose)}</p>
    <span class="role">${escapeHtml(role)}</span>
  </article>`;
}

function iaGroup(group) {
  return `<section class="group ${group.tone}" id="${group.id}">
    <header><p class="eyebrow">${group.eyebrow}</p><h2>${group.title}</h2><p class="group-note">${group.note}</p></header>
    <div class="nodes">${group.items.map(iaCard).join("\n")}</div>
  </section>`;
}

function makeIa() {
  const style = `
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; background: var(--paper); color: var(--ink); font-family: var(--font-body); }
  body { min-width: 320px; }
  button { min-height: 42px; border: 1.4px solid var(--green); border-radius: 12px; background: var(--green-soft); color: var(--ink); padding: 0 16px; font: 700 14px/1 var(--font-body); cursor: pointer; }
  button:hover { border-color: var(--green); color: var(--green); }
  button:active { transform: translateY(1px); }
  button:focus-visible { outline: 3px solid color-mix(in srgb, var(--green) 35%, transparent); outline-offset: 2px; }
  button[aria-pressed="true"] { border-color: var(--green); background: var(--green); color: var(--paper); }
  .controls { display: flex; align-items: center; gap: 8px; }
  .viewport { overflow: auto; padding: 24px 40px 36px; }
  .diagram { min-width: 1680px; max-width: 1760px; margin: 0 auto; }
  .title { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 32px; margin: 0 20px 28px; }
  .title h1 { margin: 0; color: var(--ink); font-size: 32px; line-height: 1.12; letter-spacing: -0.02em; }
  .title p { margin: 8px 0 0; color: var(--muted); font-size: 17px; line-height: 1.45; }
  .legend { display: flex; align-items: center; gap: 18px; margin: 0 24px 18px; font: 600 14px/1 var(--font-body); color: var(--muted); white-space: nowrap; }
  .legend span::before { content: ""; display: inline-block; width: 18px; height: 2px; margin-right: 6px; vertical-align: 3px; background: var(--green); }
  .legend span:nth-child(2)::before { background: var(--purple); }
  .legend span:nth-child(3)::before { background: var(--blue); }
  .flow { position: relative; display: grid; grid-template-columns: 0.9fr 1fr 0.9fr 1.15fr; gap: 44px; align-items: start; padding: 76px 24px 28px; border: 1px solid var(--rule); border-radius: 18px; background: var(--band); }
  .flow::before { content: "01  화면 위치와 해금 순서"; position: absolute; top: 24px; left: 24px; color: #334d61; font-size: 19px; font-weight: 700; }
  .group { position: relative; min-width: 0; border: 1.4px solid var(--tone); border-radius: 12px; background: var(--soft); padding: 20px; }
  .group:not(:last-child)::after { content: "→"; position: absolute; right: -34px; top: 82px; color: var(--rule-strong); font-size: 20px; font-weight: 700; }
  .group.green { --tone: var(--green); --soft: var(--green-soft); }
  .group.purple { --tone: var(--purple); --soft: var(--purple-soft); }
  .group.blue { --tone: var(--blue); --soft: var(--blue-soft); }
  .group header { min-height: 98px; border-bottom: 1px solid color-mix(in srgb, var(--tone) 28%, transparent); }
  .eyebrow { margin: 0 0 9px; color: var(--tone); font-size: 14px; font-weight: 700; }
  .group h2 { margin: 0; font-size: 21px; line-height: 1.25; }
  .group-note { margin: 7px 0 0; color: var(--muted); font-size: 16px; line-height: 1.45; }
  .nodes { display: grid; gap: 12px; margin-top: 16px; }
  .node { border: 1.4px solid var(--tone); border-radius: 12px; background: var(--paper); padding: 14px 16px; }
  .node-head { display: flex; align-items: center; gap: 9px; }
  .node-index { color: var(--tone); font-size: 14px; font-weight: 700; }
  .node h3 { margin: 0; font-size: 17px; line-height: 1.3; }
  .node p { margin: 8px 0 0; color: var(--muted); font-size: 15px; line-height: 1.5; }
  .role { display: inline-flex; align-items: center; min-height: 24px; margin-top: 10px; color: var(--tone); font-size: 14px; font-weight: 700; white-space: nowrap; }
  body:not(.show-details) [data-detail] p, body:not(.show-details) [data-detail] .role { display: none; }
  body:not(.show-details) .node { padding-block: 14px; }
  body:not(.show-details) .group header { min-height: 82px; }
  .system-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 20px; padding: 24px; border: 1px solid var(--rule); border-radius: 18px; background: var(--band); }
  .system { border: 1.4px solid var(--blue); border-radius: 12px; background: var(--blue-soft); padding: 16px 20px; }
  .system strong { font-size: 17px; }
  .system span { margin-left: 10px; color: var(--muted); font-size: 15px; }
  .footnote { margin: 18px 22px 0; color: var(--muted); font-size: 14px; line-height: 1.6; }
  @media (max-width: 760px) { .viewport { padding: 20px 12px; } }
  @media (prefers-reduced-motion: reduce) { button:active { transform: none; } }
  `;

  const body = `
  <main class="viewport">
    <div class="diagram">
      <div class="title">
        <div><h1>Gromo · 정보 구조</h1><p>2026.09.13 · 진입에서 집중, 해금 시설까지 · R61 사용자 목표 정본과 정합</p></div>
        <div class="controls" role="group" aria-label="정보 표시 수준"><button type="button" id="overview" aria-pressed="true">주요 구조</button><button type="button" id="details" aria-pressed="false">기능·권한</button></div>
      </div>
      <div class="legend" aria-label="단계 범례"><span>처음부터</span><span>고정 성장</span><span>선택 해금</span></div>
      <div class="flow">${iaGroups.map(iaGroup).join("\n")}</div>
      <section class="system-strip" aria-label="공통 시스템 진입">
        <div class="system"><strong>권한·측정</strong><span>Screen Time · 알림 · 공개 범위</span></div>
        <div class="system"><strong>복구·딥링크</strong><span>인증·소속·해금·권한 재검사</span></div>
        <div class="system"><strong>역할</strong><span>주민 · 방장 · 방문자 읽기 전용</span></div>
      </section>
      <p class="footnote">설계 뷰 · 사용자 목표와 역할은 /spec/use-cases, 세부 상태 순서는 유저 저니가 정본 · 기준 명칭: 꽃나팔 방송기 · 우체국</p>
    </div>
  </main>`;

  const script = `
  const overview = document.getElementById("overview");
  const details = document.getElementById("details");
  function setDetails(show) {
    document.body.classList.toggle("show-details", show);
    overview.setAttribute("aria-pressed", String(!show));
    details.setAttribute("aria-pressed", String(show));
  }
  overview.addEventListener("click", () => setDetails(false));
  details.addEventListener("click", () => setDetails(true));
  `;

  return documentShell({
    title: `Gromo · 정보 구조 v${TARGET_VERSION}`,
    description: "R61의 진입, 집중, 고정 성장, 선택 시설을 사용자 목표와 역할로 정리한 정보 구조",
    style,
    body,
    script,
  });
}

const journeyStages = [
  {
    id: "01",
    phase: "시작하기",
    title: "첫 소속 정하기",
    goal: "혼자 또는 기존 섬에서 첫 집중을 시작할 준비를 한다.",
    action: "로그인 → 섬 만들기 또는 참여 → 입항",
    touchpoint: "시작·첫 섬 선택·섬 홈",
    response: "인증과 소속을 확인하고 초기 시설을 보여 준다.",
    rule: "첫 건설은 집중 시작 조건이 아니다.",
    next: "섬 홈",
    tone: "green",
  },
  {
    id: "02",
    phase: "집중하기",
    title: "할 일과 시간 정하기",
    goal: "이번에 무엇을 얼마나 할지 명확히 한다.",
    action: "할 일·목표 시간 설정 → 집중 시작",
    touchpoint: "부두 · 집중 설정",
    response: "세션을 만들고 허용 범위에서 Screen Time 실드를 적용한다.",
    rule: "권한 거부가 나머지 개인 설정을 잠그지 않는다.",
    next: "집중 중",
    tone: "green",
  },
  {
    id: "03",
    phase: "집중하기",
    title: "집중하고 쉬었다 복귀하기",
    goal: "할 일에 머물고 필요할 때 의도적으로 쉰다.",
    action: "집중 ↔ 잠시 휴식 · 선택적으로 이모티콘/공동 소리",
    touchpoint: "부두 · 모닥불 · 꽃나팔 방송기",
    response: "유효 집중과 휴식을 나누고 진행 세션을 복구한다.",
    rule: "휴식은 종료가 아니며 유효 집중·보상에서 제외한다.",
    next: "집중 중 또는 휴식 중",
    tone: "green",
  },
  {
    id: "04",
    phase: "결과 보기",
    title: "집중 결과 확인하기",
    goal: "쓴 시간과 이번 행동이 만든 결과를 이해한다.",
    action: "종료 → 기록·물고기·퀘스트 결과 확인",
    touchpoint: "집중 결과 · 게시판 지난 결과",
    response: "중복 없이 기록하고 각 결과와 재화 귀속을 구분한다.",
    rule: "목표 미달이어도 실제 집중 기록은 남긴다.",
    next: "다시 집중 또는 성장 선택",
    tone: "green",
  },
  {
    id: "05",
    phase: "함께 성장",
    title: "섬의 다음 기능 열기",
    goal: "반복 집중과 퀘스트 기여가 섬의 변화를 만든다.",
    action: "퀘스트 참여 → 공동 자원 확인 → 시설 선택·건설",
    touchpoint: "마을회관 · 게시판 · 건설 예정지",
    response: "판정·보상을 확정하고 해금 조건과 잔액을 갱신한다.",
    rule: "회관→게시판은 고정, 이후 시설은 조건에 따라 선택한다.",
    next: "새 시설 이용 가능",
    tone: "purple",
  },
  {
    id: "06",
    phase: "섬 생활",
    title: "필요한 활동만 선택하기",
    goal: "소통·탐색·꾸미기를 하거나 바로 다시 집중한다.",
    action: "편지/공지 · 통계/랭킹 · 다른 섬 · 개인/공동 꾸미기",
    touchpoint: "우체국 · 전망대 · 상점 · 내 배",
    response: "해금·역할·보유·공개 범위에 맞는 행동만 연다.",
    rule: "초대·알림·딥링크로 잠금이나 권한을 우회하지 않는다.",
    next: "선택 활동 또는 집중 루프 복귀",
    tone: "blue",
  },
];

function journeyCell(stage, key) {
  return `<td><span>${escapeHtml(stage[key])}</span></td>`;
}

function makeJourney() {
  const rows = [
    ["사용자 목표", "goal"],
    ["행동", "action"],
    ["터치포인트", "touchpoint"],
    ["시스템 응답", "response"],
    ["확정 규칙", "rule"],
    ["도달 상태", "next"],
  ];
  const style = `
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; background: var(--paper); color: var(--ink); font-family: var(--font-body); }
  body { min-width: 320px; }
  .legend { display: flex; align-items: center; gap: 18px; margin: 0 24px 18px; color: var(--muted); font-size: 14px; font-weight: 600; white-space: nowrap; }
  .legend span::before { content: ""; display: inline-block; width: 18px; height: 2px; margin-right: 6px; vertical-align: 3px; background: var(--green); }
  .legend span:nth-child(2)::before { background: var(--purple); }
  .legend span:nth-child(3)::before { background: var(--blue); }
  main { overflow: auto; padding: 24px 40px 36px; }
  .sheet { min-width: 1680px; max-width: 1760px; margin: 0 auto; }
  .title { margin: 0 20px 28px; }
  .title h1 { margin: 0; color: var(--ink); font-size: 32px; line-height: 1.12; letter-spacing: -0.02em; }
  .title p { margin: 8px 0 0; color: var(--muted); font-size: 17px; line-height: 1.45; }
  .journey-band { padding: 24px; border: 1px solid var(--rule); border-radius: 18px; background: var(--band); }
  .band-title { margin: 0 0 20px; color: #334d61; font-size: 19px; font-weight: 700; }
  table { width: 100%; table-layout: fixed; border-collapse: separate; border-spacing: 0; overflow: hidden; border: 1px solid var(--rule); border-radius: 12px; background: var(--paper); }
  col.label { width: 142px; }
  thead th { vertical-align: top; border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 18px; text-align: left; background: var(--soft); }
  thead th:first-child { background: var(--blue-soft); color: var(--ink); }
  thead th:last-child, tbody td:last-child { border-right: 0; }
  thead th.green { --tone: var(--green); --soft: var(--green-soft); }
  thead th.purple { --tone: var(--purple); --soft: var(--purple-soft); }
  thead th.blue { --tone: var(--blue); --soft: var(--blue-soft); }
  .stage { display: block; margin-bottom: 10px; color: var(--tone); font-size: 14px; font-weight: 700; }
  thead h2 { margin: 0; font-size: 18px; line-height: 1.3; }
  tbody th { border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 16px 14px; background: var(--blue-soft); color: var(--muted); font-size: 14px; font-weight: 700; line-height: 1.35; text-align: left; }
  tbody td { vertical-align: top; border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 16px 17px; font-size: 15px; line-height: 1.55; }
  tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
  tbody tr:first-child td { font-weight: 700; }
  tbody tr:last-child td { color: var(--green); font-weight: 700; }
  .return { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 18px; border: 1.4px solid var(--green); border-radius: 12px; background: var(--green-soft); padding: 16px 20px; }
  .return strong { font-size: 17px; }
  .return span { color: var(--muted); font-size: 15px; }
  .footnote { margin: 18px 22px 0; color: var(--muted); font-size: 14px; line-height: 1.6; }
  @media (max-width: 760px) { main { padding: 20px 12px; } }
  `;
  const body = `
  <main>
    <div class="sheet">
      <header class="title"><h1>Gromo · 전체 유저 저니</h1><p>2026.09.13 · 첫 소속에서 다시 집중하기까지 · 01–04 핵심 루프 / 05 성장 / 06 선택 활동</p></header>
      <div class="legend" aria-label="경로 범례"><span>핵심 루프</span><span>성장</span><span>선택 활동</span></div>
      <section class="journey-band"><h2 class="band-title">01  상태를 바꾸는 여섯 단계</h2><table aria-label="GROMO R61 전체 유저 저니">
        <colgroup><col class="label" /><col span="6" /></colgroup>
        <thead><tr><th scope="col">여정 축</th>${journeyStages.map((stage) => `<th scope="col" class="${stage.tone}"><span class="stage">${stage.id} · ${stage.phase}</span><h2>${stage.title}</h2></th>`).join("")}</tr></thead>
        <tbody>${rows.map(([label, key]) => `<tr><th scope="row">${label}</th>${journeyStages.map((stage) => journeyCell(stage, key)).join("")}</tr>`).join("\n")}</tbody>
      </table></section>
      <div class="return"><strong>06의 모든 선택에는 집중 루프로 돌아가는 길이 있다.</strong><span>소통·탐색·꾸미기는 집중 완료 뒤 강제되는 코스가 아니다.</span></div>
      <p class="footnote">상태 순서 정본 · 사용자 목표와 역할은 /spec/use-cases, 화면 위치와 해금 조건은 IA를 우선 · 기준 명칭: 꽃나팔 방송기 · 우체국</p>
    </div>
  </main>`;
  return documentShell({
    title: `Gromo · 전체 유저 저니 v${TARGET_VERSION}`,
    description: "첫 소속, 집중, 휴식과 복귀, 결과, 성장, 선택 활동을 상태 변화로 정리한 R61 사용자 여정",
    style,
    body,
  });
}

// v4부터 IA·유저 저니는 이 생성기가 아니라 scripts/sync-r61-html.py가 설계 원본에서 만든다.
// manifest의 현재 버전이 더 높으면 여기서 멈춰 현재 별칭을 덮어쓰지 않는다.
const manifest = JSON.parse(fs.readFileSync(path.join(DIAGRAM_DIR, "manifest.json"), "utf8"));
for (const id of ["01-ia", "02-journey"]) {
  const current = Number(/^v(\d+)$/.exec(manifest.find((e) => e.id === id)?.versions?.[0]?.id ?? "")?.[1] ?? 0);
  if (current > TARGET_VERSION) {
    console.error(`[product-diagrams] ${id}는 v${current}가 현재 버전이라 v${TARGET_VERSION} 생성기로 덮어쓰지 않는다. scripts/sync-r61-html.py를 사용할 것.`);
    process.exit(1);
  }
}

for (const id of ["01-ia", "02-journey"]) {
  const current = path.join(DIAGRAM_DIR, `${id}.html`);
  const previous = path.join(DIAGRAM_DIR, `${id}.v${TARGET_VERSION - 1}.html`);
  if (fs.existsSync(current) && !fs.existsSync(previous)) {
    fs.copyFileSync(current, previous);
    console.log(`[product-diagrams] archived ${path.basename(previous)}`);
  }
}

fs.writeFileSync(path.join(DIAGRAM_DIR, "01-ia.html"), makeIa());
fs.writeFileSync(path.join(DIAGRAM_DIR, "02-journey.html"), makeJourney());
console.log(`[product-diagrams] generated IA v${TARGET_VERSION} + user journey v${TARGET_VERSION}`);
