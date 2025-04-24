// src/app/movie-details/[id]/page.tsx
"use client";
import { useState, useEffect } from 'react';
import axiosInstance from '@/libs/axios';

interface Movie {
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
}

const MovieDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params; // Obtienes el ID directamente desde los parámetros de la URL

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Hacemos la llamada a la API cuando el ID cambia
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axiosInstance.get(`/movie/${id}`);
        setMovie(response.data); // Guardamos los detalles de la película en el estado
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]); // Dependencia: se vuelve a ejecutar cuando el 'id' cambia

  if (loading) return <div>Loading...</div>;

  if (!movie) return <div>Movie not found.</div>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Rating:</strong> {movie.vote_average}</p>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        style={{ width: '300px', height: 'auto' }}
      />
    </div>
  );
};

export default MovieDetailPage;
