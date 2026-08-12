import type { ListRowStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRowData = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow({ d, cids, styles }: { d: ListRowData; cids: string[]; styles: ListRowStyles }) {
  return (
    <li data-cid={cids[0]} className={cn("list-item my-[0.4375rem]", styles.className)}>
      <span data-cid={cids[1]} className="inline-block mr-[0.3125rem] py-0.5 px-2 rounded-[999px] text-color-007 text-xs font-bold leading-[1.3125rem] bg-surface-15" data-component="badge">
        {d.text}
      </span>
      {d.text2}
    </li>
  );
}
