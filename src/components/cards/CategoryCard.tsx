import Link from "next/link";

type Props = {
  name: string;
  emoji: string;
  href: string;
  description?: string;
};

export function CategoryCard({ name, emoji, href, description }: Props) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start justify-between gap-3 rounded-3xl bg-surface p-4 shadow-card transition active:scale-[0.98]"
    >
      <span
        aria-hidden
        className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-green-soft text-2xl"
      >
        {emoji}
      </span>
      <div>
        <p className="text-[14px] font-semibold leading-tight text-text-main">{name}</p>
        {description ? (
          <p className="mt-1 text-[11px] leading-snug text-text-muted">{description}</p>
        ) : null}
      </div>
    </Link>
  );
}
