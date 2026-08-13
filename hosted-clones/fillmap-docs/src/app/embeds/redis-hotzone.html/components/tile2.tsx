export type Tile2Data = {
  text: string;
  description: string;
};
/** A content tile. */
export default function Tile2({ d, cids }: { d: Tile2Data; cids: string[] }) {
  return (
    <div data-cid={cids[0]} className="border border-solid border-surface-5 block p-4.5 rounded-[14px] bg-surface-9">
      <b data-cid={cids[1]} className="block mb-1.5 text-color-016 text-lg font-bold leading-[1.9375rem]">
        {d.text}
      </b>
      <p data-cid={cids[2]} className="w-full max-w-[35.0375rem] block text-color-007 text-sm leading-6">
        {d.description}
      </p>
    </div>
  );
}
