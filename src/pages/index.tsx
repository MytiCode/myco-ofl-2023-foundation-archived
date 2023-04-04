import Head from 'next/head'
import Image from 'next/image'
import mytiLogo from '../../public/myti-logo.png'

export default function Home() {
  return (
    <>
      <Head>
        <title>MyCo</title>
        <meta name="description" content="Myti Core, It's alive!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main> 
          <Image
            src={mytiLogo}
            alt="Myti"
            priority
          />
      </main>
    </>
  )
}
