"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link"; 
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [usermail, setUsermail] = useState("");
  const [role, setRole] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData(session.user.id);
    }
  }, [session]);
  
  const fetchUserData = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) throw new Error("No se pudo obtener el usuario");
      const user = await res.json();
  
      setName(user.name || "");
      setUsermail(user.email || "");
      setRole(user.role || "");
      setBirthdate(user.birthdate || "");
      setNickname(user.nickName || "");
      setDescription(user.description || "");
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };
  
  const updateUserProfile = async () => {
    setLoading(true);
    const dataToSend = { nickname, name, email: usermail, role, description, birthdate };

    const response = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en la respuesta:", errorData);
      throw new Error("Error al actualizar el perfil");
    }

    alert("Perfil actualizado con éxito!");
    setIsModalOpen(false);
    await fetchUserData(usermail); // Recargar datos después de guardar
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile();
  };
  return (
    <div className="flex flex-col m-5">
      {/* Navbar con título y opciones de navegación */}
      <div>
        <nav className="flex justify-between items-center">
          <h1 className="text-5xl font-bold">FilmBox</h1>
          <div className="flex space-x-6">
            <Link href="/maestro/criaturas" className="hover:underline">Mis criaturas</Link>
            <Link href="/maestro/profile" className="hover:underline">Mi perfil</Link>
            <Link href="/" className="hover:underline">Cerrar sesión</Link>
          </div>
        </nav>
      </div>

      {/* Título de la sección mi perfil */}
      <h2 className="text-3xl  mb-5 mt-5">Mi perfil</h2>
      
      {/* Imágen del usuario */}
      <div className="relative w-30 h-30">
        <Image
          src="/film2.jpg"
          alt="Imagen de perfil"
          fill
          className="object-cover"
        />
      </div>

      {/* Datos personales del perfil */}
      <div className="relative flex flex-col mt-5">
        <div className="max-w-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nickname
              </label>
              <span className="text-white">{nickname}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <span className="text-white">{name}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <span className="text-white">{usermail}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha nacimiento
              </label>
              <span className="text-white">{birthdate}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <span className="text-white">{description}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <span className="text-white">{role}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            >
              Editar Perfil
            </button>
           
            { /* Modal editar perfil */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
                <div className="p-8 rounded-lg max-w-md w-full relative border border-green-500">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                  >
                    ✖
                  </button>

                  <h2 className="text-2xl font-bold text-black mb-4">Editar Perfil</h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Nombre</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Apodo</label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />    
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Fecha de nacimiento</label>
                      <input
                        type="text"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Descripción</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 text-white w-full p-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
