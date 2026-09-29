import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";
import { appHead } from "@/lib/head";

export const Route = createFileRoute("/_authenticated/_app/reports")({
  head: () => appHead("Reports", "Board-ready and disclosure-aligned emissions reports."),
  component: () => (
    <ComingSoon eyebrow="Intelligence" title="Reports" description="Board-ready and disclosure-aligned emissions reports." icon={FileText} phase="Phase 11" />
  ),
});
