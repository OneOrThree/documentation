import type { TileStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type TileData = {
  ariapressed: string;
  label: string;
};
/** A content tile. */
export default function Tile({ d, cids, styles }: { d: TileData; cids: string[]; styles: TileStyles }) {
  return (
    <button data-cid={cids[0]} className={cn("block min-w-[3.2rem] py-[0.3rem] px-[0.55rem] rounded-md text-[0.8125rem] leading-[1.3125rem] text-center cursor-pointer", styles.className)} data-component="button" aria-pressed={d.ariapressed} type="button">
      {d.label}
    </button>
  );
}
