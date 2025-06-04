import { useState } from 'react';

type BlockUserButtonProps = {
  userId: string;
  blocked: boolean; // estado controlado desde afuera
  onBlock?: (blocked: boolean) => void; // callback con nuevo estado
};

export function BlockUserButton({ userId, blocked, onBlock }: BlockUserButtonProps) {
    const [loading, setLoading] = useState(false);
  
    const handleClick = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user/block', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        if (res.ok) {
          onBlock?.(data.blocked);
        } else {
          console.error('Error toggling block:', data.message);
        }
      } catch (error) {
        console.error('Error toggling block:', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!loading) handleClick();
        }}
        className={`ml-4 font-semibold px-3 py-1 rounded transition ${
          blocked
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-yellow-500 hover:bg-yellow-600 text-black'
        }`}
        type="button"
        disabled={loading}
      >
        {loading ? '...' : blocked ? 'Unblock' : 'Block'}
      </button>
    );
  }
  
