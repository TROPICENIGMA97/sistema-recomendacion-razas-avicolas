import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NavBar from "@/components/NavBar";
import RecommendationForm from "@/components/RecommendationForm";

export const dynamic = "force-dynamic";

export default async function NuevaPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const nombre = user.user_metadata?.nombre as string | undefined;

  return (
    <div className="min-h-screen bg-[#f6fbf0]">
      <NavBar email={user.email} nombre={nombre} />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-campo-900">
            Nueva Recomendacion
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Responde 5 preguntas para que el motor Prolog recomiende la raza ideal para tu granja en Cuichapa
          </p>
        </div>

        <RecommendationForm userId={user.id} />
      </main>
    </div>
  );
}
