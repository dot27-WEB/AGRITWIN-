import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bot } from 'lucide-react';
import ChatWindow from './ChatWindow';

const INITIAL_WELCOME_MESSAGE = `Hello 👋

Welcome to AgriTwin AI.

I am your farming assistant.

I can help you with:
• Weather
• Smart Irrigation
• Farm Intelligence
• Crop Guidance

Ask me anything.`;

/**
 * Copilot component. Floating action button and container logic for Chat UI mockup.
 * Renders the button and window inside a React Portal to prevent layout conflicts and clipping.
 */
export const Copilot = () => {
  // Synchronously initialize open/closed state from localStorage
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem('agritwin_copilot_is_open') === 'true';
  });

  // Synchronously initialize chat messages from localStorage
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('agritwin_chat_ui_history');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load initial history:', e);
    }
    // Default welcome message
    return [{
      id: 'welcome_init',
      sender: 'ai',
      text: INITIAL_WELCOME_MESSAGE,
      timestamp: new Date().toISOString()
    }];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Synchronize isOpen state changes with localStorage
  const toggleOpen = (openState) => {
    setIsOpen(openState);
    localStorage.setItem('agritwin_copilot_is_open', openState ? 'true' : 'false');
  };

  // Synchronize messages changes with localStorage
  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    try {
      localStorage.setItem('agritwin_chat_ui_history', JSON.stringify(newMessages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  };

  const handleSendMessage = (text) => {
    const userMsg = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    const updatedWithUser = [...messages, userMsg];
    saveMessages(updatedWithUser);
    setIsLoading(true);

    // Simulate typing/processing delay for visual premium feel
    setTimeout(() => {
      const aiMsg = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: "AI processing will be available in the next phase.",
        timestamp: new Date().toISOString()
      };

      saveMessages([...updatedWithUser, aiMsg]);
      setIsLoading(false);
    }, 600);
  };

  const handleMinimize = () => {
    toggleOpen(false);
  };

  const renderContent = () => {
    return (
      <>
        {/* Premium Chat Window */}
        {isOpen && (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onMinimize={handleMinimize}
          />
        )}

        {/* Floating Circular Action Button */}
        {!isOpen && (
          <button
            onClick={() => toggleOpen(true)}
            className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-gradient-to-br from-farm-500 to-emerald-600 flex items-center justify-center text-white shadow-xl shadow-farm-900/30 hover:scale-105 hover:shadow-glow-green hover:brightness-110 active:scale-95 transition-all duration-300 relative group cursor-pointer border border-white/10 select-none"
            title="AgriTwin AI"
          >
            <Bot className="w-6 h-6 animate-pulse-slow" />
            
            {/* Tooltip */}
            <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-bold tracking-wider text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-2xl">
              AgriTwin AI
            </span>
          </button>
        )}
      </>
    );
  };

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  return createPortal(renderContent(), document.body);
};

export default Copilot;
