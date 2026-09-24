import contributions from "@/data/contributions.json";

/**
 * Contribution tables and inline numbers for MDX, read straight from the
 * committed snapshot so prose never drifts from scripts/sync-contributions.py.
 */

const MEMBERS = [
  ["jo", "조재영"],
  ["ahn", "안수빈"],
  ["kwon", "권태화"],
] as const;

type Period = "overall" | "recent";
type Member = { count: number; pct: number; lines: number; linesPct: number };
type Area = { label: string; total: number; unassigned: number; lines: number; members: Record<string, Member> };
type Scale = { cappedLines: number; cappedPct: number; medianLines: number; bigPrs: number; activeDays: number };
type Snapshot = { merged: number; areas: Record<string, Area>; scale: Record<string, Scale> };

const data = contributions as unknown as Record<Period, Snapshot>;
const n = (v: number) => v.toLocaleString("ko-KR");

/** One number from the snapshot by dotted path, e.g. "overall.areas.backend.members.jo.pct". */
export function Contrib({ path }: { path: string }) {
  const value = path.split(".").reduce<unknown>((obj, key) => (obj as Record<string, unknown>)?.[key], contributions);
  if (value === undefined) throw new Error(`contributions.json has no ${path}`);
  return <>{typeof value === "number" ? n(value) : String(value)}</>;
}

export function DocumentTable() {
  const docs = (contributions as unknown as { documents: Record<string, { count: number; lines: number }> }).documents;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>작성자</th>
            <th style={{ textAlign: "right" }}>문서</th>
            <th style={{ textAlign: "right" }}>줄 수</th>
          </tr>
        </thead>
        <tbody>
          {MEMBERS.map(([key, name]) => (
            <tr key={key}>
              <td>{name}</td>
              <td style={{ textAlign: "right" }}>{n(docs[key].count)}</td>
              <td style={{ textAlign: "right" }}>{n(docs[key].lines)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ContributionTable({ period, metric }: { period: Period; metric: "count" | "lines" | "scale" }) {
  const snap = data[period];
  const areas = Object.values(snap.areas);
  const wrap = (table: React.ReactNode) => <div className="table-wrap">{table}</div>;

  if (metric === "scale") {
    const rows: [string, (s: Scale) => string][] = [
      ["변경 줄 수 (PR당 2,000줄 상한)", (s) => `${n(s.cappedLines)} (${s.cappedPct}%)`],
      ["PR 한 건 크기 중앙값", (s) => `${n(s.medianLines)}줄`],
      ["500줄 초과 PR", (s) => `${n(s.bigPrs)}건`],
      ["머지가 있었던 날", (s) => `${n(s.activeDays)}일`],
    ];
    return wrap(
      <table>
        <thead>
          <tr>
            <th>지표</th>
            {MEMBERS.map(([, name]) => <th key={name} style={{ textAlign: "right" }}>{name}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, fmt]) => (
            <tr key={label}>
              <td>{label}</td>
              {MEMBERS.map(([key]) => <td key={key} style={{ textAlign: "right" }}>{fmt(snap.scale[key])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>,
    );
  }

  const lines = metric === "lines";
  return wrap(
    <table>
      <thead>
        <tr>
          <th>영역</th>
          <th style={{ textAlign: "right" }}>{lines ? "변경 줄" : "담당 PR"}</th>
          {MEMBERS.map(([, name]) => <th key={name} style={{ textAlign: "right" }}>{name}</th>)}
          {!lines && period === "overall" && <th style={{ textAlign: "right" }}>미배정 PR</th>}
        </tr>
      </thead>
      <tbody>
        {areas.map((a) => (
          <tr key={a.label}>
            <td>{a.label}</td>
            <td style={{ textAlign: "right" }}>{n(lines ? a.lines : a.total)}</td>
            {MEMBERS.map(([key]) => {
              const m = a.members[key];
              return (
                <td key={key} style={{ textAlign: "right" }}>
                  {lines ? `${n(m.lines)} (${m.linesPct}%)` : period === "overall" ? `${n(m.count)} (${m.pct}%)` : n(m.count)}
                </td>
              );
            })}
            {!lines && period === "overall" && <td style={{ textAlign: "right" }}>{n(a.unassigned)}</td>}
          </tr>
        ))}
      </tbody>
    </table>,
  );
}
