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
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LotteryCategory } from '../../types';
import { WINNER_STORIES } from '../../data/testimonials';

interface HomePageProps {
  onSelectLottery: (id: string) => void;
  setCurrentView: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectLottery, setCurrentView }) => {
  const { lotteries, formatMoney, saveFavoriteNumber, user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<LotteryCategory>('All');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [likedLotteries, setLikedLotteries] = useState<Record<string, boolean>>({});

  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (e: React.MouseEvent, lotteryId: string) => {
    e.stopPropagation();
    setLikedLotteries(prev => ({ ...prev, [lotteryId]: !prev[lotteryId] }));
  };

  const categories: LotteryCategory[] = [
    'All',
    'US',
    'Europe',
    'Asia',
    'Australia',
    'Daily',
    'Mega Jackpots'
  ];

  const filteredLotteries = lotteries.filter(l => {
    if (selectedCategory === 'All') return true;
    return l.category.includes(selectedCategory);
  });

  const tickerLotteries = lotteries.slice(0, 5);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#061229] via-[#091b3d] to-[#0d234d] text-white pt-10 pb-20 px-4">
        {/* Subtle background stars & map glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.15),_transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 mb-6 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Play Global. Dream Big.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight font-display">
            Play the World's <span className="text-amber-400">Biggest Lotteries</span> Online
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Choose your numbers, place your order, and follow the world's biggest lottery draws from one secure account.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onSelectLottery('powerball')}
              className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-amber-400/20 transition-all hover:scale-105"
            >
              <span>Play Now</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setCurrentView('lotteries')}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all"
            >
              View Lotteries
            </button>
          </div>

          {/* Trust Highlights Pills */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Official Tickets</p>
                <p className="text-[11px] text-slate-300">Through Trusted Partners</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Secure & Encrypted</p>
                <p className="text-[11px] text-slate-300">Your Data, Our Priority</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Global Access</p>
                <p className="text-[11px] text-slate-300">Play from Almost Anywhere</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Millions of Winners</p>
                <p className="text-[11px] text-slate-300">Real People, Real Stories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today's Biggest Jackpots Ticker Ribbon */}
      <section className="bg-[#051127] border-y border-slate-800 text-white py-3.5 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">Today's</span>
              <p className="text-xs font-bold text-white -mt-0.5">Biggest Jackpots</p>
            </div>
          </div>

          {/* Jackpots Strip */}
          <div className="flex-1 flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1">
            {tickerLotteries.map(lot => (
              <button
                key={lot.id}
                onClick={() => onSelectLottery(lot.id)}
                className="flex items-center gap-2.5 shrink-0 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl transition-all group"
              >
                <span className="text-base">{lot.flag}</span>
                <div className="text-left">
                  <p className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                    {lot.name}
                  </p>
                  <p className="text-xs font-black text-amber-400">
                    {lot.jackpotFormatted}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentView('jackpots')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0 ml-auto"
          >
            <span>View All Jackpots</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. Popular Lotteries Marketplace Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display">
              Popular Lotteries
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select your lottery, choose your lucky numbers, and our couriers buy official tickets for you.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setCurrentView('lotteries')}
              className="text-xs font-bold text-blue-600 hover:underline pl-2 shrink-0 flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lottery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredLotteries.map(lot => (
            <div
              key={lot.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between group relative"
            >
              {/* Card Top */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  {/* Logo / Badge */}
                  <div className={`w-12 h-12 rounded-xl ${lot.logoBg} flex items-center justify-center font-black ${lot.logoColor} text-xs shadow-sm font-display`}>
                    {lot.name.substring(0, 5).toUpperCase()}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, lot.id)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${likedLotteries[lot.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Country info */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <span>{lot.flag}</span>
                  <span>{lot.country}</span>
                </div>

                {/* Lottery Name */}
                <h3 className="text-base font-bold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                  {lot.name}
                </h3>

                {/* Big Jackpot Display */}
                <div className="mt-2">
                  <p className="text-xs text-slate-500 font-medium">Estimated Jackpot</p>
                  <p className="text-2xl font-black text-slate-950 font-display tracking-tight text-blue-900">
                    {lot.jackpotFormatted}
                  </p>
                </div>

                {/* Next Draw Date & Countdown */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Next Draw</span>
                    <span className="font-semibold text-slate-800">{lot.nextDrawDate.split(' ')[0]} {lot.nextDrawDate.split(' ')[1]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-mono text-[11px] font-semibold">
                      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Price and CTA */}
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-slate-500">From</span>
                  <span className="font-bold text-slate-900 text-sm">{formatMoney(lot.ticketPrice)}</span>
                </div>
                <button
                  onClick={() => onSelectLottery(lot.id)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Promotional Duo Banners */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Welcome Bonus Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 border border-slate-800 text-white p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Welcome Bonus
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 font-display">
                Get 10 Free Lines
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm">
                Join today and receive 10 free lottery lines on selected international draws when you place your first multi-line entry.
              </p>
            </div>
            <div className="mt-6 relative z-10">
              <button
                onClick={() => setCurrentView('promotions')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all"
              >
                Claim Now
              </button>
            </div>
            {/* Visual background icon */}
            <Gift className="absolute right-4 bottom-2 w-32 h-32 text-amber-400/10 pointer-events-none" />
          </div>

          {/* Play Global Win Anywhere Card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 border border-blue-900/60 text-white p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest">
                Worldwide Concierge
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 font-display">
                Play Global. Win Anywhere.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm">
                The world’s biggest lotteries are just a click away with verified digital ticket proof and 100% commission-free payouts.
              </p>
            </div>
            <div className="mt-6 relative z-10">
              <button
                onClick={() => setCurrentView('lotteries')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm backdrop-blur-md transition-all"
              >
                Explore Lotteries
              </button>
            </div>
            <Globe className="absolute right-4 bottom-2 w-32 h-32 text-blue-400/10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 5. How It Works 5-Step Process */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Simple. Secure. Global.
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-display">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Our trusted ticket concierge courier model lets you participate in world-renowned lotteries legally and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-xs flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black mb-4 shadow-inner">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Choose a Lottery</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse and pick from the world's biggest jackpots like Powerball or EuroMillions.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-xs flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-black mb-4 shadow-inner">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Select Your Numbers</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose your lucky numbers manually or generate combinations with Quick Pick.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-xs flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black mb-4 shadow-inner">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Place Your Order</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our local authorized couriers buy official physical tickets and upload scanned proof.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-xs flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-black mb-4 shadow-inner">
              4
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Check Results</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated prize verification alerts you immediately when your ticket has winning combinations.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-xs flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-black mb-4 shadow-inner">
              5
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Claim Your Winnings</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              100% commission-free! Secondary prizes deposit directly to wallet, jackpots coordinated in person.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Recent Results with Real Ball Display */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display">
              Recent Results
            </h2>
            <p className="text-xs text-slate-500">
              Verified official winning numbers from recent global draws.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('results')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Results</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {lotteries.slice(0, 5).map(lot => {
            const prev = lot.previousDraw;
            return (
              <div
                key={lot.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <span>{lot.flag}</span>
                      <span>{lot.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{prev?.date || 'Apr 2025'}</span>
                  </div>

                  {/* Balls Strip */}
                  <div className="my-3 flex items-center justify-center gap-1 flex-wrap">
                    {prev?.winningMainNumbers.map((n, i) => (
                      <span
                        key={i}
                        className="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center shadow-xs ball-glow"
                      >
                        {String(n).padStart(2, '0')}
                      </span>
                    ))}
                    {prev?.winningBonusNumbers.map((b, i) => (
                      <span
                        key={`b-${i}`}
                        className="w-7 h-7 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shadow-xs ball-glow"
                        title={lot.rules.bonusName}
                      >
                        {String(b).padStart(2, '0')}
                      </span>
                    ))}
                  </div>

                  {/* Result Status */}
                  <div className="text-center pt-2 border-t border-slate-100">
                    <p className="text-[11px] text-slate-500">
                      {prev?.jackpotWon ? '1 Jackpot Winner' : 'No Jackpot Winner'}
                    </p>
                    <p className="text-xs font-bold text-rose-600">
                      {prev?.jackpotAmount}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('results')}
                  className="mt-3 text-center text-xs font-semibold text-blue-600 hover:underline pt-2 border-t border-slate-100 block"
                >
                  View Details →
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Social Proof, Testimonials & Mobile App Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Testimonial Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Real People. Real Dreams.
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                  Demo testimonial
                </span>
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "{WINNER_STORIES[testimonialIndex].quote}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={WINNER_STORIES[testimonialIndex].avatarUrl}
                  alt={WINNER_STORIES[testimonialIndex].name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    {WINNER_STORIES[testimonialIndex].name}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    {WINNER_STORIES[testimonialIndex].country} • Won {WINNER_STORIES[testimonialIndex].prizeAmount}
                  </p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTestimonialIndex((prev) => (prev > 0 ? prev - 1 : WINNER_STORIES.length - 1))}
                  className="p-1 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTestimonialIndex((prev) => (prev < WINNER_STORIES.length - 1 ? prev + 1 : 0))}
                  className="p-1 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Users className="w-5 h-5 text-blue-600 mb-1" />
              <p className="text-xl font-black text-slate-900 font-display">500,000+</p>
              <p className="text-xs text-slate-500">Happy Players</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <Trophy className="w-5 h-5 text-amber-500 mb-1" />
              <p className="text-xl font-black text-slate-900 font-display">$8.4 Billion+</p>
              <p className="text-xs text-slate-500">Winnings Paid</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <Globe className="w-5 h-5 text-emerald-600 mb-1" />
              <p className="text-xl font-black text-slate-900 font-display">180+</p>
              <p className="text-xs text-slate-500">Lotteries Worldwide</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <Headphones className="w-5 h-5 text-indigo-600 mb-1" />
              <p className="text-xl font-black text-slate-900 font-display">24/7</p>
              <p className="text-xs text-slate-500">Customer Support</p>
            </div>
          </div>

          {/* Mobile App Promo */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Mobile Experience
              </span>
              <h4 className="text-xl font-black text-white mt-1 font-display">
                Play on the Go
              </h4>
              <p className="text-xs text-slate-300 mt-2">
                Download our web app or add to your home screen to check results and receive instant rollover push alerts.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button 
                onClick={() => alert('Demo Mode: Mobile application packaging ready for App Store & Google Play distribution.')}
                className="bg-black/80 hover:bg-black text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border border-white/20"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <span className="text-[9px] block text-slate-400">Available on</span>
                  <span className="font-bold">App Store / Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
