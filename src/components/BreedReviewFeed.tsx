"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BREED_DATA } from "@/lib/prologEngine";
import StarRating from "./StarRating";
import BreedReviewForm from "./BreedReviewForm";
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
  initial: Review[];
  userId: string;
  userName: string;
}

const STAR_LABELS: Record<number, string> = {
  1: "Muy malo", 2: "Malo", 3: "Regular", 4: "Bueno", 5: "Excelente",
};

const AVATAR_COLORS = [
  "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-green-500",
  "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function avgRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.puntuacion, 0) / reviews.length;
}

export default function BreedReviewFeed({ initial, userId, userName }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [filter, setFilter] = useState<string>("todos");
  const [opError, setOpError] = useState<string | null>(null);

  const myRazas = reviews.filter((r) => r.user_id === userId).map((r) => r.raza);

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
    if (!confirm("Eliminar esta opinion?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("breed_reviews").delete().eq("id", id);
    if (error) { setOpError("No se pudo eliminar."); return; }
    setOpError(null);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const filtered =
    filter === "todos" ? reviews : reviews.filter((r) => r.raza === filter);

  const breedStats = Object.entries(BREED_DATA)
    .map(([key, b]) => {
      const br = reviews.filter((r) => r.raza === key);
      return { key, ...b, avg: avgRating(br), count: br.length };
    })
    .filter((s) => s.count > 0)
    .sort((a, b) => b.avg - a.avg);

  const razasConReviews = Object.keys(BREED_DATA).filter((k) =>
    reviews.some((r) => r.raza === k)
  );

  return (
    <div className="space-y-8">
      <BreedReviewForm
        userId={userId}
        userName={userName}
        existingRazas={myRazas}
        onSubmitted={handleNewReview}
      />

      {opError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm flex justify-between">
          <span>{opError}</span>
          <button onClick={() => setOpError(null)} className="font-bold text-red-400 hover:text-red-600 ml-3">✕</button>
        </div>
      )}

      {breedStats.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-campo-900 text-lg">
              Ranking de la comunidad
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              {reviews.length} {reviews.length === 1 ? "opinion" : "opiniones"} totales
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {breedStats.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setFilter(filter === s.key ? "todos" : s.key)}
                className={`relative rounded-2xl overflow-hidden border-2 text-left transition-all shadow-sm hover:shadow-md
                  ${filter === s.key ? "border-campo-600 ring-2 ring-campo-300" : "border-transparent"}`}
              >
                <BreedImage imagen={s.imagen} nombre={s.nombre} emoji={s.emoji} size="sm" />
                {i === 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-0.5 rounded-full shadow">
                    #1
                  </div>
                )}
                <div className="bg-white p-2.5 space-y-1">
                  <p className="text-xs font-black text-campo-900 leading-tight line-clamp-1">
                    {s.nombre.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <StarRating value={Math.round(s.avg)} readonly size="sm" />
                    <span className="text-xs font-bold text-campo-700">{s.avg.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {s.count} {s.count === 1 ? "opinion" : "opiniones"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setFilter("todos")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-colors
              ${filter === "todos" ? "bg-campo-700 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            Todas ({reviews.length})
          </button>
          {razasConReviews.map((key) => {
            const b = BREED_DATA[key];
            const cnt = reviews.filter((r) => r.raza === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(filter === key ? "todos" : key)}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-colors
                  ${filter === key ? "bg-campo-700 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {b.emoji} {b.nombre.split(" ")[0]} ({cnt})
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-6xl">🐔</p>
          <p className="font-black text-gray-700 text-lg">Sin opiniones todavia</p>
          <p className="text-gray-400 text-sm">
            Se el primero en compartir tu experiencia con una raza
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((review) => {
            const breed = BREED_DATA[review.raza];
            const isOwn = review.user_id === userId;
            const initials = (review.user_nombre || "?")[0].toUpperCase();
            const color = avatarColor(review.user_nombre || "x");

            return (
              <article
                key={review.id}
                className={`rounded-2xl overflow-hidden shadow-md border transition-shadow hover:shadow-lg
                  ${isOwn ? "border-campo-300" : "border-gray-200"}`}
              >
                <div className="relative">
                  <BreedImage
                    imagen={breed?.imagen ?? ""}
                    nombre={breed?.nombre ?? review.raza}
                    emoji={breed?.emoji ?? "🐔"}
                    size="md"
                    className="w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                    <p className="text-white font-black text-base leading-tight drop-shadow">
                      {breed?.nombre ?? review.raza}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={review.puntuacion} readonly size="sm" />
                      <span className="text-white/90 text-xs font-bold drop-shadow">
                        {STAR_LABELS[review.puntuacion]}
                      </span>
                    </div>
                  </div>

                  {isOwn && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-campo-600 text-white text-xs font-black px-2 py-0.5 rounded-full shadow">
                        Tu opinion
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0 shadow-sm ${color}`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm leading-tight">
                          {review.user_nombre || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString("es-MX", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
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

                  {review.comentario ? (
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border-l-4 border-campo-300 italic">
                      &ldquo;{review.comentario}&rdquo;
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Sin comentario</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
