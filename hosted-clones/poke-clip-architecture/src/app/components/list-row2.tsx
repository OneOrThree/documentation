import type { ListRow2Styles } from "../_styles";
import { cn } from "../../lib/utils";
export type ListRow2Data = {
  href: string;
  label: string;
  label2: string;
  label3: string;
};
/** A list row. */
export default function ListRow2({ d, cids, styles }: { d: ListRow2Data; cids: string[]; styles: ListRow2Styles }) {
  return (
    <li data-cid={cids[0]} className="list-item">
      <a data-cid={cids[1]} className={cn("border-b border-solid border-b-border grid py-[0.9rem] px-[0.4rem] items-center gap-4 grid-rows-[39.6px] cursor-pointer grid-cols-[51.19px_1fr_auto_32px]", styles.className)} data-component="link" href={d.href}>
        <span data-cid={cids[2]} className="block text-color-005 [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-2xl font-bold leading-[2.5rem] max-md:text-lg max-md:leading-[1.875rem]">
          {d.label}
        </span>
        <span data-cid={cids[3]} className="block font-semibold">
          {d.label2}
        </span>
        <span data-cid={cids[4]} className="border border-solid border-border block py-[0.15rem] px-[0.6rem] rounded-[999px] text-color-005 [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-[0.6875rem] leading-[1.125rem] tracking-[1.09px] uppercase whitespace-nowrap text-nowrap">
          {d.label3}
        </span>
        <span data-cid={cids[5]} className="block text-color-005 max-md:hidden" aria-hidden="true">
          →
        </span>
      </a>
    </li>
  );
}
