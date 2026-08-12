import type { Tile5Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile5Data = {
  text: string;
  text2: string;
  text3: string;
};
/** A content tile. */
export default function Tile5({ d, cids, styles }: { d: Tile5Data; cids: string[]; styles: Tile5Styles }) {
  return (
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text}
      </td>
      <td data-cid={cids[2]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text2}
      </td>
      <td data-cid={cids[3]} className={cn("border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
        {d.text3}
      </td>
    </tr>
  );
}
