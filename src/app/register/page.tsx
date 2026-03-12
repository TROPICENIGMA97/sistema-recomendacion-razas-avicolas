import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-campo-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-tierra-500/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-campo-500/25 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-7">
        <div className="text-center text-white space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg">
            <span className="text-5xl">🐔</span>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Sistema Avicola</h1>
            <p className="text-campo-300 text-sm mt-1">Crea tu cuenta de productor avicola</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div>
            <h2 className="text-xl font-black text-gray-900">Crear cuenta</h2>
            <p className="text-gray-400 text-sm mt-0.5">Unete a la comunidad de Cuichapa</p>
          </div>
          <AuthForm mode="register" />
          <p className="text-center text-sm text-gray-500">
            Ya tienes cuenta?{" "}
            <Link href="/login" className="text-campo-600 hover:text-campo-700 font-bold transition-colors">
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
