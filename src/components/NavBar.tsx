"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  email?: string;
  nombre?: string;
}

export default function NavBar({ email, nombre }: Props) {
  const pathname = usePathname();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const navLink = (href: string, label: string) => {
    const active =
      href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
          ${
            active
              ? "bg-white/20 text-white"
              : "text-campo-200 hover:text-white hover:bg-white/10"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-campo-800 text-white shadow-md sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 mr-2 shrink-0">
          <span className="text-2xl">🐔</span>
          <div className="hidden sm:block">
            <p className="text-sm font-black leading-tight">Sistema Avicola</p>
            <p className="text-campo-300 text-xs leading-tight">Cuichapa, Veracruz</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 flex-1">
          {navLink("/dashboard", "Mis Recomendaciones")}
          {navLink("/dashboard/comunidad", "Comunidad")}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard/nueva"
            className="px-3 py-1.5 rounded-lg bg-tierra-400 hover:bg-tierra-500 text-tierra-900 text-xs font-black transition-colors shadow"
          >
            + Nueva
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-campo-200 border-l border-campo-600 pl-3 ml-1">
            <span>👤</span>
            <span className="truncate max-w-[100px]">{nombre || email}</span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg border border-campo-500 hover:bg-campo-700 text-xs font-medium transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
