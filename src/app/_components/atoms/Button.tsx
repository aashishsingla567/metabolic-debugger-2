import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonMode = "instant" | "hold";

interface ButtonProps {
  mode?: ButtonMode;
  children: React.ReactNode;
  onClick?: () => void;
  onComplete?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "slate" | "emerald" | "rose";
  className?: string;
  holdingLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  mode = "instant",
  children,
  onClick,
  onComplete,
  disabled = false,
  loading = false,
  variant = "slate",
  className = "",
  holdingLabel = "",
}) => {
  // Hold mode state
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [shake, setShake] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Hold mode styling (exact match to original)
  const holdThemeColors = {
    emerald: {
      bg: "bg-emerald-600 hover:bg-emerald-500",
      fill: "bg-emerald-400",
      text: "text-white",
    },
    rose: {
      bg: "bg-rose-600 hover:bg-rose-500",
      fill: "bg-rose-400",
      text: "text-white",
    },
  };
  const currentHoldTheme =
    holdThemeColors[variant as keyof typeof holdThemeColors] ??
    holdThemeColors.emerald;

  // Instant mode styling (exact match to original)
  const instantStyles = {
    slate: {
      base: "bg-slate-100 text-slate-900 hover:bg-white",
      issue:
        "cursor-not-allowed border border-rose-500/50 bg-rose-900/20 text-rose-400",
    },
    emerald: {
      base: "bg-emerald-600 text-white hover:bg-emerald-500",
      issue:
        "cursor-not-allowed border border-rose-500/50 bg-rose-900/20 text-rose-400",
    },
    rose: {
      base: "bg-rose-600 text-white hover:bg-rose-500",
      issue:
        "cursor-not-allowed border border-rose-500/50 bg-rose-900/20 text-rose-400",
    },
  };
  const isIssue = variant === "rose";
  const instantStyleSet = isIssue
    ? instantStyles[variant].issue
    : instantStyles[variant].base;

  // Hold mode effect
  useEffect(() => {
    if (mode === "hold" && progress >= 100) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      if (onComplete) onComplete();
      setIsHolding(false);
      setProgress(0);
    }
  }, [progress, mode, onComplete]);

  // Hold mode event handlers
  const startHold = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (mode !== "hold") return;
    if (
      disabled ||
      (e.type === "mousedown" &&
        (e as React.MouseEvent<HTMLButtonElement>).button !== 0)
    )
      return;
    setIsHolding(true);
    setShake(false);
    if (navigator.vibrate) navigator.vibrate(15);

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 4;
      });
    }, 16);
  };

  const endHold = () => {
    if (mode !== "hold") return;
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    if (progress < 100) {
      if (isHolding) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setIsHolding(false);
      setProgress(0);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Render hold mode (exact match to original HoldButton)
  if (mode === "hold") {
    return (
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        disabled={disabled}
        className={cn(
          "relative flex w-full touch-none items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 font-bold shadow-lg transition-all select-none",
          currentHoldTheme.bg,
          currentHoldTheme.text,
          disabled && "cursor-not-allowed opacity-50 grayscale",
          !disabled && "cursor-pointer active:scale-95",
          className,
        )}
        style={{
          animation: shake
            ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both"
            : "none",
        }}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-30 transition-none",
            currentHoldTheme.fill,
          )}
          style={{ width: `${progress}%` }}
        />
        <span className="relative z-10 flex items-center gap-2 text-xs tracking-wider uppercase">
          {progress >= 100 ? (
            <CheckCircle2 size={16} />
          ) : variant === "rose" ? (
            <AlertTriangle size={16} />
          ) : (
            <ShieldCheck size={16} />
          )}
          {isHolding ? holdingLabel : children}
        </span>
      </button>
    );
  }

  // Render instant mode (exact match to original button)
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95",
        instantStyleSet,
        className,
      )}
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
    </button>
  );
};
