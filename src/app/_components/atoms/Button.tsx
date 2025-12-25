import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface ButtonProps {
  onComplete: () => void;
  label: string;
  holdingLabel: string;
  disabled?: boolean;
  theme?: "emerald" | "rose" | "default";
  className?: string;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  onComplete,
  label,
  holdingLabel,
  disabled,
  theme = "emerald",
  className = "",
  variant = "primary",
}) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [shake, setShake] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const colors = {
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
    default: {
      bg: "bg-slate-100 hover:bg-white",
      fill: "bg-slate-300",
      text: "text-slate-900",
    },
  };

  const currentTheme = colors[theme];

  useEffect(() => {
    if (progress >= 100) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      onComplete();
      setIsHolding(false);
      setProgress(0);
    }
  }, [progress, onComplete]);

  const startHold = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
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

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      disabled={disabled}
      className={`relative flex w-full touch-none items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 font-bold shadow-lg transition-all select-none ${currentTheme.bg} ${currentTheme.text} ${disabled ? "cursor-not-allowed opacity-50 grayscale" : "cursor-pointer active:scale-95"} ${className}`}
      style={{
        animation: shake
          ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both"
          : "none",
      }}
    >
      <div
        className={`absolute inset-0 ${currentTheme.fill} opacity-30 transition-none`}
        style={{ width: `${progress}%` }}
      />
      <span className="relative z-10 flex items-center gap-2 text-xs tracking-wider uppercase">
        {progress >= 100 ? (
          <CheckCircle2 size={16} />
        ) : theme === "rose" ? (
          <AlertTriangle size={16} />
        ) : theme === "default" ? (
          <ShieldCheck size={16} />
        ) : (
          <ShieldCheck size={16} />
        )}
        {isHolding ? holdingLabel : label}
      </span>
    </button>
  );
};
