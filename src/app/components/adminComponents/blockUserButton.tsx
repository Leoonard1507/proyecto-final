import { useState } from 'react';

// Define el tipo de las props que recibe el componente
type BlockUserButtonProps = {
  userId: string;               // ID del usuario al que se va a bloquear o desbloquear
  blocked: boolean;             // Estado actual de bloqueo (true = bloqueado, false = desbloqueado)
  onBlock?: (blocked: boolean) => void; // Callback opcional que se llama cuando cambia el estado de bloqueo
};

export function BlockUserButton({ userId, blocked, onBlock }: BlockUserButtonProps) {
    // Estado local para controlar si la petición está en proceso
    const [loading, setLoading] = useState(false);
  
    // Función que se ejecuta al hacer click en el botón para cambiar el estado de bloqueo
    const handleClick = async () => {
      setLoading(true); // activa el indicador de carga
      try {
        // Llama a la API para bloquear o desbloquear al usuario
        const res = await fetch('/api/user/block', {
          method: 'POST',  // Método POST porque se está modificando el estado en la base de datos
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),  // Envía el ID del usuario en el cuerpo como JSON
        });

        const data = await res.json(); // Espera la respuesta JSON

        if (res.ok) {
          // Si la respuesta es exitosa, llama al callback onBlock pasando el nuevo estado bloqueado
          onBlock?.(data.blocked);
        } else {
          // Si la respuesta no es exitosa, muestra un error en consola con el mensaje recibido
          console.error('Error toggling block:', data.message);
        }
      } catch (error) {
        // Si ocurre un error en la petición, lo muestra en consola
        console.error('Error toggling block:', error);
      } finally {
        // Independientemente de éxito o error, desactiva el indicador de carga
        setLoading(false);
      }
    };
  
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();   // Evita que el evento click se propague a elementos padres
          e.preventDefault();    // Evita comportamiento por defecto del botón (como enviar un form)
          if (!loading) handleClick();  // Solo llama a handleClick si no está cargando
        }}
        // Cambia el estilo del botón según el estado bloqueado o no
        className={`ml-4 font-semibold px-3 py-1 rounded transition ${
          blocked
            ? 'bg-green-600 hover:bg-green-700 text-white' // Verde para "Desbloquear"
            : 'bg-yellow-500 hover:bg-yellow-600 text-black' // Amarillo para "Bloquear"
        }`}
        type="button"
        disabled={loading}  // Deshabilita el botón mientras carga para evitar múltiples clicks
      >
        {/* Muestra "..." mientras carga, y el texto según estado bloqueado */}
        {loading ? '...' : blocked ? 'Unblock' : 'Block'}
      </button>
    );
  }
