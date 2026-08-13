export type NavLink2Data = {
  href: string;
  label: string;
};
/** A navigation link. */
export default function NavLink2({ d, cids }: { d: NavLink2Data; cids: string[] }) {
  return (
    <a data-cid={cids[0]} className="block py-1 text-color-002 cursor-pointer" data-component="link" href={d.href}>
      {d.label}
    </a>
  );
}
