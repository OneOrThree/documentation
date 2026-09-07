# gromo 아키텍처

gromo(집중 시간 관리 + 캐릭터 커스터마이징 · RN/Expo + Spring Boot + PostgreSQL)의
아키텍처 문서 4종. **현재 코드 구현 상태가 아니라, 기능명세가 정의한 "완성된 gromo"의 목표 아키텍처**다.

| # | 문서 | 관점 | 도면 파일 (드롭인 경로) |
|---|---|---|---|
| 01 | [정보 구조](01-information-architecture.md) | 화면·기능 맵 — 사용자가 밟는 경로 | `diagrams/01-information-architecture.drawio.svg` |
| 02 | [애플리케이션 구조](02-application-architecture.md) | 프론트 ↔ 도메인 API/서비스 ↔ 데이터·외부 | `diagrams/02-application-architecture.drawio.svg` |
| 03 | [시스템 구조](03-system-architecture.md) | 런타임 — REST + WebSocket, DB/Redis/큐, 스케줄러 | `diagrams/03-system-architecture.drawio.svg` |
| 04 | [클라우드 구조](04-cloud-architecture.md) | AWS 배포 — ECS/RDS/CloudFront + CI·CD | `diagrams/04-cloud-architecture.drawio.svg` |

---

## 도면 갱신 방법 (드롭인 규칙)

**도면을 고칠 때 이 레포에서 편집하지 않는다.** draw.io에서 고치고, 내보낸 파일 하나를
`diagrams/` 아래 **같은 이름으로 덮어쓰기**만 하면 된다. 머지되면 그대로 배포된다.

1. draw.io(데스크톱 또는 [app.diagrams.net](https://app.diagrams.net))에서 도면을 연다.
2. 수정한다.
3. **File → Export as → SVG…** 에서 아래 두 개를 반드시 체크한다.
   - ✅ **Include a copy of my diagram** — 편집 가능한 원본 XML이 SVG 안에 박힌다
   - ✅ **Transparent Background** (선택 — 다크모드에서 흰 판때기가 안 생긴다)
4. 파일명을 위 표의 이름 그대로 맞춘다. (`01-information-architecture.drawio.svg` 등)
5. `docs/architecture/diagrams/` 에 **덮어쓴다.** 커밋 → PR → 머지.

### 왜 `.drawio.svg` 한 파일인가

`Include a copy of my diagram`을 켜고 내보낸 SVG는 **보이는 그림이자 편집 가능한 원본**이다.
draw.io로 그 SVG를 다시 열면 도형 그대로 편집된다.

- `.drawio`(원본) + `.png`(표시용) 를 따로 두면 **둘이 갈라진다** — 누군가 PNG만 갈아끼우면 원본이 죽는다.
- SVG는 GitHub과 웹에서 그대로 렌더링되고, 확대해도 안 깨지고, 텍스트가 검색된다.

### 덮어쓰기 주의

브라우저는 같은 이름 파일이 이미 있으면 `01-information-architecture (1).drawio.svg` 로 받는다.
**`(1)` 붙은 채로 커밋하면 문서의 이미지 링크가 안 붙는다.** 받은 뒤 이름부터 확인하고 덮어쓸 것.

---

## 도면 읽는 법 (4종 공통 범례)

| 표기 | 뜻 |
|---|---|
| **노란 점선 박스 `(예정)`** | 명세상 완성형에 필요하나 **현재 코드 미구현** |
| 흰 박스 | 현 코드·스택에 근거가 있는 **확정** 컴포넌트 |
| 파랑 원통 | DB (PostgreSQL / RDS) |
| 노란 원통 | Redis *(예정)* |
| 보라 | 외부 서비스 · 엣지 |
| 주황 | AWS 리소스 |

`(예정)`에 해당하는 것: WebSocket 실시간 · League/Reward/Notification 서비스 · AI/LLM ·
스케줄러 · Redis · 메시지 큐(SQS) · Push.

---

## 미결 — 명세에 없어 추론으로 그린 부분

도면에 그려는 뒀지만 실제 채택 기술이 정해지면 노드명을 갈아야 하는 것들.

- **AI/LLM**: 외부 API(Claude/OpenAI) vs 자체 서버 — **외부 API로 가정**하고 그림
- **Redis / 큐 / 스케줄러**: 리그 랭킹 · 실시간 presence · 비동기 정산용으로 **추론 추가**
- **iOS 실시간 그룹 측정**: 기능명세에도 "기술 검증 필요"로 남아 있음 — **이상적 형태**로 그림
