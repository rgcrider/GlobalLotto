import React, { useState, useEffect, useMemo } from 'react';
import { Clock, AlertCircle, Calendar, Sparkles, Bell, BellRing, Check } from 'lucide-react';

export interface CountdownTimerProps {
  /** Target draw date as a string (e.g., 'Mon, Apr 21, 2025 21:22 CT') or Date object */
  targetDrawDate?: string | Date;
  /** Target draw date prop alias */
  targetDate?: string | Date;
  /** Human-readable drawing schedule (e.g., 'Monday, Thursday & Saturday at 9:22 PM CT') */
  drawSchedule?: string;
  /** Presentation variant */
  variant?: 'header' | 'badge' | 'card' | 'inline';
  /** Custom heading or label */
  label?: string;
  /** Whether to show the seconds counter (defaults to true) */
  showSeconds?: boolean;
  /** Whether to show the days block even when 0 (defaults to false) */
  alwaysShowDays?: boolean;
  /** Enable quick cutoff reminder notification toggle */
  enableReminder?: boolean;
  /** Callback triggered when countdown expires */
  onExpire?: () => void;
  /** Additional CSS class names */
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
  isExpired: boolean;
  targetDrawDate: Date;
}

/**
 * Calculates the exact upcoming draw Date based on current date & time.
 * If targetDate is provided and in the future, uses that; otherwise computes
 * the next recurring draw based on schedule and current date.
 */
export function calculateNextDrawDate(targetDate?: string | Date, drawSchedule?: string): Date {
  const now = new Date();

  // 1. If targetDate is already a valid future Date object
  if (targetDate instanceof Date && !isNaN(targetDate.getTime()) && targetDate.getTime() > now.getTime()) {
    return targetDate;
  }

  // 2. If targetDate is a parseable string that represents a future date
  if (typeof targetDate === 'string' && targetDate.trim()) {
    // Standard parse attempt
    const parsed = new Date(targetDate);
    if (!isNaN(parsed.getTime()) && parsed.getTime() > now.getTime()) {
      return parsed;
    }
  }

  // 3. Dynamically calculate the next recurring draw based on current date
  const scheduleText = (drawSchedule || (typeof targetDate === 'string' ? targetDate : '')).toLowerCase();

  // Determine drawing time (hours & minutes)
  let drawHour = 21; // 9:22 PM CT is standard for Illinois Lotto & Lucky Day Evening
  let drawMinute = 22;

  if (scheduleText.includes('10:59') || scheduleText.includes('22:59')) {
    drawHour = 22;
    drawMinute = 59;
  } else if (scheduleText.includes('11:00') || scheduleText.includes('23:00')) {
    drawHour = 23;
    drawMinute = 0;
  } else if (scheduleText.includes('12:40')) {
    drawHour = 12;
    drawMinute = 40;
  } else if (scheduleText.includes('9:22') || scheduleText.includes('21:22')) {
    drawHour = 21;
    drawMinute = 22;
  }

  // A. Check for daily or twice daily games (e.g. Lucky Day Lotto, Pick 3/4)
  if (scheduleText.includes('daily') || scheduleText.includes('twice')) {
    const midday = new Date(now);
    midday.setHours(12, 40, 0, 0);

    const evening = new Date(now);
    evening.setHours(21, 22, 0, 0);

    if (now.getTime() < midday.getTime()) {
      return midday;
    } else if (now.getTime() < evening.getTime()) {
      return evening;
    } else {
      // Roll over to tomorrow's midday draw
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1);
      nextDay.setHours(12, 40, 0, 0);
      return nextDay;
    }
  }

  // B. Check for specific days of the week (e.g. Mon, Thu, Sat)
  const dayNamesMap: Record<string, number> = {
    sun: 0, sunday: 0,
    mon: 1, monday: 1,
    tue: 2, tuesday: 2,
    wed: 3, wednesday: 3,
    thu: 4, thursday: 4,
    fri: 5, friday: 5,
    sat: 6, saturday: 6
  };

  const targetedDays: number[] = [];
  Object.keys(dayNamesMap).forEach(key => {
    if (scheduleText.includes(key)) {
      const dayIndex = dayNamesMap[key];
      if (!targetedDays.includes(dayIndex)) {
        targetedDays.push(dayIndex);
      }
    }
  });

  if (targetedDays.length > 0) {
    for (let offset = 0; offset <= 7; offset++) {
      const candidate = new Date(now);
      candidate.setDate(now.getDate() + offset);
      candidate.setHours(drawHour, drawMinute, 0, 0);

      if (targetedDays.includes(candidate.getDay()) && candidate.getTime() > now.getTime()) {
        return candidate;
      }
    }
  }

  // C. Fallback: Default next draw within 20 hours
  const fallback = new Date(now.getTime() + (20 * 3600 + 45 * 60) * 1000);
  return fallback;
}

/**
 * Calculates remaining time broken down into days, hours, minutes, and seconds.
 */
function getTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date();
  const totalMilliseconds = targetDate.getTime() - now.getTime();

  if (totalMilliseconds <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMilliseconds: 0,
      isExpired: true,
      targetDrawDate: targetDate
    };
  }

  const seconds = Math.floor((totalMilliseconds / 1000) % 60);
  const minutes = Math.floor((totalMilliseconds / 1000 / 60) % 60);
  const hours = Math.floor((totalMilliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds,
    isExpired: false,
    targetDrawDate: targetDate
  };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDrawDate: propTargetDrawDate,
  targetDate,
  drawSchedule,
  variant = 'header',
  label = 'Next Draw Countdown',
  showSeconds = true,
  alwaysShowDays = false,
  enableReminder = false,
  onExpire,
  className = ''
}) => {
  const [reminderActive, setReminderActive] = useState(false);

  // Memoize initial target date calculation based on current date
  const targetDrawDate = useMemo(() => {
    return calculateNextDrawDate(propTargetDrawDate || targetDate, drawSchedule);
  }, [propTargetDrawDate, targetDate, drawSchedule]);

  const [time, setTime] = useState<TimeRemaining>(() => getTimeRemaining(targetDrawDate));

  useEffect(() => {
    // Recalculate immediately on target change
    setTime(getTimeRemaining(targetDrawDate));

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDrawDate);
      setTime(remaining);

      if (remaining.isExpired) {
        clearInterval(interval);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDrawDate, onExpire]);

  const isUrgent = time.days === 0 && time.hours < 4;
  const isCritical = time.days === 0 && time.hours < 1;

  // Formatted countdown representation with leading zeros (e.g. '02d : 14h : 30m : 15s')
  const daysStr = String(time.days).padStart(2, '0');
  const hoursStr = String(time.hours).padStart(2, '0');
  const minutesStr = String(time.minutes).padStart(2, '0');
  const secondsStr = String(time.seconds).padStart(2, '0');

  const formattedCountdownString = `${daysStr}d : ${hoursStr}h : ${minutesStr}m : ${secondsStr}s`;

  // Format friendly date string for the target draw
  const formattedDrawDate = useMemo(() => {
    return targetDrawDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }, [targetDrawDate]);

  // VARIANT 1: 'badge' or 'inline'
  if (variant === 'badge') {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wider ${
          isCritical
            ? 'bg-rose-950/80 text-rose-200 border border-rose-700'
            : isUrgent
            ? 'bg-amber-950/80 text-amber-200 border border-amber-700'
            : 'bg-slate-900 text-slate-100 border border-slate-700'
        } ${className}`}
        title={`Next draw: ${formattedDrawDate}`}
        aria-label={`Time remaining until draw: ${formattedCountdownString}`}
      >
        <Clock className={`w-3.5 h-3.5 shrink-0 ${isUrgent ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
        <span className="tabular-nums">
          {formattedCountdownString}
        </span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span 
        className={`font-mono font-bold text-xs sm:text-sm tabular-nums tracking-wider text-slate-100 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-700 ${className}`}
        title={`Next draw: ${formattedDrawDate}`}
        aria-label={`Time remaining until draw: ${formattedCountdownString}`}
      >
        {formattedCountdownString}
      </span>
    );
  }

  // VARIANT 2: 'card'
  if (variant === 'card') {
    return (
      <div className={`bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm ${className}`}>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-300 uppercase tracking-wider">{label}</span>
          <span className="text-[11px] text-slate-400">{formattedDrawDate}</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center" aria-label={formattedCountdownString}>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
            <span className="block font-mono font-bold text-xl text-white tabular-nums">
              {daysStr}<span className="text-xs text-slate-400 font-medium ml-0.5">d</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Days</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
            <span className="block font-mono font-bold text-xl text-white tabular-nums">
              {hoursStr}<span className="text-xs text-slate-400 font-medium ml-0.5">h</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Hours</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
            <span className="block font-mono font-bold text-xl text-amber-400 tabular-nums">
              {minutesStr}<span className="text-xs text-amber-400/80 font-medium ml-0.5">m</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Mins</span>
          </div>
          <div className="bg-slate-950 border border-amber-500/30 rounded-lg p-2">
            <span className="block font-mono font-bold text-xl text-amber-400 tabular-nums animate-pulse">
              {secondsStr}<span className="text-xs text-amber-400/80 font-medium ml-0.5">s</span>
            </span>
            <span className="text-[10px] text-amber-300 uppercase font-semibold">Secs</span>
          </div>
        </div>
      </div>
    );
  }

  // VARIANT 3: 'header' (Clean, professional typography crafted for the LotteryDetailPage header)
  const shouldDisplayDays = alwaysShowDays || time.days > 0;

  return (
    <div 
      className={`bg-slate-900/90 border border-slate-800/90 rounded-xl p-3.5 sm:p-4 shadow-sm flex flex-col justify-between ${className}`}
      aria-label={`Countdown to next draw: ${formattedCountdownString}`}
    >
      {/* Eyebrow & Status Indicator */}
      <div className="flex items-center justify-between gap-3 text-xs mb-2.5 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isCritical ? 'bg-rose-400' : 'bg-amber-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isCritical ? 'bg-rose-500' : 'bg-amber-400'
            }`} />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {enableReminder && (
            <button
              type="button"
              onClick={() => setReminderActive(!reminderActive)}
              aria-label={reminderActive ? "Cutoff alert enabled" : "Enable cutoff alert"}
              className={`min-h-[28px] px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                reminderActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {reminderActive ? <BellRing className="w-3 h-3 text-emerald-400" /> : <Bell className="w-3 h-3 text-amber-400" />}
              <span className="hidden xs:inline">{reminderActive ? 'Alert Set' : 'Remind'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{formattedDrawDate}</span>
          </div>
        </div>
      </div>

      {/* Professional Typographic Digits Display (e.g., 02d : 14h : 30m : 15s) */}
      <div className="flex items-center justify-between sm:justify-center gap-1 xs:gap-1.5 sm:gap-2 text-center py-1 w-full max-w-full overflow-hidden">
        {/* Days */}
        {shouldDisplayDays && (
          <>
            <div className="flex flex-col items-center flex-1 min-w-[38px] max-w-[64px] sm:min-w-[54px]">
              <div className="w-full bg-slate-950 border border-slate-700/80 rounded-md py-1 sm:py-1.5 px-1 sm:px-2 flex items-baseline justify-center gap-0.5 shadow-inner">
                <span className="font-mono text-lg xs:text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
                  {daysStr}
                </span>
                <span className="font-mono text-[10px] sm:text-xs font-semibold text-slate-400">d</span>
              </div>
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Days
              </span>
            </div>
            <span className="text-slate-500 font-mono font-bold text-base sm:text-xl -mt-3.5 sm:-mt-4 shrink-0">:</span>
          </>
        )}

        {/* Hours */}
        <div className="flex flex-col items-center flex-1 min-w-[38px] max-w-[64px] sm:min-w-[54px]">
          <div className="w-full bg-slate-950 border border-slate-700/80 rounded-md py-1 sm:py-1.5 px-1 sm:px-2 flex items-baseline justify-center gap-0.5 shadow-inner">
            <span className="font-mono text-lg xs:text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {hoursStr}
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-semibold text-slate-400">h</span>
          </div>
          <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Hours
          </span>
        </div>

        <span className="text-slate-500 font-mono font-bold text-base sm:text-xl -mt-3.5 sm:-mt-4 shrink-0">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center flex-1 min-w-[38px] max-w-[64px] sm:min-w-[54px]">
          <div className="w-full bg-slate-950 border border-slate-700/80 rounded-md py-1 sm:py-1.5 px-1 sm:px-2 flex items-baseline justify-center gap-0.5 shadow-inner">
            <span className="font-mono text-lg xs:text-xl sm:text-2xl font-extrabold text-amber-300 tabular-nums tracking-tight">
              {minutesStr}
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-semibold text-amber-400/80">m</span>
          </div>
          <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Mins
          </span>
        </div>

        {showSeconds && (
          <>
            <span className="text-slate-500 font-mono font-bold text-base sm:text-xl -mt-3.5 sm:-mt-4 shrink-0">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center flex-1 min-w-[38px] max-w-[64px] sm:min-w-[54px]">
              <div className="w-full bg-slate-950 border border-amber-500/40 rounded-md py-1 sm:py-1.5 px-1 sm:px-2 flex items-baseline justify-center gap-0.5 shadow-inner">
                <span className="font-mono text-lg xs:text-xl sm:text-2xl font-extrabold text-amber-400 tabular-nums tracking-tight animate-pulse">
                  {secondsStr}
                </span>
                <span className="font-mono text-[10px] sm:text-xs font-semibold text-amber-400/90">s</span>
              </div>
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-1">
                Secs
              </span>
            </div>
          </>
        )}
      </div>

      {/* Subtext Footer */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Cutoff: 15m prior to draw</span>
        </span>
        <span className="font-semibold text-slate-300 uppercase tracking-wider">
          Audited Drawing
        </span>
      </div>
    </div>
  );
};
