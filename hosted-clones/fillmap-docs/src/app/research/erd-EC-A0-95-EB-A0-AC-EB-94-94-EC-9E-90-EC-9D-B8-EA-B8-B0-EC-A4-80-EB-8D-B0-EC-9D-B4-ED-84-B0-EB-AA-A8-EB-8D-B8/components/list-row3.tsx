import type { ListRow3Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRow3Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow3({ d, cids, styles }: { d: ListRow3Data; cids: string[]; styles: ListRow3Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("h-7 list-item my-[0.3rem] text-muted-foreground", styles.className)}>
      <strong data-cid={cids[1]} className="inline text-foreground [font-weight:650]">
        {d.text}
      </strong>
      {d.text2}
    </li>
  );
}
