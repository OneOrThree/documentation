import type { Tile4Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile4Data = {
  text: string;
  text2: string;
};
/** A content tile. */
export default function Tile4({ d, cids, styles }: { d: Tile4Data; cids: string[]; styles: Tile4Styles }) {
  return (
    <tr data-cid={cids[0]} className={cn("table-row align-middle [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
      <td data-cid={cids[1]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]", styles.className2)}>
        <code data-cid={cids[2]} className="border border-solid border-border inline py-px px-[0.3125rem] rounded-sm [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_Menlo,_Consolas,_monospace] text-xs leading-[1.3125rem] bg-surface-3 [border-collapse:collapse] [border-spacing:2px]">
          {d.text}
        </code>
      </td>
      <td data-cid={cids[3]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]", styles.className3)}>
        {d.text2}
      </td>
    </tr>
  );
}
