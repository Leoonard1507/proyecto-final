'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/libs/axios';
import Link from 'next/link';

type Props = {
  title: string;
  endpoint: string; // ej: /trending/movie/week
};

export default function MovieCarouselSection({ title, endpoint }: Props) {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get(endpoint);
        setMovies(res.data.results);
      } catch (error) {
        console.error(`Error al cargar ${title}:`, error);
      }
    };

    fetchMovies();
  }, [endpoint, title]);

  return (
    <section>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-2 custom-scrollbar">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie-details/${movie.id}`}
            className="flex-shrink-0"
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-60 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
            />
          </Link>
        ))}
      </div>
      <style>
      /* Scrollbar personalizada para navegadores WebKit */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #e5e5e5;
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 8px;
  border: 2px solid #e5e5e5;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Para Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #888 #e5e5e5;
}

      </style>
    </section>
  );
}
