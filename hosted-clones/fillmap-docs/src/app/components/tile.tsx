export type TileData = {
  text: string;
  text2: string;
};
/** A content tile. */
export default function Tile({ d, cids }: { d: TileData; cids: string[] }) {
  return (
    <div data-cid={cids[0]} className="w-33 border border-solid border-surface flex min-w-33 py-3 px-4.5 rounded-xl flex-col gap-0.5 bg-surface-8">
      <b data-cid={cids[1]} className="block text-primary [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-[0.6875rem] font-semibold leading-[1.125rem] tracking-[1.26px] uppercase">
        {d.text}
      </b>
      {" "}
      <span data-cid={cids[2]} className="block [font-weight:650] tracking-[-0.24px]">
        {d.text2}
      </span>
      {" "}
    </div>
  );
}
