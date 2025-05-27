"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Asegúrate de importar esto

type Movie = {
  movie_id: number;
  movie_title: string;
  poster_path: string;
};

export default function Watchlist({ userId }: { userId: string }) {
  const [movies, setMovies] = useState<Movie[]>([]);

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

  if (!movies.length) return <p className="mt-6 text-gray-300">There are no movies in your watchlist.</p>;

  return (
    <div className="mt-3">
      <h3 className="text-2xl font-bold mb-4">My Watchlist</h3>
      <div className="flex flex-wrap gap-4 pb-2">
        {movies.map((movie) => (
          <Link
            href={`/movie-details/${movie.movie_id}`}
            key={movie.movie_id}
            className="w-43 flex flex-col items-center text-center"
          >
            <div className="rounded-lg overflow-hidden hover:scale-105 transition-transform">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.movie_title}
                className="min-w-[156px] max-w-[150px] object-cover"
              />
              <div className="bg-gray-700 text-white text-sm font-medium px-2 py-1 w-full rounded-b-md">
                {movie.movie_title}
              </div>
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
}
