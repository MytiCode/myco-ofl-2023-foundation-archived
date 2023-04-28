import Head from "next/head"
import Image from 'next/image'
import mytiLogo from '../../public/myti-logo.png'
import Nav from "./Nav"
import Link from "next/link"

interface LayoutProps {
  title?: string
  children: React.ReactNode
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? `${title} |` : ''} MyCo</title>
        <meta name="description" content="Myti Core, It's alive!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="print:p-0">
        <div className="flex flex-col mb-4 print:hidden sticky top-0 bg-white shadow-md">
          <div className="flex items-end mb-2 py-2 p-6">
            <Link
              href="/"
              style={{ position: 'relative', bottom: '-15px' }}
            >
              <Image
                src={mytiLogo}
                alt="Myti"
                priority
                className="pr-4"
                height="75"
              />
            </Link>
            <span className="text-4xl font-bold text-teal-800 leading-none" style={{ marginLeft: '-15px' }}>
              OFL
            </span>
              <span className="text-sm uppercase text-slate-400 leading-none font-bold pl-1" style={{ position: 'relative', top: '-3px' }}>
              Order Fulfillment<br />
              & Logistics
            </span>
          </div>
          <Nav />
        </div>
        <div className="p-4 print:p-0">
          {children}
        </div>
      </main>
    </>
  )
}