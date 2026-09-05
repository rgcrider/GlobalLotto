import React, { useState } from 'react';
import { 
  Trophy, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Globe, 
  Zap, 
  Percent, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface JackpotCenterPageProps {
  onSelectLottery: (id: string) => void;
}

export const JackpotCenterPage: React.FC<JackpotCenterPageProps> = ({ onSelectLottery }) => {
  const { lotteries, formatMoney } = useApp();
  const [sizeFilter, setSizeFilter] = useState<'all' | 'billion' | '500m' | '100m'>('all');

  const filtered = lotteries.filter(lot => {
    if (sizeFilter === 'billion') return lot.jackpotAmount >= 1000;
    if (sizeFilter === '500m') return lot.jackpotAmount >= 500;
    if (sizeFilter === '100m') return lot.jackpotAmount >= 100;
    return true;
  }).sort((a, b) => b.jackpotAmount - a.jackpotAmount);

  const topJackpot = lotteries.reduce((prev, curr) => (curr.jackpotAmount > prev.jackpotAmount ? curr : prev), lotteries[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Mega Jackpot Spotlight */}
      <div className="bg-gradient-to-r from-[#06142e] via-[#092250] to-[#0c3175] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>#1 Highest Global Jackpot</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            {topJackpot.name}: <span className="text-amber-400">{topJackpot.jackpotFormatted}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Record rollover reached! Purchase your official entry lines before draw cutoff tonight. Verified courier proof guaranteed.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectLottery(topJackpot.id)}
              className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-amber-400/20 transition-all hover:scale-105"
            >
              <span>Play {topJackpot.name}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Big Jackpot Display Badge */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shrink-0 w-full sm:w-auto">
          <p className="text-xs text-slate-300 uppercase font-bold tracking-wider">Official Draw Closes In</p>
          <p className="text-3xl sm:text-4xl font-black text-amber-300 font-mono mt-1">14h 22m 10s</p>
          <p className="text-xs text-slate-400 mt-2">{topJackpot.country} • Ticket: {formatMoney(topJackpot.ticketPrice)}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Active Global Jackpots Tracker
          </h2>
          <p className="text-xs text-slate-500">Live tracker updated in real time from international lottery commissions.</p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'billion', '500m', '100m'] as const).map(f => (
            <button
              key={f}
              onClick={() => setSizeFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                sizeFilter === f
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? 'All Jackpots' : f === 'billion' ? '$1 Billion+' : f === '500m' ? '$500M+' : '$100M+'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(lot => (
          <div
            key={lot.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-12 h-12 rounded-xl ${lot.logoBg} flex items-center justify-center font-black ${lot.logoColor} text-xs font-display`}>
                    {lot.name.substring(0, 3)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{lot.name}</h3>
                    <p className="text-xs text-slate-500">{lot.flag} {lot.country}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Rolled Over</span>
                </span>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs text-slate-500 font-medium">Estimated Jackpot</p>
                <p className="text-3xl font-black text-blue-900 font-display">
                  {lot.jackpotFormatted}
                </p>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Draw Cutoff:</span>
                  <span className="font-semibold text-slate-800">{lot.nextDrawDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Concierge Entry From:</span>
                  <span className="font-bold text-slate-900">{formatMoney(lot.ticketPrice)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => onSelectLottery(lot.id)}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                Play This Jackpot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
