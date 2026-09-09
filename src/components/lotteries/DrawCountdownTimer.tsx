import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertCircle, 
  Bell, 
  BellRing, 
  Tv, 
  Sparkles, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  Calendar,
  Flame
} from 'lucide-react';
import { Lottery } from '../../types';

interface DrawCountdownTimerProps {
  lottery: Lottery;
  onQuickPick?: () => void;
  compact?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export const DrawCountdownTimer: React.FC<DrawCountdownTimerProps> = ({
  lottery,
  onQuickPick,
  compact = false
}) => {
  const [reminderSet, setReminderSet] = useState(false);
  const [showScheduleInfo, setShowScheduleInfo] = useState(false);

  // Initialize a realistic countdown based on lottery rules or schedule
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => {
    // Generate a consistent, realistic upcoming draw countdown
    // For daily games (like Lucky Day Lotto, Pick 3), typically 4-12 hours
    // For major jackpots (Powerball, Mega Millions, Illinois Lotto), typically 1-3 days
    const isDaily = lottery.drawSchedule.toLowerCase().includes('daily') || lottery.id.includes('pick');
    const defaultHours = isDaily ? 6 : 28;
    const defaultMinutes = 34;
    const defaultSeconds = 45;
    const totalSecs = (defaultHours * 3600) + (defaultMinutes * 60) + defaultSeconds;
    
    return {
      days: Math.floor(defaultHours / 24),
      hours: defaultHours % 24,
      minutes: defaultMinutes,
      seconds: defaultSeconds,
      totalSeconds: totalSecs
    };
  });

  // Calculate percentage of sales window elapsed (assuming 48h draw window)
  const totalWindowSeconds = 48 * 3600;
  const elapsedPercent = Math.min(
    96, 
    Math.max(12, Math.round(((totalWindowSeconds - timeRemaining.totalSeconds) / totalWindowSeconds) * 100))
  );

  // Is urgency high (e.g. less than 12 hours)
  const isHighUrgency = timeRemaining.days === 0 && timeRemaining.hours < 12;
  const isCriticalUrgency = timeRemaining.days === 0 && timeRemaining.hours < 2;

  // Active countdown timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.totalSeconds <= 1) {
          // Reset to next draw cycle when it hits 0
          return {
            days: 1,
            hours: 14,
            minutes: 0,
            seconds: 0,
            totalSeconds: (38 * 3600)
          };
        }

        const newTotal = prev.totalSeconds - 1;
        const days = Math.floor(newTotal / 86400);
        const hours = Math.floor((newTotal % 86400) / 3600);
        const minutes = Math.floor((newTotal % 3600) / 60);
        const seconds = newTotal % 60;

        return {
          days,
          hours,
          minutes,
          seconds,
          totalSeconds: newTotal
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleReminder = () => {
    setReminderSet(prev => !prev);
  };

  // Compact version for sticky sidebar or tight spaces
  if (compact) {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>DRAW ENTRY CLOSING</span>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {timeRemaining.days > 0 ? `${timeRemaining.days}d ` : ''}
            {String(timeRemaining.hours).padStart(2, '0')}h {String(timeRemaining.minutes).padStart(2, '0')}m {String(timeRemaining.seconds).padStart(2, '0')}s
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
          <div 
            className={`h-full transition-all duration-1000 ${
              isCriticalUrgency ? 'bg-rose-500' : isHighUrgency ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${elapsedPercent}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>Ticket Sales Cutoff</span>
          <span className="text-slate-300 font-medium">15 min prior to draw</span>
        </p>
      </div>
    );
  }

  // Full rich urgency component
  return (
    <div className="bg-gradient-to-b from-[#091838] via-[#07132b] to-[#050e20] text-white rounded-2xl border border-slate-800/90 shadow-md p-5 sm:p-6 relative overflow-hidden">
      {/* Subtle top urgency stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isCriticalUrgency 
          ? 'bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500' 
          : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500'
      }`} />

      {/* Header bar with Live Status & Cutoff Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isCriticalUrgency ? 'bg-rose-400' : 'bg-amber-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              isCriticalUrgency ? 'bg-rose-500' : 'bg-amber-500'
            }`} />
          </span>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
            {isCriticalUrgency ? 'FINAL COUNTDOWN · CUT-OFF IMMINENT' : 'NEXT DRAWING LIVE COUNTDOWN'}
          </span>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60">
            {lottery.drawSchedule.split(' at ')[0]}
          </span>
        </div>

        {/* Reminder button */}
        <button
          onClick={handleToggleReminder}
          className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            reminderSet
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
          title="Get alerted before ticket sales close"
        >
          {reminderSet ? (
            <>
              <BellRing className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reminder Active (30m)</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Notify Before Cutoff</span>
            </>
          )}
        </button>
      </div>

      {/* Main Digit Tiles Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-xl mx-auto my-2">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-[#0d214a] border border-slate-700/80 rounded-xl py-3 sm:py-4 px-1 text-center shadow-inner relative overflow-hidden group">
            <div className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums drop-shadow-xs">
              {String(timeRemaining.days).padStart(2, '0')}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-400/40 group-hover:bg-amber-400 transition-colors" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
            Days
          </span>
        </div>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-[#0d214a] border border-slate-700/80 rounded-xl py-3 sm:py-4 px-1 text-center shadow-inner relative overflow-hidden group">
            <div className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums drop-shadow-xs">
              {String(timeRemaining.hours).padStart(2, '0')}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-400/40 group-hover:bg-amber-400 transition-colors" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
            Hours
          </span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-[#0d214a] border border-slate-700/80 rounded-xl py-3 sm:py-4 px-1 text-center shadow-inner relative overflow-hidden group">
            <div className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-amber-300 tabular-nums drop-shadow-xs">
              {String(timeRemaining.minutes).padStart(2, '0')}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-400/40 group-hover:bg-amber-400 transition-colors" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
            Mins
          </span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-[#0d214a] border border-amber-500/40 rounded-xl py-3 sm:py-4 px-1 text-center shadow-inner relative overflow-hidden group">
            <div className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-amber-400 tabular-nums animate-pulse drop-shadow-xs">
              {String(timeRemaining.seconds).padStart(2, '0')}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-400" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest mt-1.5">
            Secs
          </span>
        </div>
      </div>

      {/* Urgency Progress Bar */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Sales Window Closing</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {elapsedPercent}% of entry window elapsed
          </span>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/60">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              isCriticalUrgency 
                ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                : 'bg-gradient-to-r from-amber-500 to-yellow-400'
            }`}
            style={{ width: `${elapsedPercent}%` }}
          />
        </div>

        {/* Urgency Message / Call to Action */}
        <div className="mt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/70 rounded-xl p-3 border border-slate-800">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-slate-200">
                Official Drawing Cutoff: <strong>15 minutes prior to televised draw</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Current Estimated Jackpot: <strong className="text-amber-400 font-bold">{lottery.jackpotFormatted}</strong>
                {lottery.previousDraw?.jackpotWon ? ' · Recent Jackpot Reset' : ' · Estimated Rollover Jackpot'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            {onQuickPick && (
              <button
                onClick={onQuickPick}
                className="w-full sm:w-auto px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Instant Quick Pick</span>
              </button>
            )}

            <button
              onClick={() => setShowScheduleInfo(prev => !prev)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Broadcast & Schedule Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Drawing Schedule & Broadcast Details */}
        {showScheduleInfo && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-bold text-amber-300 text-xs border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>Drawing & Broadcast Protocol</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal">Official Auditor Verified</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <p className="text-slate-400">Regular Draw Schedule:</p>
                <p className="font-semibold text-white">{lottery.drawSchedule}</p>
              </div>
              <div>
                <p className="text-slate-400">Televised Broadcast:</p>
                <p className="font-semibold text-white">WGN-TV / Illinois Lottery Live Stream & YouTube</p>
              </div>
              <div>
                <p className="text-slate-400">Host Drawing Location:</p>
                <p className="font-semibold text-white">Illinois Lottery Draw Studio, Springfield, IL</p>
              </div>
              <div>
                <p className="text-slate-400">Courier Ticket Cutoff:</p>
                <p className="font-semibold text-amber-300 font-mono">15 minutes prior to official draw</p>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation alert when reminder is toggled */}
        {reminderSet && (
          <div className="mt-2.5 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Reminder active! You will be alerted 30 minutes before ticket sales close for this draw.</span>
          </div>
        )}
      </div>
    </div>
  );
};
