export type ListRow2Data = {
  text: string;
};
/** A list row. */
export default function ListRow2({ d, cids }: { d: ListRow2Data; cids: string[] }) {
  return (
    <li data-cid={cids[0]} className="list-item my-[0.3rem] text-muted-foreground">
      {d.text}
    </li>
  );
}
