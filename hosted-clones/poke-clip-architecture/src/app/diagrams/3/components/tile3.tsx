import type { Tile3Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile3Data = {
  id: string;
  text: string;
};
/** A content tile. */
export default function Tile3({ d, cids, styles }: { d: Tile3Data; cids: string[]; styles: Tile3Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("h-21 border border-solid border-color-004 flex absolute top-190 z-3 py-1.5 px-2 rounded-[3px] flex-col justify-center items-center text-center bg-surface cursor-pointer", styles.className)} data-component="button" id={d.id} role="button">
      <div data-cid={cids[1]} className="block text-[0.8125rem] font-bold leading-[1rem]">
        {d.text}
      </div>
    </div>
  );
}
