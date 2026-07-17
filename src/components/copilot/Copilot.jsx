import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import FloatingButton from './FloatingButton';
import ChatWindow from './ChatWindow';
import { useGemini } from '../../hooks/useGemini';
import { useFarm } from '../../context/FarmContext';

export const Copilot = () => {
  const { activeFarm, computedMetrics } = useFarm();
  const { messages, isLoading, askQuestion, clearChat, stopSpeech } = useGemini();

  // Load state from localStorage
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem('agritwin_copilot_is_open') === 'true';
  });

  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem('agritwin_copilot_voice_enabled') !== 'false';
  });

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('agritwin_copilot_language') || 'en';
  });

  const [unreadCount, setUnreadCount] = useState(0);

  // Sync state modifications to localStorage
  const toggleOpen = (openState) => {
    setIsOpen(openState);
    localStorage.setItem('agritwin_copilot_is_open', openState ? 'true' : 'false');
  };

  const handleToggleVoice = () => {
    const nextVal = !voiceEnabled;
    setVoiceEnabled(nextVal);
    localStorage.setItem('agritwin_copilot_voice_enabled', nextVal ? 'true' : 'false');
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem('agritwin_copilot_language', lang);
    clearChat(lang); // Reset welcome message in target language
  };

  const handleSendMessage = (text) => {
    askQuestion(text, selectedLanguage, activeFarm, computedMetrics, voiceEnabled);
  };

  const handleClearChat = () => {
    clearChat(selectedLanguage);
  };

  const handleMinimize = () => {
    toggleOpen(false);
  };

  const handleClose = () => {
    toggleOpen(false);
  };

  // Manage unread message badge counts
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.sender === 'ai') {
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const renderContent = () => {
    return (
      <>
        {/* Chat Window Panel */}
        {isOpen && (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onMinimize={handleMinimize}
            onClose={handleClose}
            voiceEnabled={voiceEnabled}
            onToggleVoice={handleToggleVoice}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            onClearChat={handleClearChat}
            onStopSpeaking={stopSpeech}
          />
        )}

        {/* Floating Action Button */}
        {!isOpen && (
          <FloatingButton
            onClick={() => toggleOpen(true)}
            unreadCount={unreadCount}
          />
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
