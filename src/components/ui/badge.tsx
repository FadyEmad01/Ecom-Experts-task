"use client";

import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        {
          "bg-slate-900 text-white": variant === "default",
          "bg-emerald-100 text-emerald-700": variant === "success",
          "bg-amber-100 text-amber-700": variant === "warning",
          "border border-slate-200 bg-white text-slate-700":
            variant === "outline",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
