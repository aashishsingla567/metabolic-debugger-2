import React from "react";

interface ProteinTagProps {
  label: string;
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}

export const ProteinTag: React.FC<ProteinTagProps> = ({
  label,
  icon,
  onClick,
  disabled = false,
  active = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
        disabled
          ? "cursor-not-allowed border-slate-700 opacity-50"
          : active
            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
            : "border-slate-600 bg-slate-800 text-slate-300 hover:border-emerald-500 hover:bg-slate-700"
      } ${className} `}
    >
      <span>{icon}</span>
      {label}
      {onClick && !disabled && <span className="text-xs">+</span>}
    </button>
  );
};

interface ProteinTagListProps {
  tags: Array<{
    label: string;
    icon: string;
  }>;
  onTagClick: (tag: string) => void;
  disabled?: boolean;
  activeTag?: string | null;
  className?: string;
}

export const ProteinTagList: React.FC<ProteinTagListProps> = ({
  tags,
  onTagClick,
  disabled = false,
  activeTag = null,
  className = "",
}) => {
  return (
    <div
      className={`scrollbar-none flex gap-2 overflow-x-auto pb-2 ${className}`}
    >
      {tags.map((tag) => (
        <ProteinTag
          key={tag.label}
          label={tag.label}
          icon={tag.icon}
          onClick={() => onTagClick(tag.label)}
          disabled={disabled}
          active={activeTag === tag.label}
        />
      ))}
    </div>
  );
};
