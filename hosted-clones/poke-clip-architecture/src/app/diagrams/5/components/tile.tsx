import type { TileStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type TileData = {
  text: string;
};
/** A content tile. */
export default function Tile({ d, cids, styles }: { d: TileData; cids: string[]; styles: TileStyles }) {
  return (
    <div data-cid={cids[0]} className={cn("flex my-1 items-center text-color-021 text-xs font-semibold leading-3.5", styles.className)}>
      <span data-cid={cids[1]} className={cn("w-13 border-t-color-006 block mr-2.5 shrink-0", styles.className2)} />
      {d.text}
    </div>
  );
}
