import type { ListRow11Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow11Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow11({ d, cids, styles }: { d: ListRow11Data; cids: string[]; styles: ListRow11Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("flex relative items-start before:content-[''] before:block before:absolute before:top-[0.9375rem] before:right-[8.1375rem] before:bottom-[1.375rem] before:-left-[0.9375rem] before:w-[0.9375rem] before:h-0 after:content-[''] after:block after:absolute after:right-36 after:-left-[0.9375rem] after:w-0", styles.className)}>
      <div data-cid={cids[1]} className={cn("border border-solid border-muted block min-w-23 max-w-[14.0625rem] pt-[0.3125rem] pb-1 px-2.5 rounded-sm shrink-0 text-center bg-surface", styles.className2)}>
        <div data-cid={cids[2]} className="block text-[0.6875rem] leading-[0.875rem]">
          {d.text}
        </div>
        <div data-cid={cids[3]} className="block mt-px text-color-003 text-[0.5625rem] leading-[0.75rem]">
          {d.text2}
        </div>
      </div>
    </li>
  );
}
