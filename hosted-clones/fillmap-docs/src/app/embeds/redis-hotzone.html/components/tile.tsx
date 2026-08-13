import type { TileStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type TileData = {
  text: string;
  text2: string;
};
/** A content tile. */
export default function Tile({ d, cids, styles }: { d: TileData; cids: string[]; styles: TileStyles }) {
  return (
    <div data-cid={cids[0]} className={cn("h-19.5 min-h-19.5 border-solid block py-3 px-2 rounded-[10px] text-center", styles.className)}>
      <b data-cid={cids[1]} className="block font-bold">
        {d.text}
      </b>
      <span data-cid={cids[2]} className="block text-color-014 text-xs leading-[1.3125rem]">
        {d.text2}
      </span>
    </div>
  );
}
