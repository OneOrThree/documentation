import type { ListRow3Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRow3Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow3({ d, cids, styles }: { d: ListRow3Data; cids: string[]; styles: ListRow3Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("list-item mb-2.5", styles.className)}>
      <b data-cid={cids[1]} className="inline font-bold">
        {d.text}
      </b>
      {d.text2}
    </li>
  );
}
