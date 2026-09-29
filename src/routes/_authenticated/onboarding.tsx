import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const INDUSTRIES = [
  "Manufacturing",
  "Technology & Software",
  "Financial Services",
  "Retail & Consumer",
  "Logistics & Transport",
  "Energy & Utilities",
  "Healthcare",
  "Real Estate",
  "Education",
  "Other",
];

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Create your organization — Verdant Ledger" },
      { name: "description", content: "Set up your organization to start measuring emissions." },
      { property: "og:title", content: "Onboarding — Verdant Ledger" },
      { property: "og:description", content: "Set up your organization to start measuring emissions." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!industry) return toast.error("Select an industry");
    setBusy(true);
    const { data, error } = await supabase.rpc("create_organization", {
      _name: name.trim(),
      _industry: industry,
      _country: country.trim(),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    localStorage.setItem("carbon.activeOrg", data as string);
    await qc.invalidateQueries({ queryKey: ["memberships"] });
    toast.success("Organization created. Add your first facility next.");
    navigate({ to: "/facilities" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <form onSubmit={submit} className="w-full max-w-lg space-y-6 rounded-xl border border-border bg-card p-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Step 1 of 4</p>
          <h1 className="mt-2 text-3xl">Create your organization</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You'll become its Org Admin. A baseline reporting period for this year is created automatically.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="n">Legal / trading name</Label>
          <Input id="n" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
        </div>
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="c">Headquarters country</Label>
          <Input id="c" value={country} onChange={(e) => setCountry(e.target.value)} required maxLength={80} />
        </div>
        <ol className="grid grid-cols-4 gap-2 text-[11px] text-muted-foreground">
          {["Organization", "Facilities", "Departments", "Reporting period"].map((s, i) => (
            <li key={s} className={`border-t-2 pt-2 ${i === 0 ? "border-primary text-foreground" : "border-border"}`}>{s}</li>
          ))}
        </ol>
        <Button type="submit" className="w-full" disabled={busy}>Create organization</Button>
      </form>
    </div>
  );
}
