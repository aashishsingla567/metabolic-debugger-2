import React, { useState, useEffect } from "react";
import { InputField, InputLabel, Button } from "../atoms/index";
import { cn } from "@/lib/utils";

type SleepData = {
  duration: number;
  bedtime: string;
  waketime: string;
};

type ValidateFn<T = unknown> = (isYes: boolean, data?: T) => void;

interface SleepInputProps {
  onValidate: ValidateFn<SleepData>;
  isIssue: boolean;
}

export const SleepInput: React.FC<SleepInputProps> = ({
  onValidate,
  isIssue,
}) => {
  const [bedtime, setBedtime] = useState("23:00");
  const [waketime, setWaketime] = useState("07:00");
  const [duration, setDuration] = useState(8);

  useEffect(() => {
    const [h1, m1] = bedtime.split(":").map(Number);
    const [h2, m2] = waketime.split(":").map(Number);
    const h1Num = h1 ?? 0;
    const m1Num = m1 ?? 0;
    const h2Num = h2 ?? 0;
    const m2Num = m2 ?? 0;
    let diff = h2Num + m2Num / 60 - (h1Num + m1Num / 60);
    if (diff < 0) diff += 24;
    setDuration(parseFloat(diff.toFixed(1)));
  }, [bedtime, waketime]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <InputLabel>Bedtime</InputLabel>
          <InputField
            type="time"
            value={bedtime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBedtime(e.target.value)
            }
            className="w-full bg-transparent text-xl text-white focus:outline-none"
          />
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <InputLabel>Wake Up</InputLabel>
          <InputField
            type="time"
            value={waketime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWaketime(e.target.value)
            }
            className="w-full bg-transparent text-xl text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <span className="text-sm text-slate-400">Total Rest</span>
        <span
          className={cn(
            "text-2xl font-black",
            duration >= 7 ? "text-emerald-400" : "text-rose-400",
          )}
        >
          {duration}{" "}
          <span className="text-sm font-normal text-slate-500">hours</span>
        </span>
      </div>

      <Button
        mode="instant"
        variant={isIssue ? "rose" : "slate"}
        onClick={() =>
          onValidate(duration >= 7, { duration, bedtime, waketime })
        }
      >
        {isIssue ? "Insufficient Sleep Detected" : "Confirm Sleep Schedule"}
      </Button>
    </div>
  );
};
