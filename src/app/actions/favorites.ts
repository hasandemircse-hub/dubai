"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

const sema = z.object({
  item_type: z.enum(["post", "business", "topic"]),
  item_id: z.string().uuid(),
});

export async function toggleFavoriteAction(formData: FormData) {
  const user = await requireUser();
  const parsed = sema.safeParse({
    item_type: formData.get("item_type"),
    item_id: formData.get("item_id"),
  });
  if (!parsed.success) return;
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_type", parsed.data.item_type)
    .eq("item_id", parsed.data.item_id)
    .maybeSingle();
  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
  } else {
    await supabase.from("favorites").insert({
      user_id: user.id,
      item_type: parsed.data.item_type,
      item_id: parsed.data.item_id,
    });
  }
  revalidatePath("/profil");
}
