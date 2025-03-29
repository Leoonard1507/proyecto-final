"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import "../styles/login.css";

export default function LoginPage() {
  const router = useRouter(); // Inicializa el router
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

    // Verificar la sesión
    const res = await fetch("/api/auth/session");
    const session = await res.json();

    // Asegurarte de que tienes el rol antes de redirigir
    if (session?.user?.role === "administrador") {
      router.push("https://www.google.com/search?sca_esv=0e47a412606519cc&sxsrf=AHTn8zr73bGuRPtiTizSNPtc0XCDo1potw:1743194216745&q=coches&udm=2&fbs=ABzOT_BnMAgCWdhr5zilP5f1cnRvK9uZj3HA_MTJAA6lXR8yQAbzyrKIF75NMnKCBDSAUZnMkV2Wy-Rh6CZE8lzttiKHbjE3_VYK2kiT5_8S4qXdlTrleNQOn3o-62Au8xouUddCAWFiLYk4xSMG82OcfjHzZOrDuvsOj1H5lJbjJTdNENXcNR67lj8gfvmSYUTOAOt6_Hrx&sa=X&ved=2ahUKEwjM8cDA0K2MAxW4Z0EAHfvEEm0QtKgLegQIGxAB&biw=1064&bih=730&dpr=1.25");  // Redirige a la página de maestro
    } else if (session?.user?.role === "cliente") {
      router.push("https://www.google.com/search?sca_esv=0e47a412606519cc&sxsrf=AHTn8zoe535t4DbpxmUkNFKQqRRnGJKrvQ:1743194241300&q=7+enanitos&udm=2&fbs=ABzOT_BnMAgCWdhr5zilP5f1cnRvK9uZj3HA_MTJAA6lXR8yQElaIApxtef1-RKg2CcwxXYsQSt6QRAacgvTpE0SimnyyJcUUaS9A5JOacx2eircEMF6CJNrjyypze4_0muFa82_AvTVCiQOAlPsQIDyE1BSu67uGIF1et1Nd-FTdY5qZ8BEoIyD-LjgRpHNz8jEu98Wtgg9r9GUNftYlnIWfbD_L0hwqA&sa=X&sqi=2&ved=2ahUKEwjns5vM0K2MAxUkZ_EDHY9HHl4QtKgLegQIFBAB&biw=1064&bih=730&dpr=1.25");  // Redirige a la página de cuidador
    } else {
      alert("No tienes acceso a ninguna de las secciones.");
    }
  };

  return (
    <div className="login-container">
      <img src="/film2.jpg" alt="Login" className="login-image" />
      
      <div className="login-form">
        <p className="init-text">¡Siempre es un placer verte por aquí!</p>
        <p className="init-text">Iniciar Sesión</p>
        
        <form onSubmit={handleSubmit}>
          <p className="mail">Correo:</p>
          <input type="text" placeholder="Tu correo" value={usermail} onChange={(e) => setUsermail(e.target.value)}/>
          <p className="pass">Contraseña:</p>
          <input type="password" placeholder="Introduce tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">ACCEDER</button>
          
        </form>
        <p className="register">¿No tienes cuenta? <Link href="/register">Regístrate</Link></p>
      </div>
    </div>
  );
}
