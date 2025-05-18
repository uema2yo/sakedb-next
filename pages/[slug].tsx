// pages/[slug].tsx
import { GetServerSideProps } from "next";

type Props = { username: string };

export default function UserPage({ username }: Props) {
  return <h1>{`@${username} のプロフィールページ`}</h1>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string" || !slug.startsWith("@")) {
    return { notFound: true };
  }

  const username = slug.slice(1); // @ を除く
  // ここでデータベース照会など
  const userExists = true; // ← 仮に存在するとする

  if (!userExists) return { notFound: true };

  return { props: { username } };
};
