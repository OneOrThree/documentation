import type { Tile2Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile2Data = {
  text: string;
};
/** A content tile. */
export default function Tile2({ d, cids, styles }: { d: Tile2Data; cids: string[]; styles: Tile2Styles }) {
  return (
    <td data-cid={cids[0]} className={cn("border border-solid border-surface table-cell py-2 px-3 align-top leading-[1.375rem] text-left [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
      <strong data-cid={cids[1]} className="inline [font-weight:650] [border-collapse:collapse] [border-spacing:2px]">
        {d.text}
      </strong>
    </td>
  );
}
