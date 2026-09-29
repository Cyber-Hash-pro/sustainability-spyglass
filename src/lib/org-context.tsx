import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { can, type OrgRole, type Permission } from "./rbac";

export type Membership = {
  organization_id: string;
  role: OrgRole;
  organization: { id: string; name: string; industry: string | null; country: string | null } | null;
};

type OrgCtx = {
  userId: string;
  email: string | null;
  memberships: Membership[];
  isSuperAdmin: boolean;
  orgId: string | null;
  org: Membership["organization"];
  role: OrgRole | null;
  setOrgId: (id: string) => void;
  can: (p: Permission) => boolean;
  loading: boolean;
};

const Ctx = createContext<OrgCtx | null>(null);
const KEY = "carbon.activeOrg"; // UI preference only; access is enforced server-side.

export function useMembershipsQuery(userId: string) {
  return useQuery({
    queryKey: ["memberships", userId],
    queryFn: async () => {
      const [m, r] = await Promise.all([
        supabase
          .from("organization_members")
          .select("organization_id, role, organization:organizations(id, name, industry, country)")
          .eq("user_id", userId),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);
      if (m.error) throw m.error;
      return {
        memberships: (m.data ?? []) as unknown as Membership[],
        isSuperAdmin: (r.data ?? []).some((x) => x.role === "super_admin"),
      };
    },
  });
}

export function OrgProvider({
  userId,
  email,
  children,
}: {
  userId: string;
  email: string | null;
  children: ReactNode;
}) {
  const q = useMembershipsQuery(userId);
  const [orgId, setOrgIdState] = useState<string | null>(null);

  useEffect(() => {
    if (!q.data) return;
    const stored = localStorage.getItem(KEY);
    const ids = q.data.memberships.map((m) => m.organization_id);
    setOrgIdState(stored && ids.includes(stored) ? stored : (ids[0] ?? null));
  }, [q.data]);

  const value = useMemo<OrgCtx>(() => {
    const memberships = q.data?.memberships ?? [];
    const isSuperAdmin = q.data?.isSuperAdmin ?? false;
    const current = memberships.find((m) => m.organization_id === orgId) ?? null;
    const role = current?.role ?? null;
    return {
      userId,
      email,
      memberships,
      isSuperAdmin,
      orgId,
      org: current?.organization ?? null,
      role,
      setOrgId: (id) => {
        localStorage.setItem(KEY, id);
        setOrgIdState(id);
      },
      can: (p) => can(role, isSuperAdmin, p),
      loading: q.isLoading || (!!q.data && q.data.memberships.length > 0 && !orgId),
    };
  }, [q.data, q.isLoading, orgId, userId, email]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrg() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOrg must be used inside OrgProvider");
  return c;
}
