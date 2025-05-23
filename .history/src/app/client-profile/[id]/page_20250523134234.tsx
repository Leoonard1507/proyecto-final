"use client";

import { useState } from "react";
import Watchlist from "./userWatchlist";
import Comments from "./userComments";

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
