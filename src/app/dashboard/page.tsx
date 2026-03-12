import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavBar from "@/components/NavBar";
import RecommendHistory from "@/components/RecommendHistory";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: recs } = await supabase
    .from("recommendations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const nombre = user.user_metadata?.nombre as string | undefined;

  return (
    <div className="min-h-screen bg-[#f6fbf0]">
      <NavBar email={user.email} nombre={nombre} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-campo-900">
              Mis Recomendaciones
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Historial de consultas al motor de inferencia Prolog
            </p>
          </div>
          <Link
            href="/dashboard/nueva"
            className="px-5 py-2.5 rounded-xl bg-campo-600 hover:bg-campo-700 text-white font-semibold text-sm transition-colors shadow"
          >
            + Nueva consulta
          </Link>
        </div>

        <RecommendHistory initial={recs ?? []} userId={user.id} />
      </main>
    </div>
  );
}
