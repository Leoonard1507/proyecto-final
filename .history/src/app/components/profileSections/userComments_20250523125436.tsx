"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Asegúrate de importar esto

type Comment = {
  movie_id: number;
  movie_title: string;
  poster_path: string;
  comentario: string;
  created_at: string;
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Comments.map((Comment) => (
      <Link
        key={Comment.movie_id}
        href={`/movie-details/${Comment.movie_id}`}
        className="flex items-start gap-4 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
      >
        <img
          src={`https://image.tmdb.org/t/p/w200${Comment.poster_path}`}
          alt={Comment.movie_title}
          width={100}
          height={150}
          className="rounded"
        />
        <div className="flex flex-col">
          <p className="text-base font-semibold">{Comment.movie_title}</p>
          <p className="mt-2 text-sm text-gray-300">{Comment.comentario}</p>
          <p className="mt-2 text-sm text-gray-300">{Comment.created_at}</p>
        </div>
      </Link>
    ))}
  </div>
</div>

  );
}
