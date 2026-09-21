import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
      danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      outline: "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-800",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-10 px-4 text-sm rounded-lg",
      lg: "h-12 px-6 text-base rounded-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
