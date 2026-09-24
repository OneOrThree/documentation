import type { MetadataRoute } from "next";

import { site } from "@root/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/conflict" },
    sitemap: new URL("/sitemap.xml", site.origin).toString(),
  };
}
