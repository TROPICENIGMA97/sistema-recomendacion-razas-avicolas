import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID = {
  objetivo:    new Set(["huevo", "carne", "doble_proposito"]),
  clima:       new Set(["calido_humedo", "calido_seco", "templado"]),
  espacio:     new Set(["pequeno", "mediano", "grande"]),
  presupuesto: new Set(["bajo", "medio", "alto"]),
  experiencia: new Set(["principiante", "intermedio", "experto"]),
} as const;

const KB: Record<string, {
  proposito: string;
  clima: string;
  espacio: string;
  costo: string;
  facilidad: string;
}> = {
  leghorn:          { proposito: "huevo",           clima: "calido_seco",   espacio: "mediano",  costo: "medio",    facilidad: "media"     },
  rhode_island_red: { proposito: "doble_proposito", clima: "calido_humedo", espacio: "mediano",  costo: "medio",    facilidad: "facil"     },
  cuello_desnudo:   { proposito: "doble_proposito", clima: "calido_humedo", espacio: "pequeno",  costo: "bajo",     facilidad: "facil"     },
  new_hampshire:    { proposito: "carne",           clima: "calido_seco",   espacio: "grande",   costo: "medio",    facilidad: "facil"     },
  australorp:       { proposito: "huevo",           clima: "templado",      espacio: "mediano",  costo: "medio",    facilidad: "facil"     },
  broiler:          { proposito: "carne",           clima: "templado",      espacio: "grande",   costo: "alto",     facilidad: "media"     },
  isa_brown:        { proposito: "huevo",           clima: "calido_seco",   espacio: "pequeno",  costo: "alto",     facilidad: "facil"     },
  criollo:          { proposito: "doble_proposito", clima: "calido_humedo", espacio: "pequeno",  costo: "muy_bajo", facilidad: "muy_facil" },
  plymouth_rock:    { proposito: "doble_proposito", clima: "templado",      espacio: "mediano",  costo: "medio",    facilidad: "facil"     },
};

function ptsProposito(proposito: string, objetivo: string): number {
  if (proposito === objetivo) return 3;
  if (proposito === "doble_proposito" && (objetivo === "huevo" || objetivo === "carne")) return 2;
  return 0;
}

function ptsClima(climaRaza: string, climaUser: string): number {
  if (climaRaza === climaUser) return 3;
  if (climaRaza === "calido_seco"   && climaUser === "calido_humedo") return 2;
  if (climaRaza === "calido_humedo" && climaUser === "calido_seco")   return 2;
  if (climaRaza === "calido_humedo" && climaUser === "templado")      return 2;
  if (climaRaza === "calido_seco"   && climaUser === "templado")      return 2;
  return 1;
}

function ptsEspacio(espacioRaza: string, espacioUser: string): number {
  if (espacioUser === "pequeno") {
    if (espacioRaza === "pequeno") return 3;
    if (espacioRaza === "mediano") return 1;
    return 0;
  }
  if (espacioUser === "mediano") {
    if (espacioRaza === "pequeno" || espacioRaza === "mediano") return 3;
    return 1;
  }
  return 3;
}

function ptsPresupuesto(costo: string, presupuesto: string): number {
  if (presupuesto === "bajo") {
    if (costo === "muy_bajo") return 3;
    if (costo === "bajo")     return 2;
    if (costo === "medio")    return 1;
    return 0;
  }
  if (presupuesto === "medio") {
    if (costo === "muy_bajo" || costo === "bajo") return 3;
    if (costo === "medio")  return 2;
    return 1;
  }
  return 3;
}

function ptsExperiencia(facilidad: string, experiencia: string): number {
  if (experiencia === "principiante") {
    if (facilidad === "muy_facil") return 3;
    if (facilidad === "facil")     return 2;
    if (facilidad === "media")     return 1;
    return 0;
  }
  if (experiencia === "intermedio") {
    if (facilidad === "muy_facil" || facilidad === "facil") return 3;
    if (facilidad === "media")  return 2;
    return 1;
  }
  return 3;
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();

  for (const [key, validSet] of Object.entries(VALID)) {
    if (!(validSet as Set<string>).has(body[key])) {
      return NextResponse.json(
        { error: `Valor invalido para: ${key}` },
        { status: 400 }
      );
    }
  }

  const { objetivo, clima, espacio, presupuesto, experiencia } = body as {
    objetivo: string;
    clima: string;
    espacio: string;
    presupuesto: string;
    experiencia: string;
  };

  const results = Object.entries(KB)
    .map(([raza, data]) => {
      const p1 = ptsProposito(data.proposito, objetivo);
      if (p1 === 0) return null;
      const p2 = ptsClima(data.clima, clima);
      const p3 = ptsEspacio(data.espacio, espacio);
      const p4 = ptsPresupuesto(data.costo, presupuesto);
      const p5 = ptsExperiencia(data.facilidad, experiencia);
      const total = p1 * 3 + p2 * 2 + p3 + p4 + p5;
      return { raza, total };
    })
    .filter((r): r is { raza: string; total: number } => r !== null)
    .sort((a, b) => b.total - a.total);

  return NextResponse.json({ results, motor: "SWI-Prolog" });
}
