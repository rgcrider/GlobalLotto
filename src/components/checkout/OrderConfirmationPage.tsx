import React from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Ticket, 
  ArrowRight, 
  FileText, 
  Sparkles,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OrderConfirmationPageProps {
  orderId: string;
  onViewTickets: () => void;
  onGoHome: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  onViewTickets,
  onGoHome
}) => {
  const { userTickets, user, formatMoney, triggerSimulatedDraw } = useApp();

  const currentOrderTickets = userTickets.filter(t => t.orderId === orderId);
  const displayTickets = currentOrderTickets.length > 0 ? currentOrderTickets : userTickets.slice(0, 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl space-y-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed & Authorized
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 font-display">
            Your Lottery Tickets are Being Purchased!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Our local authorized courier has received your entry numbers and is securing your official physical lottery tickets.
          </p>
        </div>

        {/* Order Meta Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Order Reference</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{orderId}</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-500 block text-[11px]">Courier Dispatch</span>
            <span className="font-bold text-slate-900">Assigned (#US-L842)</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-500 block text-[11px]">Ticket Scan ETA</span>
            <span className="font-bold text-emerald-600">~2 to 4 Hours</span>
          </div>
        </div>

        {/* Concierge Step Pipeline */}
        <div className="text-left space-y-3 p-5 rounded-2xl bg-slate-900 text-white shadow-inner">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Next Concierge Steps:
          </h4>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">✓</span>
              <span>1. Order payment processed & encrypted.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">2</span>
              <span>2. Local courier purchases official paper tickets at licensed lottery terminal.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">3</span>
              <span>3. High-resolution digital scan uploaded to your account with serial barcode.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">4</span>
              <span>4. Automated winning verification runs immediately following the official broadcast.</span>
            </div>
          </div>
        </div>

        {/* Demo Mode Action Box */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Interactive Demo Simulator</span>
            </div>
            <p className="text-[11px] text-amber-900 mt-0.5">
              Want to test result verification immediately? Trigger a live draw right now to see matching balls and winnings deposited!
            </p>
          </div>
          <button
            onClick={() => {
              triggerSimulatedDraw(displayTickets[0]?.lotteryId || 'powerball');
              onViewTickets();
            }}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 shadow-sm"
          >
            Trigger Simulated Draw Now
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onViewTickets}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>View My Tickets & Scans</span>
          </button>
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
