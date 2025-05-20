"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Asegúrate de importar esto

type Comment = {
  movie_id: number;
  movie_title: string;
  poster_path: string;
  comentario: string;
};

export default function Comment({ userId }: { userId: string }) {
  const [Comments, setMovies] = useState<Comment[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/comment/${userId}`);
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Error al cargar los comentarios:", error);
      }
    };

    fetchComment();
  }, [userId]);

  if (!Comments.length) return <p className="mt-6 text-gray-300">No hay comentarios en tu perfil.</p>;

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-4">Mis comentarios</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Comments.map((Comment) => (
          <Link
            key={Comment.movie_id}
            href={`/movie-details/${Comment.movie_id}`} // 👈 Esto lleva a la página de detalles
            className="bg-gray-800 rounded-lg p-2 text-center hover:bg-gray-700 transition"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${Comment.poster_path}`}
              alt={Comment.movie_title}
              width={150}
              height={225}
              className="mx-auto rounded"
            />
            <p className="mt-2 text-sm">{Comment.movie_title}</p>
            <p className="mt-2 text-sm">{Comment.comentario}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
