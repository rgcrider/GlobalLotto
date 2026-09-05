import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  Mail, 
  Sliders, 
  TrendingUp, 
  Play, 
  RotateCcw,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface JackpotAlertsTabProps {
  onSelectLottery: (id: string) => void;
}

export const JackpotAlertsTab: React.FC<JackpotAlertsTabProps> = ({ onSelectLottery }) => {
  const { 
    jackpotAlerts, 
    lotteries, 
    formatMoney, 
    openJackpotAlertModal, 
    removeJackpotAlert, 
    toggleJackpotAlert, 
    testTriggerJackpotAlert,
    setJackpotAlert,
    adminUpdateLottery,
    user 
  } = useApp();

  const [testingAlertId, setTestingAlertId] = useState<string | null>(null);
  const [rolloverSuccess, setRolloverSuccess] = useState<string | null>(null);

  const activeAlertsCount = jackpotAlerts.filter(a => a.active).length;
  const triggeredCount = jackpotAlerts.filter(a => a.triggered).length;

  const handleTestTrigger = (alertId: string) => {
    setTestingAlertId(alertId);
    testTriggerJackpotAlert(alertId);
    setTimeout(() => setTestingAlertId(null), 2500);
  };

  const handleSimulateRollover = (lotteryId: string, increaseMillions: number) => {
    const lot = lotteries.find(l => l.id === lotteryId);
    if (!lot) return;

    const newAmount = lot.jackpotAmount + increaseMillions;
    const formatted = newAmount >= 1000 
      ? `$${(newAmount / 1000).toFixed(2)} Billion` 
      : `$${newAmount} Million`;

    adminUpdateLottery(lotteryId, {
      jackpotAmount: newAmount,
      jackpotFormatted: formatted
    });

    setRolloverSuccess(`${lot.name} jackpot simulated rollover to ${formatted}! Checking threshold alerts...`);
    setTimeout(() => setRolloverSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & New Alert CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <BellRing className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Jackpot Price Alerts
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Configure threshold notifications for any international draw. You'll receive automated notifications the moment a jackpot climbs past your milestone.
          </p>
        </div>

        <button
          onClick={() => openJackpotAlertModal()}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/10 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Set New Price Alert</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Monitored Alerts</span>
          <p className="text-2xl font-black text-slate-900 font-display mt-1">{jackpotAlerts.length}</p>
          <span className="text-[10px] text-slate-400">Total configured</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Active Monitoring</span>
          <p className="text-2xl font-black text-blue-600 font-display mt-1">{activeAlertsCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold">● Live tracking active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Thresholds Met</span>
          <p className="text-2xl font-black text-emerald-600 font-display mt-1">{triggeredCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold">Ready to play</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Notification Channels</span>
          <p className="text-sm font-black text-slate-900 font-display mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            In-App & Email
          </p>
          <span className="text-[10px] text-slate-500 truncate block">
            {user?.email || 'alex.morgan@example.com'}
          </span>
        </div>
      </div>

      {/* Notification Toast for Rollover Simulation */}
      {rolloverSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{rolloverSuccess}</span>
        </div>
      )}

      {/* Alerts List */}
      {jackpotAlerts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-display">
            No Price Alerts Set Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Never miss a huge jackpot rollover. Set your target amount and we'll alert you the moment the prize pot reaches your goal.
          </p>

          {/* Quick preset recommendations */}
          <div className="mt-6 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setJackpotAlert('powerball', 500)}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-colors"
            >
              <p className="text-xs font-bold text-slate-900">🇺🇸 US Powerball</p>
              <p className="text-[11px] text-blue-600 font-bold mt-1">Alert at $500M</p>
            </button>
            <button
              onClick={() => setJackpotAlert('megamillions', 1000)}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-colors"
            >
              <p className="text-xs font-bold text-slate-900">🇺🇸 Mega Millions</p>
              <p className="text-[11px] text-blue-600 font-bold mt-1">Alert at $1.0 Billion</p>
            </button>
            <button
              onClick={() => setJackpotAlert('euromillions', 150)}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-colors"
            >
              <p className="text-xs font-bold text-slate-900">🇪🇺 EuroMillions</p>
              <p className="text-[11px] text-blue-600 font-bold mt-1">Alert at €150M</p>
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={() => openJackpotAlertModal()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Configure Custom Price Alert</span>
            </button>
          </div>
        </div>
      ) : (
        /* Alerts Grid */
        <div className="space-y-4">
          {jackpotAlerts.map(alert => {
            const lot = lotteries.find(l => l.id === alert.lotteryId);
            if (!lot) return null;

            const isMet = lot.jackpotAmount >= alert.thresholdAmount;
            const progressPct = Math.min(100, Math.round((lot.jackpotAmount / alert.thresholdAmount) * 100));

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs hover:shadow-md ${
                  isMet 
                    ? 'border-emerald-200 bg-gradient-to-r from-white via-white to-emerald-50/30' 
                    : alert.active 
                    ? 'border-slate-200' 
                    : 'border-slate-200 opacity-70 bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                  {/* Left: Lottery Info */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${lot.logoBg} flex items-center justify-center font-black ${lot.logoColor} text-xs shadow-sm font-display shrink-0`}>
                      {lot.name.substring(0, 5).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{lot.flag}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase">{lot.country}</span>
                        <span>•</span>
                        <span className="text-xs text-slate-500">Draw: {lot.nextDrawDate.split(' ')[0]}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
                        {lot.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                        <span className="text-slate-600">
                          Current Jackpot: <strong className="text-slate-950 font-black">{lot.jackpotFormatted}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-blue-600 font-bold">
                          Threshold: {alert.thresholdAmount >= 1000 ? `$${alert.thresholdAmount / 1000}B` : `$${alert.thresholdAmount}M`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Progress Bar & Status */}
                  <div className="w-full lg:w-64 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-600">Target Progress</span>
                      <span className="font-mono font-bold text-slate-900">{progressPct}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isMet 
                            ? 'bg-emerald-500' 
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className={isMet ? 'text-emerald-700 font-bold flex items-center gap-1' : 'text-slate-500'}>
                        {isMet ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                            <span>Target Reached! Ready to play</span>
                          </>
                        ) : (
                          `Requires $${alert.thresholdAmount - lot.jackpotAmount}M rollover`
                        )}
                      </span>
                      <span className="text-slate-400">
                        {alert.active ? (
                          <span className="text-emerald-600 font-bold">Active</span>
                        ) : (
                          <span className="text-slate-400">Paused</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
                    {/* Play Now Button */}
                    <button
                      onClick={() => onSelectLottery(alert.lotteryId)}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Play Now</span>
                    </button>

                    {/* Test Trigger Button */}
                    <button
                      onClick={() => handleTestTrigger(alert.id)}
                      disabled={testingAlertId === alert.id}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      title="Send test alert notification right now"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{testingAlertId === alert.id ? 'Sent!' : 'Test'}</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => openJackpotAlertModal(alert.lotteryId)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      title="Edit threshold amount"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>

                    {/* Active/Pause Toggle */}
                    <button
                      onClick={() => toggleJackpotAlert(alert.id)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${
                        alert.active 
                          ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100' 
                          : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-100'
                      }`}
                      title={alert.active ? 'Pause alerts for this draw' : 'Resume alerts'}
                    >
                      {alert.active ? 'Active' : 'Paused'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => removeJackpotAlert(alert.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors"
                      title="Remove price alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Bell className="w-3 h-3 text-blue-500" />
                      In-App: {alert.notifyInApp ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-emerald-500" />
                      Email: {alert.notifyEmail ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div>
                    {alert.lastNotifiedAt ? (
                      <span>Last notified: <strong>{alert.lastNotifiedAt}</strong></span>
                    ) : (
                      <span>Created: {alert.createdAt}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Rollover Simulator Playground */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Concierge Demo</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Test Rollover Jackpot Alerts
            </h3>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Simulate a rollover to see how GlobalLotto automatically notifies you when a jackpot crosses your threshold.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSimulateRollover('powerball', 100)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              Powerball + $100M
            </button>
            <button
              onClick={() => handleSimulateRollover('megamillions', 150)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
            >
              Mega Millions + $150M
            </button>
            <button
              onClick={() => handleSimulateRollover('euromillions', 50)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
            >
              EuroMillions + €50M
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
