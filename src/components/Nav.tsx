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
    <nav className="flex print:hidden -ml-1 p-3 mt-2 border-slate-200 bg-teal-900">
      {navItems.map(navItem => (
        <Link
          key={navItem.label}
          href={navItem.href}
          className={`p-4 py-2 mr-2 text-lg ${router.pathname === navItem.href ? 'bg-teal-950 text-white rounded-md' : 'text-slate-100'}`}
          data-type={navItem.type}
        >
          {navItem.label}
        </Link>
      ))}
    </nav>
  );
}