import { useAuth } from "../../hooks/useAuth";
import ProfilePageCommon from "../../components/common/ProfilePageCommon";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <ProfilePageCommon
      initialName={user?.name || "Student"}
      initialEmail={user?.email || ""}
      initialPhone={""}
    />
  );
};

export default ProfilePage;
