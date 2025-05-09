"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";

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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

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
      setAvatar(user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${user.id}`);
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };

  const updateUserProfile = async () => {
    setLoading(true);
    const dataToSend = { nickname, name, email: usermail, role, description, birthdate, avatar, currentPassword, newPassword };

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

    const responseData = await response.json();
    alert(responseData.message); // Guarda el mensaje en el estado

    setIsModalOpen(false);
    await fetchUserData(userId);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile();
  };

  return (
    <div className="min-h-screen text-white">
      {/* Navbar */}
      <Navbar />

      {/* Contenedor de perfil */}
      <div className="max-w-3xl mx-auto border mt-30 rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-semibold mb-6">Mi perfil</h2>
        <div className="flex items-center space-x-6 mb-8">
          <Image
            src={`https://api.dicebear.com/7.x/bottts/png?seed=${userId}`}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full border border-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Editar Perfil
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Cambiar Contraseña
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Nickname" value={nickname} />
          <ProfileField label="Nombre" value={name} />
          <ProfileField label="Correo electrónico" value={usermail} />
          <ProfileField label="Fecha nacimiento" value={birthdate} />
          <ProfileField label="Descripción" value={description} />
          <ProfileField label="Rol" value={role} />
        </div>
      </div>

      {/* Modal cambiar contraseña */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-lg max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-5">Cambiar Contraseña</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (newPassword !== repeatPassword) {
                  alert("Las contraseñas nuevas no coinciden.");
                  return;
                }

                try {
                  await updateUserProfile();
                  setIsPasswordModalOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setRepeatPassword("");
                } catch (err) {
                  alert(err);
                  console.error(err);
                }
              }}
              className="space-y-4"
            >
              <Input
                label="Contraseña actual"
                value={currentPassword}
                onChange={setCurrentPassword}
                type="password"
              />
              <Input
                label="Nueva contraseña"
                value={newPassword}
                onChange={setNewPassword}
                type="password"
              />
              <Input
                label="Repetir nueva contraseña"
                value={repeatPassword}
                onChange={setRepeatPassword}
                type="password"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white w-full p-2 rounded-lg hover:bg-blue-700 transition"
              >
                Guardar Nueva Contraseña
              </button>
            </form>
          </div>
        </div>
      )}


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
function Input({
  label,
  value,
  onChange,
  type = "text", // Valor por defecto
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string; // Nuevo prop opcional
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      />
    </div>
  );
}
