import { Expense } from "@/types/expense";

export const dummyExpenses: Expense[] = [
  { id: "1", category: "Travel", amount: 4500, date: "2026-09-01", status: "Pending", note: "Client visit" },
  { id: "2", category: "Software", amount: 1200, date: "2026-08-28", status: "Approved", note: "Figma subscription" },
  { id: "3", category: "Meals", amount: 850, date: "2026-08-25", status: "Rejected", note: "Team lunch" },
  { id: "4", category: "Office supplies", amount: 600, date: "2026-08-20", status: "Approved", note: "" },
  { id: "5", category: "Travel", amount: 2200, date: "2026-08-15", status: "Pending", note: "Cab fare" },
];