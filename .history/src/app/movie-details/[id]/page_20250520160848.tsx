/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import axiosInstance from '@/libs/axios';
import { useSession } from 'next-auth/react';
import Navbar from '@/app/components/Navbar';
import AddToWatchlistButton from '@/app/components/moviePageElements/AddToWatchlist';

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
}

const MovieDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data: session } = useSession();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<string>('');

  console.log(params);

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

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("Please write a comment");
      return;
    }

    const commentToSend = {
      userName: session?.user?.name || "Anonymous",
      text: newComment,
      date: new Date().toISOString(),
    };

    try {
      await axiosInstance.post(`/comments/${id}`, commentToSend);
      setNewComment(""); // limpiar textarea después de enviar
      alert("Comment submitted successfully");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    }
  };

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
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Comments</h2>

        {/* Form to add a comment */}
        <div className="mb-6">
          <textarea
            className="w-full p-3 mt-4 rounded-md bg-gray-800 text-white border-2 border-[#777] focus:outline-none focus:border-[#22ec8a]"
            placeholder="Leave your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-4 px-6 py-2 bg-[#22ec8a] text-black cursor-pointer rounded-md hover:opacity-70 transition-opacity transition duration-200"
          >
            Submit Comment
          </button>
        </div>
      </div>
    </>
  );
};

export default MovieDetailPage;
