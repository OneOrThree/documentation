import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { findSection } from "@root/site.config";
import { getDiagrams } from "@/lib/diagrams";
import { Kicker } from "@/components/kicker";

const section = findSection("diagrams")!;

export const metadata: Metadata = {
  title: section.title,
  description: section.description,
};

/**
 * There is no diagram list page.
 *
 * Both cloned sites pointed their "다이어그램" nav item straight at the first
 * diagram — an index listing six links to six pictures is a detour, and the
 * numbered selector on the diagram page already does the switching in place.
 * This route exists only so the nav href and any old bookmark still resolve.
 */
export default function DiagramsPage() {
  const diagrams = getDiagrams();

  if (diagrams.length > 0) redirect(`/diagrams/${diagrams[0]!.id}`);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Kicker>{section.kicker}</Kicker>
      <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-[-0.02em]">
        {section.title}
      </h1>
      <p className="mt-10 rounded-card border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
        아직 다이어그램이 없습니다. <code className="font-mono">diagrams/</code> 에{" "}
        <code className="font-mono">.drawio.xml</code> 과 <code className="font-mono">.svg</code> 를 넣고{" "}
        <code className="font-mono">manifest.json</code> 에 등록해 주세요.
      </p>
    </div>
  );
}
