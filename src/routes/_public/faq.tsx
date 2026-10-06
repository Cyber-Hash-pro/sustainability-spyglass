import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/_public/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Verdant Ledger" },
      { name: "description", content: "Frequently asked questions about Verdant Ledger's carbon accounting platform." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  {
    question: "How is Verdant Ledger different from using spreadsheets?",
    answer: "Spreadsheets lack auditability, version control for emission factors, and strict role-based access. Verdant Ledger provides an immutable audit trail for every change, ensures calculations use the correct versioned emission factors, and enforces strict tenant isolation and role permissions at the database level."
  },
  {
    question: "What roles are available in the platform?",
    answer: "The platform supports five distinct roles: Super Admin (system management), Org Admin (full organizational control), ESG Manager (strategy and reporting), Data Contributor (activity data entry), and Auditor (read-only access to verify facts and trails)."
  },
  {
    question: "Are emission factors automatically updated?",
    answer: "Yes. We maintain a library of standard emission factors (like the UK government's DEFRA set). They are versioned so that historical calculations remain unchanged even when new factors are published."
  },
  {
    question: "How does the AI assistant work?",
    answer: "Our AI assistant helps identify anomalies and suggests reduction strategies based on your activity data. Importantly, AI-generated insights are kept strictly separate from calculated facts—the AI can never rewrite your carbon numbers."
  },
  {
    question: "Can I limit access to specific facilities?",
    answer: "Yes. You can define a strict reporting boundary and assign Data Contributors to specific facilities so they only see and enter data relevant to their location."
  },
  {
    question: "How secure is my data?",
    answer: "Extremely secure. We use Row Level Security (RLS) in our database to ensure strict tenant isolation. An organization can never access another organization's data, and users can only access data permitted by their specific role."
  }
];

function FAQ() {
  return (
    <div className="flex-1 bg-sidebar text-sidebar-foreground py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-display md:text-5xl mb-6">Frequently asked questions</h1>
          <p className="text-lg text-sidebar-foreground/70">
            Everything you need to know about our carbon intelligence platform.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-lg font-medium hover:text-sidebar-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sidebar-foreground/70 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
