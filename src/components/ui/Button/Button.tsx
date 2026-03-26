"use client";

import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center cursor-pointer justify-center font-semibold transition-all duration-200 rounded-xl",

        // Sizes
        {
          "h-10 px-4 text-sm": size === "sm",
          "h-12 px-6 text-base": size === "md",
          "h-16 px-8 text-lg": size === "lg",
        },

        // Variants
        {
          "bg-rose-600 text-white hover:bg-rose-700 shadow-md":
            variant === "primary",

          "bg-slate-900 text-white hover:bg-slate-800": variant === "secondary",

          "bg-transparent text-slate-700 hover:bg-slate-100":
            variant === "ghost",

          "bg-white text-rose-600 hover:bg-rose-50 shadow-lg":
            variant === "white",
        },

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
