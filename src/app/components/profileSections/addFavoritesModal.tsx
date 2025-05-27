"use client";

import { useState, useEffect } from "react";
import SearchFavsEdit from "./searchFavsEdit";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

interface FavoriteMoviesSectionProps {
  userId: string;
}

export default function FavoriteMoviesSection({ userId }: FavoriteMoviesSectionProps) {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga favoritas desde backend al montar
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`/api/user/${userId}/favorites`)
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando favoritas");
        return res.json();
      })
      .then((data: Movie[]) => {
        setFavoriteMovies(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [userId]);

  const handleAddMovie = async (movie: Movie) => {
    if (favoriteMovies.find((m) => m.id === movie.id)) return;
    if (favoriteMovies.length >= 5) return;

    try {
      const res = await fetch(`/api/user/${userId}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error añadiendo película");
        return;
      }

      setFavoriteMovies((prev) => [...prev, movie]);
      setIsModalOpen(false);
    } catch {
      alert("Error de red");
    }
  };

  const handleRemoveMovie = async (id: number) => {
    try {
        const res = await fetch(`/api/user/${userId}/favorites?movie_id=${id}`, {
            method: "DELETE",
          });          

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error eliminando película");
        return;
      }

      setFavoriteMovies((prev) => prev.filter((movie) => movie.id !== id));
    } catch {
      alert("Error de red");
    }
  };

  if (loading) return <p>Cargando favoritas...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {favoriteMovies.length < 5 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            type="button"
          >
            Añadir película
          </button>
        )}
      </div>

      {favoriteMovies.length === 0 && (
        <p className="text-gray-400 italic">No has añadido ninguna película favorita.</p>
      )}

      <ul className="flex gap-4 flex-nowrap ">
        {favoriteMovies.map((movie) => (
          <li
            key={movie.id}
            className="relative w-24 cursor-pointer group flex-shrink-0"
            title={movie.title}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-20 h-34 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-24 bg-gray-300 flex items-center justify-center rounded text-xs text-gray-600">
                Sin imagen
              </div>
            )}
            <button
              onClick={() => handleRemoveMovie(movie.id)}
              type="button"
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              aria-label={`Eliminar ${movie.title}`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white text-black rounded-lg max-w-xl w-full p-6 relative shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
              aria-label="Cerrar modal"
            >
              ✖
            </button>
            <h2 className="text-2xl font-semibold mb-4">Buscar películas</h2>
            <SearchFavsEdit
              onSelectMovie={handleAddMovie}
            />
          </div>
        </div>
      )}
    </div>
  );
}
