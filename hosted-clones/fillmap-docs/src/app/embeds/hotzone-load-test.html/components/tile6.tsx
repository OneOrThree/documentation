import type { Tile6Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile6Data = {
  text: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  text6: string;
};
/** A content tile. */
export default function Tile6({ d, cids, styles }: { d: Tile6Data; cids: string[]; styles: Tile6Styles }) {
  return (
    <tr data-cid={cids[0]} className={cn("table-row align-middle [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
      <td data-cid={cids[1]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]", styles.className2)}>
        {d.text}
      </td>
      <td data-cid={cids[2]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className3)}>
        {d.text2}
      </td>
      <td data-cid={cids[3]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className4)}>
        {d.text3}
      </td>
      <td data-cid={cids[4]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className5)}>
        {d.text4}
      </td>
      <td data-cid={cids[5]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className6)}>
        {d.text5}
      </td>
      <td data-cid={cids[6]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-right whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]", styles.className7)}>
        {d.text6}
      </td>
    </tr>
  );
}
