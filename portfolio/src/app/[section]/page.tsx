import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { docSections, findSection } from "@root/site.config";
import { getDocs } from "@/lib/content";
import { ContributionDonuts } from "@/components/contribution-donuts";
import { DocSearch } from "@/components/doc-search";
import { Kicker } from "@/components/kicker";
import { NumberedIndex } from "@/components/numbered-index";

// Sections are fixed at build time; anything else is a 404 rather than an
// attempted render.
export const dynamicParams = false;

export function generateStaticParams() {
  return docSections.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: slug } = await params;
  const section = findSection(slug);
  if (!section) return {};
  return { title: section.title, description: section.description };
}

export default async function SectionIndexPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = findSection(slug);
  if (!section || section.kind !== "docs") notFound();

  const docs = getDocs(section.slug);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Kicker>{section.kicker}</Kicker>
      <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-[-0.02em]">
        {section.title}
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        {section.description}
      </p>

      <div className="mt-10">
        {section.slug === "team" && <ContributionDonuts />}
        {section.search ? (
          <DocSearch
            section={section.slug}
            sectionTitle={section.title}
            total={docs.length}
            fallback={<NumberedIndex docs={docs} />}
          />
        ) : (
          <NumberedIndex docs={docs} />
        )}
      </div>
    </div>
  );
}
