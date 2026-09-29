import { createFileRoute, Link, type LinkProps } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Factory, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/org-context";
import { appHead } from "@/lib/head";
import { PageHeader, Stat } from "@/components/app/page";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/_app/dashboard")({
  head: () => appHead("Executive dashboard", "Organization-wide carbon footprint overview."),
  component: Dashboard,
});

function Dashboard() {
  const { orgId, org } = useOrg();
  const q = useQuery({
    queryKey: ["dashboard", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const id = orgId!;
      const count = (t: "facilities" | "departments" | "organization_members" | "activity_records" | "reporting_periods") =>
        supabase.from(t).select("id", { count: "exact", head: true }).eq("organization_id", id);
      const [fac, dep, mem, act, per, facs, calc] = await Promise.all([
        count("facilities"), count("departments"), count("organization_members"), count("activity_records"), count("reporting_periods"),
        supabase.from("facilities").select("id, name, facility_type, within_boundary, headcount, city, country").eq("organization_id", id).order("created_at"),
        supabase.from("emission_calculations").select("scope, co2e_kg").eq("organization_id", id),
      ]);
      const totals = { scope_1: 0, scope_2: 0, scope_3: 0 };
      (calc.data ?? []).forEach((c) => (totals[c.scope as keyof typeof totals] += Number(c.co2e_kg)));
      return {
        facilities: fac.count ?? 0, departments: dep.count ?? 0, members: mem.count ?? 0,
        activity: act.count ?? 0, periods: per.count ?? 0, facilityList: facs.data ?? [], totals,
        hasCalcs: (calc.data ?? []).length > 0,
      };
    },
  });

  const d = q.data;
  const steps: { done: boolean; label: string; to: NonNullable<LinkProps["to"]> }[] = [
    { done: true, label: "Create organization", to: "/organization" },
    { done: (d?.facilities ?? 0) > 0, label: "Add facilities & boundary", to: "/facilities" },
    { done: (d?.departments ?? 0) > 0, label: "Add departments", to: "/departments" },
    { done: (d?.periods ?? 0) > 0, label: "Configure reporting period", to: "/reporting-periods" },
    { done: (d?.members ?? 0) > 1, label: "Invite your team", to: "/users" },
    { done: (d?.activity ?? 0) > 0, label: "Enter initial activity data", to: "/activity" },
  ];
  const t = (kg: number) => (kg / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 });

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Executive overview" title={org?.name ?? "Dashboard"} description="Calculated figures only. AI-generated commentary is always labelled separately." />

      {q.isLoading || !d ? (
        <div className="grid gap-4 md:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : (
        <>
          <section className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            <div className="bg-primary p-6 text-primary-foreground md:col-span-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">Total footprint</p>
              <p className="mt-3 font-display text-4xl tabular-nums">
                {d.hasCalcs ? t(d.totals.scope_1 + d.totals.scope_2 + d.totals.scope_3) : "—"}
              </p>
              <p className="mt-1 text-xs opacity-70">tCO₂e · {d.hasCalcs ? "calculated" : "baseline pending"}</p>
            </div>
            {(["scope_1", "scope_2", "scope_3"] as const).map((s, i) => (
              <div key={s} className="bg-card p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Scope {i + 1}</p>
                <p className="mt-3 font-display text-3xl tabular-nums">{d.hasCalcs ? t(d.totals[s]) : "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {["Direct: fuel, fleet, refrigerants", "Purchased electricity & heat", "Value chain: travel, waste, freight"][i]}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <Stat label="Facilities" value={d.facilities} />
            <Stat label="Departments" value={d.departments} />
            <Stat label="Team members" value={d.members} />
            <Stat label="Activity records" value={d.activity} />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl">Facilities in reporting boundary</h2>
                <Button asChild variant="ghost" size="sm"><Link to="/facilities">Manage <ArrowUpRight className="h-4 w-4" /></Link></Button>
              </div>
              {d.facilityList.length === 0 ? (
                <div className="mt-6 flex items-center gap-3 rounded-md bg-secondary p-4 text-sm">
                  <Factory className="h-5 w-5 text-primary" /> No facilities yet — add sites to define your organizational boundary.
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-border">
                  {d.facilityList.map((f) => (
                    <li key={f.id} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <p className="font-medium">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{[f.facility_type, f.city, f.country].filter(Boolean).join(" · ")}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${f.within_boundary ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                        {f.within_boundary ? "In boundary" : "Excluded"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-xl">Setup progress</h2>
                <ul className="mt-4 space-y-2.5">
                  {steps.map((s) => (
                    <li key={s.label}>
                      <Link to={s.to} className="flex items-center gap-2 text-sm hover:underline">
                        {s.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                        <span className={s.done ? "text-muted-foreground line-through" : ""}>{s.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-dashed border-border p-6">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" /> AI generated · not a calculated fact
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Insights will appear here once a baseline has been calculated from approved activity data.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
