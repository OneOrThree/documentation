import type { ListRowStyles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRowData = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow({ d, cids, styles }: { d: ListRowData; cids: string[]; styles: ListRowStyles }) {
  return (
    <li data-cid={cids[0]} className={cn("grid py-[0.6875rem] gap-0.5 grid-rows-[22.75px_20.9219px] grid-cols-1", styles.className)}>
      <code data-cid={cids[1]} className="block [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-[0.8125rem] font-semibold leading-[1.4375rem]">
        {d.text}
      </code>
      {" "}
      <span data-cid={cids[2]} className="block text-muted text-sm leading-[1.3125rem]">
        {d.text2}
      </span>
      {" "}
    </li>
  );
}
