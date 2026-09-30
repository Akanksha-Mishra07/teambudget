"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useTeam } from "@/context/TeamContext";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { refreshTeam } = useTeam();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    }

    setSubmitting(true);

    const { data: authData, error: authError } =
      mode === "signup"
        ? await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              invite_code: inviteCode.trim(),
            },
          },
        })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (authError) {
      setSubmitting(false);
      if (authError.message.toLowerCase().includes("email not confirmed")) {
        setError("Please confirm your email before logging in. Check your inbox.");
      } else {
        setError(authError.message);
      }
      return;
    }

    // Signup: email confirmation is ON, so no active session yet
    if (mode === "signup") {
      if (!authData.session) {
        setSubmitting(false);
        setError(""); // clear any old error
        setInfoMessage("Check your email to confirm your account, then log in.");
        return; // stop here — do not redirect, do not create team yet
      }
    }

    setSubmitting(false);
    router.push("/dashboard");
  };

  const inputClass =
    "w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3.5 py-2.5 mt-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition text-sm";
  const labelClass = "text-xs font-semibold uppercase tracking-wider text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {mode === "signup" && (
        <div>
          <label className={labelClass}>Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Jane Doe"
            autoComplete="name"
            required
          />
        </div>
      )}
      <div>
        <label className={labelClass}>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Password</label>
          {mode === "login" && (
            <Link
              href="/forgot-password"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition underline-offset-2 hover:underline"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="••••••••"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
        />
      </div>
      {mode === "signup" && (
        <>
          <div>
            <label className={labelClass}>Confirm password</label>
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
          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass}>Invite code</label>
              <span className="text-[11px] text-slate-500">Optional</span>
            </div>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className={inputClass}
              placeholder="Paste code or leave blank to create team"
            />
          </div>
        </>
      )}
      {successMessage && (
        <div className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2.5 rounded-lg leading-relaxed">
          {successMessage}
        </div>
      )}
      {infoMessage && <p className="text-sm text-green-500">{infoMessage}</p>}
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
        {submitting ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
      </button>
    </form>
  );
}