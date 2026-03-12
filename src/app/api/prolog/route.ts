import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { PROLOG_CODE } from "@/lib/prologCode";
import { createClient } from "@/lib/supabase/server";

const VALID = {
  objetivo:    new Set(["huevo", "carne", "doble_proposito"]),
  clima:       new Set(["calido_humedo", "calido_seco", "templado"]),
  espacio:     new Set(["pequeno", "mediano", "grande"]),
  presupuesto: new Set(["bajo", "medio", "alto"]),
  experiencia: new Set(["principiante", "intermedio", "experto"]),
} as const;

const SWIPL_PATHS = [
  "swipl",
  "C:\\Program Files\\swipl\\bin\\swipl.exe",
  "C:\\Program Files (x86)\\swipl\\bin\\swipl.exe",
];

function buildQuery(
  objetivo: string,
  clima: string,
  espacio: string,
  presupuesto: string,
  experiencia: string
): string {
  return (
    PROLOG_CODE.replace(/`/g, "") +
    `\n:- initialization(run, main).\nrun :- ` +
    `forall(recomendar(${objetivo},${clima},${espacio},${presupuesto},${experiencia},R,T), ` +
    `(write(R), write('-'), write(T), nl)), halt.\n`
  );
}

function runSwipl(
  plFile: string,
  pathIdx: number
): Promise<{ raza: string; total: number }[]> {
  return new Promise((resolve, reject) => {
    if (pathIdx >= SWIPL_PATHS.length) {
      reject(new Error("SWI-Prolog no encontrado"));
      return;
    }

    const proc = spawn(SWIPL_PATHS[pathIdx], ["-q", plFile], {
      timeout: 8000,
      windowsHide: true,
    });

    let out = "";
    proc.stdout.on("data", (d: Buffer) => (out += d.toString()));
    proc.on("error", () => {
      runSwipl(plFile, pathIdx + 1)
        .then(resolve)
        .catch(reject);
    });
    proc.on("close", (code) => {
      if (code !== 0 && !out.trim()) {
        runSwipl(plFile, pathIdx + 1)
          .then(resolve)
          .catch(reject);
        return;
      }
      const results = out
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [raza, t] = line.split("-");
          return { raza: raza?.trim() ?? "", total: parseInt(t?.trim() ?? "0") };
        })
        .filter((r) => r.raza && !isNaN(r.total));
      resolve(results);
    });
  });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
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

  const { objetivo, clima, espacio, presupuesto, experiencia } = body;

  const plContent = buildQuery(objetivo, clima, espacio, presupuesto, experiencia);
  const tmpFile = join(tmpdir(), `aves_${Date.now()}.pl`);

  try {
    writeFileSync(tmpFile, plContent, "utf8");
    const results = await runSwipl(tmpFile, 0);
    return NextResponse.json({
      results: results.sort((a, b) => b.total - a.total),
      motor: "SWI-Prolog",
    });
  } catch {
    return NextResponse.json(
      { error: "Motor de inferencia no disponible en este momento." },
      { status: 503 }
    );
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}
