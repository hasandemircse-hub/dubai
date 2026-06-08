import { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Button } from "./Button";

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({ title, description, icon, actionLabel, actionHref }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border-soft bg-surface px-6 py-10 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-bg-warm text-text-muted">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold text-text-main">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-xs text-sm text-text-muted">{description}</p>
      ) : null}
      {actionLabel && actionHref ? (
        <div className="mt-4">
          <Button asLink href={actionHref} size="md">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
