import Layout from "@layout"
const Index = (loginInfo: { uid: string; user: boolean; admin: boolean; status: number; } | null) => {
  return(
    <Layout loginInfo={loginInfo}>
    home
    </Layout>  
  )
}

export default Index;
