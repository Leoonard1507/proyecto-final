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

  // No abrir modal si no hay userId
  const openModal = (type: "followers" | "following") => {
    if (!userId) {
      alert("User not logged in");
      return;
    }
    setModalType(type);
  };

  return (
    <>
      <div className="flex items-center justify-between border rounded-xl shadow-md p-4">
        <div className="flex items-center space-x-4">
          <Image
            src={avatar || "https://api.dicebear.com/7.x/bottts/png?seed=default"}
            alt="Avatar"
            width={60}
            height={60}
            className="rounded-full border"
          />
          <span className="text-xl font-semibold">{nickname || "—"}</span>

          <div
            className="flex flex-col ml-35 items-center border-r border-gray-400 pr-4 cursor-pointer hover:underline"
            onClick={() => openModal("following")}
          >
            <span className="text-base font-semibold text-xl">{safe(followingCount)}</span>
            <span className="text-xs text-gray-500">following</span>
          </div>

          <div
            className="flex flex-col items-center border-r border-gray-400 pr-4 cursor-pointer hover:underline"
            onClick={() => openModal("followers")}
          >
            <span className="text-base font-semibold text-xl">{safe(followerCount)}</span>
            <span className="text-xs text-gray-500">followers</span>
          </div>

          <div className="flex flex-col items-center border-r border-gray-400 pr-4">
            <span className="text-base font-semibold text-xl">{safe(commentsCount)}</span>
            <span className="text-xs text-gray-500">comments</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-base font-semibold text-xl">{safe(diaryCount)}</span>
            <span className="text-xs text-gray-500">diary</span>
          </div>
        </div>

        <button
          onClick={toggleDetails}
          className="bg-[#22ec8a] text-black px-4 py-2 rounded-lg hover:opacity-70 transition"
        >
          {showDetails ? "Hide profile" : "View profile"}
        </button>
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
