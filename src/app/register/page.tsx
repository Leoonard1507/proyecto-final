"use client";
import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { reisterSchema } from "../schema/registerSchema";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [usermail, setUsermail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      username,
      nickname,
      usermail,
      password,
      birthdate,
    };

    const result = reisterSchema.safeParse(formData);

    if (!result.success) {
      const errorMsg = result.error.errors[0].message;
      toast.error(errorMsg);
      return;
    }

    if(password !== password2){
      toast.error("Passwords do not match");
      return;
    }

    // Validar que sea mayor de edad
    const birth = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

    const finalAge = hasHadBirthdayThisYear ? age : age - 1;

    if (finalAge < 18) {
      toast.error("You must be over 18 years old to register.");
      return;
    }

    // Enviar los datos a la api
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        nickname,
        birthdate,
        usermail,
        password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success("Successfully registered user");
      setUsername("");
      setUsermail("");
      setPassword("");
      setBirthdate("");
      setPassword2("");
      setNickname("");
    } else {
      toast.error(data.error);
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
          Register here
        </p>

        <form onSubmit={handleSubmit} className="max-w-md">
          <p className="text-[#22ec8a] text-lg">
            Nickname:
          </p>
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-3 focus:outline-none focus:border-[#22ec8a] "
          />

          <p className="text-[#22ec8a] text-lg">
            Name:
          </p>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-3 focus:outline-none focus:border-[#22ec8a] "
          />

          <p className="text-[#22ec8a] text-lg">
            Birthdate:
          </p>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className={`w-full h-14 bg-[#030208] border-2 border-[#777] rounded-lg px-6 mb-3 focus:outline-none focus:border-[#22ec8a] ${birthdate ? 'text-white' : 'text-gray-500'}`}
          />

          <p className="text-[#22ec8a] text-lg">
            Email:
          </p>
          <input
            type="text"
            placeholder="Enter your email"
            value={usermail}
            onChange={(e) => setUsermail(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-3 focus:outline-none focus:border-[#22ec8a]"
          />

          <p className="text-[#22ec8a] text-lg">
            Password:
          </p>
          <input
            type="password"
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-3 focus:outline-none focus:border-[#22ec8a] "
          />

          <p className="text-[#22ec8a] text-lg">
            Repet password:
          </p>
          <input
            type="password"
            placeholder="Repeat the password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full h-14 bg-[#030208] text-white border-2 border-[#777] rounded-lg px-6 mb-6 focus:outline-none focus:border-[#22ec8a] "
          />

          <button
            type="submit"
            className="bg-[#22ec8a] text-black font-bold text-lg h-14 w-1/2 mx-auto block rounded-lg hover:opacity-70 transition-opacity">
            Sign up
          </button>

          <p className="text-[#22ec8a] text-lg text-center mt-2">
            Already have an account?{" "}
            <Link href="/" className="hover:opacity-70">
              Login
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}