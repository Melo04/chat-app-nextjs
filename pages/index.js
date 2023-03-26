import Head from 'next/head'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  return (
    <>
      <Head>
        <title>Chat App</title>
      </Head>
      
      <Sidebar/>
    </>
  )
}
