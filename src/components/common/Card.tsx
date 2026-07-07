import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  id,
  onClick,
  hoverable = false
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        bg-white dark:bg-[#0a110f]
        border border-emerald-100/80 dark:border-emerald-950/40
        shadow-[--shadow-minimal] dark:shadow-none
        rounded-3xl p-6 transition-all duration-300
        ${hoverable ? "hover:-translate-y-1.5 hover:shadow-[--shadow-minimal-hover] hover:border-emerald-200/80 dark:hover:border-emerald-800/40 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
