import type { TileStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type TileData = {
  id: string;
  text: string;
};
/** A content tile. */
export default function Tile({ d, cids, styles }: { d: TileData; cids: string[]; styles: TileStyles }) {
  return (
    <div data-cid={cids[0]} className={cn("border border-solid border-color-004 flex absolute z-3 py-1.5 px-2 rounded-[3px] flex-col justify-center items-center text-center bg-surface cursor-pointer", styles.className)} data-component="button" id={d.id} role="button">
      <div data-cid={cids[1]} className="block text-[0.8125rem] font-bold leading-[1rem]">
        {d.text}
      </div>
    </div>
  );
}
