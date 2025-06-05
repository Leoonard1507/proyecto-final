'use client'; // Indica que este componente se ejecuta del lado del cliente (React Client Component)

import { useEffect, useState } from 'react'; // Importa hooks de React
import Link from 'next/link'; // Enrutamiento con SPA (Single Page App)
import axiosInstance from '@/libs/axios'; // Instancia personalizada de Axios para hacer peticiones HTTP

// Define los tipos posibles de búsqueda
type SearchType = 'movie' | 'person' | 'user';

// Define el tipo para los usuarios
type UserType = {
  id: string;
  nickName: string;
  avatar: string;
};

export default function Search() {
  // Estados para la búsqueda, tipo de búsqueda y resultados
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('movie');
  const [results, setResults] = useState<any[]>([]);

  // Función principal para manejar la búsqueda según el tipo
  const handleSearch = async () => {
    if (!searchTerm) return; // No hace nada si no hay texto
    try {
      if (searchType === 'movie') {
        // Si se busca película, llama a la API de películas
        const response = await axiosInstance.get(`/search/movie?query=${searchTerm}`);
        const filteredMovies = response.data.results
          .filter((movie: any) => !movie.adult) // Filtra películas para excluir contenido adulto
          .sort((a: any, b: any) => b.popularity - a.popularity); // Ordena por popularidad
        setResults(filteredMovies);
      } else if (searchType === 'person') {
        // Si se busca persona, hace varias páginas de búsqueda para más resultados
        let allPeople: any[] = [];
        for (let page = 1; page <= 10; page++) {
          const response = await axiosInstance.get(`/search/person?query=${searchTerm}&page=${page}`);
          allPeople = allPeople.concat(response.data.results);
        }
        // Filtra personas cuyo nombre coincida con el término de búsqueda
        const filtered = allPeople.filter((person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Filtra por actores o directores
        const actorsAndDirectors = filtered.filter((person) =>
          ['Acting', 'Directing'].includes(person.known_for_department)
        );
        actorsAndDirectors.sort((a, b) => b.popularity - a.popularity); // Ordena por popularidad
        // Separa los que tienen foto de los que no, para mostrar primero los que tienen
        const withPhoto = actorsAndDirectors.filter(p => p.profile_path);
        const withoutPhoto = actorsAndDirectors.filter(p => !p.profile_path);
        setResults([...withPhoto, ...withoutPhoto]);
      } else if (searchType === 'user') {
        // Si se busca usuario, llama a una API personalizada
        const response = await fetch(`/api/user/searchUser?nickname=${searchTerm}`);
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error al buscar:', error); // Muestra error en consola si falla algo
    } finally {
    }
  };

  // Efecto que se activa cada vez que cambia el término o el tipo de búsqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(); // Llama a la búsqueda después de un pequeño retraso
      } else {
        setResults([]); // Si el campo está vacío, limpia resultados
      }
    }, 1); // El timeout está configurado en 1ms (aunque normalmente serían 500ms)

    return () => clearTimeout(delayDebounce); // Limpia el temporizador en cada cambio
  }, [searchTerm, searchType]);

  return (
    <div className="w-full flex flex-col items-center py-5">
      {/* Barra de búsqueda y filtros */}
      <div className="w-full max-w-2xl p-6 mb-10">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
            placeholder="Buscar película, persona o usuario..."
            className="w-full px-4 py-4 border-2 border-[#777] rounded-lg focus:outline-none focus:border-[#22ec8a] text-white"
          />
        </div>

        {/* Opciones de tipo de búsqueda */}
        <div className="flex items-center justify-center gap-6 text-white">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="movie"
              checked={searchType === 'movie'}
              onChange={() => {
                setSearchType('movie'); // Cambia tipo de búsqueda
                setResults([]); // Limpia resultados
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

      {/* Resultados de la búsqueda */}
      {results.length > 0 && (
        <div className="w-full max-w-2xl">
          <ul className="space-y-4">
            {searchType === 'user' ? (
              // Si el tipo de búsqueda es usuario, se muestra avatar y nickname
              results.map((user: UserType) => (
                <li key={user.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${user.id}`} // Avatar generado si no hay imagen
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
              // Si es persona o película, se muestra la imagen, título y fecha
              results.map((item) => (
                <li key={item.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path || item.profile_path}`} // Imagen de la película o persona
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
