import type { Tile2Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile2Data = {
  id: string;
  text: string;
  text2: string;
};
/** A content tile. */
export default function Tile2({ d, cids, styles }: { d: Tile2Data; cids: string[]; styles: Tile2Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("border-solid border-color-004 flex absolute z-3 py-1.5 px-2 rounded-[3px] flex-col justify-center items-center text-center bg-surface cursor-pointer", styles.className)} data-component="button" id={d.id} role="button">
      <div data-cid={cids[1]} className={cn("block text-[0.8125rem] leading-[1rem]", styles.className2)}>
        {d.text}
      </div>
      <div data-cid={cids[2]} className="block mt-[0.1875rem] text-color-029 text-[0.625rem] font-medium leading-[0.8125rem]">
        {d.text2}
      </div>
    </div>
  );
}
