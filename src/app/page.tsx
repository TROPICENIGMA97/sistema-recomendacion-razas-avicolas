"use client";

import { useState } from "react";
import RecommendationForm from "@/components/RecommendationForm";
import ValidationPanel from "@/components/ValidationPanel";

type Tab = "sistema" | "validacion" | "datos";

const BREEDS = [
  { nombre: "Leghorn Blanca",    emoji: "🐓", proposito: "Huevo",        clima: "Cal. Seco",   espacio: "Mediano" },
  { nombre: "Rhode Island Red",  emoji: "🐔", proposito: "Doble",        clima: "Cal. Humedo", espacio: "Mediano" },
  { nombre: "Cuello Desnudo",    emoji: "🦤", proposito: "Doble",        clima: "Cal. Humedo", espacio: "Pequeno" },
  { nombre: "New Hampshire",     emoji: "🍗", proposito: "Carne",        clima: "Cal. Seco",   espacio: "Grande"  },
  { nombre: "Australorp",        emoji: "🥚", proposito: "Huevo",        clima: "Templado",    espacio: "Mediano" },
  { nombre: "Broiler",           emoji: "🍖", proposito: "Carne",        clima: "Templado",    espacio: "Grande"  },
  { nombre: "ISA Brown",         emoji: "🥚", proposito: "Huevo",        clima: "Cal. Seco",   espacio: "Pequeno" },
  { nombre: "Gallina Criolla",   emoji: "🐣", proposito: "Doble",        clima: "Cal. Humedo", espacio: "Pequeno" },
  { nombre: "Plymouth Rock",     emoji: "🐓", proposito: "Doble",        clima: "Templado",    espacio: "Mediano" },
];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("sistema");

  return (
    <div className="min-h-screen flex flex-col bg-[#f6fbf0]">
      {/* Header */}
      <header className="bg-campo-800 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-3xl">🐔</span>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">
              Sistema de Recomendacion Avicola — Cuichapa, Veracruz
            </h1>
            <p className="text-campo-200 text-xs hidden sm:block">
              5 variables · 9 razas · Motor de inferencia Prolog (tau-prolog)
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 pb-0">
          {(["sistema", "validacion", "datos"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors capitalize
                ${tab === t ? "bg-[#f6fbf0] text-campo-800" : "text-campo-200 hover:text-white"}`}>
              {t === "sistema"    && "Sistema"}
              {t === "validacion" && "Validacion"}
              {t === "datos"      && "Base de Datos"}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* ===== TAB: SISTEMA ===== */}
        {tab === "sistema" && (
          <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-campo-700 to-campo-900 rounded-2xl text-white p-7 shadow-lg">
              <div className="max-w-2xl space-y-3">
                <span className="inline-block bg-tierra-400 text-tierra-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Sistema Experto · Prolog
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  Encuentra la raza avicola ideal para tu granja
                </h2>
                <p className="text-campo-200 text-sm leading-relaxed">
                  Responde 5 preguntas sobre tu objetivo, clima, espacio, presupuesto y experiencia.
                  El motor de reglas Prolog evaluara 9 razas avicolas y te entregara las 3 mejores opciones
                  para las condiciones de Cuichapa, Veracruz.
                </p>
                <div className="flex flex-wrap gap-3 pt-1 text-xs">
                  {[
                    ["🧠","Reglas Prolog"],["🌡️","Clima local"],["📐","Espacio"],
                    ["🐓","9 razas"],["📊","Puntuacion 24 pts"],
                  ].map(([e,l]) => (
                    <div key={l} className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
                      <span>{e}</span><span className="text-campo-100">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Variables info */}
            <section className="grid sm:grid-cols-5 gap-3">
              {[
                { icon:"🎯", label:"Objetivo",    desc:"Huevo / Carne / Doble" },
                { icon:"🌡️", label:"Clima",        desc:"Humedo / Seco / Templado" },
                { icon:"📐", label:"Espacio",      desc:"Pequeno / Mediano / Grande" },
                { icon:"💰", label:"Presupuesto",  desc:"Bajo / Medio / Alto" },
                { icon:"👨‍🌾",label:"Experiencia",  desc:"Principiante / Intermedio / Experto" },
              ].map((v) => (
                <div key={v.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
                  <span className="text-2xl">{v.icon}</span>
                  <p className="font-semibold text-campo-800 text-sm mt-1">{v.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{v.desc}</p>
                </div>
              ))}
            </section>

            <RecommendationForm />
          </>
        )}

        {/* ===== TAB: VALIDACION ===== */}
        {tab === "validacion" && (
          <section className="space-y-5">
            <div className="bg-gradient-to-r from-campo-700 to-campo-900 rounded-2xl text-white p-6">
              <h2 className="text-xl font-bold">Evaluacion del Desempeno del Sistema</h2>
              <p className="text-campo-200 text-sm mt-1">
                Objetivo especifico 6: pruebas de validacion y analisis de precision. Ejecuta los casos
                de prueba y verifica que el motor Prolog recomienda la raza esperada por el experto.
              </p>
            </div>
            <ValidationPanel />
          </section>
        )}

        {/* ===== TAB: BASE DE DATOS ===== */}
        {tab === "datos" && (
          <section className="space-y-5">
            <div className="bg-gradient-to-r from-campo-700 to-campo-900 rounded-2xl text-white p-6">
              <h2 className="text-xl font-bold">Base de Datos de Razas Avicolas</h2>
              <p className="text-campo-200 text-sm mt-1">
                Objetivo especifico 3: caracteristicas productivas y adaptabilidad de 9 razas
                seleccionadas para la region de Cuichapa, Veracruz.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-campo-800 text-white">
                  <tr>
                    {["Raza","Proposito","Clima optimo","Espacio req.","Huevos/ano","Resistencia","Facilidad","Costo"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BREEDS.map((b, i) => (
                    <tr key={b.nombre} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <td className="px-3 py-2.5 font-semibold text-campo-900 whitespace-nowrap">
                        {b.emoji} {b.nombre}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 bg-campo-100 text-campo-800 rounded-full text-xs font-medium">
                          {b.proposito}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{b.clima}</td>
                      <td className="px-3 py-2.5 text-gray-600">{b.espacio}</td>
                      <td className="px-3 py-2.5 text-gray-600">
                        {[0,0,0].map((_, j) => {
                          const vals = [280,200,160,180,250,0,300,120,200];
                          return j === 0 ? (vals[i] > 0 ? `${vals[i]} huevos` : "Solo carne") : null;
                        })[0]}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">
                        {["Media","Alta","Muy alta","Alta","Alta","Baja","Media","Muy alta","Alta"][i]}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">
                        {["Media","Facil","Facil","Facil","Facil","Media","Facil","Muy facil","Facil"][i]}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">
                        {["Medio","Medio","Bajo","Medio","Medio","Alto","Alto","Muy bajo","Medio"][i]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-campo-900 mb-3">Variables del Modelo (Objetivo especifico 2)</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="space-y-2">
                  <p><strong className="text-campo-700">Objetivo productivo:</strong> Proposito principal de la explotacion avicola (huevo, carne o doble proposito).</p>
                  <p><strong className="text-campo-700">Clima:</strong> Tipo climatico de la zona del productor (calido humedo, calido seco, templado).</p>
                  <p><strong className="text-campo-700">Espacio disponible:</strong> Superficie destinada a la crianza (&lt;25m², 25-100m², &gt;100m²).</p>
                </div>
                <div className="space-y-2">
                  <p><strong className="text-campo-700">Presupuesto inicial:</strong> Capacidad de inversion para la adquisicion de aves.</p>
                  <p><strong className="text-campo-700">Experiencia:</strong> Nivel tecnico del productor (principiante, intermedio, experto).</p>
                  <p><strong className="text-campo-700">Puntuacion maxima:</strong> 24 pts = (objetivo×3) + (clima×2) + espacio + presupuesto + experiencia.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-campo-900 text-campo-300 text-center text-xs py-4 px-4 mt-4">
        Sistema Experto Avicola · Cuichapa, Veracruz · Prolog (tau-prolog) · Next.js · Tailwind CSS
      </footer>
    </div>
  );
}
