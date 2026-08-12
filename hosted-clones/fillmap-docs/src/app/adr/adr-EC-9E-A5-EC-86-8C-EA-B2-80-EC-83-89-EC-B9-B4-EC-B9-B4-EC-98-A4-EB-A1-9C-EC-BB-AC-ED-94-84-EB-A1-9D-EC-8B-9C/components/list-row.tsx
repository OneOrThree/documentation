import type { ListRowStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRowData = {
  text: string;
};
/** A list row. */
export default function ListRow({ d, cids, styles }: { d: ListRowData; cids: string[]; styles: ListRowStyles }) {
  return (
    <li data-cid={cids[0]} className={cn("border border-solid list-item py-[0.1875rem] px-[0.5625rem] rounded-[999px] [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-[0.6875rem] leading-[1.1875rem] tracking-[0.88px] uppercase whitespace-nowrap text-nowrap", styles.className)}>
      {d.text}
    </li>
  );
}
