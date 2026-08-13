import type { Tile4Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type Tile4Data = {
  text: string;
  text2: string;
  text3: string;
  text4: string;
};
/** A content tile. */
export default function Tile4({ d, cids, styles }: { d: Tile4Data; cids: string[]; styles: Tile4Styles }) {
  return (
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className={cn("w-[3.05rem] table-cell min-w-10 py-2 px-3 align-top [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-[0.8125rem] leading-5 whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px] max-md:w-[38.3px] max-md:min-w-[37.1px] max-md:py-[0.4625rem] max-md:px-[0.7rem] max-md:text-xs max-md:leading-[1.1875rem] md:max-lg:w-[2.775rem] md:max-lg:min-w-[2.4375rem] md:max-lg:px-[11.7px] md:max-lg:leading-[1.25rem]", styles.className)}>
        {d.text}
      </td>
      <td data-cid={cids[2]} className={cn("w-[184.3px] table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[4.9375rem] max-md:py-2 max-md:px-3 md:max-lg:w-[10.2375rem] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]", styles.className2)}>
        {d.text2}
      </td>
      <td data-cid={cids[3]} className={cn("w-[29.5rem] table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[9.3rem] max-md:py-2 max-md:px-3 md:max-lg:w-[26.2875rem] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]", styles.className3)}>
        {d.text3}
      </td>
      <td data-cid={cids[4]} className={cn("w-[5.8rem] table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[72.3px] max-md:py-2 max-md:px-3 md:max-lg:w-[5.175rem] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]", styles.className4)}>
        <span data-cid={cids[5]} className={cn("inline-block mr-[2.3px] py-[1.1px] px-[5.7px] rounded-[5px] [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-[0.6875rem] font-bold leading-[1.0625rem] [border-collapse:collapse] [border-spacing:2px] max-lg:mr-0.5 max-md:py-px max-md:px-[5.3px] max-md:leading-[1rem] md:max-lg:px-[5.5px]", styles.className5)} data-component="badge">
          {d.text4}
        </span>
      </td>
    </tr>
  );
}
