export type Team = {
  id: string;
  name: string;
  monthly_budget: number;
  invite_code: string;
};

export type TeamRole = "admin" | "member";

export type TeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
};