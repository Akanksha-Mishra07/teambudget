"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import { Expense } from "@/types/expense";

const card = "bg-slate-900/60 border border-slate-800 rounded-2xl p-6";
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function AnalyticsPage() {
  const { session, loading: authLoading } = useAuth();
  const { role, loading: teamLoading } = useTeam();
  const router = useRouter();
  const userId = session?.user?.id;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !session) router.push("/login");
  }, [authLoading, session, router]);

  useEffect(() => {
    async function fetchExpenses() {
      const { data, error } = await supabase.from("expenses").select("*");
      if (!error && data) setExpenses(data as Expense[]);
      setLoading(false);
    }
    if (userId) fetchExpenses();
  }, [userId]);

  // Admin = poori team ka data, member = sirf apna
  const scoped = useMemo(
    () => (role === "admin" ? expenses : expenses.filter((e) => e.user_id === userId)),
    [expenses, role, userId]
  );

  const stats = useMemo(() => {
    const approved = scoped.filter((e) => e.status === "Approved");
    const sum = (list: Expense[]) => list.reduce((s, e) => s + Number(e.amount), 0);

    const totalSpend = sum(approved);
    const pendingAmount = sum(scoped.filter((e) => e.status === "Pending"));
    const largest = approved.reduce((m, e) => Math.max(m, Number(e.amount)), 0);
    const decided = scoped.filter((e) => e.status !== "Pending").length;
    const approvalRate = decided > 0 ? Math.round((approved.length / decided) * 100) : 0;

    const byCategory: Record<string, number> = {};
    approved.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
    });
    const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleString("en-IN", { month: "short" }),
        total: 0,
      };
    });
    approved.forEach((e) => {
      const m = months.find((m) => m.key === e.date.slice(0, 7));
      if (m) m.total += Number(e.amount);
    });

    const byMember: Record<string, number> = {};
    approved.forEach((e) => {
      const name = e.user_name || "Unknown";
      byMember[name] = (byMember[name] || 0) + Number(e.amount);
    });
    const members = Object.entries(byMember).sort((a, b) => b[1] - a[1]);

    return { totalSpend, pendingAmount, largest, approvalRate, categories, months, members };
  }, [scoped]);

  const exportCsv = () => {
    const esc = (v: string | number | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = ["Date", "Category", "Amount", "Status", "Submitted by", "Note"];
    const rows = scoped.map((e) =>
      [e.date, e.category, e.amount, e.status, e.user_name ?? "", e.note ?? ""].map(esc).join(",")
    );
    const csv = "\uFEFF" + [header.map(esc).join(","), ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `teambudget-expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading || teamLoading || loading) {
    return <p className="p-8 text-sm text-slate-400">Loading...</p>;
  }

  const maxCategory = stats.categories[0]?.[1] ?? 0;
  const maxMonth = Math.max(...stats.months.map((m) => m.total), 0);
  const maxMember = stats.members[0]?.[1] ?? 0;

  return (
    <main>
      <Navbar />
      <section className="px-8 py-10 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Spending analytics</h1>
            <p className="text-sm text-slate-400 mt-1">
              {role === "admin" ? "Your whole team's approved spend" : "Your approved spend"}
            </p>
          </div>
          <button
            onClick={exportCsv}
            disabled={scoped.length === 0}
            className="flex items-center gap-2 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-40 rounded-lg px-4 py-2 text-sm transition"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {scoped.length === 0 ? (
          <div className={card}>
            <p className="text-sm text-slate-400">No expenses yet. Add a few to see your analytics.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total spend", value: inr(stats.totalSpend), color: "text-emerald-300" },
                { label: "Pending amount", value: inr(stats.pendingAmount), color: "text-yellow-300" },
                { label: "Largest expense", value: inr(stats.largest), color: "text-white" },
                { label: "Approval rate", value: `${stats.approvalRate}%`, color: "text-white" },
              ].map((s) => (
                <div key={s.label} className={card}>
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className={`text-2xl font-semibold mt-2 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className={card}>
                <h2 className="text-white font-medium mb-5">Spend by category</h2>
                {stats.categories.length === 0 ? (
                  <p className="text-sm text-slate-500">No approved expenses yet.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {stats.categories.map(([name, amount]) => (
                      <div key={name}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-300">{name}</span>
                          <span className="text-slate-400">{inr(amount)}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${(amount / maxCategory) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={card}>
                <h2 className="text-white font-medium mb-5">Last 6 months</h2>
                <div className="flex items-end justify-between gap-3 h-44">
                  {stats.months.map((m) => (
                    <div key={m.key} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                      <span className="text-[10px] text-slate-500">{m.total > 0 ? inr(m.total) : ""}</span>
                      <div
                        className={`w-full rounded-t-md ${m.total > 0 ? "bg-emerald-500" : "bg-slate-800"}`}
                        style={{ height: m.total > 0 ? `${Math.max((m.total / maxMonth) * 100, 6)}%` : "4px" }}
                      />
                      <span className="text-xs text-slate-400">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {role === "admin" && (
              <div className={card}>
                <h2 className="text-white font-medium mb-5">Top spenders</h2>
                {stats.members.length === 0 ? (
                  <p className="text-sm text-slate-500">No approved expenses yet.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {stats.members.map(([name, amount], i) => (
                      <div key={name}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-300">{i + 1}. {name}</span>
                          <span className="text-slate-400">{inr(amount)}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="bg-teal-400 h-2 rounded-full"
                            style={{ width: `${(amount / maxMember) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}