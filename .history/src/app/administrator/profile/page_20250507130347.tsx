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
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
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
      setAvatar(user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`);
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };

  const updateUserProfile = async () => {
    setLoading(true);
    const dataToSend = { nickname, name, email: usermail, role, description, birthdate, avatar };

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
    await fetchUserData(userId);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">FilmBox</h1>
        <div className="flex space-x-6 text-gray-300">
          <Link href="/maestro/criaturas" className="hover:underline">Mis criaturas</Link>
          <Link href="/maestro/profile" className="hover:underline">Mi perfil</Link>
          <Link href="/" className="hover:underline">Cerrar sesión</Link>
        </div>
      </nav>

      {/* Contenedor de perfil */}
      <div className="max-w-5xl mx-auto bg-gray-800/60 rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-4">Mi perfil</h2>

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-6">
            <Image
              src={`https://api.dicebear.com/7.x/bottts/png?seed=${userId}`}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
            <div>
              <p className="text-lg font-medium">{nickname}</p>
              <p className="text-sm text-gray-400">{usermail}</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 text-sm"
          >
            Editar Perfil
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Nombre" value={name} />
          <ProfileField label="Fecha nacimiento" value={birthdate} />
          <ProfileField label="Descripción" value={description} />
          <ProfileField label="Rol" value={role} />
        </div>
      </div>

      {/* Modal editar perfil */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-lg max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-5">Editar Perfil</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Avatar</label>
                <div className="flex space-x-3 mt-1">
                  {["cat", "robot", "alien", "monster", "Sawyer"].map((type) => {
                    const url = `https://api.dicebear.com/7.x/bottts/png?seed=${type}`;
                    return (
                      <Image
                        key={type}
                        src={url}
                        alt="avatar option"
                        width={60}
                        height={60}
                        onClick={() => setAvatar(url)}
                        className={`cursor-pointer rounded-full border ${
                          avatar === url ? "border-blue-500" : "border-transparent"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <Input label="Nombre" value={name} onChange={setName} />
              <Input label="Apodo" value={nickname} onChange={setNickname} />
              <Input label="Fecha de nacimiento" value={birthdate} onChange={setBirthdate} />
              <Input label="Descripción" value={description} onChange={setDescription} />

              <button
                type="submit"
                className="bg-blue-600 text-white w-full p-2 rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente reutilizable para mostrar campos
function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <p className="text-white border border-gray-700 rounded p-2">{value || "—"}</p>
    </div>
  );
}

// Componente reutilizable de inputs
function Input({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      />
    </div>
  );
}
