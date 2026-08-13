import { notFound } from "next/navigation";

import { searchableSections } from "@root/site.config";
import { buildSectionIndex } from "@/lib/search";

/**
 * Static per-section search index. Prerendered at build time and fetched by
 * DocSearch on the first keystroke — no server, no third-party search service.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return searchableSections.map((s) => ({ section: s.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;
  if (!searchableSections.some((s) => s.slug === section)) notFound();

  return Response.json(buildSectionIndex(section));
}
