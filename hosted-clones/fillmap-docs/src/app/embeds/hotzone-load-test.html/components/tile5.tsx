import type { Tile5Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile5Data = {
  text: string;
  text2: string;
  text3: string;
  text4: string;
};
/** A content tile. */
export default function Tile5({ d, cids, styles }: { d: Tile5Data; cids: string[]; styles: Tile5Styles }) {
  return (
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
        {d.text}
      </td>
      <td data-cid={cids[2]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className2)}>
        {d.text2}
      </td>
      <td data-cid={cids[3]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className3)}>
        {d.text3}
      </td>
      <td data-cid={cids[4]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className4)}>
        {d.text4}
      </td>
    </tr>
  );
}
