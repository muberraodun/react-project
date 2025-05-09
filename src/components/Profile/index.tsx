import type { UserInstance } from "../../models/user";
import AuthSession from "../../utils/session";
import "../profileCalendar.scss";

type ProfileCardProps = {
    profile?: UserInstance;
};

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const roleValue = profile?.role ?? AuthSession.getRoles()
  const displayRole = typeof roleValue === 'object' && roleValue !== null && 'name' in roleValue
    ? (roleValue as { name: string }).name
    : roleValue;

  return (
    <div className="profile-section">
      <div className="profile-info">
        <h2>Welcome, {profile?.name}</h2>
        <p>{profile?.email ?? AuthSession.getEmail()}</p>
        <p>Role: {displayRole}</p>
      </div>
    </div>
  );
};

export default ProfileCard;