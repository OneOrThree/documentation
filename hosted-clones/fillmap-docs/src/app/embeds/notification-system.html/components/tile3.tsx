export type Tile3Data = {
  text: string;
  text2: string;
  text3: string;
};
/** A content tile. */
export default function Tile3({ d, cids }: { d: Tile3Data; cids: string[] }) {
  return (
    <tr data-cid={cids[0]} className="h-[2.425rem] table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text}
      </td>
      <td data-cid={cids[2]} className="h-[2.425rem] border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text2}
      </td>
      <td data-cid={cids[3]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]">
        {d.text3}
      </td>
    </tr>
  );
}
