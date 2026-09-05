import React from 'react';
import { X, ShieldCheck, Download, Printer, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ScannedTicketModal: React.FC = () => {
  const { selectedTicketForProof, setSelectedTicketForProof, lotteries } = useApp();

  if (!selectedTicketForProof) return null;

  const lottery = lotteries.find(l => l.id === selectedTicketForProof.lotteryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#07132b]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">Verified Scanned Ticket Proof</h3>
              <p className="text-[11px] text-slate-400">Official physical ticket purchased by local courier</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedTicketForProof(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Realistic Physical Lottery Ticket Representation */}
        <div className="p-6 bg-slate-950 max-h-[75vh] overflow-y-auto">
          <div className="bg-amber-50/95 text-slate-900 p-6 rounded-xl shadow-inner font-mono text-xs border border-amber-200 relative">
            {/* Ticket Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-400">
              <div className="font-bold text-sm tracking-wider uppercase">{lottery?.name || 'OFFICIAL LOTTERY'}</div>
              <div className="text-[10px] text-slate-600">STATE / NATIONAL LOTTERY TERMINAL #44109</div>
              <div className="text-[10px] text-slate-600">RETAILER: GLOBALLOTTO AUTHORIZED COURIER</div>
              <div className="mt-2 text-[11px] font-bold text-slate-800">
                DRAW DATE: {selectedTicketForProof.drawDate.toUpperCase()}
              </div>
            </div>

            {/* Lines */}
            <div className="py-4 space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase border-b border-slate-300 pb-1">
                <span>LINE</span>
                <span>NUMBERS</span>
                <span>{lottery?.rules.bonusName.toUpperCase() || 'BONUS'}</span>
              </div>
              {selectedTicketForProof.lines.map((line, idx) => (
                <div key={line.id || idx} className="flex items-center justify-between text-xs py-0.5">
                  <span className="font-bold text-slate-700 w-8">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <div className="flex gap-1.5 font-bold tracking-wider text-slate-900">
                    {line.mainNumbers.map(n => (
                      <span key={n} className="bg-white/80 border border-slate-300 px-1 rounded shadow-xs">
                        {String(n).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                  <div className="w-10 text-right">
                    {line.bonusNumbers.map(b => (
                      <span key={b} className="bg-amber-400/30 border border-amber-500 font-bold px-1 rounded ml-1">
                        {String(b).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Metadata & Barcode */}
            <div className="pt-4 border-t border-dashed border-slate-400 space-y-2">
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>TICKET ID: {selectedTicketForProof.id}</span>
                <span>ORDER ID: {selectedTicketForProof.orderId}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>TIMESTAMP: {selectedTicketForProof.purchaseDate}</span>
                <span>STATUS: CONFIRMED</span>
              </div>

              {/* Simulated Barcode */}
              <div className="pt-3 pb-1 text-center">
                <div className="h-10 w-full bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_7px,transparent_7px,transparent_9px,#000_9px,#000_13px,transparent_13px,transparent_15px)] mx-auto max-w-[280px]"></div>
                <div className="text-[9px] tracking-widest text-slate-600 mt-1">
                  * 8 8 2 9 1 - {selectedTicketForProof.id} - 4 0 9 2 *
                </div>
              </div>
            </div>

            {/* Courier Verification Watermark */}
            <div className="mt-4 pt-2 border-t border-slate-300 flex items-center justify-between text-[10px] text-emerald-800 bg-emerald-100/60 p-2 rounded">
              <span className="flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                VERIFIED BY GLOBALLOTTO COURIER
              </span>
              <span className="text-slate-600">SAFE STORAGE #VAULT-04</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#07132b] border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            Official ticket stored in high-security jurisdictional safe.
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert('Demo Mode: Ticket PDF receipt downloaded.')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
