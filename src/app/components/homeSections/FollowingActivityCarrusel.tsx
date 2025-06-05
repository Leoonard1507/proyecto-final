'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

type Activity = {
  id: number;
  user_id: number;
  nickName: string;
  movie_id: number;
  movie_title: string;
  poster_path: string;
  puntuacion: number | null;
  comentario: string | null;
  comment_id: number;
  viewed_at: string;
};

export default function FollowingActivityCarousel({ userId }: { userId?: number }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemWidth = 150; // ancho fijo
  const gap = 16; // espacio entre elementos
  const scrollWidth = itemWidth + gap;
  const visibleItems = 5; // puedes ajustar esto si el diseño cambia

  const maxIndex = Math.max(0, activities.length - visibleItems);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/follow/activity/${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) setActivities(data);
        else setActivities([]);
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));

  if (!userId) return <p className="text-white">User not logged in</p>;
  if (loading) return <p className="text-white">Loading activity...</p>;
  if (activities.length === 0)
    return <p className="text-white">No recent activity from people you follow.</p>;

  return (
    <div className="mt-8 relative">
      <h2 className="text-2xl font-semibold mb-4 text-white">Friend&apos;s Activity</h2>

      <div className="overflow-hidden relative">
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 space-x-4"
          style={{
            transform: `translateX(-${currentIndex * scrollWidth}px)`,
          }}
        >
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="min-w-[150px] max-w-[150px] flex-shrink-0 bg-gray-900 rounded-lg p-2 text-white relative hover:bg-gray-800 cursor-pointer"
              onClick={() => setSelectedActivity(activity)}
            >
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

              <div className="relative w-full rounded overflow-hidden mb-1">
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
                  ) : <div />}
                  {activity.comentario ? (
                    <span className="text-yellow-400 font-bold" title={activity.comentario}>
                      💬
                    </span>
                  ) : <div />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {activities.length > visibleItems && (
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 -translate-y-1/2 pointer-events-none">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="pointer-events-auto text-white bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 disabled:opacity-30"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="pointer-events-auto text-white bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 disabled:opacity-30"
          >
            ›
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedActivity && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="bg-gray-900 text-white rounded p-6 max-w-5xl w-full mx-4 relative flex gap-6 flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '80vh' }}
          >
            <Link href={`/movie-details/${selectedActivity.movie_id}`} className="flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w300${selectedActivity.poster_path}`}
                alt={selectedActivity.movie_title}
                className="rounded max-h-full object-contain cursor-pointer"
                style={{ width: '200px', height: 'auto' }}
              />
            </Link>

            <div className="flex flex-col flex-1 overflow-auto">
              <p
                className="text-sm text-gray-300 font-semibold mb-1"
                title={selectedActivity.nickName}
              >
                <Link href={`/client-profile/${selectedActivity.user_id}`} className="hover:opacity-70">
                {selectedActivity.nickName}
                </Link> has watched:
              </p>

              <h3 className="text-2xl font-bold mb-2">{selectedActivity.movie_title}</h3>

              {selectedActivity.puntuacion !== null && (
                <p className="text-yellow-400 font-bold mb-2 text-lg">
                  {selectedActivity.puntuacion} ⭐
                </p>
              )}

              {selectedActivity.comentario && (
                <>
                  <p className="whitespace-pre-wrap break-words max-h-40 overflow-auto mb-2">
                    {selectedActivity.comentario}
                  </p>
                </>
              )}

              <p className="text-xs text-gray-400 mt-auto self-end">
                {new Date(selectedActivity.viewed_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}{' '}
                {new Date(selectedActivity.viewed_at).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

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
