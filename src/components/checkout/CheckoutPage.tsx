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
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Shopping Cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Payment Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Step 2 of 2 · Payment & Fulfillment
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                Secure Concierge Checkout
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                All transactions are encrypted with 256-bit TLS and processed via PCI-DSS compliant gateways.
              </p>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2.5">
                Select Settlement Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Wallet Balance */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'wallet'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-slate-800 mb-2" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Wallet</p>
                    <p className="text-[10px] text-slate-500">{formatMoney(walletBalance)}</p>
                  </div>
                </button>

                {/* Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-500 mb-2" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Credit Card</p>
                    <p className="text-[10px] text-slate-500">Visa / MC</p>
                  </div>
                </button>

                {/* Crypto */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'crypto'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Coins className="w-4 h-4 text-emerald-600 mb-2" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Crypto</p>
                    <p className="text-[10px] text-slate-500">BTC / USDT</p>
                  </div>
                </button>

                {/* Apple / Google Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-slate-700 mb-2" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Instant Pay</p>
                    <p className="text-[10px] text-slate-500">Apple/Google</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Method Specific Form */}
            {paymentMethod === 'wallet' && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Available Wallet Balance:</span>
                  <span className="font-bold text-slate-900 text-sm">{formatMoney(walletBalance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Order Amount:</span>
                  <span className="font-bold text-slate-900 text-sm">{formatMoney(cartTotal)}</span>
                </div>
                {!isWalletSufficient ? (
                  <div className="pt-2 text-rose-600 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Insufficient balance. Please choose Card or Crypto, or top up wallet.</span>
                  </div>
                ) : (
                  <div className="pt-2 text-emerald-600 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Your wallet balance covers this purchase in full.</span>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={e => setCardExp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <p className="font-bold text-slate-900">Cryptocurrency Settlement</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Support for Bitcoin (BTC), Ethereum (ETH), and USDT (TRC-20 / ERC-20). Real-time block confirmation.
                </p>
                <div className="p-2.5 bg-white rounded border border-slate-200 font-mono text-[10px] text-slate-700 break-all">
                  Deposit Address: 0x71C88291fB092A8321049bE2390a823
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <p className="font-bold text-slate-900">Apple Pay, Google Pay & Instant Wire</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Biometric touch or face authentication will launch on confirming the order.
                </p>
              </div>
            )}

            {/* Compliance Checkboxes */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-700">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAge}
                  onChange={e => setAgreeAge(e.target.checked)}
                  className="mt-0.5 rounded text-slate-900 focus:ring-0"
                />
                <span>
                  I confirm that I am at least 18 years of age (or legal gaming age in my jurisdiction).
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-slate-900 focus:ring-0"
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
              className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:bg-slate-300 text-slate-950 font-bold py-3 rounded text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {isProcessing ? (
                <span>Securing Tickets with Authorized Courier...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Confirm & Purchase Tickets ({formatMoney(cartTotal)})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Order Review Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Order Review
            </h3>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {cart.map(item => {
                const lottery = lotteries.find(l => l.id === item.lotteryId);
                return (
                  <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{lottery?.flag}</span>
                        <span>{lottery?.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{formatMoney(item.total)}</span>
                    </div>

                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>{item.lines.length} Line(s) · {item.drawOption}</span>
                      <span>Draw: {item.drawDate.split(' ')[0]}</span>
                    </div>

                    {/* Compact Lines preview */}
                    <div className="bg-slate-50 p-2 rounded font-mono text-[10px] space-y-0.5 text-slate-600">
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
            <div className="pt-2.5 border-t border-slate-200 space-y-1.5 text-xs">
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
                <span className="text-xl font-extrabold text-amber-500">
                  {formatMoney(cartTotal)}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Ticket scans uploaded before draw closure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% money-back guarantee if ticket is unpurchased</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
