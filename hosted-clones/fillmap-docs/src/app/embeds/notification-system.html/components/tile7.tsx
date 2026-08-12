import type { Tile7Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile7Data = {
  text: string;
  text2: string;
};
/** A content tile. */
export default function Tile7({ d, cids, styles }: { d: Tile7Data; cids: string[]; styles: Tile7Styles }) {
  return (
    <tr data-cid={cids[0]} className={cn("table-row align-middle [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
      <td data-cid={cids[1]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]", styles.className2)}>
        {d.text}
      </td>
      <td data-cid={cids[2]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]", styles.className3)}>
        {d.text2}
      </td>
    </tr>
  );
}
