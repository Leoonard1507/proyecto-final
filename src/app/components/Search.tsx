'use client';

import { useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/libs/axios';

type SearchType = 'movie' | 'person';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('movie');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      let response;
      if (searchType === 'movie') {
        response = await axiosInstance.get(`/search/movie?query=${searchTerm}`);
        const filteredMovies = response.data.results.filter((movie: any) => !movie.adult);
        setResults(filteredMovies);
      } else {
        let allPeople: any[] = [];

        // Buscar en varias páginas para mejorar resultados
        for (let page = 1; page <= 10; page++) {
          const response = await axiosInstance.get(`/search/person?query=${searchTerm}&page=${page}`);
          allPeople = allPeople.concat(response.data.results);
        }

        // Filtrar y ordenar resultados
        const filtered = allPeople.filter((person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const actorsAndDirectors = filtered.filter((person) =>
          ['Acting', 'Directing'].includes(person.known_for_department)
        );

        actorsAndDirectors.sort((a, b) => b.popularity - a.popularity);

        const withPhoto = actorsAndDirectors.filter(p => p.profile_path);
        const withoutPhoto = actorsAndDirectors.filter(p => !p.profile_path);

        setResults([...withPhoto, ...withoutPhoto]);
      }
    } catch (error) {
      console.error('Error al buscar:', error);
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
        placeholder="Buscar..."
      />

      <div style={{ margin: '10px 0' }}>
        <label>
          <input
            type="radio"
            value="movie"
            checked={searchType === 'movie'}
            onChange={() => {
              setSearchType('movie');
              setResults([]);
            }}
          />
          Película
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            value="person"
            checked={searchType === 'person'}
            onChange={() => {
              setSearchType('person');
              setResults([]);
            }}
          />
          Persona
        </label>
      </div>

      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {results.length > 0 && (
        <ul style={{ marginTop: '20px' }}>
          {searchType === 'movie'
            ? results.map((movie) => (
                <li key={movie.id}>
                  <Link href={`/movie-details/${movie.id}`}>
                    <h3>{movie.title}</h3>
                  </Link>
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      style={{ width: '200px', borderRadius: '8px' }}
                    />
                  )}
                </li>
              ))
            : results.map((person) => (
                <li key={person.id}>
                  <Link href={`/person-movies/${person.id}`}>
                    <h3>{person.name}</h3>
                  </Link>
                  {person.profile_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                      alt={person.name}
                      style={{ width: '100px', borderRadius: '50%' }}
                    />
                  )}
                </li>
              ))}
        </ul>
      )}
    </div>
  );
}
