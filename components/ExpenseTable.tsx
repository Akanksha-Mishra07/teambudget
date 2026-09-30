import { Expense } from "@/types/expense";
import Link from "next/link";

type ExpenseTableProps = {
  expenses: Expense[];
};

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
  Approved: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  Rejected: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
};

export default function ExpenseTable({ expenses }: ExpenseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Amount</th>
            <th className="py-3 px-3">Member</th>
            <th className="py-3 px-3">Date</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3">Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-slate-800/40 transition">
              <td className="py-3.5 px-3">
                <Link
                  href={`/expenses/${expense.id}`}
                  className="font-medium text-slate-200 hover:text-emerald-400 transition"
                >
                  {expense.category}
                </Link>
              </td>
              <td className="py-3.5 px-3 font-semibold text-white font-mono">
                ₹{expense.amount.toLocaleString()}
              </td>
              <td className="py-3.5 px-3 text-slate-300 text-xs">
                {expense.user_name || <span className="text-slate-500">Member</span>}
              </td>
              <td className="py-3.5 px-3 text-slate-300 text-xs">
                {expense.date}
              </td>
              <td className="py-3.5 px-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[expense.status] || "bg-slate-800 text-slate-300"}`}
                >
                  {expense.status}
                </span>
              </td>
              <td className="py-3.5 px-3 text-slate-400 text-xs max-w-xs truncate">
                {expense.note || <span className="text-slate-600">-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}