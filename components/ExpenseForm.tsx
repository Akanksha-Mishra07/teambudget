"use client";

import { useState } from "react";
import { Expense } from "@/types/expense";
import { supabase } from "@/lib/supabaseClient";

type ExpenseFormProps = {
  onSubmit: (expense: Omit<Expense, "id" | "status">) => void;
  initialData?: Omit<Expense, "id" | "status">;
  submitLabel?: string;
};

const categories = ["Travel", "Software", "Meals", "Office supplies", "Other"];

export default function ExpenseForm({
  onSubmit,
  initialData,
  submitLabel = "Submit expense",
}: ExpenseFormProps) {
  const [category, setCategory] = useState(initialData?.category ?? categories[0]);
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [note, setNote] = useState(initialData?.note ?? "");
  const [error, setError] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedAmount = Number(amount);
    if (!amount || parsedAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!date) {
      setError("Select a date.");
      return;
    }

    let receiptUrl = initialData?.receipt_url;

    if (receiptFile) {
      setUploading(true);
      const filePath = `${crypto.randomUUID()}-${receiptFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(filePath, receiptFile);

      setUploading(false);
      if (uploadError) {
        setError("Receipt upload failed: " + uploadError.message);
        return;
      }
      const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(filePath);
      receiptUrl = urlData.publicUrl;
    }

    onSubmit({ category, amount: parsedAmount, date, note, receipt_url: receiptUrl });
  };

  const inputClass =
    "w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3.5 py-2.5 mt-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition text-sm";
  const labelClass = "text-xs font-semibold uppercase tracking-wider text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div>
        <label className={labelClass}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-slate-900 text-slate-100">
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
          placeholder="e.g. 1500"
          min="1"
          step="any"
        />
      </div>
      <div>
        <label className={labelClass}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`${inputClass} min-h-[85px] resize-none`}
          placeholder="What was this expense for?"
        />
      </div>
      <div>
        <label className="text-sm text-gray-600">Receipt (optional)</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm mt-1"
        />
        {initialData?.receipt_url && !receiptFile && (
          <a href={initialData.receipt_url} target="_blank" className="text-xs underline text-gray-500 mt-1 inline-block">
            View current receipt
          </a>
        )}
      </div>

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 rounded-lg">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={uploading}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg px-4 py-2.5 mt-2 transition shadow-md shadow-emerald-950/40 cursor-pointer text-sm"
      >
        {uploading ? "Uploading..." : submitLabel}
      </button>
    </form>
  );
}