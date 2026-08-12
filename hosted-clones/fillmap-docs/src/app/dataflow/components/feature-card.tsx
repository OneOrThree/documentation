export type FeatureCardData = {
  title: string;
  description: string;
};
/** A feature card. */
export default function FeatureCard({ d, cids }: { d: FeatureCardData; cids: string[] }) {
  return (
    <div data-cid={cids[0]} className="border border-solid border-surface block py-4.5 px-5 rounded-xl bg-surface-8">
      <h3 data-cid={cids[1]} className="block mb-1.5 text-[0.9375rem] font-bold leading-[1.625rem] tracking-[-0.15px]" data-component="heading">
        {d.title}
      </h3>
      {" "}
      <p data-cid={cids[2]} className="block text-muted text-sm leading-[1.4375rem]">
        {d.description}
      </p>
      {" "}
    </div>
  );
}
