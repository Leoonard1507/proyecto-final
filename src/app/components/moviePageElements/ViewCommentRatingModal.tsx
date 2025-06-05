import { useState } from "react";
import type { Movie } from "@/app/movie-details/[id]/page";
import { toast } from "react-toastify";

interface Props {
  movie: Movie;
  onClose: () => void;
}

export default function ViewCommentRatingModal({ movie, onClose }: Props) {
  const [comentario, setComentario] = useState("");
  const [puntuacion, setPuntuacion] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      puntuacion !== undefined &&
      (puntuacion < 1 || puntuacion > 10 || puntuacion % 0.5 !== 0)
    ) {
      toast.error("The rating must be between 1 and 10");
      return;
    }

    setLoading(true);

    try {
      let comment_id = null;
      let puntuacion_id = null;

      if (comentario.trim()) {
        const resComment = await fetch("/api/comment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movie_id: movie.id,
            movie_title: movie.title,
            poster_path: movie.poster_path,
            comentario,
          }),
        });

        const dataComment = await resComment.json();
        comment_id = dataComment.insertId || null;
      }

      if (puntuacion !== undefined) {
        const resPunt = await fetch("/api/ratings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movie_id: movie.id,
            movie_title: movie.title,
            poster_path: movie.poster_path,
            puntuacion,
          }),
        });

        const dataPunt = await resPunt.json();
        puntuacion_id = dataPunt.insertId || null;
      }

      await fetch("/api/views", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movie.id,
          movie_title: movie.title,
          poster_path: movie.poster_path,
          comment_id,
          puntuacion_id,
        }),
      });

      toast.success("Saved successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving data");
    }

  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-gray-900 text-white p-6 rounded-md max-w-md w-full">
        <h2 className="text-lg text-center font-semibold text-white">I&apos;ve watched:</h2>
        {/* Movie mini header */}
        <div className="flex items-center gap-4 mb-6 border-b border-[#22ec8a] pb-3">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
              alt={movie.title}
              className="w-14 rounded"
            />
          )}
          <h2 className="text-lg font-semibold text-white">{movie.title}</h2>
        </div>

        <label className="block mb-2">
          Rating:
          <input
            type="number"
            min={1}
            max={10}
            step={1}
            value={puntuacion ?? ""}
            onChange={(e) =>
              setPuntuacion(e.target.value ? parseFloat(e.target.value) : undefined)
            }
            className="w-full p-2 rounded bg-gray-800 text-white mt-1 border-2 border-[#777] focus:outline-none focus:border-[#22ec8a]"
          />
        </label>

        <label className="block mb-4">
          Comment:
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            className="w-full p-2 rounded bg-gray-800 text-white mt-1 border-2 border-[#777] focus:outline-none focus:border-[#22ec8a]"
            placeholder="Write your comment here..."
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#22ec8a] rounded hover:bg-[#20d177] text-black font-semibold"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
