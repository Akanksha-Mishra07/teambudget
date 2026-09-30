"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import { Expense } from "@/types/expense";
import { Check, X, ShieldAlert, CheckCircle2, User, Calendar, FileText, ArrowLeft, RefreshCw } from "lucide-react";

export default function ApprovalsPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const { team, role, loading: teamLoading } = useTeam();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Authentication and Admin Role Protection
  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login");
      return;
    }
    if (!teamLoading && role && role !== "admin") {
      router.push("/dashboard");
    }
  }, [authLoading, session, teamLoading, role, router]);

  const refreshPendingExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("status", "Pending")
      .order("date", { ascending: false });

    if (!error && data) {
      setExpenses(data as Expense[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function fetchPending() {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("status", "Pending")
        .order("date", { ascending: false });

      if (!error && data) {
        setExpenses(data as Expense[]);
      }
      setLoading(false);
    }

    if (session && role === "admin") {
      fetchPending();
    }
  }, [session, role]);

  useEffect(() => {
    const channel = supabase
      .channel("approvals-expenses")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "expenses" },
        (payload) => {
          // Agar kisi doosre admin ne already approve/reject kar diya, list se hata do
          if (payload.new.status !== "Pending") {
            setExpenses((prev) => prev.filter((e) => e.id !== payload.new.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApprove = async (id: string, category: string) => {
    setProcessingId(id);
    setActionMessage(null);
    const { error } = await supabase
      .from("expenses")
      .update({ status: "Approved" })
      .eq("id", id);

    if (error) {
      console.error("Error approving expense:", error.message);
      setActionMessage({ text: `Failed to approve expense: ${error.message}`, type: "error" });
    } else {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setActionMessage({ text: `Approved "${category}" successfully.`, type: "success" });
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string, category: string) => {
    const confirmed = window.confirm(`Are you sure you want to reject this "${category}" expense?`);
    if (!confirmed) return;

    setProcessingId(id);
    setActionMessage(null);
    const { error } = await supabase
      .from("expenses")
      .update({ status: "Rejected" })
      .eq("id", id);

    if (error) {
      console.error("Error rejecting expense:", error.message);
      setActionMessage({ text: `Failed to reject expense: ${error.message}`, type: "error" });
    } else {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setActionMessage({ text: `Rejected "${category}".`, type: "success" });
    }
    setProcessingId(null);
  };

  if (authLoading || teamLoading || (loading && expenses.length === 0)) {
    return (
      <main className="min-h-screen bg-[#0b0f17] text-slate-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-sm text-slate-400">Loading approvals dashboard...</p>
        </div>
      </main>
    );
  }

  // Double check role security before rendering
  if (role !== "admin") {
    return (
      <main className="min-h-screen bg-[#0b0f17] text-slate-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <ShieldAlert className="text-amber-400 mb-3" size={32} />
          <h1 className="text-xl font-bold text-white mb-2">Admin Access Required</h1>
          <p className="text-slate-400 text-sm mb-6 max-w-sm">
            Only team administrators can review and approve member expenses.
          </p>
          <Link
            href="/dashboard"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const totalPendingAmount = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <main className="min-h-screen bg-[#0b0f17] text-slate-100 pb-16">
      <Navbar />

      <section className="px-6 md:px-8 py-10 max-w-5xl mx-auto">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Admin Approval Queue
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Expense Approvals
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review and authorize pending expenses submitted by members of {team?.name || "your team"}.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-right">
              <span className="text-xs text-slate-400 block font-medium">Pending Total</span>
              <span className="text-lg font-bold font-mono text-amber-400">
                ₹{totalPendingAmount.toLocaleString()}
              </span>
            </div>

            <button
              onClick={refreshPendingExpenses}
              title="Refresh Queue"
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Action Alert Feedback */}
        {actionMessage && (
          <div
            className={`text-sm px-4 py-3 rounded-xl mb-6 border ${actionMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
          >
            {actionMessage.text}
          </div>
        )}

        {/* Approvals Content */}
        {expenses.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">All Caught Up!</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
              There are no pending expenses waiting for approval. New submissions will appear here automatically.
            </p>
            <Link
              href="/expenses"
              className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 font-medium underline-offset-4 hover:underline"
            >
              View all team expenses →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => {
              const isProcessing = processingId === expense.id;
              return (
                <div
                  key={expense.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl transition hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Expense Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        href={`/expenses/${expense.id}`}
                        className="font-bold text-lg text-white hover:text-emerald-400 transition"
                      >
                        {expense.category}
                      </Link>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        Pending Approval
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-slate-500" />
                        <span>Submitted by: <strong className="text-white font-semibold">{expense.user_name || "Team Member"}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-500" />
                        <span className="font-mono text-slate-300">{expense.date}</span>
                      </div>

                      {expense.note && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <FileText size={14} className="text-slate-500" />
                          <span className="max-w-md truncate">{expense.note}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount and Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">Amount</span>
                      <span className="text-xl font-bold font-mono text-white">
                        ₹{expense.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(expense.id, expense.category)}
                        disabled={isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check size={16} />
                        {isProcessing ? "Updating..." : "Approve"}
                      </button>

                      <button
                        onClick={() => handleReject(expense.id, expense.category)}
                        disabled={isProcessing}
                        className="bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-50 border border-rose-500/30 text-rose-400 hover:text-rose-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
