"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BREED_DATA } from "@/lib/prologEngine";
import StarRating from "./StarRating";
import BreedImage from "./BreedImage";

interface Review {
  id: string;
  user_id: string;
  user_nombre: string;
  raza: string;
  puntuacion: number;
  comentario: string;
  created_at: string;
}

interface Props {
  userId: string;
  userName: string;
  existingRazas: string[];
  onSubmitted: (review: Review) => void;
}

const LABELS: Record<number, string> = {
  1: "Muy malo",
  2: "Malo",
  3: "Regular",
  4: "Bueno",
  5: "Excelente",
};

const RAZAS = Object.entries(BREED_DATA).map(([key, b]) => ({
  key,
  nombre: b.nombre,
  emoji: b.emoji,
}));

export default function BreedReviewForm({
  userId,
  userName,
  existingRazas,
  onSubmitted,
}: Props) {
  const [raza, setRaza] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isEdit = existingRazas.includes(raza);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!raza || puntuacion === 0) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("breed_reviews")
        .upsert(
          { user_id: userId, user_nombre: userName, raza, puntuacion, comentario },
          { onConflict: "user_id,raza" }
        )
        .select()
        .single();
      if (dbErr) throw dbErr;
      onSubmitted(data as Review);
      setRaza("");
      setPuntuacion(0);
      setComentario("");
      setOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-campo-300 hover:border-campo-500 hover:bg-campo-50 text-campo-600 font-semibold text-sm transition-all flex items-center justify-center gap-2"
      >
        <span className="text-xl">✍️</span>
        Compartir mi experiencia con una raza
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl border-2 border-campo-200 shadow-md p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-black text-campo-900 text-lg">Tu opinion</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ✕
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Selecciona la raza que criaste
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {RAZAS.map(({ key, nombre, emoji }) => {
            const b = BREED_DATA[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRaza(key)}
                className={`flex flex-col rounded-xl border-2 overflow-hidden text-center transition-all
                  ${raza === key
                    ? "border-campo-600 shadow-md ring-2 ring-campo-300"
                    : "border-gray-200 hover:border-campo-300"
                  }`}
              >
                <BreedImage imagen={b.imagen} nombre={nombre} emoji={emoji} size="sm" className="w-full" />
                <div className="p-1.5 bg-white">
                  <span className="text-xs font-bold text-campo-900 leading-tight line-clamp-2 block">
                    {nombre.split(" ").slice(0, 2).join(" ")}
                  </span>
                  {existingRazas.includes(key) && (
                    <span className="text-xs bg-tierra-200 text-tierra-800 px-1 rounded font-medium mt-0.5 block">
                      Editada
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Puntuacion de 1 a 5 estrellas
        </label>
        <div className="flex items-center gap-3">
          <StarRating value={puntuacion} onChange={setPuntuacion} size="lg" />
          {puntuacion > 0 && (
            <span className="text-sm font-bold text-campo-700">
              {LABELS[puntuacion]}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Describe tu experiencia{" "}
          <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-campo-500 focus:ring-2 focus:ring-campo-200 outline-none text-sm resize-none transition-colors"
          placeholder="¿Como te fue con esta raza en tu granja? ¿La recomendarias para Cuichapa?"
        />
        <p className="text-xs text-gray-400 text-right mt-0.5">
          {comentario.length}/500
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!raza || puntuacion === 0 || loading}
        className="w-full py-3 rounded-xl bg-campo-600 hover:bg-campo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold transition-colors shadow text-sm"
      >
        {loading ? "Guardando…" : isEdit ? "Actualizar opinion" : "Publicar opinion"}
      </button>
    </form>
  );
}
