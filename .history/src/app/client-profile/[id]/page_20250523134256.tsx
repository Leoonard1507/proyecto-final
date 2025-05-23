import Watchlist from "@/app/components/profileSections/userWatchlist";
import Comments from "@/app/components/profileSections/userComments";
import { connectDB } from "@/libs/mysql";
import { notFound } from "next/navigation";
import FollowButton from "@/app/components/profileSections/followButton";

import { RowDataPacket } from 'mysql2';

export default function ProfileTabs({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<"watchlist" | "comments">("watchlist");

  return (
    <div className="border rounded-xl shadow-md">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "watchlist"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          📺 Watchlist
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "comments"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          💬 Comments
        </button>
      </div>
      <div className="p-6">
        {activeTab === "watchlist" && <Watchlist userId={userId} />}
        {activeTab === "comments" && <Comments userId={userId} />}
      </div>
    </div>
  );
}

