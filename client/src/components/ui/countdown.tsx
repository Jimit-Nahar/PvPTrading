import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/utils";

interface CountdownProps {
  endDate: Date;
  onComplete?: () => void;
  className?: string;
  compact?: boolean;
}

export function Countdown({ endDate, onComplete, className, compact = false }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endDate);
      setTimeLeft(remaining);
      
      if (remaining.days <= 0 && remaining.hours <= 0 && 
          remaining.minutes <= 0 && remaining.seconds <= 0) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onComplete]);

  if (compact) {
    return (
      <div className={className}>
        {`${String(timeLeft.days).padStart(2, '0')}:${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}`}
      </div>
    );
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      <div className="bg-secondary px-2 py-1 rounded text-center flex-1">
        <span className="font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
        <p className="text-xs text-muted-foreground">Days</p>
      </div>
      <div className="bg-secondary px-2 py-1 rounded text-center flex-1">
        <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
        <p className="text-xs text-muted-foreground">Hours</p>
      </div>
      <div className="bg-secondary px-2 py-1 rounded text-center flex-1">
        <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <p className="text-xs text-muted-foreground">Mins</p>
      </div>
    </div>
  );
}
