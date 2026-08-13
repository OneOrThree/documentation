import type { MediaTile3Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type MediaTile3Data = {
  id: string;
  text: string;
};
/** A media tile. */
export default function MediaTile3({ d, cids, styles }: { d: MediaTile3Data; cids: string[]; styles: MediaTile3Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("h-[3.8rem] flex absolute top-90 flex-col items-center text-center", styles.className)} id={d.id}>
      <div data-cid={cids[1]} className="w-10.5 h-10.5 flex rounded-[10px] justify-center items-center shrink-0 bg-color-041 shadow-[var(--clr-29)_0px_1px_3px_0px]">
        <svg data-cid={cids[2]} className="w-auto h-7.5 block overflow-hidden" data-component="icon" fill="none" height="30" stroke="#fff" viewBox="0 0 34 34" width="30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <g>
            <rect x="6" y="7" width="16" height="10" rx="2" />
            <rect x="12" y="16" width="16" height="10" rx="2" />
            <path d="M15 21h10M15 21l2-2M15 21l2 2" />
          </g>
        </svg>
      </div>
      {" "}
      <div data-cid={cids[3]} className="block mt-[0.3125rem] text-[0.6875rem] [font-weight:750] leading-[0.875rem]">
        {d.text}
      </div>
      {" "}
    </div>
  );
}
