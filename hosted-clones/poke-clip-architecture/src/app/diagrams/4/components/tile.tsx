import type { TileStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type TileData = {
  id: string;
  text: string;
};
/** A content tile. */
export default function Tile({ d, cids, styles }: { d: TileData; cids: string[]; styles: TileStyles }) {
  return (
    <div data-cid={cids[0]} className={cn("block absolute", styles.className)} id={d.id}>
      <span data-cid={cids[1]} className={cn("block absolute bg-surface", styles.className2)}>
        {d.text}
      </span>
    </div>
  );
}
