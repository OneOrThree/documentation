import type { NavLink2Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type NavLink2Data = {
  text: string;
  label: string;
};
/** A navigation link. */
export default function NavLink2({ d, cids, styles }: { d: NavLink2Data; cids: string[]; styles: NavLink2Styles }) {
  return (
    <a data-cid={cids[0]} className={cn("h-[40.5px] border border-solid flex py-[0.4375rem] px-[0.9375rem] rounded-[999px] items-center gap-2 text-sm leading-[1.5625rem] cursor-pointer", styles.className)} data-component="button" href="/diagrams/0">
      {" "}
      <b data-cid={cids[1]} className={cn("block [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] font-medium", styles.className2)}>
        {d.text}
      </b>
      {d.label}
    </a>
  );
}
