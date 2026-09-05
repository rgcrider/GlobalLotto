import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CartPageProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onProceedToCheckout,
  onContinueShopping
}) => {
  const { cart, removeFromCart, clearCart, cartTotal, formatMoney, lotteries } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'WELCOME10' || code === 'LUCKY10') {
      setPromoDiscount(10);
      setPromoMessage('Promo code applied: $10 discount credited!');
    } else if (code === 'VIPFREE') {
      setPromoDiscount(15);
      setPromoMessage('VIP Promo code applied: $15 discount credited!');
    } else {
      setPromoMessage('Invalid promo code. Try WELCOME10 or LUCKY10 for testing.');
    }
  };

  const finalTotal = Math.max(0, cartTotal - promoDiscount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-display">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Explore world-class lotteries like Powerball, EuroMillions, and Mega Millions to pick your lucky numbers.
        </p>
        <button
          onClick={onContinueShopping}
          className="mt-4 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md inline-flex items-center gap-2"
        >
          <span>Browse Lotteries</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Title */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onContinueShopping}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl font-black text-slate-900 font-display">
            Shopping Cart ({cart.length} {cart.length === 1 ? 'Order' : 'Orders'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => {
            const lottery = lotteries.find(l => l.id === item.lotteryId);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl ${lottery?.logoBg || 'bg-blue-600'} flex items-center justify-center font-black ${lottery?.logoColor || 'text-white'} text-xs font-display`}>
                        {lottery?.name.substring(0, 3)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{lottery?.name}</h3>
                        <p className="text-xs text-slate-500">
                          {lottery?.flag} {lottery?.country} • Draw: {item.drawDate.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors md:hidden"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lines List Preview */}
                  <div className="space-y-1.5 pt-2">
                    <p className="text-xs font-bold text-slate-700">
                      {item.lines.length} Line(s) Selected:
                    </p>
                    <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 font-mono text-xs border border-slate-100">
                      {item.lines.map((l, lIdx) => (
                        <div key={lIdx} className="flex items-center justify-between text-slate-700">
                          <span className="font-bold text-slate-400 w-6">L{lIdx + 1}:</span>
                          <div className="flex gap-1.5">
                            {l.mainNumbers.map(n => (
                              <span key={n} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                                {String(n).padStart(2, '0')}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-1">
                            {l.bonusNumbers.map(b => (
                              <span key={b} className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold border border-amber-300">
                                {String(b).padStart(2, '0')}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Draw Option Badge */}
                  <div className="text-xs text-slate-500">
                    Package: <span className="font-semibold text-blue-600">{item.drawOption.toUpperCase()}</span>
                    {item.multiDrawCount > 1 && ` (${item.multiDrawCount} consecutive official draws)`}
                  </div>
                </div>

                {/* Right Item Cost & Action */}
                <div className="flex flex-row md:flex-col justify-between items-end md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[140px]">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-500">Item Total</p>
                    <p className="text-xl font-black text-slate-900 font-display">
                      {formatMoney(item.total)}
                    </p>
                    {item.discount > 0 && (
                      <p className="text-[11px] text-emerald-600 font-bold">
                        Saved {formatMoney(item.discount)}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="hidden md:flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Checkout Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 font-display">
              Cart Summary
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Have a Promo Code?</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="WELCOME10"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-800 uppercase font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`text-xs ${promoDiscount > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {promoMessage}
                </p>
              )}
            </form>

            {/* Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Tickets + Courier):</span>
                <span>{formatMoney(cartTotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promotional Discount:</span>
                  <span>-{formatMoney(promoDiscount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Due:</span>
                <span className="text-2xl font-black text-amber-500 font-display">
                  {formatMoney(finalTotal)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="pt-2">
              <button
                onClick={onProceedToCheckout}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>256-Bit SSL Encrypted Concierge Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Commission on all secondary and jackpot prizes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
