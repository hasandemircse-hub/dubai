import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: Props) {
  return <div className={cn("px-4 pb-6", className)}>{children}</div>;
}
