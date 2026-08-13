import type { Tile5Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile5Data = {
  id: string;
  text: string;
};
/** A content tile. */
export default function Tile5({ d, cids, styles }: { d: Tile5Data; cids: string[]; styles: Tile5Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("h-17 border border-solid border-color-006 flex absolute top-[14.6875rem] py-1.5 px-2 rounded-[7px] flex-col justify-center items-center text-center bg-surface", styles.className)} id={d.id}>
      <div data-cid={cids[1]} className="block text-[0.8125rem] font-bold leading-[1rem]">
        {d.text}
      </div>
    </div>
  );
}
