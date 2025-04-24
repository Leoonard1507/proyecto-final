"use client"; 
import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [usermail, setUsermail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, usermail, password, birthdate}),
    });
  
    const data = await response.json();
    if (response.ok) {
      alert("Usuario registrado con éxito");
    } else {
      alert("Error: " + data.error);
    }
  };
  
  return (
    <div className="flex flex-row h-screen">

      {/* Parte izquierda: Imagen */}
      <div className="relative w-full md:w-2/5 h-full">
        <Image
          src="/film2.jpg"
          alt="Login"
          layout="fill"
          className="object-cover mask-fade"
        />
      </div>

      {/* Parte derecha: Formulario */}
      <div className="flex flex-col justify-center w-full md:w-3/5 px-8 md:px-20 py-8">
        
        <p className="text-2xl md:text-3xl font-bold text-white mb-5">
          Regístrese aquí
        </p>

        <form onSubmit={handleSubmit} className="max-w-md">
          <p className="text-[#22ec8a] text-lg">
            Nombre de usuario:
          </p>
          <input
            type="text"
            placeholder="Introduce tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-3 focus:outline-none focus:border-[#22ec8a] "
          />

          <p className="text-[#22ec8a] text-lg">
            Fecha de nacimiento:
          </p>
          <input
            type="date"
            placeholder="Introduce tu fecha de nacimiento"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-3 focus:outline-none focus:border-[#22ec8a] "
          />

          <p className="text-[#22ec8a] text-lg">
            Correo:
          </p>
          <input
            type="text"
            placeholder="Introduce tu correo"
            value={usermail}
            onChange={(e) => setUsermail(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-3 focus:outline-none focus:border-[#22ec8a]"
          />

          <p className="text-[#22ec8a] text-lg">
            Contraseña:
          </p>
          <input
            type="password"
            placeholder="Introduce una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-3 focus:outline-none focus:border-[#22ec8a] "
          />

          <p className="text-[#22ec8a] text-lg">
            Repetir contraseña:
          </p>
          <input
            type="password"
            placeholder="Repite la contraseña"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-6 focus:outline-none focus:border-[#22ec8a] "
          />

          <button
            type="submit"
            className="bg-[#22ec8a] text-black font-bold text-lg h-14 w-1/2 mx-auto block rounded-lg hover:opacity-70 transition-opacity">
            Regístrate
          </button>

          <p className="text-[#22ec8a] text-lg text-center mt-2">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/" className="hover:opacity-70">
              Iniciar Sesión
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}