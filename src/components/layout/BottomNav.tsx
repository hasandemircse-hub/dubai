"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListFilter, MessageCircle, Plus, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/", label: "Ana Sayfa", icon: Home, match: (p: string) => p === "/" },
  { href: "/ilanlar", label: "İlanlar", icon: ListFilter, match: (p: string) => p.startsWith("/ilanlar") },
  { href: "/ilan-ver", label: "İlan Ver", icon: Plus, primary: true, match: (p: string) => p === "/ilan-ver" },
  { href: "/topluluk", label: "Topluluk", icon: MessageCircle, match: (p: string) => p.startsWith("/topluluk") },
  { href: "/profil", label: "Profil", icon: UserCircle2, match: (p: string) => p.startsWith("/profil") },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname === "/giris") {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 safe-bottom">
      <div className="shell-width">
        <div className="flex items-end justify-between rounded-3xl border border-border-soft bg-surface px-2 py-2 shadow-floating">
          {ITEMS.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            if (item.primary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative -mt-7 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-brand-green text-white shadow-floating transition active:scale-95",
                    active && "ring-4 ring-brand-green-soft",
                  )}
                  aria-label={item.label}
                >
                  <Icon className="h-6 w-6" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex w-16 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-[11px] font-medium",
                  active ? "text-brand-green-dark" : "text-text-muted",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "text-brand-green-dark")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
