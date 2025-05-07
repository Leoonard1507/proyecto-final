"use client";

import { useState, useEffect } from 'react';
import axiosInstance from '@/libs/axios';
import Navbar from '@/app/components/Navbar';

interface Movie {
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
}

const MovieDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axiosInstance.get(`/movie/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div className="text-center text-white py-20">Cargando...</div>;
  if (!movie) return <div className="text-center text-white py-20">Película no encontrada.</div>;

  return (
    <>
      <Navbar />

      {/* Fondo tipo Filmin */}
      <div className="w-full h-[50vh]">
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover object-center fade-mask-movie-details"
          />
        )}
      </div>


      {/* Contenido principal */}
      <div className="text-white px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
          {/* Poster */}
          <div className="w-full md:w-auto">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg w-50 mx-auto"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-300 mb-2"><strong>Fecha de estreno:</strong> {movie.release_date}</p>
            <p className="text-gray-300 mb-2"><strong>Valoración:</strong> ⭐ {movie.vote_average.toFixed(1)}</p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Sinopsis</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{movie.overview}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetailPage;
