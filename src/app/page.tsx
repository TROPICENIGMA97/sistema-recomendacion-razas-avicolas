"use client";

import RecommendationForm from "@/components/RecommendationForm";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-campo-800 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl">🐔</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Sistema de Recomendacion Avicola
            </h1>
            <p className="text-campo-200 text-xs">
              Cuichapa, Veracruz — Motor de inferencia Prolog
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <section className="bg-gradient-to-br from-campo-700 to-campo-900 rounded-2xl text-white p-8 shadow-lg">
          <div className="max-w-2xl space-y-3">
            <div className="inline-block bg-tierra-400 text-tierra-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Sistema Experto
            </div>
            <h2 className="text-3xl font-extrabold leading-tight">
              Encuentra la raza avicola ideal para tu granja
            </h2>
            <p className="text-campo-200 text-base leading-relaxed">
              Responde 4 preguntas y nuestro motor Prolog analizara 9 razas
              avicolas para recomendarte las mas adecuadas segun el clima
              calido de Cuichapa, Veracruz.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <span className="text-campo-100">Logica Prolog</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌡️</span>
                <span className="text-campo-100">Clima veracruzano</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🐓</span>
                <span className="text-campo-100">9 razas evaluadas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <span className="text-campo-100">Puntuacion ponderada</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <RecommendationForm />
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-campo-900 text-base mb-3">
            Razas incluidas en la base de conocimiento
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm text-center">
            {[
              { nombre: "Leghorn", emoji: "🐓" },
              { nombre: "Rhode Island Red", emoji: "🐔" },
              { nombre: "Cuello Desnudo", emoji: "🦤" },
              { nombre: "New Hampshire", emoji: "🍗" },
              { nombre: "Australorp", emoji: "🥚" },
              { nombre: "Broiler", emoji: "🍖" },
              { nombre: "ISA Brown", emoji: "🥚" },
              { nombre: "Criolla", emoji: "🐣" },
              { nombre: "Plymouth Rock", emoji: "🐓" },
            ].map((b) => (
              <div
                key={b.nombre}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-campo-50 border border-campo-100"
              >
                <span className="text-2xl">{b.emoji}</span>
                <span className="text-campo-800 font-medium text-xs leading-tight">
                  {b.nombre}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-campo-900 text-campo-300 text-center text-xs py-4 px-4 mt-8">
        <p>
          Sistema Experto Avicola · Cuichapa, Veracruz · Implementado en
          Prolog (tau-prolog) · Next.js · Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
