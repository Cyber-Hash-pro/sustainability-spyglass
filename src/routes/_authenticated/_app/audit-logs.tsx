import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/org-context";
import { appHead } from "@/lib/head";
import { PageHeader, EmptyState, ReadOnlyNotice } from "@/components/app/page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/_app/audit-logs")({
  head: () => appHead("Audit trail", "Immutable log of every change to organization data."),
  component: Audit,
});

function Audit() {
  const { orgId, can } = useOrg();
  const q = useQuery({
    queryKey: ["audit", orgId],
    enabled: can("audit.view"),
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs").select("*").eq("organization_id", orgId!).order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      const ids = [...new Set(data.map((d) => d.actor_id).filter(Boolean))] as string[];
      const { data: p } = ids.length ? await supabase.from("profiles").select("id, full_name, email").in("id", ids) : { data: [] };
      return data.map((d) => ({ ...d, actor: p?.find((x) => x.id === d.actor_id) }));
    },
  });

  if (!can("audit.view")) return <ReadOnlyNotice>Your role does not include access to the audit trail.</ReadOnlyNotice>;

  const label = (r: { after_data: unknown; before_data: unknown }) => {
    const d = (r.after_data ?? r.before_data) as Record<string, unknown> | null;
    return (d?.name as string) ?? (d?.role as string) ?? "";
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Governance" title="Audit trail" description="Written automatically by the database on every insert, update and delete. Cannot be edited from the application." />
      {q.data && q.data.length === 0 ? (
        <EmptyState icon={ScrollText} title="No events yet" description="Changes to facilities, departments, periods, members and activity will appear here." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Entity</TableHead></TableRow></TableHeader>
            <TableBody>
              {q.data?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{new Date(r.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{r.actor?.full_name ?? r.actor?.email ?? "System"}</TableCell>
                  <TableCell><span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] uppercase">{r.action}</span></TableCell>
                  <TableCell className="text-sm"><span className="text-muted-foreground">{r.entity_type.replace("_", " ")}</span> {label(r)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
