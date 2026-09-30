type FilterDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

const statuses = ["All", "Pending", "Approved", "Rejected"];

export default function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="bg-slate-900 text-slate-100">
          {s === "All" ? "All Statuses" : s}
        </option>
      ))}
    </select>
  );
}