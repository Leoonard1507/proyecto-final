"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/libs/axios";
import Link from "next/link";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
}
interface Person {
    name: string;
    profile_path: string;
}

const PersonMoviesPage = () => {
    const params = useParams();
    const { id } = params;

    const [person, setPerson] = useState<Person | null>(null);
    const [actorMovies, setActorMovies] = useState<Movie[]>([]);
    const [directorMovies, setDirectorMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersonCredits = async () => {
            try {
                // Detalles de la persona (nombre, foto)
                const personRes = await axiosInstance.get(`/person/${id}`);
                setPerson(personRes.data);


                const res = await axiosInstance.get(`/person/${id}/movie_credits`);
                const { cast, crew } = res.data;

                const actor = cast || [];
                const director = (crew || []).filter((movie: any) => movie.job === "Director");

                setActorMovies(actor);
                setDirectorMovies(director);
            } catch (error) {
                console.error("Error fetching person movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonCredits();
    }, [id]);

    if (loading) return <div>Cargando...</div>;

    return (
        <div>

            {person && (
                <div style={{ marginBottom: "20px" }}>
                    <h1>{person.name}</h1>
                    {person.profile_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                            alt={person.name}
                            style={{ borderRadius: "50%", width: "150px", height: "auto" }}
                        />
                    )}
                </div>
            )}
            <h2>Películas Dirigidas</h2>
            <ul>
                {directorMovies.map((movie) => (
                    <li key={movie.id}>
                        <Link href={`/movie-details/${movie.id}`}>
                            <h4>{movie.title}</h4>
                        </Link>
                        {movie.poster_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                style={{ width: "120px", borderRadius: "6px" }}
                            />
                        )}
                    </li>
                ))}
            </ul>

            <h2>Películas en la que actuó</h2>
            <ul>
                {actorMovies.map((movie) => (
                    <li key={movie.id}>
                        <Link href={`/movie-details/${movie.id}`}>
                            <h4>{movie.title}</h4>
                        </Link>
                        {movie.poster_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                style={{ width: "120px", borderRadius: "6px" }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PersonMoviesPage;
