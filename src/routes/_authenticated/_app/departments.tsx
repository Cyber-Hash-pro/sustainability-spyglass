import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Users2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/org-context";
import { appHead } from "@/lib/head";
import { PageHeader, EmptyState, ReadOnlyNotice } from "@/components/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/_app/departments")({
  head: () => appHead("Departments", "Business units and cost centers used to attribute emissions."),
  component: Departments,
});

function Departments() {
  const { orgId, can } = useOrg();
  const qc = useQueryClient();
  const editable = can("structure.manage");
  const [name, setName] = useState("");
  const [cc, setCc] = useState("");
  const [fac, setFac] = useState("none");

  const q = useQuery({
    queryKey: ["departments", orgId],
    queryFn: async () => {
      const [d, f] = await Promise.all([
        supabase.from("departments").select("*, facility:facilities(name)").eq("organization_id", orgId!).order("name"),
        supabase.from("facilities").select("id, name").eq("organization_id", orgId!).order("name"),
      ]);
      if (d.error) throw d.error;
      return { departments: d.data, facilities: f.data ?? [] };
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["departments", orgId] });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("departments").insert({
      organization_id: orgId!, name: name.trim(), cost_center: cc || null, facility_id: fac === "none" ? null : fac,
    });
    if (error) { toast.error(error.message); return; }
    setName(""); setCc(""); setFac("none"); refresh();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("departments").delete().eq("id", id);
    if (error) toast.error(error.message); else refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Organization" title="Departments" description="Attribute activity data to business units for internal accountability." />
      {editable ? (
        <form onSubmit={add} className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_180px_220px_auto]">
          <Input placeholder="Department name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Cost center" value={cc} onChange={(e) => setCc(e.target.value)} />
          <Select value={fac} onValueChange={setFac}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All facilities</SelectItem>
              {q.data?.facilities.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button type="submit">Add</Button>
        </form>
      ) : <ReadOnlyNotice>You have read-only access to departments.</ReadOnlyNotice>}

      {q.data && q.data.departments.length === 0 ? (
        <EmptyState icon={Users2} title="No departments" description="Add operations, sales, IT, logistics and other units." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {q.data?.departments.map((d) => (
            <div key={d.id} className="flex items-start justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(d.facility as { name: string } | null)?.name ?? "All facilities"}{d.cost_center && <> · <span className="font-mono">{d.cost_center}</span></>}
                </p>
              </div>
              {editable && <Button variant="ghost" size="icon" onClick={() => remove(d.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
