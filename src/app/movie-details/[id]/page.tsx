/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from 'react';
import axiosInstance from '@/libs/axios';
import Navbar from '@/app/components/Navbar';
import AddToWatchlistButton from '@/app/components/moviePageElements/AddToWatchlist';
import ViewCommentRatingModal from '@/app/components/moviePageElements/ViewCommentRatingModal';
import WatchedByFriends from '@/app/components/moviePageElements/WatchedByFriend';
import WantsToWatchFriends from '@/app/components/moviePageElements/WantToWatchFriend';
import { useParams } from 'next/navigation';

// Interfaz para tipar los datos de la película
export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
}

const MovieDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  // Estados para datos y control de la UI
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'watched' | 'watchlist'>('watched');

  // Obtener detalles de la película
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

  // Estados de carga y error
  if (loading) return <div className="text-center text-white py-20">Loading...</div>;
  if (!movie) return <div className="text-center text-white py-20">Movie not found.</div>;

  return (
    <>
      <Navbar />
      {/* Background */}
      <div className="w-full h-[50vh]">
        {movie.backdrop_path && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover object-center fade-mask-movie-details"
          />
        )}
      </div>

      {/* Main Content */}
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

          {/* Movie Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-300 mb-2"><strong>Release Date:</strong> {movie.release_date}</p>
            <p className="text-gray-300 mb-2"><strong>Rating:</strong> ⭐ {movie.vote_average.toFixed(1)}</p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Synopsis</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{movie.overview}</p>
          </div>

          <AddToWatchlistButton
            movieId={movie.id}
            movieTitle={movie.title}
            posterPath={movie.poster_path}
          />

          <button
            onClick={() => setModalOpen(true)}
            className="right-8 bg-green-500 text-white rounded w-12 h-12 text-3xl font-bold cursor-pointer"
            title="Añadir puntuación o comentario"
          >
            +
          </button>
          {modalOpen && movie && (
            <ViewCommentRatingModal
              movie={movie}
              onClose={() => setModalOpen(false)}
            />
          )}
        </div>
      </div>
      {/* Activity Tabs */}
      <div className="mt-10 flex justify-center">
        <div className="w-full max-w-6xl border rounded-xl shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('watched')}
              className={`w-1/2 py-3 text-center font-medium transition-colors duration-200 ${activeTab === 'watched'
                  ? 'border-b-4 border-[#22ec8a] text-[#22ec8a]'
                  : 'text-gray-500 hover:text-[#22ec8a]'
                }`}
            >
              👀 Watched by
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`w-1/2 py-3 text-center font-medium transition-colors duration-200 ${activeTab === 'watchlist'
                  ? 'border-b-4 border-[#22ec8a] text-[#22ec8a]'
                  : 'text-gray-500 hover:text-[#22ec8a]'
                }`}
            >
              📺 Wants to watch
            </button>
          </div>
          <div className="p-4 bg-gray-900 rounded-b-xl">
            {activeTab === 'watched' && <WatchedByFriends movieId={movie.id} />}
            {activeTab === 'watchlist' && <WantsToWatchFriends movieId={movie.id} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetailPage;
