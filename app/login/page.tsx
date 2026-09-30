import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { ShieldCheck, TrendingUp, WalletCards, ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Welcome Showcase Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950 border border-emerald-500/20 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[440px]">
            {/* Ambient emerald blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[90px] pointer-events-none -z-0" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-6">
                <Lock size={13} /> SECURE LOGIN
              </span>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug mb-4 tracking-tight">
                Welcome back to your team finance cockpit.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Log in to review pending expenses, approve team requests, and track your monthly budget live.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Role Separation</h3>
                    <p className="text-xs text-slate-400">Strict member vs admin permissions & approvals</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Real-Time Spend</h3>
                    <p className="text-xs text-slate-400">Instant visibility into team expenditures</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80">
              <p className="text-xs text-slate-400">
                Need to create a new team workspace?{" "}
                <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1">
                  Sign up here <ArrowRight size={12} />
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side: Login Form Card */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-sm">
            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <WalletCards size={20} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to TeamBudget</h1>
              <p className="text-sm text-slate-400 mt-1">Enter your credentials below to access your account.</p>
            </div>

            <AuthForm mode="login" />

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                Don&apos;t have an account yet?{" "}
                <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}