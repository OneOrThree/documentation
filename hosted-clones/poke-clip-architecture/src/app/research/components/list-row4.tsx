export type ListRow4Data = {
  text: string;
};
/** A list row. */
export default function ListRow4({ d, cids }: { d: ListRow4Data; cids: string[] }) {
  return (
    <li data-cid={cids[0]} className="list-item mt-1.5 text-muted-foreground max-md:mt-[0.3375rem] md:max-lg:mt-[0.35rem]">
      {d.text}
    </li>
  );
}
