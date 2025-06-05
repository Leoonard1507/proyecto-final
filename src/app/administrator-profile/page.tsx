/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Indica que este componente se ejecuta en el cliente

// Importación de hooks y componentes necesarios
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Para obtener la sesión del usuario autenticado
import Navbar from "@/app/components/Navbar";
import { toast } from "react-toastify";
import FavoriteMoviesList from "../components/profileSections/FavMoviesList";
import EditProfileModal from "../components/profileSections/EditProfileModal";
import ChangePasswordModal from "../components/profileSections/ChangePaswordModal";
import ProfileTabs from "../components/profileSections/ProfileTabs";
import ProfileDetailsPanel from "../components/profileSections/ProfileDetailsPanel";
import ProfileCompactCard from "../components/profileSections/ProfileCompactCard";
import { editUserSchema } from "../schema/editUserSchema";
import ProfilePageSkeleton from "../skeletons/ProfileSkeleton";
import UserSearch from "../components/adminComponents/searchUser";

export default function ProfilePage() {
  const { data: session } = useSession(); // Obtiene la sesión del usuario logueado

  // Estados para campos del perfil
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
  const [activeTab, setActiveTab] = useState("diary");

  // Contadores del perfil
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [commentsCount, setCommentsCount] = useState<number | null>(null);
  const [diaryCount, setDiaryCount] = useState<number | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Cuando la sesión está disponible, carga los datos del usuario
  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
      fetchUserData(session.user.id);
      fetchFollowingCount(session.user.id);
      fetchFollowerCount(session.user.id);
      fetchCommentsCount(session.user.id);
      fetchDiaryCount(session.user.id);
    }
  }, [session]);

  // Obtener número de seguidos
  const fetchFollowingCount = async (userId: string) => {
    try {
      const res = await fetch(`/api/seguidos/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch following count");
      const data = await res.json();
      setFollowingCount(data[0]?.following_count ?? 0);
    } catch (error) {
      console.error("Error fetching following count:", error);
      setFollowingCount(0);
    }
  };

  // Obtener número de seguidores
  const fetchFollowerCount = async (userId: string) => {
    try {
      const res = await fetch(`/api/seguidores/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch follower count");
      const data = await res.json();
      setFollowerCount(data[0]?.followers_count ?? 0);
    } catch (error) {
      console.error("Error fetching follower count:", error);
      setFollowerCount(0);
    }
  };

  // Obtener número de comentarios
  const fetchCommentsCount = async (userId: string) => {
    try {
      const res = await fetch(`/api/countComments/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch comments count");
      const data = await res.json();
      setCommentsCount(data[0]?.comments_count ?? 0);
    } catch (error) {
      console.error("Error fetching comments count:", error);
      setCommentsCount(0);
    }
  };

  // Obtener número de entradas en diario
  const fetchDiaryCount = async (userId: string) => {
    try {
      const res = await fetch(`/api/countDiary/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch diary count");
      const data = await res.json();
      setDiaryCount(data[0]?.diarys_count ?? 0);
    } catch (error) {
      console.error("Error fetching diary count:", error);
      setDiaryCount(0);
    }
  };

  // Obtener datos del usuario
  const fetchUserData = async (userId: string) => {
    try {
      setIsLoadingData(true);
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) throw new Error("Could not get user");
      const user = await res.json();

      setName(user.name || "");
      setUsermail(user.email || "");
      setRole(user.role || "");
      setBirthdate(user.birthdate || "");
      setNickname(user.nickName || "");
      setDescription(user.description || "");
      setAvatar(user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${user.id}`);
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Actualizar el perfil del usuario
  const updateUserProfile = async () => {
    setLoading(true);

    const dataToValidate = {
      nickname,
      username: name,
      description,
    };

    try {
      // Validar con Zod
      const validatedData = editUserSchema.parse(dataToValidate);

      const dataToSend = {
        nickname: validatedData.nickname,
        name: validatedData.username,
        email: usermail,
        role,
        description: description,
        avatar,
        currentPassword,
        newPassword,
      };

      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();

      if (!response.ok || (responseData.message && responseData.message.toLowerCase().includes("incorrect"))) {
        throw new Error(responseData.message || "Error updating profile");
      }

      toast.success(responseData.message);
      setIsModalOpen(false);
      setIsPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      await fetchUserData(userId); // Refrescar datos tras actualizar

    } catch (error: any) {
      // Manejo de errores de validación o servidor
      if (error.name === "ZodError") {
        const messages = error.errors.map((e: any) => e.message).join(", ");
        toast.error(messages);
      } else {
        toast.error(error.message || "Error updating profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cerrar el modal de edición y refrescar datos
  const handleCloseEditModal = async () => {
    await fetchUserData(userId);
    setIsModalOpen(false);
  };

  // Manejo del envío de formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile();
  };

  // Renderizado del componente
  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white px-6">
        {/* Contenedor principal en dos columnas */}
        <div className="mt-10 max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start lg:space-x-12">
          {/* Columna izquierda - contenido del perfil */}
          <div className="flex-1 space-y-6 max-w-5xl">
            {isLoadingData ? (
              <ProfilePageSkeleton /> // Skeleton mientras carga
            ) : (
              <>
                {/* Tarjeta compacta del perfil */}
                <ProfileCompactCard
                  avatar={avatar}
                  nickname={nickname}
                  followingCount={followingCount}
                  followerCount={followerCount}
                  commentsCount={commentsCount}
                  diaryCount={diaryCount}
                  showDetails={showDetails}
                  toggleDetails={() => setShowDetails((prev) => !prev)}
                />

                {/* Panel detallado del perfil */}
                {showDetails && (
                  <ProfileDetailsPanel
                    name={name}
                    usermail={usermail}
                    birthdate={birthdate}
                    role={role}
                    description={description}
                    loading={loading}
                    onEditProfile={() => setIsModalOpen(true)}
                    onChangePassword={() => setIsPasswordModalOpen(true)}
                  />
                )}

                {/* Lista de películas favoritas */}
                {userId && (
                  <div className="border rounded-xl shadow-md p-6 mt-6">
                    <FavoriteMoviesList userId={userId} />
                  </div>
                )}

                {/* Pestañas del perfil */}
                <ProfileTabs
                  userId={userId}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </>
            )}
          </div>
          {isLoadingData ? (
            <div className="w-full h-48 bg-gray-800 rounded-xl animate-pulse mt-8" /> // Si la pagina esta cargando que salga una sombra
          ) : (
            <UserSearch />
          )}
        </div>

        {/* Modal para cambiar contraseña */}
        {isPasswordModalOpen && (
          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            repeatPassword={repeatPassword}
            setRepeatPassword={setRepeatPassword}
            updateUserProfile={updateUserProfile}
          />
        )}

        {/* Modal para editar perfil */}
        {isModalOpen && (
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={handleCloseEditModal}
            onSubmit={handleSubmit}
            loading={loading}
            avatar={avatar}
            setAvatar={setAvatar}
            name={name}
            setName={setName}
            nickname={nickname}
            setNickname={setNickname}
            description={description}
            setDescription={setDescription}
            userId={session?.user?.id}
          />
        )}
      </div>
    </>
  );
}
