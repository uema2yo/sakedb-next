import EmailForSignup from "./Form/EmailForSignup";

const SignupInformation = () => {
  const closeDialog = (): void => {
    throw new Error("Function not implemented.");
  }

  return (
    <article>
      <header>
        <h2>ユーザー登録のご案内</h2>
      </header>
      <p>ユーザー登録して…</p>
      <footer>
        <EmailForSignup />
      </footer>
    </article>
  );
};

export default SignupInformation;
