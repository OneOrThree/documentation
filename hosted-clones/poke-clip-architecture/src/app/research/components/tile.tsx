import type { TileStyles } from "../_styles";
import { cn } from "../../../lib/utils";
export type TileData = {
  description: string;
  description2: string;
};
/** A content tile. */
export default function Tile({ d, cids, styles }: { d: TileData; cids: string[]; styles: TileStyles }) {
  return (
    <p data-cid={cids[0]} className={cn("block mt-[16.5px] text-muted-foreground max-md:mt-[15.3px] md:max-lg:mt-4", styles.className)}>
      <strong data-cid={cids[1]} className="inline text-foreground font-bold">
        {d.description}
      </strong>
      {d.description2}
    </p>
  );
}
