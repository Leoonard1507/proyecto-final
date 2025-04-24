"use client";

import { SessionProvider } from "next-auth/react";
import "../styles/global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es"> 
      <head>
        <title>Filmogram</title>
        <link rel="icon" href="/icono.svg" type="image/svg+xml" />
      </head>
    
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}