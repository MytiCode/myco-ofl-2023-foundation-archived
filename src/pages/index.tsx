import Head from 'next/head'
import Image from 'next/image'
import mytiLogo from '../../public/myti-logo.png'
import aliveImage from '../../public/its-alive.gif'
import { OrderList } from '@/orders/OrderList'

export default function Home() {
  return (
    <>
      <Head>
        <title>MyCo</title>
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
          <OrderList />
      </main>
    </>
  )
}
