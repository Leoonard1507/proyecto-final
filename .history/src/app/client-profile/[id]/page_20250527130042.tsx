import Watchlist from "@/app/components/profileSections/userWatchlist";
import Comments from "@/app/components/profileSections/userComments";
import { connectDB } from "@/libs/mysql";
import { notFound } from "next/navigation";
import FollowButton from "@/app/components/profileSections/followButton";
import Navbar from "@/app/components/Navbar";
import { RowDataPacket } from "mysql2";
import { Suspense } from "react";

interface UserPreview extends RowDataPacket {
  id: number;
  nickName: string;
  avatar: string | null;
}

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

          {/* Contenido Público */}
          <div className="border mt-6 rounded-xl shadow-md">
            <div className="flex justify-around border-b text-sm font-medium text-gray-300 bg-gray-800 rounded-t-xl">
              <div className="p-2">📺 Watchlist</div>
              <div className="p-2">💬 Comments</div>
            </div>

            <div className="p-6 space-y-8">
              <Suspense fallback={<p>Loading watchlist...</p>}>
                <Watchlist userId={userId} />
              </Suspense>
              <Suspense fallback={<p>Loading comments...</p>}>
                <Comments userId={userId} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
