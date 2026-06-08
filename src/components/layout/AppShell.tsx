import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  withBottomNav?: boolean;
};

export function AppShell({ children, className, withBottomNav = true }: Props) {
  return (
    <div className="min-h-dvh bg-bg-soft">
      <div
        className={cn(
          "shell-width flex min-h-dvh flex-col bg-bg-soft",
          withBottomNav && "pb-24",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
