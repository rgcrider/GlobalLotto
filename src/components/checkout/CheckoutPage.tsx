import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Coins, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToCart,
  onOrderSuccess
}) => {
  const { cart, cartTotal, formatMoney, user, processCheckout, lotteries, isCountryBlocked, currentCountry } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [cardHolder, setCardHolder] = useState(user?.name || 'Alex Morgan');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8849');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('382');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeAge, setAgreeAge] = useState(true);

  const walletBalance = user?.walletBalance || 0;
  const isWalletSufficient = walletBalance >= cartTotal;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCountryBlocked) {
      alert(`Checkout is restricted from ${currentCountry}. Please select another jurisdiction in the header.`);
      return;
    }

    if (!agreeTerms || !agreeAge) {
      alert('Please confirm that you are 18+ and accept the courier concierge terms.');
      return;
    }

    if (paymentMethod === 'wallet' && !isWalletSufficient) {
      alert('Insufficient wallet balance. Please choose Card or Crypto, or top up your wallet.');
      return;
    }

    setIsProcessing(true);

    // Simulate realistic bank / blockchain authorization
    setTimeout(() => {
      const order = processCheckout(paymentMethod);
      setIsProcessing(false);
      if (order) {
        onOrderSuccess(order.id);
      }
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={onBackToCart}
        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Shopping Cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Payment Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Step 1 of 2
              </span>
              <h1 className="text-2xl font-black text-slate-900 font-display">
                Secure Concierge Checkout
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                All transactions are encrypted with 256-bit SSL and processed via authorized financial institutions.
              </p>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Wallet Balance */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-blue-600 mb-2" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Wallet</p>
                    <p className="text-[10px] text-slate-500">{formatMoney(walletBalance)}</p>
                  </div>
                </button>

                {/* Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-500 mb-2" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Credit Card</p>
                    <p className="text-[10px] text-slate-500">Visa / MC</p>
                  </div>
                </button>

                {/* Crypto */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'crypto'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Coins className="w-5 h-5 text-emerald-500 mb-2" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Crypto</p>
                    <p className="text-[10px] text-slate-500">BTC / USDT</p>
                  </div>
                </button>

                {/* Apple / Google Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-purple-600 mb-2" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Pay / Bank</p>
                    <p className="text-[10px] text-slate-500">Instant</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Method Specific Form */}
            {paymentMethod === 'wallet' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Available Account Wallet Balance:</span>
                  <span className="font-bold text-slate-900 text-sm">{formatMoney(walletBalance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Order Amount:</span>
                  <span className="font-bold text-blue-600 text-sm">{formatMoney(cartTotal)}</span>
                </div>
                {!isWalletSufficient ? (
                  <div className="pt-2 text-rose-600 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Insufficient wallet balance. Please switch to Credit Card or Crypto.</span>
                  </div>
                ) : (
                  <div className="pt-2 text-emerald-600 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Your wallet balance is sufficient for instant 1-click purchase!</span>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Name on Card</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={e => setCardExp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <p className="font-bold text-slate-800">Direct Cryptocurrency Settlement</p>
                <p className="text-slate-500 leading-relaxed">
                  Support for Bitcoin (BTC), Ethereum (ETH), and USDT (TRC-20 / ERC-20). The transaction will be authenticated instantly via our automated clearing daemon.
                </p>
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 break-all">
                  Deposit Address: 0x71C...49bE2390a823
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <p className="font-bold text-slate-800">Apple Pay, Google Pay & Instant Wire</p>
                <p className="text-slate-500 leading-relaxed">
                  Biometric touch/face ID checkout will prompt immediately upon clicking Place Order.
                </p>
              </div>
            )}

            {/* Compliance Checkboxes */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAge}
                  onChange={e => setAgreeAge(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0"
                />
                <span>
                  I confirm that I am at least 18 years of age (or legal age required in my jurisdiction) and legally authorized to play.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0"
                />
                <span>
                  I authorize GlobalLotto's independent courier representative to physically purchase official tickets on my behalf.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-300 text-slate-950 font-black py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isProcessing ? (
                <span>Securing Tickets with Authorized Courier...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirm & Purchase Tickets ({formatMoney(cartTotal)})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Order Review Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 font-display">
              Order Review
            </h3>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {cart.map(item => {
                const lottery = lotteries.find(l => l.id === item.lotteryId);
                return (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{lottery?.flag}</span>
                        <span>{lottery?.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{formatMoney(item.total)}</span>
                    </div>

                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>{item.lines.length} Line(s) • {item.drawOption}</span>
                      <span>Draw: {item.drawDate.split(' ')[0]}</span>
                    </div>

                    {/* Compact Lines preview */}
                    <div className="bg-slate-50 p-2 rounded-lg font-mono text-[10px] space-y-0.5 text-slate-600">
                      {item.lines.slice(0, 2).map((line, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>L{idx + 1}: {line.mainNumbers.join(', ')}</span>
                          <span className="text-amber-600 font-bold">PB: {line.bonusNumbers.join(', ')}</span>
                        </div>
                      ))}
                      {item.lines.length > 2 && (
                        <p className="text-[9px] text-slate-400">+{item.lines.length - 2} more line(s)</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Breakdown */}
            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Official Tickets Cost:</span>
                <span>{formatMoney(cartTotal * 0.7)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Concierge & Courier Service:</span>
                <span>{formatMoney(cartTotal * 0.3)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Payable:</span>
                <span className="text-2xl font-black text-amber-500 font-display">
                  {formatMoney(cartTotal)}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Ticket scans uploaded before draw closure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% money-back guarantee if ticket is unpurchased</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
