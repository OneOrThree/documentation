import type { ListRow10Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow10Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow10({ d, cids, styles }: { d: ListRow10Data; cids: string[]; styles: ListRow10Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("flex relative items-start before:content-[''] before:block before:absolute before:top-[0.9375rem] before:right-[14.0625rem] before:-left-[0.9375rem] before:w-[0.9375rem] before:h-0 after:content-[''] after:block after:absolute after:right-[14.9375rem] after:-left-[0.9375rem] after:w-0", styles.className)}>
      <div data-cid={cids[1]} className={cn("h-full border border-solid border-muted block min-w-23 max-w-[14.0625rem] pt-[0.3125rem] pb-1 px-2.5 rounded-sm shrink-0 text-center bg-surface", styles.className2)}>
        <div data-cid={cids[2]} className={cn("block text-[0.6875rem] leading-[0.875rem]", styles.className3)}>
          {d.text}
        </div>
        <div data-cid={cids[3]} className={cn("block mt-px text-color-003 text-[0.5625rem] leading-[0.75rem]", styles.className4)}>
          {d.text2}
        </div>
      </div>
    </li>
  );
}
