'use client'; // Indica que este componente se ejecuta en el cliente (React Client Component)

import { signOut } from 'next-auth/react'; // Hook de next-auth para cerrar sesión
import Link from 'next/link'; // Componente de Next.js para navegación con SPA
import { useRouter } from 'next/navigation'; // Hook para navegación programática
import { useEffect, useState } from 'react'; // React hooks para estado y efectos

export default function Navbar() {
  const router = useRouter(); // Hook de enrutamiento
  const [role, setRole] = useState<string | null>(null); // Estado para guardar el rol del usuario

  // Efecto que obtiene el rol del usuario desde la sesión al montar el componente
  useEffect(() => {
    const fetchRole = async () => {
      const res = await fetch('/api/auth/session'); // Llama al endpoint que devuelve la sesión actual
      const data = await res.json(); // Extrae los datos en formato JSON
      setRole(data?.user?.role || null); // Guarda el rol en el estado, o null si no existe
    };

    fetchRole(); // Ejecuta la función al renderizar el componente
  }, []);

  // Redirige al usuario según su rol al hacer clic en el ícono de perfil
  const handleProfileClick = () => {
    if (role === 'administrator') {
      router.push('/administrator-profile'); // Si es admin, lo manda a su perfil
    } else if (role === 'client') {
      router.push('/client-profile'); // Si es cliente, a su perfil
    } else {
      router.push('/'); // Si no tiene rol, va al home
    }
  };

  // Función que cierra sesión con next-auth y redirige al home
  const handleLogout = async () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="sticky top-0 z-50 text-white px-10 py-4 flex justify-between items-center shadow-md bg-white/8 backdrop-blur-md">
      {/* Logo o título que lleva al home-page */}
      <div className="text-2xl font-bold">
        <Link href="/home-page">🎥 Filmogram</Link>
      </div>

      {/* Íconos de búsqueda, perfil y botón de logout */}
      <ul className="flex space-x-6 items-center text-lg">
        <li>
          {/* Ícono de búsqueda que lleva a la ruta /search */}
          <Link href="/search" className="hover:text-red-400 transition text-2xl">🔍</Link>
        </li>
        <li>
          {/* Botón que redirige al perfil dependiendo del rol */}
          <button onClick={handleProfileClick} className="hover:text-red-400 transition text-2xl cursor-pointer">👤</button>
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
