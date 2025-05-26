import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Friend {
    user_id: number;
    nickName: string;
    avatar: string | null;
}

const WantsToWatch = ({ movieId }: { movieId: number }) => {
    const { data: session } = useSession();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWantsToWatch = async () => {
            if (!session?.user?.id) return;

            try {
                const res = await fetch(`/api/watchlist/movie-friends/${session.user.id}/${movieId}`);
                const data = await res.json();
                setFriends(data);
            } catch (error) {
                console.error('Error fetching wants to watch:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWantsToWatch();
    }, [session?.user?.id, movieId]);

    if (loading) return <p className="text-white">Loading...</p>;
    if (friends.length === 0) return <p className="text-white">No friends have this movie on their watchlist.</p>;

    return (
        <div className="flex gap-4 overflow-x-auto py-2">
        {friends.map(friend => (
          <Link
            key={friend.user_id}
            href={`/client-profile/${friend.user_id}`}
            className="flex flex-col items-center min-w-[80px] hover:opacity-80 transition"
          >
            {friend.avatar ? (
              <img
                src={friend.avatar}
                alt={`${friend.nickName} avatar`}
                className="w-16 h-16 rounded-md object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-md bg-gray-600 flex items-center justify-center text-gray-300 text-lg font-semibold">
                {friend.nickName.charAt(0).toUpperCase()}
              </div>
            )}
            <p className="mt-1 text-white text-sm text-center truncate max-w-[80px]">{friend.nickName}</p>
          </Link>
        ))}
      </div>
    );
};

export default WantsToWatch;
