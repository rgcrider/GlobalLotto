import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Trophy, 
  Clock, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ResultsPageProps {
  onSelectLottery: (id: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onSelectLottery }) => {
  const { lotteries, formatMoney } = useApp();

  // "Did I Win?" Checker tool state
  const [selectedLotteryId, setSelectedLotteryId] = useState<string>('powerball');
  const [inputNumbers, setInputNumbers] = useState<string>('12, 24, 33, 45, 61');
  const [inputBonus, setInputBonus] = useState<string>('07');
  const [checkResult, setCheckResult] = useState<{
    matchedMain: number[];
    matchedBonus: number[];
    prizeWon: string;
  } | null>(null);

  const selectedLottery = lotteries.find(l => l.id === selectedLotteryId) || lotteries[0];

  const handleRunCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMain = inputNumbers.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    const parsedBonus = inputBonus.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

    const prev = selectedLottery.previousDraw;
    if (!prev) return;

    const matchedMain = parsedMain.filter(n => prev.winningMainNumbers.includes(n));
    const matchedBonus = parsedBonus.filter(b => prev.winningBonusNumbers.includes(b));

    let prize = 'No prize on this combination. Better luck on the next draw!';
    if (matchedMain.length === 5 && matchedBonus.length >= 1) {
      prize = `JACKPOT WINNER! You matched 5 + Bonus: ${prev.jackpotAmount}!`;
    } else if (matchedMain.length === 5) {
      prize = 'Second Tier Match! Estimated prize: $1,000,000.00!';
    } else if (matchedMain.length === 4 && matchedBonus.length >= 1) {
      prize = 'Match 4 + Bonus! Estimated prize: $50,000.00!';
    } else if (matchedMain.length >= 3) {
      prize = 'Match 3! Estimated prize: $100.00!';
    } else if (matchedBonus.length >= 1) {
      prize = 'Bonus Ball Match! Estimated prize: $4.00 (Free line equivalent)!';
    }

    setCheckResult({
      matchedMain,
      matchedBonus,
      prizeWon: prize
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Official Result Center</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-display">
            Lottery Results & Winning Numbers
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Directly verified draws from official international lottery state operators.
          </p>
        </div>
      </div>

      {/* "Did I Win?" Quick Checker Tool */}
      <div className="bg-[#07132b] text-white rounded-lg border border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="max-w-2xl">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Verification</span>
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            "Did I Win?" Automatic Ticket Checker
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Check your numbers against the latest verified official draw to calculate your prize immediately.
          </p>
        </div>

        <form onSubmit={handleRunCheck} className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
          <div className="sm:col-span-4">
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Select Lottery</label>
            <select
              value={selectedLotteryId}
              onChange={e => {
                setSelectedLotteryId(e.target.value);
                setCheckResult(null);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {lotteries.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.country})</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Main Numbers (Comma separated)</label>
            <input
              type="text"
              value={inputNumbers}
              onChange={e => setInputNumbers(e.target.value)}
              placeholder="e.g. 12, 24, 33, 45, 61"
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Bonus Ball</label>
            <input
              type="text"
              value={inputBonus}
              onChange={e => setInputBonus(e.target.value)}
              placeholder="07"
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold py-1.5 rounded text-xs transition-colors shadow-xs"
            >
              Check Ticket
            </button>
          </div>
        </form>

        {/* Checker Result Display */}
        {checkResult && (
          <div className="mt-4 p-3.5 rounded-lg bg-slate-900/90 border border-amber-400/30 space-y-1.5">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white">Result for {selectedLottery.name}:</h4>
            </div>
            <p className="text-xs font-bold text-amber-300">{checkResult.prizeWon}</p>
            <div className="flex gap-4 text-[11px] text-slate-300 pt-0.5">
              <span>Main matches: <strong className="text-white">{checkResult.matchedMain.length > 0 ? checkResult.matchedMain.join(', ') : 'None'}</strong></span>
              <span>Bonus matches: <strong className="text-white">{checkResult.matchedBonus.length > 0 ? checkResult.matchedBonus.join(', ') : 'None'}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Official Draw Results Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Latest Official Draw Records
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lotteries.map(lot => {
            const prev = lot.previousDraw;
            return (
              <div
                key={lot.id}
                className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-md ${lot.logoBg} flex items-center justify-center font-bold ${lot.logoColor} text-xs`}>
                        {lot.name.substring(0, 3)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{lot.name}</h4>
                        <p className="text-xs text-slate-500">{lot.flag} {lot.country}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {prev?.date || 'Apr 2025'}
                    </span>
                  </div>

                  {/* Winning Balls Display with tactile styling */}
                  <div className="my-4 flex items-center justify-center gap-1.5 flex-wrap">
                    {prev?.winningMainNumbers.map((n, i) => (
                      <span
                        key={i}
                        className="lottery-ball-main w-8 h-8 rounded-full text-slate-900 font-bold text-xs flex items-center justify-center"
                      >
                        {String(n).padStart(2, '0')}
                      </span>
                    ))}
                    {prev?.winningBonusNumbers.map((b, i) => (
                      <span
                        key={`b-${i}`}
                        className="lottery-ball-bonus w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center"
                        title={lot.rules.bonusName}
                      >
                        {String(b).padStart(2, '0')}
                      </span>
                    ))}
                  </div>

                  {/* Jackpot status */}
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-center text-xs space-y-0.5">
                    <p className="text-[11px] text-slate-500">
                      {prev?.jackpotWon ? 'Jackpot Won!' : 'Rolled Over to next draw'}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">
                      {prev?.jackpotAmount}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-500 block text-[10px]">Next Draw:</span>
                    <span className="font-semibold text-slate-900">{lot.jackpotFormatted}</span>
                  </div>
                  <button
                    onClick={() => onSelectLottery(lot.id)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded text-xs transition-colors shadow-xs"
                  >
                    Play Next Draw
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
