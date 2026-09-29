import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Factory, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/org-context";
import { appHead } from "@/lib/head";
import { PageHeader, EmptyState, ReadOnlyNotice } from "@/components/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/_app/facilities")({
  head: () => appHead("Facilities", "Sites, plants, offices and warehouses within your reporting boundary."),
  component: Facilities,
});

const TYPES = ["office", "manufacturing", "warehouse", "data_center", "retail", "laboratory", "other"];
const empty = { name: "", code: "", facility_type: "office", city: "", country: "", floor_area_m2: "", headcount: "", ownership_share: "100", within_boundary: true };

function Facilities() {
  const { orgId, can } = useOrg();
  const qc = useQueryClient();
  const editable = can("structure.manage");
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(empty);

  const q = useQuery({
    queryKey: ["facilities", orgId],
    queryFn: async () => {
      const { data, error } = await supabase.from("facilities").select("*").eq("organization_id", orgId!).order("created_at");
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["facilities", orgId] });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const share = Number(f.ownership_share);
    if (share < 0 || share > 100) { toast.error("Ownership share must be 0–100%"); return; }
    const { error } = await supabase.from("facilities").insert({
      organization_id: orgId!, name: f.name.trim(), code: f.code || null, facility_type: f.facility_type,
      city: f.city || null, country: f.country || null, within_boundary: f.within_boundary,
      floor_area_m2: f.floor_area_m2 ? Number(f.floor_area_m2) : null,
      headcount: f.headcount ? Number(f.headcount) : null, ownership_share: share,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Facility added");
    setOpen(false); setF(empty); refresh();
  }

  async function toggle(id: string, within_boundary: boolean) {
    const { error } = await supabase.from("facilities").update({ within_boundary }).eq("id", id);
    if (error) toast.error(error.message); else refresh();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("facilities").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Facility removed"); refresh(); }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Organization"
        title="Facilities"
        description="Every physical site where emissions occur. The boundary toggle decides whether a site counts toward your inventory."
        actions={editable && <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add facility</Button>}
      />
      {!editable && <ReadOnlyNotice>You have read-only access to facilities.</ReadOnlyNotice>}

      {q.data && q.data.length === 0 ? (
        <EmptyState icon={Factory} title="No facilities yet" description="Add your headquarters, plants, warehouses and offices."
          action={editable && <Button onClick={() => setOpen(true)}>Add first facility</Button>} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Facility</TableHead><TableHead>Type</TableHead><TableHead>Location</TableHead>
              <TableHead className="text-right">Area m²</TableHead><TableHead className="text-right">Headcount</TableHead>
              <TableHead className="text-right">Ownership</TableHead><TableHead>In boundary</TableHead><TableHead />
            </TableRow></TableHeader>
            <TableBody>
              {q.data?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><p className="font-medium">{r.name}</p>{r.code && <p className="font-mono text-xs text-muted-foreground">{r.code}</p>}</TableCell>
                  <TableCell className="capitalize">{r.facility_type.replace("_", " ")}</TableCell>
                  <TableCell>{[r.city, r.country].filter(Boolean).join(", ") || "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.floor_area_m2?.toLocaleString() ?? "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.headcount ?? "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.ownership_share}%</TableCell>
                  <TableCell><Switch checked={r.within_boundary} disabled={!editable} onCheckedChange={(v) => toggle(r.id, v)} aria-label="In boundary" /></TableCell>
                  <TableCell>
                    {editable && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Delete"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete {r.name}?</AlertDialogTitle>
                            <AlertDialogDescription>Linked activity records will be kept but lose their facility reference. This is recorded in the audit trail.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => remove(r.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add facility</DialogTitle></DialogHeader>
          <form onSubmit={create} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2"><Label>Name</Label><Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Code</Label><Input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="e.g. BLR-01" /></div>
            <div className="space-y-2"><Label>Type</Label>
              <Select value={f.facility_type} onValueChange={(v) => setF({ ...f, facility_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-2"><Label>City</Label><Input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></div>
            <div className="space-y-2"><Label>Country</Label><Input value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} /></div>
            <div className="space-y-2"><Label>Floor area (m²)</Label><Input type="number" min="0" value={f.floor_area_m2} onChange={(e) => setF({ ...f, floor_area_m2: e.target.value })} /></div>
            <div className="space-y-2"><Label>Headcount</Label><Input type="number" min="0" value={f.headcount} onChange={(e) => setF({ ...f, headcount: e.target.value })} /></div>
            <div className="space-y-2"><Label>Ownership share (%)</Label><Input type="number" min="0" max="100" value={f.ownership_share} onChange={(e) => setF({ ...f, ownership_share: e.target.value })} /></div>
            <div className="flex items-center gap-3 pt-7"><Switch checked={f.within_boundary} onCheckedChange={(v) => setF({ ...f, within_boundary: v })} id="wb" /><Label htmlFor="wb">In reporting boundary</Label></div>
            <DialogFooter className="md:col-span-2"><Button type="submit">Add facility</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
