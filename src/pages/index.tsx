import Layout from ':components/Layout'
import { useContext } from 'react'
import { UserContext } from './_app'

export default function Home() {
  const user = useContext(UserContext);

  return (
    <Layout>
      <p>Welcome to MyCo, {user.userId}!</p>
    </Layout>
  )
}
