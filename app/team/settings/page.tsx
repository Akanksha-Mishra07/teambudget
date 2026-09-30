"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";

export default function TeamSettingsPage() {
  const { session, loading: authLoading } = useAuth();
  const { team, role, loading: teamLoading } = useTeam();
  const router = useRouter();
  const [budget, setBudget] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !session) router.push("/login");
  }, [authLoading, session, router]);

  useEffect(() => {
    if (!teamLoading && role !== "admin") router.push("/dashboard");
  }, [teamLoading, role, router]);

  useEffect(() => {
    if (team) setBudget(team.monthly_budget?.toString() ?? "0");
  }, [team]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("teams")
      .update({ monthly_budget: Number(budget) })
      .eq("id", team.id);

    setSaving(false);
    if (error) {
      setMessage("Could not update budget: " + error.message);
    } else {
      setMessage("Budget updated. It may take a moment to reflect on the dashboard.");
    }
  };

  if (authLoading || teamLoading) {
    return <p className="p-8 text-sm text-gray-500">Loading...</p>;
  }

  return (
    <main>
      <Navbar />
      <section className="flex flex-col items-center py-16 px-6">
        <h1 className="text-2xl font-semibold mb-6">Team settings</h1>
        <form onSubmit={handleSave} className="flex flex-col gap-4 w-full max-w-sm">
          <div>
            <label className="text-sm text-gray-600">Monthly budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>
          {message && <p className="text-sm text-gray-600">{message}</p>}
          <button type="submit" disabled={saving} className="bg-black text-white rounded-md px-4 py-2 mt-2">
            {saving ? "Saving..." : "Save budget"}
          </button>
        </form>
      </section>
    </main>
  );
}