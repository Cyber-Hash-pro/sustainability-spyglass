import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/org-context";
import { appHead } from "@/lib/head";
import { PageHeader, ReadOnlyNotice } from "@/components/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/_app/reporting-periods")({
  head: () => appHead("Reporting periods", "Inventory years, baseline selection and period locking."),
  component: Periods,
});

function Periods() {
  const { orgId, can } = useOrg();
  const qc = useQueryClient();
  const editable = can("structure.manage");
  const [f, setF] = useState({ name: "", start_date: "", end_date: "" });

  const q = useQuery({
    queryKey: ["periods", orgId],
    queryFn: async () => {
      const { data, error } = await supabase.from("reporting_periods").select("*").eq("organization_id", orgId!).order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["periods", orgId] });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (f.end_date <= f.start_date) return toast.error("End date must be after start date");
    const { error } = await supabase.from("reporting_periods").insert({ organization_id: orgId!, ...f });
    if (error) return toast.error(error.message);
    setF({ name: "", start_date: "", end_date: "" }); refresh();
  }
  async function update(id: string, patch: { status?: "open" | "locked" | "closed"; is_baseline?: boolean }) {
    if (patch.is_baseline) await supabase.from("reporting_periods").update({ is_baseline: false }).eq("organization_id", orgId!);
    const { error } = await supabase.from("reporting_periods").update(patch).eq("id", id);
    if (error) toast.error(error.message); else refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Organization" title="Reporting periods" description="Lock a period once data is approved so historical results stay stable. One period is your baseline for target tracking." />
      {editable ? (
        <form onSubmit={add} className="grid items-end gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_180px_180px_auto]">
          <div className="space-y-1"><Label>Name</Label><Input required placeholder="FY 2025" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="space-y-1"><Label>Start</Label><Input required type="date" value={f.start_date} onChange={(e) => setF({ ...f, start_date: e.target.value })} /></div>
          <div className="space-y-1"><Label>End</Label><Input required type="date" value={f.end_date} onChange={(e) => setF({ ...f, end_date: e.target.value })} /></div>
          <Button type="submit">Add period</Button>
        </form>
      ) : <ReadOnlyNotice>You have read-only access to reporting periods.</ReadOnlyNotice>}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Period</TableHead><TableHead>Dates</TableHead><TableHead>Baseline</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {q.data?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="font-mono text-xs">{p.start_date} → {p.end_date}</TableCell>
                <TableCell>
                  {p.is_baseline ? <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-foreground">Baseline</span>
                    : editable && <Button variant="link" size="sm" className="h-auto p-0" onClick={() => update(p.id, { is_baseline: true })}>Set as baseline</Button>}
                </TableCell>
                <TableCell>
                  <Select disabled={!editable} value={p.status} onValueChange={(v) => update(p.id, { status: v as "open" | "locked" | "closed" })}>
                    <SelectTrigger className="h-8 w-28 capitalize"><SelectValue /></SelectTrigger>
                    <SelectContent>{["open", "locked", "closed"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
