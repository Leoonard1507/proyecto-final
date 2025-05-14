"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from 'next/image';
import { toast } from "react-toastify";

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
      toast.error("Incorrect username or password");
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();

    // Lógica para redirigir
    if (session?.user?.role === "administrator") {
      router.push(`/home-page`);
    } else if (session?.user?.role === "client") {
      router.push(`/home-page`);
    } else {
      toast.error("You do not have access to any of the sections.");
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
          It&apos;s always a pleasure to see you here!
        </p>
        
        <p className="text-2xl md:text-3xl font-bold text-white mt-20 mb-5">
          Login
        </p>

        <form onSubmit={handleSubmit} className="max-w-md">
          <p className="text-[#22ec8a] text-lg">
            Email:
          </p>
          
          <input
            type="text"
            placeholder="Enter your email"
            value={usermail}
            onChange={(e) => setUsermail(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-6 focus:outline-none focus:border-[#22ec8a]"
          />

          <p className="text-[#22ec8a] text-lg">
            Password:
          </p>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-6 focus:outline-none focus:border-[#22ec8a] "
          />

          <button
            type="submit"
            className="bg-[#22ec8a] text-black font-bold text-lg h-14 w-1/2 mx-auto block rounded-lg hover:opacity-70 transition-opacity">
            ACCESS
          </button>

          <p className="text-[#22ec8a] text-lg text-center mt-2">
            Already have an account?{" "}
            <Link href="/register" className="hover:opacity-70">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
