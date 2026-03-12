"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  email?: string;
  nombre?: string;
}

export default function NavBar({ email, nombre }: Props) {
  const router   = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-campo-800 text-white shadow-md sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl">🐔</span>
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-bold leading-tight truncate">
              Sistema Avicola — Cuichapa, Veracruz
            </p>
            <p className="text-campo-300 text-xs">Motor Prolog</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard/nueva"
            className="px-3 py-1.5 rounded-lg bg-tierra-400 hover:bg-tierra-500 text-tierra-900 text-xs font-bold transition-colors">
            + Nueva
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-campo-200">
            <span>👤</span>
            <span className="truncate max-w-[120px]">{nombre || email}</span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg border border-campo-500 hover:bg-campo-700 text-xs font-medium transition-colors">
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
