import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-[0.98] cursor-pointer";
  
  const variants = {
    primary: "bg-emerald-950 dark:bg-emerald-400 text-white dark:text-emerald-950 hover:bg-emerald-900 dark:hover:bg-emerald-300 shadow-[--shadow-minimal] font-semibold",
    secondary: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 font-semibold",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-sm",
    glass: "bg-white/10 dark:bg-black/20 text-gray-800 dark:text-white border border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-black/30",
    outline: "border border-emerald-100/80 dark:border-emerald-950/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 font-medium"
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
