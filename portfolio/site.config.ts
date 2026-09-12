/**
 * Every piece of site identity lives here.
 *
 * In both cloned sites the nav array was re-declared at the top of all ~30
 * `page.tsx` files, with the active item hand-flipped from `kind:"link"` to
 * `kind:"button"`. Adding a section meant editing thirty files. Here it means
 * adding one entry and one folder under `content/`.
 */

export type SectionKind = "docs" | "diagrams";

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
    lede: "화면 한 장이 아니라 그 뒤의 판단을 보여주는 포트폴리오입니다. 아키텍처 다이어그램, 확정 명세, 기각한 대안까지 그대로 공개합니다.",
    actions: [
      {
        label: "다이어그램 보기",
        href: "/diagrams",
        variant: "solid" as const,
      },
      { label: "설계 결정 읽기", href: "/adr", variant: "outline" as const },
    ],
  },

  /** The "무엇으로 만들었나" strip on the landing page. */
  stack: [
    { name: "TypeScript", role: "프론트엔드" },
    { name: "Next.js", role: "웹 · 문서" },
    { name: "Spring Boot", role: "코어 API" },
    { name: "PostgreSQL", role: "주 저장소" },
    { name: "Redis", role: "채팅 · 상태 · 캐시" },
    { name: "Kafka", role: "이벤트 · 통합 진행" },
    { name: "AWS", role: "인프라" },
  ],

  footer:
    "이 사이트는 팀이 실제로 남긴 설계 문서를 그대로 공개한 것입니다. 각 문서의 날짜와 상태를 함께 확인해 주세요.",
} as const;
