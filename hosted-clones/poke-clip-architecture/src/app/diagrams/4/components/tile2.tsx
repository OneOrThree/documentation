import type { Tile2Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile2Data = {
  id: string;
  text: string;
  text2: string;
};
/** A content tile. */
export default function Tile2({ d, cids, styles }: { d: Tile2Data; cids: string[]; styles: Tile2Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("border border-solid border-color-006 flex absolute py-1.5 px-2 rounded-[7px] flex-col justify-center items-center text-center", styles.className)} id={d.id}>
      <div data-cid={cids[1]} className="block text-[0.8125rem] font-bold leading-[1rem]">
        {d.text}
      </div>
      <div data-cid={cids[2]} className="block mt-[0.1875rem] text-color-023 text-[0.6875rem] font-medium leading-[0.875rem]">
        {d.text2}
      </div>
    </div>
  );
}
