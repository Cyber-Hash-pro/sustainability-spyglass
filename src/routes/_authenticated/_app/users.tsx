import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Minus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/org-context";
import { appHead } from "@/lib/head";
import { ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_MATRIX, ALL_PERMISSIONS, type OrgRole } from "@/lib/rbac";
import { PageHeader, ReadOnlyNotice } from "@/components/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/_app/users")({
  head: () => appHead("Users & roles", "Manage team members and role-based access."),
  component: Users,
});

const ROLES: OrgRole[] = ["org_admin", "esg_manager", "data_contributor", "auditor"];

function Users() {
  const { orgId, can, userId } = useOrg();
  const qc = useQueryClient();
  const editable = can("members.manage");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrgRole>("data_contributor");

  const q = useQuery({
    queryKey: ["members", orgId],
    queryFn: async () => {
      const { data: m, error } = await supabase.from("organization_members").select("id, user_id, role, created_at").eq("organization_id", orgId!).order("created_at");
      if (error) throw error;
      const { data: p } = await supabase.from("profiles").select("id, full_name, email").in("id", m.map((x) => x.user_id));
      return m.map((x) => ({ ...x, profile: p?.find((y) => y.id === x.user_id) }));
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["members", orgId] });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.rpc("add_member_by_email", { _org: orgId!, _email: email, _role: role });
    if (error) return toast.error(error.message);
    toast.success("Member added"); setEmail(""); refresh();
  }
  async function changeRole(id: string, r: OrgRole) {
    const { error } = await supabase.from("organization_members").update({ role: r }).eq("id", id);
    if (error) toast.error(error.message); else refresh();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("organization_members").delete().eq("id", id);
    if (error) toast.error(error.message); else refresh();
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Organization" title="Users & roles" description="Access is enforced in the database for every request — not just hidden in the interface." />
      {editable ? (
        <form onSubmit={add} className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_220px_auto]">
          <Input type="email" required placeholder="colleague@company.com (must have an account)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Select value={role} onValueChange={(v) => setRole(v as OrgRole)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}</SelectContent>
          </Select>
          <Button type="submit">Add member</Button>
        </form>
      ) : <ReadOnlyNotice>Only Org Admins can manage members.</ReadOnlyNotice>}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {q.data?.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <p className="font-medium">{m.profile?.full_name ?? "—"}{m.user_id === userId && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}</p>
                  <p className="text-xs text-muted-foreground">{m.profile?.email}</p>
                </TableCell>
                <TableCell>
                  <Select disabled={!editable || m.user_id === userId} value={m.role} onValueChange={(v) => changeRole(m.id, v as OrgRole)}>
                    <SelectTrigger className="h-8 w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{editable && m.user_id !== userId && <Button variant="ghost" size="icon" onClick={() => remove(m.id)} aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <section>
        <h2 className="text-2xl">Permission matrix</h2>
        <p className="mt-1 text-sm text-muted-foreground">Super Admins (platform operators) hold every permission across all organizations.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Capability</TableHead>{ROLES.map((r) => <TableHead key={r} className="text-center">{ROLE_LABELS[r]}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {ALL_PERMISSIONS.map((p) => (
                <TableRow key={p.key}>
                  <TableCell>{p.label}</TableCell>
                  {ROLES.map((r) => (
                    <TableCell key={r} className="text-center">
                      {ROLE_MATRIX[r].includes(p.key) ? <Check className="mx-auto h-4 w-4 text-primary" /> : <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow><TableCell>View organization data</TableCell>{ROLES.map((r) => <TableCell key={r}><Check className="mx-auto h-4 w-4 text-primary" /></TableCell>)}</TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {ROLES.map((r) => (
            <div key={r} className="rounded-lg border border-border p-4">
              <p className="font-medium">{ROLE_LABELS[r]}</p>
              <p className="mt-1 text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[r]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
