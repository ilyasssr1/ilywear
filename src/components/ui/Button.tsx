"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const getVariantClasses = (variant: Variant = "primary") => {
  const variants: Record<Variant, string> = {
    primary: "bg-black text-white hover:bg-gray-900 focus:ring-black",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-300",
    accent: "bg-accent text-black hover:bg-yellow-500 focus:ring-accent",
    outline:
      "border-2 border-black text-black hover:bg-black hover:text-white focus:ring-black",
    ghost: "text-black hover:bg-gray-100 focus:ring-gray-300",
  };
  return variants[variant];
};

const getSizeClasses = (size: Size = "md") => {
  const sizes: Record<Size, string> = {
    sm: "px-3 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  return sizes[size];
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",
        getVariantClasses(variant),
        getSizeClasses(size),
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
export default Button;
