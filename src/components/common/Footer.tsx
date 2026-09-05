import React, { useState } from 'react';
import { 
  Globe, 
  Shield, 
  Lock, 
  Award, 
  HeartHandshake, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#040c1d] text-slate-400 text-sm">
      {/* Trust & Responsible Gaming Banner */}
      <div className="border-t border-b border-slate-800 bg-[#07132b]/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-white tracking-tight">
              Trusted. Secure. Responsible.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">SSL Encrypted</p>
                <p className="text-[11px] text-slate-500">Your information is safe with us.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Licensed Partners</p>
                <p className="text-[11px] text-slate-500">We work with authorized lottery operators.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setCurrentView('responsible-gaming')}
                className="flex items-center gap-2.5 text-left hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Responsible Gaming</p>
                  <p className="text-[11px] text-slate-500 underline">Play responsibly. Learn more.</p>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 border border-slate-700 bg-slate-900/80 px-2.5 py-1 rounded-lg">
              <span className="text-base font-extrabold text-amber-400">18+</span>
              <span className="text-[11px] text-slate-400 leading-tight">
                or the minimum legal age<br />required in your jurisdiction.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Globe className="w-5 h-5 text-slate-950 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white font-display">
                  Global<span className="text-amber-400">Lotto</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase -mt-1">
                  Bigger Dreams. A Brighter Tomorrow.
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              GlobalLotto is an international lottery concierge platform providing safe, independent ticket courier purchasing for major worldwide draws. Real tickets are bought in host countries by authorized agents and scanned into your secure profile.
            </p>
            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <p>Registered Concierge Courier Service #GL-884920</p>
              <p>Secure PCI-DSS Level 1 compliant gateway processing.</p>
            </div>
          </div>

          {/* Column 1: Play */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Play</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('lotteries')} className="hover:text-amber-400 transition-colors">Lotteries</button></li>
              <li><button onClick={() => setCurrentView('results')} className="hover:text-amber-400 transition-colors">Results</button></li>
              <li><button onClick={() => setCurrentView('jackpots')} className="hover:text-amber-400 transition-colors">Jackpots</button></li>
              <li><button onClick={() => setCurrentView('promotions')} className="hover:text-amber-400 transition-colors">Promotions</button></li>
              <li><button onClick={() => setCurrentView('how-it-works')} className="hover:text-amber-400 transition-colors">How It Works</button></li>
            </ul>
          </div>

          {/* Column 2: Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Support</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">Help Center</button></li>
              <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">Contact Us</button></li>
              <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">FAQ</button></li>
              <li><button onClick={() => setCurrentView('responsible-gaming')} className="hover:text-amber-400 transition-colors">Responsible Gaming</button></li>
              <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">Report a Problem</button></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('how-it-works')} className="hover:text-amber-400 transition-colors">About Us</button></li>
              <li><button onClick={() => setCurrentView('how-it-works')} className="hover:text-amber-400 transition-colors">Our Partners</button></li>
              <li><button onClick={() => setCurrentView('winners')} className="hover:text-amber-400 transition-colors">Winners</button></li>
              <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">News & Press</button></li>
              <li><button onClick={() => setCurrentView('admin')} className="text-amber-400/80 hover:text-amber-300 font-semibold">Admin Portal</button></li>
            </ul>
          </div>

          {/* Column 4: Legal & Newsletter */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">Terms & Conditions</button></li>
                <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">Cookie Policy</button></li>
                <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">AML/KYC Policy</button></li>
                <li><button onClick={() => setCurrentView('help')} className="hover:text-amber-400 transition-colors">Jurisdiction Restrictions</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter & Social Section */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h5 className="text-sm font-bold text-white mb-1">Subscribe for Jackpot Updates</h5>
            <p className="text-xs text-slate-400 mb-3">Get the latest jackpots, rollover alerts, and exclusive bonus line promotions.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors shrink-0 shadow-sm"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Thank you! You will receive draw notifications.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a href="#facebook" className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#twitter" className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#instagram" className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#youtube" className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Important Concierge Service & Jurisdiction Notice</span>
          </div>
          <p>
            GlobalLotto is an independent international ticket courier service. We are neither an official lottery operator nor affiliated with MUSL, Camelot, Française des Jeux, Sisal, or any governmental lottery commission. When you place an order, our localized representatives purchase physical official lottery tickets on your behalf from licensed lottery retailers in the host jurisdiction.
          </p>
          <p>
            Availability is strictly dependent on your current physical location and applicable local regulations. Participation is void where prohibited by law. You must be 18 years of age or older (or the legal age in your jurisdiction) to use this service.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2025 GlobalLotto. All rights reserved.</p>
          <p className="font-medium text-slate-400">Play Responsibly. Dreams are better when shared.</p>
        </div>
      </div>
    </footer>
  );
};
