// components/profileSections/FavoriteMoviesList.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
      <div className="grid grid-cols-5 gap-4">
        {favorites.slice(0, 5).map((movie) => (
          <div key={movie.id} className="text-center">
            <Link
              key={movie.id}
              href={`/movie-details/${movie.id}`} // Esto lleva a la página de detalles
              className="hover:opacity-70"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg w-full h-auto max-w-[120px] mx-auto"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>

  );
}
