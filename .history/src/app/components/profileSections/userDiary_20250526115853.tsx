"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Score = {
  user_id: number;
  nickName: string;
  movie_id: number;
  movie_title: string;
  poster_path: string;
  puntuacion: number | null;
  comentario: string | null;
  viewed_at: string;
};

export default function Scores({ userId }: { userId: string }) {
  const [scores, setScores] = useState<Score[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState<Score | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchScores = async () => {
      try {
        const res = await fetch(`/api/puntuaciones/${userId}`);
        const data = await res.json();
        setScores(data);
      } catch (error) {
        console.error("Error loading scores:", error);
      }
    };

    fetchScores();
  }, [userId]);

  if (!scores.length)
    return <p className="mt-6 text-gray-300">There are no scores in your diary.</p>;

  function openModal(score: Score) {
    setSelectedScore(score);
    setModalOpen(true);
  }

  function closeModal() {
    setSelectedScore(null);
    setModalOpen(false);
  }

  return (
    <div className="mt-3">
      <h3 className="text-2xl font-bold mb-4">My Scores Diary</h3>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {scores.slice().reverse().map((score) => (
          <Link
            key={`${score.user_id}-${score.movie_id}`}
            href={`/movie-details/${score.movie_id}`}
            className="flex bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${score.poster_path}`}
              alt={score.movie_title}
              width={85}
              height={130}
              className="rounded"
            />
            <div className="flex flex-col justify-between flex-1 pl-4 min-w-0">
              <div className="mr-6">
                <p className="text-xl font-semibold">{score.movie_title}</p>
                <p className="text-yellow-400 font-bold text-base">
                  {score.puntuacion !== null ? `${score.puntuacion}⭐` : "No rating"}
                </p>
                <p className="mt-2 text-sm text-gray-300 break-words w-full line-clamp-3">{score.comentario}</p>
              </div>
              <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // evita navegación
                      openModal(score);
                    }}
                    className="text-xs text-[#22ec8a] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    View more
                  </button>

                <p className="text-xs text-gray-400 text-right min-w-[90px]">
                  {new Date(score.viewed_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {new Date(score.viewed_at).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && selectedScore && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 text-white rounded p-6 max-w-5xl w-full mx-4 relative flex gap-6 flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "80vh" }}
          >
            {/* Poster image */}
            <img
              src={`https://image.tmdb.org/t/p/w300${selectedScore.poster_path}`}
              alt={selectedScore.movie_title}
              className="rounded max-h-full object-contain"
              style={{ flexShrink: 0, width: "200px", height: "auto" }}
            />

            {/* Movie title, score and comment */}
            <div className="flex flex-col flex-1 overflow-auto">
              <h4 className="text-2xl font-bold mb-4">{selectedScore.movie_title}</h4>
              <p className="text-yellow-400 font-bold mb-6">
                {selectedScore.puntuacion !== null ? `${selectedScore.puntuacion}⭐` : "No rating"}
              </p>
              {selectedScore.comentario && (
                <p className="mb-6 whitespace-pre-wrap">{selectedScore.comentario}</p>
              )}
              <p className="text-xs text-gray-400 mt-auto self-end">
                {new Date(selectedScore.viewed_at).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(selectedScore.viewed_at).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
