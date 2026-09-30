"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { Expense } from "@/types/expense";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
  Approved: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  Rejected: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
};

export default function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login");
    }
  }, [authLoading, session, router]);

  useEffect(() => {
    async function fetchExpense() {
      const { data } = await supabase.from("expenses").select("*").eq("id", id).single();
      setExpense(data as Expense);
      setLoading(false);
    }
    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmed) return;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) {
      router.push("/expenses");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0f17] text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-slate-400">Loading expense details...</p>
        </div>
      </main>
    );
  }

  if (!expense) {
    return (
      <main className="min-h-screen bg-[#0b0f17] text-slate-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <p className="text-slate-300 font-medium mb-4">Expense not found.</p>
          <Link
            href="/expenses"
            className="text-sm text-emerald-400 hover:underline"
          >
            ← Back to expenses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f17] text-slate-100 pb-16">
      <Navbar />
      <section className="flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-md mb-3">
          <Link
            href="/expenses"
            className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={14} /> Back to expenses
          </Link>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">{expense.category}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[expense.status]}`}>
              {expense.status}
            </span>
          </div>

          <div className="divide-y divide-slate-800/80 text-sm mb-6">
            <div className="flex justify-between py-3">
              <span className="text-slate-400">Amount</span>
              <span className="font-semibold text-white font-mono text-base">₹{expense.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-400">Submitted by</span>
              <span className="text-slate-200 font-medium">{expense.user_name || "Team Member"}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-400">Date</span>
              <span className="text-slate-200 font-mono text-xs">{expense.date}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-400">Note</span>
              <span className="text-slate-200 max-w-[200px] text-right truncate">
                {expense.note || <span className="text-slate-600">None</span>}
              </span>
            </div>
            {expense.receipt_url && (
              <div className="flex justify-between">
                <span className="text-gray-500">Receipt</span>
                <a href={expense.receipt_url} target="_blank" className="underline">
                  View receipt
                </a>
              </div>
            )}
          </div>

          {expense.status === "Pending" ? (
            <div className="flex gap-3 pt-2">
              <Link
                href={`/expenses/${expense.id}/edit`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-lg px-4 py-2.5 text-sm font-medium transition"
              >
                <Edit3 size={15} /> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-center mt-2">
              <p className="text-xs text-slate-400">
                This expense is <span className="font-semibold text-slate-300">{expense.status.toLowerCase()}</span> and can no longer be edited.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}