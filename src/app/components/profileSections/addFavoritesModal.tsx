"use client"; // Indica que este componente se ejecuta del lado del cliente

import { useState, useEffect } from "react";
import SearchFavsEdit from "./searchFavsEdit"; // Componente de búsqueda
import { toast } from "react-toastify"; // Notificaciones de error y éxito

// Definición de la estructura de datos de una película
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

// Props esperadas por el componente principal (requiere userId)
interface FavoriteMoviesSectionProps {
  userId: string;
}

// Componente principal que gestiona las películas favoritas del usuario
export default function FavoriteMoviesSection({ userId }: FavoriteMoviesSectionProps) {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]); // Lista de películas favoritas
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la apertura del modal
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Error de carga

  // useEffect para cargar películas favoritas cuando el componente se monta
  useEffect(() => {
    if (!userId) return;

    setLoading(true); // Inicia estado de carga

    fetch(`/api/user/${userId}/favorites`) // Llamada a API para obtener favoritas
      .then((res) => {
        if (!res.ok) throw new Error("Error loading favorites"); // Si hay error, lo lanza
        return res.json(); // Convierte respuesta en JSON
      })
      .then((data: Movie[]) => {
        setFavoriteMovies(data); // Actualiza el estado con las películas obtenidas
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message); // Guarda el mensaje de error
        setLoading(false);
      });
  }, [userId]);

  // Maneja la lógica para agregar una película a favoritas
  const handleAddMovie = async (movie: Movie) => {
    if (favoriteMovies.find((m) => m.id === movie.id)) return; // Evita duplicados
    if (favoriteMovies.length >= 5) return; // Máximo 5 películas permitidas

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
        toast.error(errorData.message || "Error adding movie"); // Muestra error si la API falla
        return;
      }

      setFavoriteMovies((prev) => [...prev, movie]); // Agrega la película al estado
      setIsModalOpen(false); // Cierra el modal
    } catch {
      toast.error("Network error"); // Error de red
    }
  };

  // Maneja la lógica para eliminar una película favorita
  const handleRemoveMovie = async (id: number) => {
    try {
      const res = await fetch(`/api/user/${userId}/favorites?movie_id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Error deleting movie"); // Error de API
        return;
      }

      setFavoriteMovies((prev) => prev.filter((movie) => movie.id !== id)); // Elimina del estado
    } catch {
      toast.error("Network error"); // Error de red
    }
  };

  // Si está cargando, muestra mensaje
  if (loading) return <p>Loading favorites...</p>;

  // Si hubo un error al cargar, muestra mensaje en rojo
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {/* Botón para abrir el modal si hay menos de 5 películas */}
      <div className="flex justify-between items-center mb-2">
        {favoriteMovies.length < 5 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            type="button"
          >
            Add movie
          </button>
        )}
      </div>

      {/* Mensaje si no hay películas favoritas */}
      {favoriteMovies.length === 0 && (
        <p className="text-gray-400 italic">You haven&apos;t added any favorite movies.</p>
      )}

      {/* Lista horizontal de películas favoritas */}
      <ul className="flex gap-4 flex-nowrap ">
        {favoriteMovies.map((movie) => (
          <li
            key={movie.id}
            className="relative w-24 cursor-pointer group flex-shrink-0"
            title={movie.title}
          >
            {/* Muestra la imagen si está disponible */}
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-20 h-34 object-cover rounded"
              />
            ) : (
              // Placeholder si no hay imagen
              <div className="w-16 h-24 bg-gray-300 flex items-center justify-center rounded text-xs text-gray-600">
                No image
              </div>
            )}

            {/* Botón de eliminar que aparece al hacer hover */}
            <button
              onClick={() => handleRemoveMovie(movie.id)}
              type="button"
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              aria-label={`Delete ${movie.title}`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      {/* Modal de búsqueda de películas */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1b2e] rounded-lg max-w-xl w-full p-6 relative shadow-lg">
            {/* Botón para cerrar el modal */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition-colors duration-200 text-2xl"
              aria-label="Close modal"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            {/* Título del modal */}
            <h2 className="text-2xl font-semibold mb-4 text-white">Search movies</h2>

            {/* Componente de búsqueda, pasa callback para agregar película */}
            <SearchFavsEdit onSelectMovie={handleAddMovie} />
          </div>
        </div>
      )}
    </div>
  );
}
