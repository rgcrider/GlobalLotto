import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, Mail } from 'lucide-react';
import { FAQS } from '../../data/faqs';
import { useApp } from '../../context/AppContext';

export const HelpCenterPage: React.FC = () => {
  const { setLiveChatOpen } = useApp();
  const [openFaq, setOpenFaq] = useState<string | null>(FAQS[0]?.question || null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          24/7 Concierge Support Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-1">
          Help Center & FAQs
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Find answers regarding ticket scanning, draw results, claiming winnings, and account security.
        </p>

        {/* Search */}
        <div className="mt-6 relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions (e.g. scans, claiming, taxes)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openFaq === faq.question;
          return (
            <div
              key={faq.question || idx}
              className="border border-slate-100 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : faq.question)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-bold text-slate-900">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Need more help? Live chat button */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold font-display">Still have questions?</h3>
          <p className="text-xs text-slate-300 mt-1">Our international concierge agents are ready to assist you in real time.</p>
        </div>
        <button
          onClick={() => setLiveChatOpen(true)}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Launch 24/7 Live Chat</span>
        </button>
      </div>
    </div>
  );
};
