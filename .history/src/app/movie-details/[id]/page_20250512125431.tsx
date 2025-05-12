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

interface Comment {
  id: string; // Comment ID (if supported by the API)
  userName: string; // Username who leaves the comment
  text: string; // Comment text
  date: string; // Date when the comment was made
}

const MovieDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>(''); // New comment
  const [userName, setUserName] = useState<string>(''); // Username

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

    const fetchComments = async () => {
      try {
        // Assuming you have an API for fetching comments
        const response = await axiosInstance.get(`/comments/${id}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchMovieDetails();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // Validation: do not submit if the comment is empty
    const comment = {
      userName,
      text: newComment,
      date: new Date().toISOString(),
    };

    try {
      // Call to submit the comment to the server
      await axiosInstance.post(`/comments/${id}`, comment);
      setComments([...comments, comment]);
      setNewComment(''); // Clear the text field after submitting
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (loading) return <div className="text-center text-white py-20">Loading...</div>;
  if (!movie) return <div className="text-center text-white py-20">Movie not found.</div>;

  return (
    <>
      <Navbar />

      {/* Background like Filmin */}
      <div className="w-full h-[50vh]">
        {movie.backdrop_path && (
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
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Comments</h2>

        {/* Form to add a comment */}
        <div className="mb-6">
          <textarea
            className="w-full p-3 mt-4 rounded-md bg-gray-800 text-white"
            placeholder="Leave your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
          >
            Submit Comment
          </button>
        </div>

        {/* Display comments */}
        <div>
          {comments.length === 0 ? (
            <p className="text-gray-300">No comments yet.</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-700 py-4">
                <p className="text-lg font-semibold text-white">{comment.userName}</p>
                <p className="text-sm text-gray-400">{new Date(comment.date).toLocaleString()}</p>
                <p className="mt-2 text-gray-300">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MovieDetailPage;
