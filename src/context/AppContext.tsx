import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Lottery, 
  CartItem, 
  Order, 
  PurchasedTicket, 
  UserProfile, 
  WalletTransaction, 
  FavoriteCombination, 
  ResponsibleGamingSettings,
  JackpotAlert
} from '../types';
import { INITIAL_LOTTERIES } from '../data/lotteries';
import { INITIAL_USER, INITIAL_TICKETS, INITIAL_TRANSACTIONS } from '../data/mockUserData';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD';

const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbol: string }> = {
  USD: { rate: 1.0, symbol: '$' },
  EUR: { rate: 0.92, symbol: '€' },
  GBP: { rate: 0.79, symbol: '£' },
  AUD: { rate: 1.54, symbol: 'A$' },
  CAD: { rate: 1.38, symbol: 'C$' }
};

interface AppContextType {
  user: UserProfile | null;
  lotteries: Lottery[];
  cart: CartItem[];
  tickets: PurchasedTicket[];
  orders: Order[];
  transactions: WalletTransaction[];
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatMoney: (amountInUSD: number) => string;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  currentCountry: string;
  setCurrentCountry: (c: string) => void;
  isCountryBlocked: boolean;
  // Auth
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string) => void;
  logout: () => void;
  // Cart & Orders
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  checkout: (paymentMethod: string) => Promise<Order>;
  // Wallet
  depositToWallet: (amount: number, method: string) => boolean;
  withdrawFromWallet: (amount: number, accountInfo: string) => boolean;
  // Account actions
  updateKyc: (idDoc: string, addressDoc: string) => void;
  updateResponsibleGaming: (settings: Partial<ResponsibleGamingSettings>) => void;
  saveFavoriteNumber: (name: string, lotteryId: string, main: number[], bonus: number[]) => void;
  deleteFavoriteNumber: (id: string) => void;
  manageSubscription: (id: string, action: 'pause' | 'resume' | 'cancel') => void;
  // Modals & UI
  selectedTicketForProof: PurchasedTicket | null;
  setSelectedTicketForProof: (t: PurchasedTicket | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  liveChatOpen: boolean;
  setLiveChatOpen: (val: boolean) => void;
  markNotificationRead: (id: string) => void;
  // Jackpot Price Alerts
  jackpotAlerts: JackpotAlert[];
  setJackpotAlert: (lotteryId: string, thresholdAmount: number, options?: { notifyEmail?: boolean; notifyInApp?: boolean }) => void;
  removeJackpotAlert: (alertId: string) => void;
  toggleJackpotAlert: (alertId: string) => void;
  testTriggerJackpotAlert: (alertId: string) => void;
  isJackpotAlertSet: (lotteryId: string) => JackpotAlert | undefined;
  isAlertModalOpen: boolean;
  alertModalLotteryId: string | null;
  openJackpotAlertModal: (lotteryId?: string) => void;
  closeJackpotAlertModal: () => void;
  // Admin simulation
  adminUpdateLottery: (lotteryId: string, updates: Partial<Lottery>) => void;
  triggerSimulatedDraw: (lotteryId: string, manualMain?: number[], manualBonus?: number[]) => {
    winningMain: number[];
    winningBonus: number[];
    matchesCount: number;
    totalWinnings: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('globallotto_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [lotteries, setLotteries] = useState<Lottery[]>(() => {
    const saved = localStorage.getItem('globallotto_lotteries');
    return saved ? JSON.parse(saved) : INITIAL_LOTTERIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('globallotto_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [tickets, setTickets] = useState<PurchasedTicket[]>(() => {
    const saved = localStorage.getItem('globallotto_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('globallotto_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('globallotto_tx');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [currentCountry, setCurrentCountry] = useState<string>('Canada');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [selectedTicketForProof, setSelectedTicketForProof] = useState<PurchasedTicket | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [liveChatOpen, setLiveChatOpen] = useState<boolean>(false);

  // Jackpot Price Alerts State
  const [jackpotAlerts, setJackpotAlerts] = useState<JackpotAlert[]>(() => {
    const saved = localStorage.getItem('globallotto_jackpot_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved jackpot alerts', e);
      }
    }
    return user?.jackpotAlerts || INITIAL_USER.jackpotAlerts || [];
  });
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertModalLotteryId, setAlertModalLotteryId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('globallotto_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('globallotto_lotteries', JSON.stringify(lotteries));
  }, [lotteries]);

  useEffect(() => {
    localStorage.setItem('globallotto_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('globallotto_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('globallotto_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('globallotto_tx', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('globallotto_jackpot_alerts', JSON.stringify(jackpotAlerts));
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, jackpotAlerts };
    });
  }, [jackpotAlerts]);

  const isCountryBlocked = ['Iran', 'North Korea', 'Syria', 'Sudan'].includes(currentCountry);

  const formatMoney = (amountInUSD: number): string => {
    const rateInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = amountInUSD * rateInfo.rate;
    return `${rateInfo.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string) => {
    const loggedUser: UserProfile = {
      ...INITIAL_USER,
      email: email || INITIAL_USER.email,
      name: email ? email.split('@')[0] : INITIAL_USER.name,
    };
    setUser(loggedUser);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.total, 0);

  const checkout = async (paymentMethod: string): Promise<Order> => {
    if (!user) throw new Error('Must be logged in to checkout');
    if (cart.length === 0) throw new Error('Cart is empty');

    const total = cartTotal;

    // Check responsible gaming limits
    if (user.responsibleGaming.maxTicketSpend && total > user.responsibleGaming.maxTicketSpend) {
      throw new Error(`Order of $${total.toFixed(2)} exceeds your responsible gaming single purchase limit of $${user.responsibleGaming.maxTicketSpend.toFixed(2)}.`);
    }

    // Process wallet payment deduction if chosen
    if (paymentMethod === 'wallet') {
      if (user.wallet.available < total) {
        throw new Error('Insufficient wallet balance. Please top up your wallet or choose another payment method.');
      }
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          wallet: {
            ...prev.wallet,
            available: prev.wallet.available - total,
            withdrawable: Math.max(0, prev.wallet.withdrawable - total)
          }
        };
      });
    }

    const newOrderId = `ord_${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: newOrderId,
      userId: user.id,
      date: now,
      items: [...cart],
      totalAmount: total,
      paymentMethod,
      status: 'confirmed',
      ticketProcessingStatus: 'purchased',
      scannedAt: 'Pending official scan (uploaded within 4 hours)',
      complianceConfirmed: true
    };

    // Generate purchased tickets for each line in cart
    const newTickets: PurchasedTicket[] = cart.flatMap(item => {
      const lottery = lotteries.find(l => l.id === item.lotteryId);
      return {
        id: `tkt_${Math.floor(100000 + Math.random() * 900000)}`,
        orderId: newOrderId,
        lotteryId: item.lotteryId,
        drawDate: item.drawDate || lottery?.nextDrawDate || 'Upcoming Draw',
        purchaseDate: now,
        lines: item.lines,
        status: 'active' as const,
        scannedImageUrl: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=600&auto=format&fit=crop&q=80'
      };
    });

    const newTransaction: WalletTransaction = {
      id: `tx_${Math.floor(10000 + Math.random() * 90000)}`,
      date: now,
      type: 'ticket_purchase',
      amount: -total,
      currency: 'USD',
      status: 'completed',
      description: `Purchased ${newTickets.length} ticket entry lines (Order #${newOrderId})`,
      referenceId: newOrderId
    };

    setOrders(prev => [newOrder, ...prev]);
    setTickets(prev => [...newTickets, ...prev]);
    setTransactions(prev => [newTransaction, ...prev]);
    clearCart();

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Safe fallback
    }

    return newOrder;
  };

  const depositToWallet = (amount: number, method: string): boolean => {
    if (!user) return false;

    // Check daily deposit limit
    if (user.responsibleGaming.dailyDepositLimit && amount > user.responsibleGaming.dailyDepositLimit) {
      alert(`Deposit exceeds your configured daily limit of $${user.responsibleGaming.dailyDepositLimit}.`);
      return false;
    }

    const now = new Date().toISOString();
    const newTx: WalletTransaction = {
      id: `tx_${Math.floor(10000 + Math.random() * 90000)}`,
      date: now,
      type: 'deposit',
      amount,
      currency: 'USD',
      status: 'completed',
      description: `Deposit via ${method}`,
      referenceId: `dep_${Math.floor(10000 + Math.random() * 90000)}`
    };

    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        wallet: {
          ...prev.wallet,
          available: prev.wallet.available + amount,
          withdrawable: prev.wallet.withdrawable + amount
        }
      };
    });

    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const withdrawFromWallet = (amount: number, accountInfo: string): boolean => {
    if (!user) return false;
    if (user.wallet.withdrawable < amount) {
      alert('Withdrawal amount exceeds your withdrawable balance.');
      return false;
    }

    if (user.kycStatus !== 'approved') {
      alert('Identity verification (KYC) required before processing withdrawals. Please upload your documents in the account center.');
      return false;
    }

    const now = new Date().toISOString();
    const newTx: WalletTransaction = {
      id: `tx_${Math.floor(10000 + Math.random() * 90000)}`,
      date: now,
      type: 'withdrawal',
      amount: -amount,
      currency: 'USD',
      status: 'pending',
      description: `Withdrawal request to ${accountInfo}`,
      referenceId: `wth_${Math.floor(10000 + Math.random() * 90000)}`
    };

    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        wallet: {
          ...prev.wallet,
          available: prev.wallet.available - amount,
          withdrawable: prev.wallet.withdrawable - amount,
          pending: prev.wallet.pending + amount
        }
      };
    });

    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const updateKyc = (idDoc: string, addressDoc: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        kycStatus: 'pending',
        kycDocuments: {
          idDocument: idDoc,
          proofOfAddress: addressDoc,
          submittedAt: new Date().toISOString()
        },
        notifications: [
          {
            id: `notif_${Date.now()}`,
            title: 'KYC Documents Received',
            message: 'Your identity and address documents were uploaded for compliance verification.',
            date: 'Just now',
            read: false,
            type: 'system'
          },
          ...prev.notifications
        ]
      };
    });
  };

  const updateResponsibleGaming = (settings: Partial<ResponsibleGamingSettings>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        responsibleGaming: {
          ...prev.responsibleGaming,
          ...settings
        }
      };
    });
  };

  const saveFavoriteNumber = (name: string, lotteryId: string, main: number[], bonus: number[]) => {
    setUser(prev => {
      if (!prev) return null;
      const newFav: FavoriteCombination = {
        id: `fav_${Date.now()}`,
        name,
        lotteryId,
        mainNumbers: main,
        bonusNumbers: bonus
      };
      return {
        ...prev,
        favoriteNumbers: [...prev.favoriteNumbers, newFav]
      };
    });
  };

  const deleteFavoriteNumber = (id: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        favoriteNumbers: prev.favoriteNumbers.filter(f => f.id !== id)
      };
    });
  };

  const manageSubscription = (id: string, action: 'pause' | 'resume' | 'cancel') => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        subscriptions: prev.subscriptions.map(sub => {
          if (sub.id !== id) return sub;
          if (action === 'pause') return { ...sub, status: 'paused' };
          if (action === 'resume') return { ...sub, status: 'active' };
          if (action === 'cancel') return { ...sub, status: 'cancelled' };
          return sub;
        })
      };
    });
  };

  const markNotificationRead = (id: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      };
    });
  };

  // Helper to trigger jackpot alert notification
  const triggerAlertNotification = (lot: Lottery, alertItem: JackpotAlert) => {
    const formattedThreshold = alertItem.thresholdAmount >= 1000 
      ? `$${(alertItem.thresholdAmount / 1000).toFixed(2)} Billion` 
      : `$${alertItem.thresholdAmount} Million`;

    const newNotif = {
      id: `notif_alert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `🔔 Jackpot Alert: ${lot.name} reached ${lot.jackpotFormatted}!`,
      message: `The jackpot has reached or exceeded your target threshold of ${formattedThreshold}! Current jackpot is ${lot.jackpotFormatted}. Don't miss the upcoming draw on ${lot.nextDrawDate}!`,
      date: 'Just now',
      read: false,
      type: 'jackpot_alert' as const,
      linkTab: 'alerts',
      lotteryId: lot.id
    };

    setUser(prev => {
      if (!prev) return null;
      // Prevent immediate identical unread notifications
      const hasRecentSame = prev.notifications.some(n => n.title === newNotif.title && !n.read);
      if (hasRecentSame) return prev;
      return {
        ...prev,
        notifications: [newNotif, ...prev.notifications]
      };
    });

    setJackpotAlerts(prev => prev.map(a => {
      if (a.id === alertItem.id) {
        return {
          ...a,
          triggered: true,
          lastNotifiedAt: 'Just now',
          triggeredJackpotAmount: lot.jackpotAmount
        };
      }
      return a;
    }));
  };

  // Jackpot Alert Operations
  const openJackpotAlertModal = (lotteryId?: string) => {
    setAlertModalLotteryId(lotteryId || null);
    setIsAlertModalOpen(true);
  };

  const closeJackpotAlertModal = () => {
    setIsAlertModalOpen(false);
    setAlertModalLotteryId(null);
  };

  const isJackpotAlertSet = (lotteryId: string): JackpotAlert | undefined => {
    return jackpotAlerts.find(a => a.lotteryId === lotteryId);
  };

  const setJackpotAlert = (
    lotteryId: string, 
    thresholdAmount: number, 
    options?: { notifyEmail?: boolean; notifyInApp?: boolean }
  ) => {
    const targetLot = lotteries.find(l => l.id === lotteryId);
    const existingIndex = jackpotAlerts.findIndex(a => a.lotteryId === lotteryId);
    const meetsThreshold = targetLot ? targetLot.jackpotAmount >= thresholdAmount : false;

    let targetAlertItem: JackpotAlert;

    if (existingIndex >= 0) {
      targetAlertItem = {
        ...jackpotAlerts[existingIndex],
        thresholdAmount,
        notifyEmail: options?.notifyEmail ?? jackpotAlerts[existingIndex].notifyEmail,
        notifyInApp: options?.notifyInApp ?? jackpotAlerts[existingIndex].notifyInApp,
        active: true,
        triggered: meetsThreshold,
        lastNotifiedAt: meetsThreshold ? 'Just now' : jackpotAlerts[existingIndex].lastNotifiedAt,
        triggeredJackpotAmount: meetsThreshold && targetLot ? targetLot.jackpotAmount : undefined
      };
      setJackpotAlerts(prev => prev.map((a, idx) => idx === existingIndex ? targetAlertItem : a));
    } else {
      targetAlertItem = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        lotteryId,
        thresholdAmount,
        currency: targetLot?.jackpotCurrency || 'USD',
        createdAt: new Date().toISOString().split('T')[0],
        notifyInApp: options?.notifyInApp ?? true,
        notifyEmail: options?.notifyEmail ?? true,
        active: true,
        triggered: meetsThreshold,
        lastNotifiedAt: meetsThreshold ? 'Just now' : undefined,
        triggeredJackpotAmount: meetsThreshold && targetLot ? targetLot.jackpotAmount : undefined
      };
      setJackpotAlerts(prev => [targetAlertItem, ...prev]);
    }

    // If jackpot already meets/exceeds the threshold upon creation/update, trigger immediate alert!
    if (meetsThreshold && targetLot) {
      triggerAlertNotification(targetLot, targetAlertItem);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const removeJackpotAlert = (alertId: string) => {
    setJackpotAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const toggleJackpotAlert = (alertId: string) => {
    setJackpotAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, active: !a.active };
      }
      return a;
    }));
  };

  const testTriggerJackpotAlert = (alertId: string) => {
    const alertItem = jackpotAlerts.find(a => a.id === alertId);
    if (!alertItem) return;
    const lot = lotteries.find(l => l.id === alertItem.lotteryId);
    if (!lot) return;

    triggerAlertNotification(lot, alertItem);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {}
  };

  // Automated evaluation when lotteries update
  useEffect(() => {
    jackpotAlerts.forEach(alertItem => {
      if (!alertItem.active || alertItem.triggered) return;
      const lot = lotteries.find(l => l.id === alertItem.lotteryId);
      if (lot && lot.jackpotAmount >= alertItem.thresholdAmount) {
        triggerAlertNotification(lot, alertItem);
      }
    });
  }, [lotteries]);

  const adminUpdateLottery = (lotteryId: string, updates: Partial<Lottery>) => {
    setLotteries(prev => prev.map(l => l.id === lotteryId ? { ...l, ...updates } : l));
  };

  // Result matching engine
  const triggerSimulatedDraw = (lotteryId: string, manualMain?: number[], manualBonus?: number[]) => {
    const targetLottery = lotteries.find(l => l.id === lotteryId);
    if (!targetLottery) throw new Error('Lottery not found');

    // Generate random winning numbers if not manually provided
    let winMain = manualMain;
    let winBonus = manualBonus;

    if (!winMain || winMain.length === 0) {
      const pool = Array.from({ length: targetLottery.rules.mainMaxNumber }, (_, i) => i + 1);
      winMain = [];
      while (winMain.length < targetLottery.rules.mainNumbersCount) {
        const idx = Math.floor(Math.random() * pool.length);
        winMain.push(pool.splice(idx, 1)[0]);
      }
      winMain.sort((a, b) => a - b);
    }

    if (!winBonus || winBonus.length === 0) {
      const bPool = Array.from({ length: targetLottery.rules.bonusMaxNumber }, (_, i) => i + 1);
      winBonus = [];
      while (winBonus.length < targetLottery.rules.bonusNumbersCount) {
        const idx = Math.floor(Math.random() * bPool.length);
        winBonus.push(bPool.splice(idx, 1)[0]);
      }
      winBonus.sort((a, b) => a - b);
    }

    let matchesCount = 0;
    let totalWinnings = 0;

    // Scan all user tickets for this lottery
    const updatedTickets = tickets.map(ticket => {
      if (ticket.lotteryId !== lotteryId || ticket.status !== 'active') return ticket;

      const matchedLines = ticket.lines.map((line, idx) => {
        const matchedM = line.mainNumbers.filter(n => winMain!.includes(n));
        const matchedB = line.bonusNumbers.filter(b => winBonus!.includes(b));
        
        let winPrize = 0;
        let tierName = '';

        if (matchedM.length === targetLottery.rules.mainNumbersCount && matchedB.length === targetLottery.rules.bonusNumbersCount) {
          winPrize = 50000; // Big simulated win!
          tierName = 'Jackpot Match!';
        } else if (matchedM.length >= 3) {
          winPrize = matchedM.length * 20 + (matchedB.length > 0 ? 30 : 0);
          tierName = `${matchedM.length} Numbers${matchedB.length > 0 ? ' + Bonus' : ''}`;
        } else if (matchedB.length > 0) {
          winPrize = 4;
          tierName = 'Bonus Match';
        }

        if (winPrize > 0) {
          matchesCount++;
          totalWinnings += winPrize;
        }

        return {
          lineIndex: idx,
          matchedMain: matchedM,
          matchedBonus: matchedB,
          prizeTier: tierName,
          winAmount: winPrize
        };
      });

      const ticketWonTotal = matchedLines.reduce((acc, cur) => acc + (cur.winAmount || 0), 0);

      if (ticketWonTotal > 0) {
        return {
          ...ticket,
          status: 'won' as const,
          confirmedWinnings: ticketWonTotal,
          claimStatus: 'paid' as const,
          matchedLines
        };
      } else {
        return {
          ...ticket,
          status: 'lost' as const,
          matchedLines
        };
      }
    });

    setTickets(updatedTickets);

    // Update lottery's previous draw
    setLotteries(prev => prev.map(l => {
      if (l.id !== lotteryId) return l;
      return {
        ...l,
        previousDraw: {
          date: 'Just Drawn',
          winningMainNumbers: winMain!,
          winningBonusNumbers: winBonus!,
          jackpotWon: false,
          jackpotAmount: l.jackpotFormatted
        }
      };
    }));

    // If user won, add winnings to wallet and create notification!
    if (totalWinnings > 0 && user) {
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          wallet: {
            ...prev.wallet,
            available: prev.wallet.available + totalWinnings,
            withdrawable: prev.wallet.withdrawable + totalWinnings
          },
          notifications: [
            {
              id: `notif_win_${Date.now()}`,
              title: `🎉 Lottery Winning Result: ${targetLottery.name}!`,
              message: `Your ticket matched winning numbers! A prize of $${totalWinnings.toFixed(2)} was credited to your wallet.`,
              date: 'Just now',
              read: false,
              type: 'win',
              linkTab: 'winnings'
            },
            ...prev.notifications
          ]
        };
      });

      // Confetti for win
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {
        // Safe fallback
      }
    }

    return {
      winningMain: winMain!,
      winningBonus: winBonus!,
      matchesCount,
      totalWinnings
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        lotteries,
        cart,
        tickets,
        orders,
        transactions,
        currency,
        setCurrency,
        formatMoney,
        demoMode,
        setDemoMode,
        currentCountry,
        setCurrentCountry,
        isCountryBlocked,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        checkout,
        depositToWallet,
        withdrawFromWallet,
        updateKyc,
        updateResponsibleGaming,
        saveFavoriteNumber,
        deleteFavoriteNumber,
        manageSubscription,
        selectedTicketForProof,
        setSelectedTicketForProof,
        isSearchOpen,
        setIsSearchOpen,
        liveChatOpen,
        setLiveChatOpen,
        markNotificationRead,
        jackpotAlerts,
        setJackpotAlert,
        removeJackpotAlert,
        toggleJackpotAlert,
        testTriggerJackpotAlert,
        isJackpotAlertSet,
        isAlertModalOpen,
        alertModalLotteryId,
        openJackpotAlertModal,
        closeJackpotAlertModal,
        adminUpdateLottery,
        triggerSimulatedDraw
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
