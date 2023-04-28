import Layout from ':components/Layout'
import { useContext } from 'react'
import { UserContext } from './_app'

export default function Home() {
  const user = useContext(UserContext);

  return (
    <Layout>
      <p className="text-3xl text-slate-600">Welcome, Willkommen, Shalom, Bonjour, ¡Hola! {user.userId}!</p>
    </Layout>
  )
}
