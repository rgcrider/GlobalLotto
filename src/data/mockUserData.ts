import { UserProfile, PurchasedTicket, WalletTransaction } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_88291',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 234-8901',
  country: 'Canada',
  countryCode: 'CA',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  isVerified: true,
  kycStatus: 'approved',
  twoFactorEnabled: true,
  registeredAt: '2024-11-10',
  wallet: {
    available: 185.50,
    pending: 0.00,
    bonus: 25.00,
    withdrawable: 185.50,
  },
  responsibleGaming: {
    dailyDepositLimit: 250,
    weeklyDepositLimit: 1000,
    monthlyDepositLimit: 3000,
    maxTicketSpend: 150,
    realityCheckIntervalMinutes: 60,
    selfExcluded: false,
  },
  favoriteNumbers: [
    {
      id: 'fav-1',
      name: 'Family Birthdays',
      lotteryId: 'powerball',
      mainNumbers: [3, 12, 17, 36, 51],
      bonusNumbers: [8]
    },
    {
      id: 'fav-2',
      name: 'Lucky Prime Stars',
      lotteryId: 'euromillions',
      mainNumbers: [7, 11, 23, 31, 47],
      bonusNumbers: [3, 9]
    }
  ],
  subscriptions: [
    {
      id: 'sub_001',
      lotteryId: 'powerball',
      lines: [
        { id: 'sub-l1', mainNumbers: [3, 12, 17, 36, 51], bonusNumbers: [8] },
        { id: 'sub-l2', mainNumbers: [7, 21, 32, 44, 62], bonusNumbers: [13] }
      ],
      status: 'active',
      frequency: 'Every Draw',
      maxMonthlySpend: 80,
      nextChargeDate: '2025-04-23',
      createdAt: '2025-03-01',
      drawsCount: 16
    }
  ],
  notifications: [
    {
      id: 'notif-alert-1',
      title: '🔔 Jackpot Alert: US Powerball reached $1.20 Billion!',
      message: 'US Powerball has crossed your alert threshold of $1.00 Billion! Current jackpot is $1.20 Billion. Draw cutoff closes tonight.',
      date: 'Just now',
      read: false,
      type: 'jackpot_alert',
      linkTab: 'alerts',
      lotteryId: 'powerball'
    },
    {
      id: 'notif-1',
      title: 'Winning Ticket Match!',
      message: 'Congratulations! Your EuroMillions ticket for draw Apr 19 matched 3 numbers. Prize of €60 credited to your wallet.',
      date: '2 hours ago',
      read: false,
      type: 'win',
      linkTab: 'winnings'
    },
    {
      id: 'notif-2',
      title: 'Scanned Ticket Ready',
      message: 'Your official ticket for US Powerball (Draw Apr 23) has been purchased and scanned by our local team.',
      date: '1 day ago',
      read: true,
      type: 'ticket',
      linkTab: 'tickets'
    },
    {
      id: 'notif-3',
      title: 'Powerball Rollover: $1.20 Billion!',
      message: 'The Powerball jackpot has rolled over to an astronomical $1.20 Billion. Get your entries before cutoff.',
      date: '2 days ago',
      read: true,
      type: 'draw',
      linkTab: 'overview'
    }
  ],
  jackpotAlerts: [
    {
      id: 'alert-1',
      lotteryId: 'powerball',
      thresholdAmount: 1000,
      currency: 'USD',
      createdAt: '2025-04-10',
      notifyInApp: true,
      notifyEmail: true,
      active: true,
      triggered: true,
      lastNotifiedAt: 'Just now',
      triggeredJackpotAmount: 1200
    },
    {
      id: 'alert-2',
      lotteryId: 'megamillions',
      thresholdAmount: 500,
      currency: 'USD',
      createdAt: '2025-04-15',
      notifyInApp: true,
      notifyEmail: true,
      active: true,
      triggered: false
    },
    {
      id: 'alert-3',
      lotteryId: 'euromillions',
      thresholdAmount: 150,
      currency: 'EUR',
      createdAt: '2025-04-18',
      notifyInApp: true,
      notifyEmail: false,
      active: true,
      triggered: false
    }
  ]
};

export const INITIAL_TICKETS: PurchasedTicket[] = [
  {
    id: 'tkt_pb_9942',
    orderId: 'ord_pb_84712',
    lotteryId: 'powerball',
    drawDate: 'Wed, Apr 23, 2025',
    purchaseDate: '2025-04-20 16:42 UTC',
    lines: [
      { id: 'l1', mainNumbers: [3, 12, 17, 36, 51], bonusNumbers: [8] },
      { id: 'l2', mainNumbers: [7, 21, 32, 44, 62], bonusNumbers: [13] },
      { id: 'l3', mainNumbers: [14, 25, 38, 49, 68], bonusNumbers: [22] }
    ],
    status: 'active',
    scannedImageUrl: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tkt_em_8819',
    orderId: 'ord_em_77123',
    lotteryId: 'euromillions',
    drawDate: 'Fri, Apr 19, 2025',
    purchaseDate: '2025-04-18 11:20 UTC',
    lines: [
      { id: 'l1', mainNumbers: [9, 18, 27, 44, 49], bonusNumbers: [8, 11] },
      { id: 'l2', mainNumbers: [12, 23, 31, 39, 50], bonusNumbers: [3, 12] }
    ],
    status: 'won',
    confirmedWinnings: 60.00,
    claimStatus: 'paid',
    matchedLines: [
      {
        lineIndex: 0,
        matchedMain: [9, 18, 27],
        matchedBonus: [8],
        prizeTier: '3 Numbers + 1 Star',
        winAmount: 60.00
      }
    ],
    scannedImageUrl: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tkt_mm_6621',
    orderId: 'ord_mm_55102',
    lotteryId: 'megamillions',
    drawDate: 'Fri, Apr 18, 2025',
    purchaseDate: '2025-04-16 09:15 UTC',
    lines: [
      { id: 'l1', mainNumbers: [4, 15, 28, 41, 59], bonusNumbers: [19] },
      { id: 'l2', mainNumbers: [10, 22, 35, 48, 64], bonusNumbers: [5] }
    ],
    status: 'lost',
    scannedImageUrl: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_9812',
    date: '2025-04-19 23:30 UTC',
    type: 'win_payout',
    amount: 60.00,
    currency: 'USD',
    status: 'completed',
    description: 'EuroMillions Prize Payout - Draw Apr 19 (3 Numbers + 1 Star)',
    referenceId: 'tkt_em_8819'
  },
  {
    id: 'tx_9811',
    date: '2025-04-20 16:42 UTC',
    type: 'ticket_purchase',
    amount: -15.00,
    currency: 'USD',
    status: 'completed',
    description: 'Powerball 3 Lines Entry (Draw Apr 23)',
    referenceId: 'ord_pb_84712'
  },
  {
    id: 'tx_9810',
    date: '2025-04-18 11:20 UTC',
    type: 'ticket_purchase',
    amount: -11.40,
    currency: 'USD',
    status: 'completed',
    description: 'EuroMillions 2 Lines Entry (Draw Apr 19)',
    referenceId: 'ord_em_77123'
  },
  {
    id: 'tx_9809',
    date: '2025-04-15 10:00 UTC',
    type: 'deposit',
    amount: 100.00,
    currency: 'USD',
    status: 'completed',
    description: 'Instant Card Deposit (Mastercard ending 4419)',
    referenceId: 'dep_mastercard_4419'
  }
];
