export type TextLinkData = {
  href: string;
  label: string;
  label2: string;
  label3: string;
};
/** A text link. */
export default function TextLink({ d, cids }: { d: TextLinkData; cids: string[] }) {
  return (
    <a data-cid={cids[0]} className="border-b border-solid border-b-surface-2 grid py-[1.0625rem] px-2 items-center gap-4 grid-rows-[31.5px] cursor-pointer grid-cols-[46px_1fr_auto] max-md:grid-cols-[34px_269px] max-md:grid-rows-[31.5px_27.25px]" data-component="link" href={d.href}>
      {" "}
      <span data-cid={cids[1]} className="block min-w-0 text-muted [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-lg leading-[2rem]">
        {d.label}
      </span>
      {" "}
      <span data-cid={cids[2]} className="block min-w-0 [font-weight:650] tracking-[-0.24px]">
        {d.label2}
      </span>
      {" "}
      <span data-cid={cids[3]} className="flex min-w-0 justify-end items-center gap-3 text-muted text-[0.8125rem] leading-[1.4375rem] whitespace-nowrap text-nowrap max-md:col-start-2">
        {" "}
        <span data-cid={cids[4]} className="border border-solid border-surface block max-w-33 py-[0.1875rem] px-[0.5625rem] rounded-[999px] overflow-hidden [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-[0.6875rem] leading-[1.1875rem] tracking-[0.88px] uppercase">
          {d.label3}
        </span>
        {"→\n"}
      </span>
      {" "}
    </a>
  );
}
