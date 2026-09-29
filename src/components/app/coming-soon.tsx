import type { LucideIcon } from "lucide-react";
import { PageHeader, EmptyState } from "./page";

export function ComingSoon({
  eyebrow,
  title,
  description,
  icon,
  phase,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  phase: string;
}) {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState
        icon={icon}
        title={`Planned for ${phase}`}
        description="The data model and access rules for this module are in place. The workspace will light up in an upcoming build phase."
      />
    </div>
  );
}
