/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { toast } from "react-toastify";
import FavoriteMoviesList from "../../components/profileSections/FavMoviesList";
import ProfileTabs from "../../components/profileSections/ProfileTabs";
//import ProfileDetailsPanel from "../../components/profileSections/ProfileDetailsPanelOthers";
import ProfileCompactCard from "../../components/profileSections/ProfileCompactCard";
import { editUserSchema } from "../../schema/editUserSchema";

export default function ProfilePage() {
  const params = useParams();
  const userIdFromUrl = params?.id as string;

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
  const [reviewsCount, setReviewsCount] = useState<number | null>(null);

  useEffect(() => {
    if (userIdFromUrl) {
      setUserId(userIdFromUrl);
      fetchUserData(userIdFromUrl);
      fetchFollowingCount(userIdFromUrl);
      fetchFollowerCount(userIdFromUrl);
      fetchCommentsCount(userIdFromUrl);
      fetchDiaryCount(userIdFromUrl);
      fetchReviewsCount(userIdFromUrl);
    }
  }, [userIdFromUrl]);

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

  const fetchReviewsCount = async (userId: string) => {
    try {
      const res = await fetch(`/api/countReviews/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch reviews count");
      const data = await res.json();
      setReviewsCount(data[0]?.reviews_count ?? 0);
    } catch (error) {
      console.error("Error fetching reviews count:", error);
      setReviewsCount(0);
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
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };

  const updateUserProfile = async () => {
    setLoading(true);
    try {
      const dataToValidate = {
        nickname,
        username: name,
        description,
      };

      const validatedData = editUserSchema.parse(dataToValidate);

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
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 space-y-6">
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

        {showDetails && (
          <ProfileDetailsPanel
            description={description}
          />
        )}

        {userId && (
          <div className="border rounded-xl shadow-md p-6 mt-6">
            <FavoriteMoviesList userId={userId} />
          </div>
        )}

        <ProfileTabs
          userId={userId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
