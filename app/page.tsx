import Link from "next/link";
import Navbar from "@/components/Navbar";
import { WalletCards, ShieldCheck, Zap, TrendingUp, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 md:px-8 pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950/40 px-6 md:px-12 py-20 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none -z-0" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full mb-6">
              <WalletCards size={14} /> TEAM EXPENSE TRACKING, SIMPLIFIED
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 tracking-tight">
              Stop chasing receipts.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Let your team track spend for you.
              </span>
            </h1>
            <p className="text-slate-300 max-w-xl mx-auto mb-9 text-base md:text-lg leading-relaxed">
              TeamBudget lets members submit expenses in seconds, gives admins a
              one-click approval flow, and shows your whole team&apos;s spend
              against budget — live.
            </p>
            <div className="flex justify-center gap-4 flex-wrap items-center">
              <Link
                href="/signup"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 flex items-center gap-2"
              >
                Get started free <ArrowRight size={16} />
              </Link>
              
              <a
                href="#how-it-works"
                className="border border-slate-700 text-slate-200 px-6 py-3.5 rounded-xl font-medium hover:bg-slate-800/60 hover:text-white transition"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="px-6 md:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            How TeamBudget works
          </h2>
          <p className="text-slate-400">
            From signup to approval in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { n: "1", title: "Create your team", desc: "Sign up and you become the admin automatically — no setup needed." },
            { n: "2", title: "Invite your members", desc: "Share your team's invite code so colleagues can join in seconds." },
            { n: "3", title: "Submit & approve", desc: "Members log expenses, admins approve with one click, budgets stay on track." },
          ].map((step) => (
            <div key={step.n} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-7 hover:border-slate-700 transition">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm mb-4">
                {step.n}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 md:px-8 py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { icon: Zap, title: "Instant tracking", desc: "Log an expense in under a minute", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            { icon: TrendingUp, title: "Live budgets", desc: "See spend vs budget in real time", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            { icon: ShieldCheck, title: "Role-based access", desc: "Admins and members, kept separate", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
            { icon: Users, title: "Built for teams", desc: "One dashboard for the whole team", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
          ].map((f) => (
            <div key={f.title} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center hover:border-slate-700 transition">
              <div className={`w-11 h-11 mx-auto flex items-center justify-center rounded-xl border ${f.color} mb-3.5`}>
                <f.icon size={20} />
              </div>
              <h3 className="text-white text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-8 py-16 mt-auto">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-teal-950/30 border border-emerald-500/20 rounded-3xl px-8 py-14 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to ditch the spreadsheet?
          </h2>
          <p className="text-slate-300 mb-8">Set up your team in under two minutes.</p>
          
          <Link
            href="/signup"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-emerald-950/50 inline-flex items-center gap-2"
          >
            Create your team <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}