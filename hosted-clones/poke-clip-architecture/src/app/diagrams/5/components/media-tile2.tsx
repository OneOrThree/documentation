import type { MediaTile2Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type MediaTile2Data = {
  id: string;
  text: string;
  text2: string;
};
/** A media tile. */
export default function MediaTile2({ d, cids, styles }: { d: MediaTile2Data; cids: string[]; styles: MediaTile2Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("h-[4.65rem] flex absolute top-90 flex-col items-center text-center", styles.className)} id={d.id}>
      <div data-cid={cids[1]} className="w-10.5 h-10.5 flex rounded-[10px] justify-center items-center shrink-0 bg-color-053 shadow-[var(--clr-29)_0px_1px_3px_0px]">
        <svg data-cid={cids[2]} className="w-auto h-7.5 block overflow-hidden" data-component="icon" fill="none" height="30" stroke="#fff" viewBox="0 0 34 34" width="30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <g>
            <path d="M8 11h18l-2 16a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" />
            <path d="M8 11c0-2 4-3 9-3s9 1 9 3" />
          </g>
        </svg>
      </div>
      {" "}
      <div data-cid={cids[3]} className="block mt-[0.3125rem] text-[0.6875rem] [font-weight:750] leading-[0.875rem]">
        {d.text}
      </div>
      <div data-cid={cids[4]} className="block mt-0.5 text-color-011 text-[0.5625rem] font-medium leading-[0.75rem]">
        {d.text2}
      </div>
      {" "}
    </div>
  );
}
