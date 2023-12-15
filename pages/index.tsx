import type { LoginInfoProps } from "@lib/checkLogin";
import Layout from "@layout";

interface Props {
  loginInfo: LoginInfoProps;
  loginLoading: boolean;
}

const Index = (props: Props) => {
  const { loginInfo, loginLoading } = props;

  return (
    <Layout loginInfo={loginInfo} loginLoading={loginLoading}>
      home
    </Layout>
  );
};

export default Index;
