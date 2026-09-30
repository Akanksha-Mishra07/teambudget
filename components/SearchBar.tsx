type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by category or note..."
      className="bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3.5 py-2 w-full max-w-xs text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
    />
  );
}