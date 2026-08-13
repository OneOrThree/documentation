export type TileData = {
  text: string;
  text2: string;
  text3: string;
};
/** A content tile. */
export default function Tile({ d, cids }: { d: TileData; cids: string[] }) {
  return (
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className="border border-solid border-surface table-cell py-2 px-3 align-top leading-[1.375rem] text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text}
      </td>
      <td data-cid={cids[2]} className="border border-solid border-surface table-cell py-2 px-3 align-top leading-[1.375rem] text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text2}
      </td>
      <td data-cid={cids[3]} className="border border-solid border-surface table-cell py-2 px-3 align-top leading-[1.375rem] text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text3}
      </td>
    </tr>
  );
}
