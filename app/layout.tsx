import React from "react";
import "./globals.css";

export const metadata = {
  title: "Get Admission",
  description: "Gestion des pré-inscriptions et suivi Campus France",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}