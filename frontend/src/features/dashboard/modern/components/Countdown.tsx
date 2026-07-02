import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: string): TimeLeft {
  const difference = new Date(target).getTime() - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

export function Countdown({ targetDate }: CountdownProps) {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(targetDate));
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeLeft(targetDate));
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const unit = (value: number, label: string) => (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900/60 text-lg font-extrabold text-white backdrop-blur-sm transition-transform duration-300 md:h-14 md:w-14 md:text-xl",
          pulse && "scale-105"
        )}
      >
        {pad(value)}
      </div>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-white/80">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {unit(time.days, "Days")}
      {unit(time.hours, "Hours")}
      {unit(time.minutes, "Mins")}
      {unit(time.seconds, "Secs")}
    </div>
  );
}
