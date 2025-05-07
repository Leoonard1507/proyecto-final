// app/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>Filmogram</title>
        <meta name="description" content="Gestiona tu perfil en El Santuario." />
        <link rel="icon" href="/icono.svg" type="image/svg+xml" />
      </head>
      <body className="flex flex-col text-white antialiased">
        {/* Fondo con contenedor dedicado */}
        <div className="min-h-screen w-full bg-radial-pattern">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </body>
    </html>
  );
}
