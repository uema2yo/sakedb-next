import ArticleContainer from "./Article/ArticleContainer";
import ArticleHeader from "./Article/ArticleHeader";
import Title from "./Article/Title";
import EmailForSignup from "./Form/EmailForSignup";

const SignupInformation = () => {
  const closeDialog = (): void => {
    throw new Error("Function not implemented.");
  }

  return (
    <article>
      <ArticleHeader title="ユーザー登録のご案内" />
      <ArticleContainer>
      <p>
        ユーザー登録を行うと、レビューやコメントをご投稿いただけます。
        また、独自ツールにより投稿内容の傾向などを分析することが可能です。
      </p> 
      <p>
        ユーザー登録は無料で行えます。以下のフォームからメールアドレスを入力して、ユーザー登録を行ってください。
      </p>
      <p>
        ユーザー登録後、メールアドレスに確認メールが送信されます。メールに記載されたリンクをクリックして、ユーザー登録を完了してください。
      </p>
      </ArticleContainer>
      <footer>
        <EmailForSignup variant="outline" />
      </footer>
    </article>
  );
};

export default SignupInformation;
