import type { Tile4Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile4Data = {
  id: string;
  text: string;
};
/** A content tile. */
export default function Tile4({ d, cids, styles }: { d: Tile4Data; cids: string[]; styles: Tile4Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("h-27.5 border border-solid border-color-004 flex absolute top-322.5 z-3 py-1.5 px-2 rounded-[3px] flex-col justify-center items-center text-center bg-surface cursor-pointer", styles.className)} data-component="button" id={d.id} role="button">
      <div data-cid={cids[1]} className="block text-[0.8125rem] font-bold leading-[1rem]">
        {d.text}
      </div>
    </div>
  );
}
