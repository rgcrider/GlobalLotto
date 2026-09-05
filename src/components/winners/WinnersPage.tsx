import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Calculator, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Percent,
  ArrowRight
} from 'lucide-react';
import { WINNER_STORIES } from '../../data/testimonials';
import { useApp } from '../../context/AppContext';

interface WinnersPageProps {
  onSelectLottery: (id: string) => void;
}

export const WinnersPage: React.FC<WinnersPageProps> = ({ onSelectLottery }) => {
  const { formatMoney } = useApp();

  // Payout calculator states
  const [jackpotInput, setJackpotInput] = useState<number>(500); // in millions
  const [payoutOption, setPayoutOption] = useState<'cash' | 'annuity'>('cash');
  const [federalTaxRate, setFederalTaxRate] = useState<number>(30); // 30% for non-resident US
  const [stateTaxRate, setStateTaxRate] = useState<number>(8); // 8%

  // Calculation
  const advertisedAmount = jackpotInput * 1_000_000;
  const cashValue = advertisedAmount * 0.52; // cash option is typically ~52% of annuity jackpot
  const basePreTax = payoutOption === 'cash' ? cashValue : advertisedAmount;
  const totalTaxRate = (federalTaxRate + stateTaxRate) / 100;
  const estimatedTax = basePreTax * totalTaxRate;
  const netPayout = basePreTax - estimatedTax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#06142e] via-[#092250] to-[#0c3175] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Real Players. Real Payouts.</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
            Winner Stories & Prize Payouts
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Over $8.4 Billion in prizes safely claimed by international players across 140+ countries. 100% Commission-Free.
          </p>
        </div>
      </div>

      {/* Interactive Jackpot Tax & Payout Calculator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Interactive US Jackpot Tax & Payout Calculator
            </h2>
            <p className="text-xs text-slate-500">
              Simulate cash lump-sum vs. 30-year annuity payouts including non-resident withholding taxes for Powerball & Mega Millions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Form Inputs (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Advertised Jackpot Amount:</span>
                <span className="text-blue-600 text-sm font-black font-display">${jackpotInput} Million</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={jackpotInput}
                onChange={e => setJackpotInput(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payout Method</label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPayoutOption('cash')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      payoutOption === 'cash' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Cash Option
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutOption('annuity')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      payoutOption === 'annuity' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    30-Yr Annuity
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Non-Resident Withholding</label>
                <select
                  value={federalTaxRate}
                  onChange={e => setFederalTaxRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                >
                  <option value={30}>30% (Standard Non-Resident US)</option>
                  <option value={24}>24% (US Citizen Federal)</option>
                  <option value={0}>0% (EU Lotteries / Tax-Free Countries)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calculator Output Display (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 shadow-inner space-y-4">
            <div className="flex justify-between items-baseline border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400">Pre-Tax Gross Value:</span>
              <span className="text-sm font-bold text-white font-mono">{formatMoney(basePreTax)}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-800 pb-3 text-rose-400">
              <span className="text-xs">Estimated Taxes ({federalTaxRate + stateTaxRate}%):</span>
              <span className="text-sm font-bold font-mono">-{formatMoney(estimatedTax)}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-800 pb-3 text-emerald-400">
              <span className="text-xs">GlobalLotto Commission:</span>
              <span className="text-sm font-bold font-mono">$0.00 (100% Free)</span>
            </div>
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm font-bold text-slate-300">Estimated Net Cash Received:</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
                {formatMoney(netPayout)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Winners Stories */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Real Verified Winners
          </h2>
          <p className="text-xs text-slate-500">
            Read how everyday players changed their families' futures playing international lotteries through our concierge courier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WINNER_STORIES.map(story => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={story.avatarUrl}
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{story.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{story.country}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 mb-4">
                  <p className="text-[10px] uppercase font-bold text-amber-800">Prize Payout</p>
                  <p className="text-xl font-black text-amber-600 font-display">
                    {story.prizeAmount}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{story.lotteryName} • {story.date}</p>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Payout
                </span>
                <button
                  onClick={() => onSelectLottery('powerball')}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Play Today →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
