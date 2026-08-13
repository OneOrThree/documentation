export type Tile2Data = {
  text: string;
  text2: string;
  text3: string;
  text4: string;
};
/** A content tile. */
export default function Tile2({ d, cids }: { d: Tile2Data; cids: string[] }) {
  return (
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text}
      </td>
      <td data-cid={cids[2]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        <code data-cid={cids[3]} className="border border-solid border-border inline py-px px-[0.3125rem] rounded-sm [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_Menlo,_Consolas,_monospace] text-xs leading-[1.3125rem] bg-surface-3 [border-collapse:collapse] [border-spacing:2px]">
          {d.text2}
        </code>
        {d.text3}
      </td>
      <td data-cid={cids[4]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text4}
      </td>
    </tr>
  );
}
