import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";
import { appHead } from "@/lib/head";

export const Route = createFileRoute("/_authenticated/_app/targets")({
  head: () => appHead("Targets", "Science-aligned reduction targets and progress tracking."),
  component: () => (
    <ComingSoon eyebrow="Strategy" title="Targets" description="Science-aligned reduction targets and progress tracking." icon={Target} phase="Phase 10" />
  ),
});
