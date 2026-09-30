type StatCardProps = {
  label: string;
  value: string | number;
  accent?: "default" | "warning" | "success" | "danger";
};

export default function StatCard({ label, value, accent = "default" }: StatCardProps) {
  const accentStyles: Record<string, { card: string; value: string; indicator: string }> = {
    default: {
      card: "border-slate-800 bg-slate-900/70",
      value: "text-white",
      indicator: "bg-slate-400",
    },
    warning: {
      card: "border-amber-500/20 bg-amber-500/5",
      value: "text-amber-400",
      indicator: "bg-amber-400",
    },
    success: {
      card: "border-emerald-500/20 bg-emerald-500/5",
      value: "text-emerald-400",
      indicator: "bg-emerald-400",
    },
    danger: {
      card: "border-rose-500/20 bg-rose-500/5",
      value: "text-rose-400",
      indicator: "bg-rose-400",
    },
  };

  const style = accentStyles[accent] || accentStyles.default;

  return (
    <div className={`rounded-xl border p-5 transition hover:border-slate-700 shadow-sm ${style.card}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <span className={`w-2 h-2 rounded-full ${style.indicator}`} />
      </div>
      <p className={`text-2xl md:text-3xl font-bold mt-2 tracking-tight ${style.value}`}>{value}</p>
    </div>
  );
}