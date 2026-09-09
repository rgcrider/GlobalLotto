import React, { useState } from 'react';
import { 
  Ticket, 
  Wallet as WalletIcon, 
  Trophy, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Heart, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  ExternalLink,
  Sparkles,
  HelpCircle,
  Eye,
  Sliders,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchasedTicket } from '../../types';

interface DashboardPageProps {
  initialTab?: string;
  onSelectLottery: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  initialTab = 'tickets',
  onSelectLottery
}) => {
  const { 
    user, 
    tickets, 
    transactions, 
    lotteries, 
    formatMoney, 
    depositToWallet, 
    withdrawFromWallet, 
    setSelectedTicketForProof,
    triggerSimulatedDraw,
    saveFavoriteNumber
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [ticketFilter, setTicketFilter] = useState<'all' | 'active' | 'winning' | 'past'>('all');

  // Deposit modal/input
  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(20);
  const [withdrawMessage, setWithdrawMessage] = useState<string | null>(null);

  // Responsible gaming limits state
  const [dailyLimit, setDailyLimit] = useState(100);
  const [weeklyLimit, setWeeklyLimit] = useState(500);
  const [realityCheckMinutes, setRealityCheckMinutes] = useState(60);
  const [limitsSaved, setLimitsSaved] = useState(false);

  // KYC state
  const [kycDocType, setKycDocType] = useState('Passport');
  const [kycSubmitted, setKycSubmitted] = useState(false);

  // Filter user tickets
  const filteredTickets = tickets.filter(t => {
    if (ticketFilter === 'active') return t.status === 'active' || t.status === 'pending_result';
    if (ticketFilter === 'winning') return t.status === 'won';
    if (ticketFilter === 'past') return t.status === 'won' || t.status === 'lost' || t.status === 'expired';
    return true;
  });

  const handleQuickDeposit = (amt: number) => {
    depositToWallet(amt, 'credit_card');
    setDepositSuccess(true);
    setTimeout(() => setDepositSuccess(false), 3000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.kycStatus !== 'approved') {
      setWithdrawMessage('Withdrawals require KYC Identity Verification under international AML regulations. Please complete verification in the KYC tab.');
      return;
    }
    const success = withdrawFromWallet(withdrawAmount, 'Bank Wire Transfer');
    if (success) {
      setWithdrawMessage(`Withdrawal of ${formatMoney(withdrawAmount)} requested successfully.`);
    } else {
      setWithdrawMessage('Insufficient balance for withdrawal.');
    }
  };

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    setLimitsSaved(true);
    setTimeout(() => setLimitsSaved(false), 3000);
  };

  const totalWon = tickets.reduce((acc, t) => acc + (t.confirmedWinnings || t.potentialWinnings || 0), 0);
  const activeCount = tickets.filter(t => t.status === 'active' || t.status === 'pending_result').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Welcome Banner */}
      <div className="bg-[#071329] text-white rounded-xl p-6 border border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded">
              Verified Player Profile
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              KYC {user?.kycStatus.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Account Portal · {user?.name || 'Player'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage your official physical ticket scans, monitor upcoming draws, and access wallet settlements.
          </p>
        </div>

        {/* Quick Balance Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-5 self-stretch sm:self-auto">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Available Balance</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
              {formatMoney(user?.wallet.available || 0)}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('wallet')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded text-xs transition-colors shrink-0 shadow-xs"
          >
            Deposit / Payout
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-white rounded-lg p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Ticket className="w-3.5 h-3.5 text-slate-700" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Orders</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Winnings</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatMoney(totalWon)}</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Commission Free</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">100%</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Layers className="w-3.5 h-3.5 text-slate-700" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Subscriptions</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">1 Active</p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3 mb-6 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-3.5 py-2 rounded-md transition-colors ${
            activeTab === 'tickets' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Tickets & Scans ({tickets.length})
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-3.5 py-2 rounded-md transition-colors ${
            activeTab === 'wallet' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Wallet & Transactions
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'simulator' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Draw Simulator (Demo)</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-3.5 py-2 rounded-md transition-colors ${
            activeTab === 'kyc' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          KYC & Verification
        </button>

        <button
          onClick={() => setActiveTab('responsible')}
          className={`px-3.5 py-2 rounded-md transition-colors ${
            activeTab === 'responsible' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Responsible Gaming
        </button>
      </div>

      {/* TAB 1: MY TICKETS & SCANS */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {/* Subfilter */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-1">Filter:</span>
              {(['all', 'active', 'winning', 'past'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTicketFilter(f)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                    ticketFilter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              {filteredTickets.length} order(s) listed
            </p>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-10 text-center space-y-2">
              <Ticket className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No tickets found</h3>
              <p className="text-xs text-slate-500">
                You do not have any orders matching this filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredTickets.map(ticket => {
                const lottery = lotteries.find(l => l.id === ticket.lotteryId);
                const isWinner = ticket.status === 'won';
                const prizeAmount = ticket.confirmedWinnings || ticket.potentialWinnings || 0;

                return (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-lg border p-5 shadow-xs transition-colors ${
                      isWinner ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md ${lottery?.logoBg || 'bg-slate-900'} flex items-center justify-center font-bold ${lottery?.logoColor || 'text-white'} text-xs`}>
                          {lottery?.name.substring(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{lottery?.name || 'Lottery'}</h3>
                            <span className="text-xs">{lottery?.flag}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Draw Date: <strong>{ticket.drawDate}</strong> · Order #{ticket.orderId}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges & Prize */}
                      <div className="flex items-center gap-2.5">
                        {isWinner && prizeAmount > 0 && (
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-amber-600 block">Prize</span>
                            <span className="text-base font-extrabold text-amber-500">
                              {formatMoney(prizeAmount)}
                            </span>
                          </div>
                        )}

                        <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                          ticket.status === 'won'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : ticket.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ticket.status === 'lost'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ticket.status === 'won' ? 'WINNER' : ticket.status === 'active' ? 'Ticket Scanned & Stored' : ticket.status.toUpperCase()}
                        </span>

                        {/* Scanned Proof CTA */}
                        {ticket.scannedImageUrl && (
                          <button
                            onClick={() => setSelectedTicketForProof(ticket)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Scan Proof</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Ticket Lines Details */}
                    <div className="pt-3 space-y-2">
                      <p className="text-xs font-semibold text-slate-700">
                        Playslip Lines ({ticket.lines.length}):
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {ticket.lines.map((line, lIdx) => (
                          <div
                            key={line.id || lIdx}
                            className="p-2.5 rounded-md bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-slate-500 w-12 text-[11px]">Line {lIdx + 1}:</span>
                            <div className="flex items-center gap-1">
                              {line.mainNumbers.map(num => (
                                <span
                                  key={num}
                                  className="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-900 font-bold flex items-center justify-center text-xs shadow-2xs"
                                >
                                  {num}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-1">
                              {line.bonusNumbers.map(b => (
                                <span
                                  key={b}
                                  className="lottery-ball-bonus w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs text-white"
                                  title="Bonus / Powerball"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WALLET & TRANSACTIONS */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Balances & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Balance Card */}
            <div className="bg-white rounded-lg border border-slate-200/90 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Account Settlement Balance
              </h3>
              <div className="p-5 bg-[#07142d] text-white rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Available Funds</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
                    {formatMoney(user?.wallet.available || 0)}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p className="font-semibold text-slate-300">Commission-Free Guarantee</p>
                  <p className="text-emerald-400 text-[11px]">Instant Concierge Settlement</p>
                </div>
              </div>

              {/* Deposit Quick Amounts */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Quick Deposit Funds
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 50, 100, 250].map(amt => (
                    <button
                      key={amt}
                      onClick={() => handleQuickDeposit(amt)}
                      className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-800 transition-colors"
                    >
                      +{formatMoney(amt)}
                    </button>
                  ))}
                </div>
                {depositSuccess && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Funds credited to balance successfully.
                  </p>
                )}
              </div>

              {/* Withdraw Section */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Request Payout / Withdrawal
                </label>
                <form onSubmit={handleWithdrawSubmit} className="flex gap-2">
                  <input
                    type="number"
                    min="10"
                    max={user?.wallet.available || 0}
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    placeholder="Amount to withdraw"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded transition-colors shrink-0 shadow-xs"
                  >
                    Withdraw
                  </button>
                </form>
                {withdrawMessage && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                    {withdrawMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Transaction History Log (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200/90 p-5 shadow-xs space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900">
              Transaction History
            </h3>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {transactions.map(tx => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded flex items-center justify-center ${
                      tx.type === 'deposit' || tx.type === 'win_payout'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'win_payout' ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{tx.description}</p>
                      <p className="text-[11px] text-slate-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tx.type === 'deposit' || tx.type === 'win_payout'
                        ? 'text-emerald-600'
                        : 'text-slate-900'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'win_payout' ? '+' : ''}
                      {formatMoney(tx.amount)}
                    </p>
                    <span className="text-[10px] text-slate-400 capitalize">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DRAW SIMULATOR (DEMO TESTING ENGINE) */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-lg border border-slate-200/90 p-6 shadow-xs space-y-5 max-w-3xl">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Concierge Operations Engine
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Simulate Official Lottery Draw
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Trigger a live draw simulation on demand. This automatically generates winning numbers, scans all your active ticket orders, verifies ball matches, and immediately credits prizes to your wallet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {lotteries.slice(0, 3).map(lot => (
              <div key={lot.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lot.flag}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{lot.name}</p>
                    <p className="text-xs text-slate-600 font-semibold">{lot.jackpotFormatted}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const res = triggerSimulatedDraw(lot.id);
                    alert(`Simulated draw executed for ${lot.name}! Winning numbers: ${res.winningMain.join(', ')} + Bonus: ${res.winningBonus.join(', ')}. Check 'My Tickets' to see highlighted matches!`);
                    setActiveTab('tickets');
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-1.5 rounded text-xs transition-colors shadow-xs"
                >
                  Simulate Draw
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: KYC & IDENTITY */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-lg border border-slate-200/90 p-6 shadow-xs max-w-xl space-y-5">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Regulatory Compliance
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              KYC & Identity Verification
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              In accordance with international Anti-Money Laundering (AML) standards, prize payouts require verified identity documentation.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Current KYC Tier: Verified Level 1</p>
                <p className="text-[11px] text-emerald-700">Eligible for payouts up to $50,000 without notarization.</p>
              </div>
            </div>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              ACTIVE
            </span>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              setKycSubmitted(true);
            }}
            className="space-y-3.5 pt-1"
          >
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Document Type
              </label>
              <select
                value={kycDocType}
                onChange={e => setKycDocType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              >
                <option value="Passport">International Passport</option>
                <option value="Driver">Driver's License</option>
                <option value="NationalID">National Identity Card</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Upload Scanned Copy / Photo
              </label>
              <div className="border border-dashed border-slate-300 hover:border-slate-400 p-5 rounded-lg text-center cursor-pointer bg-slate-50 transition-colors">
                <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-700 font-medium">Click to select document or drag & drop</p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, or PDF up to 10MB</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded text-xs transition-colors"
            >
              Submit Verification Document
            </button>

            {kycSubmitted && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Document securely uploaded and stored in compliance vault.
              </p>
            )}
          </form>
        </div>
      )}

      {/* TAB 5: RESPONSIBLE GAMING */}
      {activeTab === 'responsible' && (
        <div className="bg-white rounded-lg border border-slate-200/90 p-6 shadow-xs max-w-xl space-y-5">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Player Protection
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Responsible Gaming Limits
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure deposit, spend, and session limits to maintain healthy and controlled participation.
            </p>
          </div>

          <form onSubmit={handleSaveLimits} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Daily Deposit Limit ($)
              </label>
              <input
                type="number"
                value={dailyLimit}
                onChange={e => setDailyLimit(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Weekly Spend Limit ($)
              </label>
              <input
                type="number"
                value={weeklyLimit}
                onChange={e => setWeeklyLimit(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Reality Check Interval (Minutes)
              </label>
              <input
                type="number"
                value={realityCheckMinutes}
                onChange={e => setRealityCheckMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1.5">
              <p className="font-bold text-slate-900">Self-Exclusion Options</p>
              <p className="text-slate-600 text-[11px]">
                Temporarily suspend concierge purchasing on this account:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['24 Hours', '7 Days', '30 Days', '6 Months'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => alert(`Demo Mode: Self-exclusion applied for ${p}. Ticket orders temporarily locked.`)}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded text-xs transition-colors shadow-xs"
            >
              Save Protection Parameters
            </button>

            {limitsSaved && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Responsible gaming parameters updated and enforced.
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
