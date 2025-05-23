import Watchlist from "@/app/components/profileSections/userWatchlist";
import Comments from "@/app/components/profileSections/userComments";
import { connectDB } from "@/libs/mysql";
import { notFound } from "next/navigation";
import FollowButton from "@/app/components/profileSections/followButton";

import { RowDataPacket } from 'mysql2';

interface UserPreview extends RowDataPacket {
  id: number;
  nickName: string;
  avatar: string | null;
}
import Navbar from "@/app/components/Navbar";

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const db = await connectDB();

  const [rows] = await db.query<UserPreview[]>(
    "SELECT id, nickName, avatar FROM user WHERE id = ?",
    [params.id]
  );
  const user = rows[0];
  const userId = params.id;

  if (!user) return notFound();

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 text-white">
        <div className="max-w-xl mx-auto border rounded-xl shadow-md p-6 text-center">
          <FollowButton targetUserId={userId} />
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${user.id}`}
            alt="Avatar"
            className="mx-auto w-32 h-32 rounded-full mb-4"
          />
          <h1 className="text-2xl font-semibold">{user.nickName}</h1>
          <p className="text-gray-400 mb-6">🎬 Watchlist:</p>

           {/* Tabs para mostrar contenido */}
                  <div className="border rounded-xl shadow-md">
                    <div className="flex border-b">
                      <button
                        onClick={() => setActiveTab('watchlist')}
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'watchlist' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                      >
                        📺 Watchlist
                      </button>
                      <button
                        onClick={() => setActiveTab('comments')}
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'comments' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                      >
                        💬 Comments
                      </button>
                    </div>
                    <div className="p-6">
                      {activeTab === 'watchlist' && userId && <Watchlist userId={userId} />}
                      {activeTab === 'comments' && userId && <Comments userId={userId} />}
                    </div>
                  </div>
                </div>


      </div>
    </>
  );
}
