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
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className={cn("h-[2.425rem] border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
        <code data-cid={cids[2]} className="border border-solid border-border inline py-px px-[0.3125rem] rounded-sm [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_Menlo,_Consolas,_monospace] text-xs leading-[1.3125rem] bg-surface-3 [border-collapse:collapse] [border-spacing:2px]">
          {d.text}
        </code>
      </td>
      <td data-cid={cids[3]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text2}
      </td>
      <td data-cid={cids[4]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        400
      </td>
      <td data-cid={cids[5]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text3}
      </td>
    </tr>
  );
}
