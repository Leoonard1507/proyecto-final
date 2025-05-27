import ProfileField from "./ProfilrFirld";

interface ProfileDetailsPanelProps {
  name: string;
  usermail: string;
  birthdate: string;
  role: string;
  description: string;
  loading: boolean;
  onEditProfile: () => void;
  onChangePassword: () => void;
}

const ProfileDetailsPanel: React.FC<ProfileDetailsPanelProps> = ({
  name,
  usermail,
  birthdate,
  role,
  description,
  loading,
  onEditProfile,
  onChangePassword,
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

      <div className="flex space-x-4">
        <button
          type="button"
          disabled={loading}
          onClick={onEditProfile}
          className="bg-[#22ec8a] text-black px-4 py-2 rounded-md hover:opacity-70 transition"
        >
          Edit profile
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onChangePassword}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Change password
        </button>
      </div>
    </div>
  );
};

export default ProfileDetailsPanel;
