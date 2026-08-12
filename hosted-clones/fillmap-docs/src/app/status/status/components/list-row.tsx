import type { ListRowStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRowData = {
  text: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
};
/** A list row. */
export default function ListRow({ d, cids, styles }: { d: ListRowData; cids: string[]; styles: ListRowStyles }) {
  return (
    <li data-cid={cids[0]} className={cn("list-item my-[0.3rem] text-muted-foreground", styles.className)}>
      {d.text}
      <code data-cid={cids[1]} className="inline py-0.5 px-[5.5px] rounded-[5px] [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-sm leading-6 bg-surface-2">
        {d.text2}
      </code>
      {d.text3}
      <code data-cid={cids[2]} className="inline py-0.5 px-[5.5px] rounded-[5px] [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-sm leading-6 bg-surface-2">
        {d.text4}
      </code>
      {d.text5}
    </li>
  );
}
