import type { NavLinkStyles } from "../_styles";
import { cn } from "../../lib/utils";
export type NavLinkData = {
  ariacurrent?: string;
  href: string;
  label: string;
};
/** A navigation link. */
export default function NavLink({ d, cids, styles }: { d: NavLinkData; cids: string[]; styles: NavLinkStyles }) {
  return (
    <a data-cid={cids[0]} className={cn("block py-1.5 px-3 rounded-[999px] text-sm leading-[1.5625rem] whitespace-nowrap text-nowrap cursor-pointer", styles.className)} data-component="link" aria-current={d.ariacurrent} href={d.href}>
      {d.label}
    </a>
  );
}
