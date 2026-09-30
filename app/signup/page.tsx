import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { Users, CheckCircle2, Zap, ArrowRight, UserPlus } from "lucide-react";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Onboarding Perks Showcase Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-teal-950/40 via-slate-900/90 to-amber-950/20 border border-teal-500/20 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
            {/* Ambient teal & amber blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[90px] pointer-events-none -z-0" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 blur-[90px] pointer-events-none -z-0" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3.5 py-1.5 rounded-full mb-6">
                <UserPlus size={13} /> TEAM ONBOARDING
              </span>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug mb-4 tracking-tight">
                Empower your team to manage budgets seamlessly.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Create a team to become the admin automatically, or enter an invite code to join your coworkers.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Instant Admin Setup</h3>
                    <p className="text-xs text-slate-400">Your team workspace is provisioned immediately upon signup</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0 mt-0.5">
                    <Zap size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Fast Expense Submission</h3>
                    <p className="text-xs text-slate-400">Log expenditures in under a minute from any device</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0 mt-0.5">
                    <Users size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Team Invite Codes</h3>
                    <p className="text-xs text-slate-400">Invite colleagues with a single code — no complex invites</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                ✨ Free for student & small teams • No credit card required
              </span>
            </div>
          </div>

          {/* Right Side: Signup Form Card */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-sm">
            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
                <Users size={20} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
              <p className="text-sm text-slate-400 mt-1">Get started with TeamBudget in less than two minutes.</p>
            </div>

            <AuthForm mode="signup" />

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline inline-flex items-center gap-1">
                  Log in <ArrowRight size={14} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}