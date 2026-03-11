"use client";

import { useState } from "react";
import { getRecommendations } from "@/lib/prologEngine";

interface TestCase {
  id: number;
  descripcion: string;
  params: {
    objetivo: string;
    clima: string;
    espacio: string;
    presupuesto: string;
    experiencia: string;
  };
  esperado: string;
}

interface TestResult {
  id: number;
  top1: string;
  top1Score: number;
  pasó: boolean;
  ejecutado: boolean;
  error?: string;
}

const TEST_CASES: TestCase[] = [
  {
    id: 1,
    descripcion: "Pequeno productor principiante, traspatio familiar, clima humedo, presupuesto bajo",
    params: { objetivo: "doble_proposito", clima: "calido_humedo", espacio: "pequeno", presupuesto: "bajo", experiencia: "principiante" },
    esperado: "criollo",
  },
  {
    id: 2,
    descripcion: "Productor con experiencia media, busca huevos, clima humedo, espacio mediano",
    params: { objetivo: "huevo", clima: "calido_humedo", espacio: "mediano", presupuesto: "medio", experiencia: "intermedio" },
    esperado: "rhode_island_red",
  },
  {
    id: 3,
    descripcion: "Experto en produccion de carne, clima calido seco, gran espacio y alto presupuesto",
    params: { objetivo: "carne", clima: "calido_seco", espacio: "grande", presupuesto: "alto", experiencia: "experto" },
    esperado: "new_hampshire",
  },
  {
    id: 4,
    descripcion: "Principiante con espacio pequeno y clima humedo buscando doble proposito",
    params: { objetivo: "doble_proposito", clima: "calido_humedo", espacio: "pequeno", presupuesto: "medio", experiencia: "principiante" },
    esperado: "cuello_desnudo",
  },
  {
    id: 5,
    descripcion: "Productor experto con alta inversion, clima humedo, busca maxima produccion de huevo",
    params: { objetivo: "huevo", clima: "calido_humedo", espacio: "mediano", presupuesto: "alto", experiencia: "experto" },
    esperado: "leghorn",
  },
  {
    id: 6,
    descripcion: "Intermedio con espacio mediano, clima templado, doble proposito y presupuesto medio",
    params: { objetivo: "doble_proposito", clima: "templado", espacio: "mediano", presupuesto: "medio", experiencia: "intermedio" },
    esperado: "plymouth_rock",
  },
  {
    id: 7,
    descripcion: "Productor intermedio, clima templado, busca alta produccion de huevo",
    params: { objetivo: "huevo", clima: "templado", espacio: "mediano", presupuesto: "medio", experiencia: "intermedio" },
    esperado: "australorp",
  },
  {
    id: 8,
    descripcion: "Experto con gran espacio y alto presupuesto buscando produccion intensiva de carne",
    params: { objetivo: "carne", clima: "calido_humedo", espacio: "grande", presupuesto: "alto", experiencia: "experto" },
    esperado: "new_hampshire",
  },
];

const LABEL: Record<string, string> = {
  leghorn: "Leghorn Blanca",
  rhode_island_red: "Rhode Island Red",
  cuello_desnudo: "Cuello Desnudo",
  new_hampshire: "New Hampshire",
  australorp: "Australorp",
  broiler: "Broiler",
  isa_brown: "ISA Brown",
  criollo: "Gallina Criolla",
  plymouth_rock: "Plymouth Rock",
  huevo: "Huevo", carne: "Carne", doble_proposito: "Doble proposito",
  calido_humedo: "Cal. Humedo", calido_seco: "Cal. Seco", templado: "Templado",
  pequeno: "Pequeno", mediano: "Mediano", grande: "Grande",
  bajo: "Bajo", medio: "Medio", alto: "Alto",
  principiante: "Principiante", intermedio: "Intermedio", experto: "Experto",
};

export default function ValidationPanel() {
  const [results, setResults] = useState<Record<number, TestResult>>({});
  const [running, setRunning] = useState<number | null>(null);
  const [runAll, setRunAll]   = useState(false);

  async function runTest(tc: TestCase) {
    setRunning(tc.id);
    try {
      const recs = await getRecommendations(
        tc.params.objetivo,
        tc.params.clima,
        tc.params.espacio,
        tc.params.presupuesto,
        tc.params.experiencia
      );
      const top = recs[0];
      setResults((prev) => ({
        ...prev,
        [tc.id]: {
          id: tc.id,
          top1: top?.raza ?? "—",
          top1Score: top?.total ?? 0,
          pasó: top?.raza === tc.esperado,
          ejecutado: true,
        },
      }));
    } catch (e) {
      setResults((prev) => ({
        ...prev,
        [tc.id]: { id: tc.id, top1: "—", top1Score: 0, pasó: false, ejecutado: true, error: String(e) },
      }));
    } finally {
      setRunning(null);
    }
  }

  async function runAllTests() {
    setRunAll(true);
    for (const tc of TEST_CASES) {
      await runTest(tc);
    }
    setRunAll(false);
  }

  const executed  = TEST_CASES.filter((tc) => results[tc.id]?.ejecutado);
  const correct   = executed.filter((tc) => results[tc.id]?.pasó);
  const precision = executed.length > 0 ? Math.round((correct.length / executed.length) * 100) : null;

  return (
    <div className="space-y-5">
      {/* Encabezado + metricas */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-campo-900">Panel de Validacion del Sistema</h3>
          <p className="text-sm text-gray-500">
            {TEST_CASES.length} casos de prueba · Objetivo especifico 6: evaluacion de desempeno
          </p>
        </div>
        <div className="flex items-center gap-3">
          {precision !== null && (
            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${precision >= 75 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
              Precision: {precision}% ({correct.length}/{executed.length})
            </div>
          )}
          <button
            onClick={runAllTests}
            disabled={runAll}
            className="px-4 py-2 rounded-xl bg-campo-600 hover:bg-campo-700 disabled:bg-gray-300 text-white text-sm font-semibold transition-colors shadow">
            {runAll ? "Ejecutando…" : "Ejecutar todos"}
          </button>
        </div>
      </div>

      {/* Tabla de casos */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-campo-800 text-white">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold w-8">#</th>
              <th className="px-3 py-2.5 text-left font-semibold">Descripcion del caso</th>
              <th className="px-3 py-2.5 text-center font-semibold">Objetivo</th>
              <th className="px-3 py-2.5 text-center font-semibold">Clima</th>
              <th className="px-3 py-2.5 text-center font-semibold">Espacio</th>
              <th className="px-3 py-2.5 text-center font-semibold">Esperado</th>
              <th className="px-3 py-2.5 text-center font-semibold">Resultado</th>
              <th className="px-3 py-2.5 text-center font-semibold">Estado</th>
              <th className="px-3 py-2.5 text-center font-semibold">Accion</th>
            </tr>
          </thead>
          <tbody>
            {TEST_CASES.map((tc, idx) => {
              const res = results[tc.id];
              return (
                <tr key={tc.id} className={`border-t border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-3 py-2.5 text-gray-400 font-mono text-xs">{tc.id}</td>
                  <td className="px-3 py-2.5 text-gray-700 max-w-[220px]">
                    <span className="line-clamp-2 text-xs leading-snug">{tc.descripcion}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="px-1.5 py-0.5 bg-campo-100 text-campo-800 rounded text-xs font-medium">
                      {LABEL[tc.params.objetivo]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-xs text-gray-600">
                    {LABEL[tc.params.clima]}
                  </td>
                  <td className="px-3 py-2.5 text-center text-xs text-gray-600">
                    {LABEL[tc.params.espacio]}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {LABEL[tc.esperado]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {res?.ejecutado ? (
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${res.pasó ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                        {LABEL[res.top1] ?? res.top1}
                        {res.top1Score > 0 && <span className="ml-1 text-gray-400">({res.top1Score})</span>}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {!res?.ejecutado ? (
                      <span className="text-gray-400 text-xs">Pendiente</span>
                    ) : res.pasó ? (
                      <span className="text-green-600 font-bold text-base">✓</span>
                    ) : (
                      <span className="text-orange-500 text-xs font-semibold">Revisar</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      onClick={() => runTest(tc)}
                      disabled={running === tc.id || runAll}
                      className="px-2.5 py-1 rounded-lg bg-campo-600 hover:bg-campo-700 disabled:bg-gray-300 text-white text-xs font-semibold transition-colors">
                      {running === tc.id ? "…" : "Probar"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div className="grid sm:grid-cols-3 gap-3 text-xs text-gray-600">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <span className="font-bold text-green-700">✓ Correcto:</span> El motor Prolog recomienda exactamente la raza esperada como primera opcion.
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <span className="font-bold text-orange-600">Revisar:</span> El sistema recomienda otra raza. Puede indicar empate de puntuacion o ajuste necesario en pesos.
        </div>
        <div className="bg-campo-50 border border-campo-200 rounded-lg p-3">
          <span className="font-bold text-campo-700">Precision:</span> Porcentaje de casos donde la primera recomendacion coincide con la raza esperada por el experto.
        </div>
      </div>
    </div>
  );
}
