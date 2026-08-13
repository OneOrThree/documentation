import type { ListRow3Styles } from "../_styles";
import { cn } from "../../../../lib/utils";
export type ListRow3Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow3({ d, cids, styles }: { d: ListRow3Data; cids: string[]; styles: ListRow3Styles }) {
  return (
    <li data-cid={cids[0]} className={cn("h-7 list-item my-[0.3rem] text-muted-foreground", styles.className)}>
      <a data-cid={cids[1]} className="inline text-primary underline cursor-pointer" data-component="link" href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
