'use client';

import Image from "next/image";
import { useState } from "react";
import FollowersModal from "./followersListModal";
import { useSession } from "next-auth/react";

interface Props {
  avatar: string;
  nickname: string;
  followingCount: number | null;
  followerCount: number | null;
  commentsCount: number | null;
  diaryCount: number | null;
  showDetails: boolean;
  toggleDetails: () => void;
}

export default function ProfileCompactCard({
  avatar,
  nickname,
  followingCount,
  followerCount,
  commentsCount,
  diaryCount,
  showDetails,
  toggleDetails,
}: Props) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const safe = (n: number | null) => n ?? 0;
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);

  const openModal = (type: "followers" | "following") => {
    if (!userId) {
      alert("User not logged in");
      return;
    }
    setModalType(type);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-xl shadow-md p-4 w-full gap-4">
        {/* Avatar + Nickname */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Image
            src={avatar || "https://api.dicebear.com/7.x/bottts/png?seed=default"}
            alt="Avatar"
            width={60}
            height={60}
            className="rounded-full border"
          />
          <span className="text-xl font-semibold">{nickname || "—"}</span>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          <div
            className="flex flex-col items-center cursor-pointer hover:underline"
            onClick={() => openModal("following")}
          >
            <span className="font-semibold text-xl">{safe(followingCount)}</span>
            <span className="text-xs text-gray-500">following</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer hover:underline"
            onClick={() => openModal("followers")}
          >
            <span className="font-semibold text-xl">{safe(followerCount)}</span>
            <span className="text-xs text-gray-500">followers</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-semibold text-xl">{safe(commentsCount)}</span>
            <span className="text-xs text-gray-500">comments</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-semibold text-xl">{safe(diaryCount)}</span>
            <span className="text-xs text-gray-500">diary</span>
          </div>
        </div>

        {/* Botón */}
        <div className="flex justify-center sm:justify-end">
          <button
            onClick={toggleDetails}
            className="bg-[#22ec8a] text-black px-4 py-2 rounded-lg hover:opacity-70 transition"
          >
            {showDetails ? "Hide profile" : "View profile"}
          </button>
        </div>
      </div>

      {modalType && userId && (
        <FollowersModal
          userId={userId}
          type={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}
