"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Team, TeamRole } from "@/types/team";

type TeamContextType = {
  team: Team | null;
  role: TeamRole | null;
  loading: boolean;
  refreshTeam: () => Promise<void>;
};

const TeamContext = createContext<TeamContextType>({
  team: null,
  role: null,
  loading: true,
  refreshTeam: async () => {},
});

export function TeamProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [role, setRole] = useState<TeamRole | null>(null);
  const [loading, setLoading] = useState(true);
  // Kis user ke liye team fetch complete ho chuka hai
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);

  // Guards against concurrent in-flight requests and React Strict Mode double-invocation
  const inFlightUserIdRef = useRef<string | null>(null);
  const fetchedUserIdRef = useRef<string | null>(null);

  const userId = session?.user?.id;

  const loadTeamForUser = useCallback(async (currentUserId: string, userMeta?: Record<string, unknown>) => {
    try {
      // 1. Check existing team membership
      const { data: membership, error: memError } = await supabase
        .from("team_members")
        .select("role, team_id, teams(id, name, monthly_budget, invite_code)")
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (!memError && membership) {
        setRole(membership.role as TeamRole);
        const teamData = Array.isArray(membership.teams) ? membership.teams[0] : membership.teams;
        setTeam(teamData as unknown as Team);
        setLoading(false);
        return;
      }

      // 2. Self-heal if user has no team membership row
      const metaInviteCode = typeof userMeta?.invite_code === "string" ? userMeta.invite_code.trim() : "";
      const userName = typeof userMeta?.full_name === "string" && userMeta.full_name.trim() ? userMeta.full_name.trim() : "My";

      if (metaInviteCode) {
        const { error: joinError } = await supabase.rpc("join_team_with_code", {
          code: metaInviteCode,
        });

        if (!joinError) {
          const { data: joinedMembership } = await supabase
            .from("team_members")
            .select("role, team_id, teams(id, name, monthly_budget, invite_code)")
            .eq("user_id", currentUserId)
            .maybeSingle();

          if (joinedMembership) {
            setRole(joinedMembership.role as TeamRole);
            const teamData = Array.isArray(joinedMembership.teams)
              ? joinedMembership.teams[0]
              : joinedMembership.teams;
            setTeam(teamData as unknown as Team);
            setLoading(false);
            return;
          }
        }
      }

      // Default self-heal: create new team & admin via RPC
      const { error: rpcError } = await supabase.rpc("create_team_and_admin", {
        team_name: `${userName}'s team`,
      });

      if (!rpcError) {
        const { data: newMembership } = await supabase
          .from("team_members")
          .select("role, team_id, teams(id, name, monthly_budget, invite_code)")
          .eq("user_id", currentUserId)
          .maybeSingle();

        if (newMembership) {
          setRole(newMembership.role as TeamRole);
          const teamData = Array.isArray(newMembership.teams)
            ? newMembership.teams[0]
            : newMembership.teams;
          setTeam(teamData as unknown as Team);
        }
      }
    } catch (err) {
      console.error("Error in TeamContext loadTeamForUser:", err);
    } finally {
      setLoading(false);
      setResolvedUserId(currentUserId);
    }
  }, []);

  const refreshTeam = useCallback(async () => {
    if (!session?.user?.id) {
      setTeam(null);
      setRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await loadTeamForUser(session.user.id, session.user.user_metadata);
      fetchedUserIdRef.current = session.user.id;
    } catch (err) {
      console.error("Error in refreshTeam:", err);
      setLoading(false);
    }
  }, [session, loadTeamForUser]);

  useEffect(() => {
    // FIX: auth abhi load ho raha hai — team ko "loaded" mat maano
    if (authLoading) return;

    if (!userId) {
      inFlightUserIdRef.current = null;
      fetchedUserIdRef.current = null;
      Promise.resolve().then(() => {
        setTeam(null);
        setRole(null);
        setResolvedUserId(null);
        setLoading(false);
      });
      return;
    }

    // Prevent duplicate in-flight RPC calls and re-executions for the same session user
    if (fetchedUserIdRef.current === userId || inFlightUserIdRef.current === userId) {
      return;
    }

    inFlightUserIdRef.current = userId;

    loadTeamForUser(userId, session?.user?.user_metadata)
      .then(() => {
        fetchedUserIdRef.current = userId;
      })
      .catch((err) => {
        console.error("Error loading team for user:", err);
      })
      .finally(() => {
        inFlightUserIdRef.current = null;
      });
  }, [authLoading, userId, session?.user?.user_metadata, loadTeamForUser]);

  // Loading tab tak true jab tak auth + is user ki team dono resolve na ho jayein
  const effectiveLoading = authLoading || loading || (!!userId && resolvedUserId !== userId);

  return (
    <TeamContext.Provider value={{ team, role, loading: effectiveLoading, refreshTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}