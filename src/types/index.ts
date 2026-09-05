export type LotteryCategory = 
  | 'All' 
  | 'US' 
  | 'Europe' 
  | 'Asia' 
  | 'Australia' 
  | 'Daily' 
  | 'Weekly'
  | 'Mega Jackpots';

export type PaymentMethod = 'credit_card' | 'wallet' | 'bank_transfer' | 'crypto';

export interface PrizeTier {
  match: string;
  prize: string;
  odds: string;
  estimatedWinners?: number;
}

export interface LotteryRules {
  mainNumbersCount: number;
  mainMaxNumber: number;
  mainMinNumber: number;
  bonusNumbersCount: number;
  bonusMaxNumber: number;
  bonusMinNumber: number;
  bonusName: string;
  allowDuplicates?: boolean;
}

export interface Lottery {
  id: string;
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  jackpotAmount: number; // in millions
  jackpotCurrency: string;
  jackpotFormatted: string;
  nextDrawDate: string;
  drawSchedule: string;
  ticketPrice: number;
  serviceFee: number;
  category: LotteryCategory[];
  popular: boolean;
  status: 'open' | 'closed' | 'drawing';
  rules: LotteryRules;
  logoBg: string;
  logoColor: string;
  description: string;
  howToPlay: string[];
  prizeTiers: PrizeTier[];
  previousDraw?: {
    date: string;
    winningMainNumbers: number[];
    winningBonusNumbers: number[];
    jackpotWon: boolean;
    jackpotAmount: string;
  };
}

export interface TicketLine {
  id: string;
  mainNumbers: number[];
  bonusNumbers: number[];
}

export type DrawOption = 'single' | '2draws' | '5draws' | '10draws' | 'subscription';

export interface CartItem {
  id: string;
  lotteryId: string;
  drawOption: DrawOption;
  drawDate: string;
  lines: TicketLine[];
  ticketCost: number;
  serviceFee: number;
  discount: number;
  total: number;
  multiDrawCount?: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  status: 'confirmed' | 'processing' | 'completed' | 'cancelled';
  ticketProcessingStatus: 'dispatched' | 'purchased' | 'scanned' | 'stored_securely';
  scannedAt?: string;
  complianceConfirmed: boolean;
}

export interface PurchasedTicket {
  id: string;
  orderId: string;
  lotteryId: string;
  drawDate: string;
  purchaseDate: string;
  lines: TicketLine[];
  status: 'active' | 'pending_result' | 'won' | 'lost' | 'expired';
  potentialWinnings?: number;
  confirmedWinnings?: number;
  claimStatus?: 'none' | 'pending' | 'verified' | 'paid';
  scannedImageUrl?: string;
  matchedLines?: {
    lineIndex: number;
    matchedMain: number[];
    matchedBonus: number[];
    prizeTier?: string;
    winAmount?: number;
  }[];
}

export type UserTicket = PurchasedTicket;

export interface DrawResult {
  id: string;
  lotteryId: string;
  drawDate: string;
  winningMainNumbers: number[];
  winningBonusNumbers: number[];
  jackpotWon: boolean;
  jackpotAmount: string;
  winnerCount: number;
  nextJackpot: string;
  prizeBreakdown: {
    tier: string;
    match: string;
    prize: string;
    winners: number;
  }[];
  verifiedByAdmin: boolean;
}

export interface UserWallet {
  available: number;
  pending: number;
  bonus: number;
  withdrawable: number;
}

export interface WalletTransaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'ticket_purchase' | 'win_payout' | 'bonus_credit' | 'refund';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  referenceId?: string;
}

export interface ResponsibleGamingSettings {
  dailyDepositLimit: number;
  weeklyDepositLimit: number;
  monthlyDepositLimit: number;
  maxTicketSpend: number;
  realityCheckIntervalMinutes: number;
  coolingOffUntil?: string;
  selfExcluded: boolean;
  selfExcludedUntil?: string;
}

export interface FavoriteCombination {
  id: string;
  name: string;
  lotteryId: string;
  mainNumbers: number[];
  bonusNumbers: number[];
}

export interface UserSubscription {
  id: string;
  lotteryId: string;
  lines: TicketLine[];
  status: 'active' | 'paused' | 'cancelled';
  frequency: 'Every Draw' | 'Once Weekly';
  maxMonthlySpend: number;
  nextChargeDate: string;
  createdAt: string;
  drawsCount: number;
}

export interface JackpotAlert {
  id: string;
  lotteryId: string;
  thresholdAmount: number; // in millions, e.g. 500 for $500M
  currency: string;
  createdAt: string;
  notifyInApp: boolean;
  notifyEmail: boolean;
  active: boolean;
  triggered: boolean;
  lastNotifiedAt?: string;
  triggeredJackpotAmount?: number;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'win' | 'ticket' | 'draw' | 'system' | 'promo' | 'alert' | 'jackpot_alert';
  linkTab?: string;
  lotteryId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  avatar: string;
  isVerified: boolean;
  kycStatus: 'not_started' | 'pending' | 'approved' | 'rejected';
  kycDocuments?: {
    idDocument?: string;
    proofOfAddress?: string;
    submittedAt?: string;
  };
  twoFactorEnabled: boolean;
  registeredAt: string;
  wallet: UserWallet;
  responsibleGaming: ResponsibleGamingSettings;
  favoriteNumbers: FavoriteCombination[];
  subscriptions: UserSubscription[];
  notifications: UserNotification[];
  jackpotAlerts?: JackpotAlert[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  badge: string;
  bonusType: 'free_lines' | 'deposit_match' | 'cashback' | 'discount';
  value: string;
  expiresAt: string;
  minDeposit?: number;
  eligibleLotteries: string[];
  terms: string[];
}

export interface WinnerStory {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  lotteryName: string;
  prizeAmount: string;
  date: string;
  quote: string;
  avatarUrl: string;
  isDemo: boolean;
}
