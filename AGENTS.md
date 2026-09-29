<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Stack: TanStack Start + Lovable Cloud (Postgres/Auth). Why: preserve existing template stack; no extra frameworks.
- Tenancy: every org-owned table has `organization_id`; RLS via `is_org_member`/`has_org_role` security-definer fns is the authorization layer. Why: backend-enforced isolation, UI checks in `src/lib/rbac.ts` are cosmetic only.
- Roles: platform `super_admin` in `user_roles`; org roles (org_admin, esg_manager, data_contributor, auditor) in `organization_members`. Why: never store roles on profiles.
- Audit: DB trigger `audit_trigger` writes `audit_logs` on org-owned tables; clients have SELECT only. Why: tamper-resistant trail.
- Emission factors are versioned (`emission_factor_versions`); calculations reference a version id. Why: reproducible, explainable results.
- App shell lives at `src/routes/_authenticated/_app/route.tsx` with `OrgProvider` (active org stored in localStorage as UI preference only).
