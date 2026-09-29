import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/org-context";
import { appHead } from "@/lib/head";
import { PageHeader, EmptyState } from "@/components/app/page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/_app/activity")({
  head: () => appHead("Activity data", "Fuel, electricity, travel, waste and other activity records."),
  component: ActivityPage,
});

function ActivityPage() {
  const { orgId } = useOrg();
  const q = useQuery({
    queryKey: ["activity", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_records")
        .select("id, activity_date, quantity, unit, status, category:activity_categories(name, scope), facility:facilities(name)")
        .eq("organization_id", orgId!)
        .order("activity_date", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Carbon data" title="Activity data" description="Raw operational data that feeds the calculation engine. Records move draft → submitted → approved." />
      {q.data && q.data.length === 0 ? (
        <EmptyState icon={Activity} title="No activity records yet" description="Manual entry and CSV import arrive in the Activity Data phase. The data model and approval workflow are already in place." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead>Facility</TableHead><TableHead className="text-right">Quantity</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {q.data?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.activity_date}</TableCell>
                  <TableCell>{(r.category as { name: string } | null)?.name}</TableCell>
                  <TableCell>{(r.facility as { name: string } | null)?.name ?? "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(r.quantity).toLocaleString()} {r.unit}</TableCell>
                  <TableCell className="capitalize">{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
