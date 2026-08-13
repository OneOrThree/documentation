# 팀 포트폴리오 문서 사이트 템플릿

엔지니어링 문서를 그대로 공개하는 포트폴리오 사이트. Next 15 App Router + Tailwind v4, 전 페이지 정적 생성.

구조와 디자인은 `hosted-clones/`의 두 사이트(PokeClip 아키텍처, FillMap 문서)에서 겹치는 골격을 뽑아 온 것이고, 두 사이트가 갈렸던 부분은 골라서 합쳤다. 다만 두 사이트가 공통으로 갖고 있던 구조적 문제 — 헤더·내비를 페이지마다 복붙, 컴포넌트 150~315개 중복, 없는 모듈을 `ignoreBuildErrors`로 덮기, 다크모드 없음, 다이어그램 컨트롤이 마크업만 있고 죽어 있음 — 은 전부 여기서 없앴다.

## 시작하기

```bash
npm install
npm run dev          # http://localhost:3000
```

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 다이어그램 빌드 후 개발 서버 |
| `npm run build` | 다이어그램 빌드 후 정적 생성 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify` | 뜬 서버에 전 라우트 요청해 200 확인 |

## 문서 추가하기

`content/<섹션>/<슬러그>.mdx` 파일 하나를 만들면 끝이다. 섹션 인덱스, 좌측 레일, 이전/다음, `sitemap.xml`, `llms.txt`가 전부 자동으로 따라온다.

```mdx
---
title: "ADR-003 — 제목"        # 필수
summary: "본문 위 요약 박스에 들어갈 한두 문장"
status: "유효"                  # 유효/검토됨/대체됨 … 색은 단어에서 추론
date: "2026-08-13"
order: 3                       # 없으면 date 내림차순 → 제목순
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

> 현재 `diagrams/` 의 6개는 **자리표시**다. `scripts/make-placeholder-diagrams.mjs` 가 만든 것이고, Drive의 진짜 원본이 오면 파일을 덮어쓰고 이 스크립트는 지우면 된다.

`npm run build` 가 `scripts/build-diagrams.mjs` 를 돌려 `public/diagrams/` 에 셋을 만든다: 주석이 주입된 SVG, 연결 그래프 JSON, 다운로드용 원본 XML.

**왜 XML도 필요한가.** draw.io의 SVG export는 셀마다 `data-cell-id` 는 남기지만 **어느 엣지가 무엇을 잇는지는 남기지 않는다** (FillMap 클론의 export 실측: `data-cell-id` 104개, source/target 0개). 연결 관계는 XML의 `<mxCell edge="1" source= target=>` 에만 있다. 빌드 단계가 이 둘을 `data-cell-id` ↔ `mxCell/@id` 로 조인해서 SVG에 연결 정보를 심고, 그래야 "요소를 클릭하면 연결된 것만 남는" 동작이 가능하다.

조인이 실패하면 **빌드를 실패시킨다.** 클릭이 안 되는 다이어그램은 스크린샷으로는 멀쩡해 보이기 때문이다.

**다이어그램에는 목록 페이지가 없다.** 헤더의 "다이어그램"은 첫 다이어그램으로 바로 간다(`/diagrams` 는 리다이렉트만 한다). 전환은 그림 위의 번호 선택 pill이 제자리에서 처리한다.

**`다이어그램 / 문서 보기` 토글.** 문서 보기는 같은 그래프를 텍스트로 렌더한다 — 요소마다 나가는/들어오는 연결과 엣지 라벨. 별도로 쓰는 내용이 아니라 `.drawio.xml` 에서 뽑은 그래프 그대로다.

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
