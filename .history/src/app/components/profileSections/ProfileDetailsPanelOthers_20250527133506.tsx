import ProfileField from "./ProfilrFirld";

interface ProfileDetailsPanelProps {
  //name: string;
  //usermail: string;
  //birthdate: string;
  //role: string;
  description: string;
}

const ProfileDetailsPanel: React.FC<ProfileDetailsPanelProps> = ({
  //name,
  //usermail,
  //birthdate,
  //role,
  description,
}) => {
  return (
    <div className="border rounded-xl shadow-inner p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <ProfileField label="Description" value={description} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsPanel;
