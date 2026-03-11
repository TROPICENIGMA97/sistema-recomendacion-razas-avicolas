"use client";

import { RecommendResult } from "@/lib/prologEngine";

interface Props {
  result: RecommendResult;
  rank: number;
}

const levelColors: Record<string, string> = {
  "Muy alta": "text-green-700 bg-green-100",
  Alta: "text-green-600 bg-green-50",
  Media: "text-yellow-700 bg-yellow-100",
  Baja: "text-red-600 bg-red-100",
  "Muy bajo": "text-green-700 bg-green-100",
  Bajo: "text-green-600 bg-green-50",
  Medio: "text-yellow-700 bg-yellow-100",
  Alto: "text-orange-700 bg-orange-100",
  "Muy facil": "text-green-700 bg-green-100",
  Facil: "text-green-600 bg-green-50",
};

const rankStyles = [
  { border: "border-yellow-400", badge: "bg-yellow-400 text-yellow-900", label: "1er Lugar" },
  { border: "border-gray-300",   badge: "bg-gray-300 text-gray-800",    label: "2do Lugar" },
  { border: "border-amber-600",  badge: "bg-amber-600 text-white",      label: "3er Lugar" },
];

function Tag({ value }: { value: string }) {
  const cls = levelColors[value] ?? "text-gray-700 bg-gray-100";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {value}
    </span>
  );
}

export default function ResultCard({ result, rank }: Props) {
  const { info, total, maxScore } = result;
  const pct = Math.round((total / maxScore) * 100);
  const style = rankStyles[rank] ?? rankStyles[2];

  return (
    <div
      className={`bg-white rounded-2xl shadow-md border-2 ${style.border} overflow-hidden transition-transform hover:-translate-y-1`}
    >
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${style.badge}`}
        >
          {style.label}
        </span>
        <span className="text-3xl">{info.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-campo-900 truncate">
            {info.nombre}
          </h3>
          <p className="text-sm text-campo-600">{info.proposito}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-black text-campo-700">{total}</div>
          <div className="text-xs text-gray-400">de {maxScore} pts</div>
        </div>
      </div>

      <div className="px-5 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-campo-500 to-campo-700 h-2 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-campo-700 w-10 text-right">
            {pct}%
          </span>
        </div>
      </div>

      <div className="px-5 py-3">
        <p className="text-sm text-gray-600 leading-relaxed">{info.descripcion}</p>
      </div>

      <div className="px-5 pb-5 grid grid-cols-2 gap-2 text-sm">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Calor</span>
          <Tag value={info.toleranciaCalor} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Resistencia</span>
          <Tag value={info.resistencia} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Manejo</span>
          <Tag value={info.facilidad} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Costo inicial</span>
          <Tag value={info.costo} />
        </div>
        <div className="col-span-2 flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Produccion de huevos
          </span>
          <span className="font-semibold text-campo-800">
            {info.huevosAnio > 0
              ? `${info.huevosAnio} huevos / ano`
              : "Produccion de carne - no aplica"}
          </span>
        </div>
      </div>
    </div>
  );
}
