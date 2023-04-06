import Link from "next/link";

const navItems = [
  { href: '/', testID: 'nav-home', label: 'Home' },
  { href: '/pickup-sheets', testID: 'nav-pickup-sheets', label: 'Pickup Sheets' },
  { href: '/packing-slips', testID: 'nav-packing-slips', label: 'Packing Slips' },
];

export default function Nav() {
  return (
    <nav className="flex">
      {navItems.map(navItem => (
        <Link
          key={navItem.label}
          href={navItem.href}
          className="text-link mr-2"
          data-testid={navItem.testID}
        >
          {navItem.label}
        </Link>
      ))}
    </nav>
  );
}