import type { Tile3Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile3Data = {
  id: string;
  text: string;
};
/** A content tile. */
export default function Tile3({ d, cids, styles }: { d: Tile3Data; cids: string[]; styles: Tile3Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("w-60 h-23 border border-solid border-color-006 flex absolute left-245 py-1.5 px-2 rounded-[7px] flex-col justify-center items-center text-center bg-surface", styles.className)} id={d.id}>
      <div data-cid={cids[1]} className="block text-[0.8125rem] font-bold leading-[1rem]">
        {d.text}
      </div>
    </div>
  );
}
