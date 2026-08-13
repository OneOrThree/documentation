import type { MediaTile4Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type MediaTile4Data = {
  id: string;
  text: string;
  text2: string;
  text3: string;
};
/** A media tile. */
export default function MediaTile4({ d, cids, styles }: { d: MediaTile4Data; cids: string[]; styles: MediaTile4Styles }) {
  return (
    <div data-cid={cids[0]} className={cn("flex absolute top-203 flex-col items-center text-center", styles.className)} id={d.id}>
      <div data-cid={cids[1]} className="w-13 h-13 flex rounded-xl justify-center items-center shrink-0 bg-color-024 shadow-[var(--clr-29)_0px_1px_3px_0px]">
        <svg data-cid={cids[2]} className="w-auto h-7.5 block overflow-hidden" data-component="icon" fill="none" height="30" stroke="#fff" viewBox="0 0 34 34" width="30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <g>
            <path d="M17 5l11 6v12l-11 6-11-6V11z" />
            <path d="M17 17v12M17 17l11-6M17 17l-11-6" />
          </g>
        </svg>
      </div>
      {" "}
      <div data-cid={cids[3]} className="block mt-[0.4375rem] text-[0.8125rem] [font-weight:750] leading-[1rem]">
        {d.text}
      </div>
      <div data-cid={cids[4]} className="block mt-0.5 text-color-011 text-[0.625rem] font-medium leading-[0.8125rem]">
        {d.text2}
      </div>
      <span data-cid={cids[5]} className={cn("border border-solid block mt-[0.1875rem] py-px px-1.5 rounded-[999px] text-[0.5625rem] font-extrabold leading-2.5", styles.className2)}>
        {d.text3}
      </span>
      {" "}
    </div>
  );
}
