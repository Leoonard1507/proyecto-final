'use client';

import { useState } from 'react';
import EditProfile from "@/app/components/editProfile";

const userPrueba = {
  username: 'alvaroRguez',
  bio: 'Amante del cine independiente y los thrillers psicológicos.'
};

export default function ProfilePage() {
  const [user] = useState(userPrueba);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <main style={{ padding: '2rem' }}>
      <section style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>{user.username}</h1>
          <p style={{ color: '#555' }}>{user.bio}</p>
        </div>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cerrar edición' : 'Editar perfil'}
        </button>
      </section>

      {isEditing ? (
        <EditProfile />
      ) : (
        <section>
          <ul>
            <li>🎬 Watchlist</li>
            <li>📝 Diario</li>
            <li>⭐ Mis puntuaciones</li>
          </ul>
        </section>
      )}
    </main>
  );
}
