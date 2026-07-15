import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

/**
 * VoiceInput component. Handles browser Speech Recognition API,
 * converting speech to text and notifying the parent chat window.
 */
export const VoiceInput = ({ onTranscript, onListeningChange, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-IN'; // Standard english locale for Indian farmers

    rec.onstart = () => {
      setIsListening(true);
      if (onListeningChange) onListeningChange(true);
    };

    rec.onresult = (event) => {
      const result = event.results[0][0].transcript;
      if (onTranscript) {
        onTranscript(result);
      }
    };

    rec.onerror = (e) => {
      console.warn("Speech recognition error:", e);
      setIsListening(false);
      if (onListeningChange) onListeningChange(false);
      
      let errMsg = "Speech recognition error occurred.";
      if (e.error === 'not-allowed') {
        errMsg = "Microphone access denied. Please check permissions.";
      } else if (e.error === 'no-speech') {
        errMsg = "No speech detected. Please try speaking again.";
      }
      if (onError) onError(errMsg);
    };

    rec.onend = () => {
      setIsListening(false);
      if (onListeningChange) onListeningChange(false);
    };

    recognitionRef.current = rec;
  }, [onTranscript, onListeningChange, onError]);

  const handleMicToggle = () => {
    if (!supported) {
      if (onError) {
        onError("Voice input is not supported by this browser.");
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      } catch (e) {
        console.error("Speech recognition start failed:", e);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleMicToggle}
      className={`p-2.5 rounded-xl border transition-all shrink-0 active:scale-95 cursor-pointer flex items-center justify-center
        ${isListening 
          ? 'bg-rose-500 border-rose-600 text-white animate-pulse' 
          : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white hover:border-slate-800'
        } ${!supported ? 'opacity-60' : ''}`}
      title={supported ? (isListening ? "Stop listening" : "Speak question") : "Voice input not supported"}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
};

export default VoiceInput;
