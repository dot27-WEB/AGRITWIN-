import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Square } from 'lucide-react';

export const VoiceControls = ({ 
  voiceEnabled, 
  onToggleVoice, 
  onSpeechResult,
  selectedLanguage,
  onStopSpeaking
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        if (onSpeechResult) onSpeechResult(text);
      };
      rec.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
      };
      setRecognition(rec);
    }
  }, [onSpeechResult]);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      const langLocales = {
        en: 'en-US',
        te: 'te-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
        ml: 'ml-IN'
      };
      recognition.lang = langLocales[selectedLanguage] || 'en-US';
      try {
        recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStopSpeaking = () => {
    if (onStopSpeaking) {
      onStopSpeaking();
    }
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Speech-to-Text Microphone */}
      {recognition && (
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95
            ${isListening 
              ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 animate-pulse' 
              : 'bg-slate-900 border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400'
            }`}
          title={isListening ? "Listening... Click to Stop" : "Voice Input (Speech to Text)"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      )}

      {/* Voice Synthesis Audio Toggle */}
      <button
        type="button"
        onClick={onToggleVoice}
        className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95
          ${voiceEnabled 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-slate-900 border-white/10 text-slate-500 hover:text-slate-400'
          }`}
        title={voiceEnabled ? "Mute Voice Answers" : "Enable Voice Answers"}
      >
        {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Stop Speaking Button */}
      <button
        type="button"
        onClick={handleStopSpeaking}
        className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95"
        title="Stop Speech Output"
      >
        <Square className="w-4 h-4 fill-current" />
      </button>
    </div>
  );
};

export default VoiceControls;
