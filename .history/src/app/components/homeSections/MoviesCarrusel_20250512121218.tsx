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

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thick; /* Para Firefox, la barra será más gruesa */
          scrollbar-color: #333 #222; /* Color oscuro para el thumb y el track */
        }

        /* WebKit (Chrome, Safari, Edge) */
        .custom-scrollbar::-webkit-scrollbar {
          height: 12px; /* Aumenta el tamaño a 12px para hacerlo más ancho */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #222; /* Fondo oscuro como el track de Netflix */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333; /* Color gris oscuro para el thumb */
          border-radius: 10px; /* Bordes redondeados como en Netflix */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e50914; /* Rojo Netflix cuando el thumb es hover */
        }
      `}</style>
    </section>
  );
}
