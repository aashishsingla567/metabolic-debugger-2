import React from "react";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "title" | "subtitle" | "caption" | "small";
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  children,
  className = "",
  variant = "default",
  required = false,
}) => {
  const variantClasses = {
    default: "text-slate-300",
    title: "text-2xl font-bold text-white",
    subtitle: "text-lg font-semibold text-slate-200",
    caption: "text-xs text-slate-400",
    small: "text-sm text-slate-500",
  };

  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
      {required && <span className="ml-1 text-rose-400">*</span>}
    </span>
  );
};

interface InputLabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export const InputLabel: React.FC<InputLabelProps> = ({
  children,
  className = "",
  htmlFor,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase ${className}`}
    >
      {children}
    </label>
  );
};
