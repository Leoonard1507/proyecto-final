"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [usermail, setUsermail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email: usermail,
      password: password,
    });

    if (result?.error) {
      alert("Usuario o contraseña incorrectos");
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();

    // Lógica para redirigir
    if (session?.user?.role === "administrator") {
      router.push(`/search`);
    } else if (session?.user?.role === "client") {
      router.push(`/administrator/profile`);
      console.log(session.user.id);
    } else {
      alert("No tienes acceso a ninguna de las secciones.");
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
        
        <p className="text-4xl md:text-4xl font-bold text-white">
          ¡Siempre es un placer verte por aquí!
        </p>
        
        <p className="text-2xl md:text-3xl font-bold text-white mt-20 mb-5">
          Iniciar Sesión
        </p>

        <form onSubmit={handleSubmit} className="max-w-md">
          <p className="text-[#22ec8a] text-lg">
            Correo:
          </p>
          
          <input
            type="text"
            placeholder="Tu correo"
            value={usermail}
            onChange={(e) => setUsermail(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-6 focus:outline-none focus:border-[#22ec8a]"
          />

          <p className="text-[#22ec8a] text-lg">
            Contraseña:
          </p>

          <input
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-6 focus:outline-none focus:border-[#22ec8a] "
          />

          <button
            type="submit"
            className="bg-[#22ec8a] text-black font-bold text-lg h-14 w-1/2 mx-auto block rounded-lg hover:opacity-70 transition-opacity">
            ACCEDER
          </button>

          <p className="text-[#22ec8a] text-lg text-center mt-2">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="hover:opacity-70">
              Regístrate
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}
