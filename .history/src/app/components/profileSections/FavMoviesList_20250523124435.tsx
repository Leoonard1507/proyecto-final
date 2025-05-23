// components/profileSections/FavoriteMoviesList.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

export default function FavoriteMoviesList({ userId }: { userId: string }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`/api/user/${userId}/favorites`);
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Error loading favorite movies:", err);
      }
    };

    if (userId) fetchFavorites();
  }, [userId]);

  if (!favorites.length) return null;

  return (
    <div>
  <h2 className="text-2xl font-bold mb-4">🎬 My Favourites</h2>
  <div className="flex gap-4 overflow-x-auto">
    {favorites.slice(0, 4).map((movie) => (
      <div key={movie.id} className="text-center flex-shrink-0">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={200}
          height={300}
          className="rounded-lg"
        />
      </div>
    ))}
  </div>
</div>
  );
}
