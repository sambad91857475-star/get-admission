import React from 'react';
import "./globals.css";
import Navbar from "./components/Navbar";
export const metadata = {
  title: "GET ADMISSION - Études en France",
  description: "Obtenir votre admission à l’étranger en toute sérénité.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}