'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface FollowButtonProps {
  targetUserId: string; // ID del perfil que se está viendo
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {

      try {
        const res = await fetch(`/api/follow?followedId=${targetUserId}`);
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error('Error al comprobar seguimiento:', err);
      } finally {
        setLoading(false);
      }
    };

    checkFollowStatus();
  }, [targetUserId, ]);

  const handleFollow = async () => {
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followedId: targetUserId }),
      });

      if (!res.ok) throw new Error('Error al seguir');
      setIsFollowing(true);
    } catch (err) {
      console.error('Error al seguir al usuario:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followedId: targetUserId }),
      });

      if (!res.ok) throw new Error('Error al dejar de seguir');
      setIsFollowing(false);
    } catch (err) {
      console.error('Error al dejar de seguir al usuario:', err);
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
        isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
