"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import ExpenseForm from "@/components/ExpenseForm";
import { Expense } from "@/types/expense";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function AddExpensePage() {
  const router = useRouter();
  const { team, loading: teamLoading, refreshTeam } = useTeam();
  const { session, loading: authLoading } = useAuth();
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login");
    }
  }, [authLoading, session, router]);

  const handleAddExpense = async (data: Omit<Expense, "id" | "status">) => {
    setSubmitError("");

    if (!session) {
      setSubmitError("You are not logged in.");
      return;
    }

    if (!team) {
      await refreshTeam();
    }

    if (!team) {
      setSubmitError("Could not find your team. Try logging out and logging back in.");
      return;
    }

    const userName =
      session.user.user_metadata?.full_name ||
      session.user.email?.split("@")[0] ||
      "Team Member";

    const { error } = await supabase.from("expenses").insert([
      { ...data, team_id: team.id, user_id: session.user.id, user_name: userName },
    ]);

    if (error) {
      console.error("Error adding expense:", error.message);
      setSubmitError(error.message);
      return;
    }
    router.push("/expenses");
  };

  if (authLoading || teamLoading) {
    return (
      <main className="min-h-screen bg-[#0b0f17] text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-slate-400">Loading...</p>
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
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Add new expense</h1>
          <p className="text-sm text-slate-400 mb-6">Log an expenditure for admin review and tracking.</p>
          {submitError && (
            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 rounded-lg mb-4">
              {submitError}
            </div>
          )}
          <ExpenseForm onSubmit={handleAddExpense} />
        </div>
      </section>
    </main>
  );
}