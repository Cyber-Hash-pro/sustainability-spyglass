import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/org-context";
import { appHead } from "@/lib/head";
import { PageHeader } from "@/components/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/_app/settings")({
  head: () => appHead("Settings", "Your personal account settings."),
  component: SettingsPage,
});

function SettingsPage() {
  const { userId, email } = useOrg();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => (await supabase.from("profiles").select("full_name").eq("id", userId).single()).data,
  });
  const [name, setName] = useState("");
  useEffect(() => setName(q.data?.full_name ?? ""), [q.data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", userId);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile", userId] });
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="Settings" />
      <form onSubmit={save} className="max-w-md space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="space-y-2"><Label>Email</Label><Input value={email ?? ""} disabled /></div>
        <div className="space-y-2"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
