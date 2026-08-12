import type { ListRow5Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow5Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow5({ d, cids, styles }: { d: ListRow5Data; cids: string[]; styles: ListRow5Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("h-[1.7rem] list-item mt-1.5 text-muted-foreground max-md:mt-[0.3375rem] md:max-lg:h-[26.5px] md:max-lg:mt-[0.35rem]", styles.className)}>
      <strong data-cid={cids[1]} className="inline text-foreground font-bold">
        {d.text}
      </strong>
      {d.text2}
    </li>
  );
}
