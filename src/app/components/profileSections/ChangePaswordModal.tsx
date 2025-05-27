import Input from "../Input";
import { toast } from "react-toastify";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  repeatPassword: string;
  setRepeatPassword: (val: string) => void;
  updateUserProfile: () => Promise<void>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  repeatPassword,
  setRepeatPassword,
  updateUserProfile,
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== repeatPassword) {
      toast("The new passwords do not match.");
      return;
    }

    try {
      await updateUserProfile();
      onClose();
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
    } catch (err) {
      toast("Error updating password.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white text-black p-8 rounded-lg max-w-md w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
          aria-label="Close password modal"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-5">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            type="password"
          />
          <Input
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            type="password"
          />
          <Input
            label="Repeat new password"
            value={repeatPassword}
            onChange={setRepeatPassword}
            type="password"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white w-full p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save New Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
