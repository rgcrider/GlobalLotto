import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Users, 
  DollarSign, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  FileText,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { 
    lotteries, 
    tickets, 
    formatMoney, 
    triggerSimulatedDraw, 
    currentCountry, 
    setCurrentCountry,
    isCountryBlocked
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'orders' | 'draws' | 'lotteries' | 'fraud' | 'jurisdictions'>('overview');
  const [selectedLotteryToDraw, setSelectedLotteryToDraw] = useState(lotteries[0]?.id || 'powerball');
  const [simulatedDrawStatus, setSimulatedDrawStatus] = useState<string | null>(null);

  // Scan upload simulation
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleTriggerSimulatedDraw = () => {
    const result = triggerSimulatedDraw(selectedLotteryToDraw);
    setSimulatedDrawStatus(`Simulated draw broadcast complete! Winning numbers: ${result.winningMain.join(', ')} + Bonus: ${result.winningBonus.join(', ')}. All player tickets checked.`);
  };

  const handleSimulateScanUpload = (ticketId: string) => {
    setUploadSuccess(`Courier uploaded verified paper ticket scan for ticket #${ticketId}!`);
    setTimeout(() => setUploadSuccess(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Operator Management Portal
            </span>
            <span className="text-xs text-slate-400">Global Concierge Operations Desk #OPS-01</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Concierge Logistics & Draw Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Oversee physical ticket procurement, upload verified ticket scans, trigger draw reconciliations, and monitor AML risk.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl text-xs space-y-1">
          <p className="text-slate-400">Active Courier Units:</p>
          <p className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            14 Jurisdictional Offices Online
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs sm:text-sm font-bold">
        {(['overview', 'orders', 'draws', 'lotteries', 'fraud', 'jurisdictions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveAdminTab(tab)}
            className={`px-4 py-2 rounded-xl capitalize transition-all ${
              activeAdminTab === tab ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Gross Platform Sales</span>
              <p className="text-2xl font-black text-slate-900 font-display mt-1">$1,248,920</p>
              <span className="text-[11px] text-emerald-600 font-bold">+18.4% this week</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Courier Fulfilled Tickets</span>
              <p className="text-2xl font-black text-slate-900 font-display mt-1">42,910</p>
              <span className="text-[11px] text-blue-600 font-bold">99.98% SLA completion</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Prizes Paid (Commission-Free)</span>
              <p className="text-2xl font-black text-emerald-600 font-display mt-1">$412,480</p>
              <span className="text-[11px] text-slate-500">100% credited to players</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">AML & Fraud Alerts</span>
              <p className="text-2xl font-black text-amber-500 font-display mt-1">0 Critical</p>
              <span className="text-[11px] text-emerald-600 font-bold">System fully nominal</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Live Courier Procurement Activity Feed
            </h3>
            <div className="divide-y divide-slate-100 text-xs text-slate-600">
              <div className="py-2.5 flex justify-between items-center">
                <span>[US Office] Agent #04 purchased 15 Powerball slips at Terminal 8842 (Orlando, FL).</span>
                <span className="text-slate-400 text-[11px]">2 mins ago</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>[EU Office] Scanned 20 EuroMillions tickets for Order #ORD-84920.</span>
                <span className="text-slate-400 text-[11px]">7 mins ago</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>[UK Office] High-resolution scan batch verified for Lotto 6/49.</span>
                <span className="text-slate-400 text-[11px]">14 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS & COURIER SCAN TAB */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Concierge Orders & Ticket Scan Queue
              </h3>
              <p className="text-xs text-slate-500">
                Manage incoming customer orders and simulate ticket courier scan uploads.
              </p>
            </div>
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Ticket / Order ID</th>
                  <th className="py-3 px-4">Lottery</th>
                  <th className="py-3 px-4">Draw Date</th>
                  <th className="py-3 px-4">Lines</th>
                  <th className="py-3 px-4">Courier Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map(t => {
                  const lot = lotteries.find(l => l.id === t.lotteryId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.id}</td>
                      <td className="py-3 px-4 font-semibold">{lot?.name || t.lotteryId}</td>
                      <td className="py-3 px-4 text-slate-600">{t.drawDate}</td>
                      <td className="py-3 px-4 text-slate-600">{t.lines.length} Line(s)</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSimulateScanUpload(t.id)}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                        >
                          Re-Upload Scan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DRAWS TAB */}
      {activeAdminTab === 'draws' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Broadcast Reconciliation & Draw Engine
            </h3>
            <p className="text-xs text-slate-500">
              Input official broadcast winning numbers or trigger simulated draws to verify tickets and settle prize distributions automatically.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Lottery Draw</label>
              <select
                value={selectedLotteryToDraw}
                onChange={e => setSelectedLotteryToDraw(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              >
                {lotteries.map(l => (
                  <option key={l.id} value={l.id}>{l.name} ({l.country})</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleTriggerSimulatedDraw}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors shadow-sm"
            >
              Trigger Draw & Reconcile All Player Tickets
            </button>

            {simulatedDrawStatus && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {simulatedDrawStatus}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOTTERIES CATALOG TAB */}
      {activeAdminTab === 'lotteries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-display">
            Lottery Catalog Management
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lotteries.map(l => (
              <div key={l.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{l.name}</p>
                  <p className="text-slate-500">{l.country} • {l.jackpotFormatted}</p>
                  <p className="text-[10px] text-emerald-600 font-bold">Courier Status: Available</p>
                </div>
                <button
                  onClick={() => alert(`Demo Mode: Settings updated for ${l.name}.`)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100"
                >
                  Edit Rules
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FRAUD & RISK TAB */}
      {activeAdminTab === 'fraud' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Anti-Money Laundering (AML) & Risk Rules
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Automated heuristic monitoring flags high-velocity deposits, rapid credit card attempts, and multiple account fingerprints.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">Velocity Rule: Max 5 orders per hour</p>
                <p className="text-slate-500">Blocks bot scripts from spamming concierge procurement</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                ENFORCED
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">KYC Requirement on Withdrawals &gt; $2,500</p>
                <p className="text-slate-500">Requires government photo identification and address verification</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                ENFORCED
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">Geolocation IP Clearance Check</p>
                <p className="text-slate-500">Automatically restricts purchases from blocked or embargoed countries</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                ENFORCED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* JURISDICTIONS TAB */}
      {activeAdminTab === 'jurisdictions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 font-display">
            Jurisdiction Compliance Manager
          </h3>
          <p className="text-xs text-slate-500">
            Control which countries can place concierge orders. Testing tool: switch the current active country to preview how the app behaves for restricted vs permitted visitors.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700">Currently Simulated Visitor Country:</span>
              <span className="font-bold text-blue-600">{currentCountry}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700">Purchasing Status:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                isCountryBlocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isCountryBlocked ? 'RESTRICTED / BLOCKED' : 'PERMITTED'}
              </span>
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Switch Test Country:</label>
              <select
                value={currentCountry}
                onChange={e => setCurrentCountry(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
              >
                <option value="United States">United States (Allowed)</option>
                <option value="Canada">Canada (Allowed)</option>
                <option value="United Kingdom">United Kingdom (Allowed)</option>
                <option value="Australia">Australia (Allowed)</option>
                <option value="Germany">Germany (Allowed)</option>
                <option value="North Korea">North Korea (Restricted Demo)</option>
                <option value="Iran">Iran (Restricted Demo)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
