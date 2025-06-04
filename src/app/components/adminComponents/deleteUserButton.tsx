type DeleteUserButtonProps = {
    userId: string;
    onDelete?: () => void; // callback opcional para el evento de borrado
  };
  
  export function DeleteUserButton({ userId, onDelete }: DeleteUserButtonProps) {
    const handleClick = () => {
      // Aquí pondremos la lógica de la API en el futuro
      console.log(`Eliminando usuario con ID: ${userId}`);
      if (onDelete) onDelete();
    };
  
    return (
      <button
        onClick={handleClick}
        className="ml-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded transition"
        type="button"
      >
        Delete
      </button>
    );
  }
  