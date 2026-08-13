import type { ListRowStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRowData = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow({ d, cids, styles }: { d: ListRowData; cids: string[]; styles: ListRowStyles }) {
  return (
    <li data-cid={cids[0]} className={cn("list-item mb-1.5", styles.className)}>
      <strong data-cid={cids[1]} className="inline font-bold">
        {d.text}
      </strong>
      {d.text2}
    </li>
  );
}
