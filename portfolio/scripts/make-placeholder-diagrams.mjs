#!/usr/bin/env node
/**
 * Generate placeholder diagram pairs (.drawio.xml + .svg) from a compact spec.
 *
 * THROWAWAY SCAFFOLDING. Real diagrams come from Google Drive as a draw.io
 * export pair; delete this script once they land. It exists because six
 * hand-written XML/SVG pairs that must agree cell-for-cell is a good way to
 * ship a diagram whose graph silently fails to join.
 *
 *   node scripts/make-placeholder-diagrams.mjs
 *
 * The emitted SVG deliberately mimics draw.io's export shape — `data-cell-id`
 * on each cell group, no edge connectivity — so `build-diagrams.mjs` is
 * exercised on the same input it will see in production.
 */

import fs from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "diagrams");

const FONT = "Pretendard, 'Apple SD Gothic Neo', system-ui, sans-serif";
const STROKE = "#4a4a52";
const EDGE = "#8a8a93";
const INK = "#1b1b20";
const SUB = "#6b6b74";

/** @typedef {{id:string,label:string,sub?:string,x:number,y:number,w:number,h:number}} Node */
/** @typedef {{id:string,from:string,to:string,label?:string,dashed?:boolean}} Edge */

const DIAGRAMS = [
  {
    id: "00-usecase",
    name: "유스케이스",
    axis: "h",
    size: [880, 520],
    nodes: [
      { id: "actor-user", label: "사용자", x: 40, y: 210, w: 150, h: 56 },
      { id: "uc-auth", label: "회원가입 · 로그인", x: 310, y: 60, w: 230, h: 56 },
      { id: "uc-upload", label: "영상 업로드", x: 310, y: 150, w: 230, h: 56 },
      { id: "uc-map", label: "지도 조회", x: 310, y: 240, w: 230, h: 56 },
      { id: "uc-notify", label: "알림 수신", x: 310, y: 330, w: 230, h: 56 },
      { id: "uc-review", label: "콘텐츠 검수", x: 310, y: 420, w: 230, h: 56 },
      { id: "actor-admin", label: "관리자", x: 670, y: 420, w: 150, h: 56 },
      { id: "ext-oauth", label: "Google OAuth", x: 670, y: 60, w: 150, h: 56 },
    ],
    edges: [
      { id: "e-u-auth", from: "actor-user", to: "uc-auth" },
      { id: "e-u-upload", from: "actor-user", to: "uc-upload" },
      { id: "e-u-map", from: "actor-user", to: "uc-map" },
      { id: "e-u-notify", from: "actor-user", to: "uc-notify" },
      { id: "e-admin-review", from: "actor-admin", to: "uc-review" },
      { id: "e-auth-oauth", from: "uc-auth", to: "ext-oauth", label: "위임" },
    ],
  },
  {
    id: "01-ia",
    name: "IA · 정보 구조",
    axis: "v",
    size: [880, 500],
    nodes: [
      { id: "home", label: "홈", x: 370, y: 40, w: 150, h: 52 },
      { id: "map", label: "지도", x: 60, y: 180, w: 150, h: 52 },
      { id: "book", label: "도감", x: 250, y: 180, w: 150, h: 52 },
      { id: "mission", label: "미션", x: 440, y: 180, w: 150, h: 52 },
      { id: "mypage", label: "마이페이지", x: 630, y: 180, w: 170, h: 52 },
      { id: "map-cell", label: "격자 상세", x: 40, y: 320, w: 150, h: 48 },
      { id: "book-stat", label: "수집 현황", x: 230, y: 320, w: 150, h: 48 },
      { id: "mission-course", label: "코스 상세", x: 420, y: 320, w: 150, h: 48 },
      { id: "my-settings", label: "설정", x: 630, y: 320, w: 170, h: 48 },
      { id: "my-inbox", label: "알림함", x: 630, y: 400, w: 170, h: 48 },
    ],
    edges: [
      { id: "e-home-map", from: "home", to: "map" },
      { id: "e-home-book", from: "home", to: "book" },
      { id: "e-home-mission", from: "home", to: "mission" },
      { id: "e-home-mypage", from: "home", to: "mypage" },
      { id: "e-map-cell", from: "map", to: "map-cell" },
      { id: "e-book-stat", from: "book", to: "book-stat" },
      { id: "e-mission-course", from: "mission", to: "mission-course" },
      { id: "e-my-settings", from: "mypage", to: "my-settings" },
      { id: "e-my-inbox", from: "mypage", to: "my-inbox" },
    ],
  },
  {
    id: "02-journey",
    name: "유저 저니",
    axis: "h",
    size: [880, 400],
    nodes: [
      { id: "j1", label: "앱 설치", x: 40, y: 70, w: 170, h: 56 },
      { id: "j2", label: "로그인", x: 250, y: 70, w: 170, h: 56 },
      { id: "j3", label: "위치 확인", x: 460, y: 70, w: 170, h: 56 },
      { id: "j4", label: "영상 촬영", x: 670, y: 70, w: 170, h: 56 },
      { id: "j5", label: "업로드", sub: "presigned", x: 670, y: 240, w: 170, h: 56 },
      { id: "j6", label: "인코딩 대기", x: 460, y: 240, w: 170, h: 56 },
      { id: "j7", label: "격자 점령", x: 250, y: 240, w: 170, h: 56 },
      { id: "j8", label: "알림 수신", x: 40, y: 240, w: 170, h: 56 },
    ],
    edges: [
      { id: "e-j1-j2", from: "j1", to: "j2" },
      { id: "e-j2-j3", from: "j2", to: "j3" },
      { id: "e-j3-j4", from: "j3", to: "j4" },
      { id: "e-j4-j5", from: "j4", to: "j5", axis: "v" },
      { id: "e-j5-j6", from: "j5", to: "j6", label: "비동기", dashed: true },
      { id: "e-j6-j7", from: "j6", to: "j7" },
      { id: "e-j7-j8", from: "j7", to: "j8", label: "푸시" },
    ],
  },
  {
    id: "03-service",
    name: "서비스 아키텍처",
    axis: "h",
    size: [880, 460],
    nodes: [
      { id: "client", label: "모바일 앱", x: 40, y: 190, w: 150, h: 60 },
      { id: "api", label: "API 서버", sub: "Spring Boot", x: 280, y: 190, w: 170, h: 60 },
      { id: "worker", label: "인코딩 워커", x: 540, y: 190, w: 170, h: 60 },
      { id: "db", label: "PostgreSQL", x: 280, y: 60, w: 170, h: 56 },
      { id: "cache", label: "Redis", x: 280, y: 330, w: 170, h: 56 },
      { id: "storage", label: "S3", x: 540, y: 330, w: 170, h: 56 },
    ],
    edges: [
      { id: "e-client-api", from: "client", to: "api", label: "HTTPS" },
      { id: "e-api-db", from: "api", to: "db", axis: "v" },
      { id: "e-api-cache", from: "api", to: "cache", axis: "v" },
      { id: "e-api-worker", from: "api", to: "worker", label: "큐", dashed: true },
      { id: "e-api-storage", from: "api", to: "storage", label: "presigned" },
      { id: "e-worker-storage", from: "worker", to: "storage", axis: "v" },
      { id: "e-worker-db", from: "worker", to: "db", dashed: true, axis: "v" },
    ],
  },
  {
    id: "04-system",
    name: "시스템 아키텍처",
    axis: "v",
    size: [880, 560],
    nodes: [
      { id: "app", label: "모바일 앱", x: 80, y: 50, w: 180, h: 56 },
      { id: "dash", label: "웹 대시보드", x: 300, y: 50, w: 180, h: 56 },
      { id: "gw", label: "API Gateway", x: 190, y: 180, w: 200, h: 56 },
      { id: "svc-auth", label: "인증 서비스", x: 40, y: 310, w: 170, h: 56 },
      { id: "svc-core", label: "코어 API", x: 250, y: 310, w: 170, h: 56 },
      { id: "svc-media", label: "미디어 워커", x: 460, y: 310, w: 170, h: 56 },
      { id: "db", label: "PostgreSQL", x: 40, y: 450, w: 180, h: 56 },
      { id: "cache", label: "Redis", x: 260, y: 450, w: 170, h: 56 },
      { id: "obj", label: "S3", x: 470, y: 450, w: 170, h: 56 },
    ],
    edges: [
      { id: "e-app-gw", from: "app", to: "gw" },
      { id: "e-dash-gw", from: "dash", to: "gw" },
      { id: "e-gw-auth", from: "gw", to: "svc-auth" },
      { id: "e-gw-core", from: "gw", to: "svc-core" },
      { id: "e-core-media", from: "svc-core", to: "svc-media", label: "큐", dashed: true, axis: "h" },
      { id: "e-auth-db", from: "svc-auth", to: "db" },
      { id: "e-core-cache", from: "svc-core", to: "cache" },
      { id: "e-media-obj", from: "svc-media", to: "obj" },
    ],
  },
  {
    id: "05-cloud",
    name: "클라우드 아키텍처 · AWS",
    axis: "v",
    size: [880, 560],
    nodes: [
      { id: "cf", label: "CloudFront", x: 50, y: 50, w: 180, h: 56 },
      { id: "alb", label: "ALB", x: 290, y: 50, w: 170, h: 56 },
      { id: "ecs-api", label: "ECS Fargate", sub: "API", x: 290, y: 190, w: 170, h: 60 },
      { id: "sqs", label: "SQS", x: 530, y: 190, w: 170, h: 60 },
      { id: "ecs-worker", label: "ECS Fargate", sub: "Worker", x: 530, y: 330, w: 170, h: 60 },
      { id: "rds", label: "RDS", sub: "PostgreSQL", x: 50, y: 330, w: 180, h: 60 },
      { id: "ec", label: "ElastiCache", sub: "Redis", x: 290, y: 330, w: 180, h: 60 },
      { id: "s3", label: "S3", x: 290, y: 460, w: 170, h: 56 },
      { id: "cw", label: "CloudWatch", x: 530, y: 460, w: 170, h: 56 },
    ],
    edges: [
      { id: "e-cf-alb", from: "cf", to: "alb", axis: "h" },
      { id: "e-alb-ecs", from: "alb", to: "ecs-api" },
      { id: "e-ecs-sqs", from: "ecs-api", to: "sqs", dashed: true, axis: "h" },
      { id: "e-sqs-worker", from: "sqs", to: "ecs-worker", dashed: true },
      { id: "e-ecs-rds", from: "ecs-api", to: "rds" },
      { id: "e-ecs-ec", from: "ecs-api", to: "ec" },
      { id: "e-worker-s3", from: "ecs-worker", to: "s3" },
      { id: "e-worker-cw", from: "ecs-worker", to: "cw" },
    ],
  },
];

/* -------------------------------------------------------------------------- */

const cx = (n) => n.x + n.w / 2;
const cy = (n) => n.y + n.h / 2;

/**
 * Orthogonal Z-route between two boxes, leaving and entering facing sides.
 *
 * The axis is declared, not inferred. Picking the dominant centre-distance
 * looks right for a row of use cases beside an actor and wrong for a tree: in
 * an IA tree the parent sits above a wide row of children, so "dx is larger"
 * routed `홈 → 지도` sideways into the child's right edge and the arrow read
 * backwards. Layout intent is not recoverable from coordinates.
 */
function route(a, b, axis) {
  const [ax, ay, bx, by] = [cx(a), cy(a), cx(b), cy(b)];
  const dx = bx - ax;
  const dy = by - ay;

  if (axis === "h") {
    const x1 = dx > 0 ? a.x + a.w : a.x;
    const x2 = dx > 0 ? b.x : b.x + b.w;
    const mid = (x1 + x2) / 2;
    return {
      d: `M ${x1} ${ay} L ${mid} ${ay} L ${mid} ${by} L ${x2} ${by}`,
      label: [mid, (ay + by) / 2],
      straight: Math.abs(by - ay) < 6,
    };
  }

  const y1 = dy > 0 ? a.y + a.h : a.y;
  const y2 = dy > 0 ? b.y : b.y + b.h;
  const mid = (y1 + y2) / 2;
  return {
    d: `M ${ax} ${y1} L ${ax} ${mid} L ${bx} ${mid} L ${bx} ${y2}`,
    label: [(ax + bx) / 2, mid],
    straight: Math.abs(bx - ax) < 6,
  };
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function toXml(spec) {
  const cells = [];

  for (const n of spec.nodes) {
    const value = n.sub ? `${n.label}&lt;br&gt;${n.sub}` : n.label;
    cells.push(
      `        <mxCell id="${n.id}" value="${esc(n.label) === n.label ? value : value}" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">\n` +
        `          <mxGeometry x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" as="geometry" />\n` +
        `        </mxCell>`,
    );
  }

  for (const e of spec.edges) {
    const style = `edgeStyle=orthogonalEdgeStyle;html=1;${e.dashed ? "dashed=1;" : ""}`;
    cells.push(
      `        <mxCell id="${e.id}" value="${esc(e.label ?? "")}" style="${style}" edge="1" parent="1" source="${e.from}" target="${e.to}">\n` +
        `          <mxGeometry relative="1" as="geometry" />\n` +
        `        </mxCell>`,
    );
  }

  return `<mxfile host="app.diagrams.net" agent="portfolio-placeholder" version="24.7.17">
  <diagram id="${spec.id}" name="${esc(spec.name)}">
    <mxGraphModel dx="1100" dy="700" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${spec.size[0]}" pageHeight="${spec.size[1]}" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
${cells.join("\n")}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`;
}

function toSvg(spec) {
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  const parts = [];

  for (const e of spec.edges) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    const { d, label, straight } = route(a, b, e.axis ?? spec.axis ?? "h");
    const dash = e.dashed ? ` stroke-dasharray="5 4"` : "";
    let g =
      `<g data-cell-id="${e.id}">\n` +
      `<g><path d="${d}" fill="none" stroke="${EDGE}" stroke-width="1.4"${dash} marker-end="url(#dg-arrow)" pointer-events="stroke"/></g>\n`;
    if (e.label) {
      // On a straight run the gap between two boxes can be narrower than the
      // label, so masking the line puts the text on top of the arrowhead. Lift
      // it clear instead; a bent route has room and reads better masked.
      g += straight
        ? `<g><text x="${label[0]}" y="${label[1] - 7}" text-anchor="middle" font-size="11" fill="${SUB}">${esc(e.label)}</text></g>\n`
        : `<g><rect x="${label[0] - (e.label.length * 7 + 10) / 2}" y="${label[1] - 8}" width="${e.label.length * 7 + 10}" height="16" fill="#ffffff" stroke="none"/>` +
          `<text x="${label[0]}" y="${label[1] + 4}" text-anchor="middle" font-size="11" fill="${SUB}">${esc(e.label)}</text></g>\n`;
    }
    parts.push(g + `</g>`);
  }

  for (const n of spec.nodes) {
    const tx = cx(n);
    const text = n.sub
      ? `<text x="${tx}" y="${cy(n) - 3}" text-anchor="middle" font-size="13" fill="${INK}">${esc(n.label)}</text>` +
        `<text x="${tx}" y="${cy(n) + 15}" text-anchor="middle" font-size="11" fill="${SUB}">${esc(n.sub)}</text>`
      : `<text x="${tx}" y="${cy(n) + 5}" text-anchor="middle" font-size="13" fill="${INK}">${esc(n.label)}</text>`;

    parts.push(
      `<g data-cell-id="${n.id}">\n` +
        `<g><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="9" ry="9" fill="#ffffff" stroke="${STROKE}" stroke-width="1.4" pointer-events="all"/></g>\n` +
        `<g>${text}</g>\n` +
        `</g>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${spec.size[0]}px" height="${spec.size[1]}px" viewBox="0 0 ${spec.size[0]} ${spec.size[1]}" style="background-color: rgb(255, 255, 255);">
<defs>
<marker id="dg-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3.4" orient="auto" markerUnits="userSpaceOnUse">
<path d="M 1 1 L 8 3.4 L 1 5.8 z" fill="${EDGE}" stroke="none"/>
</marker>
</defs>
<g font-family="${FONT}">
<g data-cell-id="0">
<g data-cell-id="1">
${parts.join("\n")}
</g>
</g>
</g>
</svg>
`;
}

fs.mkdirSync(OUT, { recursive: true });
for (const spec of DIAGRAMS) {
  fs.writeFileSync(path.join(OUT, `${spec.id}.drawio.xml`), toXml(spec));
  fs.writeFileSync(path.join(OUT, `${spec.id}.svg`), toSvg(spec));
  console.log(
    `[placeholder] ${spec.id}: ${spec.nodes.length} nodes, ${spec.edges.length} edges`,
  );
}
