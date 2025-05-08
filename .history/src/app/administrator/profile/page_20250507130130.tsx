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
    <div className="min-h-screen bg-gray-950 text-white px-8 py-10 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">FilmBox</h1>
        <div className="flex space-x-6 text-gray-400 text-sm">
          <Link href="/maestro/criaturas" className="hover:underline">Mis criaturas</Link>
          <Link href="/maestro/profile" className="hover:underline">Mi perfil</Link>
          <Link href="/" className="hover:underline">Cerrar sesión</Link>
        </div>
      </nav>

      {/* Perfil */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8">Mi perfil</h2>

        <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-12 mb-12">
          <Image
            src={`https://api.dicebear.com/7.x/bottts/png?seed=${userId}`}
            alt="Avatar"
            width={120}
            height={120}
            className="rounded-full mb-4 md:mb-0"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded transition disabled:bg-gray-400"
          >
            Editar Perfil
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <ProfileField label="Nickname" value={nickname} />
          <ProfileField label="Nombre" value={name} />
          <ProfileField label="Correo electrónico" value={usermail} />
          <ProfileField label="Fecha de nacimiento" value={birthdate} />
          <ProfileField label="Descripción" value={description} />
          <ProfileField label="Rol" value={role} />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white text-black rounded-lg p-8 w-full max-w-lg shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6">Editar Perfil</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Avatar</label>
                <div className="flex space-x-2">
                  {["cat", "robot", "alien", "monster", "Sawyer"].map((type) => {
                    const url = `https://api.dicebear.com/7.x/bottts/png?seed=${type}`;
                    return (
                      <Image
                        key={type}
                        src={url}
                        alt={type}
                        width={50}
                        height={50}
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
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

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-gray-400 mb-1">{label}</label>
      <div className="text-white bg-gray-800 rounded p-3">{value || "—"}</div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
