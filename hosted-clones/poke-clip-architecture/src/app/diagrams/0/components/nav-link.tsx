import type { NavLinkStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type NavLinkData = {
  ariacurrent?: string;
  href: string;
  label: string;
  label2: string;
};
/** A navigation link. */
export default function NavLink({ d, cids, styles }: { d: NavLinkData; cids: string[]; styles: NavLinkStyles }) {
  return (
    <a data-cid={cids[0]} className={cn("h-[2.575rem] border border-solid flex py-[0.4rem] pr-[0.95rem] pl-2 rounded-[999px] items-center gap-[0.55rem] text-sm leading-[1.4375rem] cursor-pointer", styles.className)} data-component="button" aria-current={d.ariacurrent} href={d.href}>
      <span data-cid={cids[1]} className={cn("w-[1.65rem] h-[1.65rem] grid rounded-[50%] items-center grid-rows-[26.4px] justify-items-center [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-[0.8125rem] font-bold leading-[1.3125rem] grid-cols-[minmax(0,_1fr)]", styles.className2)}>
        {d.label}
      </span>
      {d.label2}
    </a>
  );
}
