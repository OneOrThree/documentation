import type { TextLinkStyles } from "../_styles";
import { cn } from "../../../lib/utils";
export type TextLinkData = {
  href: string;
  label: string;
  label2: string;
  label3: string;
};
/** A text link. */
export default function TextLink({ d, cids, styles }: { d: TextLinkData; cids: string[]; styles: TextLinkStyles }) {
  return (
    <a data-cid={cids[0]} className={cn("border-b border-solid border-b-surface-2 grid py-[1.0625rem] px-2 items-center gap-4 grid-rows-[31.5px] cursor-pointer grid-cols-[46px_1fr_auto] max-md:grid-cols-[34px_269px]", styles.className)} data-component="link" href={d.href}>
      {" "}
      <span data-cid={cids[1]} className="block min-w-0 text-muted [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-lg leading-[2rem]">
        {d.label}
      </span>
      {" "}
      <span data-cid={cids[2]} className={cn("h-7 block min-w-0", styles.className2)}>
        {" "}
        <span data-cid={cids[3]} className="inline [font-weight:650] tracking-[-0.24px]">
          {d.label2}
        </span>
        {" "}
        <span data-cid={cids[4]} className="inline mt-0.5 text-muted text-sm leading-[1.375rem]">
          {d.label3}
        </span>
        {" "}
      </span>
      {" "}
      <span data-cid={cids[5]} className="flex min-w-0 justify-end items-center gap-3 text-muted text-[0.8125rem] leading-[1.4375rem] whitespace-nowrap text-nowrap max-md:col-start-2">
        {" "}
        <span data-cid={cids[6]} className="border border-solid border-clr-1 block max-w-33 py-[0.1875rem] px-[0.5625rem] rounded-[999px] overflow-hidden text-primary [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-[0.6875rem] leading-[1.1875rem] tracking-[0.88px] uppercase bg-surface-6">
          해설
        </span>
        {"→\n"}
      </span>
      {" "}
    </a>
  );
}
