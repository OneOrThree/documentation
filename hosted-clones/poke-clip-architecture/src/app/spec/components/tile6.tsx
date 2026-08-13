import type { Tile6Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type Tile6Data = {
  text: string;
  text2: string;
  text3: string;
};
/** A content tile. */
export default function Tile6({ d, cids, styles }: { d: Tile6Data; cids: string[]; styles: Tile6Styles }) {
  return (
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className={cn("w-[8.1625rem] table-cell min-w-10 py-2 px-3 align-top [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-[0.8125rem] leading-5 whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px] max-md:w-[121.3px] max-md:min-w-[37.1px] max-md:py-[0.4625rem] max-md:px-[0.7rem] max-md:text-xs max-md:leading-[1.1875rem] md:max-lg:w-[7.975rem] md:max-lg:min-w-[2.4375rem] md:max-lg:px-[11.7px] md:max-lg:leading-[1.25rem]", styles.className)}>
        <strong data-cid={cids[2]} className="inline font-bold [border-collapse:collapse] [border-spacing:2px]">
          {d.text}
        </strong>
      </td>
      <td data-cid={cids[3]} className={cn("w-[17rem] table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[7.25rem] max-md:py-2 max-md:px-3 md:max-lg:w-[15.625rem] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]", styles.className2)}>
        {d.text2}
      </td>
      <td data-cid={cids[4]} className={cn("w-[395.3px] table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[6.3125rem] max-md:py-2 max-md:px-3 md:max-lg:w-[20.875rem] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]", styles.className3)}>
        {d.text3}
      </td>
    </tr>
  );
}
