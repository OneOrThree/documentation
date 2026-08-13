import "./globals.css";
import type { ReactNode } from "react";
import { SITE_ORIGIN } from "../lib/site";

export const metadata = {
  "metadataBase": new URL(SITE_ORIGIN || "http://localhost:3000"),
  "title": "FillMap 문서",
  "description": "FillMap 설계 산출물. 제품 요구사항 · 다이어그램 · 설계 결정 · 명세 · 연구 노트.",
  "openGraph": {
    "title": "FillMap 문서",
    "description": "FillMap 설계 산출물. 제품 요구사항 · 다이어그램 · 설계 결정 · 명세 · 연구 노트.",
    "type": "website"
  },
  "icons": {
    "icon": [
      {
        "url": "/assets/cloned/svg/1247e2bc3750.svg"
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
