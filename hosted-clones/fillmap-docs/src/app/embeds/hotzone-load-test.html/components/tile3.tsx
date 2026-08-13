import type { Tile3Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile3Data = {
  text: string;
  text2: string;
  text3: string;
};
/** A content tile. */
export default function Tile3({ d, cids, styles }: { d: Tile3Data; cids: string[]; styles: Tile3Styles }) {
  return (
    <tr data-cid={cids[0]} className="h-[2.425rem] table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
        {d.text}
      </td>
      <td data-cid={cids[2]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className2)}>
        {d.text2}
      </td>
      <td data-cid={cids[3]} className={cn("h-[2.425rem] border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]", styles.className3)}>
        {d.text3}
      </td>
    </tr>
  );
}
