import Link from "next/link";

const navItems = [
  { href: '/', type: 'nav-home', label: 'Home' },
  { href: '/pickup-sheets', type: 'nav-pickup-sheets', label: 'Pickup Sheets' },
  { href: '/packing-slips', type: 'nav-packing-slips', label: 'Packing Slips' },
];

export default function Nav() {
  return (
    <nav className="flex print:hidden">
      {navItems.map(navItem => (
        <Link
          key={navItem.label}
          href={navItem.href}
          className="text-link mr-2"
          data-type={navItem.type}
        >
          {navItem.label}
        </Link>
      ))}
    </nav>
  );
}