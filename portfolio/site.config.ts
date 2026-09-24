/**
 * Every piece of site identity lives here.
 *
 * In both cloned sites the nav array was re-declared at the top of all ~30
 * `page.tsx` files, with the active item hand-flipped from `kind:"link"` to
 * `kind:"button"`. Adding a section meant editing thirty files. Here it means
 * adding one entry and one folder under `content/`.
 */

export type SectionKind = "docs" | "diagrams" | "generated";

export interface SectionConfig {
  /** URL segment, and the folder name under `content/` for `kind: "docs"`. */
  slug: string;
  /** Korean label shown in the header nav. */
  label: string;
  /** Monospace uppercase kicker above the index heading. */
  kicker: string;
  /** <h1> of the section index page. */
  title: string;
  /** One paragraph under the index heading, explaining what belongs here. */
  description: string;
  kind: SectionKind;
  /**
   * Put a search box on this section's index. Worth it where documents
   * accumulate; noise on a section that holds one or two.
   */
  search?: boolean;
  /**
   * How the index, the left rail and prev/next order this section.
   *
   * "curated" (default) follows the `order` field in each document's
   * frontmatter — right where a section is a reading sequence, like the
   * chronicle. "date" puts the newest document first, which is what a log of
   * decisions and notes should do; documents sharing a date fall back to
   * `order`, so a batch written on one day keeps its intended sequence.
   * "curated-desc" reverses `order` — for a numbered series where the number
   * is the identity and the newest entry has the highest one, like the ADRs.
   * Sorting those by date scatters the numbers (022 · 002 · 003 · 020 …)
   * because a revised ADR carries its revision date, not its decision date.
   *
   * A document with no `order` sorts last in every mode, including the
   * reversed one — absence should not win a ranking.
   */
  sort?: "curated" | "date" | "curated-desc";
}

export const sections: SectionConfig[] = [
  {
    slug: "diagrams",
    label: "다이어그램",
    kicker: "ARCHITECTURE DIAGRAMS",
    title: "다이어그램",
    description: "서비스의 정보 구조와 시스템 구성을 한눈에 살펴봅니다.",
    kind: "diagrams",
  },
  {
    slug: "spec",
    label: "설계·명세",
    kicker: "DESIGN & SPEC",
    title: "설계와 명세",
    description:
      "무엇을 만드는지 확정한 문서입니다. 위키나 옛 메모와 어긋나면 이 문서가 이깁니다.",
    kind: "docs",
    search: true,
    sort: "date",
  },
  {
    slug: "adr",
    label: "설계 결정",
    kicker: "DECISION RECORDS",
    title: "설계 결정 기록",
    description:
      "무엇을 정했는지가 아니라, 왜 그렇게 정했고 무엇을 기각했는지를 남깁니다. 뒤집힌 결정도 지우지 않고 대체됨으로 표시합니다.",
    kind: "docs",
    search: true,
    sort: "curated-desc",
  },
  {
    slug: "operations",
    label: "운영·트러블슈팅",
    kicker: "OPERATIONS & TROUBLESHOOTING",
    title: "운영과 트러블슈팅",
    description:
      "prod 사고와 dev·CI 장애를 구분해 영향·진단 근거·복구·재발 방지를 연결합니다. 임시 복구와 후속 검증 상태도 함께 남깁니다.",
    kind: "docs",
    search: true,
    sort: "curated",
  },
  {
    slug: "research",
    label: "연구 노트",
    kicker: "RESEARCH NOTES",
    title: "연구 노트",
    description:
      "측정하고 부딪히며 알아낸 것들. 결론뿐 아니라 재현 방법과 숫자를 함께 남깁니다.",
    kind: "docs",
    search: true,
    sort: "date",
  },
  {
    slug: "growth",
    label: "그로스",
    kicker: "GROWTH METRICS",
    title: "그로스 지표와 분석",
    description:
      "실제 사용 데이터로 무엇을 판정했는지. 위쪽 수치는 GA4에서 매일 자동으로 갱신되고, 아래 문서는 그 수치로 내린 주간 판정과 기능별 실태 조사입니다.",
    kind: "docs",
    search: true,
    sort: "date",
  },
  {
    slug: "evolution",
    label: "발전 기록",
    kicker: "EVOLUTION LOG",
    title: "발전 기록",
    description:
      "아키텍처·제품 설계·전달 경계를 바꾼 main 커밋을 Git 로그에서 자동으로 모읍니다.",
    kind: "generated",
  },
  {
    slug: "retrospective",
    label: "회고",
    kicker: "RETROSPECTIVE",
    title: "기술 회고",
    description:
      "결과만 나열하지 않고, 유지할 것·문제가 된 것·다음에 시도할 것을 근거와 함께 남깁니다.",
    kind: "docs",
  },
  {
    slug: "history",
    label: "연대기",
    kicker: "PROJECT HISTORY",
    title: "프로젝트 연대기",
    description:
      "소프트웨어 마에스트로 시작부터 지금까지를 순서대로 복원합니다. 지라 티켓·스프린트, 컨플루언스 회의록·회고·멘토링 기록이 근거입니다.",
    kind: "docs",
    search: true,
  },
  {
    slug: "team",
    label: "팀·역할",
    kicker: "TEAM & OWNERSHIP",
    title: "팀과 역할",
    description: "누가 무엇을 책임지고, 경계에서 어떤 계약을 주고받는지.",
    kind: "docs",
  },
];

export const docSections = sections.filter((s) => s.kind === "docs");

export const searchableSections = sections.filter((s) => s.search === true);

export function findSection(slug: string): SectionConfig | undefined {
  return sections.find((s) => s.slug === slug);
}

export const site = {
  /** Change these five lines to rebrand. */
  name: "OneOrThree",
  wordmark: "OneOrThree",
  subLabel: "PORTFOLIO",
  tagline: "결정을 남기는 팀",
  description:
    "무엇을 만들었는지보다, 왜 그렇게 만들었는지를 남기는 팀 포트폴리오입니다.",

  /** Absolute origin for metadataBase, sitemap and robots. */
  origin: process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000",

  hero: {
    kicker: "TEAM PORTFOLIO",
    headline: ["설계는 문서로 남고,", "문서는 결정으로 남는다."],
    subline: "우리가 만든 것과, 그렇게 만든 이유.",
    lede: "설계의 근거와 서비스가 어긋났을 때의 대응을 남깁니다. 아키텍처, 기각한 대안, 장애의 진단·복구·재발 방지 기록을 함께 읽을 수 있습니다.",
    actions: [
      {
        label: "다이어그램 보기",
        href: "/diagrams",
        variant: "solid" as const,
      },
      { label: "설계 결정 읽기", href: "/adr", variant: "outline" as const },
      { label: "운영 사례 읽기", href: "/operations/01-incident-map", variant: "outline" as const },
    ],
  },

  /** The "무엇으로 만들었나" strip on the landing page. */
  stack: [
    { name: "TypeScript", role: "프론트엔드" },
    { name: "Next.js", role: "웹 · 문서" },
    { name: "Spring Boot", role: "코어 API" },
    { name: "PostgreSQL", role: "주 저장소" },
    { name: "Redis", role: "채팅 · 상태 · 캐시" },
    { name: "Kafka", role: "이벤트 · 활성화 기본 OFF" },
    { name: "AWS", role: "인프라" },
  ],

  footer:
    "이 사이트는 팀이 실제로 남긴 설계 문서를 그대로 공개한 것입니다. 각 문서의 날짜와 상태를 함께 확인해 주세요.",
} as const;
