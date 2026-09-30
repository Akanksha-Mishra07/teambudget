"use client";

import { Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";

export default function Footer() {
  const { session } = useAuth();
  const { role } = useTeam();

  const linkClass = "text-sm text-slate-400 hover:text-emerald-400 transition";
  const headingClass = "text-xs font-semibold tracking-wider text-slate-300 uppercase mb-4";

  return (
    <footer className="border-t border-slate-800 bg-[#070b14] mt-16">
      <div className="max-w-6xl mx-auto px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <a href="/" className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <Wallet size={18} className="text-emerald-400" />
            </span>
            <span className="font-semibold text-lg text-white">
              Team<span className="text-emerald-400">Budget</span>
            </span>
          </a>
          <p className="text-sm text-slate-400 mt-4 max-w-sm">
            Submit, approve and track your team&apos;s expenses against budget —
            one place, no spreadsheets.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>Product</h4>
          <ul className="flex flex-col gap-3">
            <li><a href="/" className={linkClass}>Home</a></li>
            <li><a href="/#features" className={linkClass}>Features</a></li>
            <li><a href="/#how-it-works" className={linkClass}>How it works</a></li>
          </ul>
        </div>

        <div>
          <h4 className={headingClass}>Account</h4>
          <ul className="flex flex-col gap-3">
            {session ? (
              <>
                <li><a href="/dashboard" className={linkClass}>Dashboard</a></li>
                <li><a href="/expenses" className={linkClass}>My expenses</a></li>
                <li><a href="/expenses/add" className={linkClass}>Add expense</a></li>
                <li><a href="/analytics" className={linkClass}>Analytics</a></li>
                {role === "admin" && (
                  <>
                    <li><a href="/expenses/approvals" className={linkClass}>Approvals</a></li>
                    <li><a href="/team/settings" className={linkClass}>Team settings</a></li>
                  </>
                )}
              </>
            ) : (
              <>
                <li><a href="/login" className={linkClass}>Login</a></li>
                <li><a href="/signup" className={linkClass}>Sign up</a></li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TeamBudget. All rights reserved.</p>
          <p>Built with Next.js, TypeScript &amp; Supabase</p>
        </div>
      </div>
    </footer>
  );
}