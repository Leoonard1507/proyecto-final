'use client';

import { useState, useRef } from 'react';
import SearchFavsEdit from "@/app/components/searchFavsEdit";

export default function EditProfile() {
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  //const [profileImage, setProfileImage] = useState('');
  const searchRef = useRef<{ clearResults: () => void }>(null);

  const handleAddFavorite = (movie: any) => {
    if (favoriteMovies.find((fav) => fav.id === movie.id)) return;
    if (favoriteMovies.length >= 5) return;

    setFavoriteMovies([...favoriteMovies, movie]);
    setShowSearch(false);
    if (searchRef.current) {
      searchRef.current.clearResults();
    }
  };

  const handleRemoveFavorite = (movieId: number) => {
    setFavoriteMovies(favoriteMovies.filter((m) => m.id !== movieId));
  };

  // De momento console log
  const handleSave = () => {
    console.log('Guardando perfil:');
    console.log('Username:', username);
    console.log('Bio:', bio);
    //console.log('Imagen:', profileImage);
    console.log('Películas favoritas:', favoriteMovies);


    // Aquí iría la llamada a la API para guardar los datos del usuario

  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Editar perfil</h2>

      {/* Nombre de usuario */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Nombre de usuario:</label><br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      {/* Biografía */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Biografía:</label><br />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>


      <h3>Selecciona tus 5 películas favoritas</h3>

      {/* Botón para mostrar el buscador */}
      {favoriteMovies.length < 5 && !showSearch && (
        <button onClick={() => setShowSearch(true)}>Añadir película</button>
      )}

      {/* Buscador visible solo cuando el botón ha sido pulsado */}
      {showSearch && (
        <SearchFavsEdit ref={searchRef} onSelectMovie={handleAddFavorite} />
      )}


      {/* Lista de favoritas */}
      <div style={{ marginTop: '1rem' }}>
        <h4>Tus favoritas:</h4>
        <ul>
          {favoriteMovies.map((movie) => (
            <li key={movie.id} style={{ marginBottom: '10px' }}>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '100px', borderRadius: '8px', marginLeft: '10px' }}
                />
              )}
              <button
                onClick={() => handleRemoveFavorite(movie.id)}
                style={{ marginLeft: '1rem' }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón para guardar cambios */}
      <button onClick={handleSave} style={{ marginTop: '2rem' }}>
        Guardar cambios
      </button>
    </div>
  );
}
