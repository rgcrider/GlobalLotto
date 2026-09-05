import { Promotion } from '../types';

export const PROMOTIONS: Promotion[] = [
  {
    id: 'promo-welcome',
    title: 'Welcome Bonus: Get 10 Free Lines',
    description: 'Register and place your first multi-line entry to receive 10 complimentary concierge lines on Powerball or EuroMillions.',
    code: 'WELCOME10',
    badge: 'NEW PLAYER EXCLUSIVE',
    bonusType: 'free_lines',
    value: '10 Free Lines',
    expiresAt: '2025-12-31',
    eligibleLotteries: ['powerball', 'megamillions', 'euromillions'],
    terms: [
      'Applicable to newly registered accounts only.',
      'Must purchase at least 2 lines in your first order to unlock 10 bonus lines.',
      'Bonus lines will be credited automatically or via code WELCOME10 at checkout.',
      'Winnings from bonus lines are 100% commission-free.'
    ]
  },
  {
    id: 'promo-multidraw',
    title: 'Multi-Draw Package Discount',
    description: 'Save up to 25% on entry prices when choosing 5, 10, or 25 consecutive draws in advance.',
    code: 'MULTIDRAW25',
    badge: 'POPULAR CHOICE',
    bonusType: 'discount',
    value: 'Up to 25% Off',
    expiresAt: 'Ongoing',
    eligibleLotteries: ['powerball', 'megamillions', 'euromillions', 'superenalotto', 'ozlotto'],
    terms: [
      '5-draw packages receive 10% discount.',
      '10-draw packages receive 15% discount.',
      '25-draw packages receive 25% discount.',
      'Applies directly to ticket and concierge service costs.'
    ]
  },
  {
    id: 'promo-deposit-match',
    title: '100% First Deposit Match up to $100',
    description: 'Double your playing balance immediately when funding your GlobalLotto concierge wallet for the first time.',
    code: 'DOUBLEPLAY',
    badge: 'WALLET BONUS',
    bonusType: 'deposit_match',
    value: '100% Match ($100 max)',
    expiresAt: '2025-12-31',
    minDeposit: 20,
    eligibleLotteries: ['all'],
    terms: [
      'Minimum qualifying deposit is $20.',
      'Bonus funds can be used on all international lottery orders.',
      'Bonus balance cannot be directly withdrawn but all prize winnings are withdrawable.'
    ]
  },
  {
    id: 'promo-cashback',
    title: 'VIP 15% Weekly Cashback',
    description: 'Get 15% cashback returned to your wallet every Monday on non-winning lines from the previous week.',
    code: 'VIPCASH15',
    badge: 'LOYALTY REWARD',
    bonusType: 'cashback',
    value: '15% Back',
    expiresAt: 'Ongoing',
    eligibleLotteries: ['all'],
    terms: [
      'Calculated automatically on net non-winning entries.',
      'Credited to available wallet balance every Monday at 00:00 UTC.'
    ]
  }
];
