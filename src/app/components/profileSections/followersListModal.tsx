'use client'; // Indica que este componente se ejecuta en el cliente (React Client Component)

import { useEffect, useState } from 'react'; // Hooks de React para manejar estado y efectos
import Link from 'next/link'; // Componente de Next.js para navegación entre páginas

// Tipo para definir cómo luce un usuario
type User = {
  id: string;
  avatar: string;
  username: string;
  nickName: string;
};

// Props esperadas por el componente
type Props = {
  userId: string; // ID del usuario del cual queremos mostrar seguidores/seguidos
  type: 'followers' | 'following'; // Indica si mostrar seguidores o seguidos
  onClose: () => void; // Función para cerrar el modal
};

export default function FollowersModal({ userId, type, onClose }: Props) {
  const [users, setUsers] = useState<User[]>([]); // Estado para almacenar la lista de usuarios
  const [loading, setLoading] = useState(true); // Estado para mostrar el estado de carga

  useEffect(() => {
    // Efecto que se ejecuta cuando el componente se monta o cambian userId o type
    const fetchUsers = async () => {
      try {
        // Llama al endpoint correspondiente para obtener los usuarios
        const res = await fetch(`/api/follow/${type}/${userId}`);
        const data = await res.json(); // Intenta convertir la respuesta a JSON
        // Guarda los usuarios en el estado, adaptando según el formato de la respuesta
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        console.error('Error fetching users:', err); // Muestra errores en consola si falla la petición
      } finally {
        setLoading(false); // Oculta el mensaje de carga al finalizar
      }
    };

    fetchUsers(); // Llama a la función
  }, [userId, type]); // Dependencias del efecto

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 h-full h-full">
      {/* Fondo oscuro con desenfoque que cubre toda la pantalla */}
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 relative">
        {/* Contenedor del modal */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
        {/* Botón de cierre (X) en la esquina superior derecha */}
        <h2 className="text-xl font-bold mb-4 capitalize">{type}</h2>
        {/* Título del modal, muestra 'followers' o 'following' */}
        {loading ? (
          <p>Loading...</p> // Mensaje mientras se cargan los datos
        ) : users.length === 0 ? (
          <p>No {type} found.</p> // Mensaje si no hay usuarios
        ) : (
          <ul className="flex flex-col gap-3 max-h-80 overflow-y-auto">
            {/* Lista de usuarios obtenidos */}
            {users.map((user) => (
              <li key={user.id} className="pb-2 flex items-center gap-3">
                <Link href={`/client-profile/${user.id}`} className=" flex items-center gap-3 hover:opacity-70">
                  {/* Enlace al perfil del usuario */}
                  <img
                    src={user.avatar || "https://api.dicebear.com/7.x/bottts/png?seed=default"}
                    alt={`${user.username} avatar`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  {/* Imagen de avatar del usuario */}
                  <span>@{user.nickName}</span> {/* Muestra el nick del usuario */}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
