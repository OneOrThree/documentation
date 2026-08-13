import type { Tile2Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type Tile2Data = {
  text: string;
  text2: string;
  text3: string;
};
/** A content tile. */
export default function Tile2({ d, cids, styles }: { d: Tile2Data; cids: string[]; styles: Tile2Styles }) {
  return (
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className={cn("w-[2.5625rem] table-cell min-w-10 py-2 px-3 align-top [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-[0.8125rem] leading-5 whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px] max-md:w-[38.3px] max-md:min-w-[37.1px] max-md:py-[0.4625rem] max-md:px-[0.7rem] max-md:text-xs max-md:leading-[1.1875rem] md:max-lg:w-[39.5px] md:max-lg:min-w-[2.4375rem] md:max-lg:px-[11.7px] md:max-lg:leading-[1.25rem]", styles.className)}>
        {d.text}
      </td>
      <td data-cid={cids[2]} className={cn("w-[7.1rem] table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[3.625rem] max-md:py-2 max-md:px-3 md:max-lg:w-[101.7px] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]", styles.className2)}>
        {d.text2}
      </td>
      <td data-cid={cids[3]} className={cn("w-[35.325rem] table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[10.6125rem] max-md:py-2 max-md:px-3 md:max-lg:w-[31.0625rem] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]", styles.className3)}>
        {d.text3}
      </td>
      <td data-cid={cids[4]} className={cn("w-[78.1px] table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[72.3px] max-md:py-2 max-md:px-3 md:max-lg:w-[73.5px] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]", styles.className4)}>
        <span data-cid={cids[5]} className="inline-block mr-[2.3px] py-[1.1px] px-[5.7px] rounded-[5px] text-color-018 [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-[0.6875rem] font-bold leading-[1.0625rem] bg-color-019 [border-collapse:collapse] [border-spacing:2px] max-lg:mr-0.5 max-md:py-px max-md:px-[5.3px] max-md:leading-[1rem] md:max-lg:px-[5.5px]" data-component="badge">
          P1
        </span>
      </td>
    </tr>
  );
}
