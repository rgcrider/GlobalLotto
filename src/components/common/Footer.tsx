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
  AlertTriangle,
  MapPin,
  Smartphone,
  GraduationCap
} from 'lucide-react';
import { IllinoisLotteryLogo } from './IllinoisLotteryLogo';

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
    <footer className="w-full bg-[#030d22] text-slate-400 text-xs border-t border-slate-800">
      {/* Education & Giving Back Banner */}
      <div className="border-b border-slate-800 bg-[#061536] py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100 block">
                $24+ Billion Contributed to Illinois Public Schools
              </span>
              <span className="text-[11px] text-slate-300">
                100% of Illinois Lottery profits support the Common School Fund and specialty state causes.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Official State Drawings</p>
                <p className="text-[11px] text-slate-500">Illinois Certified Audited</p>
              </div>
            </div>

            <button 
              onClick={() => setCurrentView('responsible-gaming')}
              className="flex items-center gap-2 text-left hover:text-white transition-colors"
            >
              <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Have A Game Plan®</p>
                <p className="text-[11px] text-amber-300 underline font-medium">1-800-GAMBLER</p>
              </div>
            </button>

            <div className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-2.5 py-1 rounded">
              <span className="text-xs font-bold text-amber-400">18+</span>
              <span className="text-[10px] text-slate-400 leading-tight">
                Be 18 or older to play
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <button 
              onClick={() => setCurrentView('home')} 
              className="text-left focus:outline-none"
            >
              <IllinoisLotteryLogo variant="header" size="md" />
            </button>
            <p className="text-xs text-slate-300 leading-relaxed pr-4">
              The official Illinois Lottery website. Play Powerball, Mega Millions, Lotto with Extra Shot, Lucky Day Lotto, Pick 3, Pick 4, and Fast Play online. Check winning numbers and see how proceeds support Illinois education and communities statewide.
            </p>
            <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
              <p>State of Illinois · Department of the Lottery</p>
              <p>101 W. Jefferson St, Springfield, IL 62702</p>
            </div>
          </div>

          {/* Column 1: Games */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Games</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('lotteries')} className="hover:text-amber-400 transition-colors">Illinois Lotto</button></li>
              <li><button onClick={() => setCurrentView('lotteries')} className="hover:text-amber-400 transition-colors">Lucky Day Lotto</button></li>
              <li><button onClick={() => setCurrentView('lotteries')} className="hover:text-amber-400 transition-colors">Pick 3 & Pick 4</button></li>
              <li><button onClick={() => setCurrentView('lotteries')} className="hover:text-amber-400 transition-colors">Powerball & Mega Millions</button></li>
              <li><button onClick={() => setCurrentView('lotteries')} className="hover:text-amber-400 transition-colors">Fast Play Games</button></li>
            </ul>
          </div>

          {/* Column 2: Winning Numbers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Winning Numbers</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('results')} className="hover:text-amber-400 transition-colors">Today's Numbers</button></li>
              <li><button onClick={() => setCurrentView('results')} className="hover:text-amber-400 transition-colors">Did I Win? Checker</button></li>
              <li><button onClick={() => setCurrentView('results')} className="hover:text-amber-400 transition-colors">Past Draw Results</button></li>
              <li><button onClick={() => setCurrentView('winners')} className="hover:text-amber-400 transition-colors">Claiming a Prize</button></li>
              <li><button onClick={() => setCurrentView('winners')} className="hover:text-amber-400 transition-colors">Tax & Payout Calculator</button></li>
            </ul>
          </div>

          {/* Column 3: Where Money Goes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Giving Back</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('promotions')} className="hover:text-amber-400 transition-colors">Common School Fund</button></li>
              <li><button onClick={() => setCurrentView('promotions')} className="hover:text-amber-400 transition-colors">Illinois Veterans Assistance</button></li>
              <li><button onClick={() => setCurrentView('promotions')} className="hover:text-amber-400 transition-colors">Special Olympics Illinois</button></li>
              <li><button onClick={() => setCurrentView('promotions')} className="hover:text-amber-400 transition-colors">Breast Cancer Research</button></li>
              <li><button onClick={() => setCurrentView('promotions')} className="hover:text-amber-400 transition-colors">Police Memorial Fund</button></li>
            </ul>
          </div>

          {/* Column 4: Official Claim Centers */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Claim Centers</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>Chicago (Thompson Ctr)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>Des Plaines (Harrison St)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>Rockford (Wyman St)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>Springfield (State Dept HQ)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>Fairview Heights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter & Social Section */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h5 className="text-xs font-bold text-slate-200 mb-1 uppercase tracking-wider">Illinois Lottery Alerts</h5>
            <p className="text-xs text-slate-400 mb-2.5">Receive drawing notifications, jackpot alerts, and winning numbers updates.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-9 bg-slate-900 border border-slate-700 rounded-md px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full"
              />
              <button
                type="submit"
                className="h-9 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Sign Up
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Subscribed successfully to Illinois Lottery alerts!
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a href="#facebook" aria-label="Facebook" className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="#twitter" aria-label="Twitter" className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a href="#instagram" aria-label="Instagram" className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="#youtube" aria-label="Youtube" className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Responsible Gaming & Legal Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Responsible Gaming & Official Notice</span>
          </div>
          <p>
            Be 18+. When you play the lottery, you support Illinois education and more. If you or someone you know has a gambling problem, crisis counseling and referral services can be accessed by calling <strong>1-800-GAMBLER (1-800-426-2537)</strong> or texting <strong>GAMB to 833234</strong>.
          </p>
          <p>
            The Illinois Lottery operates under the authority of the Illinois Department of the Lottery. All drawings and game results are audited and verified. Winning ticket claims are subject to official Illinois Lottery rules and state statutes.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-slate-800 pt-4">
          <p>© 2025 Illinois Lottery. State of Illinois. All rights reserved.</p>
          <p className="text-slate-400">Have In Illinois · Anything's Possible®</p>
        </div>
      </div>
    </footer>
  );
};
