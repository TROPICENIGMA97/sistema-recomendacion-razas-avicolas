import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NavBar from "@/components/NavBar";
import BreedReviewFeed from "@/components/BreedReviewFeed";

export const dynamic = "force-dynamic";

export default async function ComunidadPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: reviews } = await supabase
    .from("breed_reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const nombre =
    (user.user_metadata?.nombre as string) ||
    user.email?.split("@")[0] ||
    "Usuario";

  return (
    <div className="min-h-screen bg-[#f6fbf0]">
      <NavBar email={user.email} nombre={nombre} />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-campo-900">
            Comunidad Avicola
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Opiniones y experiencias reales de productores de Cuichapa, Veracruz
          </p>
        </div>

        <BreedReviewFeed
          initial={reviews ?? []}
          userId={user.id}
          userName={nombre}
        />
      </main>
    </div>
  );
}
