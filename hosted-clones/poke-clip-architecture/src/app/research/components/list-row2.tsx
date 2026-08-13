export type ListRow2Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow2({ d, cids }: { d: ListRow2Data; cids: string[] }) {
  return (
    <li data-cid={cids[0]} className="h-[1.7rem] list-item mt-1.5 text-muted-foreground max-md:h-[50.5px] max-md:mt-[0.3375rem] md:max-lg:h-[26.5px] md:max-lg:mt-[0.35rem]">
      {d.text}
      <strong data-cid={cids[1]} className="inline text-foreground font-bold">
        {d.text2}
      </strong>
      .
    </li>
  );
}
