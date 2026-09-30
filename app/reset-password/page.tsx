"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setSubmitting(false);

      // Sign out to ensure clean login with the new password
      await supabase.auth.signOut();

      // Redirect to login after 2.5 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An unexpected error occurred. Please try requesting a new reset link.");
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3.5 py-2.5 mt-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition text-sm";
  const labelClass = "text-xs font-semibold uppercase tracking-wider text-slate-300";

  return (
    <main className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl backdrop-blur-sm">
          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <Lock size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Set new password</h1>
            <p className="text-sm text-slate-400 mt-1">
              Choose a secure password for your TeamBudget account.
            </p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Password updated!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your password has been reset successfully. Redirecting you to the login page...
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-5 py-2.5 transition shadow-lg shadow-emerald-950/50 inline-flex items-center justify-center gap-2 text-sm w-full"
                >
                  Proceed to login <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
              <div>
                <label className={labelClass}>New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-2.5 mt-2 transition shadow-lg shadow-emerald-950/50 cursor-pointer text-sm"
              >
                {submitting ? "Updating password..." : "Update password"}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-slate-400 hover:text-emerald-400 transition"
                >
                  Cancel and return to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
