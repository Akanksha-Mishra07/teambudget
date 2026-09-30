"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ExpenseForm from "@/components/ExpenseForm";
import { supabase } from "@/lib/supabaseClient";
import { Expense } from "@/types/expense";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleUpdate = async (data: Omit<Expense, "id" | "status">) => {
    setError("");
    const { error: updateError } = await supabase.from("expenses").update(data).eq("id", id);
    if (updateError) {
      console.error("Error updating expense:", updateError.message);
      setError(updateError.message);
      return;
    }
    router.push("/expenses");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0f17] text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-slate-400">Loading...</p>
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
          <Link href="/expenses" className="text-sm text-emerald-400 hover:underline">
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
            href={`/expenses/${id}`}
            className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={14} /> Back to details
          </Link>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Edit expense</h1>
          <p className="text-sm text-slate-400 mb-6">Update the details for this pending expenditure.</p>

          {error && (
            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 rounded-lg mb-4">
              {error}
            </div>
          )}

          <ExpenseForm
            onSubmit={handleUpdate}
            initialData={{
              category: expense.category,
              amount: expense.amount,
              date: expense.date,
              note: expense.note,
            }}
            submitLabel="Save changes"
          />
        </div>
      </section>
    </main>
  );
}