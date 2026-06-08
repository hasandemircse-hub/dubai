import { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <>
      <AppShell>
        <Header isLoggedIn={Boolean(user)} />
        {children}
      </AppShell>
      <BottomNav />
    </>
  );
}
