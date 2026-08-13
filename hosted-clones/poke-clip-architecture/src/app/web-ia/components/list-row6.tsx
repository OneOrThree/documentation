import type { ListRow6Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow6Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow6({ d, cids, styles }: { d: ListRow6Data; cids: string[]; styles: ListRow6Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("h-[49.7px] flex relative items-start before:content-[''] before:block before:absolute before:top-[0.9375rem] before:right-[14.0625rem] before:bottom-[33.7px] before:-left-[0.9375rem] before:w-[0.9375rem] before:h-0 after:content-[''] after:block after:absolute after:right-[14.9375rem] after:-left-[0.9375rem] after:w-0", styles.className)}>
      <div data-cid={cids[1]} className="w-[14.0625rem] h-full border border-solid border-muted block min-w-23 max-w-[14.0625rem] pt-[0.3125rem] pb-1 px-2.5 rounded-sm shrink-0 text-center bg-surface">
        <div data-cid={cids[2]} className="block text-[0.6875rem] leading-[0.875rem]">
          {d.text}
        </div>
        <div data-cid={cids[3]} className="h-[1.4625rem] block mt-px text-color-003 text-[0.5625rem] leading-[0.75rem]">
          {d.text2}
        </div>
      </div>
    </li>
  );
}
