import React from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  type?: "text" | "time";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  disabled = false,
  required = false,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={cn(
        "w-full bg-transparent text-white focus:outline-none",
        className,
      )}
    />
  );
};

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
  disabled = false,
  rows = 4,
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={cn(
        "w-full rounded-xl border-2 border-slate-800 bg-transparent p-4 text-sm text-white transition-colors outline-none placeholder:text-slate-700 focus:border-emerald-500",
        className,
      )}
    />
  );
};
