import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INDUSTRIES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const search = z.object({ mode: z.enum(["login", "register", "forgot"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Sign in — Verdant Ledger" },
      { name: "description", content: "Sign in or create your Verdant Ledger account." },
      { property: "og:title", content: "Sign in — Verdant Ledger" },
      { property: "og:description", content: "Access your organization's carbon intelligence workspace." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode = "login" } = Route.useSearch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const setMode = (m: "login" | "register" | "forgot") => navigate({ to: "/auth", search: { mode: m } });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        if (!industry) {
          toast.error("Select an industry");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: name,
              organization_name: organizationName.trim(),
              organization_industry: industry,
              organization_country: country.trim(),
            },
          },
        });
        if (error) throw error;
        toast.success("Your account and organization are set up. Check your inbox to verify your email.");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email, password });
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error("Google sign-in failed");
    else if (!r.redirected) navigate({ to: "/dashboard", replace: true });
  }

  const title = mode === "register" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back";

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground md:flex">
        <Link to="/" className="flex items-center gap-2 font-display text-lg">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          </div>
          Verdant Ledger
        </Link>
        <blockquote className="max-w-md">
          <p className="font-display text-3xl leading-tight">
            "What gets measured, traced and audited gets reduced."
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-sidebar-primary">
            Carbon intelligence platform
          </p>
        </blockquote>
        <span className="text-xs text-sidebar-foreground/50">GHG Protocol aligned</span>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <h1 className="text-3xl">{title}</h1>
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </div>
              <div className="border-t border-border pt-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Organization</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization-name">Organization name</Label>
                <Input id="organization-name" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required maxLength={120} autoComplete="organization" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization-industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="organization-industry"><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>{INDUSTRIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization-country">Headquarters country</Label>
                <Input id="organization-country" value={country} onChange={(e) => setCountry(e.target.value)} required maxLength={80} autoComplete="country-name" />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="pw">Password</Label>
                {mode === "login" && (
                  <button type="button" onClick={() => setMode("forgot")} className="text-xs text-muted-foreground hover:underline">
                    Forgot?
                  </button>
                )}
              </div>
              <Input id="pw" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {mode === "register" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
          </Button>

          {mode === "login" && (
            <div className="pt-4 border-t border-border mt-4">
              <p className="text-xs text-center text-muted-foreground mb-3">Presentation Quick Login</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => { setEmail("superadmin@demo.com"); setPassword("Verdant@Demo2026!"); }}
                >
                  Super Admin
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => { setEmail("orgadmin@demo.com"); setPassword("Verdant@Demo2026!"); }}
                >
                  Org Admin
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => { setEmail("esgmanager@demo.com"); setPassword("Verdant@Demo2026!"); }}
                >
                  ESG Manager
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => { setEmail("datacontributor@demo.com"); setPassword("Verdant@Demo2026!"); }}
                >
                  Data Contrib.
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="col-span-2"
                  size="sm"
                  onClick={() => { setEmail("auditor@demo.com"); setPassword("Verdant@Demo2026!"); }}
                >
                  Auditor
                </Button>
              </div>
            </div>
          )}

          {mode !== "forgot" && (
            <Button type="button" variant="outline" className="w-full mt-4" onClick={google}>
              Continue with Google
            </Button>
          )}
          <p className="text-center text-sm text-muted-foreground">
            {mode === "register" ? (
              <>Already have an account? <button type="button" className="text-foreground underline" onClick={() => setMode("login")}>Sign in</button></>
            ) : (
              <>New here? <button type="button" className="text-foreground underline" onClick={() => setMode("register")}>Create an account</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
