import SignupDialogButton from "./SignupDialogButton";

const SignupInformation = () => {

  return (
    <article>
      <header>
        <h2>ユーザー登録のご案内</h2>
      </header>
      <p>ユーザー登録して…</p>
      <footer>
        <SignupDialogButton />
      </footer>
    </article>
  );
};

export default SignupInformation;
