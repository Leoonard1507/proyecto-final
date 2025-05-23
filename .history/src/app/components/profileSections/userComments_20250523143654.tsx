"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

type Comment = {
  movie_id: number;
  movie_title: string;
  poster_path: string;
  comentario: string;
  created_at: string;
};

export default function Comment({ userId }: { userId: string }) {
  const [Comments, setComments] = useState<Comment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showReadMore, setShowReadMore] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!userId) return;

    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/comment/${userId}`);
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error al cargar los comentarios:", error);
      }
    };

    fetchComment();
  }, [userId]);

  // Después de que Comments se actualiza, chequeamos si el comentario excede 3 líneas
  useEffect(() => {
    if (Comments.length === 0) return;

    // Esperamos que el DOM renderice para medir
    setTimeout(() => {
      const newShowReadMore: { [key: number]: boolean } = {};
      Comments.forEach((comment) => {
        const el = document.getElementById(`comment-text-${comment.movie_id}`);
        if (el) {
          // Medimos altura y línea de texto (aprox 1.2em)
          const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
          const maxHeight = lineHeight * 3; // 3 líneas
          newShowReadMore[comment.movie_id] = el.scrollHeight > maxHeight + 1; // pequeño margen
        }
      });
      setShowReadMore(newShowReadMore);
    }, 0);
  }, [Comments]);

  if (!Comments.length)
    return <p className="mt-6 text-gray-300">No hay comentarios en tu perfil.</p>;

  function openModal(comment: Comment) {
    setSelectedComment(comment);
    setModalOpen(true);
  }

  function closeModal() {
    setSelectedComment(null);
    setModalOpen(false);
  }

  return (
    <div className="mt-3">
      <h3 className="text-2xl font-bold mb-4">Mis comentarios</h3>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {Comments.slice().reverse().map((comment) => (
          <Link
            key={comment.movie_id}
            href={`/movie-details/${comment.movie_id}`}
            className="flex bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${comment.poster_path}`}
              alt={comment.movie_title}
              width={85}
              height={130}
              className="rounded"
            />
            <div className="flex flex-col justify-between flex-1 pl-4 min-w-0">
              <div className="mr-6">
                <p className="text-xl font-semibold">{comment.movie_title}</p>
                <p
                  id={`comment-text-${comment.movie_id}`}
                  className="mt-2 text-sm text-gray-300 break-words w-full line-clamp-3"
                >
                  {comment.comentario}
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                {showReadMore[comment.movie_id] ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // evita navegación
                      openModal(comment);
                    }}
                    className="text-xs text-[#22ec8a] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    Ver más
                  </button>
                ) : (
                  // Espacio reservado para que la fecha se quede a la derecha igual
                  <div style={{ width: "48px" }}></div>
                )}

                <p className="text-xs text-gray-400 text-right min-w-[90px]">
                  {new Date(comment.created_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {new Date(comment.created_at).toLocaleTimeString("es-ES", {
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
      {modalOpen && selectedComment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 text-white rounded p-6 max-w-5xl w-full mx-4 relative flex gap-6 flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "80vh" }}
          >
            {/* Imagen del póster */}
            <img
              src={`https://image.tmdb.org/t/p/w300${selectedComment.poster_path}`}
              alt={selectedComment.movie_title}
              className="rounded max-h-full object-contain"
              style={{ flexShrink: 0, width: "200px", height: "auto" }}
            />

            {/* Texto y fecha/hora */}
            <div className="flex flex-col flex-1 overflow-auto">
              <h4 className="text-2xl font-bold mb-4">{selectedComment.movie_title}</h4>
              <p
                className="whitespace-normal break-words overflow-wrap-anywhere flex-grow"
                style={{ wordBreak: "break-word" }}
              >
                {selectedComment.comentario}
              </p>
              <p className="text-xs text-gray-400 mt-4 self-end">
                {new Date(selectedComment.created_at).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(selectedComment.created_at).toLocaleTimeString("es-ES", {
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
