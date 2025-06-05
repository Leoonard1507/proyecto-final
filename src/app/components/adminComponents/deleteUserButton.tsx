import { toast } from "react-toastify";

type DeleteUserButtonProps = {
    userId: string;
    onDelete?: () => void; // callback opcional para el evento de borrado
  };
  
  export function DeleteUserButton({ userId, onDelete }: DeleteUserButtonProps) {
    const handleClick = async () => {
      try {
        const res = await fetch(`/api/user/${userId}/delete`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Error deleting user');
        }

        toast.success(`Successfully deleted user`);
        if (onDelete) onDelete();
      } catch (error) {
        console.error(error);
        toast.error('The user could not be deleted');
      }
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
  