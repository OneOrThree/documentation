import type { DiagramGraph } from "@/lib/diagrams";

/**
 * The same diagram as responsive text.
 *
 * Both cloned sites shipped a "다이어그램 / 문서 보기" toggle and described the
 * second view as "같은 내용을 반응형 텍스트로" — but only the diagram half was
 * ever captured, so the button led nowhere. The content is recoverable: the
 * graph compiled from the .drawio XML already carries every element, every
 * connection and every edge label, which is exactly what the text rendition is.
 *
 * Server-rendered, so it also works with JavaScript off and is readable by
 * search engines and screen readers that would get nothing from the SVG.
 */
export function DiagramTextView({ graph }: { graph: DiagramGraph }) {
  const labelOf = new Map(graph.nodes.map((n) => [n.id, n.label || n.id]));

  return (
    <ol className="overflow-hidden rounded-card border border-border bg-surface-1">
      {graph.nodes.map((node, i) => {
        const out = graph.edges.filter((e) => e.source === node.id);
        const inc = graph.edges.filter((e) => e.target === node.id);

        return (
          <li
            key={node.id}
            className="border-b border-border px-4 py-4 last:border-b-0 sm:px-5"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[0.8125rem] tabular-nums text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold leading-snug text-foreground">
                {node.label || node.id}
              </h3>
            </div>

            {out.length === 0 && inc.length === 0 ? (
              <p className="mt-1.5 pl-[2.15rem] text-[0.8125rem] text-muted">
                연결 없음
              </p>
            ) : (
              <dl className="mt-2 space-y-1.5 pl-[2.15rem]">
                <Row label="나가는 연결" arrow="→" edges={out} pick="target" labelOf={labelOf} />
                <Row label="들어오는 연결" arrow="←" edges={inc} pick="source" labelOf={labelOf} />
              </dl>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Row({
  label,
  arrow,
  edges,
  pick,
  labelOf,
}: {
  label: string;
  arrow: string;
  edges: DiagramGraph["edges"];
  pick: "source" | "target";
  labelOf: Map<string, string>;
}) {
  if (edges.length === 0) return null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
        {label}
      </dt>
      <dd className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-[0.875rem] text-muted-foreground">
        {edges.map((edge) => {
          const other = edge[pick];
          return (
            <span key={edge.id} className="whitespace-nowrap">
              <span aria-hidden className="text-muted">
                {arrow}{" "}
              </span>
              <span className="text-foreground">
                {(other && labelOf.get(other)) || other || "(연결 없음)"}
              </span>
              {edge.label && (
                <span className="ml-1 font-mono text-[0.6875rem] text-muted">
                  {edge.label}
                </span>
              )}
            </span>
          );
        })}
      </dd>
    </div>
  );
}
