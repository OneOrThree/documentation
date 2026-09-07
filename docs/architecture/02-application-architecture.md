# 02. 애플리케이션 구조 (Application Architecture)

> **관점**: 프론트엔드 ↔ 도메인별 API/서비스 ↔ 데이터 계층 · 외부 서비스.
> **근거**: 기능명세 + 선언된 스택(RN/Expo · Spring Boot · PostgreSQL · JWT · WebSocket/STOMP · S3/CloudFront).

![gromo 애플리케이션 구조](diagrams/02-application-architecture.drawio.svg)

> ⚠️ 위 이미지가 안 보이면 도면이 아직 안 들어온 것이다.
> [드롭인 규칙](README.md#도면-갱신-방법-드롭인-규칙)대로 `diagrams/02-application-architecture.drawio.svg` 를 넣으면 채워진다.

## 프론트엔드 · React Native / Expo

- **화면** — 온보딩 · 홈 · 그룹/리그 · 집중 · 상점 · 마이
- **전역 상태 (Context)** — User · Coin · Equipment · Focus
- **iOS 스크린타임 익스텐션 (Swift · FamilyControls)** — RN 밖의 네이티브 조각.
  앱 본체가 아니라 **익스텐션이 사용량 리포트를 만들어 앱으로 넘긴다.**

## 백엔드 · Spring Boot (도메인별 API/Service)

| API | 책임 | 상태 |
|---|---|---|
| Auth | Kakao/Apple/게스트 로그인 · 토큰 갱신/로그아웃 | 확정 |
| User | 프로필 설정/수정 · 목표 | 확정 |
| ScreenTime | 리포트 수집 · 통계 | 확정 |
| Focus | 카테고리 · 세션 시작/종료 · 누적 | 확정 |
| Group | 그룹 CRUD · 참가 · 그룹원 · 챌린지 | 확정 |
| Item/Shop · Inventory · Equipment · Currency | 상점 · 보유 · 장착 · 코인 | 확정 |
| League | 자동 편성 · 주간 랭킹 · 티어 승강 | **(예정)** |
| Reward | 코인 지급(집중·목표·Streak·챌린지) · 업적 | **(예정)** |
| Notification/Letter | AI 주간편지 · 우편함 · 콕찌르기 | **(예정)** |
| Realtime (WebSocket/STOMP) | 그룹 집중 실시간 상태 · 콕찌르기 | **일부 (예정)** |

## 데이터 계층

- **PostgreSQL** — 위 모든 API의 영속 저장소
- **Redis (예정)** — 캐시 · presence · 리그 랭킹

## 외부 서비스 / 인프라

Kakao OAuth · Apple Sign-In(JWKS) · **S3 + CloudFront**(아이템 에셋 · 갓생카드) ·
Push APNs/FCM *(예정)* · AI/LLM *(예정, 목표 추천 + 주간 편지 생성)* ·
스케줄러 *(예정, 리그 마감 · 주간편지 · 코인 정산)*.

## 흐름에서 눈여겨볼 것

- 화면 → 백엔드는 전부 **REST + JWT**. 예외가 하나 — **그룹 실시간 세션만 WebSocket 양방향**이다.
- 스크린타임은 화면이 아니라 **네이티브 익스텐션 → ScreenTime API** 로 따로 들어온다.
- **AI는 두 군데서 불린다** — User(목표 추천), Notification(편지 생성).
- **스케줄러가 League · Notification · Reward 셋을 깨운다.** 이 셋이 전부 `(예정)`이라
  비동기 정산 라인 전체가 아직 안 서 있다는 뜻이다.

## 관련

- [01. 정보 구조](01-information-architecture.md) — 어느 화면이 이 API를 부르는지
- [03. 시스템 구조](03-system-architecture.md) — 같은 그림의 런타임 관점
