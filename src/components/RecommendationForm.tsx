"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getRecommendations, RecommendResult } from "@/lib/prologEngine";
import ResultCard from "@/components/ResultCard";

interface Props {
  userId?: string;
}

interface Answers {
  objetivo: string;
  clima: string;
  espacio: string;
  presupuesto: string;
  experiencia: string;
}

type StepKey = keyof Answers;

const STEPS: {
  key: StepKey;
  title: string;
  subtitle: string;
  icon: string;
  options: { label: string; sublabel: string; value: string; emoji: string }[];
}[] = [
  {
    key: "objetivo",
    title: "Objetivo productivo",
    subtitle: "¿Que tipo de produccion desea en su granja?",
    icon: "🎯",
    options: [
      { label: "Produccion de Huevo",  sublabel: "Ventas o consumo familiar",    value: "huevo",           emoji: "🥚" },
      { label: "Produccion de Carne",  sublabel: "Pollos para venta o consumo",  value: "carne",           emoji: "🍗" },
      { label: "Doble Proposito",      sublabel: "Huevo y carne a la vez",        value: "doble_proposito", emoji: "🐔" },
    ],
  },
  {
    key: "clima",
    title: "Clima de su zona",
    subtitle: "¿Como es el clima donde se ubica su granja en Cuichapa?",
    icon: "🌡️",
    options: [
      { label: "Calido Humedo",  sublabel: "Calor con mucha humedad (tropical)", value: "calido_humedo", emoji: "🌧️" },
      { label: "Calido Seco",    sublabel: "Calor con poca humedad",             value: "calido_seco",   emoji: "☀️" },
      { label: "Templado",       sublabel: "Temperatura moderada, fresco",       value: "templado",      emoji: "🌤️" },
    ],
  },
  {
    key: "espacio",
    title: "Espacio disponible",
    subtitle: "¿Con cuanto espacio cuenta para la crianza de aves?",
    icon: "📐",
    options: [
      { label: "Pequeno",  sublabel: "Menos de 25 m² (traspatio familiar)",  value: "pequeno", emoji: "🏠" },
      { label: "Mediano",  sublabel: "25 a 100 m² (granja familiar)",         value: "mediano", emoji: "🏡" },
      { label: "Grande",   sublabel: "Mas de 100 m² (produccion comercial)",  value: "grande",  emoji: "🏘️" },
    ],
  },
  {
    key: "presupuesto",
    title: "Presupuesto inicial",
    subtitle: "¿Cuanto puede invertir en la compra inicial de sus aves?",
    icon: "💰",
    options: [
      { label: "Bajo",   sublabel: "Menos de $100 MXN por ave",       value: "bajo",  emoji: "💵" },
      { label: "Medio",  sublabel: "$100 a $300 MXN por ave",         value: "medio", emoji: "💴" },
      { label: "Alto",   sublabel: "Mas de $300 MXN por ave",         value: "alto",  emoji: "💳" },
    ],
  },
  {
    key: "experiencia",
    title: "Nivel de experiencia",
    subtitle: "¿Cuanta experiencia tiene en la crianza de aves de corral?",
    icon: "👨‍🌾",
    options: [
      { label: "Principiante", sublabel: "Primera vez criando aves",          value: "principiante", emoji: "🌱" },
      { label: "Intermedio",   sublabel: "1 a 3 anos criando aves",           value: "intermedio",   emoji: "🌿" },
      { label: "Experto",      sublabel: "Mas de 3 anos de experiencia",      value: "experto",      emoji: "🌳" },
    ],
  },
];

export default function RecommendationForm({ userId }: Props) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [results, setResults] = useState<RecommendResult[] | null>(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  const current  = STEPS[step];
  const selected = answers[current.key];
  const total    = STEPS.length;

  function pick(value: string) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function next() {
    if (!selected) return;
    if (step < total - 1) { setStep((s) => s + 1); return; }

    const a = answers as Answers;
    setLoading(true);
    setError(null);
    try {
      const recs = await getRecommendations(
        a.objetivo, a.clima, a.espacio, a.presupuesto, a.experiencia
      );
      setResults(recs.slice(0, 3));
    } catch {
      setError("Error al procesar. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function saveRec() {
    if (!userId || !results || saved) return;
    const a = answers as Answers;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase.from("recommendations").insert({
        user_id:     userId,
        objetivo:    a.objetivo,
        clima:       a.clima,
        espacio:     a.espacio,
        presupuesto: a.presupuesto,
        experiencia: a.experiencia,
        resultados:  results,
        motor:       results[0]?.motor ?? "tau-prolog",
        notas:       "",
      });
      if (dbErr) throw dbErr;
      setSaved(true);
    } catch {
      setError("No se pudo guardar. Verifique su conexion e intente de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setResults(null);
    setError(null);
    setSaved(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5">
        <div className="w-14 h-14 border-4 border-campo-300 border-t-campo-600 rounded-full animate-spin" />
        <p className="text-campo-700 font-semibold">Consultando base de conocimiento Prolog…</p>
        <p className="text-gray-400 text-sm">Evaluando 9 razas con 5 variables…</p>
      </div>
    );
  }

  if (results) {
    const a = answers as Answers;
    const labelMap: Record<string, string> = {
      huevo: "Huevo", carne: "Carne", doble_proposito: "Doble proposito",
      calido_humedo: "Calido humedo", calido_seco: "Calido seco", templado: "Templado",
      pequeno: "Pequeno (<25m²)", mediano: "Mediano (25-100m²)", grande: "Grande (>100m²)",
      bajo: "Bajo", medio: "Medio", alto: "Alto",
      principiante: "Principiante", intermedio: "Intermedio", experto: "Experto",
    };

    return (
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-campo-900">Recomendaciones para su perfil</h2>
          <p className="text-gray-500 text-sm">Resultado del motor de inferencia Prolog — top 3 razas</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center text-xs">
          {(["objetivo","clima","espacio","presupuesto","experiencia"] as StepKey[]).map((k) => (
            <span key={k} className="px-3 py-1 bg-campo-100 text-campo-800 rounded-full font-medium">
              {labelMap[a[k] ?? ""]}
            </span>
          ))}
        </div>

        {results.length === 0 ? (
          <p className="text-center py-10 text-gray-400">No se encontraron razas compatibles.</p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {results.map((r, i) => <ResultCard key={r.raza} result={r} rank={i} />)}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={restart}
            className="px-6 py-3 rounded-xl bg-campo-600 hover:bg-campo-700 text-white font-semibold transition-colors shadow"
          >
            Nueva consulta
          </button>

          {userId && !saved && (
            <button
              onClick={saveRec}
              disabled={saving}
              className="px-6 py-3 rounded-xl border-2 border-campo-600 text-campo-700 hover:bg-campo-50 disabled:opacity-50 font-semibold transition-colors"
            >
              {saving ? "Guardando…" : "Guardar en historial"}
            </button>
          )}

          {saved && (
            <div className="flex items-center gap-3">
              <span className="text-campo-700 font-semibold text-sm">Guardado</span>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-tierra-400 hover:bg-tierra-500 text-tierra-900 font-bold text-sm transition-colors"
              >
                Ver historial →
              </Link>
            </div>
          )}
        </div>

        <div className="bg-tierra-100 border border-tierra-300 rounded-xl p-4 text-sm text-tierra-800 text-center">
          <strong>Nota:</strong> Recomendaciones generadas por reglas logicas Prolog.
          Puntuacion maxima: <strong>24 pts</strong> (objetivo×3 + clima×2 + espacio + presupuesto + experiencia).
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-1.5 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
              ${i < step  ? "bg-campo-600 text-white" : ""}
              ${i === step ? "bg-campo-700 text-white ring-2 ring-campo-300 ring-offset-1" : ""}
              ${i > step  ? "bg-gray-200 text-gray-400" : ""}`}>
              {i < step ? "✓" : i + 1}
            </div>
            {i < total - 1 && (
              <div className={`flex-1 h-1 rounded-full transition-colors ${i < step ? "bg-campo-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{current.icon}</span>
          <div>
            <p className="text-xs font-semibold text-campo-500 uppercase tracking-wider">
              Variable {step + 1} de {total}
            </p>
            <h2 className="text-xl font-bold text-campo-900">{current.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{current.subtitle}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {current.options.map((opt) => (
            <button key={opt.value} onClick={() => pick(opt.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all
                ${selected === opt.value
                  ? "border-campo-600 bg-campo-50 shadow-md scale-[1.02]"
                  : "border-gray-200 hover:border-campo-300 hover:bg-gray-50"}`}>
              <span className="text-4xl">{opt.emoji}</span>
              <span className="font-semibold text-campo-900 text-sm leading-tight">{opt.label}</span>
              <span className="text-xs text-gray-500 leading-tight">{opt.sublabel}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>
        )}

        <div className="flex justify-between pt-1">
          <button onClick={back} disabled={step === 0}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold disabled:opacity-30 hover:border-gray-300 transition-colors">
            ← Anterior
          </button>
          <button onClick={next} disabled={!selected}
            className="px-6 py-2.5 rounded-xl bg-campo-600 hover:bg-campo-700 disabled:bg-gray-300 text-white font-semibold transition-colors shadow">
            {step === total - 1 ? "Ver recomendaciones 🐔" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}
