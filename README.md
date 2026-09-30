# TeamBudget

A full-stack team expense tracking and approval platform — built as a portfolio project to demonstrate real-world SaaS patterns: multi-tenant teams, role-based access control, an approval workflow, file uploads, and live updates.

## Live demo

[Add your Vercel link here after deployment]

## Problem it solves

Small teams often track expenses in shared spreadsheets — no approval trail, no budget visibility, and no accountability for who spent what. TeamBudget gives every team its own workspace where members submit expenses, admins approve or reject them, and everyone can see live spend against a monthly budget.

## Features

- **Authentication** — email/password signup and login via Supabase Auth, with email confirmation and a forgot-password flow
- **Multi-tenant teams** — each signup creates its own team; new members join via a shareable invite code
- **Role-based access** — Admins can approve/reject expenses, manage team members, and set the monthly budget; Members can only manage their own expenses
- **Expense management** — add, edit, delete, search, filter, and sort expenses; edit/delete are restricted to expenses that are still Pending
- **Receipt uploads** — attach a receipt image or PDF to any expense, stored in Supabase Storage
- **Admin approval workflow** — a dedicated approvals queue where admins approve or reject pending expenses
- **Live updates** — dashboards update in real time via Supabase Realtime when expenses are added, approved, or rejected — no manual refresh needed
- **Budget tracking** — a live progress bar on the dashboard shows approved spend against the team's monthly budget
- **Analytics** — spend by category, a 6-month trend chart, top spenders (admin only), and CSV export
- **Team member management** — admins can view all team members and remove members

## Tech stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, Row Level Security)
- **Deployment:** Vercel

## Architecture notes

- **Row Level Security (RLS)** is enforced at the database level for every table — a user can only ever read or write data belonging to their own team, regardless of what the frontend sends.
- **Postgres functions with `security definer`** are used for operations that would otherwise hit RLS chicken-and-egg problems (e.g. creating a team and its first admin membership in one atomic step, or looking up team members' emails without exposing `auth.users` directly).
- **React Context** (`AuthContext`, `TeamContext`) manages session and team/role state across the app without a heavier state library.

## Project structure

app/ Routes (App Router)
dashboard/ Team dashboard with budget progress
expenses/ List, add, edit, detail, approvals
team/ Team settings and member management
analytics/ Spend analytics and CSV export
login/ signup/ Auth pages
components/ Reusable UI (Navbar, Footer, forms, cards)
context/ AuthContext, TeamContext
lib/ Supabase client
types/ Shared TypeScript types


## Running locally

```bash
npm install
npm run dev
```

Requires a `.env.local` file in the project root with:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


These come from your own Supabase project (Project Settings → API). The `anon` key is a public, client-safe key by design, but it should still not be committed to source control — this repo's `.gitignore` excludes `.env.local` for that reason.

## Possible future improvements

- Recurring/scheduled expenses
- In-app notifications for approval decisions
- Multi-currency support
- Exportable monthly PDF reports

## License

This project was built for educational and portfolio purposes.

## Author

**Akanksha Mishra**
[Add your LinkedIn / GitHub profile link here]

Isme [Add your...] wali 2 jagah hain — Vercel deploy hone ke baad live link daal dena, aur apna LinkedIn/GitHub profile link bhi daal dena (yeh recruiters ke liye directly contact/profile jaane ka rasta banata hai).

Yeh save karke, pichhle message wala AGENTS.md/CLAUDE.md cleanup bhi kar lo, phir commit karo.

abhi bhi tmne mujhe ek complete file nhi di hai readme wali, alag alag parts me hai yeah to main isko kaise complete krke likhungii.... I want one complete and full readme file

Samajh gaya — yeh poori file hai, ek hi jagah, seedha copy-paste karne ke liye. Kahi bhi split nahi hai.

markdown
# TeamBudget

A full-stack team expense tracking and approval platform — built as a portfolio project to demonstrate real-world SaaS patterns: multi-tenant teams, role-based access control, an approval workflow, file uploads, and live updates.

## Live demo

[Add your Vercel link here after deployment]

## Problem it solves

Small teams often track expenses in shared spreadsheets — no approval trail, no budget visibility, and no accountability for who spent what. TeamBudget gives every team its own workspace where members submit expenses, admins approve or reject them, and everyone can see live spend against a monthly budget.

## Features

- **Authentication** — email/password signup and login via Supabase Auth, with email confirmation and a forgot-password flow
- **Multi-tenant teams** — each signup creates its own team; new members join via a shareable invite code
- **Role-based access** — Admins can approve/reject expenses, manage team members, and set the monthly budget; Members can only manage their own expenses
- **Expense management** — add, edit, delete, search, filter, and sort expenses; edit/delete are restricted to expenses that are still Pending
- **Receipt uploads** — attach a receipt image or PDF to any expense, stored in Supabase Storage
- **Admin approval workflow** — a dedicated approvals queue where admins approve or reject pending expenses
- **Live updates** — dashboards update in real time via Supabase Realtime when expenses are added, approved, or rejected — no manual refresh needed
- **Budget tracking** — a live progress bar on the dashboard shows approved spend against the team's monthly budget
- **Analytics** — spend by category, a 6-month trend chart, top spenders (admin only), and CSV export
- **Team member management** — admins can view all team members and remove members

## Tech stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, Row Level Security)
- **Deployment:** Vercel

## Architecture notes

- **Row Level Security (RLS)** is enforced at the database level for every table — a user can only ever read or write data belonging to their own team, regardless of what the frontend sends.
- **Postgres functions with `security definer`** are used for operations that would otherwise hit RLS chicken-and-egg problems (e.g. creating a team and its first admin membership in one atomic step, or looking up team members' emails without exposing `auth.users` directly).
- **React Context** (`AuthContext`, `TeamContext`) manages session and team/role state across the app without a heavier state library.

## Project structure

app/ Routes (App Router)
dashboard/ Team dashboard with budget progress
expenses/ List, add, edit, detail, approvals
team/ Team settings and member management
analytics/ Spend analytics and CSV export
login/ signup/ Auth pages
components/ Reusable UI (Navbar, Footer, forms, cards)
context/ AuthContext, TeamContext
lib/ Supabase client
types/ Shared TypeScript types


## Running locally

```bash
npm install
npm run dev
```

Requires a `.env.local` file in the project root with:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


These come from your own Supabase project (Project Settings → API). The `anon` key is a public, client-safe key by design, but it should still not be committed to source control — this repo's `.gitignore` excludes `.env.local` for that reason.

## Possible future improvements

- Recurring/scheduled expenses
- In-app notifications for approval decisions
- Multi-currency support
- Exportable monthly PDF reports

## License

This project was built for educational and portfolio purposes.

## Author

**Akanksha Mishra**
[Add your LinkedIn / GitHub profile link here]