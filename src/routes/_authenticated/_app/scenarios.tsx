import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";
import { appHead } from "@/lib/head";

export const Route = createFileRoute("/_authenticated/_app/scenarios")({
  head: () => appHead("Scenarios", "What-if simulations for renewable switches, fleet electrification and more."),
  component: () => (
    <ComingSoon eyebrow="Strategy" title="Scenarios" description="What-if simulations for renewable switches, fleet electrification and more." icon={FlaskConical} phase="Phase 9" />
  ),
});
