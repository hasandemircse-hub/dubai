"use client";

import { Bookmark } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleFavoriteAction } from "@/app/actions/favorites";

type Props = {
  itemType: "post" | "business" | "topic";
  itemId: string;
  initialSaved: boolean;
  loggedIn: boolean;
};

export function FavoriteButton({ itemType, itemId, initialSaved, loggedIn }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  if (!loggedIn) {
    return (
      <a
        href={`/giris?next=${encodeURIComponent("/" + (itemType === "business" ? "isletmeler" : itemType === "topic" ? "topluluk" : "ilanlar") + "/" + itemId)}`}
        className="inline-flex h-9 items-center gap-1 rounded-full bg-bg-warm px-3 text-xs font-semibold text-text-main"
      >
        <Bookmark className="h-3 w-3" /> Kaydet
      </a>
    );
  }
  return (
    <form
      action={(fd) => {
        startTransition(() => {
          setSaved((s) => !s);
          toggleFavoriteAction(fd);
        });
      }}
    >
      <input type="hidden" name="item_type" value={itemType} />
      <input type="hidden" name="item_id" value={itemId} />
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold ${saved ? "bg-brand-green-soft text-brand-green-dark" : "bg-bg-warm text-text-main"}`}
      >
        <Bookmark className={`h-3 w-3 ${saved ? "fill-current" : ""}`} />
        {saved ? "Kaydedildi" : "Kaydet"}
      </button>
    </form>
  );
}
