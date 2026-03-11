import { PROLOG_CODE, MAX_SCORE } from "./prologCode";

export interface BreedInfo {
  nombre: string;
  descripcion: string;
  proposito: string;
  toleranciaCalor: string;
  resistencia: string;
  facilidad: string;
  costo: string;
  huevosAnio: number;
  emoji: string;
}

export interface RecommendResult {
  raza: string;
  total: number;
  maxScore: number;
  info: BreedInfo;
}

export const BREED_DATA: Record<string, BreedInfo> = {
  leghorn: {
    nombre: "Leghorn Blanca",
    descripcion:
      "Raza especializada en produccion de huevo blanco. Muy eficiente con bajo consumo de alimento. Excelente adaptacion al calor de Veracruz. Temperamento activo, ideal para produccion comercial de huevo.",
    proposito: "Huevo",
    toleranciaCalor: "Alta",
    resistencia: "Media",
    facilidad: "Media",
    costo: "Medio",
    huevosAnio: 280,
    emoji: "🐓",
  },
  rhode_island_red: {
    nombre: "Rhode Island Red",
    descripcion:
      "Raza de doble proposito muy versatil y adaptable al clima calido. Excelente opcion para pequenos productores de Cuichapa. Temperamento tranquilo, muy facil de manejar y resistente a enfermedades tropicales.",
    proposito: "Doble proposito",
    toleranciaCalor: "Alta",
    resistencia: "Alta",
    facilidad: "Facil",
    costo: "Medio",
    huevosAnio: 200,
    emoji: "🐔",
  },
  cuello_desnudo: {
    nombre: "Cuello Desnudo",
    descripcion:
      "Perfectamente adaptada al calor veracruzano. Su cuello sin plumas le ayuda a regular la temperatura corporal. Muy resistente a enfermedades, bajo costo de adquisicion y minimo mantenimiento. Ideal para Cuichapa.",
    proposito: "Doble proposito",
    toleranciaCalor: "Muy alta",
    resistencia: "Muy alta",
    facilidad: "Facil",
    costo: "Bajo",
    huevosAnio: 160,
    emoji: "🦤",
  },
  new_hampshire: {
    nombre: "New Hampshire",
    descripcion:
      "Especializada en produccion de carne con buena adaptacion al calor. Crecimiento rapido y buen temperamento para cria familiar. Buena opcion para venta de carne en mercados locales de Cuichapa.",
    proposito: "Carne",
    toleranciaCalor: "Alta",
    resistencia: "Alta",
    facilidad: "Facil",
    costo: "Medio",
    huevosAnio: 180,
    emoji: "🍗",
  },
  australorp: {
    nombre: "Australorp",
    descripcion:
      "Raza australiana con record mundial de produccion de huevo cafe. Muy tranquila y facil de manejar, ideal para principiantes. Requiere algo de sombra en dias muy calurosos pero produce excelentes resultados.",
    proposito: "Huevo",
    toleranciaCalor: "Media",
    resistencia: "Alta",
    facilidad: "Facil",
    costo: "Medio",
    huevosAnio: 250,
    emoji: "🥚",
  },
  broiler: {
    nombre: "Pollo de Engorda (Broiler)",
    descripcion:
      "Ave de engorda comercial lista en 6-7 semanas. Maxima produccion de carne pero requiere manejo intensivo, buena alimentacion balanceada y atencion veterinaria constante. Excelente retorno de inversion.",
    proposito: "Carne",
    toleranciaCalor: "Baja",
    resistencia: "Baja",
    facilidad: "Media",
    costo: "Alto",
    huevosAnio: 0,
    emoji: "🍖",
  },
  isa_brown: {
    nombre: "ISA Brown",
    descripcion:
      "Hibrido comercial de alta produccion de huevo cafe (hasta 300 huevos/ano). Muy rentable pero requiere buena nutricion y cuidados constantes. Excelente opcion para produccion comercial en Veracruz.",
    proposito: "Huevo",
    toleranciaCalor: "Alta",
    resistencia: "Media",
    facilidad: "Facil",
    costo: "Alto",
    huevosAnio: 300,
    emoji: "🥚",
  },
  criollo: {
    nombre: "Gallina Criolla",
    descripcion:
      "Aves criollas locales perfectamente adaptadas al clima y condiciones de Cuichapa. Maxima rusticidad, minimo costo y cero dependencia de insumos especializados. Ideal para autoconsumo familiar y primeros pasos en avicultura.",
    proposito: "Doble proposito",
    toleranciaCalor: "Muy alta",
    resistencia: "Muy alta",
    facilidad: "Muy facil",
    costo: "Muy bajo",
    huevosAnio: 120,
    emoji: "🐣",
  },
  plymouth_rock: {
    nombre: "Plymouth Rock",
    descripcion:
      "Raza clasica americana de doble proposito. Temperamento tranquilo, productiva y adaptable. Perfecta para la granja familiar veracruzana. Buena produccion tanto de huevo como de carne.",
    proposito: "Doble proposito",
    toleranciaCalor: "Media",
    resistencia: "Alta",
    facilidad: "Facil",
    costo: "Medio",
    huevosAnio: 200,
    emoji: "🐓",
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
      razaTerm.id !== undefined
        ? String(razaTerm.id)
        : String(razaTerm.value ?? "");
    const total =
      totalTerm.value !== undefined
        ? Number(totalTerm.value)
        : Number(totalTerm.id ?? 0);
    if (!raza || isNaN(total)) return null;
    return { raza, total };
  } catch {
    return null;
  }
}

export async function getRecommendations(
  objetivo: string,
  presupuesto: string,
  experiencia: string,
  alimentacion: string
): Promise<RecommendResult[]> {
  const pl = await getProlog();

  return new Promise((resolve, reject) => {
    const session = pl.create(500000);

    session.consult(PROLOG_CODE, {
      success: () => {
        const queryStr = `recomendar(${objetivo}, ${presupuesto}, ${experiencia}, ${alimentacion}, Raza, Total).`;
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
                        info,
                      });
                    }
                  }
                  getNext();
                },
                fail: () => {
                  resolve(results.sort((a, b) => b.total - a.total));
                },
                error: (err: any) => {
                  reject(new Error(String(err)));
                },
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
