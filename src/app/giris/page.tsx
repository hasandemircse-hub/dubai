import Link from "next/link";
import { Metadata } from "next";
import { AuthForm } from "./AuthForm";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Dubai Türk Rehberi hesabınla giriş yap.",
};

type Props = {
  searchParams: Promise<{ mod?: string; next?: string }>;
};

export default async function GirisPage({ searchParams }: Props) {
  const sp = await searchParams;
  const mod = sp.mod === "kayit" ? "kayit" : sp.mod === "sifre" ? "sifre" : "giris";
  const next = sp.next ?? "";
  return (
    <div className="min-h-dvh bg-bg-soft">
      <div className="shell-width flex min-h-dvh flex-col px-4 py-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-green text-white">
            <span className="text-base font-bold">DT</span>
          </span>
          <span className="text-sm font-semibold text-text-main">Dubai Türk Rehberi</span>
        </Link>
        <div className="flex-1">
          <AuthForm mod={mod} next={next} />
        </div>
        <p className="mt-6 text-center text-[11px] text-text-muted">
          Devam ederek <Link href="/guvenlik" className="underline">topluluk kurallarını</Link> kabul etmiş olursun.
        </p>
      </div>
    </div>
  );
}
