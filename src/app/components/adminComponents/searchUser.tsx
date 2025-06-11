'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // ✅
import Link from 'next/link';
import { BlockUserButton } from './blockUserButton';
import { DeleteUserButton } from './deleteUserButton';

type UserType = {
  id: string;
  nickName: string;
  avatar: string;
  blocked: boolean;
};

export default function UserSearch() {
  const { data: session } = useSession(); 
  const currentUserId = session?.user?.id; 

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserType[]>([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchResults = async () => {
        if (!searchTerm) {
          setResults([]);
          return;
        }
        try {
          const response = await fetch(`/api/user/searchUser?nickname=${searchTerm}`);
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error('Error searching for users:', error);
        }
      };

      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="w-full lg:w-[400px] mt-10 lg:mt-0 border border-white rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">User management</h2>
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user by nickname"
              className="w-full px-4 py-2 border-2 border-[#777] rounded focus:outline-none focus:border-[#22ec8a] text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            {results
              .filter((user) => user.id !== currentUserId) // ✅ Filtrado aquí
              .map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                >
                  <Link href={`/client-profile/${user.id}`} className="flex items-center gap-3 flex-grow">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${user.id}`}
                      alt={user.nickName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-white font-medium">{user.nickName}</span>
                  </Link>
                  <div className="flex">
                    <BlockUserButton
                      key={`${user.id}-${user.blocked}`}
                      userId={user.id}
                      blocked={user.blocked}
                      onBlock={(newBlocked) => {
                        setResults((prev) =>
                          prev.map((u) => (u.id === user.id ? { ...u, blocked: newBlocked } : u))
                        );
                      }}
                    />
                    <DeleteUserButton userId={user.id} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
