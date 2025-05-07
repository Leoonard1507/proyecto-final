'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/libs/axios';
import Link from 'next/link';

type Movie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
};

export default function FeaturedMovieBanner() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const res = await axiosInstance.get('/trending/movie/week');
        setMovies(res.data.results.slice(0, 5)); // Solo las 5 primeras películas
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === movies.length - 1 ? 0 : prevIndex + 1));
  };

  if (!movies.length) return null;

  return (
    <div className="relative">
      {/* Contenedor del carrusel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative w-full flex-shrink-0"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '50vh',
              }}
            >
              <div className="absolute bottom-8 left-15 text-white">
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                <p className="max-w-xl mb-4 line-clamp-3">{movie.overview}</p>
                <Link href={`/movie-details/${movie.id}`}>
                  <button className="px-6 py-3 text-lg bg-[#22ec8a] text-black rounded hover:opacity-70 transition duration-300 cursor-pointer">
                    More
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-4">
        <button
          onClick={handlePrev}
          className="text-white bg-black p-2 rounded-full hover:bg-gray-600"
        >
          &lt;
        </button>
        <button
          onClick={handleNext}
          className="text-white bg-black p-2 rounded-full hover:bg-gray-600"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
