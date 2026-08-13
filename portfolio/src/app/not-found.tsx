import Link from "next/link";

import { Kicker } from "@/components/kicker";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-28">
      <Kicker>404</Kicker>
      <h1 className="mt-4 text-[2rem] font-bold tracking-[-0.02em]">
        찾는 문서가 없습니다
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        주소가 바뀌었거나, 아직 작성되지 않은 문서입니다. 산출물 인덱스에서 확인해 주세요.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-pill bg-foreground px-5 py-2.5 text-sm font-semibold text-background no-underline"
      >
        개요로 돌아가기
      </Link>
    </div>
  );
}
