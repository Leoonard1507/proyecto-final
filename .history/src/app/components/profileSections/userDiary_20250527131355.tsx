"use client";

import { useEffect, useState, useRef } from "react";
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
  const [overflowMap, setOverflowMap] = useState<{ [key: number]: boolean }>({});
  const commentRefs = useRef<(HTMLParagraphElement | null)[]>([]);

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

  useEffect(() => {
    const newOverflowMap: { [key: number]: boolean } = {};

    commentRefs.current.forEach((el, index) => {
      if (el && el.scrollHeight > el.clientHeight + 1) {
        const key = scores[index]?.movie_id;
        if (key !== undefined) {
          newOverflowMap[key] = true;
        }
      }
    });

    setOverflowMap(newOverflowMap);
  }, [scores]);

  function openModal(score: Score) {
    setSelectedScore(score);
    setModalOpen(true);
  }

  function closeModal() {
    setSelectedScore(null);
    setModalOpen(false);
  }

  if (!scores.length)
    return <p className="mt-6 text-gray-300">There are no scores in your diary.</p>;

  return (
    <div className="mt-3">
      <h3 className="text-2xl font-semibold mb-4 text-white">Diary</h3>
      <div className="flex flex-wrap gap-4 pb-2">
        {scores.slice().map((score, index) => (
          <div
            key={`${score.user_id}-${score.movie_id}`}
            onClick={() => openModal(score)}
            className="min-w-[156px] max-w-[150px] flex-shrink-0 bg-gray-900 rounded-lg p-2 text-white relative cursor-pointer hover:bg-gray-800 transition"
          >
            {/* Fecha */}
            <div className="mb-1">
              <p className="text-[10px] text-gray-500">
                {new Date(score.viewed_at).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Carátula */}
            <div className="relative w-full rounded overflow-hidden mb-1">
              <img
                src={`https://image.tmdb.org/t/p/w300${score.poster_path}`}
                alt={score.movie_title}
                className="object-cover rounded"
                loading="lazy"
              />
            </div>

            {/* Título */}
            <p className="text-sm text-gray-300 truncate" title={score.movie_title}>
              {score.movie_title}
            </p>

            {/* Puntaje y comentario */}
            {(score.puntuacion !== null || score.comentario) && (
              <div className="flex justify-between mt-1">
                {score.puntuacion !== null ? (
                  <p className="text-yellow-400 font-bold">{score.puntuacion}⭐</p>
                ) : (
                  <div />
                )}

                {score.comentario ? (
                  <span
                    className="text-yellow-400 font-bold"
                    title={score.comentario}
                  >
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
            {/* Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w300${selectedScore.poster_path}`}
              alt={selectedScore.movie_title}
              className="rounded max-h-full object-contain"
              style={{ flexShrink: 0, width: "200px", height: "auto" }}
              loading="lazy"
            />

            {/* Info */}
            <div className="flex flex-col flex-1 overflow-auto">
              <h4 className="text-2xl font-bold mb-2">{selectedScore.movie_title}</h4>
              <p className="text-yellow-400 font-bold text-lg mb-6">
                {selectedScore.puntuacion !== null
                  ? `${selectedScore.puntuacion}⭐`
                  : "No rating"}
              </p>

              {selectedScore.comentario && (
                <p
                  className="whitespace-pre-wrap break-words overflow-auto mb-2"
                  style={{
                    wordBreak: "break-word",
                    maxHeight: "160px",
                    overflowY: "auto",
                  }}
                >
                  {selectedScore.comentario}
                </p>
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

            {/* Botón cerrar */}
            <button
              onClick={closeModal}
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
