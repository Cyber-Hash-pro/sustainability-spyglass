import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";
import { appHead } from "@/lib/head";

export const Route = createFileRoute("/_authenticated/_app/emissions")({
  head: () => appHead("Emissions", "Scope 1, 2 and 3 breakdowns calculated from approved activity data."),
  component: () => (
    <ComingSoon eyebrow="Carbon data" title="Emissions" description="Scope 1, 2 and 3 breakdowns calculated from approved activity data." icon={Flame} phase="Phase 5 — Carbon engine" />
  ),
});
