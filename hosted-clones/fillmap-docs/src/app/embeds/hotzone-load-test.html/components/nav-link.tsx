import type { NavLinkStyles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type NavLinkData = {
  href: string;
  label: string;
};
/** A navigation link. */
export default function NavLink({ d, cids, styles }: { d: NavLinkData; cids: string[]; styles: NavLinkStyles }) {
  return (
    <a data-cid={cids[0]} className={cn("block py-1 text-color-002 cursor-pointer", styles.className)} data-component="link" href={d.href}>
      {d.label}
    </a>
  );
}
