import Head from 'next/head'
import Image from 'next/image'
import mytiLogo from '../../public/myti-logo.png'
import aliveImage from '../../public/its-alive.gif'

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
          <Image
            src={mytiLogo}
            alt="Myti"
            priority
            className="my-4"
          />
          <Image
            src={aliveImage}
            alt="It's Alive!!!!!"
            priority
          />
      </main>
    </>
  )
}
