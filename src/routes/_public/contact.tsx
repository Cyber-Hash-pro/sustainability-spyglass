import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Verdant Ledger" },
      { name: "description", content: "Get in touch with the Verdant Ledger team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="flex-1 bg-sidebar text-sidebar-foreground py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-display md:text-5xl mb-6">Contact our team</h1>
          <p className="text-lg text-sidebar-foreground/70">
            Have questions about our platform or need a custom enterprise plan? We're here to help.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-xl sm:mt-20">
          <form action="#" method="POST" className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="first-name">First name</Label>
              <div className="mt-2.5">
                <Input type="text" name="first-name" id="first-name" autoComplete="given-name" />
              </div>
            </div>
            <div>
              <Label htmlFor="last-name">Last name</Label>
              <div className="mt-2.5">
                <Input type="text" name="last-name" id="last-name" autoComplete="family-name" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="company">Company</Label>
              <div className="mt-2.5">
                <Input type="text" name="company" id="company" autoComplete="organization" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <div className="mt-2.5">
                <Input type="email" name="email" id="email" autoComplete="email" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <div className="mt-2.5">
                <Textarea name="message" id="message" rows={4} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Button type="button" className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                Send message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
