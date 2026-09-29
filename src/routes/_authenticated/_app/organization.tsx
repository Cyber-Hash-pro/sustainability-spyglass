import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/org-context";
import { appHead } from "@/lib/head";
import { PageHeader, ReadOnlyNotice } from "@/components/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDUSTRIES } from "../onboarding";

export const Route = createFileRoute("/_authenticated/_app/organization")({
  head: () => appHead("Organization profile", "Organization details and reporting boundary."),
  component: OrgPage,
});

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function OrgPage() {
  const { orgId, can } = useOrg();
  const qc = useQueryClient();
  const editable = can("org.manage");
  const q = useQuery({
    queryKey: ["org", orgId],
    queryFn: async () => {
      const { data, error } = await supabase.from("organizations").select("*").eq("id", orgId!).single();
      if (error) throw error;
      return data;
    },
  });
  const b = useQuery({
    queryKey: ["boundary", orgId],
    queryFn: async () => {
      const { data } = await supabase.from("facilities").select("within_boundary, ownership_share").eq("organization_id", orgId!);
      return data ?? [];
    },
  });
  const [form, setForm] = useState({ name: "", industry: "", country: "", base_currency: "USD", fiscal_year_start_month: 1 });
  useEffect(() => {
    if (q.data) setForm({
      name: q.data.name, industry: q.data.industry ?? "", country: q.data.country ?? "",
      base_currency: q.data.base_currency, fiscal_year_start_month: q.data.fiscal_year_start_month,
    });
  }, [q.data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("organizations").update({ ...form, updated_at: new Date().toISOString() }).eq("id", orgId!);
    if (error) return toast.error(error.message);
    toast.success("Organization updated");
    qc.invalidateQueries();
  }

  const inB = (b.data ?? []).filter((f) => f.within_boundary).length;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Organization" title="Profile & reporting boundary" description="Defines who you are and which operations are counted in your inventory." />
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={save} className="space-y-5 rounded-lg border border-border bg-card p-6 lg:col-span-2">
          {!editable && <ReadOnlyNotice>Only Org Admins can edit organization details.</ReadOnlyNotice>}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2"><Label>Name</Label>
              <Input disabled={!editable} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Industry</Label>
              <Select disabled={!editable} value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-2"><Label>Country</Label>
              <Input disabled={!editable} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div className="space-y-2"><Label>Base currency</Label>
              <Input disabled={!editable} maxLength={3} value={form.base_currency} onChange={(e) => setForm({ ...form, base_currency: e.target.value.toUpperCase() })} /></div>
            <div className="space-y-2"><Label>Fiscal year starts</Label>
              <Select disabled={!editable} value={String(form.fiscal_year_start_month)} onValueChange={(v) => setForm({ ...form, fiscal_year_start_month: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map((m, i) => <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
              </Select></div>
          </div>
          {editable && <Button type="submit">Save changes</Button>}
        </form>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl">Boundary summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Consolidation</dt><dd>Operational control</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Facilities in boundary</dt><dd className="tabular-nums">{inB} / {b.data?.length ?? 0}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Scopes covered</dt><dd>1 · 2 · 3</dd></div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Toggle individual facilities in or out of the boundary on the Facilities page. Ownership share is applied under equity-share reporting.
          </p>
        </div>
      </div>
    </div>
  );
}
