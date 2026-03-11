"use client";

import { useState } from "react";
import { getRecommendations, RecommendResult } from "@/lib/prologEngine";
import ResultCard from "@/components/ResultCard";

type Step = 1 | 2 | 3 | 4;

interface Answers {
  objetivo: string;
  presupuesto: string;
  experiencia: string;
  alimentacion: string;
}

const STEPS: {
  step: Step;
  title: string;
  subtitle: string;
  key: keyof Answers;
  icon: string;
  options: { label: string; sublabel: string; value: string; emoji: string }[];
}[] = [
  {
    step: 1,
    title: "Objetivo principal",
    subtitle: "Que tipo de produccion desea tener en su granja?",
    key: "objetivo",
    icon: "🎯",
    options: [
      { label: "Produccion de Huevo", sublabel: "Ventas o consumo familiar", value: "huevo", emoji: "🥚" },
      { label: "Produccion de Carne", sublabel: "Pollos para venta o consumo", value: "carne", emoji: "🍗" },
      { label: "Doble Proposito", sublabel: "Huevo y carne", value: "doble_proposito", emoji: "🐔" },
    ],
  },
  {
    step: 2,
    title: "Presupuesto inicial",
    subtitle: "Cuanto puede invertir en la compra de sus aves?",
    key: "presupuesto",
    icon: "💰",
    options: [
      { label: "Bajo", sublabel: "Menos de $100 MXN por ave", value: "bajo", emoji: "💵" },
      { label: "Medio", sublabel: "$100 - $300 MXN por ave", value: "medio", emoji: "💴" },
      { label: "Alto", sublabel: "Mas de $300 MXN por ave", value: "alto", emoji: "💳" },
    ],
  },
  {
    step: 3,
    title: "Experiencia en avicultura",
    subtitle: "Cuanta experiencia tiene criando aves?",
    key: "experiencia",
    icon: "👨‍🌾",
    options: [
      { label: "Principiante", sublabel: "Primera vez criando aves", value: "principiante", emoji: "🌱" },
      { label: "Intermedio", sublabel: "1 a 3 anos de experiencia", value: "intermedio", emoji: "🌿" },
      { label: "Experto", sublabel: "Mas de 3 anos de experiencia", value: "experto", emoji: "🌳" },
    ],
  },
  {
    step: 4,
    title: "Disponibilidad de alimento",
    subtitle: "Cuanto alimento balanceado puede proporcionar a sus aves?",
    key: "alimentacion",
    icon: "🌾",
    options: [
      { label: "Limitado", sublabel: "Solo forraje y sobras del hogar", value: "limitado", emoji: "🍃" },
      { label: "Moderado", sublabel: "Algo de alimento comercial", value: "moderado", emoji: "🌽" },
      { label: "Abundante", sublabel: "Alimento balanceado completo", value: "abundante", emoji: "🌾" },
    ],
  },
];

export default function RecommendationForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecommendResult[] | null>(null);

  const stepData = STEPS[currentStep - 1];
  const selected = answers[stepData.key];

  function select(value: string) {
    setAnswers((prev) => ({ ...prev, [stepData.key]: value }));
  }

  function goBack() {
    if (currentStep > 1) setCurrentStep((s) => (s - 1) as Step);
  }

  async function goNext() {
    if (!selected) return;
    if (currentStep < 4) {
      setCurrentStep((s) => (s + 1) as Step);
      return;
    }
    const full = answers as Answers;
    setLoading(true);
    setError(null);
    try {
      const recs = await getRecommendations(
        full.objetivo,
        full.presupuesto,
        full.experiencia,
        full.alimentacion
      );
      setResults(recs.slice(0, 3));
    } catch (e) {
      setError("Error al procesar la recomendacion. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setAnswers({});
    setCurrentStep(1);
    setResults(null);
    setError(null);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="w-16 h-16 border-4 border-campo-300 border-t-campo-600 rounded-full animate-spin" />
        <p className="text-campo-700 font-semibold text-lg">
          Consultando base de conocimiento Prolog...
        </p>
        <p className="text-gray-500 text-sm">Analizando las mejores razas para su perfil</p>
      </div>
    );
  }

  if (results) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-campo-900">
            Recomendaciones para su perfil
          </h2>
          <p className="text-gray-500 text-sm">
            Resultado generado por el motor de inferencia Prolog
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No se encontraron razas compatibles con su perfil.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-3">
            {results.map((r, i) => (
              <ResultCard key={r.raza} result={r} rank={i} />
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <button
            onClick={restart}
            className="px-6 py-3 rounded-xl bg-campo-600 hover:bg-campo-700 text-white font-semibold transition-colors shadow"
          >
            Hacer nueva consulta
          </button>
        </div>

        <div className="bg-tierra-100 border border-tierra-300 rounded-xl p-4 text-sm text-tierra-800 text-center">
          <strong>Nota:</strong> Las recomendaciones se generan mediante reglas logicas en
          Prolog considerando clima calido de Cuichapa, Veracruz.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {STEPS.map((s) => (
          <div key={s.step} className="flex items-center gap-1 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${s.step < currentStep ? "bg-campo-600 text-white" : ""}
                ${s.step === currentStep ? "bg-campo-700 text-white ring-2 ring-campo-300" : ""}
                ${s.step > currentStep ? "bg-gray-200 text-gray-400" : ""}
              `}
            >
              {s.step < currentStep ? "✓" : s.step}
            </div>
            {s.step < 4 && (
              <div
                className={`flex-1 h-1 rounded-full transition-colors ${
                  s.step < currentStep ? "bg-campo-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{stepData.icon}</span>
          <div>
            <div className="text-xs font-semibold text-campo-500 uppercase tracking-wider">
              Paso {currentStep} de 4
            </div>
            <h2 className="text-xl font-bold text-campo-900">{stepData.title}</h2>
            <p className="text-sm text-gray-500">{stepData.subtitle}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {stepData.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center
                ${
                  selected === opt.value
                    ? "border-campo-600 bg-campo-50 shadow-md"
                    : "border-gray-200 hover:border-campo-300 hover:bg-gray-50"
                }
              `}
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span className="font-semibold text-campo-900 text-sm leading-tight">
                {opt.label}
              </span>
              <span className="text-xs text-gray-500">{opt.sublabel}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            onClick={goBack}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold disabled:opacity-30 hover:border-gray-300 transition-colors"
          >
            Anterior
          </button>
          <button
            onClick={goNext}
            disabled={!selected}
            className="px-6 py-2.5 rounded-xl bg-campo-600 hover:bg-campo-700 disabled:bg-gray-300 text-white font-semibold transition-colors shadow"
          >
            {currentStep === 4 ? "Ver recomendaciones" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
