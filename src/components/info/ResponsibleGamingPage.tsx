import React from 'react';
import { HeartHandshake, ShieldAlert, CheckCircle2, PhoneCall, Globe } from 'lucide-react';

export const ResponsibleGamingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
          Player Protection & Well-being
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-1">
          Responsible Gaming Policy
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Lottery is a form of entertainment, not an investment strategy. We empower all players with control tools and resources.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-xl font-bold text-slate-900 font-display">
          Our Responsible Play Principles
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          At GlobalLotto, we are committed to endorsing responsible wagering among our customers. We encourage everyone to determine sensible financial boundaries before participating in any draw.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">Deposit & Spending Limits</h4>
            <p className="text-slate-600">
              Set personal daily, weekly, or monthly deposit ceilings within your account dashboard. Decreases take effect immediately.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">Self-Exclusion & Time-Outs</h4>
            <p className="text-slate-600">
              Take a break anytime with flexible cooling-off periods from 24 hours to permanent account closure.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">Age Verification (18+)</h4>
            <p className="text-slate-600">
              Strict identity checks prohibit minors from opening accounts or participating in courier orders.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">Reality Check Prompts</h4>
            <p className="text-slate-600">
              Configurable on-screen notifications remind you how long you have been active on the site and total spent.
            </p>
          </div>
        </div>
      </div>

      {/* External Help Helplines */}
      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200 space-y-4">
        <h3 className="text-xl font-bold text-amber-950 font-display flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-amber-700" />
          <span>Independent Help Organizations</span>
        </h3>
        <p className="text-xs text-amber-900 leading-relaxed">
          If you or someone you know is experiencing difficulties with gambling, confidential and free assistance is available 24/7:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white p-4 rounded-xl border border-amber-300">
            <p className="font-bold text-slate-900">Gamblers Anonymous</p>
            <p className="text-slate-500 mt-1">www.gamblersanonymous.org</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-amber-300">
            <p className="font-bold text-slate-900">National Council on Problem Gambling</p>
            <p className="text-slate-500 mt-1">1-800-522-4700 (USA)</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-amber-300">
            <p className="font-bold text-slate-900">GamCare International</p>
            <p className="text-slate-500 mt-1">www.gamcare.org.uk</p>
          </div>
        </div>
      </div>
    </div>
  );
};
