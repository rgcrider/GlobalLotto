import React, { useState } from 'react';
import { Search, X, ArrowRight, Trophy, FileText, CheckCircle2, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GlobalSearchModalProps {
  onSelectLottery: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ onSelectLottery, onNavigate }) => {
  const { isSearchOpen, setIsSearchOpen, lotteries, formatMoney } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredLotteries = query.trim() === '' 
    ? lotteries.slice(0, 4)
    : lotteries.filter(l => 
        l.name.toLowerCase().includes(query.toLowerCase()) || 
        l.country.toLowerCase().includes(query.toLowerCase()) ||
        l.category.some(c => c.toLowerCase().includes(query.toLowerCase()))
      );

  const helpTopics = [
    { title: 'How does the physical ticket scan work?', view: 'how-it-works' },
    { title: 'Are lottery winnings subject to commission?', view: 'help' },
    { title: 'How to claim a prize over $50,000', view: 'help' },
    { title: 'Responsible gaming deposit and spend limits', view: 'responsible-gaming' }
  ].filter(h => query === '' || h.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-[#07132b]">
          <Search className="w-5 h-5 text-amber-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search lotteries (Powerball, EuroMillions), results, rules, or help..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Lotteries Match */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Lottery Draws</span>
              <span className="text-[11px] text-amber-400">{filteredLotteries.length} available</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredLotteries.map(l => (
                <div
                  key={l.id}
                  onClick={() => {
                    onSelectLottery(l.id);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{l.flag}</span>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {l.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{l.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-amber-400">{l.jackpotFormatted}</p>
                    <p className="text-[10px] text-slate-500">From {formatMoney(l.ticketPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help & Articles Match */}
          {helpTopics.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Help & Information Articles
              </div>
              <div className="space-y-1.5">
                {helpTopics.map((topic, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onNavigate(topic.view);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      {topic.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
