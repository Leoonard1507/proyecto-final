'use client';

import { useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/libs/axios';

type SearchType = 'movie' | 'person' | 'user';

type UserType = {
  id: string;
  nickName: string;
  avatar: string;
};

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('movie');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      if (searchType === 'movie') {
        const response = await axiosInstance.get(`/search/movie?query=${searchTerm}`);
        const filteredMovies = response.data.results
          .filter((movie: any) => !movie.adult)
          .sort((a: any, b: any) => b.popularity - a.popularity);
        setResults(filteredMovies);
      } else if (searchType === 'person') {
        let allPeople: any[] = [];
        for (let page = 1; page <= 10; page++) {
          const response = await axiosInstance.get(`/search/person?query=${searchTerm}&page=${page}`);
          allPeople = allPeople.concat(response.data.results);
        }
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
      } else if (searchType === 'user') {
        // Aquí llamamos a tu API personalizada de usuarios para buscar por nickname
        const response = await fetch(`/api/user/searchUser?nickname=${searchTerm}`);
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error al buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-5">
      {/* Barra de búsqueda y filtros */}
      <div className="w-full max-w-2xl p-6 mb-10">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar película, persona o usuario..."
            className="w-full px-4 py-2 border-2 border-[#777] rounded focus:outline-none focus:border-[#22ec8a] text-white"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#22ec8a] text-black font-bold px-4 py-2 rounded hover:opacity-70 transition-opacity"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-white">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="movie"
              checked={searchType === 'movie'}
              onChange={() => {
                setSearchType('movie');
                setResults([]);
              }}
              className="accent-[#22ec8a]"
            />
            <span>Film</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="person"
              checked={searchType === 'person'}
              onChange={() => {
                setSearchType('person');
                setResults([]);
              }}
              className="accent-[#22ec8a]"
            />
            <span>Actor/Director</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="user"
              checked={searchType === 'user'}
              onChange={() => {
                setSearchType('user');
                setResults([]);
              }}
              className="accent-[#22ec8a]"
            />
            <span>User</span>
          </label>
        </div>
      </div>

      {/* Resultados */}
      {results.length > 0 && (
        <div className="w-full max-w-2xl">
          <ul className="space-y-4">
            {searchType === 'user' ? (
              results.map((user: UserType) => (
                <li key={user.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${user.id}`}
                    alt={user.nickName}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                  <div className="text-white flex-1">
                    <h3 className="font-bold">{user.nickName}</h3>
                  </div>
                  <Link href={`/client-profile/${user.id}`}>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded hover:opacity-70 transition">
                      View Profile
                    </button>
                  </Link>
                </li>
              ))
            ) : (
              results.map((item) => (
                <li key={item.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path || item.profile_path}`}
                    className="w-24 h-36 object-cover rounded-lg"
                    alt={item.title || item.name}
                  />
                  <div className="text-white flex-1">
                    <h3 className="font-bold">{item.title || item.name}</h3>
                    <p className="opacity-70">{item.release_date}</p>
                  </div>
                  <Link href={searchType === 'movie' ? `/movie-details/${item.id}` : `/person-movies/${item.id}`}>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded hover:opacity-70 transition">
                      More
                    </button>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
