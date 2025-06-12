'use client'; // Este archivo es un componente cliente (React Client Component)

// Importaciones necesarias
import { signOut } from 'next-auth/react'; // Función para cerrar sesión con NextAuth
import Link from 'next/link'; // Enlaces SPA con Next.js
import { useRouter } from 'next/navigation'; // Para redireccionar de forma programática
import { useEffect, useState } from 'react'; // React Hooks para manejar estado y efectos secundarios

export default function Navbar() {
  const router = useRouter(); // Instancia para redirigir al usuario

  // Estado local para los datos del usuario
  const [role, setRole] = useState<string | null>(null); // Rol del usuario (admin, client, etc.)
  const [avatar, setAvatar] = useState<string | null>(null); // URL del avatar del usuario
  const [nickname, setNickname] = useState<string | null>(null); // Apodo del usuario (nickname)

  // useEffect para obtener avatar y nickname actualizados desde la API
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/user/me'); // Llama a tu endpoint para obtener avatar y nickname
      if (!res.ok) return; // Si la respuesta no es correcta, no hace nada

      const data = await res.json(); // Convierte la respuesta en JSON
      setAvatar(data.avatar); // Guarda el avatar en el estado
      setNickname(data.nickName); // Guarda el nickname en el estado
    };

    fetchUser(); // Ejecuta la función al cargar el componente
  }, []);

  // useEffect para obtener el rol del usuario desde la sesión
  useEffect(() => {
    const fetchRole = async () => {
      const res = await fetch('/api/auth/session'); // Llama al endpoint de sesión de NextAuth
      const data = await res.json(); // Convierte la respuesta a JSON
      setRole(data?.user?.role || null); // Guarda el rol del usuario en el estado
    };

    fetchRole(); // Ejecuta al cargar el componente
  }, []);

  // Función que redirige al perfil según el rol del usuario
  const handleProfileClick = () => {
    if (role === 'administrator') {
      router.push('/administrator-profile'); // Redirige al perfil de admin
    } else if (role === 'client') {
      router.push('/client-profile'); // Redirige al perfil de cliente
    } else {
      router.push('/'); // Si no hay rol, redirige al home
    }
  };

  // Función para cerrar sesión y redirigir al home
  const handleLogout = async () => {
    signOut({ callbackUrl: '/' }); // Cierra sesión y redirige
  };

  // Parte visual del navbar
  return (
    <nav className="sticky top-0 z-50 text-white px-10 py-4 flex justify-between items-center shadow-md bg-white/8 backdrop-blur-md">
      {/* Logo que lleva a la página principal */}
      <div className="text-2xl font-bold">
        <Link href="/home-page">🎥 Filmogram</Link>
      </div>

      {/* Sección derecha del navbar con iconos */}
      <ul className="flex space-x-6 items-center text-lg">
        <li>
          {/* Icono que redirige a la página de búsqueda */}
          <Link href="/search" className="hover:text-red-400 transition text-2xl">🔍</Link>
        </li>

        <li>
          {/* Botón que muestra avatar y nickname, y redirige al perfil según el rol */}
          <button onClick={handleProfileClick} className="flex items-center space-x-2 hover:opacity-80 transition cursor-pointer">
            {/* Muestra el avatar si existe */}
            {avatar && (
              <img
                src={avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            {/* Muestra el nickname si existe */}
            {nickname && <span className="text-base font-bold">{nickname}</span>}
          </button>
        </li>

        <li>
          {/* Botón para cerrar sesión */}
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
          >
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
}
