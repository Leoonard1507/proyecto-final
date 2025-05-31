import { changePasswordSchema } from "@/app/schema/changePasswordSchema";
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

  try {
    // Validar los campos con Zod
    changePasswordSchema.parse({
      currentPassword,
      newPassword,
      repeatPassword,
    });

    await updateUserProfile();
    setCurrentPassword("");
    setNewPassword("");
    setRepeatPassword("");
  } catch (err: any) {
    // Si es un error de Zod, mostramos los mensajes del schema
    if (err.name === "ZodError") {
      const messages = err.errors.map((e: any) => e.message).join(", ");
      toast.error(messages);
    } else {
      toast.error("Error updating password.");
      console.error(err);
    }
  }
};


  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#1a1b2e]  p-6 rounded-lg max-w-xl w-full relative shadow-lg space-y-4">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition-colors duration-200 text-4xl"
          aria-label="Close modal"
          onClick={() => onClose()}
        >
          &times;
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
