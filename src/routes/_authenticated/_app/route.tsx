import { createFileRoute, Link, Navigate, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  LayoutDashboard, Activity, Flame, Library, Target, Rocket, FlaskConical, Sparkles, MessageSquare,
  FileText, Building2, Factory, Users2, CalendarRange, UserCog, ScrollText, Settings, Menu, LogOut, ChevronsUpDown, Check, Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OrgProvider, useOrg } from "@/lib/org-context";
import { ROLE_LABELS, type Permission } from "@/lib/rbac";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user } = Route.useRouteContext();
  return (
    <OrgProvider userId={user.id} email={user.email ?? null}>
      <Shell />
    </OrgProvider>
  );
}

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; perm?: Permission };
const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Overview", items: [{ to: "/dashboard", label: "Executive dashboard", icon: LayoutDashboard }] },
  {
    group: "Carbon data",
    items: [
      { to: "/activity", label: "Activity data", icon: Activity },
      { to: "/emissions", label: "Emissions", icon: Flame },
      { to: "/emission-factors", label: "Emission factors", icon: Library },
    ],
  },
  {
    group: "Strategy",
    items: [
      { to: "/targets", label: "Targets", icon: Target },
      { to: "/initiatives", label: "Initiatives", icon: Rocket },
      { to: "/scenarios", label: "Scenarios", icon: FlaskConical },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { to: "/ai-insights", label: "AI insights", icon: Sparkles },
      { to: "/ai-assistant", label: "Carbon assistant", icon: MessageSquare },
      { to: "/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    group: "Organization",
    items: [
      { to: "/organization", label: "Profile & boundary", icon: Building2 },
      { to: "/facilities", label: "Facilities", icon: Factory },
      { to: "/departments", label: "Departments", icon: Users2 },
      { to: "/reporting-periods", label: "Reporting periods", icon: CalendarRange },
      { to: "/users", label: "Users & roles", icon: UserCog },
      { to: "/audit-logs", label: "Audit trail", icon: ScrollText, perm: "audit.view" },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function Shell() {
  const o = useOrg();
  const [open, setOpen] = useState(false);

  if (o.loading) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden w-64 bg-sidebar md:block" />
        <div className="flex-1 space-y-4 p-10"><Skeleton className="h-10 w-72" /><Skeleton className="h-40 w-full" /></div>
      </div>
    );
  }
  if (o.memberships.length === 0 && !o.isSuperAdmin) return <Navigate to="/onboarding" />;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 md:block">
        <SidebarBody />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 border-0 p-0">
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 truncate text-sm text-muted-foreground">
            {o.org?.name}
            {o.org?.industry && <span className="hidden sm:inline"> · {o.org.industry}</span>}
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground">
            {o.isSuperAdmin ? ROLE_LABELS.super_admin : o.role ? ROLE_LABELS[o.role] : "—"}
          </span>
          <UserMenu />
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
          {o.orgId ? <Outlet /> : <p className="text-sm text-muted-foreground">Select an organization to continue.</p>}
        </main>
      </div>
    </div>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const o = useOrg();
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary font-display text-lg font-semibold text-sidebar-primary-foreground">V</div>
          <span className="font-display text-lg">Verdant Ledger</span>
        </div>
        <OrgSwitcher />
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        {NAV.map((g) => {
          const items = g.items.filter((i) => !i.perm || o.can(i.perm));
          if (!items.length) return null;
          return (
            <div key={g.group}>
              <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/45">{g.group}</p>
              {items.map(({ to, label, icon: I }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={onNavigate}
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeProps={{ className: "bg-sidebar-accent !text-sidebar-primary" }}
                >
                  <I className="h-4 w-4" /> {label}
                </Link>
              ))}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

function OrgSwitcher() {
  const o = useOrg();
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mt-4 flex w-full items-center justify-between rounded-md border border-sidebar-border px-3 py-2 text-left text-sm hover:bg-sidebar-accent">
        <span className="truncate">{o.org?.name ?? "Select organization"}</span>
        <ChevronsUpDown className="h-4 w-4 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        {o.memberships.map((m) => (
          <DropdownMenuItem key={m.organization_id} onClick={() => o.setOrgId(m.organization_id)}>
            <span className="flex-1 truncate">{m.organization?.name}</span>
            {m.organization_id === o.orgId && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/onboarding" })}>
          <Plus className="h-4 w-4" /> New organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const o = useOrg();
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold uppercase text-primary-foreground">
        {(o.email ?? "?").slice(0, 1)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="font-normal text-muted-foreground">{o.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
