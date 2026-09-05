import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  X, 
  Check, 
  Sparkles, 
  Sliders, 
  Mail, 
  Smartphone, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  Info,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const JackpotAlertModal: React.FC = () => {
  const { 
    isAlertModalOpen, 
    alertModalLotteryId, 
    closeJackpotAlertModal, 
    lotteries, 
    jackpotAlerts, 
    setJackpotAlert, 
    removeJackpotAlert,
    testTriggerJackpotAlert,
    user
  } = useApp();

  const [selectedLotteryId, setSelectedLotteryId] = useState<string>('powerball');
  const [thresholdAmount, setThresholdAmount] = useState<number>(500);
  const [notifyInApp, setNotifyInApp] = useState<boolean>(true);
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [testSent, setTestSent] = useState<boolean>(false);

  // Sync selected lottery when modal opens
  useEffect(() => {
    if (alertModalLotteryId) {
      setSelectedLotteryId(alertModalLotteryId);
    } else if (lotteries.length > 0 && !selectedLotteryId) {
      setSelectedLotteryId(lotteries[0].id);
    }
  }, [alertModalLotteryId, lotteries]);

  // Load existing alert settings if already configured for this lottery
  const existingAlert = jackpotAlerts.find(a => a.lotteryId === selectedLotteryId);
  const currentLottery = lotteries.find(l => l.id === selectedLotteryId) || lotteries[0];

  useEffect(() => {
    if (existingAlert) {
      setThresholdAmount(existingAlert.thresholdAmount);
      setNotifyInApp(existingAlert.notifyInApp);
      setNotifyEmail(existingAlert.notifyEmail);
    } else if (currentLottery) {
      // Default to next reasonable round number above or equal to current jackpot
      const cur = currentLottery.jackpotAmount;
      if (cur < 100) setThresholdAmount(100);
      else if (cur < 250) setThresholdAmount(250);
      else if (cur < 500) setThresholdAmount(500);
      else if (cur < 1000) setThresholdAmount(1000);
      else setThresholdAmount(Math.ceil((cur + 200) / 100) * 100);
    }
    setSavedSuccess(false);
    setTestSent(false);
  }, [selectedLotteryId, existingAlert?.id]);

  if (!isAlertModalOpen || !currentLottery) return null;

  // Preset options based on lottery size
  const isMega = ['powerball', 'megamillions', 'euromillions', 'eurojackpot'].includes(currentLottery.id);
  const presets = isMega 
    ? [250, 500, 750, 1000, 1500] 
    : [25, 50, 100, 200, 300];

  const formatThresholdDisplay = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 2)} Billion`;
    }
    return `$${amount} Million`;
  };

  const handleSave = () => {
    setJackpotAlert(selectedLotteryId, thresholdAmount, {
      notifyEmail,
      notifyInApp
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      closeJackpotAlertModal();
    }, 1200);
  };

  const handleDelete = () => {
    if (existingAlert) {
      removeJackpotAlert(existingAlert.id);
      closeJackpotAlertModal();
    }
  };

  const handleTestNotification = () => {
    if (existingAlert) {
      testTriggerJackpotAlert(existingAlert.id);
    } else {
      // Save first, then trigger test
      setJackpotAlert(selectedLotteryId, thresholdAmount, { notifyEmail, notifyInApp });
      setTimeout(() => {
        const newlyCreated = jackpotAlerts.find(a => a.lotteryId === selectedLotteryId);
        if (newlyCreated) {
          testTriggerJackpotAlert(newlyCreated.id);
        }
      }, 100);
    }
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const isThresholdMetNow = currentLottery.jackpotAmount >= thresholdAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={closeJackpotAlertModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-[11px] font-black uppercase tracking-wider">Jackpot Tracker</span>
                {existingAlert && (
                  <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Alert Active
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Set Jackpot Price Alert
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Never miss a record-breaking rollover. Get notified the moment the jackpot reaches your target.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          {/* Lottery Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Lottery
            </label>
            <div className="relative">
              <select
                value={selectedLotteryId}
                onChange={(e) => setSelectedLotteryId(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 pr-10 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {lotteries.map(lot => (
                  <option key={lot.id} value={lot.id}>
                    {lot.flag} {lot.name} — Current: {lot.jackpotFormatted}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Current Jackpot vs Target Display Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Current Jackpot</span>
              <p className="text-xl sm:text-2xl font-black text-slate-950 font-display">
                {currentLottery.jackpotFormatted}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                <span>{currentLottery.flag}</span>
                <span>Next draw: {currentLottery.nextDrawDate.split(' ')[0]}</span>
              </p>
            </div>

            <div className="text-right border-l border-blue-200/80 pl-5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Alert Target</span>
              <p className="text-xl sm:text-2xl font-black text-blue-600 font-display">
                {formatThresholdDisplay(thresholdAmount)}
              </p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                isThresholdMetNow ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isThresholdMetNow ? 'Threshold Reached! 🎉' : 'Monitoring Rollovers'}
              </span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quick Threshold Presets
              </label>
              <span className="text-[11px] text-slate-500">Pick a popular jackpot milestone</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {presets.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setThresholdAmount(amt)}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all border ${
                    thresholdAmount === amt
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {amt >= 1000 ? `$${amt / 1000}B` : `$${amt}M`}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Slider / Input */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                Custom Threshold Slider
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-500">$</span>
                <input
                  type="number"
                  min={10}
                  max={2500}
                  step={10}
                  value={thresholdAmount}
                  onChange={(e) => setThresholdAmount(Math.max(10, Number(e.target.value) || 0))}
                  className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900 text-right focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
                <span className="text-xs font-bold text-slate-700">Million</span>
              </div>
            </div>

            <input
              type="range"
              min={isMega ? 100 : 10}
              max={isMega ? 2000 : 500}
              step={isMega ? 25 : 5}
              value={thresholdAmount}
              onChange={(e) => setThresholdAmount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{isMega ? '$100M' : '$10M'}</span>
              <span>{isMega ? '$1 Billion' : '$250M'}</span>
              <span>{isMega ? '$2 Billion' : '$500M'}</span>
            </div>
          </div>

          {/* Notification Channels */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Notification Channels
            </label>
            <div className="space-y-2">
              {/* In-App */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">In-App Notification</p>
                    <p className="text-[11px] text-slate-500">Alert badge & drop-down alert in GlobalLotto header</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyInApp}
                  onChange={(e) => setNotifyInApp(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>

              {/* Email */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Email Notification</p>
                    <p className="text-[11px] text-slate-500">
                      Sent to <strong>{user?.email || 'alex.morgan@example.com'}</strong>
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Test Alert Button */}
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-900">Verify Alert Delivery</p>
                <p className="text-[11px] text-amber-700">Send an immediate test alert to preview in your header bell</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestNotification}
              disabled={testSent}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                testSent 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs'
              }`}
            >
              {testSent ? '✓ Alert Sent!' : 'Test Alert Now'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          {existingAlert ? (
            <button
              type="button"
              onClick={handleDelete}
              className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Delete this alert"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeJackpotAlertModal}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                savedSuccess
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Alert Saved!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>{existingAlert ? 'Update Alert' : 'Save Price Alert'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
