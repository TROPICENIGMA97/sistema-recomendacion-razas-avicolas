"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BREED_DATA } from "@/lib/prologEngine";
import StarRating from "./StarRating";
import BreedReviewForm from "./BreedReviewForm";

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
  initial: Review[];
  userId: string;
  userName: string;
}

const LABELS: Record<number, string> = {
  1: "Muy malo",
  2: "Malo",
  3: "Regular",
  4: "Bueno",
  5: "Excelente",
};

function avgRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.puntuacion, 0) / reviews.length;
}

export default function BreedReviewFeed({ initial, userId, userName }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [filter, setFilter] = useState<string>("todos");
  const [opError, setOpError] = useState<string | null>(null);

  const myRazas = reviews
    .filter((r) => r.user_id === userId)
    .map((r) => r.raza);

  function handleNewReview(review: Review) {
    setReviews((prev) => {
      const idx = prev.findIndex(
        (r) => r.user_id === review.user_id && r.raza === review.raza
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = review;
        return updated;
      }
      return [review, ...prev];
    });
  }

  async function deleteReview(id: string) {
    if (!confirm("¿Eliminar esta opinion?")) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("breed_reviews")
      .delete()
      .eq("id", id);
    if (error) {
      setOpError("No se pudo eliminar. Intente de nuevo.");
      return;
    }
    setOpError(null);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const filtered =
    filter === "todos" ? reviews : reviews.filter((r) => r.raza === filter);

  const breedStats = Object.entries(BREED_DATA)
    .map(([key, b]) => {
      const br = reviews.filter((r) => r.raza === key);
      return {
        key,
        nombre: b.nombre,
        emoji: b.emoji,
        avg: avgRating(br),
        count: br.length,
      };
    })
    .filter((s) => s.count > 0)
    .sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6">
      <BreedReviewForm
        userId={userId}
        userName={userName}
        existingRazas={myRazas}
        onSubmitted={handleNewReview}
      />

      {breedStats.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-black text-campo-900 text-base">
            Ranking de la comunidad
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {breedStats.map((s) => (
              <button
                key={s.key}
                onClick={() =>
                  setFilter(filter === s.key ? "todos" : s.key)
                }
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-center transition-all
                  ${
                    filter === s.key
                      ? "border-campo-600 bg-campo-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-campo-300"
                  }`}
              >
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-xs font-black text-campo-900 leading-tight">
                  {s.nombre.split(" ").slice(0, 2).join(" ")}
                </span>
                <StarRating value={Math.round(s.avg)} readonly size="sm" />
                <span className="text-xs text-gray-500">
                  {s.avg.toFixed(1)} · {s.count}{" "}
                  {s.count === 1 ? "opinion" : "opiniones"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-gray-500 mr-1">
            Filtrar:
          </span>
          <button
            onClick={() => setFilter("todos")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors
              ${
                filter === "todos"
                  ? "bg-campo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Todas ({reviews.length})
          </button>
          {Object.entries(BREED_DATA)
            .filter(([key]) => reviews.some((r) => r.raza === key))
            .map(([key, b]) => (
              <button
                key={key}
                onClick={() =>
                  setFilter(filter === key ? "todos" : key)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors
                  ${
                    filter === key
                      ? "bg-campo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {b.emoji} {b.nombre.split(" ")[0]}
              </button>
            ))}
        </div>
      )}

      {opError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm flex items-center justify-between">
          <span>{opError}</span>
          <button
            onClick={() => setOpError(null)}
            className="text-red-400 hover:text-red-600 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 space-y-2">
          <p className="text-5xl">💬</p>
          <p className="font-bold text-base">Sin opiniones todavia</p>
          <p className="text-sm">
            Se el primero en compartir tu experiencia con esta raza
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => {
            const breed = BREED_DATA[review.raza];
            const isOwn = review.user_id === userId;
            return (
              <div
                key={review.id}
                className={`rounded-2xl border shadow-sm p-5 space-y-3 transition-all
                  ${isOwn ? "border-campo-300 bg-white" : "border-gray-100 bg-white"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-campo-200 flex items-center justify-center font-black text-campo-800 text-base shrink-0">
                      {(review.user_nombre || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight">
                        {review.user_nombre || "Usuario"}
                        {isOwn && (
                          <span className="ml-2 text-xs bg-campo-200 text-campo-700 px-2 py-0.5 rounded-full font-semibold">
                            Tu
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(review.created_at).toLocaleDateString(
                          "es-MX",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  {isOwn && (
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-semibold shrink-0 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                  <span className="text-2xl">{breed?.emoji ?? "🐔"}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-campo-900">
                      {breed?.nombre ?? review.raza}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating
                        value={review.puntuacion}
                        readonly
                        size="sm"
                      />
                      <span className="text-xs text-gray-500 font-medium">
                        {LABELS[review.puntuacion]}
                      </span>
                    </div>
                  </div>
                </div>

                {review.comentario && (
                  <p className="text-sm text-gray-700 leading-relaxed pl-3 border-l-4 border-campo-200 italic">
                    &ldquo;{review.comentario}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
