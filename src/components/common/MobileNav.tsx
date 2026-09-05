import React from 'react';
import { Home, Layers, CheckSquare, Ticket, User, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileNavProps {
  currentView: string;
  setCurrentView: (v: string) => void;
  openCartDrawer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  currentView, 
  setCurrentView,
  openCartDrawer
}) => {
  const { cart, user, openAuthModal } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07132b]/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'home' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentView('lotteries')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'lotteries' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span>Lotteries</span>
        </button>

        <button
          onClick={openCartDrawer}
          className="relative flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <button
          onClick={() => setCurrentView('results')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'results' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span>Results</span>
        </button>

        <button
          onClick={() => {
            if (user) {
              setCurrentView('dashboard-tickets');
            } else {
              openAuthModal('signin');
            }
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentView.startsWith('dashboard-tickets') ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Ticket className="w-5 h-5 mb-0.5" />
          <span>Tickets</span>
        </button>

        <button
          onClick={() => {
            if (user) {
              setCurrentView('dashboard');
            } else {
              openAuthModal('signin');
            }
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentView.startsWith('dashboard') ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Account</span>
        </button>
      </div>
    </div>
  );
};
