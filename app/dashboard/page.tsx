"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import ExpenseTable from "@/components/ExpenseTable";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import { Expense } from "@/types/expense";
import { Copy, Check, Users, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { team, role } = useTeam();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login");
    }
  }, [authLoading, session, router]);

  useEffect(() => {
    async function fetchExpenses() {
      const { data, error } = await supabase.from("expenses").select("*");
      if (!error && data) {
        setExpenses(data as Expense[]);
      }
      setLoading(false);
    }
    if (session) fetchExpenses();
  }, [session]);

  useEffect(() => {
    if (!team) return;

    const channel = supabase
      .channel("dashboard-expenses")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses", filter: `team_id=eq.${team.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setExpenses((prev) => [payload.new as Expense, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setExpenses((prev) =>
              prev.map((e) => (e.id === payload.new.id ? (payload.new as Expense) : e))
            );
          } else if (payload.eventType === "DELETE") {
            setExpenses((prev) => prev.filter((e) => e.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [team]);

  const copyInviteCode = () => {
    if (team?.invite_code) {
      navigator.clipboard.writeText(team.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const total = expenses.length;
  const approved = expenses.filter((e) => e.status === "Approved").length;
  const pending = expenses.filter((e) => e.status === "Pending").length;
  const rejected = expenses.filter((e) => e.status === "Rejected").length;
  const approvedTotal = expenses.filter((e) => e.status === "Approved")
  .reduce((sum, e) => sum + e.amount, 0);
  const budget = team?.monthly_budget ?? 0;
  const remaining = budget - approvedTotal;
  const percentUsed = budget > 0 ? Math.min((approvedTotal / budget) * 100, 100) : 0;

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#0b0f17] text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-slate-400">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f17] text-slate-100 pb-16">
      <Navbar />
      <section className="px-6 md:px-8 py-10 max-w-5xl mx-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800/90 rounded-2xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {role === "admin" ? "Admin Workspace" : "Member Workspace"}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {team?.name || "Team"} Dashboard
            </h1>

          {budget > 0 && (
          <div className="border rounded-md p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Budget used: ₹{approvedTotal.toLocaleString()} / ₹{budget.toLocaleString()}</span>
              <span className={remaining < 0 ? "text-red-600" : "text-gray-600"}>
                {remaining < 0 ? `₹${Math.abs(remaining).toLocaleString()} over budget` : `₹${remaining.toLocaleString()} remaining`}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${percentUsed >= 100 ? "bg-red-600" : "bg-black"}`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>
        )}

            <p className="text-slate-400 text-sm mt-1">
              Track and manage your team&apos;s spending in real time.
            </p>
          </div>

          {role === "admin" && team?.invite_code && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center gap-3 self-start md:self-auto">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-emerald-400" />
                <div className="text-xs">
                  <span className="text-slate-400 block font-medium">Invite Code</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm">{team.invite_code}</span>
                </div>
              </div>
              <button
                onClick={copyInviteCode}
                title="Copy Invite Code"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>

        {/* Admin Pending Approvals Notice */}
        {role === "admin" && pending > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <p className="text-sm text-amber-200">
                You have <strong className="text-white font-bold">{pending}</strong> pending {pending === 1 ? "expense" : "expenses"} awaiting approval.
              </p>
            </div>
            <Link
              href="/expenses/approvals"
              className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              Review approvals <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total expenses" value={total} />
          <StatCard label="Approved" value={approved} accent="success" />
          <StatCard label="Pending" value={pending} accent="warning" />
          <StatCard label="Rejected" value={rejected} accent="danger" />
        </div>

        {/* Recent Expenses Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent expenses</h2>
          </div>
          {expenses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm">No expenses recorded yet.</p>
            </div>
          ) : (
            <ExpenseTable expenses={expenses} />
          )}
        </div>
      </section>
    </main>
  );
}