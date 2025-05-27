import ProfileField from "./ProfilrFirld";

interface ProfileDetailsPanelProps {
  name: string;
  usermail: string;
  birthdate: string;
  role: string;
  description: string;
  loading: boolean;
}

const ProfileDetailsPanel: React.FC<ProfileDetailsPanelProps> = ({
  name,
  usermail,
  birthdate,
  role,
  description,
}) => {
  return (
    <div className="border rounded-xl shadow-inner p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProfileField label="Name" value={name} />
        <ProfileField label="Mail" value={usermail} />
        <ProfileField label="Birthdate" value={birthdate} />
        <ProfileField label="Role" value={role} />
        <div className="sm:col-span-2">
          <ProfileField label="Description" value={description} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsPanel;
