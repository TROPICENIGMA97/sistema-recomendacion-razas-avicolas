"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  mode: "login" | "register";
}

function translateError(msg: string): string {
  if (msg.includes("Invalid login credentials"))
    return "Correo o contrasena incorrectos. Verifica tus datos.";
  if (msg.includes("Email not confirmed"))
    return "Debes confirmar tu correo antes de iniciar sesion. Revisa tu bandeja de entrada (incluye spam).";
  if (msg.includes("User already registered"))
    return "Este correo ya tiene una cuenta. Inicia sesion.";
  if (msg.includes("Password should be at least"))
    return "La contrasena debe tener al menos 6 caracteres.";
  if (msg.includes("Unable to validate email"))
    return "Correo electronico no valido.";
  if (msg.includes("rate limit") || msg.includes("over_email_send_rate_limit"))
    return "Demasiados intentos. Espera un momento e intenta de nuevo.";
  if (msg.includes("signup_disabled"))
    return "El registro esta desactivado temporalmente.";
  return msg;
}

export default function AuthForm({ mode }: Props) {
  const supabase = createClient();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nombre: name } },
        });
        if (signUpError) throw signUpError;

        if (!data.session) {
          setEmailSent(true);
          setLoading(false);
          return;
        }
        window.location.href = "/dashboard";
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(translateError(msg));
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-5xl">📧</div>
        <h3 className="font-black text-gray-800 text-lg">
          Revisa tu correo
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Enviamos un enlace de confirmacion a{" "}
          <strong className="text-gray-700">{email}</strong>.
          <br />
          Abrelo y luego inicia sesion aqui.
        </p>
        <button
          onClick={() => setEmailSent(false)}
          className="text-campo-600 hover:text-campo-700 text-sm font-semibold underline"
        >
          Volver al inicio de sesion
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "register" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Nombre completo
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-campo-500 focus:ring-2 focus:ring-campo-200 outline-none text-sm transition-colors"
            placeholder="Juan Lopez"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Correo electronico
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-campo-500 focus:ring-2 focus:ring-campo-200 outline-none text-sm transition-colors"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Contrasena
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-campo-500 focus:ring-2 focus:ring-campo-200 outline-none text-sm transition-colors"
          placeholder="Minimo 6 caracteres"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm font-medium leading-relaxed">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-campo-600 hover:bg-campo-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-black transition-colors shadow text-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Procesando...
          </span>
        ) : mode === "login" ? (
          "Iniciar sesion"
        ) : (
          "Crear cuenta"
        )}
      </button>
    </form>
  );
}
