"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/Toast";
import {
  AuthSonuc,
  resetPasswordAction,
  signInAction,
  signUpAction,
} from "@/app/actions/auth";

type Mod = "giris" | "kayit" | "sifre";

type Props = {
  mod: Mod;
  next: string;
};

export function AuthForm({ mod, next }: Props) {
  if (mod === "kayit") return <KayitForm next={next} />;
  if (mod === "sifre") return <SifreForm />;
  return <GirisForm next={next} />;
}

function GirisForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthSonuc | undefined, FormData>(
    signInAction,
    undefined,
  );
  return (
    <form action={action} className="space-y-4">
      <h1 className="text-2xl font-bold text-text-main">Giriş Yap</h1>
      <p className="text-sm text-text-muted">Devam etmek için giriş yap.</p>
      {state?.message && !state.ok ? (
        <InlineAlert tone="danger">{state.message}</InlineAlert>
      ) : null}
      <input type="hidden" name="next" value={next} />
      <FormField
        label="E-posta adresin"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="ornek@e-posta.com"
        required
      />
      <FormField
        label="Şifren"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
      />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
      <div className="flex justify-between text-sm">
        <Link href="/giris?mod=kayit" className="font-medium text-brand-green-dark">
          Hesap Oluştur
        </Link>
        <Link href="/giris?mod=sifre" className="font-medium text-text-muted">
          Şifremi Unuttum
        </Link>
      </div>
    </form>
  );
}

function KayitForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthSonuc | undefined, FormData>(
    signUpAction,
    undefined,
  );
  return (
    <form action={action} className="space-y-4">
      <h1 className="text-2xl font-bold text-text-main">Hesap Oluştur</h1>
      <p className="text-sm text-text-muted">Topluluğa katıl, ilan ver ve önerilerini paylaş.</p>
      {state?.message && !state.ok ? (
        <InlineAlert tone="danger">{state.message}</InlineAlert>
      ) : null}
      <input type="hidden" name="next" value={next} />
      <FormField label="Ad Soyad" name="name" placeholder="Adın Soyadın" required />
      <FormField
        label="E-posta adresin"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="ornek@e-posta.com"
        required
      />
      <FormField
        label="Şifren"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="En az 6 karakter"
        required
      />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
      </Button>
      <p className="text-sm text-text-muted">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-medium text-brand-green-dark">
          Giriş Yap
        </Link>
      </p>
    </form>
  );
}

function SifreForm() {
  const [state, action, pending] = useActionState<AuthSonuc | undefined, FormData>(
    resetPasswordAction,
    undefined,
  );
  return (
    <form action={action} className="space-y-4">
      <h1 className="text-2xl font-bold text-text-main">Şifremi Unuttum</h1>
      <p className="text-sm text-text-muted">
        E-posta adresine şifre sıfırlama bağlantısı göndereceğiz.
      </p>
      {state?.message ? (
        <InlineAlert tone={state.ok ? "success" : "danger"}>{state.message}</InlineAlert>
      ) : null}
      <FormField
        label="E-posta adresin"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="ornek@e-posta.com"
        required
      />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
      </Button>
      <p className="text-sm text-text-muted">
        Giriş ekranına dön:{" "}
        <Link href="/giris" className="font-medium text-brand-green-dark">
          Giriş Yap
        </Link>
      </p>
    </form>
  );
}
