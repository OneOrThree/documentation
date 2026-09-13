import type { Metadata } from "next";
import Link from "next/link";

import { getDocs } from "@/lib/content";
import { Kicker } from "@/components/kicker";
import { StatusPill } from "@/components/status-pill";

export const metadata: Metadata = {
  title: "기술 회고",
  description: "Gromo의 설계와 구현 기록을 KPT와 다음 액션으로 다시 읽은 기술 회고",
};

export default function RetrospectivePage() {
  const docs = getDocs("retrospective");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="max-w-3xl">
        <Kicker>RETROSPECTIVE</Kicker>
        <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-[-0.02em]">기술 회고</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          설계 문서와 구현 기록을 KPT로 다시 읽습니다. 팀원의 감정이나 합의를 추정하지 않고,
          저장소에서 확인할 수 있는 문제·대응·남은 일만 기록합니다.
        </p>
      </header>

      <ol className="mt-10 overflow-hidden rounded-card border border-border bg-surface-1">
        {docs.map((doc, index) => (
          <li key={doc.href} className="border-b border-border last:border-b-0">
            <Link
              href={doc.href}
              className="group grid min-w-0 gap-3 px-5 py-5 no-underline sm:grid-cols-[3rem_7rem_minmax(0,1fr)_auto] sm:items-start"
            >
              <span className="font-mono text-xs tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
              <time dateTime={doc.date} className="font-mono text-xs tabular-nums text-muted-foreground">
                {doc.date}
              </time>
              <span className="min-w-0">
                <strong className="block leading-snug text-foreground group-hover:text-primary">{doc.title}</strong>
                {doc.summary && (
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">{doc.summary}</span>
                )}
              </span>
              {doc.status && <StatusPill status={doc.status} />}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
