export type ListRowData = {
  text: string;
};
/** A list row. */
export default function ListRow({ d, cids }: { d: ListRowData; cids: string[] }) {
  return (
    <li data-cid={cids[0]} className="list-item my-[0.3rem]">
      {d.text}
    </li>
  );
}
