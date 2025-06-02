import Image from "next/image";
import FollowButton from "./followButton";

interface ProfileCompactCardProps {
  userId:string;
  avatar: string;
  nickname: string;
  followingCount: number | null;
  followerCount: number | null;
  commentsCount: number | null;
  diaryCount: number | null;
}

export default function ProfileCompactCard({
  avatar,
  nickname,
  followingCount,
  followerCount,
  commentsCount,
  diaryCount,
  userId,
}: ProfileCompactCardProps) {
  const safe = (n: number | null) => n ?? 0;

  return (
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

        <div className="flex flex-col ml-35 items-center border-r border-gray-400 pr-4">
          <span className="text-base font-semibold text-xl">{safe(followingCount)}</span>
          <span className="text-xs text-gray-500">following</span>
        </div>

        <div className="flex flex-col items-center border-r border-gray-400 pr-4">
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

        <FollowButton targetUserId={userId} />
      </div>
    </div>
  );
}
