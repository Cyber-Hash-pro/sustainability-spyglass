import { createFileRoute } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";
import { appHead } from "@/lib/head";

export const Route = createFileRoute("/_authenticated/_app/initiatives")({
  head: () => appHead("Initiatives", "Reduction projects with owners, costs and expected savings."),
  component: () => (
    <ComingSoon eyebrow="Strategy" title="Initiatives" description="Reduction projects with owners, costs and expected savings." icon={Rocket} phase="Phase 10" />
  ),
});
