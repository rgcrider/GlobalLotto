import React, { useState } from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Filter, 
  Clock, 
  ArrowUpDown, 
  ShieldCheck, 
  Heart,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LotteryCategory } from '../../types';

interface LotteriesPageProps {
  onSelectLottery: (id: string) => void;
}

export const LotteriesPage: React.FC<LotteriesPageProps> = ({ onSelectLottery }) => {
  const { lotteries, formatMoney, currentCountry, isCountryBlocked } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LotteryCategory>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [jackpotFilter, setJackpotFilter] = useState<string>('all'); // all, 50m, 100m, 500m
  const [sortBy, setSortBy] = useState<'jackpot' | 'price' | 'popular' | 'name'>('jackpot');

  const categories: LotteryCategory[] = [
    'All', 'US', 'Europe', 'Asia', 'Australia', 'Daily', 'Mega Jackpots'
  ];

  const uniqueCountries = ['All', ...Array.from(new Set(lotteries.map(l => l.country)))];

  // Filter & Sort
  const filtered = lotteries.filter(lot => {
    // Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = lot.name.toLowerCase().includes(q) || lot.country.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category
    if (selectedCategory !== 'All' && !lot.category.includes(selectedCategory)) {
      return false;
    }

    // Country
    if (selectedCountry !== 'All' && lot.country !== selectedCountry) {
      return false;
    }

    // Jackpot
    if (jackpotFilter === '50m' && lot.jackpotAmount < 50) return false;
    if (jackpotFilter === '100m' && lot.jackpotAmount < 100) return false;
    if (jackpotFilter === '500m' && lot.jackpotAmount < 500) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'jackpot') return b.jackpotAmount - a.jackpotAmount;
    if (sortBy === 'price') return a.ticketPrice - b.ticketPrice;
    if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>International Draws Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Browse Available Lotteries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Official tickets purchased in host jurisdictions by licensed concierge couriers.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Warning if user is testing a restricted country */}
        {isCountryBlocked && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <span>
              Notice: Lottery courier purchasing is restricted under {currentCountry} gaming regulations. You can switch jurisdiction in the top bar to test live checkout.
            </span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 mb-6 shadow-xs space-y-3.5">
        {/* Search & Sort Row */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search lotteries by name or country..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            {/* Country Dropdown */}
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-xs text-slate-700 focus:outline-none focus:border-slate-400"
            >
              {uniqueCountries.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>
              ))}
            </select>

            {/* Jackpot Size Filter */}
            <select
              value={jackpotFilter}
              onChange={e => setJackpotFilter(e.target.value)}
              className="h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-xs text-slate-700 focus:outline-none focus:border-slate-400"
            >
              <option value="all">Any Jackpot Size</option>
              <option value="50m">$50M+ Jackpots</option>
              <option value="100m">$100M+ Jackpots</option>
              <option value="500m">$500M+ Mega Jackpots</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-xs text-slate-700 focus:outline-none focus:border-slate-400"
            >
              <option value="jackpot">Highest Jackpot</option>
              <option value="price">Lowest Ticket Price</option>
              <option value="popular">Most Popular</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200 p-8">
          <p className="text-base font-bold text-slate-800">No lotteries matched your filters</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or jackpot size requirements.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedCountry('All');
              setJackpotFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(lot => (
            <div
              key={lot.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg ${lot.logoBg} flex items-center justify-center font-bold ${lot.logoColor} text-xs border border-slate-200/60`}>
                    {lot.name.substring(0, 4).toUpperCase()}
                  </div>
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    {lot.category[0]}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <span>{lot.flag}</span>
                  <span>{lot.country}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {lot.name}
                </h3>

                <div className="mt-2.5">
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Current Jackpot</p>
                  <p className="text-xl font-extrabold text-slate-950 tracking-tight">
                    {lot.jackpotFormatted}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Schedule:</span>
                    <span className="font-medium text-slate-800">{lot.drawSchedule.split(' at ')[0]}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Next Draw:</span>
                    <span className="font-semibold text-slate-800">{lot.nextDrawDate.split(' ')[0]} {lot.nextDrawDate.split(' ')[1]}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex items-center justify-between mb-2.5 text-xs">
                  <span className="text-slate-500">Ticket + Courier</span>
                  <span className="font-bold text-slate-900">{formatMoney(lot.ticketPrice)}</span>
                </div>
                <button
                  onClick={() => onSelectLottery(lot.id)}
                  className="w-full h-9 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-md text-xs transition-colors shadow-xs"
                >
                  Choose Numbers
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Lottery</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Current Jackpot</th>
                  <th className="py-3 px-4">Next Draw</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(lot => (
                  <tr key={lot.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-md ${lot.logoBg} flex items-center justify-center font-bold ${lot.logoColor} text-[10px]`}>
                        {lot.name.substring(0, 3)}
                      </div>
                      <span>{lot.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="mr-1.5">{lot.flag}</span>
                      <span>{lot.country}</span>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-sm text-slate-950">
                      {lot.jackpotFormatted}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {lot.nextDrawDate}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-bold">
                      {formatMoney(lot.ticketPrice)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectLottery(lot.id)}
                        className="h-8 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors shadow-xs"
                      >
                        Play Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
