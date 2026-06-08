import { Search } from "lucide-react";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ className, ...rest }: Props) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      <input
        type="search"
        className={cn(
          "h-12 w-full rounded-2xl border border-border-soft bg-surface pl-11 pr-4 text-[15px] placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green-soft",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
