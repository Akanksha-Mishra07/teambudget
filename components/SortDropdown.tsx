type SortDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

const sortOptions = [
  { label: "Newest first", value: "date_desc" },
  { label: "Oldest first", value: "date_asc" },
  { label: "Amount: high to low", value: "amount_desc" },
  { label: "Amount: low to high", value: "amount_asc" },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
          {opt.label}
        </option>
      ))}
    </select>
  );
}