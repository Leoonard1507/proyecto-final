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
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemWidth = 240; // ancho aproximado de cada tarjeta (w-60 = 15rem = 240px)
  const gap = 16; // separación entre elementos (space-x-4 = 1rem = 16px)
  const visibleItems = 5; // cuántos se ven a la vez
  const scrollWidth = itemWidth + gap;

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

  const maxIndex = Math.max(0, movies.length - visibleItems);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <section className="relative mb-8">
      <h2 className="text-xl font-bold mb-2">{title}</h2>

      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 space-x-4"
          style={{
            transform: `translateX(-${currentIndex * scrollWidth}px)`,
          }}
        >
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
      </div>

      {/* Flechas */}
      {movies.length > visibleItems && (
        <div className="z-0 absolute top-1/2 left-0 right-0 flex justify-between items-center px-2 transform -translate-y-1/2 pointer-events-none">
          <button
            onClick={handlePrev}
            className="z-50 text-white bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 disabled:opacity-30 cursor-pointer pointer-events-auto"
            disabled={currentIndex === 0}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="z-50 text-white bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 disabled:opacity-30 cursor-pointer pointer-events-auto"
            disabled={currentIndex === maxIndex}
          >
            ›
          </button>
        </div>

      )}
    </section>
  );
}
