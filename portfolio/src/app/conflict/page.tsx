import type { Metadata } from "next";
import { cookies } from "next/headers";

import sealed from "@/data/conflict.enc.json";
import { Kicker } from "@/components/kicker";
import { Mdx } from "@/components/mdx";
import { COOKIE, checkSession, configured, open } from "@/lib/conflict";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "갈등관리",
  robots: { index: false, follow: false },
};

export default async function ConflictPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const unlocked = checkSession((await cookies()).get(COOKIE)?.value);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Kicker>CONFLICT MANAGEMENT</Kicker>
      <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-[-0.02em]">갈등관리</h1>

      {unlocked ? (
        <div className="doc-prose mt-8">
          <Mdx source={open(sealed)} />
        </div>
      ) : !configured() ? (
        <p className="mt-4 text-muted-foreground">이 페이지는 아직 열리지 않았습니다.</p>
      ) : (
        <form method="post" action="/conflict/login" className="mt-8 flex max-w-sm flex-col gap-3">
          <label htmlFor="password" className="text-sm text-muted-foreground">
            팀 내부 문서입니다. 비밀번호를 입력하세요.
          </label>
          <input
            id="password"
            name="password"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            required
            autoFocus
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-foreground"
          />
          {error && <p className="text-sm text-danger">비밀번호가 맞지 않습니다.</p>}
          <button type="submit" className="rounded-md bg-primary px-3 py-2 font-medium text-primary-on">
            열기
          </button>
        </form>
      )}
    </div>
  );
}
