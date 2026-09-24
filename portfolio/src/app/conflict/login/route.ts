import { NextResponse } from "next/server";

import { COOKIE, checkPassword, sessionToken } from "@/lib/conflict";

export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const ok = checkPassword(String(form.get("password") ?? ""));
  // ponytail: a fixed delay only slows a 4-digit guess sweep to hours; add a
  // real rate limit (KV counter per IP) if this page must resist a determined attacker.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = NextResponse.redirect(new URL(ok ? "/conflict" : "/conflict?error=1", request.url), 303);
  if (ok) {
    response.cookies.set(COOKIE, sessionToken(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/conflict",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return response;
}
