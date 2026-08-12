import type { Tile2Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile2Data = {
  text: string;
};
/** A content tile. */
export default function Tile2({ d, cids, styles }: { d: Tile2Data; cids: string[]; styles: Tile2Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("block absolute rounded-[14px]", styles.className)}>
      <span data-cid={cids[1]} className={cn("block absolute font-extrabold", styles.className2)}>
        {d.text}
      </span>
      {" "}
    </div>
  );
}
