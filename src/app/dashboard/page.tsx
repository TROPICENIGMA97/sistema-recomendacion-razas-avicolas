import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavBar from "@/components/NavBar";
import RecommendHistory from "@/components/RecommendHistory";
import ValidationPanel from "@/components/ValidationPanel";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: recs }, { count: reviewCount }] = await Promise.all([
    supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("breed_reviews")
      .select("*", { count: "exact", head: true }),
  ]);

  const nombre =
    (user.user_metadata?.nombre as string) ||
    user.email?.split("@")[0] ||
    "Usuario";

  return (
    <div className="min-h-screen bg-[#f6fbf0]">
      <NavBar email={user.email} nombre={nombre} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Encabezado */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-campo-900">
              Hola, {nombre}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sistema de recomendacion avicola — Cuichapa, Veracruz
            </p>
          </div>
          <Link
            href="/dashboard/nueva"
            className="px-5 py-2.5 rounded-xl bg-campo-600 hover:bg-campo-700 text-white font-black text-sm transition-colors shadow"
          >
            + Nueva consulta Prolog
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-campo-100 flex items-center justify-center text-2xl shrink-0">
              🧠
            </div>
            <div>
              <p className="text-2xl font-black text-campo-900">
                {recs?.length ?? 0}
              </p>
              <p className="text-sm text-gray-500">Consultas Prolog</p>
            </div>
          </div>

          <Link
            href="/dashboard/comunidad"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-campo-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-tierra-100 flex items-center justify-center text-2xl shrink-0">
              💬
            </div>
            <div className="flex-1">
              <p className="text-2xl font-black text-campo-900">
                {reviewCount ?? 0}
              </p>
              <p className="text-sm text-gray-500">Opiniones comunidad</p>
            </div>
            <span className="text-campo-400 group-hover:text-campo-600 transition-colors">→</span>
          </Link>

          <Link
            href="/dashboard/nueva"
            className="bg-campo-800 rounded-2xl p-5 flex items-center gap-4 hover:bg-campo-900 transition-colors group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
              🐔
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">Nueva recomendacion</p>
              <p className="text-campo-300 text-xs mt-0.5">Motor Prolog activo</p>
            </div>
          </Link>
        </div>

        {/* Historial CRUD */}
        <section>
          <h2 className="text-lg font-black text-campo-900 mb-4">
            Historial de consultas
          </h2>
          <RecommendHistory initial={recs ?? []} userId={user.id} />
        </section>

        {/* Validacion del sistema — OE6 */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🔬</span>
            <div>
              <h2 className="text-lg font-black text-campo-900">
                Validacion del sistema
              </h2>
              <p className="text-xs text-gray-400">
                Objetivo especifico 6 — Evaluacion de desempeno y precision del motor Prolog
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ValidationPanel />
          </div>
        </section>

      </main>
    </div>
  );
}
