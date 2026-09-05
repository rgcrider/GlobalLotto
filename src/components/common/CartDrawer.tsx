import React from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCart: () => void;
  onNavigateToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToCart,
  onNavigateToCheckout
}) => {
  const { cart, removeFromCart, cartTotal, formatMoney, lotteries } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-[#07132b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Your Lottery Cart</h2>
              <span className="bg-amber-400/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
                <p className="text-sm font-medium text-slate-300">Your cart is currently empty</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse international lotteries like Powerball or EuroMillions and pick your numbers.
                </p>
              </div>
            ) : (
              cart.map(item => {
                const lottery = lotteries.find(l => l.id === item.lotteryId);
                return (
                  <div 
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{lottery?.flag}</span>
                        <div>
                          <p className="text-sm font-bold text-white">{lottery?.name}</p>
                          <p className="text-[11px] text-slate-400">{item.lines.length} Line(s) • {item.drawOption}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Lines Preview */}
                    <div className="bg-slate-900/90 rounded-lg p-2 text-xs font-mono space-y-1 text-slate-300">
                      {item.lines.slice(0, 2).map((l, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-bold">L{idx + 1}:</span>
                          <span>{l.mainNumbers.join(', ')}</span>
                          <span className="text-amber-400 font-bold">PB: {l.bonusNumbers.join(', ')}</span>
                        </div>
                      ))}
                      {item.lines.length > 2 && (
                        <div className="text-[10px] text-slate-500 text-center">
                          +{item.lines.length - 2} more line(s)
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-400">Total with Concierge:</span>
                      <span className="font-bold text-amber-400 text-sm">{formatMoney(item.total)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#07132b] border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Subtotal:</span>
                <span className="text-white font-semibold">{formatMoney(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold">
                <span className="text-white">Estimated Total:</span>
                <span className="text-amber-400 font-display text-lg">{formatMoney(cartTotal)}</span>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCheckout();
                  }}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCart();
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  View Full Cart Details
                </button>
              </div>

              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Commission-Free Official Concierge</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
