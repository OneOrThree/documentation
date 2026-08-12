# ARCHITECTURE.md

## Overview

This app is a generated ditto.site clone. The generator captured the source pages, normalized the rendered DOM into an IR, inferred assets/tokens/sections/recipes, and emitted a static Next.js App Router project.

## Structure

- `src/app/layout.tsx`: root App Router layout, language, metadata, viewport, JSON-LD, and shared shell.
- `src/app/page.tsx` and nested route `page.tsx` files: generated route bodies.
- `src/app/globals.css`: reset, font faces, design tokens, and global page base.
- `src/app/ditto.css`: route or page fidelity CSS.
- `src/app/content.ts`: editable data layer when repeated regions were promoted.
- `src/app/components/`, `src/app/sections/`, `src/app/svgs/`: generated JSX modules.
- `src/app/ditto/`: runtime helpers for interaction and motion recipes.
- `public/assets/cloned/`: materialized source assets.

## Styling

The generator uses Tailwind classes for declarations that can be represented as stable utilities. Some styles remain in `ditto.css` because they are route-scoped, pseudo-element based, keyframe based, interaction-state based, or too specific to translate safely without changing the rendered result.

## Anchors

`data-ditto-id` exists in delivered apps where runtime utilities or generated CSS still need a stable DOM anchor. Validation-only capture ids are stripped from production output and should not be reintroduced.

## Recipes And Runtime

Recipes identify higher-level patterns such as repeated cards, logo clouds, navigation, disclosures, accordions, tabs, carousels, and motion. Sections and components provide editable structure, SVG modules preserve source artwork, and `src/app/ditto` applies the small runtime behaviors that were captured safely. Runtime utilities emitted for this clone: none emitted for this capture.

## Clone Metadata

- routes: 15
- extracted components: 88
- section modules: 0
- SVG modules: 0
- content module: no
- component extraction requested: yes

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

## Tradeoffs

The clone prioritizes deterministic static fidelity, accessible markup, local asset materialization, and source metadata preservation. It may keep measured CSS where inferred layout intent is uncertain. It intentionally defers arbitrary JavaScript replay, video-like animation replay, and full third-party application behavior. External services, live personalization, analytics, payments, auth, and complex client app state are not reconstructed unless a specific safe recipe exists.
