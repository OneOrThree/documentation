import type { MetadataRoute } from "next";

import { sections, site } from "@root/site.config";
import { getAllDocs, getDocs } from "@/lib/content";
import { getDiagrams } from "@/lib/diagrams";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => new URL(p, site.origin).toString();

  // Newest document date stands in as the "last modified" for the whole site.
  const dates = getAllDocs()
    .map((d) => d.date)
    .filter((d): d is string => Boolean(d))
    .sort();
  const newest = dates.at(-1);

  return [
    { url: url("/"), lastModified: newest, priority: 1 },

    ...sections.map((section) => ({
      url: url(`/${section.slug}`),
      lastModified:
        section.kind === "docs"
          ? getDocs(section.slug)
              .map((d) => d.date)
              .filter(Boolean)
              .sort()
              .at(-1)
          : newest,
      priority: 0.8,
    })),

    ...getAllDocs().map((doc) => ({
      url: url(doc.href),
      lastModified: doc.date,
      priority: 0.6,
    })),

    ...getDiagrams().map((diagram) => ({
      url: url(`/diagrams/${diagram.id}`),
      priority: 0.6,
    })),
  ];
}
