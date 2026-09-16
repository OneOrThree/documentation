# 팀 포트폴리오 문서 사이트 템플릿

엔지니어링 문서를 그대로 공개하는 포트폴리오 사이트. Next 15 App Router + Tailwind v4, 전 페이지 정적 생성.

구조와 디자인은 `hosted-clones/`의 두 사이트(PokeClip 아키텍처, FillMap 문서)에서 겹치는 골격을 뽑아 온 것이고, 두 사이트가 갈렸던 부분은 골라서 합쳤다. 다만 두 사이트가 공통으로 갖고 있던 구조적 문제 — 헤더·내비를 페이지마다 복붙, 컴포넌트 150~315개 중복, 없는 모듈을 `ignoreBuildErrors`로 덮기, 다크모드 없음, 다이어그램 컨트롤이 마크업만 있고 죽어 있음 — 은 전부 여기서 없앴다.

## 시작하기

```bash
npm install
npm run dev          # http://localhost:3000
```

| 명령                | 하는 일                             |
| ------------------- | ----------------------------------- |
| `npm run dev`       | 다이어그램 빌드 후 개발 서버        |
| `npm run build`     | 다이어그램 빌드 후 정적 생성        |
| `npm run typecheck` | `tsc --noEmit`                      |
| `npm run verify`    | 뜬 서버에 전 라우트 요청해 200 확인 |

## 문서 추가하기

`content/<섹션>/<슬러그>.mdx` 파일 하나를 만들면 끝이다. 섹션 인덱스, 좌측 레일, 이전/다음, `sitemap.xml`, `llms.txt`가 전부 자동으로 따라온다.

```mdx
---
title: "ADR-003 — 제목" # 필수
summary: "본문 위 요약 박스에 들어갈 한두 문장"
status: "유효" # 유효/검토됨/대체됨 … 색은 단어에서 추론
date: "2026-08-13"
order: 3 # 없으면 date 내림차순 → 제목순
keywords: ["키워드", "키워드"]
related:
  - label: "관련 문서"
    href: "/spec/architecture"
---

## 맥락

## 선택지

## 결정

## 근거

## 영향
```

`##`/`###` 제목은 자동으로 앵커가 붙고 우측 목차에 올라간다. 본문에서 `<Callout>` 과 `<StatusPill>` 을 바로 쓸 수 있다.

**섹션을 추가하려면** `site.config.ts` 의 `sections` 배열에 한 줄 넣고 `content/` 아래 같은 이름의 폴더를 만든다. 내비·랜딩 인덱스·sitemap이 알아서 반영한다.

## 다이어그램 추가하기

원본은 Google Drive의 draw.io다. 두 파일을 `diagrams/` 에 넣는다.

1. draw.io에서 **File → Export as → SVG** — "Include a copy of my diagram" **해제** → `diagrams/<id>.svg`
2. draw.io에서 **File → Save as → .drawio (XML)** → `diagrams/<id>.drawio.xml`
3. `diagrams/manifest.json` 에 `{ "id", "title", "titleEn", "summary" }` 추가

> `03-service`, `04-system`, `05-cloud`는 GROMO 도면이다. `01-ia`, `02-journey`는 R61 HTML을 표시한다. `scripts/make-placeholder-diagrams.mjs`는 전체 도면을 덮어쓰므로 기존 도면을 갱신할 때 실행하지 않는다.

`npm run build` 가 `scripts/build-diagrams.mjs` 를 돌려 `public/diagrams/` 에 셋을 만든다: 주석이 주입된 SVG, 연결 그래프 JSON, 다운로드용 원본 XML.

**왜 XML도 필요한가.** draw.io의 SVG export는 셀마다 `data-cell-id` 는 남기지만 **어느 엣지가 무엇을 잇는지는 남기지 않는다** (FillMap 클론의 export 실측: `data-cell-id` 104개, source/target 0개). 연결 관계는 XML의 `<mxCell edge="1" source= target=>` 에만 있다. 빌드 단계가 이 둘을 `data-cell-id` ↔ `mxCell/@id` 로 조인해서 SVG에 연결 정보를 심고, 그래야 "요소를 클릭하면 연결된 것만 남는" 동작이 가능하다.

조인이 실패하면 **빌드를 실패시킨다.** 클릭이 안 되는 다이어그램은 스크린샷으로는 멀쩡해 보이기 때문이다.

그룹 처리와 누락된 SVG 요소의 빌드 실패 회귀 검증: `node --test scripts/build-diagrams.test.mjs`.

**다이어그램에는 목록 페이지가 없다.** 헤더의 "다이어그램"은 첫 다이어그램으로 바로 간다(`/diagrams` 는 리다이렉트만 한다). 전환은 그림 위의 번호 선택 pill이 제자리에서 처리한다.

**`다이어그램 / 문서 보기` 토글.** 문서 보기는 같은 그래프를 텍스트로 렌더한다 — 요소마다 나가는/들어오는 연결과 엣지 라벨. 별도로 쓰는 내용이 아니라 `.drawio.xml` 에서 뽑은 그래프 그대로다.

## Gromo 아키텍처 갱신

서비스·시스템 도면은 `scripts/make-architecture-diagrams.py`의 같은 셀·좌표·연결 정의에서 SVG와 draw.io XML을 생성한다.

```bash
python3 scripts/make-architecture-diagrams.py
npm run build
```

이 생성기는 `03-service`, `04-system` 두 쌍만 갱신한다. 원본 근거·고정 커밋·구현 단계는 `content/spec/architecture.mdx`와 서비스·시스템 상세 문서에 기록한다. 상자를 더할 때는 구현 상태와 소유자를 함께 확인하며, main의 dev 설정을 목표 prod 배치의 운영 실적으로 바꾸지 않는다.

manifest의 `detailHref`는 다이어그램 아래에 근거 문서 링크를 표시한다. 다이어그램의 연결 강조와 문서 보기, 원본 다운로드는 기존 빌드 파이프라인을 사용한다.

### 아키텍처 버전 보존

서비스·시스템 도면은 최신 파일을 덮어쓴 뒤 이전 파일을 지우지 않는다. 이전 SVG와 draw.io XML을 `<id>.v1.*`처럼 보존하고 manifest의 `versions`에 `artifactId`, 날짜, 대체 사유, 근거 문서와 원본 커밋을 등록한다. 빌드는 모든 버전의 연결 그래프까지 만들며, 페이지의 버전 선택은 도면·문서 보기·설계 뷰·다운로드 원본을 함께 전환한다.

현재 v1은 문서 저장소의 `345aa78`(2026-09-08)에서 복원했고, v2는 2026-09-13의 Kafka·Redis 경계 반영본이다.

## 발전 기록 자동 생성

`src/data/evolution.json`은 직접 편집하지 않는다. 생성기가 `phone` 저장소 `origin/main`의 first-parent 기록에서 `docs/`, `.github/workflows/`, `server/scripts/` 변경만 모아 날짜·제목·SHA·변경 파일을 기록한다.

```bash
npm run sync:evolution
npm run check:evolution
```

기본 source 경로는 이 저장소와 나란히 있는 `../phone`이다. 다른 위치에서는 `GROMO_SOURCE_REPO=/path/to/phone`을 지정한다. `predev`와 `prebuild`도 source 저장소가 보이는 환경에서는 자동으로 갱신하고, Vercel처럼 source가 없는 환경에서는 커밋된 스냅샷을 그대로 사용한다.

## 기술 회고 추가

`content/retrospective/`에 회고를 추가한다. 회고는 목표, Keep, Problem, Try, Action item, 근거 순서로 작성하고, 회의 기록이 없으면 팀의 감정이나 합의를 추정하지 않는다. 구현 문서·PR·커밋에서 확인되는 기술적 판단만 회고한다.

## HTML 다이어그램의 표시

IA와 유저 저니는 검토한 R61 HTML을 그대로 표시합니다. `diagrams/01-ia.html`, `diagrams/02-journey.html`이 원본이며, manifest 항목에 `"format": "html"`을 지정합니다. 빌드가 원본을 `public/diagrams/`에 복사하고 기존 `/diagrams/01-ia`, `/diagrams/02-journey` 페이지는 독립 프레임으로 표시합니다. 새 창에서도 열 수 있습니다.

HTML 형식에는 SVG·XML 연결 그래프를 요구하지 않으며, 기존 그래프의 `문서 보기` 토글을 표시하지 않습니다. 유저 저니는 전체 여정 표만 표시하며 하단 상세 여정과 상세 이동 링크를 포함하지 않습니다. IA는 `주요 기능`과 `세부 기능` 두 버튼으로 펼침 상태를 바꾸며, 개별 가지 펼침·구조 선택·검색은 제공하지 않습니다.

별도 명세·draw.io 파일은 함께 배포하지 않습니다. `public/diagrams/`는 빌드 때 다시 생성되므로 직접 편집하지 않습니다.

## 브랜드 바꾸기

- 이름·문구·내비·스택: `site.config.ts`
- 색: `src/styles/tokens.css` 의 `--primary` 한 줄. 나머지는 파생된다. 라이트/다크 각각 정의돼 있다.

## 배포 (Vercel)

1. 이 저장소를 Vercel 프로젝트로 임포트
2. **Root Directory** 를 `portfolio` 로 지정
3. 환경변수 `NEXT_PUBLIC_SITE_ORIGIN` 에 실제 도메인 (`metadataBase`·sitemap·llms.txt의 절대 URL에 쓰인다)

프레임워크·빌드 명령은 자동 감지된다. `prebuild` 가 다이어그램을 만들므로 별도 설정은 없다.

## 검증할 때 주의

`npm run verify` 는 200만 확인한다. 하이드레이션 단계에서만 터지는 클라이언트 예외는 잡지 못한다 — 실제로 이 템플릿 개발 중 `IntersectionObserver` 의 `rootMargin` 에 `rem` 을 써서 모든 문서 페이지가 죽었는데, 빌드·타입체크·200 검증이 전부 통과했다. 문서 페이지 하나와 다이어그램 하나는 브라우저에서 콘솔을 열고 확인할 것.

## 알려진 한계

- 다이어그램은 다크모드에서도 밝은 캔버스 위에 렌더한다. draw.io export가 `fill="#f1f2f4"` 같은 고정색을 갖기 때문. 도형 팔레트를 CSS 변수로 매핑하는 건 후속 작업.
- 문서 검색(Cmd+K)은 넣지 않았다.
- TypeScript는 5.x로 고정돼 있다. 7.x(네이티브 재작성)에서는 Next 15의 TS 감지가 실패해 경로 별칭이 통째로 깨진다.
