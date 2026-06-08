import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-green text-white shadow-sm hover:bg-brand-green-dark active:scale-[0.98] disabled:bg-brand-green/60",
  secondary:
    "bg-surface text-brand-green-dark ring-1 ring-brand-green/30 hover:bg-brand-green-soft disabled:opacity-60",
  ghost: "bg-transparent text-text-main hover:bg-surface disabled:opacity-60",
  danger: "bg-state-danger text-state-danger-text hover:opacity-90 disabled:opacity-60",
  outline:
    "bg-surface text-text-main ring-1 ring-border-soft hover:bg-bg-warm disabled:opacity-60",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-14 px-6 text-base font-semibold rounded-2xl w-full",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asLink?: false;
  };

type LinkProps = CommonProps & {
  asLink: true;
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
};

function classes(variant: Variant, size: Size, fullWidth?: boolean, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-medium transition-all",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className,
  );
}

export function Button(props: ButtonProps | LinkProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    leftIcon,
    rightIcon,
    className,
  } = props;

  const inner = (
    <>
      {leftIcon}
      <span className="truncate">{props.children}</span>
      {rightIcon}
    </>
  );

  if ("asLink" in props && props.asLink) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={classes(variant, size, fullWidth, className)}
      >
        {inner}
      </Link>
    );
  }

  const { asLink: _a, leftIcon: _l, rightIcon: _r, fullWidth: _f, variant: _v, size: _s, className: _c, ...rest } = props as ButtonProps & {
    asLink?: boolean;
  };
  void _a; void _l; void _r; void _f; void _v; void _s; void _c;

  return (
    <button {...rest} className={classes(variant, size, fullWidth, className)}>
      {inner}
    </button>
  );
}
