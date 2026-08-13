import type { ListRow4Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow4Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow4({ d, cids, styles }: { d: ListRow4Data; cids: string[]; styles: ListRow4Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("list-item mt-1.5 text-muted-foreground max-md:mt-[0.3375rem] md:max-lg:mt-[0.35rem]", styles.className)}>
      <strong data-cid={cids[1]} className="inline text-foreground font-bold">
        {d.text}
      </strong>
      {d.text2}
    </li>
  );
}
