/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import { toast } from "react-toastify";
import FavoriteMoviesList from "../components/profileSections/FavMoviesList"; // para mostrar las favs en el perfil
import EditProfileModal from "../components/profileSections/EditProfileModal";
import ChangePasswordModal from "../components/profileSections/ChangePaswordModal";
import ProfileTabs from "../components/profileSections/ProfileTabs";
import ProfileDetailsPanel from "../components/profileSections/ProfileDetailsPanel";
import ProfileCompactCard from "../components/profileSections/ProfileCompactCard";
import { editUserSchema } from "../schema/editUserSchema";

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
  const [activeTab, setActiveTab] = useState("watchlist");
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [commentsCount, setCommentsCount] = useState<number | null>(null);
  const [diaryCount, setDiaryCount] = useState<number | null>(null);

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

  const fetchUserData = async (userId: string) => {
    try {
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
      // setFavoriteMovies(user.favorites || []); // Si decides usar favoritas aquí
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };

  const updateUserProfile = async () => {
    setLoading(true);
    try {
      // Prepara los datos para validación
      const dataToValidate = {
        nickname,
        username: name,
        description,
      };

      // Validar usando Zod
      const validatedData = editUserSchema.parse(dataToValidate);

      // Construye el objeto final a enviar (puedes añadir más campos si no están en el schema)
      const dataToSend = {
        nickname: validatedData.nickname,
        name: validatedData.username,
        email: usermail,
        role,
        description: validatedData.description,
        avatar,
        currentPassword,
        newPassword,
      };

      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta:", errorData);
        throw new Error(errorData.message || "Error updating profile");
      }

      const responseData = await response.json();
      toast.success(responseData.message);

      setIsModalOpen(false);
      setIsPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      await fetchUserData(userId);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const messages = error.errors.map((e: any) => e.message).join(", ");
        toast.error(`Validation error: ${messages}`);
      } else {
        toast.error(error.message || "Error updating profile");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
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

        {/* Perfil detallado */}
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

        {/* Mostrar las favoritas */}
        {userId && (
          <div className="border rounded-xl shadow-md p-6 mt-6">
            <FavoriteMoviesList userId={userId} />
          </div>
        )}

        {/* Tabs para mostrar contenido */}
        <ProfileTabs
          userId={userId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Modal cambiar contraseña */}
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

      {/* Modal editar perfil */}
      {isModalOpen && (
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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