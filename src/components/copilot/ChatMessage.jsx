import React from 'react';
import { Bot, User } from 'lucide-react';

export const ChatMessage = ({ message }) => {
  const isAi = message.sender === 'ai';
  const formattedTime = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '';

  return (
    <div className={`flex items-start gap-3.5 ${!isAi ? 'flex-row-reverse' : ''} animate-fade-in`}>
      
      {/* Avatar Container */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border text-xs shadow-md transition-all duration-300
        ${isAi 
          ? 'bg-slate-900 border-white/10 text-farm-400' 
          : 'bg-gradient-to-br from-farm-600 to-emerald-600 border-farm-500 text-white'
        }`}
      >
        {isAi ? <Bot className="w-5 h-5 animate-pulse-slow" /> : <User className="w-5 h-5" />}
      </div>

      {/* Message Bubble */}
      <div className="flex flex-col max-w-[75%] gap-1">
        <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg transition-all duration-300 relative text-left
          ${isAi 
            ? 'bg-slate-900/70 border border-white/5 text-slate-300 rounded-tl-sm backdrop-blur-md' 
            : 'bg-gradient-to-r from-farm-600 to-emerald-600 text-white rounded-tr-sm'
          }`}
        >
          {/* Render text with line breaks preserved */}
          <div className="whitespace-pre-line font-medium">{message.text}</div>
        </div>
        
        {/* Timestamp */}
        {formattedTime && (
          <span className={`text-[9px] text-slate-500 font-bold px-1 ${!isAi ? 'text-right' : 'text-left'}`}>
            {formattedTime}
          </span>
        )}
      </div>

    </div>
  );
};

export default ChatMessage;
