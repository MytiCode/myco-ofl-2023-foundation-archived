import Head from "next/head"
import Image from 'next/image'
import mytiLogo from '../../public/myti-logo.png'
import Link from 'next/link'

interface LayoutProps {
  title?: string
  children: React.ReactNode
}

const navItems = [
  { href: '/', testID: 'nav-home', label: 'Home' },
  { href: '/pickup-sheets', testID: 'nav-pickup-sheets', label: 'Pickup Sheets' },
];

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? `${title} |` : ''} MyCo</title>
        <meta name="description" content="Myti Core, It's alive!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-12 flex flex-col items-center"> 
        <div className="flex items-center mb-4">
          <Image
            src={mytiLogo}
            alt="Myti"
            priority
            className="pr-4"
            height="75"
          />
          <p className="text-3xl">MyCo</p>
        </div>
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
        {children}
      </main>
    </>
  )
}