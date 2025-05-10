'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        // Aquí podrías limpiar cookies, localStorage, o llamar a un endpoint
        // Por ahora simulamos cierre de sesión redirigiendo al login
        // localStorage.removeItem('token'); (si lo usas)
        router.push('/');
    };

    return (
        <nav className="sticky top-0 z-50 text-white px-10 py-4 flex justify-between items-center shadow-md bg-white/8 backdrop-blur-md">
            <div className="text-2xl font-bold">
                <Link href="/home-page">🎥 Home</Link>
            </div>
            <ul className="flex space-x-6 items-center text-lg">
                <li>
                    <Link href="/search" className="hover:text-red-400 transition text-2xl">🔍</Link>
                </li>
                <li>
                    <Link href="/administrator/profile" className="hover:text-red-400 transition text-2xl">👤</Link>
                </li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Sign Out
                    </button>
                </li>
            </ul>
        </nav>
    );
}
