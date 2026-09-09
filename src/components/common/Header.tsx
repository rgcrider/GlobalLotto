import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ShoppingCart, 
  Bell, 
  User, 
  ChevronDown, 
  ShieldCheck, 
  Wallet, 
  LogOut, 
  LayoutDashboard, 
  Ticket, 
  Trophy, 
  Award, 
  Settings, 
  FileCheck,
  CheckCircle2,
  MapPin,
  Smartphone,
  HeartHandshake
} from 'lucide-react';
import { useApp, CurrencyCode } from '../../context/AppContext';
import { IllinoisLotteryLogo } from './IllinoisLotteryLogo';

interface HeaderProps {
  currentView: string;
  setCurrentView: (v: string) => void;
  setSelectedLotteryId: (id: string) => void;
  openCartDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  setCurrentView, 
  setSelectedLotteryId: _setSelectedLotteryId,
  openCartDrawer 
}) => {
  const { 
    user, 
    cart, 
    currency, 
    setCurrency, 
    formatMoney, 
    currentCountry, 
    setCurrentCountry, 
    openAuthModal, 
    logout,
    setIsSearchOpen,
    demoMode,
    setDemoMode,
    markNotificationRead
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadNotifs = user?.notifications.filter(n => !n.read) || [];

  const navLinks = [
    { id: 'lotteries', label: 'Buy Online' },
    { id: 'results', label: 'Winning Numbers' },
    { id: 'jackpots', label: 'Games' },
    { id: 'how-it-works', label: 'How To Play' },
    { id: 'winners', label: 'When You Win' },
    { id: 'promotions', label: 'Where The Money Goes' },
    { id: 'responsible-gaming', label: 'Responsible Play' },
  ];

  const countries = ['United States (IL)', 'Canada', 'United Kingdom', 'Germany', 'Australia', 'Japan', 'Mexico', 'France'];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07132b] text-white border-b border-slate-800 shadow-md">
      {/* Top Utility Ribbon */}
      <div className="bg-[#040c1d] border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
              18+ Only
            </span>
            <span className="text-slate-300 text-xs hidden md:inline">
              When you play, you support Illinois education and specialty causes.
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <button 
              onClick={() => setCurrentView('responsible-gaming')}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <HeartHandshake className="w-3 h-3 text-amber-400" />
              <span>1-800-GAMBLER</span>
            </button>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setCurrentView('help')}
              className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Find Retailer</span>
            </button>

            <button
              onClick={() => setCurrentView('help')}
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <Smartphone className="w-3 h-3 text-slate-400" />
              <span>Download App</span>
            </button>

            <span className="hidden sm:inline text-slate-700">|</span>

            {/* Demo Mode Toggle */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <button 
                onClick={() => setDemoMode(!demoMode)}
                className="text-[11px] font-semibold text-amber-300 hover:text-amber-200"
                title="Simulated testing sandbox with realistic lottery courier operations"
              >
                Simulation {demoMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Jurisdiction Selector */}
            <div className="relative">
              <button 
                onClick={() => setCountryMenuOpen(!countryMenuOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Change country to test jurisdictional compliance"
              >
                <Globe className="w-3 h-3 text-slate-400" />
                <span>{currentCountry}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {countryMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                    Jurisdiction Testing
                  </div>
                  {countries.map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrentCountry(c);
                        setCountryMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                        c === currentCountry ? 'text-amber-400 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <span>{c}</span>
                      {c === 'Iran' && <span className="text-[10px] bg-red-900/50 text-red-300 px-1 rounded">Restricted</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button 
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1 hover:text-white font-medium transition-colors"
                title="Select Currency"
              >
                <span className="font-semibold">{currency === 'USD' ? 'USD ($)' : currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {currencyMenuOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
                  {[
                    { code: 'USD' as CurrencyCode, label: 'USD ($)' },
                    { code: 'EUR' as CurrencyCode, label: 'EUR (€)' },
                    { code: 'GBP' as CurrencyCode, label: 'GBP (£)' },
                    { code: 'AUD' as CurrencyCode, label: 'AUD (A$)' },
                    { code: 'CAD' as CurrencyCode, label: 'CAD (C$)' }
                  ].map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                        code === currency ? 'text-amber-400 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <span>{label}</span>
                      {code === currency && <span className="text-amber-400 text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button 
          onClick={() => setCurrentView('home')}
          className="flex items-center text-left group focus:outline-none transition-transform hover:opacity-95"
          title="Illinois Lottery Home"
        >
          <IllinoisLotteryLogo variant="header" size="md" />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                  isActive 
                    ? 'text-amber-400 bg-slate-800/80' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Search lotteries, results, and help"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Trigger */}
          <button 
            onClick={openCartDrawer}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cart.length}
              </span>
            )}
          </button>

          {/* User Logged In State */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Wallet Pill */}
              <button 
                onClick={() => setCurrentView('dashboard-wallet')}
                className="hidden sm:flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200 transition-colors"
                title="Wallet Balance & Top Up"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formatMoney(user.wallet.available)}</span>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                  Deposit
                </span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-[#07132b]"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-white">Notifications</span>
                      <span className="text-[11px] text-slate-400">{unreadNotifs.length} new</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-800">
                      {user.notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-400">No notifications</div>
                      ) : (
                        user.notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.linkTab) setCurrentView(`dashboard-${n.linkTab}`);
                              setNotificationsOpen(false);
                            }}
                            className={`p-3 hover:bg-slate-800/80 cursor-pointer transition-colors ${!n.read ? 'bg-amber-500/5' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className={`font-semibold ${!n.read ? 'text-amber-400' : 'text-slate-200'}`}>
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-500 shrink-0">{n.date}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-3 pt-2 border-t border-slate-800 text-center">
                      <button 
                        onClick={() => {
                          setCurrentView('dashboard-notifications');
                          setNotificationsOpen(false);
                        }}
                        className="text-amber-400 hover:underline text-[11px] font-medium"
                      >
                        View All in Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 bg-slate-800/80 hover:bg-slate-700 rounded-full border border-slate-700 transition-colors"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/50" 
                  />
                  <span className="hidden md:inline text-xs font-semibold text-white max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-emerald-400 text-[10px] font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>KYC {user.kycStatus === 'approved' ? 'Verified' : 'Pending'}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { setCurrentView('dashboard'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Account Dashboard</span>
                      </button>
                      <button
                        onClick={() => { setCurrentView('dashboard-tickets'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                      >
                        <Ticket className="w-4 h-4 text-slate-400" />
                        <span>My Tickets</span>
                      </button>
                      <button
                        onClick={() => { setCurrentView('dashboard-winnings'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                      >
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>Winnings & Payouts</span>
                      </button>
                      <button
                        onClick={() => { setCurrentView('dashboard-wallet'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                      >
                        <Wallet className="w-4 h-4 text-emerald-400" />
                        <span>Wallet & Transactions</span>
                      </button>
                      <button
                        onClick={() => { setCurrentView('dashboard-kyc'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                      >
                        <FileCheck className="w-4 h-4 text-indigo-400" />
                        <span>Identity Verification (KYC)</span>
                      </button>
                      <button
                        onClick={() => { setCurrentView('dashboard-responsible-gaming'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>Responsible Gaming</span>
                      </button>
                      <button
                        onClick={() => { setCurrentView('admin'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-amber-300 hover:bg-slate-800 flex items-center gap-2 font-medium"
                      >
                        <Settings className="w-4 h-4 text-amber-400" />
                        <span>Admin Portal & Simulator</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openAuthModal('signin')}
                className="h-9 px-3.5 text-xs font-semibold text-slate-200 hover:text-white rounded-md transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => openAuthModal('signup')}
                className="h-9 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs font-bold rounded-md shadow-xs transition-colors"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
