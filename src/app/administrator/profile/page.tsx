"use client"; 
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link"; 

export default function ProfilePage() {
  const { data: session } = useSession(); // Obtén la sesión
  const [name, setName] = useState("");
  const [usermail, setUsermail] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga

  // Cuando la sesión cambie, se cargan los datos del usuario
  useEffect(() => {
    console.log("Sesión actual:", session); // 🛠️ Verifica los datos de sesión
    if (session?.user) {
      setName(session.user.name || "");
      setUsermail(session.user.email || "");
      setRole(session.user.role || "");
    }
  }, [session]);
  

  const updateUserProfile = async () => {
    setLoading(true);
    try {
      const dataToSend = {
        name,
        email: usermail,
        role,
        description,
      };
  
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
    } catch (error) {
      alert("Hubo un error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile();
  };

  return (
    <div className="profile-container">
      <img src="/master.png" alt="Avatar" className="profile-image" />
      
      <div className="part">
      <nav className="nav-bar">
          <p className="title">El Santuario</p>
          <div className="nav-links">
            <Link href="/maestro/criaturas">Mis criaturas</Link>
            <Link href="/maestro/profile">Mi perfil</Link>
            <Link href="/">Cerrar sesión</Link>
          </div>
      </nav>
        
      <div className="profile-form">
        <p className="init-text">Mi perfil</p>
        <p className="text">Este es el lugar donde podrás gestionar, actualizar y personalizar la información de tu perfil.</p>
        
        <form onSubmit={handleSubmit} className="form-profile">
          <p className="name">Nombre mágico</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          
          <p className="mail">Correo mágico</p>
          <input type="text" value={usermail} onChange={(e) => setUsermail(e.target.value)} />
          
          <p className="role">Rol</p>
          <select className="role-options" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Selecciona tu rol</option>
            <option value="cuidador">Cuidador</option>
            <option value="maestro">Maestro</option>
          </select>
          
          <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Actualizar Perfil"}</button>
        </form>
      </div>
    </div>
  </div>
  );
}
