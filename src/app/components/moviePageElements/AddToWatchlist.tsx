// Componente que contienen el boton mediante el cual se pasan los datos de la pelicula 
// para insertarla en la watchlist con api/watchlist

"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

interface Props {
    movieId: number;
    movieTitle: string;
    posterPath: string;
    isInWatchlist: boolean;
}

export default function AddToWatchlistButton({ movieId, movieTitle, posterPath }: Props) {
    const { data: session } = useSession();
    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!session) {
            alert("Debes iniciar sesión para añadir a la watchlist.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    movieId,
                    movieTitle,
                    posterPath,
                }),
                credentials: "include", // <- Aquí añadimos esta línea
            });


            const data = await res.json();

            if (!res.ok) {
                alert("Error: " + data.error);
            } else {
                setAdded(true);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleAdd}
            disabled={added || loading}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${added
                    ? "bg-gray-500 cursor-not-allowed text-white"
                    : "bg-[#22ec8a] hover:opacity-70 text-black"
                }`}
        >
            {loading ? "Añadiendo..." : added ? "In Watchlist" : "Add to Watchlist"}
        </button>
    );
}
