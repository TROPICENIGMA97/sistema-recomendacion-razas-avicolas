import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f6fbf0] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-5xl">🐔</span>
          <h1 className="text-2xl font-bold text-campo-900">Sistema Avicola</h1>
          <p className="text-gray-500 text-sm">Cuichapa, Veracruz — Ingresa a tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7">
          <h2 className="text-lg font-bold text-campo-800 mb-5">Iniciar sesion</h2>
          <AuthForm mode="login" />
          <p className="text-center text-sm text-gray-500 mt-5">
            No tienes cuenta?{" "}
            <Link href="/register" className="text-campo-600 hover:underline font-medium">
              Registrate aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
