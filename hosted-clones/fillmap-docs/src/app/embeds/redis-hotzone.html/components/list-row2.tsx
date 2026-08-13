import type { ListRow2Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRow2Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow2({ d, cids, styles }: { d: ListRow2Data; cids: string[]; styles: ListRow2Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("list-item", styles.className)}>
      <code data-cid={cids[1]} className="inline py-0.5 px-[0.3125rem] rounded-[5px] text-color-006 [font-family:SFMono-Regular,_Consolas,_'Liberation_Mono',_monospace] text-[0.8125rem] leading-[1.375rem] bg-surface-7">
        {d.text}
      </code>
      {d.text2}
    </li>
  );
}
