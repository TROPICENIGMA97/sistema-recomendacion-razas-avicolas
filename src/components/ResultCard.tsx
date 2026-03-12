"use client";

import { RecommendResult } from "@/lib/prologEngine";
import BreedImage from "./BreedImage";

interface Props {
  result: RecommendResult;
  rank: number;
}

const tagColor: Record<string, string> = {
  "Muy alta":    "text-green-700 bg-green-100",
  Alta:          "text-green-600 bg-green-50",
  Media:         "text-yellow-700 bg-yellow-100",
  Baja:          "text-red-600 bg-red-100",
  "Muy bajo":    "text-green-700 bg-green-100",
  Bajo:          "text-green-600 bg-green-50",
  Medio:         "text-yellow-700 bg-yellow-100",
  Alto:          "text-orange-700 bg-orange-100",
  "Muy facil":   "text-green-700 bg-green-100",
  Facil:         "text-green-600 bg-green-50",
  "Cal. Humedo": "text-blue-700 bg-blue-100",
  "Cal. Seco":   "text-orange-700 bg-orange-100",
  Templado:      "text-teal-700 bg-teal-100",
  Pequeno:       "text-green-700 bg-green-100",
  Mediano:       "text-yellow-700 bg-yellow-100",
  Grande:        "text-orange-700 bg-orange-100",
};

const rankStyles = [
  { border: "border-yellow-400", badge: "bg-yellow-400 text-yellow-900", label: "1er Lugar", glow: "shadow-yellow-200" },
  { border: "border-gray-300",   badge: "bg-gray-300 text-gray-800",     label: "2do Lugar", glow: "" },
  { border: "border-amber-600",  badge: "bg-amber-600 text-white",       label: "3er Lugar", glow: "" },
];

function Tag({ value }: { value: string }) {
  const cls = tagColor[value] ?? "text-gray-700 bg-gray-100";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {value}
    </span>
  );
}

export default function ResultCard({ result, rank }: Props) {
  const { info, total, maxScore } = result;
  const pct   = Math.round((total / maxScore) * 100);
  const style = rankStyles[rank] ?? rankStyles[2];

  return (
    <div className={`bg-white rounded-2xl shadow-md border-2 ${style.border} overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${style.glow}`}>
      <div className="relative">
        <BreedImage
          imagen={info.imagen}
          nombre={info.nombre}
          emoji={info.emoji}
          size="md"
          className="w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <span className={`text-xs font-black px-3 py-1 rounded-full shadow ${style.badge}`}>
            {style.label}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 bg-black/60 rounded-xl px-3 py-1.5 text-right backdrop-blur-sm">
          <div className="text-2xl font-black text-white leading-none">{total}</div>
          <div className="text-xs text-white/70">/ {maxScore} pts</div>
        </div>

        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-black text-base drop-shadow leading-tight">{info.nombre}</h3>
          <span className="text-white/80 text-xs">{info.proposito}</span>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-campo-500 to-campo-700 h-2 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-campo-700 w-9 text-right">{pct}%</span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-3">{info.descripcion}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Clima</p>
            <Tag value={info.climaOptimo} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Espacio</p>
            <Tag value={info.espacioReq} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Resistencia</p>
            <Tag value={info.resistencia} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Costo</p>
            <Tag value={info.costo} />
          </div>
          <div className="col-span-2 space-y-0.5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Produccion huevos</p>
            <p className="font-bold text-campo-800 text-sm">
              {info.huevosAnio > 0 ? `${info.huevosAnio} huevos / ano` : "Produccion de carne"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
