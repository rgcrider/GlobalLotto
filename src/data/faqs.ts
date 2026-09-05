export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQS: FAQItem[] = [
  {
    category: 'General',
    question: 'What is GlobalLotto and how does the concierge service work?',
    answer: 'GlobalLotto is an independent international ticket courier service. When you select your numbers on our platform, our authorized local representatives in the host jurisdiction physically purchase official tickets from licensed lottery retailers on your behalf. We then scan the ticket and upload it to your secure account prior to the draw.'
  },
  {
    category: 'General',
    question: 'Is GlobalLotto an official lottery operator?',
    answer: 'No. GlobalLotto is an independent third-party lottery courier and ticket purchasing service. We do not organize, run, or operate lottery draws. We facilitate legal entry purchase through authorized vendors in the respective countries on behalf of international customers.'
  },
  {
    category: 'Tickets & Scans',
    question: 'Will I see a scan of my physical lottery ticket?',
    answer: 'Yes. Every ticket ordered through GlobalLotto is scanned by our local operations office with the serial number, your selected numbers, and the official state/national lottery barcode clearly visible. Scans are accessible 24/7 in your "My Tickets" dashboard before the draw takes place.'
  },
  {
    category: 'Winnings',
    question: 'Does GlobalLotto take any commission from my winnings?',
    answer: 'Zero percent. GlobalLotto charges only a transparent concierge service fee at the time of ticket purchase. 100% of all prize money won belongs entirely to you. Secondary prizes are credited directly into your wallet automatically with no fees.'
  },
  {
    category: 'Winnings',
    question: 'How do I collect a major jackpot?',
    answer: 'For major jackpots that require in-person validation at official lottery headquarters (such as Powerball or Mega Millions top tiers), GlobalLotto arranges VIP travel, legal counsel, and hand-delivers your physical ticket to you in the host country so you can claim your prize directly.'
  },
  {
    category: 'Legal & Compliance',
    question: 'Is it legal to play foreign lotteries online?',
    answer: 'Under the laws of countries like the United States and European nations, anyone of legal age can purchase and hold a winning ticket, regardless of citizenship or residency, provided the ticket is physically purchased within the jurisdiction by an authorized representative.'
  },
  {
    category: 'Legal & Compliance',
    question: 'What are the age requirements?',
    answer: 'You must be at least 18 years of age (or the legal gambling/lottery age in your jurisdiction, whichever is higher) to register an account and purchase entries on GlobalLotto.'
  },
  {
    category: 'Banking',
    question: 'How do deposits and withdrawals work?',
    answer: 'We support international credit/debit cards, secure bank wire transfers, and leading electronic wallets. Withdrawals of winnings to your bank account are processed within 24 to 48 hours following standard KYC verification.'
  }
];
