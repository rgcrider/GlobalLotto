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
      <div className="bg-gradient-to-r from-[#06132a] via-[#091e45] to-[#0c2b64] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              VIP Player Profile
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              KYC {user?.kycStatus.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Welcome back, {user?.name || 'Player'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage your verified physical ticket scans, monitor upcoming draws, and access wallet payouts.
          </p>
        </div>

        {/* Quick Balance Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-6 self-stretch sm:self-auto">
          <div>
            <p className="text-xs text-slate-300 font-medium">Wallet Balance</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
              {formatMoney(user?.wallet.available || 0)}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('wallet')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shrink-0"
          >
            Deposit / Wallet
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Ticket className="w-4 h-4" />
            <span className="text-xs font-bold uppercase text-slate-500">Active Tickets</span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-display">{activeCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase text-slate-500">Total Winnings</span>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-display">{formatMoney(totalWon)}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase text-slate-500">Commission Free</span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-display">100%</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase text-slate-500">Subscriptions</span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-display">1 Active</p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'tickets' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Tickets & Scans ({tickets.length})
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'wallet' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Wallet & Transactions
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'simulator' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Draw Simulator (Demo)</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'kyc' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          KYC & Identity
        </button>

        <button
          onClick={() => setActiveTab('responsible')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'responsible' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Responsible Gaming
        </button>
      </div>

      {/* TAB 1: MY TICKETS & SCANS */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Subfilter */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter:</span>
              {(['all', 'active', 'winning', 'past'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTicketFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    ticketFilter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              Showing {filteredTickets.length} ticket order(s)
            </p>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Ticket className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No tickets found</h3>
              <p className="text-xs text-slate-500">
                You do not have any tickets matching this filter category.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map(ticket => {
                const lottery = lotteries.find(l => l.id === ticket.lotteryId);
                const isWinner = ticket.status === 'won';
                const prizeAmount = ticket.confirmedWinnings || ticket.potentialWinnings || 0;

                return (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                      isWinner ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${lottery?.logoBg || 'bg-blue-600'} flex items-center justify-center font-black ${lottery?.logoColor || 'text-white'} text-xs font-display`}>
                          {lottery?.name.substring(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{lottery?.name || 'Lottery'}</h3>
                            <span className="text-xs">{lottery?.flag}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Draw Date: <strong>{ticket.drawDate}</strong> • Order ID: #{ticket.orderId}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges & Prize */}
                      <div className="flex items-center gap-3">
                        {isWinner && prizeAmount > 0 && (
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-amber-600 block">Winning Prize</span>
                            <span className="text-lg font-black text-amber-500 font-display">
                              {formatMoney(prizeAmount)}
                            </span>
                          </div>
                        )}

                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          ticket.status === 'won'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : ticket.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ticket.status === 'lost'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ticket.status === 'won' ? 'WINNER!' : ticket.status === 'active' ? 'Ticket Scanned & Stored' : ticket.status.toUpperCase()}
                        </span>

                        {/* Scanned Proof CTA */}
                        {ticket.scannedImageUrl && (
                          <button
                            onClick={() => setSelectedTicketForProof(ticket)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Scan Proof</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Ticket Lines Details */}
                    <div className="pt-4 space-y-2">
                      <p className="text-xs font-bold text-slate-700">
                        Purchased Lines ({ticket.lines.length}):
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {ticket.lines.map((line, lIdx) => (
                          <div
                            key={line.id || lIdx}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <span className="font-bold text-slate-500 w-8">Line {lIdx + 1}:</span>
                            <div className="flex items-center gap-1.5 font-mono">
                              {line.mainNumbers.map(num => (
                                <span
                                  key={num}
                                  className="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-900 font-bold flex items-center justify-center shadow-2xs"
                                >
                                  {String(num).padStart(2, '0')}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 font-mono">
                              {line.bonusNumbers.map(b => (
                                <span
                                  key={b}
                                  className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shadow-2xs"
                                  title="Bonus / Powerball"
                                >
                                  {String(b).padStart(2, '0')}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Balances & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Balance Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Account Wallet Balance
              </h3>
              <div className="p-6 bg-[#07142d] text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Available Funds</p>
                  <p className="text-3xl font-black text-amber-400 font-display">
                    {formatMoney(user?.wallet.available || 0)}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>100% Commission-Free</p>
                  <p className="text-emerald-400 font-semibold">Instant Concierge Settlement</p>
                </div>
              </div>

              {/* Deposit Quick Amounts */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Quick Deposit Funds
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 50, 100, 250].map(amt => (
                    <button
                      key={amt}
                      onClick={() => handleQuickDeposit(amt)}
                      className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
                    >
                      +{formatMoney(amt)}
                    </button>
                  ))}
                </div>
                {depositSuccess && (
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Funds successfully added to wallet!
                  </p>
                )}
              </div>

              {/* Withdraw Section */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Request Payout / Withdrawal
                </label>
                <form onSubmit={handleWithdrawSubmit} className="flex gap-2">
                  <input
                    type="number"
                    min="10"
                    max={user?.wallet.available || 0}
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="Amount to withdraw"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
                  >
                    Withdraw
                  </button>
                </form>
                {withdrawMessage && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {withdrawMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Transaction History Log (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Transaction History
            </h3>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {transactions.map(tx => (
                <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      tx.type === 'deposit' || tx.type === 'win_payout'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'win_payout' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{tx.description}</p>
                      <p className="text-[11px] text-slate-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${
                      tx.type === 'deposit' || tx.type === 'win_payout'
                        ? 'text-emerald-600 font-display'
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Interactive Test Suite
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
              Simulate Official Lottery Draw
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Trigger a live draw simulation on demand! This automatically generates winning numbers, scans all your active tickets, highlights ball matches, and immediately credits prizes to your wallet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {lotteries.slice(0, 3).map(lot => (
              <div key={lot.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lot.flag}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{lot.name}</p>
                    <p className="text-xs text-amber-600 font-bold">{lot.jackpotFormatted}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const res = triggerSimulatedDraw(lot.id);
                    alert(`Simulated draw executed for ${lot.name}! Winning numbers: ${res.winningMain.join(', ')} + Bonus: ${res.winningBonus.join(', ')}. Check 'My Tickets' to see highlighted matches!`);
                    setActiveTab('tickets');
                  }}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2 rounded-lg text-xs transition-colors shadow-xs"
                >
                  Simulate Draw Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: KYC & IDENTITY */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Regulatory Compliance
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
              KYC & Player Verification
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              In accordance with international Anti-Money Laundering (AML) and jurisdictional gaming laws, withdrawals require verified proof of legal identity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Current KYC Tier: Verified Level 1</p>
                <p className="text-[11px] text-emerald-700">Eligible for payouts up to $50,000 without additional notarization.</p>
              </div>
            </div>
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              ACTIVE
            </span>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              setKycSubmitted(true);
            }}
            className="space-y-4 pt-2"
          >
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Identification Document Type
              </label>
              <select
                value={kycDocType}
                onChange={e => setKycDocType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
              >
                <option value="Passport">International Passport</option>
                <option value="Driver">Driver's License</option>
                <option value="NationalID">National Identity Card</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Upload Scanned Copy / Photo
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 p-6 rounded-xl text-center cursor-pointer bg-slate-50 transition-colors">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">Click or drag document to upload</p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, or PDF up to 10MB</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              Submit Verification Document
            </button>

            {kycSubmitted && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Document uploaded and securely stored in compliance vault.
              </p>
            )}
          </form>
        </div>
      )}

      {/* TAB 5: RESPONSIBLE GAMING */}
      {activeTab === 'responsible' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Player Protection
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
              Responsible Gaming Limits
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Set automated deposit, spend, and session controls to keep your lottery participation safe and fun.
            </p>
          </div>

          <form onSubmit={handleSaveLimits} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Daily Deposit Ceiling ($)
              </label>
              <input
                type="number"
                value={dailyLimit}
                onChange={e => setDailyLimit(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Weekly Spend Ceiling ($)
              </label>
              <input
                type="number"
                value={weeklyLimit}
                onChange={e => setWeeklyLimit(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Reality Check Timer (Minutes)
              </label>
              <input
                type="number"
                value={realityCheckMinutes}
                onChange={e => setRealityCheckMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <p className="font-bold mb-1">Self-Exclusion Options</p>
              <p className="text-slate-600 mb-2">
                Temporarily or permanently disable lottery purchases on this account.
              </p>
              <div className="flex flex-wrap gap-2">
                {['24 Hours', '7 Days', '30 Days', '6 Months'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => alert(`Demo Mode: Self-exclusion applied for ${p}. Purchases temporarily locked.`)}
                    className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
                  >
                    Lock {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Save Limits & Protection Settings
            </button>

            {limitsSaved && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Responsible gaming parameters updated and enforced.
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
