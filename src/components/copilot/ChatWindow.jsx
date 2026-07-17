import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export const ChatWindow = ({
  messages,
  isLoading,
  onSendMessage,
  onMinimize,
  onClose,
  voiceEnabled,
  onToggleVoice,
  selectedLanguage,
  onLanguageChange,
  onClearChat,
  onStopSpeaking
}) => {
  const [position, setPosition] = useState(() => {
    try {
      const stored = localStorage.getItem('agritwin_copilot_position');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return { x: window.innerWidth - 440, y: window.innerHeight - 620 };
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  
  const listRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setPosition(prev => {
          const x = Math.max(0, Math.min(window.innerWidth - 420, prev.x));
          const y = Math.max(0, Math.min(window.innerHeight - 580, prev.y));
          return { x, y };
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e) => {
    if (isMobile) return;
    if (e.button !== 0 || e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) return;
    
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...position };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 420, startPos.current.x + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 580, startPos.current.y + dy));
    
    const newPos = { x: newX, y: newY };
    setPosition(newPos);
    localStorage.setItem('agritwin_copilot_position', JSON.stringify(newPos));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 150);
  };

  const handleSpeechResult = (text) => {
    if (text && text.trim()) {
      onSendMessage(text.trim());
    }
  };

  const windowStyle = isMobile
    ? { bottom: 0, right: 0, left: 0, height: '80vh', width: '100%' }
    : { left: `${position.x}px`, top: `${position.y}px`, height: '580px', width: '420px' };

  return (
    <div
      style={windowStyle}
      className="fixed z-[100] bg-slate-950/85 border border-white/10 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden text-left animate-slide-up select-none transition-all duration-75"
    >
      {/* Background ambient light guides */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header component */}
      <ChatHeader
        onMinimize={onMinimize}
        onClose={onClose}
        voiceEnabled={voiceEnabled}
        onToggleVoice={onToggleVoice}
        onSpeechResult={handleSpeechResult}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
        onClearChat={onClearChat}
        onMouseDown={handleMouseDown}
        onStopSpeaking={onStopSpeaking}
      />

      {/* Messages Scroll Area */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 custom-scrollbar"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* AI Loading state */}
        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-farm-400 shrink-0">
              <span className="font-extrabold text-sm tracking-tighter">🤖</span>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">AI is thinking</span>
              <span className="flex items-center gap-0.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll To Bottom Button */}
      {showScrollBtn && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-[230px] right-6 p-2 bg-slate-900/90 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-950 text-slate-300 hover:text-emerald-400 rounded-full transition-all shadow-xl z-20 cursor-pointer active:scale-90"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      )}

      {/* Chat Input panel */}
      <ChatInput
        onSend={onSendMessage}
        selectedLanguage={selectedLanguage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatWindow;
