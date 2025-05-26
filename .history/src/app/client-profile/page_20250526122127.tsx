"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { toast } from "react-toastify";
import Watchlist from "../components/profileSections/userWatchlist";
import Comments from "../components/profileSections/userComments";
import Diary from "../components/profileSections/userDiary";
import FavoriteMoviesSection from "../components/profileSections/addFavoritesModal"; //para elegir favs
import FavoriteMoviesList from "../components/profileSections/FavMoviesList"; //para mostrar las favs en el perfil

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [usermail, setUsermail] = useState("");
  const [role, setRole] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [activeTab, setActiveTab] = useState('watchlist');
  //const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);


  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
      fetchUserData(session.user.id);
    }
  }, [session]);

  const fetchUserData = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) throw new Error("No se pudo obtener el usuario");
      const user = await res.json();

      setName(user.name || "");
      setUsermail(user.email || "");
      setRole(user.role || "");
      setBirthdate(user.birthdate || "");
      setNickname(user.nickName || "");
      setDescription(user.description || "");
      setAvatar(user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${user.id}`);

      //setFavoriteMovies(user.favorites || []);

    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };

  const updateUserProfile = async () => {
    setLoading(true);
    const dataToSend = {
      nickname,
      name,
      email: usermail,
      role,
      description,
      birthdate,
      avatar,
      currentPassword,
      newPassword,
      //favorites: favoriteMovies,
    };

    const response = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en la respuesta:", errorData);
      throw new Error("Error al actualizar el perfil");
    }

    const responseData = await response.json();
    toast(responseData.message);

    setIsModalOpen(false);
    await fetchUserData(userId);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile();
  };

  return (
    <div className="min-h-screen text-white">
      {/* Navbar */}
      <Navbar />
      {/* Contenedor de perfil */}

      <div className="max-w-4xl mx-auto mt-10 space-y-6">
        {/* Perfil compacto */}
        <div className="flex items-center justify-between border rounded-xl shadow-md p-4">
          <div className="flex items-center space-x-4">
            <Image
              src={avatar || 'https://api.dicebear.com/7.x/bottts/png?seed=default'}
              alt="Avatar"
              width={60}
              height={60}
              className="rounded-full border"
            />
            <span className="text-xl font-semibold">{nickname}</span>

            <div className="flex flex-col">
              <span className="text-base font-semibold">{nickname}</span>
              <span className="text-base text-gray-500">{nickname}</span>
            </div>

          </div>
          <button
            onClick={() => setShowDetails(prev => !prev)}
            className="bg-[#22ec8a] text-black px-4 py-2 rounded-lg hover:opacity-70 transition"
          >
            {showDetails ? 'Ocultar perfil' : 'Ver perfil'}
          </button>
        </div>

        {/* Perfil detallado */}
        {showDetails && (
          <div className="border rounded-xl shadow-inner p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProfileField label="Nombre completo" value={name} />
              <ProfileField label="Correo" value={usermail} />
              <ProfileField label="Fecha de nacimiento" value={birthdate} />
              <ProfileField label="Rol" value={role} />
              <div className="sm:col-span-2">
                <ProfileField label="Descripción" value={description} />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsModalOpen(true)}
                className="bg-[#22ec8a] text-black px-4 py-2 rounded-md hover:opacity-70 transition"
              >
                Editar perfil
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsPasswordModalOpen(true)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        )}
        {/* Mostrar las favoritas */}
        {userId && (
          <div className="border rounded-xl shadow-md p-6 mt-6">
            <FavoriteMoviesList userId={userId} />
          </div>
        )}


        {/* Tabs para mostrar contenido */}
        <div className="border rounded-xl shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'watchlist' ? 'border-b-4 border-[#22ec8a] text-[#22ec8a]' : 'text-gray-500 hover:text-[#22ec8a]'}`}
            >
              📺 Watchlist
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'comments' ? 'border-b-4 border-[#22ec8a] text-[#22ec8a]' : 'text-gray-500 hover:text-[#22ec8a]'}`}
            >
              💬 Comments
            </button>
            <button
              onClick={() => setActiveTab('diary')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'diary' ? 'border-b-4 border-[#22ec8a] text-[#22ec8a]' : 'text-gray-500 hover:text-[#22ec8a]'}`}
            >
              📖 Diary
            </button>
          </div>
          <div className="p-6">
            {activeTab === 'watchlist' && userId && <Watchlist userId={userId} />}
            {activeTab === 'comments' && userId && <Comments userId={userId} />}
            {activeTab === 'diary' && userId && <Diary userId={userId} />}
          </div>
        </div>
      </div>
      {/* Modal cambiar contraseña */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-lg max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-5">Change Password</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (newPassword !== repeatPassword) {
                  alert("Las contraseñas nuevas no coinciden.");
                  return;
                }

                try {
                  await updateUserProfile();
                  setIsPasswordModalOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setRepeatPassword("");
                } catch (err) {
                  alert(err);
                  console.error(err);
                }
              }}
              className="space-y-4"
            >
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
      )}


      {/* Modal editar perfil */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-lg max-w-xl w-full relative shadow-lg space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold">Editar perfil</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Avatar</label>
                <div className="flex space-x-3">
                  {['cat', 'robot', 'alien', 'monster', 'Sawyer'].map((type) => {
                    const url = `https://api.dicebear.com/7.x/bottts/png?seed=${type}`;
                    return (
                      <Image
                        key={type}
                        src={url}
                        alt="avatar"
                        width={60}
                        height={60}
                        onClick={() => setAvatar(url)}
                        className={`cursor-pointer rounded-full border-2 ${avatar === url ? 'border-blue-600' : 'border-transparent'
                          }`}
                      />
                    );
                  })}
                </div>
              </div>

              <Input label="Nombre" value={name} onChange={setName} />
              <Input label="Apodo" value={nickname} onChange={setNickname} />
              <Input label="Fecha de nacimiento" value={birthdate} onChange={setBirthdate} />
              <Input label="Descripción" value={description} onChange={setDescription} />



              {/* la sección de películas favoritas */}
              <div>
                <h3 className="font-semibold mb-1">Favorite films</h3>
                {session?.user?.id && (
                  <FavoriteMoviesSection userId={session.user.id} />
                )}

              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente reutilizable para mostrar campos
function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#22ec8a] mb-1">{label}</label>
      <p className="text-white border border-gray-700 rounded p-2">{value || "—"}</p>
    </div>
  );
}

// Componente reutilizable de inputs
function Input({
  label,
  value,
  onChange,
  type = "text", // Valor por defecto
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string; // Nuevo prop opcional
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      />
    </div>
  );
}
