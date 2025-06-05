"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Movie = {
  movie_id: number;
  movie_title: string;
  poster_path: string;
};

export default function Watchlist({ userId }: { userId: string }) {
  const { data: session } = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const isOwnProfile = session?.user?.id === userId;

  useEffect(() => {
    if (!userId) return;

    const fetchWatchlist = async () => {
      try {
        const res = await fetch(`/api/watchlist/${userId}`);
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Error al cargar watchlist:", error);
      }
    };

    fetchWatchlist();
  }, [userId]);

  const handleRemove = async (movieId: number) => {
    try {
      await fetch("/api/watchlist/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      });

      setMovies((prev) => prev.filter((m) => m.movie_id !== movieId));
    } catch (err) {
      console.error("Error removing movie:", err);
    }
  };

  if (!movies.length) {
    return <p className="mt-6 text-gray-300">There are no movies in this watchlist.</p>;
  }

  return (
    <div className="mt-3">
      <h3 className="text-2xl font-bold mb-4">Watchlist</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie.movie_id} className="relative group w-[200px]">
            {isOwnProfile && (
              <button
                onClick={() => handleRemove(movie.movie_id)}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                aria-label="Remove from watchlist"
              >
                ❌
              </button>
            )}

            <Link href={`/movie-details/${movie.movie_id}`} className="flex flex-col items-center text-center">
              <div className="rounded-lg overflow-hidden hover:scale-105 transition-transform">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.movie_title}
                  className="w-[180px] h-[240px] object-cover"
                />
                <div className="bg-gray-700 text-white text-sm font-medium px-2 py-1 w-[180px] rounded-b-md truncate overflow-hidden whitespace-nowrap">
                  {movie.movie_title}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
