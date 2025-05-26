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

  // Mapa para controlar qué comentarios tienen overflow (más de 2 líneas)
  const [overflowMap, setOverflowMap] = useState<{ [key: number]: boolean }>({});

  // Referencias a los elementos <p> de los comentarios
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

  // Detectar overflow en los comentarios (más de 2 líneas)
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
      <h3 className="text-2xl font-bold mb-4">My Scores Diary</h3>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {scores.slice().reverse().map((score, index) => (
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

                {/* Comentario con line-clamp-2 para limitar a 2 líneas */}
                <p
                  ref={(el) => (commentRefs.current[index] = el)}
                  className="mt-2 text-sm text-gray-300 break-words w-full line-clamp-2"
                >
                  {score.comentario}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                {/* Mostrar botón solo si el comentario pasa de 2 líneas */}
                 {!overflowMap[score.movie_id] ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // evita navegación
                      openModal(score);
                    }}
                    className="text-xs text-[#22ec8a] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    View more
                  </button>
                ) : (
                  // Espacio reservado para que la fecha se quede a la derecha igual
                  <div style={{ width: "48px" }}></div>
                )}

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
                {selectedActivity.nickName} has watched:
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
