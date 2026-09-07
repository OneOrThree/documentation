# 04. 클라우드 구조 (Cloud Architecture · AWS)

> **관점**: 배포. 코드가 사용자 단말까지 가는 경로와, 그게 얹히는 AWS 리소스.
> **근거**: `cd.yml`(백엔드 Docker → AWS 배포) · `testflight.yml`(EAS → TestFlight) · S3/CloudFront.

![gromo 클라우드 구조](diagrams/04-cloud-architecture.drawio.svg)

> ⚠️ 위 이미지가 안 보이면 도면이 아직 안 들어온 것이다.
> [드롭인 규칙](README.md#도면-갱신-방법-드롭인-규칙)대로 `diagrams/04-cloud-architecture.drawio.svg` 를 넣으면 채워진다.

## CI/CD — 두 파이프라인이 갈린다

```
GitHub ──GitHub Actions: cd.yml──▶ ECR(백엔드 이미지) ──▶ ECS/Fargate
GitHub ──EAS Build → testflight.yml──▶ App Store / TestFlight ──▶ 사용자 단말
```

**서버와 앱이 서로 다른 배포 경로를 탄다.** 서버는 이미지로 굴러가고, 앱은 스토어 심사를 통과해야
사용자에게 닿는다 — 릴리스 시점을 맞출 수 없다는 뜻이고, 이게 API 하위호환을 강제한다.

## 트래픽 경로

사용자 단말 → **Route 53** → 두 갈래
- → **CloudFront** ← S3 (에셋 · 갓생카드)
- → **ALB** → VPC 안의 ECS

## VPC · Multi-AZ

| AZ | 구성 |
|---|---|
| **A** | ECS/Fargate (Spring Boot · REST + WS) · **RDS PostgreSQL primary** · ElastiCache Redis *(예정)* |
| **B** | ECS/Fargate (Spring Boot · REST + WS) · **RDS PostgreSQL standby** |

- ALB가 두 AZ의 ECS로 분산한다.
- **쓰기는 양쪽 ECS 모두 AZ-A의 primary RDS로 간다.** standby는 복제 대상일 뿐 트래픽을 안 받는다.
- **SQS (예정)** — 이벤트 큐
- **EventBridge Scheduler (예정)** — 리그 마감 · 주간편지 · 코인정산

## 외부 연동

ECS에서 나간다 — Kakao · Apple · AI/LLM API *(예정)* · APNs/FCM · S3.

## 관련

- [03. 시스템 구조](03-system-architecture.md) — 이 리소스 위에서 도는 런타임
