import Image from "next/image";
import Input from "../Input";
import FavoriteMoviesSection from "./addFavoritesModal"; 

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  avatar: string;
  setAvatar: (url: string) => void;
  name: string;
  setName: (val: string) => void;
  nickname: string;
  setNickname: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  userId?: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onSubmit,
  loading,
  avatar,
  setAvatar,
  name,
  setName,
  nickname,
  setNickname,
  description,
  setDescription,
  userId,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#1a1b2e]  p-6 rounded-lg max-w-xl w-full relative shadow-lg space-y-4">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition-colors duration-200 text-2xl"
          aria-label="Close modal"
          onClick={() => onClose()}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-[#22ec8a]">Edit profile</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-[#22ec8a]">Avatar</label>
            <div className="flex space-x-3">
              {["cat", "robot", "alien", "monster", "Sawyer"].map((type) => {
                const url = `https://api.dicebear.com/7.x/bottts/png?seed=${type}`;
                return (
                  <Image
                    key={type}
                    src={url}
                    alt={`avatar ${type}`}
                    width={60}
                    height={60}
                    onClick={() => setAvatar(url)}
                    className={`cursor-pointer rounded-full border-2 ${
                      avatar === url ? "border-blue-600" : "border-transparent"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <Input label="Name" value={name} onChange={setName} />
          <Input label="Nickname" value={nickname} onChange={setNickname} />
          <Input label="Description" value={description} onChange={setDescription} />

          <div>
            <h3 className="font-medium mb-1 text-[#22ec8a]">Favorite films</h3>
            {userId && <FavoriteMoviesSection userId={userId} />}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
