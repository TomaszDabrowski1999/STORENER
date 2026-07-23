"use client";

import clsx from "clsx";
import { useId } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
};

export default function Input({
  label,
  error,
  hint,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-gray-400">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={clsx(
            "w-full rounded-xl border bg-white py-3 text-sm text-gray-950",
            "outline-none transition placeholder:text-gray-400 focus:ring-2",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
            icon ? "pl-11 pr-4" : "px-4",
            className
          )}
          style={{
            borderColor: error ? "#f87171" : "var(--border)",
            ["--tw-ring-color" as string]: error ? "#f87171" : "var(--green)",
          }}
          {...props}
        />
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}
