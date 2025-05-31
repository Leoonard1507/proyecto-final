"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios"; // asegúrate que este es tu axios configurado


interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

interface SearchFavsEditProps {
  onSelectMovie: (movie: Movie) => void;
}

export default function SearchFavsEdit({ onSelectMovie }: SearchFavsEditProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    const term = query.trim();
    if (term.length === 0) {
      setResults([]);
      return;
    }
    setSearchTerm(term);
  };

  useEffect(() => {
    if (!searchTerm) return;

    const fetchMovies = async () => {
      try {
        const response = await axiosInstance.get(`/search/movie?query=${encodeURIComponent(searchTerm)}`);
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
  }, [searchTerm]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar película..."
          className="flex-grow p-2 border border-white text-white rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
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
                Sin imagen
              </div>
            )}
            <span className="text-sm mt-2 text-center">{movie.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
