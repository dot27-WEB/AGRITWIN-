import React, { useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';

export const MessageBubble = ({ message }) => {
  const isAi = message.sender === 'ai';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex items-start gap-3.5 ${!isAi ? 'flex-row-reverse' : ''} animate-fade-in group`}>
      
      {/* Avatar Container */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border text-xs shadow-md transition-all duration-300
        ${isAi 
          ? 'bg-slate-900 border-white/10 text-farm-400' 
          : 'bg-gradient-to-br from-emerald-600 to-green-600 border-emerald-500 text-white'
        }`}
      >
        {isAi ? <Bot className="w-5 h-5 animate-pulse-slow" /> : <User className="w-5 h-5" />}
      </div>

      {/* Bubble + Details */}
      <div className="flex flex-col max-w-[75%] gap-1.5">
        <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg transition-all duration-300 relative text-left
          ${isAi 
            ? 'bg-slate-900/70 border border-white/5 text-slate-300 rounded-tl-sm backdrop-blur-md' 
            : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-tr-sm'
          }`}
        >
          {/* Text content */}
          <div className="whitespace-pre-line font-medium break-words">{message.text}</div>
          
          {/* Action Overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleCopy}
              className="p-1 rounded-lg bg-slate-950/80 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Copy Message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Timestamp */}
        {formattedTime && (
          <span className={`text-[9px] text-slate-500 font-bold px-1.5 ${!isAi ? 'text-right' : 'text-left'}`}>
            {formattedTime}
          </span>
        )}
      </div>

    </div>
  );
};

export default MessageBubble;
