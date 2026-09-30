export type ExpenseStatus = "Pending" | "Approved" | "Rejected";

export type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
  status: ExpenseStatus;
  note?: string;
  user_id?: string;
  team_id?: string;
  user_name?: string;
  receipt_url?: string;
};