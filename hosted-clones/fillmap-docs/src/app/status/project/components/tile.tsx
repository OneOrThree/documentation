import type { TileStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type TileData = {
  text: string;
  text2: string;
};
/** A content tile. */
export default function Tile({ d, cids, styles }: { d: TileData; cids: string[]; styles: TileStyles }) {
  return (
    <tr data-cid={cids[0]} className={cn("table-row align-middle [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
      <td data-cid={cids[1]} className="border border-solid border-surface table-cell py-2 px-3 align-top leading-[1.375rem] text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text}
      </td>
      <td data-cid={cids[2]} className={cn("border border-solid border-surface table-cell py-2 px-3 align-top leading-[1.375rem] text-left [border-collapse:collapse] [border-spacing:2px]", styles.className2)}>
        {d.text2}
      </td>
    </tr>
  );
}
