import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  time: string;
}

export const ConciergeChatModal: React.FC = () => {
  const { isConciergeChatOpen, setIsConciergeChatOpen, showToast } = useShop();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'concierge',
      text: 'Greetings Commander. I am Julian Vane, Senior Allocation Specialist for LBOSS Private Vault. How may I assist your 2027 procurement today?',
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isConciergeChatOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputVal,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputVal.toLowerCase();
    setInputVal('');

    setTimeout(() => {
      let reply = 'Your telemetry request has been recorded in our encrypted sovereign registry. A dedicated hardware specialist is prioritizing your allocation.';
      if (currentQuery.includes('watch') || currentQuery.includes('chrono') || currentQuery.includes('titanium')) {
        reply = 'The Apex Chrono X-1 currently has only 3 units reserved in our Swiss Geneva vault for Tier-1 armored dispatch. Would you like me to hold one under priority lock for 30 minutes?';
      } else if (currentQuery.includes('ship') || currentQuery.includes('transit') || currentQuery.includes('delivery')) {
        reply = 'All orders exceeding $500 include complimentary Armored Transit in a hermetically sealed aluminum flight case with dual-courier signature confirmation.';
      } else if (currentQuery.includes('size') || currentQuery.includes('wrist') || currentQuery.includes('48mm')) {
        reply = 'The 44mm caliber is ideal for 145-190mm wrists with ergonomic contoured lugs. The 48mm Commander Edition accommodates 170-225mm wrists with extra battery capacity.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: 'concierge',
          text: reply,
          time: 'Just now',
        },
      ]);
      showToast('Encrypted dispatch received from Concierge');
    }, 600);
  };

  const quickPrompts = [
    'Check Apex Chrono X-1 allocation',
    'How does Armored Delivery work?',
    'Explain the 5-Year Biometric Vault Warranty',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-lg bg-[#181b24] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 bg-[#10131b] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                alt="Concierge Julian Vane"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#f5b700]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDIEOcQlO7MAFsHFVwsqNDu-U2ZduVGbOiAcJLY07qqm2UzFYqOLx2HKP4sI_y69WFxgpQHeCcBsMucj2nPHrwdAUdrOapB88HPF3EnDyLH-kfd6T58stiq43CD6KANftMI98LJpO5iLQLKllsGEbzss-_VEaG_ZsXLjsHfvTKsOLpLsbRXW2rJXtm3CUYa0Z7tn7CBLC7vgoxBUVqSkjKDqiaRIkYfbt8xTotkTYBYz5ItF8zGwg31w"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#10131b]"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-['Sora'] text-sm text-[#e0e2ed] font-bold">Julian Vane</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#ffd88a] px-1.5 py-0.5 rounded bg-[#f5b700]/15">
                  SENIOR ALLOCATOR
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-xs text-[#9c8f78]">
                256-Bit Quantum Encrypted Link
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsConciergeChatOpen(false)}
            className="p-2 rounded-lg text-[#9c8f78] hover:text-[#e0e2ed] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close concierge channel"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#10131b]/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] ${
                m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`p-3 rounded-2xl font-['Manrope'] text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#f5b700] text-[#402d00] font-medium rounded-tr-none shadow-md'
                    : 'bg-[#1c1f28] text-[#e0e2ed] border border-white/5 rounded-tl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] mt-1 px-1">
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-2 bg-[#14171f] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInputVal(prompt);
              }}
              className="px-2.5 py-1 rounded-full bg-[#1c1f28] hover:bg-[#272a32] text-[#d4c5ac] hover:text-[#ffd88a] font-['JetBrains_Mono'] text-xs whitespace-nowrap border border-white/5 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSend} className="p-3 bg-[#181b24] border-t border-white/5 flex items-center gap-2">
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type encrypted message to specialist..."
            className="flex-1 bg-[#10131b] border border-white/10 rounded-xl px-4 py-2.5 font-['Manrope'] text-sm text-[#e0e2ed] placeholder:text-[#9c8f78] focus:outline-none focus:ring-1 focus:ring-[#f5b700]"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-[#f5b700] text-[#402d00] flex items-center justify-center hover:bg-[#ffd88a] transition-colors cursor-pointer shrink-0 font-bold"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
