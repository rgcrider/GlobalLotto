import React, { useState } from 'react';
import { X, Send, Bot, User, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LiveChatDrawer: React.FC = () => {
  const { liveChatOpen, setLiveChatOpen } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! Welcome to GlobalLotto Concierge Support. How can we help you today with your lottery entries, scanned tickets, or winnings?',
      time: 'Just now'
    }
  ]);

  if (!liveChatOpen) return null;

  const quickPrompts = [
    'Where do I find my scanned ticket?',
    'How do I collect winnings?',
    'Is my country supported?',
    'How does Quick Pick work?'
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: now }]);
    setInput('');

    // Intelligent automated support responses
    setTimeout(() => {
      let reply = "Thank you for asking! Our dedicated customer support desk operates 24/7. Your query has been logged.";
      const lower = userText.toLowerCase();

      if (lower.includes('scan') || lower.includes('ticket')) {
        reply = "Once your order is placed, our local office couriers in the host country buy the physical ticket from an authorized retailer and upload high-resolution scans with serial codes directly into your 'My Tickets' dashboard within a few hours.";
      } else if (lower.includes('win') || lower.includes('collect') || lower.includes('prize')) {
        reply = "Secondary prizes are credited directly into your GlobalLotto wallet with 100% zero commission! For top jackpot wins, our team coordinates VIP in-person delivery of the winning physical ticket.";
      } else if (lower.includes('country') || lower.includes('jurisdiction') || lower.includes('legal')) {
        reply = "GlobalLotto operates legally by having authorized local agents physically purchase tickets within the host countries (such as the US and EU) where foreign nationals are legally permitted to hold and win.";
      } else if (lower.includes('quick pick') || lower.includes('pick')) {
        reply = "Quick Pick uses a cryptographically validated random number generator matching the exact rules of the selected lottery game, guaranteeing no duplicates.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 bg-[#07132b] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">GlobalLotto Support</h3>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Agents Online 24/7
            </span>
          </div>
        </div>
        <button
          onClick={() => setLiveChatOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-950">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              m.sender === 'bot' ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-white'
            }`}>
              {m.sender === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            <div className={`max-w-[80%] rounded-xl p-3 ${
              m.sender === 'bot' 
                ? 'bg-slate-900 border border-slate-800 text-slate-200' 
                : 'bg-amber-400 text-slate-950 font-medium'
            }`}>
              <p className="leading-relaxed">{m.text}</p>
              <span className={`text-[9px] block mt-1 ${m.sender === 'bot' ? 'text-slate-500' : 'text-slate-800'}`}>
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {/* Quick Prompts */}
        <div className="pt-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1.5">Suggested Questions:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2 py-1 rounded-lg text-left transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <form 
        onSubmit={e => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-[#07132b] border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-2 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
