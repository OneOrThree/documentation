import type { ListRow8Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow8Data = {
  text: string;
};
/** A list row. */
export default function ListRow8({ d, cids, styles }: { d: ListRow8Data; cids: string[]; styles: ListRow8Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("flex relative items-start before:content-[''] before:block before:absolute before:top-[0.9375rem] before:right-[7.6375rem] before:bottom-[9.3px] before:-left-[0.9375rem] before:w-[0.9375rem] before:h-0 after:content-[''] after:block after:absolute after:right-[8.5125rem] after:-left-[0.9375rem] after:w-0", styles.className)}>
      <div data-cid={cids[1]} className={cn("border border-solid border-muted block min-w-23 max-w-[14.0625rem] pt-[0.3125rem] pb-1 px-2.5 rounded-sm shrink-0 text-center bg-surface", styles.className2)}>
        <div data-cid={cids[2]} className="block text-[0.6875rem] leading-[0.875rem]">
          {d.text}
        </div>
      </div>
    </li>
  );
}
