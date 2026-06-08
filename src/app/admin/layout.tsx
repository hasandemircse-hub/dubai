import Link from "next/link";
import { ReactNode } from "react";
import { Home, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";

const NAV = [
  { href: "/admin", label: "Özet" },
  { href: "/admin/ilanlar", label: "İlanlar" },
  { href: "/admin/oneriler", label: "Öneriler" },
  { href: "/admin/isletmeler", label: "İşletmeler" },
  { href: "/admin/topluluk", label: "Topluluk" },
  { href: "/admin/cevaplar", label: "Cevaplar" },
  { href: "/admin/raporlar", label: "Şikayetler" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar" },
  { href: "/admin/whatsapp-aktar", label: "WhatsApp Aktar" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh bg-bg-soft">
      <header className="sticky top-0 z-30 border-b border-border-soft bg-bg-soft/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-green text-white text-sm font-bold">DT</span>
            <span className="text-sm font-semibold">Yönetim Paneli</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden h-9 items-center gap-1 rounded-full bg-surface px-3 text-xs font-medium text-text-main shadow-sm sm:inline-flex"
            >
              <Home className="h-3 w-3" /> Siteye Dön
            </Link>
            <form action={signOutAction}>
              <button className="inline-flex h-9 items-center gap-1 rounded-full bg-state-danger px-3 text-xs font-semibold text-state-danger-text">
                <LogOut className="h-3 w-3" /> Çıkış
              </button>
            </form>
          </div>
        </div>
        <nav className="border-t border-border-soft bg-surface">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 scrollbar-none">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-text-main hover:bg-brand-green-soft"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="mb-4 text-xs text-text-muted">
          Yönetici: <span className="font-medium text-text-main">{admin.profile?.name ?? admin.email}</span>
        </p>
        {children}
      </main>
    </div>
  );
}
