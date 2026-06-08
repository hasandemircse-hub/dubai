import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = [
    "/",
    "/ilanlar",
    "/isletmeler",
    "/topluluk",
    "/oner-gonder",
    "/hakkimizda",
    "/guvenlik",
    "/iletisim",
  ];
  const supabase = await createSupabaseServerClient();
  const [posts, businesses, topics] = await Promise.all([
    supabase.from("posts").select("id, updated_at").eq("status", "approved").limit(200),
    supabase.from("businesses").select("id, updated_at").eq("status", "approved").limit(200),
    supabase.from("community_topics").select("id, last_activity_at").eq("status", "approved").limit(200),
  ]);

  const rows: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r}`,
    changeFrequency: "weekly",
    priority: r === "/" ? 1 : 0.7,
  }));
  for (const p of (posts.data ?? []) as { id: string; updated_at: string }[]) {
    rows.push({ url: `${base}/ilanlar/${p.id}`, lastModified: p.updated_at });
  }
  for (const b of (businesses.data ?? []) as { id: string; updated_at: string }[]) {
    rows.push({ url: `${base}/isletmeler/${b.id}`, lastModified: b.updated_at });
  }
  for (const t of (topics.data ?? []) as { id: string; last_activity_at: string }[]) {
    rows.push({ url: `${base}/topluluk/${t.id}`, lastModified: t.last_activity_at });
  }
  return rows;
}
