import Link from "next/link";
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', type: 'nav-home', label: 'Home' },
  { href: '/pickup-sheets', type: 'nav-pickup-sheets', label: 'Pickup Sheets' },
  { href: '/packing-slips', type: 'nav-packing-slips', label: 'Packing Slips' },
  { href: '/delivery-labels', type: 'nav-delivery-labels', label: 'Delivery Labels' },
  { href: '/order-tracking-sheets', type: 'nav-order-tracking-sheets', label: 'Order Tracking Sheets' },
];

export default function Nav() {
  const router = useRouter();

  return (
    <nav className="flex print:hidden">
      {navItems.map(navItem => (
        <Link
          key={navItem.label}
          href={navItem.href}
          className={`text-link mr-2 ${router.pathname === navItem.href ? 'text-teal-700' : ''}`}
          data-type={navItem.type}
        >
          {navItem.label}
        </Link>
      ))}
    </nav>
  );
}