// app/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./components/Footer";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>Filmogram</title>
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className="flex flex-col text-white antialiased">
        {/* Fondo con contenedor dedicado */}
        <div className="min-h-screen w-full bg-radial-pattern">
          <SessionProvider>{children}</SessionProvider>
        </div>
        <ToastContainer />
        <Footer />
      </body>
    </html>
  );
}
