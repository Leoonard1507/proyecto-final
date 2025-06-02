"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface AddToWatchlistProps {
  movieId: number;
  movieTitle: string;
  posterPath: string;
}

export default function AddToWatchlist({
  movieId,
  movieTitle,
  posterPath,
}: AddToWatchlistProps) {
  const { data: session } = useSession();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/watchlist/${session.user.id}`);
        if (!res.ok) throw new Error("Error al obtener la watchlist");
        const data = await res.json();
        const inList = data.some((movie: any) => movie.movie_id === movieId);
        setIsInWatchlist(inList);
      } catch (err) {
        console.error("Error al cargar la watchlist:", err);
      }
    };

    fetchWatchlist();
  }, [session, movieId]);

  const handleAddToWatchlist = async () => {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieId,
          movie_title: movieTitle,
          poster_path: posterPath,
        }),

      });

      if (!res.ok) throw new Error("Error al añadir a la watchlist");

      setIsInWatchlist(true);
    } catch (err) {
      console.error("Error al añadir a la watchlist:", err);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      const res = await fetch("/api/watchlist/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      });

      if (!res.ok) throw new Error("Error al eliminar de la watchlist");

      setIsInWatchlist(false);
    } catch (err) {
      console.error("Error al eliminar de la watchlist:", err);
    }
  };

  return (
    <div>
      {isInWatchlist ? (
        <button
          onClick={handleRemoveFromWatchlist}
          className="bg-red-800 text-white px-4 py-3 rounded hover:opacity-70 cursor-pointer"
        >
          Remove from Watchlist
        </button>
      ) : (
        <button
          onClick={handleAddToWatchlist}
          className="bg-blue-600 text-white px-4 py-3 rounded hover:opacity-70 cursor-pointer"
        >
          Add to Watchlist
        </button>
      )}
    </div>
  );
}
