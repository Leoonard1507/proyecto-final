'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setRole(data?.user?.role || null);
    };

    fetchRole();
  }, []);

  const handleProfileClick = () => {
    if (role === 'administrator') {
      router.push('/administrator-profile');
    } else if (role === 'client') {
      router.push('/client-profile');
    } else {
      router.push('/');
    }
  };

  const handleLogout = async () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="sticky top-0 z-50 text-white px-10 py-4 flex justify-between items-center shadow-md bg-white/8 backdrop-blur-md">
      <div className="text-2xl font-bold">
        <Link href="/home-page">🎥 Filmogram</Link>
      </div>
      <ul className="flex space-x-6 items-center text-lg">
        <li>
          <Link href="/search" className="hover:text-red-400 transition text-2xl">🔍</Link>
        </li>
        <li>
          <button onClick={handleProfileClick} className="hover:text-red-400 transition text-2xl cursor-pointer">👤</button>
        </li>
        <li>
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
