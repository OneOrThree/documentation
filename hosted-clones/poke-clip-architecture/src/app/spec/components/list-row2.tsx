import type { ListRow2Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow2Data = {
  text: string;
  text2: string;
  text3: string;
};
/** A list row. */
export default function ListRow2({ d, cids, styles }: { d: ListRow2Data; cids: string[]; styles: ListRow2Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("list-item mt-1.5 text-muted-foreground max-md:mt-[0.3375rem] md:max-lg:mt-[0.35rem]", styles.className)}>
      {d.text}
      <strong data-cid={cids[1]} className="inline text-foreground font-bold">
        {d.text2}
      </strong>
      {d.text3}
    </li>
  );
}
