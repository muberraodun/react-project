import type { UserInstance } from "../../models/user";
import AuthSession from "../../utils/session";
import { EmailIcon, RoleIcon } from "./icons";
import "../profileCalendar.scss";

type ProfileCardProps = {
  profile?: UserInstance;
};

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const roleValue = profile?.role ?? AuthSession.getRoles();
  const displayRole = typeof roleValue === 'object' && roleValue !== null && 'name' in roleValue
    ? (roleValue as { name: string }).name
    : roleValue;
  
  const nameInitial = profile?.name ? profile.name.charAt(0).toUpperCase() : 'U';
  
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    weekday: 'long'
  };
  const currentDate = now.toLocaleDateString('en-EN', options);
  
  return (
    <div className="admin-profile-card">
      <div className="admin-profile-content">
        <div className="admin-avatar">
          {nameInitial}
        </div>
        <div className="admin-details">
          <h2 className="admin-welcome">Welcome, <span className="admin-name">{profile?.name || AuthSession.getName() || 'Kullanıcı'}</span></h2>
          <div className="admin-info-container">
            <div className="admin-info-item">
              <EmailIcon />
              <span className="admin-info-text">{profile?.email ?? AuthSession.getEmail()}</span>
            </div>
            <div className="admin-info-item">
              <RoleIcon />
              <span className="admin-info-text admin-role">{displayRole}</span>
            </div>
          </div>
        </div>
        <div className="admin-date">
          {currentDate}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 