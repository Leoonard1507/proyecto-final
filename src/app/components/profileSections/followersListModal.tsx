'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
    id: string;
    avatar: string;
    username: string;
    nickName: string;
};

type Props = {
    userId: string;
    type: 'followers' | 'following'; // define qué endpoint usar
    onClose: () => void;
};

export default function FollowersModal({ userId, type, onClose }: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/follow/${type}/${userId}`);
                const data = await res.json();
                console.log('Fetched data:', data); // para ver qué recibes
                setUsers(Array.isArray(data) ? data : data.users || []);
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userId, type]);
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                <h2 className="text-xl font-bold mb-4 capitalize">{type}</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : users.length === 0 ? (
                    <p>No {type} found.</p>
                ) : (
                    <ul className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                        {users.map((user) => (
                            <li key={user.id} className="pb-2 flex items-center gap-3">
                                <Link href={`/client-profile/${user.id}`} className=" flex items-center gap-3 hover:opacity-70">
                                    <img
                                        src={user.avatar || "https://api.dicebear.com/7.x/bottts/png?seed=default"}
                                        alt={`${user.username} avatar`}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <span>@{user.nickName}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
