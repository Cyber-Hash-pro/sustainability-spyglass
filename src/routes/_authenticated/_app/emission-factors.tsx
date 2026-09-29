import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { appHead } from "@/lib/head";
import { PageHeader } from "@/components/app/page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/_app/emission-factors")({
  head: () => appHead("Emission factors", "Versioned, sourced emission factor library."),
  component: Factors,
});

function Factors() {
  const [scope, setScope] = useState("all");
  const q = useQuery({
    queryKey: ["factors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emission_factor_versions")
        .select("id, version, value, unit, co2e_unit, source, source_year, valid_from, factor:emission_factors(name, region, organization_id, category:activity_categories(scope, ghg_category))")
        .order("valid_from", { ascending: false });
      if (error) throw error;
      return data as unknown as Array<{
        id: string; version: number; value: number; unit: string; co2e_unit: string; source: string; source_year: number | null; valid_from: string;
        factor: { name: string; region: string; organization_id: string | null; category: { scope: string; ghg_category: string | null } };
      }>;
    },
  });
  const rows = (q.data ?? []).filter((r) => scope === "all" || r.factor.category.scope === scope);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Carbon data" title="Emission factors" description="Each factor is versioned with its source and validity window. Calculations reference an exact version so past results remain reproducible." />
      <Tabs value={scope} onValueChange={setScope}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scope_1">Scope 1</TabsTrigger>
          <TabsTrigger value="scope_2">Scope 2</TabsTrigger>
          <TabsTrigger value="scope_3">Scope 3</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Factor</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Value</TableHead>
            <TableHead>Source</TableHead><TableHead>Version</TableHead><TableHead>Library</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.factor.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.factor.category.ghg_category}</TableCell>
                <TableCell className="text-right font-mono text-xs">{Number(r.value).toLocaleString(undefined, { maximumFractionDigits: 5 })} {r.co2e_unit}/{r.unit}</TableCell>
                <TableCell className="text-xs">{r.source}{r.source_year && ` (${r.source_year})`}</TableCell>
                <TableCell className="font-mono text-xs">v{r.version} · {r.valid_from}</TableCell>
                <TableCell><span className="rounded-full bg-secondary px-2 py-0.5 text-[11px]">{r.factor.organization_id ? "Custom" : "Global"}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
