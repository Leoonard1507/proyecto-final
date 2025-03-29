"use client"; 
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [usermail, setUsermail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, usermail, password, role }),
    });
  
    const data = await response.json();
    if (response.ok) {
      alert("Usuario registrado con éxito");
    } else {
      alert("Error: " + data.error);
    }
  };
  
  return (
    <div className="register-container">
      <img src="/caretaker.png" alt="Register" className="register-image" />
      
      <div className="register-form">
        <p className="init-text">Registrarse</p>

        <form onSubmit={handleSubmit}>
          <p className="name">Nombre</p>
          <input type="text" placeholder="Introduce tu nombre mágico" value={name} onChange={(e) => setName(e.target.value)}/>
          
          <p className="mail">Correo</p>
          <input type="text" placeholder="tunombre@santuario.com" value={usermail} onChange={(e) => setUsermail(e.target.value)}/>
          
          <p className="role">Rol</p>
          <select className="role-options" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Selecciona tu rol</option>
            <option value="administrador">Administrador</option>
            <option value="cliente">Cliente</option>
          </select>

          <p className="pass">Contraseña</p>
          <input type="password" placeholder="Introduce tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)}/>
          
          <button type="submit">Registrar</button>
        </form>

        <p className="login">¿Tienes cuenta? <Link href="/">Iniciar sesion</Link>.</p>
      </div>
    </div>
  );
}