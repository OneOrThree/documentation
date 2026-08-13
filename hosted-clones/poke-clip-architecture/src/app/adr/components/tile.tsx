export type TileData = {
  label: string;
  text: string;
  text2: string;
  text3: string;
};
/** A content tile. */
export default function Tile({ d, cids }: { d: TileData; cids: string[] }) {
  return (
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className="w-14 border-b border-solid border-b-border table-cell min-w-10 py-2 px-3 align-top [font-family:ui-monospace,_'SF_Mono',_'Cascadia_Mono',_Menlo,_monospace] text-[0.8125rem] leading-5 whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px] max-md:w-[52.3px] max-md:min-w-[37.1px] max-md:py-[0.4625rem] max-md:px-[0.7rem] max-md:text-xs max-md:leading-[1.1875rem] md:max-lg:w-[53.5px] md:max-lg:min-w-[2.4375rem] md:max-lg:px-[11.7px] md:max-lg:leading-[1.25rem]">
        <a data-cid={cids[2]} className="inline underline cursor-pointer [border-collapse:collapse] [border-spacing:2px]" data-component="link" href="/adr/ADR-001_-EC-86-A1-EC-B6-9C-ED-94-84-EB-A1-9C-ED-86-A0-EC-BD-9C">
          {d.label}
        </a>
      </td>
      <td data-cid={cids[3]} className="w-[121.3px] border-b border-solid border-b-border table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[80.3px] max-md:py-2 max-md:px-3 md:max-lg:w-[113.1px] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]">
        {d.text}
      </td>
      <td data-cid={cids[4]} className="w-[451.7px] border-b border-solid border-b-border table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[157.3px] max-md:py-2 max-md:px-3 md:max-lg:w-[24.25rem] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]">
        {d.text2}
      </td>
      <td data-cid={cids[5]} className="w-[83.5px] border-b border-solid border-b-border table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-13.5 max-md:py-2 max-md:px-3 md:max-lg:w-[4.7375rem] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]">
        {d.text3}
      </td>
      <td data-cid={cids[6]} className="w-[85.3px] border-b border-solid border-b-border table-cell min-w-13.5 py-[8.7px] px-[0.8125rem] align-top text-muted-foreground [border-collapse:collapse] [border-spacing:2px] max-md:w-[64.3px] max-md:py-2 max-md:px-3 md:max-lg:w-[81.3px] md:max-lg:py-[8.5px] md:max-lg:px-[12.7px]">
        2026-07-20
      </td>
    </tr>
  );
}
