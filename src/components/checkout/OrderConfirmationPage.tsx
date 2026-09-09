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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6 text-center">
        {/* Success Icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 stroke-[2]" />
        </div>

        <div>
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded">
            Order Confirmed & Authorized
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2.5 tracking-tight">
            Lottery Tickets Dispatched to Courier
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
            Our local authorized courier has received your numbers and will physically purchase your tickets at an authorized state lottery terminal.
          </p>
        </div>

        {/* Order Meta Box */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Order Reference</span>
            <span className="font-mono font-bold text-slate-900 text-xs">{orderId}</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-500 block text-[11px]">Courier Terminal</span>
            <span className="font-semibold text-slate-900">Assigned (#US-L842)</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-500 block text-[11px]">Scan Upload ETA</span>
            <span className="font-semibold text-emerald-700">2 to 4 Hours</span>
          </div>
        </div>

        {/* Concierge Step Pipeline */}
        <div className="text-left space-y-2.5 p-4 rounded-lg bg-slate-900 text-white">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            Fulfillment Process:
          </h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">✓</span>
              <span>1. Order payment confirmed and secured via TLS encryption.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-semibold text-[10px]">2</span>
              <span>2. Courier physically prints your paper tickets at an authorized retailer.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-semibold text-[10px]">3</span>
              <span>3. High-resolution scanned copy uploaded to your account with serial barcode.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-semibold text-[10px]">4</span>
              <span>4. Direct deposit of prize winnings into your wallet following official draw.</span>
            </div>
          </div>
        </div>

        {/* Demo Mode Action Box */}
        <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Interactive Verification Simulator</span>
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Simulate an official draw to see your numbers matched and test real-time wallet settlement.
            </p>
          </div>
          <button
            onClick={() => {
              triggerSimulatedDraw(displayTickets[0]?.lotteryId || 'powerball');
              onViewTickets();
            }}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-colors shrink-0 shadow-xs"
          >
            Simulate Draw
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
          <button
            onClick={onViewTickets}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>View Tickets & Scans</span>
          </button>
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
