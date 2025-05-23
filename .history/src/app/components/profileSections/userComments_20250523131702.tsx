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

  useEffect(() => {
    // Comprobar qué comentarios necesitan "Ver más"
    const newShowReadMore: { [key: number]: boolean } = {};

    Comments.forEach((comment) => {
      const el = document.getElementById(`comment-text-${comment.movie_id}`);
      if (el) {
        // 3 líneas de texto aprox con line-height ~1.2-1.3 => calculamos altura para 3 líneas
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
        const maxHeight = lineHeight * 3;
        newShowReadMore[comment.movie_id] = el.scrollHeight > maxHeight;
      }
    });

    setShowReadMore(newShowReadMore);
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
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-4">Mis comentarios</h3>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {Comments.map((comment) => (
          <Link
            key={comment.movie_id}
            href={`/movie-details/${comment.movie_id}`}
            className="flex bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${comment.poster_path}`}
              alt={comment.movie_title}
              width={70}
              height={120}
              className="rounded"
            />
            <div className="flex flex-col justify-between flex-1 pl-4 min-w-0">
              <div>
                <p className="text-xl font-semibold">{comment.movie_title}</p>
                <p
                  id={`comment-text-${comment.movie_id}`}
                  className="mt-2 text-sm text-gray-300 break-words w-full line-clamp-3"
                  style={{ overflow: "hidden" }}
                >
                  {comment.comentario}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                {showReadMore[comment.movie_id] && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openModal(comment);
                    }}
                    className="text-xs text-blue-400 hover:underline flex-shrink-0"
                  >
                    Ver más
                  </button>
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
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 text-white rounded p-6 max-w-lg w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-xl font-bold mb-4">{selectedComment.movie_title}</h4>
            <p className="mb-4 whitespace-pre-wrap">{selectedComment.comentario}</p>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold"
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
