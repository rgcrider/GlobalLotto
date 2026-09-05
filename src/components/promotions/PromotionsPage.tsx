import React, { useState } from 'react';
import { 
  Gift, 
  Tag, 
  Layers, 
  Users, 
  Trophy, 
  Check, 
  ArrowRight, 
  Copy,
  Sparkles
} from 'lucide-react';
import { PROMOTIONS } from '../../data/promotions';
import { useApp } from '../../context/AppContext';

interface PromotionsPageProps {
  onSelectLottery: (id: string) => void;
}

export const PromotionsPage: React.FC<PromotionsPageProps> = ({ onSelectLottery }) => {
  const { formatMoney } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyPromo = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#06142e] via-[#092250] to-[#0c3175] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>Exclusive Player Rewards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
            Promotions & Bonus Entries
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Save on concierge service fees, earn complimentary lines, and receive VIP multi-draw discounts.
          </p>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROMOTIONS.map(promo => (
          <div
            key={promo.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {promo.value || promo.badge}
                </span>
                <span className="text-xs text-slate-400">Valid until {promo.expiresAt}</span>
              </div>

              <h3 className="text-xl font-black text-slate-900 font-display">{promo.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{promo.description}</p>

              {/* Promo Code Box */}
              {promo.code && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Coupon Code</span>
                    <span className="text-sm font-mono font-bold text-slate-900">{promo.code}</span>
                  </div>
                  <button
                    onClick={() => copyPromo(promo.code)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 p-1"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Applies at checkout</span>
              <button
                onClick={() => onSelectLottery('powerball')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Claim Offer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIP Program Spotlight */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Loyalty Club</span>
          <h3 className="text-2xl font-black text-white font-display">
            GlobalLotto VIP Tier Benefits
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every ticket line you purchase earns VIP reward points redeemable for free entry lines, personal account managers, and priority courier scan delivery.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg font-black text-amber-400">Bronze</p>
            <p className="text-[11px] text-slate-400">5% Bonus</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg font-black text-slate-300">Silver</p>
            <p className="text-[11px] text-slate-400">10% Bonus</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-400/40 text-center">
            <p className="text-lg font-black text-amber-300">Gold VIP</p>
            <p className="text-[11px] text-amber-200">20% Bonus</p>
          </div>
        </div>
      </div>
    </div>
  );
};
