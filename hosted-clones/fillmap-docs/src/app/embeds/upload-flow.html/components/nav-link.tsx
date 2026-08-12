export type NavLinkData = {
  href: string;
  label: string;
};
/** A navigation link. */
export default function NavLink({ d, cids }: { d: NavLinkData; cids: string[] }) {
  return (
    <a data-cid={cids[0]} className="block py-1 text-color-002 cursor-pointer" data-component="link" href={d.href}>
      {d.label}
    </a>
  );
}
