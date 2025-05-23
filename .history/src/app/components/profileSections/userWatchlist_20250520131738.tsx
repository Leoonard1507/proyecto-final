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

  if (!movies.length) return <p className="mt-6 text-gray-300">No hay películas en tu watchlist.</p>;

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-4">Mi Watchlist</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie.movie_id}
            href={`/movie-details/${movie.movie_id}`} // 👈 Esto lleva a la página de detalles
            className="bg-gray-800 rounded-lg p-2 text-center hover:bg-gray-700 transition"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.movie_title}
              width={150}
              height={225}
              className="mx-auto rounded"
            />
            <p className="mt-2 text-sm">{movie.movie_title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
