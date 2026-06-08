import Link from "next/link";
import { Bell, UserCircle2 } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

type Props = {
  isLoggedIn: boolean;
};

export function Header({ isLoggedIn }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-bg-soft/90 px-4 pt-4 pb-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-white shadow-sm">
            <span className="text-lg font-bold leading-none">DT</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold leading-tight text-text-main">
              {SITE_NAME}
            </p>
            <p className="truncate text-[11px] leading-tight text-text-muted">{SITE_TAGLINE}</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          {isLoggedIn ? (
            <>
              <Link
                href="/profil"
                aria-label="Bildirimler"
                className="grid h-9 w-9 place-items-center rounded-full bg-surface text-text-main shadow-sm transition active:scale-95"
              >
                <Bell className="h-4 w-4" />
              </Link>
              <Link
                href="/profil"
                aria-label="Profilim"
                className="grid h-9 w-9 place-items-center rounded-full bg-surface text-text-main shadow-sm transition active:scale-95"
              >
                <UserCircle2 className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <Link
              href="/giris"
              className="rounded-full bg-brand-green px-4 py-1.5 text-sm font-semibold text-white shadow-sm active:scale-95"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
