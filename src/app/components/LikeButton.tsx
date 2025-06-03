'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type LikeButtonProps = {
    commentId: number;
};

export default function LikeButton({ commentId }: LikeButtonProps) {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;

    const [likesCount, setLikesCount] = useState<number>(0);
    const [likedByUser, setLikedByUser] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!userId) return;

        async function fetchLikes() {
            setLoading(true);
            try {
                const res = await fetch(`/api/likes/${commentId}`);
                const data = await res.json();
                setLikesCount(Number(data.totalLikes) || 0);
                setLikedByUser(Boolean(data.likedByUser));
            } catch (error) {
                console.error("Error fetching likes", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLikes();
    }, [commentId, userId]);

    async function toggleLike() {
        if (loading || !userId) return;

        setLoading(true);
        try {
            if (likedByUser) {
                await fetch(`/api/likes/${commentId}`, { method: "DELETE" });
                setLikesCount((count) => count - 1);
                setLikedByUser(false);
            } else {
                await fetch(`/api/likes/${commentId}`, { method: "POST" });
                setLikesCount((count) => count + 1);
                setLikedByUser(true);
            }
        } catch (error) {
            console.error("Error toggling like", error);
        } finally {
            setLoading(false);
        }
    }

    if (status === "loading") return <p>Loading...</p>;
    if (!userId) return <p>You must be logged in to like.</p>;

    return (
        <button
            onClick={toggleLike}
            disabled={loading}
            className={`flex items-center gap-1 text-sm font-semibold ${likedByUser ? "text-red-500" : "text-gray-400"
                } hover:text-red-600 transition-colors`}
            aria-pressed={likedByUser}
            aria-label={likedByUser ? "Unlike comment" : "Like comment"}
            type="button"
        >
            {likedByUser ? "❤️" : "🤍"} {likesCount}
        </button>
    );
}
