import React from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Scan, 
  Lock, 
  Trophy, 
  ArrowRight, 
  CheckCircle2,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface HowItWorksPageProps {
  onSelectLottery: (id: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onSelectLottery }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Independent Courier Purchasing
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-1">
          How GlobalLotto Works
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Understand our legal, transparent ticket concierge service that connects international players with official national lottery draws worldwide.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            1
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            You Pick Your Lucky Numbers
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Select numbers manually or utilize our cryptographic Quick Pick generator on any of our 180+ listed international draws, such as US Powerball, EuroMillions, or SuperEnalotto.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            2
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            Local Courier Purchases Real Tickets
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our authorized local representatives in the draw's host country physically visit licensed lottery retailers to print the official paper tickets matching your selected numbers.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            3
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            Scanned Proof Stored in Your Vault
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Before the official draw commences, a high-definition digital scan displaying the ticket barcode, terminal ID, and your numbers is uploaded straight into your secure player profile.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
            4
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            100% Commission-Free Payouts
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            When you win, secondary tier prizes are credited instantly to your wallet with zero commission deducted. For jackpot wins, we hand-deliver the physical ticket to you or coordinate in-person redemption.
          </p>
        </div>
      </div>

      {/* Trust & Legality Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4">
        <h3 className="text-2xl font-black font-display text-white">
          Is Playing via a Lottery Concierge Legal?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Yes! Host country lottery commissions (such as the US Multi-State Lottery Association or European lotteries) do not restrict foreign nationals from buying and holding lottery tickets, as long as the physical ticket is legitimately purchased within the host jurisdiction. You are the sole legal owner of the ticket.
        </p>
        <div className="pt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sole Legal Ticket Ownership</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Physical Paper Tickets Stored in Vaults</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PCI-DSS Level 1 Encryption</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onSelectLottery('powerball')}
          className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm inline-flex items-center gap-2 shadow-lg transition-all"
        >
          <span>Choose Your Lottery & Play Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
