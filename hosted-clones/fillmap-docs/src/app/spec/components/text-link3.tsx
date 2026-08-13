import type { TextLink3Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type TextLink3Data = {
  label: string;
  label2: string;
};
/** A text link. */
export default function TextLink3({ d, cids, styles }: { d: TextLink3Data; cids: string[]; styles: TextLink3Styles }) {
  return (
    <a data-cid={cids[0]} className="border-b border-solid border-b-surface-2 grid py-[1.0625rem] px-2 items-center gap-4 grid-rows-[31.5px] cursor-pointer grid-cols-[46px_1fr_auto] max-md:grid-cols-[34px_269px] max-md:grid-rows-[31.5px_22.75px]" data-component="link" href="/spec/EA-B0-9C-EC-9D-B8-EB-8F-84-EA-B0-90-ED-99-94-EB-A9-B4-ED-99-95-EC-A0-95-ux-api-EC-84-A4-EA-B3-84">
      {" "}
      <span data-cid={cids[1]} className="block min-w-0 text-muted [font-family:ui-monospace,_SFMono-Regular,_'SF_Mono',_'JetBrains_Mono',_Menlo,_monospace] text-lg leading-[2rem]">
        {d.label}
      </span>
      {" "}
      <span data-cid={cids[2]} className={cn("block min-w-0", styles.className)}>
        {" "}
        <span data-cid={cids[3]} className="inline [font-weight:650] tracking-[-0.24px]">
          {d.label2}
        </span>
        {" "}
      </span>
      {" "}
      <span data-cid={cids[4]} className="flex min-w-0 justify-end items-center gap-3 text-muted text-[0.8125rem] leading-[1.4375rem] whitespace-nowrap text-nowrap max-md:col-start-2">
        {"  →\n"}
      </span>
      {" "}
    </a>
  );
}
