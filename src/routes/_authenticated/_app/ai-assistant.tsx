import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";
import { appHead } from "@/lib/head";

export const Route = createFileRoute("/_authenticated/_app/ai-assistant")({
  head: () => appHead("Carbon assistant", "Ask questions about your verified organization data."),
  component: () => (
    <ComingSoon eyebrow="Intelligence" title="Carbon assistant" description="Ask questions about your verified organization data." icon={MessageSquare} phase="Phase 8" />
  ),
});
