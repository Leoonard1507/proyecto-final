'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import axiosInstance from '@/libs/axios';

type SearchFavsEditProps = {
  onSelectMovie: (movie: any) => void;
};

const SearchFavsEdit = forwardRef(function ProfileMovieSearch(
  { onSelectMovie }: SearchFavsEditProps,
  ref
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    clearResults() {
      setResults([]);
      setSearchTerm('');
    }
  }));

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/search/movie?query=${searchTerm}`);
      const filteredMovies = response.data.results.filter((movie: any) => !movie.adult);
      setResults(filteredMovies);
    } catch (error) {
      console.error('Error buscando películas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar película..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {results.length > 0 && (
        <ul style={{ marginTop: '20px' }}>
          {results.map((movie) => (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '200px', borderRadius: '8px' }}
                />
              )}
              <button
                onClick={() => onSelectMovie(movie)}
                style={{ marginTop: '0.5rem' }}
              >
                Añadir a favoritas
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default SearchFavsEdit;
