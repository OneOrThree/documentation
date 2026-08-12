# AGENTS.md

This is a generated ditto.site clone app for https://poke-clip-architecture.vercel.app/. It is a static Next.js App Router project produced from captured DOM, CSS, assets, metadata, and interaction recipes.

## Run

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run start`

## Safe Edit Areas

- `src/app/content.ts` or `src/app/content.tsx`: editable structured content extracted from repeated components and sections when present.
- `src/app/components/`: generated component modules. Edit copy, links, and simple JSX structure with care.
- `src/app/sections/`: generated section modules for single-page section splits when present.
- `src/app/svgs/`: hoisted inline SVG modules. Edit only when intentionally changing artwork.
- `src/app/ditto.css`: fidelity CSS for captured layout, pseudos, keyframes, and interaction states. Small visual tweaks are reasonable; broad rewrites can break clone fidelity.
- Root SEO/docs files such as `AGENTS.md`, `ARCHITECTURE.md`, and `src/app/robots.ts`, `src/app/sitemap.ts`, and `src/app/llms.txt/route.ts`.

## Generated Runtime

`src/app/ditto` contains generated runtime utilities for captured interactions and motion. Current runtime utilities: none emitted for this capture. Do not casually rewrite these files; they are plumbing that maps captured recipes to stable `data-ditto-id` anchors in delivered apps.

## File Meanings

- `src/app/page.tsx` and nested route `page.tsx` files: generated route bodies.
- `src/app/content.ts`: structured data extracted from repeated clone regions.
- `src/app/components/`: reusable JSX components promoted from repeated captured subtrees.
- `src/app/sections/`: page sections split from the captured body.
- `src/app/svgs/`: inline SVGs hoisted out of page/section files.
- `src/app/ditto.css`: generated CSS that preserves source layout and visual details not represented by Tailwind utilities.
- `src/app/ditto-meta.ts`: delivered-app metadata for anchors that still need runtime or stylesheet targeting after validation-only ids are stripped.

## Routes

- / - PokeClip — 아키텍처
- /adr - 설계 결정 — ADR 현황판 · PokeClip 아키텍처
- /dataflow - 데이터 플로우 · PokeClip 아키텍처
- /m1 - M1 수직 슬라이스 실행 계획 · PokeClip 아키텍처
- /research - 하이라이트 탐지 연구 노트 · PokeClip 아키텍처
- /roles - 역할 분담 · PokeClip 아키텍처
- /spec - 기능 명세서 · PokeClip 아키텍처
- /web-ia - 웹 IA · PokeClip 아키텍처
- /adr/ADR-001_-EC-86-A1-EC-B6-9C-ED-94-84-EB-A1-9C-ED-86-A0-EC-BD-9C - ADR-001 송출 프로토콜 — SRT + MPEG-TS (본방과 동시 송출) · PokeClip 아키텍처
- /diagrams/0 - 0 유스케이스 · PokeClip 아키텍처
- /diagrams/1 - 1 IA · 정보 구조 · PokeClip 아키텍처
- /diagrams/2 - 2 유저 저니 · PokeClip 아키텍처
- /diagrams/3 - 3 서비스 아키텍처 · PokeClip 아키텍처
- /diagrams/4 - 4 시스템 아키텍처 · PokeClip 아키텍처
- /diagrams/5 - 5 클라우드 아키텍처 · AWS · PokeClip 아키텍처

## Do Not Edit Casually

- `src/app/ditto/` runtime utilities.
- Generated anchor metadata such as `ditto-meta.ts`.
- Validation-only files in working captures, including `_cids.ts` and `_styles.ts` before export stripping.
- Framework shell plumbing unless you are intentionally changing global metadata or page mounting behavior.
