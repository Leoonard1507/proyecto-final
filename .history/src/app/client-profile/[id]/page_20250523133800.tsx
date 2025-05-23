"use client";

import { useState } from "react";
import Watchlist from "@/app/components/profileSections/userWatchlist";
import Comments from "@/app/components/profileSections/userComments";
import { connectDB } from "@/libs/mysql";
import { notFound } from "next/navigation";
import FollowButton from "@/app/components/profileSections/followButton";
import Navbar from "@/app/components/Navbar";

import { RowDataPacket } from 'mysql2';

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

  // Aquí no puedes usar hooks en funciones async, así que tienes dos opciones:
  // 1. Convertir PublicProfilePage a un componente cliente (pero perderías SSR)
  // 2. Separar el componente cliente que gestione el estado de tabs

  // La opción recomendada es crear un componente cliente para la parte del perfil público que use tabs:

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
          <p className="text-gray-400 mb-6">🎬 Contenido:</p>

          {/* Aquí renderizamos el componente cliente con tabs */}
          <ProfileTabs userId={userId} />
        </div>
      </div>
    </>
  );
}

// Componente cliente para manejar tabs
function ProfileTabs({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'comments'>('watchlist');

  return (
    <div className="border rounded-xl shadow-md">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'watchlist'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          📺 Watchlist
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'comments'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          💬 Comments
        </button>
      </div>
      <div className="p-6">
        {activeTab === 'watchlist' && <Watchlist userId={userId} />}
        {activeTab === 'comments' && <Comments userId={userId} />}
      </div>
    </div>
  );
}
