"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  imagen: string;
  nombre: string;
  emoji: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BreedImage({ imagen, nombre, emoji, className = "", size = "md" }: Props) {
  const [error, setError] = useState(false);

  const sizes = { sm: "h-20", md: "h-36", lg: "h-52" };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-campo-100 to-campo-200 ${sizes[size]} ${className}`}>
        <span className={size === "lg" ? "text-7xl" : size === "md" ? "text-5xl" : "text-3xl"}>
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${sizes[size]} ${className}`}>
      <Image
        src={imagen}
        alt={nombre}
        fill
        className="object-cover"
        onError={() => setError(true)}
        sizes="(max-width: 640px) 100vw, 480px"
        unoptimized
      />
    </div>
  );
}
