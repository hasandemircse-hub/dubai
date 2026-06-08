"use client";

import { useActionState } from "react";
import { TextAreaField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/Toast";
import { FormSonuc, createReplyAction } from "@/app/actions/topics";

export function ReplyForm({ topicId }: { topicId: string }) {
  const [state, action, pending] = useActionState<FormSonuc | undefined, FormData>(
    createReplyAction,
    undefined,
  );
  return (
    <form action={action} className="space-y-3 rounded-2xl bg-surface p-4 shadow-card">
      <input type="hidden" name="topic_id" value={topicId} />
      <TextAreaField label="Mesajın" name="message" placeholder="Cevabını yaz" required rows={4} />
      {state?.message ? (
        <InlineAlert tone={state.ok ? "success" : "danger"}>{state.message}</InlineAlert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Gönderiliyor..." : "Cevap Yaz"}
      </Button>
    </form>
  );
}
