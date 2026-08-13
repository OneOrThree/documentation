import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { Callout } from "@/components/callout";
import { StatusPill } from "@/components/status-pill";

/**
 * Markdown → JSX. Everything here runs at build time, including syntax
 * highlighting, so a document page ships no JavaScript of its own.
 */

const components = {
  // Internal links go through next/link for client-side navigation; external
  // ones get the usual safety attributes.
  a: ({ href = "", ...props }: React.ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
        {...props}
      />
    ),

  // Wide tables scroll inside their own card rather than widening the page.
  table: (props: React.ComponentProps<"table">) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),

  // Available to document bodies.
  Callout,
  StatusPill,
};

const rehypePrettyCodeOptions = {
  // Both palettes are emitted as inline custom properties and picked in CSS,
  // so code blocks follow the theme toggle instead of freezing in light.
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
};

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            // Must run after rehype-slug — it links to the ids that adds, and
            // those ids are the same ones getHeadings() predicts for the TOC.
            [
              rehypeAutolinkHeadings,
              {
                behavior: "append",
                properties: {
                  className: ["heading-anchor"],
                  ariaHidden: true,
                  tabIndex: -1,
                },
                content: { type: "text", value: "#" },
              },
            ],
            [rehypePrettyCode, rehypePrettyCodeOptions],
          ],
        },
      }}
    />
  );
}
