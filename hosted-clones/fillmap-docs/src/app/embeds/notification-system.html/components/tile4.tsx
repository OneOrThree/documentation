export type Tile4Data = {
  text: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  text6: string;
};
/** A content tile. */
export default function Tile4({ d, cids }: { d: Tile4Data; cids: string[] }) {
  return (
    <tr data-cid={cids[0]} className="table-row align-middle [border-collapse:collapse] [border-spacing:2px]">
      <td data-cid={cids[1]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text}
      </td>
      <td data-cid={cids[2]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left [border-collapse:collapse] [border-spacing:2px]">
        {d.text2}
      </td>
      <td data-cid={cids[3]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]">
        {d.text3}
      </td>
      <td data-cid={cids[4]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]">
        {d.text4}
      </td>
      <td data-cid={cids[5]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]">
        {d.text5}
      </td>
      <td data-cid={cids[6]} className="border border-solid border-border table-cell py-[0.4375rem] px-2.5 align-top text-left whitespace-nowrap text-nowrap [border-collapse:collapse] [border-spacing:2px]">
        {d.text6}
      </td>
    </tr>
  );
}
