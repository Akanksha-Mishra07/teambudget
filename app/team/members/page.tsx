"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";

type Member = {
  member_id: string;
  member_user_id: string;
  member_role: string;
  member_email: string;
  member_full_name: string;
};

const card = "bg-slate-900/60 border border-slate-800 rounded-2xl p-6";

export default function TeamMembersPage() {
  const { session, loading: authLoading } = useAuth();
  const { role, loading: teamLoading } = useTeam();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !session) router.push("/login");
  }, [authLoading, session, router]);

  useEffect(() => {
    if (!teamLoading && role !== "admin") router.push("/dashboard");
  }, [teamLoading, role, router]);

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase.rpc("get_my_team_members");
      if (!error && data) setMembers(data as Member[]);
      setLoading(false);
    }
    if (role === "admin") fetchMembers();
  }, [role]);

  const handleRemove = async (userId: string) => {
    setError("");
    const { error } = await supabase.rpc("remove_team_member", { target_user_id: userId });
    if (error) {
      setError(error.message);
      return;
    }
    setMembers((prev) => prev.filter((m) => m.member_user_id !== userId));
  };

  if (authLoading || teamLoading || loading) {
    return <p className="p-8 text-sm text-slate-400">Loading...</p>;
  }

  return (
    <main>
      <Navbar />
      <section className="px-8 py-10 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-6">Team members</h1>
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        <div className={card}>
          <div className="flex flex-col divide-y divide-slate-800">
            {members.map((m) => (
              <div key={m.member_id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white text-sm font-medium">{m.member_full_name}</p>
                  <p className="text-slate-500 text-xs">{m.member_email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${
                      m.member_role === "admin"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {m.member_role}
                  </span>
                  {m.member_role !== "admin" && (
                    <button
                      onClick={() => handleRemove(m.member_user_id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}