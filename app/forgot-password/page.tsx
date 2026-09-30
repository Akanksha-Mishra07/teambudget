"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { KeyRound, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setSubmitting(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (resetError) {
        // For generic rate-limit or network errors
        console.error("Password reset error:", resetError.message);
      }

      // Always show generic success confirmation message for user enumeration protection
      setSubmitted(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      setSubmitted(true);
    } finally {
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
        <div className="w-full max-w-md mb-3">
          <Link
            href="/login"
            className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl backdrop-blur-sm">
          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <KeyRound size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Forgot password?</h1>
            <p className="text-sm text-slate-400 mt-1">
              Enter your account email and we&apos;ll send you instructions to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Check your inbox</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If an account exists for <strong className="text-white">{email}</strong>, a password reset link has been sent. Follow the instructions in the email to set a new password.
                </p>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-5 py-2.5 transition shadow-lg shadow-emerald-950/50 inline-block text-sm w-full"
                >
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
              <div>
                <label className={labelClass}>Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                  <Mail
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none mt-0.5"
                  />
                </div>
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
                {submitting ? "Sending link..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
