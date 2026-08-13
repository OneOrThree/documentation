export type ListRow3Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow3({ d, cids }: { d: ListRow3Data; cids: string[] }) {
  return (
    <li data-cid={cids[0]} className="h-14 list-item my-[0.3rem] text-muted-foreground max-md:h-28">
      <strong data-cid={cids[1]} className="inline text-foreground [font-weight:650]">
        {d.text}
      </strong>
      {d.text2}
    </li>
  );
}
