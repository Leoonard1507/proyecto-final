'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Activity = {
  user_id: number;
  nickName: string;
  movie_id: number;
  movie_title: string;
  poster_path: string;
  puntuacion: number | null;
  comentario: string | null;
  viewed_at: string;
};

export default function FollowingActivityCarousel({ userId }: { userId?: number }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/follow/activity/${userId}`);
        const text = await res.text();
        const data = JSON.parse(text);

        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          setActivities([]);
        }
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  if (!userId) return <p className="text-white">User not logged in</p>;
  if (loading) return <p className="text-white">Loading activity...</p>;
  if (activities.length === 0) return <p className="text-white">No recent activity from people you follow.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">Friend's Activity</h2>
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {activities.map((activity) => (
          <div
            key={`${activity.user_id}-${activity.movie_id}-${activity.viewed_at}`}
            className="min-w-[150px] max-w-[150px] flex-shrink-0 bg-gray-900 rounded-lg p-2 text-white relative cursor-pointer"
            onClick={() => setSelectedActivity(activity)}
          >
            {/* Nombre y fecha */}
            <div className="mb-1">
              <p
                className="text-xs text-gray-300 font-semibold truncate"
                title={activity.nickName}
              >
                {activity.nickName}
              </p>
              <p className="text-[10px] text-gray-500">
                {new Date(activity.viewed_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Carátula */}
            <div className="relative w-full h-[225px] rounded overflow-hidden mb-2">
              <img
                src={`https://image.tmdb.org/t/p/w300${activity.poster_path}`}
                alt={activity.movie_title}
                className="object-cover rounded"
              />
            </div>

            <p className="text-sm text-gray-300 truncate" title={activity.movie_title}>
              {activity.movie_title}
            </p>

            {(activity.puntuacion !== null || activity.comentario) && (
              <div className="flex justify-between mt-1">
                {activity.puntuacion !== null ? (
                  <p className="text-yellow-400 font-bold">{activity.puntuacion}⭐</p>
                ) : (
                  <div />
                )}

                {activity.comentario ? (
                  <span className="text-yellow-400 font-bold" title={activity.comentario}>
                    💬
                  </span>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal para selectedActivity */}
{selectedActivity && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
    onClick={() => setSelectedActivity(null)}
  >
    <div
      className="bg-gray-900 text-white rounded p-6 max-w-5xl w-full mx-4 relative flex gap-6 flex-col md:flex-row"
      onClick={(e) => e.stopPropagation()}
      style={{ maxHeight: "80vh" }}
    >
      {/* Imagen del póster */}
      <Link
        href={`/movie-details/${selectedActivity.movie_id}`}
        className="flex-shrink-0"
      >
        <img
          src={`https://image.tmdb.org/t/p/w300${selectedActivity.poster_path}`}
          alt={selectedActivity.movie_title}
          className="rounded max-h-full object-contain cursor-pointer"
          style={{ width: "200px", height: "auto" }}
        />
      </Link>

      {/* Texto e información */}
      <div className="flex flex-col flex-1 overflow-auto">
        <p
          className="text-sm text-gray-300 font-semibold mb-1"
          title={selectedActivity.nickName}
        >
          {selectedActivity.nickName} ha visto:
        </p>

        <h3 className="text-2xl font-bold mb-2">
          {selectedActivity.movie_title}
        </h3>

        {selectedActivity.puntuacion !== null && (
          <p className="text-yellow-400 font-bold mb-2 text-lg">
            {selectedActivity.puntuacion} ⭐
          </p>
        )}

        {selectedActivity.comentario && (
          <p
            className="whitespace-pre-wrap break-words overflow-wrap-anywhere max-h-40 overflow-auto mb-2"
            style={{ wordBreak: "break-word" }}
          >
            {selectedActivity.comentario}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-auto self-end">
          {new Date(selectedActivity.viewed_at).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          {new Date(selectedActivity.viewed_at).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={() => setSelectedActivity(null)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
        aria-label="Cerrar modal"
      >
        &times;
      </button>
    </div>
  </div>
)}

    </div>
  );
}
