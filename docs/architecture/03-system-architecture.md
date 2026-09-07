# 03. 시스템 구조 (System Architecture)

> **관점**: 런타임. 요청이 실제로 어떤 경로로 흐르고, 무엇이 비동기로 빠지는가.
> 실시간·AI·정산을 포함한 목표 시스템.

![gromo 시스템 구조](diagrams/03-system-architecture.drawio.svg)

> ⚠️ 위 이미지가 안 보이면 도면이 아직 안 들어온 것이다.
> [드롭인 규칙](README.md#도면-갱신-방법-드롭인-규칙)대로 `diagrams/03-system-architecture.drawio.svg` 를 넣으면 채워진다.

## 클라이언트 → 엣지

gromo App(React Native · iOS/Android)과 **iOS 스크린타임 익스텐션(Swift)**.
익스텐션이 사용량 리포트를 앱으로 올린다.

앱에서 나가는 경로는 세 갈래다.
- **정적 에셋** → CloudFront CDN
- **REST · JWT** → Load Balancer / API GW
- **WebSocket/STOMP** → 같은 LB (양방향)

## 애플리케이션 계층 · Spring Boot

| 컴포넌트 | 내용 | 상태 |
|---|---|---|
| REST API | Auth · User · ScreenTime · Focus · Group · Shop/Item · Currency | 확정 |
| WebSocket 서버 | 그룹 실시간 상태 · 콕찌르기 | **(예정)** |
| League 서비스 | 편성 · 랭킹 · 승강 | **(예정)** |
| Reward 서비스 | 코인 · Streak · 업적 · 챌린지 정산 | **(예정)** |
| Notification 서비스 | 편지 · 우편함 · 알림 | **(예정)** |

LB가 트래픽을 받는 건 REST와 WebSocket 서버 **둘뿐**이다. 나머지 셋(League·Reward·Notification)은
**요청이 아니라 큐와 스케줄러로 깨어난다** — 이게 이 도면의 핵심이다.

## 데이터 / 메시징

- **PostgreSQL** (primary + replica *예정*) — REST · League · Reward · Notification이 모두 붙음
- **Redis (예정)** — 캐시 · presence · 리그 랭킹 · **STOMP pub/sub**
- **메시지 큐 (예정)** — 세션종료 · 보상 · 알림 이벤트

## 비동기 경로

```
REST  ──세션 종료 이벤트──▶ MQ ──▶ Reward 서비스
WSrv  ──콕찌르기 이벤트───▶ MQ ──▶ Notification 서비스
```

집중 세션이 끝날 때 코인 정산을 **응답 경로 안에서 하지 않는다.** 이벤트만 던지고 응답을 끊는다.

## 스케줄

스케줄러 *(예정)* 가 셋을 돌린다 — **주간 리그 마감 · 주간 편지 발행 · 일일 코인 정산.**

## 외부 서비스

Kakao OAuth · Apple JWKS · AI/LLM *(예정)* · Push Worker *(예정)* → APNs/FCM → 앱 ·
S3(오브젝트 스토리지) → CloudFront.

## 관련

- [02. 애플리케이션 구조](02-application-architecture.md) — 같은 시스템의 도메인 관점
- [04. 클라우드 구조](04-cloud-architecture.md) — 이게 AWS 어디에 얹히는지
