import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Award, 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Gift, 
  Smartphone, 
  Sparkles,
  CheckCircle2,
  Users,
  Headphones,
  Check,
  GraduationCap,
  Flame,
  Zap,
  Search,
  MapPin,
  HelpCircle,
  ExternalLink,
  Coins
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LotteryCategory } from '../../types';
import { WINNER_STORIES } from '../../data/testimonials';
import illinoisHeroImg from '../../assets/images/illinois_lottery_hero_1788976399548.jpg';

interface HomePageProps {
  onSelectLottery: (id: string) => void;
  setCurrentView: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectLottery, setCurrentView }) => {
  const { lotteries, formatMoney } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<LotteryCategory>('Illinois');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [likedLotteries, setLikedLotteries] = useState<Record<string, boolean>>({});

  // Interactive Quick Checker State
  const [checkerGame, setCheckerGame] = useState<string>('illinois-lotto');
  const [checkerNumbers, setCheckerNumbers] = useState<string>('7, 14, 22, 35, 41, 48');
  const [checkerBonus, setCheckerBonus] = useState<string>('11');
  const [checkerResult, setCheckerResult] = useState<{
    checked: boolean;
    matches: number;
    bonusMatch: boolean;
    prize: string;
  } | null>(null);

  // Interactive Scratch-Off Card Simulation
  const [scratchedCells, setScratchedCells] = useState<Record<number, boolean>>({});
  const scratchPrizes = ['$50,000', 'ENTRY', '$100', 'WIN $500', '$20', '$1,000,000'];

  // Countdown timer simulation (Central Time)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (e: React.MouseEvent, lotteryId: string) => {
    e.stopPropagation();
    setLikedLotteries(prev => ({ ...prev, [lotteryId]: !prev[lotteryId] }));
  };

  const categories: { label: string; value: LotteryCategory }[] = [
    { label: 'Illinois Games', value: 'Illinois' },
    { label: 'All Games', value: 'All' },
    { label: 'Draw Games', value: 'Draw Games' },
    { label: 'Daily Numbers', value: 'Daily' },
    { label: 'Multi-State Jackpots', value: 'Mega Jackpots' },
    { label: 'US National', value: 'US' }
  ];

  const filteredLotteries = lotteries.filter(l => {
    if (selectedCategory === 'All') return true;
    return l.category.includes(selectedCategory);
  });

  const tickerLotteries = lotteries.filter(l => 
    ['illinois-lotto', 'lucky-day-lotto', 'powerball', 'mega-millions', 'pick-3'].includes(l.id)
  );

  const handleRunChecker = () => {
    const selectedLot = lotteries.find(l => l.id === checkerGame);
    if (!selectedLot || !selectedLot.previousDraw) return;

    const userNums = checkerNumbers
      .split(/[\s,]+/)
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n));
    const userBonus = parseInt(checkerBonus.trim(), 10);

    const winningMain = selectedLot.previousDraw.winningMainNumbers;
    const winningBonus = selectedLot.previousDraw.winningBonusNumbers;

    const matchedCount = userNums.filter(n => winningMain.includes(n)).length;
    const matchedBonus = !isNaN(userBonus) && winningBonus.includes(userBonus);

    let calculatedPrize = 'No Prize Won - Better Luck Next Draw!';
    if (matchedCount === winningMain.length && (winningBonus.length === 0 || matchedBonus)) {
      calculatedPrize = `JACKPOT WINNER! (${selectedLot.jackpotFormatted})`;
    } else if (matchedCount >= 5) {
      calculatedPrize = '$100,000 Second Tier Prize!';
    } else if (matchedCount === 4) {
      calculatedPrize = '$250 Standard Match Prize';
    } else if (matchedCount === 3) {
      calculatedPrize = '$15 Match 3 Prize';
    } else if (matchedBonus) {
      calculatedPrize = '$5 Extra Shot / Bonus Win';
    }

    setCheckerResult({
      checked: true,
      matches: matchedCount,
      bonusMatch: matchedBonus,
      prize: calculatedPrize
    });
  };

  const handleScratchCell = (index: number) => {
    setScratchedCells(prev => ({ ...prev, [index]: true }));
  };

  const resetScratcher = () => {
    setScratchedCells({});
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* 1. Official State Banner & Hero Section */}
      <section className="relative overflow-hidden bg-[#071739] text-white pt-8 pb-14 px-4 border-b border-slate-800">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.25),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Official State Value Proposition & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-amber-400 mb-5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>State of Illinois · Official Online Lottery</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
                Play Powerball, Mega Millions & <span className="text-amber-400">Illinois Lotto</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Pick your winning numbers, enter official Illinois drawings, and check live results. Every ticket helps generate over <strong className="text-white font-semibold">$850 million annually</strong> for Illinois public education and vital community causes.
              </p>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  id="hero-play-illinois-lotto"
                  onClick={() => onSelectLottery('illinois-lotto')}
                  className="min-h-[44px] py-2.5 px-5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap active:scale-[0.99]"
                >
                  <Trophy className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Play Illinois Lotto ($4.5M)</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button
                  id="hero-play-powerball"
                  onClick={() => onSelectLottery('powerball')}
                  className="min-h-[44px] py-2.5 px-5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap active:scale-[0.99]"
                >
                  <span>Powerball ($935M)</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button
                  id="hero-check-results"
                  onClick={() => setCurrentView('results')}
                  className="min-h-[44px] py-2.5 px-5 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-white font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer whitespace-nowrap active:scale-[0.99]"
                >
                  <span>Check Winning Numbers</span>
                </button>
              </div>

              {/* Illinois State Trust Highlights */}
              <div className="mt-8 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong className="text-white">$24B+</strong> to Public Schools</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Drawings Tonight at <strong>9:22 PM CT</strong></span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Tax-Verified Claims</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Lottery Picture Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl p-2.5 bg-slate-900/90 border border-slate-700/80 shadow-2xl">
                {/* Floating Top Badge */}
                <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-md bg-slate-950/90 border border-slate-700 text-[11px] font-semibold text-amber-400 flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Official Illinois Drawings</span>
                </div>

                {/* Hero Lottery Picture */}
                <div className="relative overflow-hidden rounded-xl aspect-[16/10] sm:aspect-[16/10] bg-slate-950">
                  <img
                    src={illinoisHeroImg}
                    alt="Illinois Lottery Winning Numbers and Jackpots"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Clean Bottom Draw Highlight Bar */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-lg bg-slate-900/95 border border-slate-700/90 flex items-center justify-between shadow-lg">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>Tonight's Featured Draw</span>
                      </div>
                      <p className="text-sm font-bold text-white mt-0.5">
                        Illinois Lotto · <span className="text-amber-400">$4.5 Million</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Closes at 9:15 PM CT · Extra Shot Included
                      </p>
                    </div>

                    <button
                      id="hero-quick-play-btn"
                      onClick={() => onSelectLottery('illinois-lotto')}
                      className="min-h-[40px] py-2 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 whitespace-nowrap active:scale-[0.99]"
                    >
                      <span>Pick 6</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Understated Illinois Commitment Pillars */}
          <div className="mt-10 pt-6 border-t border-slate-800/90 grid grid-cols-2 md:grid-cols-4 gap-3.5 text-left">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Common School Fund</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Direct aid for Illinois K-12 education</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Twice-Daily Draws</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Midday 12:40 PM & Evening 9:22 PM CT</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Verified Security</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Encrypted state lottery transactions</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">State Claim Centers</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Chicago, Springfield, Rockford & more</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Today's Jackpot Ticker & Draw Countdown Ribbon */}
      <section className="bg-[#040e24] border-y border-slate-800 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Current Illinois Jackpots</span>
            </div>
          </div>

          {/* Jackpots Strip */}
          <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
            {tickerLotteries.map(lot => (
              <button
                key={lot.id}
                onClick={() => onSelectLottery(lot.id)}
                className="flex items-center gap-2.5 shrink-0 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-md transition-colors group text-left cursor-pointer"
              >
                <span className="text-base">{lot.flag}</span>
                <div>
                  <p className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors">
                    {lot.name}
                  </p>
                  <p className="text-xs font-bold text-amber-400">
                    {lot.jackpotFormatted}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentView('jackpots')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0 ml-auto cursor-pointer"
          >
            <span>All Draw Times</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. Interactive "Did I Win?" Quick Ticket Checker Widget */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] uppercase tracking-wider">
                  Official Tool
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Did I Win? Quick Number Checker
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter your ticket numbers to verify against recent official Illinois Lottery drawings.
              </p>
            </div>

            {/* Game Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {[
                { id: 'illinois-lotto', label: 'Illinois Lotto' },
                { id: 'lucky-day-lotto', label: 'Lucky Day Lotto' },
                { id: 'powerball', label: 'Powerball' },
                { id: 'pick-3', label: 'Pick 3' }
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => {
                    setCheckerGame(g.id);
                    setCheckerResult(null);
                    if (g.id === 'illinois-lotto') {
                      setCheckerNumbers('7, 14, 22, 35, 41, 48');
                      setCheckerBonus('11');
                    } else if (g.id === 'lucky-day-lotto') {
                      setCheckerNumbers('5, 12, 19, 28, 41');
                      setCheckerBonus('');
                    } else if (g.id === 'powerball') {
                      setCheckerNumbers('10, 15, 23, 38, 42');
                      setCheckerBonus('14');
                    } else {
                      setCheckerNumbers('4, 7, 2');
                      setCheckerBonus('9');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    checkerGame === g.id
                      ? 'bg-[#071739] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checker Input Form */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
            <div className="md:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Main Numbers (comma or space separated)
              </label>
              <input
                type="text"
                value={checkerNumbers}
                onChange={e => setCheckerNumbers(e.target.value)}
                placeholder="e.g. 7, 14, 22, 35, 41, 48"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700 font-mono"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Extra Shot / Powerball / FIREBALL
              </label>
              <input
                type="text"
                value={checkerBonus}
                onChange={e => setCheckerBonus(e.target.value)}
                placeholder="e.g. 11"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700 font-mono"
              />
            </div>

            <div className="md:col-span-3 flex gap-2">
              <button
                id="run-ticket-checker"
                onClick={handleRunChecker}
                className="flex-1 h-10 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Check Numbers</span>
              </button>
              <button
                onClick={() => {
                  // Fill random test numbers
                  if (checkerGame === 'illinois-lotto') {
                    setCheckerNumbers('7, 14, 22, 35, 41, 48');
                    setCheckerBonus('11');
                  } else {
                    setCheckerNumbers('5, 12, 19, 28, 41');
                    setCheckerBonus('');
                  }
                }}
                className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors cursor-pointer"
                title="Fill with recent drawing numbers"
              >
                Sample
              </button>
            </div>
          </div>

          {/* Checker Result Notification */}
          {checkerResult && (
            <div className={`mt-4 p-3.5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              checkerResult.matches >= 3 || checkerResult.bonusMatch
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className={`w-5 h-5 ${checkerResult.matches >= 3 ? 'text-emerald-600' : 'text-slate-500'}`} />
                <div>
                  <p className="text-xs font-bold">
                    Result: {checkerResult.matches} Main Numbers Matched {checkerResult.bonusMatch ? '+ Bonus Ball Matched' : ''}
                  </p>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    {checkerResult.prize}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectLottery(checkerGame)}
                  className="h-8 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded transition-colors"
                >
                  Play Next Draw
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Popular Lotteries Marketplace Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Official Illinois & Multi-State Games
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select your numbers or generate quick picks for tonight's official drawings.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-[#071739] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => setCurrentView('lotteries')}
              className="text-xs font-semibold text-blue-700 hover:underline pl-2 shrink-0 flex items-center cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lottery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredLotteries.map(lot => (
            <div
              key={lot.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Card Top */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  {/* Distinctive Illinois Badge */}
                  <div className={`w-10 h-10 rounded-lg ${lot.logoBg} flex items-center justify-center font-bold ${lot.logoColor} text-xs border border-slate-200/60 shadow-xs`}>
                    {lot.id === 'illinois-lotto' ? 'IL' : lot.id === 'lucky-day-lotto' ? 'LDL' : lot.name.substring(0, 3).toUpperCase()}
                  </div>

                  {/* Favorite Bookmark Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, lot.id)}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Bookmark Lottery"
                  >
                    <Heart className={`w-4 h-4 ${likedLotteries[lot.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* State / Country info */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <span>{lot.flag}</span>
                  <span className="font-medium">{lot.country}</span>
                </div>

                {/* Lottery Name */}
                <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {lot.name}
                </h3>

                {/* Jackpot Display */}
                <div className="mt-2.5">
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                    {lot.id.includes('pick') ? 'Top Prize' : 'Current Jackpot'}
                  </p>
                  <p className="text-xl font-extrabold text-slate-950 tracking-tight">
                    {lot.jackpotFormatted}
                  </p>
                </div>

                {/* Next Draw Date & Countdown */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span>Draw Schedule</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {lot.nextDrawDate.includes('CT') ? lot.nextDrawDate.split(' ')[0] + ' ' + lot.nextDrawDate.split(' ')[1] : lot.drawSchedule.split(' at ')[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-mono text-[11px] font-semibold">
                      {timeLeft.hours}h {timeLeft.minutes}m remaining (CT)
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Price and CTA */}
              <div className="p-4 pt-0">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-slate-500">Ticket Price</span>
                  <span className="font-bold text-slate-900">{formatMoney(lot.ticketPrice)}</span>
                </div>
                <button
                  onClick={() => onSelectLottery(lot.id)}
                  className="w-full min-h-[40px] py-2 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-[0.99]"
                >
                  <span>Pick Numbers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Recent Official Winning Numbers with Tactile Balls */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Official Illinois Draw Results
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified winning numbers from recent audited drawings.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('results')}
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Draw Results</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {tickerLotteries.map(lot => {
            const prev = lot.previousDraw;
            return (
              <div
                key={lot.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>{lot.flag}</span>
                      <span className="line-clamp-1">{lot.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{prev?.date || 'Today'}</span>
                  </div>

                  {/* Tactile Balls Strip */}
                  <div className="my-3 flex items-center justify-center gap-1.5 flex-wrap">
                    {prev?.winningMainNumbers.map((n, i) => (
                      <span
                        key={i}
                        className="w-7 h-7 rounded-full lottery-ball-main text-slate-900 text-xs font-bold flex items-center justify-center shadow-xs"
                      >
                        {String(n).padStart(2, '0')}
                      </span>
                    ))}
                    {prev?.winningBonusNumbers.map((b, i) => (
                      <span
                        key={`b-${i}`}
                        className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-xs ${
                          lot.id === 'illinois-lotto' 
                            ? 'bg-blue-700 border border-blue-600' 
                            : lot.id === 'pick-3' || lot.id === 'pick-4' 
                            ? 'bg-amber-600 border border-amber-500' 
                            : 'lottery-ball-bonus'
                        }`}
                        title={lot.rules.bonusName}
                      >
                        {String(b).padStart(2, '0')}
                      </span>
                    ))}
                  </div>

                  {/* Result Status */}
                  <div className="text-center pt-2.5 border-t border-slate-100">
                    <p className="text-[11px] text-slate-500">
                      {prev?.jackpotWon ? 'Jackpot Won' : 'Next Estimated Jackpot'}
                    </p>
                    <p className="text-xs font-bold text-slate-900">
                      {lot.jackpotFormatted}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('results')}
                  className="mt-3 text-center text-xs font-semibold text-blue-700 hover:underline pt-2 border-t border-slate-100 block cursor-pointer"
                >
                  Full Prize Breakdown →
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Giving Back: "Where The Money Goes" (Illinois Public Education) */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-2xl bg-[#061536] text-white border border-slate-800 p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Supporting Illinois Since 1974</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Where Does The Money Go?
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
                When you play the Illinois Lottery, you are investing directly in Illinois. Over <strong>$24 Billion</strong> has been generated for the <strong>Common School Fund</strong>, helping fund public K-12 classrooms, teacher salaries, and school technology statewide.
              </p>
              
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <p className="text-lg font-black text-amber-400">$850M+</p>
                  <p className="text-[11px] text-slate-400">Annual School Aid</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <p className="text-lg font-black text-white">4,000+</p>
                  <p className="text-[11px] text-slate-400">Public Schools</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                  <p className="text-lg font-black text-emerald-400">6 Causes</p>
                  <p className="text-[11px] text-slate-400">Veterans & Research</p>
                </div>
              </div>
            </div>

            {/* Specialty Causes Pills */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-xl p-5 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Illinois Specialty Cause Tickets
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span><strong>Illinois Veterans:</strong> Health care, rehabilitation, and housing</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span><strong>Special Olympics Illinois:</strong> Year-round athletic training</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span><strong>Breast Cancer Research:</strong> Grants for Illinois clinics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span><strong>Police Memorial:</strong> Support for families of fallen officers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span><strong>Homelessness Prevention:</strong> Emergency assistance fund</span>
                </li>
              </ul>

              <button
                onClick={() => setCurrentView('promotions')}
                className="mt-4 w-full h-9 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded text-xs transition-colors cursor-pointer border border-slate-700"
              >
                Learn More About Specialty Causes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive Instant Scratch-Off Games Preview */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Instant Scratch-Off Games
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Over 50 official scratch-off games available with prizes up to $3 Million!
            </p>
          </div>
          <button
            onClick={() => setCurrentView('promotions')}
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Scratch-Offs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Scratch-off 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">$30 Ticket</span>
                <span className="text-[11px] text-slate-500 font-medium">Game #482</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-1">200X Payout</h4>
              <p className="text-xs text-slate-600 mt-1">Top Prize: <strong className="text-slate-950 font-bold">$3,000,000</strong></p>
              <p className="text-[11px] text-slate-500 mt-2">Overall odds 1 in 2.92. 3 top prizes remaining.</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700">In Stock at Retailers</span>
              <button
                onClick={() => onSelectLottery('fast-play-progressive')}
                className="h-8 px-3 bg-[#071739] hover:bg-slate-800 text-white font-semibold rounded text-xs transition-colors cursor-pointer"
              >
                Game Info
              </button>
            </div>
          </div>

          {/* Scratch-off 2: Interactive Scratch Demo */}
          <div className="bg-gradient-to-br from-[#071739] to-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">$10 Scratch Demo</span>
                <span className="text-[11px] text-slate-400 font-medium">Click to Scratch</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">50X The Cash - Interactive Pad</h4>
              <p className="text-xs text-slate-300 mt-1">Tap each silver panel to reveal simulated prizes!</p>

              {/* Interactive Scratch Area */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {scratchPrizes.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleScratchCell(idx)}
                    className={`h-11 rounded font-mono text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      scratchedCells[idx]
                        ? 'bg-amber-400 text-slate-950 border border-amber-300 shadow-inner'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {scratchedCells[idx] ? p : 'SCRATCH'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={resetScratcher}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                Reset Pad
              </button>
              <button
                onClick={() => setCurrentView('promotions')}
                className="h-8 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Find Retailer
              </button>
            </div>
          </div>

          {/* Scratch-off 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">$5 Ticket</span>
                <span className="text-[11px] text-slate-500 font-medium">Game #391</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-1">Crossword Extra</h4>
              <p className="text-xs text-slate-600 mt-1">Top Prize: <strong className="text-slate-950 font-bold">$100,000</strong></p>
              <p className="text-[11px] text-slate-500 mt-2">Fast-moving puzzle favorite with bonus word multiplier.</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700">In Stock at Retailers</span>
              <button
                onClick={() => onSelectLottery('lucky-day-lotto')}
                className="h-8 px-3 bg-[#071739] hover:bg-slate-800 text-white font-semibold rounded text-xs transition-colors cursor-pointer"
              >
                Game Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Verified Illinois Winners Stories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Testimonial Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Illinois Winner Spotlight
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                  State Story
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "{WINNER_STORIES[testimonialIndex].quote}"
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={WINNER_STORIES[testimonialIndex].avatarUrl}
                  alt={WINNER_STORIES[testimonialIndex].name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    {WINNER_STORIES[testimonialIndex].name}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    {WINNER_STORIES[testimonialIndex].country} · Won {WINNER_STORIES[testimonialIndex].prizeAmount}
                  </p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTestimonialIndex((prev) => (prev > 0 ? prev - 1 : WINNER_STORIES.length - 1))}
                  className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  title="Previous Story"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTestimonialIndex((prev) => (prev < WINNER_STORIES.length - 1 ? prev + 1 : 0))}
                  className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  title="Next Story"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Operational Metrics Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <Users className="w-4 h-4 text-slate-700 mb-1" />
              <p className="text-lg font-bold text-slate-900">1.2 Million+</p>
              <p className="text-[11px] text-slate-500">Illinois App Players</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <Trophy className="w-4 h-4 text-amber-600 mb-1" />
              <p className="text-lg font-bold text-slate-900">$2.1 Billion</p>
              <p className="text-[11px] text-slate-500">Annual Prizes Paid</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <MapPin className="w-4 h-4 text-slate-700 mb-1" />
              <p className="text-lg font-bold text-slate-900">7,200+</p>
              <p className="text-[11px] text-slate-500">Licensed Retailers</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <GraduationCap className="w-4 h-4 text-slate-700 mb-1" />
              <p className="text-lg font-bold text-slate-900">$24B+</p>
              <p className="text-[11px] text-slate-500">To Common School Fund</p>
            </div>
          </div>

          {/* Claim Centers & How to Claim Panel */}
          <div className="rounded-xl bg-[#071739] text-white p-5 border border-slate-800 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Official State Claim Centers
              </span>
              <h4 className="text-base font-bold text-white mt-1">
                How to Claim Your Winnings
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Prizes up to $600 are paid directly into your online wallet or at any licensed retailer. Prizes over $600 can be claimed online or in person at five state claim centers.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
              <button
                onClick={() => setCurrentView('winners')}
                className="text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                View Claim Locations & Form →
              </button>
              <span className="text-emerald-400 font-medium">1-800-GAMBLER</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
