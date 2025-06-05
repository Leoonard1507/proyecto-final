"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

interface SearchFavsEditProps {
  onSelectMovie: (movie: Movie) => void;
}

export default function SearchFavsEdit({ onSelectMovie }: SearchFavsEditProps) {
  const [query, setQuery] = useState(""); // valor del input
  const [results, setResults] = useState<Movie[]>([]); // resultados de películas

  useEffect(() => {
    const term = query.trim();

    // Si no hay texto, vaciar resultados
    if (term === "") {
      setResults([]);
      return;
    }

    // Crear un timeout para aplicar debounce (retrasar la búsqueda)
    const timeoutId = setTimeout(() => {
      const fetchMovies = async () => {
        try {
          const response = await axiosInstance.get(`/search/movie?query=${encodeURIComponent(term)}`);
          const filteredMovies = response.data.results
            .filter((movie: any) => !movie.adult)
            .sort((a: any, b: any) => b.popularity - a.popularity);
          setResults(filteredMovies);
        } catch (error) {
          console.error("Error fetching movies:", error);
          setResults([]);
        }
      };

      fetchMovies();
    }, 1); // Espera 1ms desde que el usuario deja de escribir

    // Limpiar timeout si el usuario escribe antes de que pasen los 500ms
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search movie..."
          className="flex-grow p-2 border border-[#777] text-white rounded focus:border-[#22ec8a] transition-colors duration-200 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Actualiza el query en cada cambio
        />
      </div>

      <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {results.map((movie) => (
          <button
            key={movie.id}
            onClick={() => onSelectMovie(movie)}
            className="flex flex-col items-center border border-transparent hover:border-white p-2 rounded"
            type="button"
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                width={80}
                height={120}
                className="rounded"
              />
            ) : (
              <div className="w-[80px] h-[120px] bg-gray-300 flex items-center justify-center rounded text-xs text-gray-600">
                No image
              </div>
            )}
            <span className="text-sm mt-2 text-center">{movie.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
