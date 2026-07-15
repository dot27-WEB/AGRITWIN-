import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Paperclip, X, Minus, ArrowLeft } from 'lucide-react';
import ChatMessage from './ChatMessage';

/**
 * ChatWindow component. Renders the custom premium chatbot window:
 * - Rounded corners (rounded-2xl), 420px width
 * - Glassmorphism style, modern shadows
 * - Solid Slate header (bg-slate-800) to guarantee rendering and high contrast
 * - Title, Back Arrow, and CLOSE controls
 * - Messages timeline with auto-scroll and typing indicator
 * - Quick suggestion chips (only place text in the input on click)
 * - Input row containing Send, disabled Mic, and disabled Attach buttons
 * - Fixed bottom-6 right-6 positioning and compact 540px height to prevent overlap with top headers
 */
export const ChatWindow = ({ 
  messages, 
  isLoading, 
  onSendMessage, 
  onMinimize 
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll chat feed to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const suggestionChips = [
    "Should I irrigate today?",
    "Show today's weather",
    "Recommend next crop",
    "Open Smart Irrigation",
    "Open Dashboard"
  ];

  // Places chip text inside input field without submitting
  const handleChipClick = (text) => {
    setInputValue(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[90vw] max-w-[420px] h-[540px] rounded-2xl bg-slate-950/85 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col animate-slide-up overflow-hidden text-left select-none">
      
      {/* Visual background ambient lights */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-farm-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Fixed Header at the top (h-[64px], z-[120]) */}
      <div className="absolute top-0 left-0 right-0 h-[64px] bg-slate-900 border-b border-white/10 px-5 flex items-center justify-between z-[120] text-white gap-2 select-none">
        {/* Left: Title & Subtitle */}
        <div className="flex flex-col justify-center min-w-0">
          <h4 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5 leading-tight">
            <span>🤖</span> AgriTwin AI Copilot
          </h4>
          <span className="text-[10px] text-slate-400 font-bold block tracking-wider mt-0.5 leading-none">
            Your Intelligent Farming Assistant
          </span>
        </div>
        
        {/* Right: Minimize & Close Buttons */}
        <div className="flex items-center gap-3 shrink-0 relative z-[130]">
          {/* Minimize Button */}
          <button
            type="button"
            onClick={onMinimize}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center active:scale-90"
            title="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          {/* Close Button */}
          <button
            type="button"
            onClick={onMinimize}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer flex items-center justify-center active:scale-90"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Feed Viewport starting below the 64px header */}
      <div className="flex-1 overflow-y-auto pt-[76px] pb-4 px-4 space-y-4 relative z-10 custom-scrollbar">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* AI Typing Animation */}
        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-farm-400 shrink-0">
              <span className="font-extrabold text-sm tracking-tighter">🤖</span>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-1.5">
              <span>AgriTwin is processing</span>
              <span className="flex items-center gap-0.5 mt-1">
                <span className="w-1.5 h-1.5 bg-farm-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-farm-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-farm-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="p-3.5 bg-slate-950/90 border-t border-white/5 relative z-10 shrink-0">
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
          Suggestions
        </span>
        <div className="flex flex-wrap gap-1.5 pr-1 max-h-[85px] overflow-y-auto">
          {suggestionChips.map((chip, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="text-[10px] px-3 py-1.5 rounded-full bg-slate-900/60 hover:bg-farm-500/10 hover:text-farm-400 border border-white/5 hover:border-farm-500/20 text-slate-400 transition-all font-semibold cursor-pointer active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input panel */}
      <form 
        onSubmit={handleSubmit}
        className="p-3.5 bg-slate-900/20 border-t border-white/5 flex items-center gap-2 relative z-10 shrink-0"
      >
        {/* Attach Button (Disabled) */}
        <button
          type="button"
          disabled
          className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 text-slate-600 cursor-not-allowed transition-all flex items-center justify-center shrink-0"
          title="Attachment (Disabled)"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Mic Button (Disabled) */}
        <button
          type="button"
          disabled
          className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 text-slate-600 cursor-not-allowed transition-all flex items-center justify-center shrink-0"
          title="Voice input (Disabled)"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Input box */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask AgriTwin AI..."
            disabled={isLoading}
            className="w-full pl-3 pr-3 py-2.5 rounded-xl text-xs text-slate-200 bg-slate-950/60 border border-white/5 focus:border-farm-500/50 focus:bg-slate-950/80 focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] outline-none transition-all disabled:opacity-50"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-br from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white shrink-0 active:scale-95 transition-all shadow-md shadow-farm-950/20 cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

export default ChatWindow;
