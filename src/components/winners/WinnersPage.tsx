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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-[#07132b] text-white rounded-lg border border-slate-800 p-5 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Real Players · Real Payouts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Winner Stories & Prize Payouts
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Over $8.4 Billion in prizes safely claimed by international players across 140+ countries. 100% Commission-Free.
          </p>
        </div>
      </div>

      {/* Interactive Jackpot Tax & Payout Calculator */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Interactive US Jackpot Tax & Payout Calculator
            </h2>
            <p className="text-xs text-slate-500">
              Simulate cash lump-sum vs. 30-year annuity payouts including non-resident withholding taxes for Powerball & Mega Millions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
          {/* Form Inputs (6 cols) */}
          <div className="lg:col-span-6 space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Advertised Jackpot Amount:</span>
                <span className="text-slate-900 text-sm font-bold">${jackpotInput} Million</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={jackpotInput}
                onChange={e => setJackpotInput(Number(e.target.value))}
                className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Payout Method</label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPayoutOption('cash')}
                    className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors ${
                      payoutOption === 'cash' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Cash Option
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutOption('annuity')}
                    className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors ${
                      payoutOption === 'annuity' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    30-Yr Annuity
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Non-Resident Withholding</label>
                <select
                  value={federalTaxRate}
                  onChange={e => setFederalTaxRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                >
                  <option value={30}>30% (Standard Non-Resident US)</option>
                  <option value={24}>24% (US Citizen Federal)</option>
                  <option value={0}>0% (EU Lotteries / Tax-Free Countries)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calculator Output Display (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 text-white rounded-lg p-5 space-y-3">
            <div className="flex justify-between items-baseline border-b border-slate-800 pb-2.5">
              <span className="text-xs text-slate-400">Pre-Tax Gross Value:</span>
              <span className="text-xs font-semibold text-white font-mono">{formatMoney(basePreTax)}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-800 pb-2.5 text-rose-400">
              <span className="text-xs">Estimated Taxes ({federalTaxRate + stateTaxRate}%):</span>
              <span className="text-xs font-semibold font-mono">-{formatMoney(estimatedTax)}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-800 pb-2.5 text-emerald-400">
              <span className="text-xs">GlobalLotto Commission:</span>
              <span className="text-xs font-semibold font-mono">$0.00 (100% Free)</span>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs font-semibold text-slate-300">Estimated Net Cash Received:</span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400">
                {formatMoney(netPayout)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Winners Stories */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Real Verified Winners
          </h2>
          <p className="text-xs text-slate-500">
            Read how everyday players changed their families' futures playing international lotteries through our concierge courier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WINNER_STORIES.map(story => (
            <div
              key={story.id}
              className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <img
                    src={story.avatarUrl}
                    alt={story.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{story.name}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{story.country}</span>
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded border border-slate-100 mb-3">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Prize Payout</p>
                  <p className="text-lg font-extrabold text-slate-900">
                    {story.prizeAmount}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{story.lotteryName} · {story.date}</p>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Payout
                </span>
                <button
                  onClick={() => onSelectLottery('powerball')}
                  className="text-slate-800 hover:text-slate-950 font-semibold"
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
