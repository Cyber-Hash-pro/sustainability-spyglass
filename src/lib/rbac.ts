// UI-level permission map. Mirrors the database RLS policies, which are the
// real enforcement point. Never rely on this alone for access control.
export type OrgRole = "org_admin" | "esg_manager" | "data_contributor" | "auditor";

export const ROLE_LABELS: Record<OrgRole | "super_admin", string> = {
  super_admin: "Super Admin",
  org_admin: "Org Admin",
  esg_manager: "ESG Manager",
  data_contributor: "Data Contributor",
  auditor: "Auditor",
};

export const ROLE_DESCRIPTIONS: Record<OrgRole, string> = {
  org_admin: "Manages the organization, users, facilities and boundaries.",
  esg_manager: "Owns emissions data, factors, targets, approvals and reporting.",
  data_contributor: "Submits activity data for assigned facilities.",
  auditor: "Read-only access to data, calculations and the audit trail.",
};

export type Permission =
  | "org.manage"
  | "members.manage"
  | "structure.manage"
  | "activity.submit"
  | "activity.approve"
  | "factors.manage"
  | "audit.view";

const MATRIX: Record<OrgRole, Permission[]> = {
  org_admin: [
    "org.manage",
    "members.manage",
    "structure.manage",
    "activity.submit",
    "activity.approve",
    "factors.manage",
    "audit.view",
  ],
  esg_manager: ["structure.manage", "activity.submit", "activity.approve", "factors.manage", "audit.view"],
  data_contributor: ["activity.submit"],
  auditor: ["audit.view"],
};

export function can(role: OrgRole | null, isSuperAdmin: boolean, perm: Permission) {
  if (isSuperAdmin) return true;
  if (!role) return false;
  return MATRIX[role].includes(perm);
}

export const ALL_PERMISSIONS: { key: Permission; label: string }[] = [
  { key: "org.manage", label: "Organization settings" },
  { key: "members.manage", label: "Users & roles" },
  { key: "structure.manage", label: "Facilities, departments, periods" },
  { key: "activity.submit", label: "Submit activity data" },
  { key: "activity.approve", label: "Approve activity data" },
  { key: "factors.manage", label: "Custom emission factors" },
  { key: "audit.view", label: "View audit trail" },
];

export const ROLE_MATRIX = MATRIX;
