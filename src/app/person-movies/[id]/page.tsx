/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/libs/axios";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

// Interfaces para tipar los datos recibidos
interface Movie {
  id: number;
  title: string;
  poster_path: string;
}
interface Person {
  name: string;
  profile_path: string;
  biography: string;
}

const PersonMoviesPage = () => {
  // Obtener el parámetro 'id' de la URL
  const params = useParams();
  const { id } = params;
  // Estados para almacenar los datos y controlar la UI
  const [person, setPerson] = useState<Person | null>(null);
  const [actorMovies, setActorMovies] = useState<Movie[]>([]);
  const [directorMovies, setDirectorMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);
  const [activeTab, setActiveTab] = useState<'acted' | 'directed'>('acted');

  useEffect(() => {
    // Función para obtener los créditos y detalles de la persona
    const fetchPersonCredits = async () => {
      try {
        // Obtener detalles básicos de la persona (nombre, foto, biografía)
        const personRes = await axiosInstance.get(`/person/${id}`);
        setPerson(personRes.data);

        // Obtener películas donde participó como actor y director
        const res = await axiosInstance.get(`/person/${id}/movie_credits`);
        const { cast, crew } = res.data;

        const actor = cast || [];
        // Filtrar las películas en las que fue director
        const director = (crew || []).filter((movie: any) => movie.job === "Director");

        setActorMovies(actor);
        setDirectorMovies(director);
      } catch (error) {
        console.error("Error fetching person movies:", error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchPersonCredits();
  }, [id]);

  // Mostrar mensaje de carga mientras se obtienen datos
  if (loading) return <div>Cargando...</div>;

  return (
    <>
      <Navbar />
      <div className="px-6 py-10 text-white">
        {person && (
          <div className="flex flex-col md:flex-row items-start gap-15 mb-10 max-w-6xl mx-auto px-4">
            {/* Foto */}
            {person.profile_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                alt={person.name}
                className="w-40 h-auto rounded-xl shadow-lg"
              />
            )}

            {/* Nombre y biografía */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{person.name}</h1>

              {person.biography && (
                <div>

                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {showFullBio ? person.biography : person.biography.slice(0, 500) + (person.biography.length > 500 ? "..." : "")}
                  </p>
                  {person.biography.length > 500 && (
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="mt-2 text-[#22ec8a] hover:underline cursor-pointer"
                    >
                      {showFullBio ? "Less" : "See more"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {(actorMovies.length > 0 && directorMovies.length > 0) && (
          <div className="flex gap-4 mb-4">
            {actorMovies.length > 0 && (
              <button
                onClick={() => setActiveTab('acted')}
                className={`px-4 py-2 rounded ${activeTab === 'acted' ? 'bg-[#22ec8a] text-black' : 'bg-gray-700 text-white'}`}
              >
                Acted
              </button>
            )}
            {directorMovies.length > 0 && (
              <button
                onClick={() => setActiveTab('directed')}
                className={`px-4 py-2 rounded ${activeTab === 'directed' ? 'bg-[#22ec8a] text-black' : 'bg-gray-700 text-white'}`}
              >
                Directed
              </button>
            )}
          </div>
        )}

        {/* Contenido según la pestaña activa */}
        {activeTab === 'acted' && actorMovies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Películas en las que actuó</h2>
            <div className="flex flex-wrap gap-4">
              {actorMovies.map((movie) => (
                <Link
                  href={`/movie-details/${movie.id}`}
                  key={movie.id}
                  className="w-43 flex flex-col items-center text-center"
                >
                  <div className="rounded-lg overflow-hidden hover:scale-105 transition-transform">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-[250px] object-cover"
                    />
                    <div className="bg-gray-700 text-white text-sm font-medium px-2 py-1 w-full rounded-b-md">
                      {movie.title}
                    </div>
                  </div>

                </Link>
              ))}

            </div>
          </div>
        )}

        {activeTab === 'directed' && directorMovies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Películas dirigidas</h2>
            <div className="flex flex-wrap gap-4">
              {directorMovies.map((movie) => (
                <Link
                  href={`/movie-details/${movie.id}`}
                  key={movie.id}
                  className="w-43 flex flex-col items-center text-center"
                >
                  <div className="rounded-lg overflow-hidden hover:scale-105 transition-transform">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-[250px] object-cover"
                    />
                    <div className="bg-gray-700 text-white text-sm font-medium px-2 py-1 w-full rounded-b-md">
                      {movie.title}
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );


};

export default PersonMoviesPage;
