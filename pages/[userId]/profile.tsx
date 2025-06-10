import { GetServerSideProps } from "next";
import { getDocuments } from "@/lib/firebase/getDocuments";
import type { GetCollectionConfig } from "@/types/getDocumentsConfig";
import ProfileModule from "@/modules/ProfileModule";
import MainHeader from "@/components/Article/MainHeader";
import MainContainer from "@/components/Article/MainContainer";

type Props = {
  uid: string;
  userId: string;
  userName: string;
};

const UserPage = ({ uid, userId, userName }: Props) => {
  return (
    <>
      <MainHeader title={`${userName}（@${userId}）のプロフィール`}></MainHeader>
      <MainContainer>
        <ProfileModule uid={uid} readonly={true} />
      </MainContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _userId = context.params?.userId as string;

  if (typeof _userId !== "string" || !_userId.startsWith("@")) {
    return { notFound: true };
  }

  const userId = _userId.slice(1);

  const configUserId: GetCollectionConfig = {
    collectionName: "b_user_id",
    conditions: [{ name: "value", operator: "==", value: userId }],
    public_only: false,
    order_by: { field: "timestamp", direction: "desc" },
    limit_num: 1,
  };
  const resUserId = (await getDocuments([configUserId])) as Array<{
    uid: string;
  }>;

  if (resUserId.length === 0) return { notFound: true };

  const uid = resUserId[0].uid;

  const configUid: GetCollectionConfig = {
    collectionName: "b_user_id",
    conditions: [{ name: "uid", operator: "==", value: uid }],
    public_only: false,
    order_by: { field: "timestamp", direction: "desc" },
    limit_num: 1,
  };
  const resUid = (await getDocuments([configUid])) as Array<{
    value: string;
  }>;

  if (resUid.length === 0 || userId !== resUid[0].value)
    return { notFound: true };

  const configName: GetCollectionConfig = {
    collectionName: "b_user_name",
    conditions: [{ name: "uid", operator: "==", value: uid }],
    public_only: false,
    order_by: { field: "timestamp", direction: "desc" },
    limit_num: 1,
  };
  const resName = (await getDocuments([configName])) as Array<{
    value: string;
  }>;

  if (resName.length === 0) return { notFound: true };

  const userName = resName[0].value;

  return { props: { uid, userId, userName } };
};

export default UserPage;
