import "./globals.css";
import type { ReactNode } from "react";
import { SITE_ORIGIN } from "../lib/site";

export const metadata = {
  "metadataBase": new URL(SITE_ORIGIN || "http://localhost:3000"),
  "title": "PokeClip — 아키텍처",
  "description": "PokeClip — 스트리밍 하이라이트·클립 자동화 서비스의 아키텍처 산출물. 다이어그램 0~5, 기능 명세서, 설계 결정(ADR) 14건.",
  "icons": {
    "icon": [
      {
        "url": "/assets/cloned/svg/1a90f80a9444.svg",
        "type": "image/svg+xml"
      }
    ]
  }
};
export const viewport = {
  "width": "device-width",
  "initialScale": 1
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={"ko"}>
      <body className="cn0" data-cid="n0">
        {children}
      </body>
    </html>
  );
}
