/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Indica que este componente se ejecuta del lado del cliente (Client Component)

import { useState, useEffect } from "react"; // Hooks de React
import { useSession } from "next-auth/react"; // Hook de autenticación
import Navbar from "@/app/components/Navbar"; // Componente Navbar
import { toast } from "react-toastify"; // Librería para mostrar notificaciones
import FavoriteMoviesList from "../components/profileSections/FavMoviesList"; // Lista de películas favoritas
import EditProfileModal from "../components/profileSections/EditProfileModal"; // Modal para editar perfil
import ChangePasswordModal from "../components/profileSections/ChangePaswordModal"; // Modal para cambiar contraseña
import ProfileTabs from "../components/profileSections/ProfileTabs"; // Tabs de perfil (diario, comentarios, etc.)
import ProfileDetailsPanel from "../components/profileSections/ProfileDetailsPanel"; // Panel con detalles del perfil
import ProfileCompactCard from "../components/profileSections/ProfileCompactCard"; // Tarjeta compacta del perfil
import { editUserSchema } from "../schema/editUserSchema"; // Validación con zod
import ProfilePageSkeleton from "../skeletons/ProfileSkeleton"; // Skeleton de carga

export default function ProfilePage() {
  const { data: session } = useSession(); // Hook para obtener datos del usuario autenticado

  // Estados para datos del perfil
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

  // Estados para contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Estados para tabs y contadores
  const [activeTab, setActiveTab] = useState("diary");
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [commentsCount, setCommentsCount] = useState<number | null>(null);
  const [diaryCount, setDiaryCount] = useState<number | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true); // Indica si los datos están cargando

  // Carga datos al montar el componente si hay sesión
  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id); // Guarda el ID del usuario
      fetchUserData(session.user.id); // Carga datos del perfil
      fetchFollowingCount(session.user.id); // Carga conteo de seguidos
      fetchFollowerCount(session.user.id); // Carga conteo de seguidores
      fetchCommentsCount(session.user.id); // Carga conteo de comentarios
      fetchDiaryCount(session.user.id); // Carga conteo de entradas del diario
    }
  }, [session]);

  // Fetch para obtener cantidad de seguidos
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

  // Fetch para obtener cantidad de seguidores
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

  // Fetch para obtener cantidad de comentarios
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

  // Fetch para obtener cantidad de entradas del diario
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

  // Fetch para obtener datos del perfil del usuario
  const fetchUserData = async (userId: string) => {
    try {
      setIsLoadingData(true); // Inicia la carga
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) throw new Error("Could not get user");
      const user = await res.json();

      // Setea los datos en el estado
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
      setIsLoadingData(false); // Finaliza la carga
    }
  };

  // Función para actualizar el perfil del usuario
  const updateUserProfile = async () => {
    setLoading(true); // Inicia loading

    const dataToValidate = {
      nickname,
      username: name,
      description,
    };

    try {
      // Validación con zod
      const validatedData = editUserSchema.parse(dataToValidate);

      // Datos que se enviarán a la API
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

      // POST a la API
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();

      // Validación de error
      if (!response.ok || (responseData.message && responseData.message.toLowerCase().includes("incorrect"))) {
        throw new Error(responseData.message || "Error updating profile");
      }

      toast.success(responseData.message); // Notifica éxito
      setIsModalOpen(false); // Cierra modal de edición
      setIsPasswordModalOpen(false); // Cierra modal de contraseña
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      await fetchUserData(userId); // Recarga datos

    } catch (error: any) {
      // Manejo de errores de validación o de API
      if (error.name === "ZodError") {
        const messages = error.errors.map((e: any) => e.message).join(", ");
        toast.error(messages);
      } else {
        toast.error(error.message || "Error updating profile");
      }
    } finally {
      setLoading(false); // Finaliza loading
    }
  };

  // Cierra modal de edición y recarga datos
  const handleCloseEditModal = async () => {
    await fetchUserData(userId);
    setIsModalOpen(false);
  };

  // Handler para el submit del formulario de edición
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile();
  };

  return (
    <div className="min-h-screen text-white">
      {/* Navbar superior */}
      <Navbar />

      {/* Si los datos aún están cargando, muestra skeleton */}
      {isLoadingData ? (
        <ProfilePageSkeleton />
      ) : (
        <div className="max-w-4xl mx-auto mt-10 space-y-6">
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

          {/* Panel con información detallada */}
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

          {/* Tabs de contenido (diario, comentarios, etc.) */}
          <ProfileTabs
            userId={userId}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}

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

      {/* Modal para editar el perfil */}
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
  );
}
