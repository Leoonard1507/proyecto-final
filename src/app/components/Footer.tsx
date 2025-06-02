// components/Footer.tsx
"use client";

import { MapPin, Github, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#060613] text-white px-6 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold text-white">Filmogram</h2>
          <p className="text-sm mt-2 text-gray-400">
            Your modern guide to discover, save, and share movies.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            © {new Date().getFullYear()} Filmogram. All rights reserved.
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-2">Follow us</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-[#22ec8a] transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-[#22ec8a] transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-[#22ec8a] transition">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-[#22ec8a] transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Featured Theaters + Map */}
        <div>
          <h3 className="font-semibold mb-2">Featured Theaters in Madrid</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li><MapPin size={14} className="inline-block mr-1" />Cinesa Proyecciones</li>
            <li><MapPin size={14} className="inline-block mr-1" />Yelmo Cines Ideal</li>
            <li><MapPin size={14} className="inline-block mr-1" />Cine Paz</li>
          </ul>
        </div>
      </div>

      {/* TMDb Attribution */}
      <div className="mt-8 flex flex-col items-center text-xs text-gray-500">
        <p>
          This product uses the TMDb API but is not endorsed or certified by TMDb.
        </p>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2"
        >
          <img src="/logoTmdb.svg" alt="TMDb Logo" className="h-8" />
        </a>
      </div>

      {/* Credits */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-xs text-gray-500 text-center">
        Project developed by Cosmin Leonard Vasilescu, Álvaro Bordería, and Jaime.
      </div>
    </footer>
  );
}
