import type { ListRow2Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRow2Data = {
  kind: string;
  ariacurrent?: string;
  label: string;
  label2: string;
};
/** A list row. */
export default function ListRow2({ d, cids, styles }: { d: ListRow2Data; cids: string[]; styles: ListRow2Styles }) {
  return (
    <li data-cid={cids[0]} className="list-item">
      <a data-cid={cids[1]} className={cn("border-l-2 border-solid flex -ml-px py-[5.1px] px-[0.7rem] gap-2 leading-[1.125rem] cursor-pointer", styles.className)} data-component={d.kind} aria-current={d.ariacurrent} href="/adr/ADR-001_-EC-86-A1-EC-B6-9C-ED-94-84-EB-A1-9C-ED-86-A0-EC-BD-9C">
        <span data-cid={cids[2]} className="w-[11.5px] block min-w-[11.5px] pt-[0.1rem] text-color-005 [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-xs leading-[1rem]">
          {d.label}
        </span>
        {d.label2}
      </a>
    </li>
  );
}
