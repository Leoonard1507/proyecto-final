'use client';

import { useState } from 'react';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/user/searchUser?nickname=${searchTerm}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error buscando usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center py-5">
            <div className="w-full max-w-2xl p-6 mb-10">
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search user by nickname"
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

                <div className="flex flex-col gap-2">
                    {results.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                        >
                            <Link href={`/profile/${user.id}`} className="flex items-center gap-3 flex-grow">
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${user.id}`}
                                    alt={user.nickName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="text-white font-medium">{user.nickName}</span>
                            </Link>

                            {/* Botones fuera del Link */}
                            <div className="flex">
                                <BlockUserButton
                                    key={`${user.id}-${user.blocked}`} // clave única que cambia si cambia blocked
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
    );
}
