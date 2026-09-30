"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import SortDropdown from "@/components/SortDropdown";
import ExpenseTable from "@/components/ExpenseTable";
import { supabase } from "@/lib/supabaseClient";
import { Expense } from "@/types/expense";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function ExpensesListPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

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
    fetchExpenses();
  }, []);

  let filtered = expenses.filter((expense) => {
    const matchesSearch =
      expense.category.toLowerCase().includes(search.toLowerCase()) ||
      (expense.note ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || expense.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "date_desc") return b.date.localeCompare(a.date);
    if (sortBy === "date_asc") return a.date.localeCompare(b.date);
    if (sortBy === "amount_desc") return b.amount - a.amount;
    if (sortBy === "amount_asc") return a.amount - b.amount;
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#0b0f17] text-slate-100 pb-16">
      <Navbar />
      <section className="px-6 md:px-8 py-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Team Expenses</h1>
            <p className="text-slate-400 text-sm mt-1">View, search, and filter all logged expenditures.</p>
          </div>
          <Link
            href="/expenses/add"
            className="self-start sm:self-auto bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 inline-flex items-center gap-1.5"
          >
            <Plus size={16} /> Add expense
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <SearchBar value={search} onChange={setSearch} />
          <FilterDropdown value={statusFilter} onChange={setStatusFilter} />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400">Loading expenses...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400">No expenses match your filters.</p>
            </div>
          ) : (
            <ExpenseTable expenses={filtered} />
          )}
        </div>
      </section>
    </main>
  );
}