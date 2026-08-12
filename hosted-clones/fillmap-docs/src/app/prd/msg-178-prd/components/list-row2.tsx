import type { ListRow2Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRow2Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow2({ d, cids, styles }: { d: ListRow2Data; cids: string[]; styles: ListRow2Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("list-item my-[0.3rem] text-muted-foreground", styles.className)}>
      <strong data-cid={cids[1]} className="inline text-foreground [font-weight:650]">
        {d.text}
      </strong>
      {d.text2}
    </li>
  );
}
