import ProfileModule from "@/modules/ProfileModule";

interface Props {
  uid: string
}

const Profile = (props: Props) => {
  return (
    <>
      <h2>プロフィール</h2>
      <ProfileModule uid={props.uid} />
    </>
  );
};

export default Profile;
