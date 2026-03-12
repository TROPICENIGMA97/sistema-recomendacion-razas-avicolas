"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BREED_DATA } from "@/lib/prologEngine";

interface Rec {
  id: string;
  objetivo: string;
  clima: string;
  espacio: string;
  presupuesto: string;
  experiencia: string;
  resultados: any[];
  motor: string;
  notas: string;
  created_at: string;
}

const L: Record<string, string> = {
  huevo: "Huevo", carne: "Carne", doble_proposito: "Doble proposito",
  calido_humedo: "Cal. Humedo", calido_seco: "Cal. Seco", templado: "Templado",
  pequeno: "Pequeno", mediano: "Mediano", grande: "Grande",
  bajo: "Bajo", medio: "Medio", alto: "Alto",
  principiante: "Principiante", intermedio: "Intermedio", experto: "Experto",
};

export default function RecommendHistory({
  initial, userId,
}: { initial: Rec[]; userId: string }) {
  const supabase = createClient();
  const [recs, setRecs] = useState<Rec[]>(initial);
  const [editId, setEditId] = useState<string | null>(null);
  const [notaEdit, setNotaEdit] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function deleteRec(id: string) {
    if (!confirm("Eliminar esta recomendacion?")) return;
    await supabase.from("recommendations").delete().eq("id", id);
    setRecs((r) => r.filter((x) => x.id !== id));
  }

  async function saveNota(id: string) {
    await supabase.from("recommendations").update({ notas: notaEdit }).eq("id", id);
    setRecs((r) => r.map((x) => (x.id === id ? { ...x, notas: notaEdit } : x)));
    setEditId(null);
  }

  if (recs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 space-y-2">
        <p className="text-4xl">📋</p>
        <p className="font-medium">Sin recomendaciones guardadas</p>
        <p className="text-sm">Haz clic en <strong>+ Nueva</strong> para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recs.map((rec) => {
        const top = rec.resultados?.[0];
        const breed = top ? BREED_DATA[top.raza] : null;
        const isOpen = expanded === rec.id;

        return (
          <div key={rec.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Row header */}
            <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpanded(isOpen ? null : rec.id)}>
              <span className="text-2xl">{breed?.emoji ?? "🐔"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-campo-900 text-sm truncate">
                  {breed?.nombre ?? top?.raza ?? "—"}
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium
                    ${rec.motor === "SWI-Prolog" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>
                    {rec.motor}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {L[rec.objetivo]} · {L[rec.clima]} · {L[rec.espacio]} ·{" "}
                  {new Date(rec.created_at).toLocaleDateString("es-MX")}
                </p>
              </div>
              {top?.total && (
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-campo-700">{top.total}</span>
                  <span className="text-xs text-gray-400">/24</span>
                </div>
              )}
              <span className="text-gray-400 text-xs">{isOpen ? "▲" : "▼"}</span>
            </div>

            {/* Expanded */}
            {isOpen && (
              <div className="px-5 pb-5 border-t border-gray-100 space-y-4 pt-4">
                {/* Top 3 results */}
                <div className="grid sm:grid-cols-3 gap-3">
                  {rec.resultados.slice(0, 3).map((r: any, i: number) => {
                    const b = BREED_DATA[r.raza];
                    return (
                      <div key={r.raza}
                        className={`rounded-xl border-2 p-3 text-sm ${i === 0 ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span>{b?.emoji ?? "🐔"}</span>
                          <span className="font-bold text-campo-900 text-xs">{b?.nombre ?? r.raza}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex-1 bg-gray-200 h-1.5 rounded-full">
                            <div className="bg-campo-600 h-1.5 rounded-full" style={{ width: `${Math.round((r.total/24)*100)}%` }} />
                          </div>
                          <span className="text-xs font-bold text-campo-700">{r.total}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Variables */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {(["objetivo","clima","espacio","presupuesto","experiencia"] as const).map((k) => (
                    <span key={k} className="px-2.5 py-1 bg-campo-100 text-campo-800 rounded-full font-medium">
                      {L[(rec as any)[k]] ?? (rec as any)[k]}
                    </span>
                  ))}
                </div>

                {/* Notes */}
                <div>
                  {editId === rec.id ? (
                    <div className="flex gap-2">
                      <input value={notaEdit} onChange={(e) => setNotaEdit(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-campo-400"
                        placeholder="Escribe una nota..." />
                      <button onClick={() => saveNota(rec.id)}
                        className="px-3 py-2 bg-campo-600 hover:bg-campo-700 text-white rounded-lg text-xs font-semibold">
                        Guardar
                      </button>
                      <button onClick={() => setEditId(null)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="flex-1 text-xs text-gray-500 italic">
                        {rec.notas || "Sin notas"}
                      </p>
                      <button onClick={() => { setEditId(rec.id); setNotaEdit(rec.notas); }}
                        className="text-xs text-campo-600 hover:underline">
                        Editar nota
                      </button>
                    </div>
                  )}
                </div>

                {/* Delete */}
                <div className="flex justify-end">
                  <button onClick={() => deleteRec(rec.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Eliminar recomendacion
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
