import type { ListRowStyles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRowData = {
  kind: string;
  href: string;
  label: string;
  ariacurrent?: string;
};
/** A list row. */
export default function ListRow({ d, cids, styles }: { d: ListRowData; cids: string[]; styles: ListRowStyles }) {
  return (
    <li data-cid={cids[0]} className="list-item">
      <a data-cid={cids[1]} className={cn("inline-block py-[0.35rem] px-[0.7rem] rounded-[999px] text-sm leading-[1.5rem] whitespace-nowrap text-nowrap cursor-pointer", styles.className)} data-component={d.kind} href={d.href} aria-current={d.ariacurrent}>
        {d.label}
      </a>
    </li>
  );
}
