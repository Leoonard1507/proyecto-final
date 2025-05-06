"use client";

import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es"> 
      <head>
        <title>Filmogram</title>
        <meta name="description" content="Gestiona tu perfil en El Santuario." />
      </head>
    
      <body className="min-h-screen flex flex-col bg-gray-950 text-white antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}