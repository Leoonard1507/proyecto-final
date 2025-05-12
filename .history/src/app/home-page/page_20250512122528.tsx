'use client';

import '../../styles/globals.css';
import MovieCarouselSection from '@/app/components/homeSections/MoviesCarrusel';
import FeaturedMovieBanner from '../components/homeSections/BannerMovie';
import Navbar from '../components/Navbar';

export default function HomePage() {
    return (
        <>
            <Navbar />

            <main className="p-4 space-y-10">

                <FeaturedMovieBanner />

                <MovieCarouselSection
                    title="🔥 Trending this week"
                    endpoint="/trending/movie/week"
                />

                <MovieCarouselSection
                    title="⭐ Top rated"
                    endpoint="/movie/top_rated"
                />

                <MovieCarouselSection
                    title="🎬 Latest releases"
                    endpoint="/movie/now_playing"
                />

            </main>
        </>
    );
}
