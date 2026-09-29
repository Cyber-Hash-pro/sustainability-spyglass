import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";
import { appHead } from "@/lib/head";

export const Route = createFileRoute("/_authenticated/_app/ai-insights")({
  head: () => appHead("AI insights", "Generated insights and recommendations, always labelled separately from calculated facts."),
  component: () => (
    <ComingSoon eyebrow="Intelligence" title="AI insights" description="Generated insights and recommendations, always labelled separately from calculated facts." icon={Sparkles} phase="Phase 8" />
  ),
});
