import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Activity {
  user_id: number;
  nickName: string;
  avatar: string | null;
  puntuacion: number | null;
  comentario: string | null;
  viewed_at: string;
}

const WatchedByFriends = ({ movieId }: { movieId: number }) => {
  const { data: session } = useSession();
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await axios.get(`/api/follow/activity/${session.user.id}?movieId=${movieId}`);
        setActivity(res.data);
      } catch (error) {
        console.error('Error fetching friend activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [session?.user?.id, movieId]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (activity.length === 0) return <p className="text-white">No friend has seen this movie yet.</p>;

  return (
    <div className="space-y-3 text-white">
      {activity.map((entry, idx) => (
        <div key={idx} className="bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">

            <Link href={`/client-profile/${entry.user_id}`} className="hover:opacity-70">
              <div className="flex items-center gap-3">
                {entry.avatar ? (
                  <img
                    src={entry.avatar}
                    alt={`${entry.nickName} avatar`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                    {entry.nickName.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="font-semibold">{entry.nickName}</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm">{entry.viewed_at.slice(0, 16).replace('T', ' ')}</p>
          </div>
          {entry.puntuacion !== null && (
            <p className="text-yellow-400 ml-2 mt-4">{entry.puntuacion}⭐</p>
          )}
          {entry.comentario && (
            <p className="text-gray-300 italic mt-2">“{entry.comentario}”</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default WatchedByFriends;
