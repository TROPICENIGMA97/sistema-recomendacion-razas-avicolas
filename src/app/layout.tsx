import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Recomendacion Avicola - Cuichapa, Veracruz",
  description:
    "Sistema experto basado en Prolog para recomendar razas avicolas a pequenos productores en Cuichapa, Veracruz, Mexico.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f6fbf0]">{children}</body>
    </html>
  );
}
