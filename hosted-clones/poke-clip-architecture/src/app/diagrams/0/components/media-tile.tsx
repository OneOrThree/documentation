import type { MediaTileStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type MediaTileData = {
  id: string;
  text: string;
  text2: string;
  text3: string;
};
/** A media tile. */
export default function MediaTile({ d, cids, styles }: { d: MediaTileData; cids: string[]; styles: MediaTileStyles }) {
  return (
    <div data-cid={cids[0]} className={cn("h-[86.3px] block absolute inset-x-0 text-center cursor-pointer", styles.className)} id={d.id}>
      <svg data-cid={cids[1]} className="w-auto h-6.5 inline mb-1 overflow-hidden" data-component="icon" fill="none" height="26" stroke="#16181c" viewBox="0 0 34 26" width="34" strokeWidth="2">
        <rect x="2" y="2" width="30" height="22" rx="2.5" />
        <path d="M2 8.5h30" />
      </svg>
      <div data-cid={cids[2]} className="block text-sm font-extrabold leading-[1.25rem]">
        {d.text}
      </div>
      <div data-cid={cids[3]} className="h-[13.3px] block mt-px text-color-003 [font-family:Consolas,_'Cascadia_Mono',_monospace] text-[0.625rem] leading-[0.8125rem] tracking-[0.28px]">
        {d.text2}
      </div>
      <div data-cid={cids[4]} className={cn("block mt-[0.1875rem] text-color-003 text-[0.6875rem] leading-[0.875rem]", styles.className2)}>
        {d.text3}
      </div>
    </div>
  );
}
