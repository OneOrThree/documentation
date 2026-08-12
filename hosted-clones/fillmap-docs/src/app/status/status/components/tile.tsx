import type { TileStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type TileData = {
  text: string;
  text2: string;
  text3: string;
};
/** A content tile. */
export default function Tile({ d, cids, styles }: { d: TileData; cids: string[]; styles: TileStyles }) {
  return (
    <tr data-cid={cids[0]} className={cn("table-row align-middle [border-collapse:collapse] [border-spacing:2px]", styles.className)}>
      <td data-cid={cids[1]} className="border border-solid border-surface table-cell py-2 px-3 align-top leading-[1.375rem] text-left [border-collapse:collapse] [border-spacing:2px]">
        <code data-cid={cids[2]} className="inline py-[1.7px] px-[0.3rem] rounded-[5px] [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-xs leading-[1.1875rem] bg-surface-2 [border-collapse:collapse] [border-spacing:2px]">
          {d.text}
        </code>
      </td>
      <td data-cid={cids[3]} className={cn("border border-solid border-surface table-cell py-2 px-3 align-top leading-[1.375rem] text-left [border-collapse:collapse] [border-spacing:2px]", styles.className2)}>
        <code data-cid={cids[4]} className="inline py-[1.7px] px-[0.3rem] rounded-[5px] [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-xs leading-[1.1875rem] bg-surface-2 [border-collapse:collapse] [border-spacing:2px]">
          {d.text2}
        </code>
      </td>
      <td data-cid={cids[5]} className="border border-solid border-surface table-cell py-2 px-3 align-top leading-[1.375rem] text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text3}
      </td>
    </tr>
  );
}
