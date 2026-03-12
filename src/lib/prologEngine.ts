import { PROLOG_CODE, MAX_SCORE } from "./prologCode";

export type Motor = "SWI-Prolog" | "tau-prolog";

async function trySwiplApi(
  objetivo: string, clima: string, espacio: string,
  presupuesto: string, experiencia: string
): Promise<{ results: { raza: string; total: number }[]; motor: Motor } | null> {
  try {
    const res = await fetch("/api/prolog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objetivo, clima, espacio, presupuesto, experiencia }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results?.length) return null;
    return { results: data.results, motor: "SWI-Prolog" };
  } catch {
    return null;
  }
}

export interface BreedInfo {
  nombre: string;
  descripcion: string;
  proposito: string;
  climaOptimo: string;
  espacioReq: string;
  resistencia: string;
  facilidad: string;
  costo: string;
  huevosAnio: number;
  emoji: string;
  imagen: string;
}

export interface RecommendResult {
  raza: string;
  total: number;
  maxScore: number;
  motor: Motor;
  info: BreedInfo;
}

export const BREED_DATA: Record<string, BreedInfo> = {
  leghorn: {
    nombre: "Leghorn Blanca",
    descripcion:
      "Raza especializada en huevo blanco. Alta eficiencia con bajo consumo de alimento. Ideal para climas calidos secos. Activa y productiva.",
    proposito: "Huevo",
    climaOptimo: "Calido seco",
    espacioReq: "Mediano",
    resistencia: "Media",
    facilidad: "Media",
    costo: "Medio",
    huevosAnio: 280,
    emoji: "🐓",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Gallus_gallus_domesticus_-_Carole_Smile-Inachus.jpg/320px-Gallus_gallus_domesticus_-_Carole_Smile-Inachus.jpg",
  },
  rhode_island_red: {
    nombre: "Rhode Island Red",
    descripcion:
      "Raza de doble proposito muy versatil. Excelente para clima calido humedo como Cuichapa. Tranquila, resistente y facil de manejar para pequenos productores.",
    proposito: "Doble proposito",
    climaOptimo: "Calido humedo",
    espacioReq: "Mediano",
    resistencia: "Alta",
    facilidad: "Facil",
    costo: "Medio",
    huevosAnio: 200,
    emoji: "🐔",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Rhode_Island_Red_female.jpg/320px-Rhode_Island_Red_female.jpg",
  },
  cuello_desnudo: {
    nombre: "Cuello Desnudo",
    descripcion:
      "Perfectamente adaptada al calor humedo veracruzano. Su cuello desnudo regula la temperatura corporal. Muy resistente, bajo costo, espacio minimo.",
    proposito: "Doble proposito",
    climaOptimo: "Calido humedo",
    espacioReq: "Pequeno",
    resistencia: "Muy alta",
    facilidad: "Facil",
    costo: "Bajo",
    huevosAnio: 160,
    emoji: "🦤",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Naked_Neck_hen.jpg/320px-Naked_Neck_hen.jpg",
  },
  new_hampshire: {
    nombre: "New Hampshire",
    descripcion:
      "Especializada en carne con buena adaptacion al calor. Crecimiento rapido, buen temperamento. Requiere espacio amplio para desarrollo optimo.",
    proposito: "Carne",
    climaOptimo: "Calido seco",
    espacioReq: "Grande",
    resistencia: "Alta",
    facilidad: "Facil",
    costo: "Medio",
    huevosAnio: 180,
    emoji: "🍗",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/NewHampshireRooster.jpg/320px-NewHampshireRooster.jpg",
  },
  australorp: {
    nombre: "Australorp",
    descripcion:
      "Record mundial en produccion de huevo cafe. Muy tranquila y facil de manejar. Optima para climas templados. Requiere sombra en dias calurosos.",
    proposito: "Huevo",
    climaOptimo: "Templado",
    espacioReq: "Mediano",
    resistencia: "Alta",
    facilidad: "Facil",
    costo: "Medio",
    huevosAnio: 250,
    emoji: "🥚",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Australorp_chook.jpg/320px-Australorp_chook.jpg",
  },
  broiler: {
    nombre: "Pollo de Engorda (Broiler)",
    descripcion:
      "Ave de engorda lista en 6-7 semanas. Maxima produccion de carne en clima controlado. Requiere inversion alta y manejo tecnico especializado.",
    proposito: "Carne",
    climaOptimo: "Templado",
    espacioReq: "Grande",
    resistencia: "Baja",
    facilidad: "Media",
    costo: "Alto",
    huevosAnio: 0,
    emoji: "🍖",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Chicken_broiler.jpg/320px-Chicken_broiler.jpg",
  },
  isa_brown: {
    nombre: "ISA Brown",
    descripcion:
      "Hibrido comercial de alta produccion de huevo cafe (hasta 300/ano). Muy rentable. Requiere buena nutricion y cuidados. Ideal para produccion intensiva.",
    proposito: "Huevo",
    climaOptimo: "Calido seco",
    espacioReq: "Pequeno",
    resistencia: "Media",
    facilidad: "Facil",
    costo: "Alto",
    huevosAnio: 300,
    emoji: "🥚",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/ISA_Brown_hen.jpg/320px-ISA_Brown_hen.jpg",
  },
  criollo: {
    nombre: "Gallina Criolla",
    descripcion:
      "Aves locales perfectamente adaptadas al clima humedo de Cuichapa. Maxima rusticidad, costo minimo, cero dependencia de insumos. Ideal para autoconsumo.",
    proposito: "Doble proposito",
    climaOptimo: "Calido humedo",
    espacioReq: "Pequeno",
    resistencia: "Muy alta",
    facilidad: "Muy facil",
    costo: "Muy bajo",
    huevosAnio: 120,
    emoji: "🐣",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Chicken_in_the_yard.jpg/320px-Chicken_in_the_yard.jpg",
  },
  plymouth_rock: {
    nombre: "Plymouth Rock",
    descripcion:
      "Raza clasica de doble proposito. Temperamento tranquilo y adaptable. Optima para climas templados. Buena produccion de huevo y carne en granja familiar.",
    proposito: "Doble proposito",
    climaOptimo: "Templado",
    espacioReq: "Mediano",
    resistencia: "Alta",
    facilidad: "Facil",
    costo: "Medio",
    huevosAnio: 200,
    emoji: "🐓",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Barred_Rock_female_2.jpg/320px-Barred_Rock_female_2.jpg",
  },
};

let prologModule: any = null;

async function getProlog(): Promise<any> {
  if (prologModule) return prologModule;
  const mod = await import("tau-prolog");
  prologModule = (mod as any).default ?? mod;
  return prologModule;
}

function extractBindings(answer: any): { raza: string; total: number } | null {
  try {
    const links = answer?.substitution?.links ?? {};
    const razaTerm = links["Raza"];
    const totalTerm = links["Total"];
    if (!razaTerm || !totalTerm) return null;
    const raza =
      razaTerm.id !== undefined ? String(razaTerm.id) : String(razaTerm.value ?? "");
    const total =
      totalTerm.value !== undefined ? Number(totalTerm.value) : Number(totalTerm.id ?? 0);
    if (!raza || isNaN(total)) return null;
    return { raza, total };
  } catch {
    return null;
  }
}

export async function getRecommendations(
  objetivo: string,
  clima: string,
  espacio: string,
  presupuesto: string,
  experiencia: string
): Promise<RecommendResult[]> {
  // Try SWI-Prolog via API route first
  const swiResult = await trySwiplApi(objetivo, clima, espacio, presupuesto, experiencia);
  const motor: Motor = swiResult ? "SWI-Prolog" : "tau-prolog";

  if (swiResult) {
    return swiResult.results
      .map(({ raza, total }) => {
        const info = BREED_DATA[raza];
        return info ? { raza, total, maxScore: MAX_SCORE, motor, info } : null;
      })
      .filter(Boolean) as RecommendResult[];
  }

  // Fallback: tau-prolog (browser)
  const pl = await getProlog();

  return new Promise((resolve, reject) => {
    const session = pl.create(500000);

    session.consult(PROLOG_CODE, {
      success: () => {
        const queryStr = `recomendar(${objetivo}, ${clima}, ${espacio}, ${presupuesto}, ${experiencia}, Raza, Total).`;
        session.query(queryStr, {
          success: () => {
            const results: RecommendResult[] = [];

            function getNext() {
              session.answer({
                success: (answer: any) => {
                  const binding = extractBindings(answer);
                  if (binding) {
                    const info = BREED_DATA[binding.raza];
                    if (info) {
                      results.push({
                        raza: binding.raza,
                        total: binding.total,
                        maxScore: MAX_SCORE,
                        motor,
                        info,
                      });
                    }
                  }
                  getNext();
                },
                fail: () => {
                  resolve(results.sort((a, b) => b.total - a.total));
                },
                error: (err: any) => reject(new Error(String(err))),
                limit: () => {
                  resolve(results.sort((a, b) => b.total - a.total));
                },
              });
            }

            getNext();
          },
          error: (err: any) => reject(new Error(String(err))),
        });
      },
      error: (err: any) => reject(new Error(String(err))),
    });
  });
}
