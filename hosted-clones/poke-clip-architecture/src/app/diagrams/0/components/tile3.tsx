import type { Tile3Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type Tile3Data = {
  id: string;
  text: string;
  text2: string;
  text3: string;
  text4: string;
};
/** A content tile. */
export default function Tile3({ d, cids, styles }: { d: Tile3Data; cids: string[]; styles: Tile3Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("min-h-11.5 border border-solid border-color-001 flex relative max-h-37.5 pt-1.5 pb-[0.3125rem] px-[0.5625rem] rounded-md flex-col justify-center gap-px text-center bg-surface cursor-pointer", styles.className)} id={d.id}>
      <span data-cid={cids[1]} className={cn("block text-[0.8125rem] font-bold leading-[0.9375rem]", styles.className2)}>
        {d.text}
      </span>
      <span data-cid={cids[2]} className={cn("block text-color-003 text-[0.625rem] leading-[0.75rem]", styles.className3)}>
        {d.text2}
      </span>
      <span data-cid={cids[3]} className="flex mt-0.5 flex-wrap justify-center gap-[0.3125rem]">
        <span data-cid={cids[4]} className="border border-solid border-color-001 block px-1.5 [font-family:Consolas,_'Cascadia_Mono',_monospace] text-[0.5625rem] leading-[0.8125rem] tracking-[0.36px]">
          {d.text3}
        </span>
        <span data-cid={cids[5]} className="border border-solid border-color-002 block px-1.5 text-color-007 text-[0.5625rem] leading-[0.8125rem] bg-surface-3">
          스트리머
        </span>
        <span data-cid={cids[6]} className="border border-solid border-color-002 block px-1.5 text-color-007 text-[0.5625rem] leading-[0.8125rem] bg-surface-3">
          {d.text4}
        </span>
        <span data-cid={cids[7]} className="border border-solid border-color-012 block px-1.5 text-color-003 [font-family:Consolas,_'Cascadia_Mono',_monospace] text-[0.5625rem] leading-[0.8125rem]">
          auto
        </span>
      </span>
    </div>
  );
}
