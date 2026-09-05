import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Clock, 
  Sparkles, 
  Trash2, 
  Copy, 
  Plus, 
  RotateCcw, 
  Shuffle, 
  Star, 
  Bookmark, 
  ShieldCheck, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Info,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lottery, TicketLine, DrawOption, CartItem } from '../../types';

interface LotteryDetailPageProps {
  lotteryId: string;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  onProceedToCheckout: (item: CartItem) => void;
}

export const LotteryDetailPage: React.FC<LotteryDetailPageProps> = ({
  lotteryId,
  onBack: _onBack,
  onAddToCart,
  onProceedToCheckout
}) => {
  const { lotteries, formatMoney, user, saveFavoriteNumber } = useApp();
  const lottery = lotteries.find(l => l.id === lotteryId) || lotteries[0];

  // Multiple Ticket Lines
  const [lines, setLines] = useState<TicketLine[]>([
    { id: 'line-1', mainNumbers: [], bonusNumbers: [] },
    { id: 'line-2', mainNumbers: [], bonusNumbers: [] },
    { id: 'line-3', mainNumbers: [], bonusNumbers: [] }
  ]);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);

  // Draw options
  const [drawOption, setDrawOption] = useState<DrawOption>('single');
  const [activeTab, setActiveTab] = useState<'picker' | 'how-to-play' | 'prize-tiers' | 'faq'>('picker');
  const [showSavedFavs, setShowSavedFavs] = useState(false);
  const [favoriteNameInput, setFavoriteNameInput] = useState('');

  // Countdown timer simulation
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 22, seconds: 18 });
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c.seconds > 0) return { ...c, seconds: c.seconds - 1 };
        if (c.minutes > 0) return { ...c, minutes: 59, seconds: 59 };
        if (c.hours > 0) return { ...c, hours: c.hours - 1, minutes: 59, seconds: 59 };
        return c;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Rules shortcuts
  const { rules } = lottery;

  // Multi-draw discounts
  const discountMultipliers: Record<DrawOption, { discountPct: number; drawsCount: number; label: string }> = {
    single: { discountPct: 0, drawsCount: 1, label: 'Single Draw' },
    '2draws': { discountPct: 0.05, drawsCount: 2, label: '2 Draws (Save 5%)' },
    '5draws': { discountPct: 0.10, drawsCount: 5, label: '5 Draws (Save 10%)' },
    '10draws': { discountPct: 0.15, drawsCount: 10, label: '10 Draws (Save 15%)' },
    subscription: { discountPct: 0.20, drawsCount: 8, label: 'Monthly Subscription (Save 20%)' }
  };

  // Pricing calculations
  const totalRawCost = lines.length * (lottery.ticketPrice + lottery.serviceFee) * discountMultipliers[drawOption].drawsCount;
  const discountAmount = totalRawCost * discountMultipliers[drawOption].discountPct;
  const finalPrice = totalRawCost - discountAmount;

  // Toggle main number in currently active line
  const handleToggleMainNumber = (num: number) => {
    setLines(prev => {
      const updated = [...prev];
      const curLine = { ...updated[activeLineIndex] };
      const exists = curLine.mainNumbers.includes(num);

      if (exists) {
        curLine.mainNumbers = curLine.mainNumbers.filter(n => n !== num);
      } else {
        if (curLine.mainNumbers.length < rules.mainNumbersCount) {
          curLine.mainNumbers = [...curLine.mainNumbers, num].sort((a, b) => a - b);
        }
      }
      updated[activeLineIndex] = curLine;
      return updated;
    });
  };

  // Toggle bonus number in currently active line
  const handleToggleBonusNumber = (num: number) => {
    setLines(prev => {
      const updated = [...prev];
      const curLine = { ...updated[activeLineIndex] };
      const exists = curLine.bonusNumbers.includes(num);

      if (exists) {
        curLine.bonusNumbers = curLine.bonusNumbers.filter(n => n !== num);
      } else {
        if (curLine.bonusNumbers.length < rules.bonusNumbersCount) {
          curLine.bonusNumbers = [...curLine.bonusNumbers, num].sort((a, b) => a - b);
        }
      }
      updated[activeLineIndex] = curLine;
      return updated;
    });
  };

  // Generate random line
  const generateRandomLine = (): TicketLine => {
    const mainPool = Array.from({ length: rules.mainMaxNumber - rules.mainMinNumber + 1 }, (_, i) => i + rules.mainMinNumber);
    const chosenMain: number[] = [];
    while (chosenMain.length < rules.mainNumbersCount) {
      const idx = Math.floor(Math.random() * mainPool.length);
      chosenMain.push(mainPool.splice(idx, 1)[0]);
    }
    chosenMain.sort((a, b) => a - b);

    const bonusPool = Array.from({ length: rules.bonusMaxNumber - rules.bonusMinNumber + 1 }, (_, i) => i + rules.bonusMinNumber);
    const chosenBonus: number[] = [];
    while (chosenBonus.length < rules.bonusNumbersCount) {
      const idx = Math.floor(Math.random() * bonusPool.length);
      chosenBonus.push(bonusPool.splice(idx, 1)[0]);
    }
    chosenBonus.sort((a, b) => a - b);

    return {
      id: `line-${Date.now()}-${Math.random()}`,
      mainNumbers: chosenMain,
      bonusNumbers: chosenBonus
    };
  };

  // Quick pick for current line
  const handleQuickPickCurrent = () => {
    const randomL = generateRandomLine();
    setLines(prev => {
      const updated = [...prev];
      updated[activeLineIndex] = { ...randomL, id: updated[activeLineIndex].id };
      return updated;
    });
  };

  // Quick pick all lines
  const handleQuickPickAll = () => {
    setLines(prev => prev.map(l => ({ ...generateRandomLine(), id: l.id })));
  };

  // Clear current line
  const handleClearCurrent = () => {
    setLines(prev => {
      const updated = [...prev];
      updated[activeLineIndex] = { id: updated[activeLineIndex].id, mainNumbers: [], bonusNumbers: [] };
      return updated;
    });
  };

  // Add line
  const handleAddLine = () => {
    if (lines.length >= 25) return;
    const newL = generateRandomLine();
    setLines(prev => [...prev, newL]);
    setActiveLineIndex(lines.length);
  };

  // Duplicate line
  const handleDuplicateLine = (index: number) => {
    const target = lines[index];
    const duplicated: TicketLine = {
      id: `line-${Date.now()}`,
      mainNumbers: [...target.mainNumbers],
      bonusNumbers: [...target.bonusNumbers]
    };
    setLines(prev => [...prev, duplicated]);
  };

  // Delete line
  const handleDeleteLine = (index: number) => {
    if (lines.length <= 1) {
      handleClearCurrent();
      return;
    }
    setLines(prev => prev.filter((_, i) => i !== index));
    if (activeLineIndex >= lines.length - 1) {
      setActiveLineIndex(Math.max(0, lines.length - 2));
    }
  };

  // Set line counts (1, 3, 5, 10, 20 lines)
  const handleSetLineCount = (count: number) => {
    const newLines: TicketLine[] = [];
    for (let i = 0; i < count; i++) {
      if (i < lines.length && (lines[i].mainNumbers.length > 0 || lines[i].bonusNumbers.length > 0)) {
        newLines.push(lines[i]);
      } else {
        newLines.push(generateRandomLine());
      }
    }
    setLines(newLines);
    setActiveLineIndex(0);
  };

  // Lucky numbers generator (preset lucky patterns)
  const handleLuckyNumbers = () => {
    const luckyPrimes = [7, 11, 13, 17, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67].filter(n => n <= rules.mainMaxNumber);
    const chosen: number[] = [];
    while (chosen.length < rules.mainNumbersCount && luckyPrimes.length > 0) {
      const idx = Math.floor(Math.random() * luckyPrimes.length);
      chosen.push(luckyPrimes.splice(idx, 1)[0]);
    }
    chosen.sort((a, b) => a - b);

    const bonus = Math.min(rules.bonusMaxNumber, 7);
    setLines(prev => {
      const updated = [...prev];
      updated[activeLineIndex] = {
        ...updated[activeLineIndex],
        mainNumbers: chosen,
        bonusNumbers: [bonus]
      };
      return updated;
    });
  };

  // Load favorite numbers
  const handleLoadFavorite = (main: number[], bonus: number[]) => {
    setLines(prev => {
      const updated = [...prev];
      updated[activeLineIndex] = {
        ...updated[activeLineIndex],
        mainNumbers: main,
        bonusNumbers: bonus
      };
      return updated;
    });
    setShowSavedFavs(false);
  };

  // Save current line as favorite
  const handleSaveAsFavorite = () => {
    const current = lines[activeLineIndex];
    if (current.mainNumbers.length !== rules.mainNumbersCount) {
      alert(`Please pick all ${rules.mainNumbersCount} main numbers first.`);
      return;
    }
    const name = favoriteNameInput.trim() || `Favorite #${(user?.favoriteNumbers.length || 0) + 1}`;
    saveFavoriteNumber(name, lottery.id, current.mainNumbers, current.bonusNumbers);
    setFavoriteNameInput('');
    alert(`Saved combination "${name}" to your profile!`);
  };

  // Validate that all lines are filled before proceeding
  const ensureValidLines = () => {
    const unfilledIndex = lines.findIndex(
      l => l.mainNumbers.length < rules.mainNumbersCount || l.bonusNumbers.length < rules.bonusNumbersCount
    );
    if (unfilledIndex !== -1) {
      // Auto-fill unfilled lines with quick pick
      const completed = lines.map(l => {
        if (l.mainNumbers.length === rules.mainNumbersCount && l.bonusNumbers.length === rules.bonusNumbersCount) {
          return l;
        }
        return generateRandomLine();
      });
      setLines(completed);
      return completed;
    }
    return lines;
  };

  const createCartItem = (): CartItem => {
    const validLines = ensureValidLines();
    return {
      id: `cart_${Date.now()}`,
      lotteryId: lottery.id,
      drawOption,
      drawDate: lottery.nextDrawDate,
      lines: validLines,
      ticketCost: lines.length * lottery.ticketPrice * discountMultipliers[drawOption].drawsCount,
      serviceFee: lines.length * lottery.serviceFee * discountMultipliers[drawOption].drawsCount,
      discount: discountAmount,
      total: finalPrice,
      multiDrawCount: discountMultipliers[drawOption].drawsCount
    };
  };

  const currentLine = lines[activeLineIndex] || lines[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Hero Details Header */}
      <div className="bg-gradient-to-r from-[#06142e] via-[#09214b] to-[#0c2f6d] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              <span>{lottery.flag}</span>
              <span>{lottery.country}</span>
              <span>•</span>
              <span>{lottery.category.join(', ')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
              {lottery.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-2 leading-relaxed">
              {lottery.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 self-start lg:self-auto bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <div>
              <p className="text-xs text-slate-300 font-medium">Estimated Jackpot</p>
              <p className="text-3xl sm:text-4xl font-black text-amber-400 font-display">
                {lottery.jackpotFormatted}
              </p>
            </div>
            <div className="border-l border-white/10 pl-6 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Next Draw: <strong>{lottery.nextDrawDate.split(' ')[0]} {lottery.nextDrawDate.split(' ')[1]}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Closing in {countdown.hours}h {countdown.minutes}m {countdown.seconds}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('picker')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'picker'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Number Selection
        </button>
        <button
          onClick={() => setActiveTab('prize-tiers')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'prize-tiers'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Prize Breakdown & Odds
        </button>
        <button
          onClick={() => setActiveTab('how-to-play')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'how-to-play'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          How to Play & Rules
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'faq'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Game FAQ
        </button>
      </div>

      {/* Tab 1: Interactive Number Picker */}
      {activeTab === 'picker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Picker Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Pick Line Presets Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-800">Quick Line Selection:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 3, 5, 10, 20].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => handleSetLineCount(cnt)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      lines.length === cnt
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cnt} {cnt === 1 ? 'Line' : 'Lines'}
                  </button>
                ))}
                <button
                  onClick={handleQuickPickAll}
                  className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1 ml-1"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Randomize All</span>
                </button>
              </div>
            </div>

            {/* Lines Tab Strips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {lines.map((line, idx) => {
                const isComplete = line.mainNumbers.length === rules.mainNumbersCount && line.bonusNumbers.length === rules.bonusNumbersCount;
                const isActive = activeLineIndex === idx;
                return (
                  <button
                    key={line.id}
                    onClick={() => setActiveLineIndex(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : isComplete
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>Line {idx + 1}</span>
                    {isComplete ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        ({line.mainNumbers.length}/{rules.mainNumbersCount})
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={handleAddLine}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line</span>
              </button>
            </div>

            {/* Current Active Line Interactive Board */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Board Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Line {activeLineIndex + 1} Configuration
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pick {rules.mainNumbersCount} main numbers (1-{rules.mainMaxNumber}) and {rules.bonusNumbersCount} {rules.bonusName} (1-{rules.bonusMaxNumber}).
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleQuickPickCurrent}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition-colors"
                    title="Generate random numbers for this line"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Quick Pick</span>
                  </button>
                  <button
                    onClick={handleLuckyNumbers}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-bold transition-colors"
                    title="Generate prime & lucky numbers"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Lucky</span>
                  </button>
                  <button
                    onClick={() => setShowSavedFavs(!showSavedFavs)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-bold transition-colors"
                    title="Load saved favorite combinations"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </button>
                  <button
                    onClick={handleClearCurrent}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                    title="Clear selected numbers"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicateLine(activeLineIndex)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                    title="Duplicate this line"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLine(activeLineIndex)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete this line"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Saved Favorites Dropdown Area */}
              {showSavedFavs && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>Load a Saved Combination:</span>
                    <button onClick={() => setShowSavedFavs(false)} className="text-slate-400 hover:text-slate-600">Close</button>
                  </div>
                  {user?.favoriteNumbers.length === 0 ? (
                    <p className="text-slate-500 text-xs">No saved numbers found in your profile yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {user?.favoriteNumbers.map(fav => (
                        <div
                          key={fav.id}
                          onClick={() => handleLoadFavorite(fav.mainNumbers, fav.bonusNumbers)}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors"
                        >
                          <span className="font-semibold text-slate-800">{fav.name}</span>
                          <span className="font-mono text-slate-600">
                            {fav.mainNumbers.join(', ')} + {fav.bonusNumbers.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Primary Numbers Grid */}
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
                  <span>
                    Pick {rules.mainNumbersCount} Main Numbers ({currentLine.mainNumbers.length}/{rules.mainNumbersCount} selected)
                  </span>
                  {currentLine.mainNumbers.length === rules.mainNumbersCount && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      Complete
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2">
                  {Array.from({ length: rules.mainMaxNumber - rules.mainMinNumber + 1 }, (_, i) => i + rules.mainMinNumber).map(num => {
                    const isSelected = currentLine.mainNumbers.includes(num);
                    return (
                      <button
                        key={num}
                        onClick={() => handleToggleMainNumber(num)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white ring-2 ring-blue-600 shadow-sm scale-105'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bonus / Powerball Numbers Grid */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-rose-700">
                  <span>
                    Pick {rules.bonusNumbersCount} {rules.bonusName} ({currentLine.bonusNumbers.length}/{rules.bonusNumbersCount} selected)
                  </span>
                  {currentLine.bonusNumbers.length === rules.bonusNumbersCount && (
                    <span className="text-emerald-600 font-bold">Complete</span>
                  )}
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-1.5 sm:gap-2">
                  {Array.from({ length: rules.bonusMaxNumber - rules.bonusMinNumber + 1 }, (_, i) => i + rules.bonusMinNumber).map(num => {
                    const isSelected = currentLine.bonusNumbers.includes(num);
                    return (
                      <button
                        key={`bonus-${num}`}
                        onClick={() => handleToggleBonusNumber(num)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white ring-2 ring-rose-600 shadow-sm scale-105'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save line to favorites input */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Label combination (e.g. My Lucky Birthday)"
                    value={favoriteNameInput}
                    onChange={e => setFavoriteNameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveAsFavorite}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold shrink-0 transition-colors"
                  >
                    Save Combination
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Lines automatically auto-save to this order
                </span>
              </div>
            </div>

            {/* Multi-Draw & Subscription Packages Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span>Choose Your Draw Package</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Participate in multiple draws in advance to save up to 20% on all concierge courier fees.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(['single', '2draws', '5draws', '10draws', 'subscription'] as DrawOption[]).map(opt => {
                  const info = discountMultipliers[opt];
                  const isSelected = drawOption === opt;
                  return (
                    <div
                      key={opt}
                      onClick={() => setDrawOption(opt)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">{info.label.split(' (')[0]}</span>
                        {info.discountPct > 0 && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                            {Math.round(info.discountPct * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {opt === 'subscription' 
                          ? 'Never miss a draw. Pause or cancel anytime.' 
                          : `${info.drawsCount} consecutive official draw(s)`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sticky Order Summary Sidebar (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 font-display">
                Order Summary
              </h3>

              {/* Line items preview */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Lottery:</span>
                  <span className="font-bold text-slate-900">{lottery.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Draw:</span>
                  <span className="font-medium text-slate-900">{lottery.nextDrawDate.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ticket Lines:</span>
                  <span className="font-bold text-slate-900">{lines.length} Line(s)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Package:</span>
                  <span className="font-bold text-blue-600">{discountMultipliers[drawOption].label}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Official Ticket Cost:</span>
                  <span>{formatMoney(lines.length * lottery.ticketPrice * discountMultipliers[drawOption].drawsCount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Concierge & Courier Fee:</span>
                  <span>{formatMoney(lines.length * lottery.serviceFee * discountMultipliers[drawOption].drawsCount)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Package Discount:</span>
                    <span>-{formatMoney(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total:</span>
                  <span className="text-2xl font-black text-amber-500 font-display">
                    {formatMoney(finalPrice)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    const item = createCartItem();
                    onProceedToCheckout(item);
                  }}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Continue to Checkout</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => {
                    const item = createCartItem();
                    onAddToCart(item);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Add to Cart & Keep Browsing
                </button>
              </div>

              {/* Guarantees Badge */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Physical official ticket purchased in host country</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>High-resolution scan uploaded to your account</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Commission-free on all prize tiers</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prize Tiers & Odds */}
      {activeTab === 'prize-tiers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              {lottery.name} Prize Tiers & Odds
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Official payout structures for matching combinations. All secondary winnings deposit directly into your wallet.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Winning Match</th>
                  <th className="py-3 px-4">Estimated Prize</th>
                  <th className="py-3 px-4">Odds of Winning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lottery.prizeTiers.map((pt, i) => (
                  <tr key={i} className={i === 0 ? 'bg-amber-50/60 font-bold' : ''}>
                    <td className="py-3 px-4 text-slate-900 font-semibold">{pt.match}</td>
                    <td className={`py-3 px-4 font-bold ${i === 0 ? 'text-amber-600 text-sm' : 'text-slate-800'}`}>
                      {pt.prize}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{pt.odds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: How to Play & Rules */}
      {activeTab === 'how-to-play' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-display">
            How to Play {lottery.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lottery.howToPlay.map((step, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Concierge Courier Model Notice</span>
            </h4>
            <p>
              GlobalLotto acts exclusively as your authorized ticket courier. We do not participate in or influence draw outcomes. Once purchased, your physical paper ticket is held in our secure vault in the host country until the official draw concludes.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900 font-display">
            Frequently Asked Questions for {lottery.name}
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-900 text-xs">Can non-residents legally win {lottery.name}?</h5>
              <p className="text-xs text-slate-600 mt-1">
                Yes. Under host country regulations, anyone possessing a validly purchased official ticket is entitled to claim prizes, regardless of nationality or permanent residency.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-900 text-xs">When will my ticket scan be ready?</h5>
              <p className="text-xs text-slate-600 mt-1">
                Our local agents purchase and upload high-resolution ticket scans within a few hours of your order, always well before the official draw cutoff.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-900 text-xs">Are taxes deducted from winnings?</h5>
              <p className="text-xs text-slate-600 mt-1">
                Certain lotteries (such as US Powerball and Mega Millions) withhold federal and state taxes for non-resident winners as mandated by law. GlobalLotto takes 0% commission from your prize.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
