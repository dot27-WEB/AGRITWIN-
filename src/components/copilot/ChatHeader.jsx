import React from 'react';
import { ArrowLeft, Minus, X, Trash2 } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import VoiceControls from './VoiceControls';

export const ChatHeader = ({
  onMinimize,
  onClose,
  voiceEnabled,
  onToggleVoice,
  onSpeechResult,
  selectedLanguage,
  onLanguageChange,
  onClearChat,
  onMouseDown,
  onStopSpeaking
}) => {
  return (
    <div className="flex flex-col bg-slate-900 border-b border-white/10 relative z-[120] text-white shrink-0 select-none">
      
      {/* Draggable Row */}
      <div 
        onMouseDown={onMouseDown}
        className="h-[56px] px-4 flex items-center justify-between cursor-move active:cursor-grabbing"
      >
        {/* Left: Back & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onMinimize}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center active:scale-95"
            title="Back"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          
          <div className="flex flex-col justify-center min-w-0">
            <h4 className="text-xs font-black text-white tracking-wide flex items-center gap-1.5 leading-tight">
              🤖 AgriTwin AI
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-2 relative z-[130]">
          <button
            type="button"
            onClick={onMinimize}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center active:scale-90"
            title="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer flex items-center justify-center active:scale-90"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Row */}
      <div className="h-[44px] bg-slate-950/60 px-4 flex items-center justify-between border-t border-white/5 select-none gap-2">
        <LanguageSelector selected={selectedLanguage} onChange={onLanguageChange} />
        
        <div className="flex items-center gap-2">
          <VoiceControls 
            voiceEnabled={voiceEnabled} 
            onToggleVoice={onToggleVoice} 
            onSpeechResult={onSpeechResult}
            selectedLanguage={selectedLanguage}
            onStopSpeaking={onStopSpeaking}
          />
          
          <button
            type="button"
            onClick={onClearChat}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatHeader;
