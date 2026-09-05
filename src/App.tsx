import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { ScannedTicketModal } from './components/common/ScannedTicketModal';
import { AuthModal } from './components/common/AuthModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { CartDrawer } from './components/common/CartDrawer';
import { LiveChatDrawer } from './components/common/LiveChatDrawer';
import { JackpotAlertModal } from './components/common/JackpotAlertModal';

// Views
import { HomePage } from './components/home/HomePage';
import { LotteriesPage } from './components/lotteries/LotteriesPage';
import { LotteryDetailPage } from './components/lotteries/LotteryDetailPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmationPage } from './components/checkout/OrderConfirmationPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ResultsPage } from './components/results/ResultsPage';
import { JackpotCenterPage } from './components/jackpots/JackpotCenterPage';
import { PromotionsPage } from './components/promotions/PromotionsPage';
import { WinnersPage } from './components/winners/WinnersPage';
import { HowItWorksPage } from './components/info/HowItWorksPage';
import { ResponsibleGamingPage } from './components/info/ResponsibleGamingPage';
import { HelpCenterPage } from './components/info/HelpCenterPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartItem } from './types';

function MainAppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedLotteryId, setSelectedLotteryId] = useState<string>('powerball');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('ORD-882910');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const { addToCart } = useApp();

  const handleSelectLottery = (lotteryId: string) => {
    setSelectedLotteryId(lotteryId);
    setCurrentView('lottery-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (item: CartItem) => {
    addToCart(item);
    setIsCartDrawerOpen(true);
  };

  const handleProceedToCheckout = (item: CartItem) => {
    addToCart(item);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderId: string) => {
    setConfirmedOrderId(orderId);
    setCurrentView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-950 pb-16 lg:pb-0">
      {/* Top Main Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={handleNavigate}
        onSelectLottery={handleSelectLottery}
        openCartDrawer={() => setIsCartDrawerOpen(true)}
      />

      {/* Main Routed View Container */}
      <main className="flex-1 w-full">
        {currentView === 'home' && (
          <HomePage
            onSelectLottery={handleSelectLottery}
            setCurrentView={handleNavigate}
          />
        )}

        {currentView === 'lotteries' && (
          <LotteriesPage
            onSelectLottery={handleSelectLottery}
          />
        )}

        {currentView === 'lottery-detail' && (
          <LotteryDetailPage
            lotteryId={selectedLotteryId}
            onBack={() => handleNavigate('lotteries')}
            onAddToCart={handleAddToCart}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onProceedToCheckout={() => handleNavigate('checkout')}
            onContinueShopping={() => handleNavigate('lotteries')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => handleNavigate('cart')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'order-confirmation' && (
          <OrderConfirmationPage
            orderId={confirmedOrderId}
            onViewTickets={() => handleNavigate('dashboard-tickets')}
            onGoHome={() => handleNavigate('home')}
          />
        )}

        {(currentView === 'dashboard' || currentView === 'dashboard-tickets' || currentView === 'dashboard-alerts') && (
          <DashboardPage
            initialTab={currentView === 'dashboard-tickets' ? 'tickets' : currentView === 'dashboard-alerts' ? 'alerts' : 'overview'}
            onSelectLottery={handleSelectLottery}
          />
        )}

        {currentView === 'results' && (
          <ResultsPage
            onSelectLottery={handleSelectLottery}
          />
        )}

        {currentView === 'jackpots' && (
          <JackpotCenterPage
            onSelectLottery={handleSelectLottery}
          />
        )}

        {currentView === 'promotions' && (
          <PromotionsPage
            onSelectLottery={handleSelectLottery}
          />
        )}

        {currentView === 'winners' && (
          <WinnersPage
            onSelectLottery={handleSelectLottery}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksPage
            onSelectLottery={handleSelectLottery}
          />
        )}

        {currentView === 'responsible-gaming' && (
          <ResponsibleGamingPage />
        )}

        {currentView === 'help' && (
          <HelpCenterPage />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Primary Global Footer */}
      <Footer setCurrentView={handleNavigate} />

      {/* Mobile Bottom Sticky Navigation */}
      <MobileNav
        currentView={currentView}
        setCurrentView={handleNavigate}
        openCartDrawer={() => setIsCartDrawerOpen(true)}
      />

      {/* Slide-out & Modal Components */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onNavigateToCart={() => {
          setIsCartDrawerOpen(false);
          handleNavigate('cart');
        }}
        onNavigateToCheckout={() => {
          setIsCartDrawerOpen(false);
          handleNavigate('checkout');
        }}
      />

      <ScannedTicketModal />
      <AuthModal />
      <GlobalSearchModal
        onSelectLottery={handleSelectLottery}
        onNavigate={handleNavigate}
      />
      <LiveChatDrawer />
      <JackpotAlertModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
