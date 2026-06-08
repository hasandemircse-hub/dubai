import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type LabelWrapProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function FieldLabel({ label, hint, error, required, children }: LabelWrapProps) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-text-main">
          {label}
          {required ? <span className="ml-0.5 text-brand-green-dark">*</span> : null}
        </span>
        {hint ? <span className="text-[11px] text-text-muted">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="mt-1 text-xs font-medium text-state-danger-text">{error}</p> : null}
    </label>
  );
}

const baseInput =
  "h-12 w-full rounded-2xl border border-border-soft bg-surface px-4 text-[15px] placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green-soft";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function FormField({ label, hint, error, required, className, ...rest }: FormFieldProps) {
  return (
    <FieldLabel label={label} hint={hint} error={error} required={required}>
      <input className={cn(baseInput, className)} required={required} {...rest} />
    </FieldLabel>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextAreaField({ label, hint, error, required, className, rows = 4, ...rest }: TextAreaProps) {
  return (
    <FieldLabel label={label} hint={hint} error={error} required={required}>
      <textarea
        rows={rows}
        className={cn(
          baseInput,
          "h-auto min-h-[120px] py-3 leading-relaxed",
          className,
        )}
        required={required}
        {...rest}
      />
    </FieldLabel>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function SelectField({
  label,
  hint,
  error,
  required,
  options,
  placeholder,
  className,
  ...rest
}: SelectProps) {
  return (
    <FieldLabel label={label} hint={hint} error={error} required={required}>
      <select
        className={cn(baseInput, "appearance-none bg-[length:14px] bg-no-repeat bg-[right_1rem_center] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%2371717A%22><path fill-rule=%22evenodd%22 d=%22M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z%22 clip-rule=%22evenodd%22/></svg>')] pr-10", className)}
        required={required}
        defaultValue={rest.defaultValue ?? ""}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldLabel>
  );
}

export function Checkbox({
  label,
  hint,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border-soft bg-surface p-3">
      <input
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-border-medium text-brand-green focus:ring-brand-green"
        {...rest}
      />
      <span>
        <span className="block text-sm font-medium text-text-main">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-text-muted">{hint}</span> : null}
      </span>
    </label>
  );
}
