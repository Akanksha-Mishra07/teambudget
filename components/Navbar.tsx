"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { WalletCards, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { session } = useAuth();
  const { role } = useTeam();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const displayName = session?.user?.user_metadata?.full_name || session?.user?.email;

  const navLink = "text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition px-3 py-2 rounded-lg font-medium";

  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 py-3.5 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800">
      <Link href="/" className="flex items-center gap-2.5 group">
        <span className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-emerald-400 group-hover:bg-emerald-500/20 transition">
          <WalletCards size={20} />
        </span>
        <span className="font-bold text-lg text-white tracking-tight">
          Team<span className="text-emerald-400">Budget</span>
        </span>
      </Link>

      <div className="flex gap-1.5 md:gap-2 items-center">
        {session ? (
          <>
            <Link href="/dashboard" className={navLink}>Dashboard</Link>
            <Link href="/expenses" className={navLink}>My expenses</Link>
            <a href="/analytics" className={navLink}>Analytics</a>
            {role === "admin" && (
              <Link href="/expenses/approvals" className={navLink}>
                Approvals
              </Link>
            )}
            {role === "admin" && (
              <a href="/team/settings" className={navLink}>
                Team settings
              </a>
            )}
            {role === "admin" && (
              <a href="/team/members" className={navLink}>
                Members
              </a>
            )}
            <Link href="/expenses/add" className="text-sm bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition px-3 py-1.5 rounded-lg font-medium">
              + Add expense
            </Link>


            <div className="relative ml-2">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-slate-200 font-medium px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition"
              >
                <span className="max-w-[120px] truncate">{displayName}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-30">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/#features" className={navLink}>Features</Link>
            <Link href="/#how-it-works" className={navLink}>How it works</Link>
            <Link href="/login" className={navLink}>Login</Link>
            
            <Link
              href="/signup"
              className="ml-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition shadow-md shadow-emerald-950/40"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}