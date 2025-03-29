"use client"; 
import { useState } from "react";
import Link from "next/link";

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
    <div className="login-container">
        <img src="/film2.jpg" alt="Login" className="login-image" />
        
        <div className="login-form">
          
          <p className="init-text">Crea tu cuenta</p>
          
          <form onSubmit={handleSubmit}>
            <p className="user-name">Elige tu nombre de usuario:</p>
            <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <p className="birthdate">Fecha de nacimiento</p>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
            <p className="mail">Correo</p>
            <input type="text" placeholder="Tu correo" value={usermail} onChange={(e) => setUsermail(e.target.value)}/>
            <p className="pass">Contraseña</p>
            <input type="password" placeholder="Introduce tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <p className="pass">Repite la contraseña</p>
            <input type="password" placeholder="Introduce tu contraseña" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
            <button type="submit">ACCEDER</button>
            
          </form>
          <p className="register">¿Ya tienes una cuenta? <Link href="/">Iniciar sesión</Link></p>
      </div>
    </div>
  );
}