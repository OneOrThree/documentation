# AGENTS.md

This is a generated ditto.site clone app for https://fillmap-docs.vercel.app/. It is a static Next.js App Router project produced from captured DOM, CSS, assets, metadata, and interaction recipes.

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

- / - FillMap 문서
- /adr - 설계 결정 기록 · FillMap 문서
- /prd - 제품 요구사항 · FillMap 문서
- /research - 연구 노트 · FillMap 문서
- /spec - 설계와 명세 · FillMap 문서
- /dataflow - 데이터플로우 · FillMap 문서
- /roles - 역할 분담 · FillMap 문서
- /status - 구현 현황 · FillMap 문서
- /diagrams/0 - 0 유스케이스 · FillMap 문서
- /prd/msg-178-prd - MSG-178 알림 시스템 — FCM 푸시 파이프라인 (공유 PRD) · FillMap 문서
- /spec/EA-B0-9C-EC-9D-B8-EB-8F-84-EA-B0-90-ED-99-94-EB-A9-B4-ED-99-95-EC-A0-95-ux-api-EC-84-A4-EA-B3-84 - 개인 도감 화면 — 확정 UX·API 설계 (수집률/탐험률) · FillMap 문서
- /adr/EA-B8-B0-ED-9A-8D-ED-99-95-EC-A0-95-EC-A7-80-EB-8F-84-ED-99-88-EA-B0-9C-ED-8E-B8-EC-83-81-EB-8B-A8-EC-85-80 - 기획확정 — 지도 홈 개편 (디폴트 개인 모드 + 상단 셀 4종) · FillMap 문서
- /adr/EB-AF-B8-EC-85-98-ED-9B-84-EC-86-8D-EA-B2-B0-EC-A0-95-EC-BD-94-EC-8A-A4-ED-8F-AC-ED-86-A0-EC-8A-A4-ED-8C-9F-EB-B0-A9-EC-8B-9D - 미션 후속 결정 — 코스 포토스팟 방식·판정 보충 · FillMap 문서
- /adr/adr-EA-B2-A9-EC-9E-90-ED-91-9C-EC-8B-9C-EB-AA-85-zone - ADR — 격자 표시명 체계 (수동 지정 구역 zone + 격자 좌표 산술) · FillMap 문서
- /adr/adr-EA-B2-A9-EC-9E-90-ED-96-89-EC-A0-95-EB-8F-99-EB-9D-BC-EB-B2-A8-gridsregioncode - ADR 격자 행정동 라벨 — grids.region_code 저장 (MSG-167) · FillMap 문서
- /adr/adr-EC-98-81-EC-86-8D-EA-B3-84-EC-B8-B5-jpa-EC-9C-A0-EC-A7-80-mybatis-EC-A0-84-ED-99-98-EB-B0-98-EB-A0-A4 - ADR — 영속 계층 JPA 유지 (MyBatis 전환 반려) · FillMap 문서
- /adr/adr-EC-9E-A5-EC-86-8C-EA-B2-80-EC-83-89-EC-B9-B4-EC-B9-B4-EC-98-A4-EB-A1-9C-EC-BB-AC-ED-94-84-EB-A1-9D-EC-8B-9C - ADR 장소 검색 — 카카오 로컬 프록시 (MSG-251) · FillMap 문서
- /adr/adr-EC-A7-80-EB-8F-84-sdk-EB-84-A4-EC-9D-B4-EB-B2-84-EC-A0-84-ED-99-98 - ADR — 지도 SDK를 카카오에서 네이버로 전환 · FillMap 문서
- /adr/adr-ai-EC-B2-98-EB-A6-AC-EC-8B-A4-ED-96-89-ED-99-98-EA-B2-BD-fastapi - ADR — AI 처리 실행 환경, 상시 FastAPI 서버 (MSG-143) · FillMap 문서
- /adr/adr-msg-167-ED-9B-84-EC-86-8D-EA-B2-B0-EC-A0-95-ED-83-90-ED-97-98-EB-A5-A0-EC-B6-95-EA-B2-A9-EC-9E-90-ED-91-9C-EC-8B-9C-EB-AA-85-EA-B2-A9-EC-9E-90-EA-B3-84-EC-95-BD - ADR MSG-167 후속 결정 — 라벨 저장 위치 Q&A · 탐험률 축 · 격자 표시명 · FE 격자 계약 · FillMap 문서
- /adr/adr-regionstats-recompute-equi-join-EC-B9-98-ED-99-98 - ADR region_stats recompute equi-join 치환 (MSG-236) · FillMap 문서
- /adr/adr-viewport-polling-slo - ADR — viewport 전송방식 polling · 부하 SLO·임계점 (MSG-134) · FillMap 문서
- /adr/fillmap-ED-99-95-EC-A0-95-EA-B8-B0-ED-9A-8D-EB-AA-A8-EC-9D-8C - FillMap 확정 기획 모음 (허브) · FillMap 문서
- /adr/msg-234-EC-83-81-EA-B6-8C-EC-9E-91-EB-8F-84-EA-B2-B0-EC-A0-95-EA-B3-B5-EA-B3-B5-EB-8D-B0-EC-9D-B4-ED-84-B0-EA-B2-80-EC-88-98 - MSG-234 상권 작도 결정 — 그리지 않고, 그려진 것을 검수한다 · FillMap 문서
- /embeds/grid-occupation-trouble.html - 트러블슈팅: 파일 없이 격자를 점령할 수 있었던 이유 — MSG-132
- /embeds/hotzone-load-test.html - 핫구역 조회 부하 측정 (MSG-321)
- /embeds/notification-system.html - 알림 시스템: 설계와 고쳐 온 것들 (MSG-178~181 · 313~315)
- /embeds/playback-flow.html - FillMap 인코딩 워커 — MSG-65
- /embeds/redis-hotzone.html - FillMap Redis 핫구역 구현, 코드에서 응답까지
- /embeds/upload-flow.html - FillMap 영상 업로드 플로우 — MSG-64 + MSG-66
- /research/EA-B0-AD-EB-B6-84-EC-84-9D-EB-94-94-EC-9E-90-EC-9D-B8-EB-AC-B8-EC-84-9C-EC-BD-94-EB-93-9C-EC-8B-B1-ED-81-AC - 갭 분석 — 디자인 ↔ 문서·코드 싱크 (2026-07-17) · FillMap 문서
- /research/EB-B0-B1-EC-97-94-EB-93-9C-ED-95-99-EC-8A-B5-EB-A1-9C-EB-93-9C-EB-A7-B5-redis-ha-EC-95-8C-EB-A6-BC-EA-B4-80-EC-B8-A1-EC-84-B1 - 백엔드 학습 로드맵 — Redis HA · 대규모 알림 · 관측성 (멘토링 08-01 후속) · FillMap 문서
- /research/EB-B6-84-EC-82-B0-EB-9D-BD-EC-A0-81-EC-9A-A9-EC-A3-BC-EC-9D-98-EC-A0-90 - 분산락 적용 주의점 (그라운드 플립 사례) · FillMap 문서
- /research/EC-A0-84-EA-B5-AD-EB-AC-B8-ED-99-94-EC-B6-95-EC-A0-9C-ED-91-9C-EC-A4-80-EB-8D-B0-EC-9D-B4-ED-84-B0-EB-8D-B0-EC-9D-B4-ED-84-B0-EC-85-8B - 전국문화축제표준데이터 데이터셋 · FillMap 문서
- /research/ED-8A-B8-EB-9F-AC-EB-B8-94-EC-8A-88-ED-8C-85-ED-8C-8C-EC-9D-BC-EC-97-86-EC-9D-B4-EA-B2-A9-EC-9E-90-EC-A0-90-EB-A0-B9-msg-132 - 트러블슈팅 — 파일 없이 격자를 점령할 수 있었던 이유 (MSG-132) · FillMap 문서
- /research/2026-07-21-ai-highlight-blur-EA-B0-9C-EB-B0-9C-EA-B8-B0-EB-A1-9D - AI Highlight-Blur 개발 기록 — 레포 생성부터 dev 배포까지 · FillMap 문서
- /research/ai-EB-B8-94-EB-9F-AC-ED-8C-8C-EC-9D-B4-ED-94-84-EB-9D-BC-EC-9D-B8-EC-8B-A4-EC-B8-A1-ED-98-84-ED-99-A9 - AI 블러 파이프라인 — 모델·처리 시간 실측 현황 · FillMap 문서
- /research/erd-EC-A0-95-EB-A0-AC-EB-94-94-EC-9E-90-EC-9D-B8-EA-B8-B0-EC-A4-80-EB-8D-B0-EC-9D-B4-ED-84-B0-EB-AA-A8-EB-8D-B8 - ERD 정렬 — 디자인 기준 데이터모델 결정 (현재 스키마 + 변경 집약) · FillMap 문서
- /research/zone-EC-83-81-EA-B6-8C-EA-B3-B5-EA-B3-B5-EB-8D-B0-EC-9D-B4-ED-84-B0-EA-B7-BC-EA-B1-B0 - zone 상권 데이터 — 왜 공공데이터를 쓰나 (출처·이유·한계) · FillMap 문서
- /research/zone-ED-91-9C-EC-8B-9C-EB-AA-85-EB-8D-B0-EC-9D-B4-ED-84-B0-ED-8C-8C-EC-9D-B4-ED-94-84-EB-9D-BC-EC-9D-B8-ED-95-B4-EC-84-A4 - zone 표시명 데이터 파이프라인 해설 — 공공데이터에서 "서면 A-14"까지 · FillMap 문서
- /status/project - 프로젝트 개요 · 기술 스택 · FillMap 문서
- /status/status - 구현 현황 · FillMap 문서

## Do Not Edit Casually

- `src/app/ditto/` runtime utilities.
- Generated anchor metadata such as `ditto-meta.ts`.
- Validation-only files in working captures, including `_cids.ts` and `_styles.ts` before export stripping.
- Framework shell plumbing unless you are intentionally changing global metadata or page mounting behavior.
