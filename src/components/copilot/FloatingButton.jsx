import React from 'react';
import { Bot } from 'lucide-react';

export const FloatingButton = ({ onClick, unreadCount }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-xl shadow-emerald-950/30 hover:scale-110 active:scale-95 transition-all duration-300 group border border-white/15 animate-bounce-slow"
      title="AgriTwin AI"
    >
      <div className="relative">
        <Bot className="w-6 h-6 animate-pulse-slow" />
        
        {/* Soft Glow */}
        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-pulse">
          {unreadCount}
        </span>
      )}

      {/* Tooltip */}
      <span className="absolute right-16 px-3.5 py-2 rounded-xl bg-slate-950/95 border border-white/10 text-[10px] font-black tracking-widest text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl scale-95 group-hover:scale-100">
        AGRITWIN AI
      </span>
    </button>
  );
};

export default FloatingButton;
