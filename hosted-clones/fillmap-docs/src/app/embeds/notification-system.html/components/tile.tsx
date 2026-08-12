import type { TileStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type TileData = {
  text: string;
  text2: string;
};
/** A content tile. */
export default function Tile({ d, cids, styles }: { d: TileData; cids: string[]; styles: TileStyles }) {
  return (
    <div data-cid={cids[0]} className={cn("border border-solid border-border block py-3 px-3.5 rounded-lg bg-surface-4", styles.className)}>
      <b data-cid={cids[1]} className="block text-[1.625rem] font-bold leading-[1.9375rem] tracking-[-0.52px]">
        {d.text}
      </b>
      <span data-cid={cids[2]} className="block mt-0.5 text-color-002 text-[0.8125rem] leading-[1.3125rem]">
        {d.text2}
      </span>
    </div>
  );
}
