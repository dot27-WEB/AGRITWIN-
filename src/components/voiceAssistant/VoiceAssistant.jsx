import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../hooks/useVoice';
import { useGemini } from '../../hooks/useGemini';
import { useFarm } from '../../context/FarmContext';
import { 
  Mic, MicOff, X, Send, Trash2, Bot, User, 
  HelpCircle, Volume2, ArrowRight, CornerDownLeft 
} from 'lucide-react';

export const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { language, t } = useLanguage();
  const { activeFarm, computedMetrics } = useFarm();
  const messagesEndRef = useRef(null);

  // Load the AI chatbot state
  const { messages, isLoading, askQuestion, clearChat } = useGemini();

  // Load speech hooks
  const {
    isListening,
    transcript,
    recognitionSupported,
    startListening,
    stopListening,
    speak
  } = useVoice(language);

  // Auto-scroll chat feed to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Effect to process voice transcript once spoken
  useEffect(() => {
    if (transcript) {
      // Check if it was a page navigation command (already handled by navigate in useVoice)
      const navTriggers = [
        'dashboard', 'डैशबोर्ड', 'డ్యాష్‌బోర్డ్',
        'crop', 'advisor', 'recommend', 'फसल', 'పంట',
        'disease', 'blight', 'diagnose', 'रोग', 'ఆకు', 'రోగం',
        'irrigation', 'water', 'సిंचाई', 'నీరు',
        'market', 'price', 'rates', 'mandi', 'दर', 'ధర',
        'scheme', 'government', 'योजना', 'పథకాలు',
        'calendar', 'timeline', 'క్యాలెండర్',
        'profile', 'settings', 'ప్రొఫైల్'
      ];
      
      const isNav = navTriggers.some(trigger => transcript.toLowerCase().includes(trigger));
      
      if (!isNav) {
        handleSendQuery(transcript);
      }
    }
  }, [transcript]);

  const handleSendQuery = async (queryText) => {
    if (!queryText.trim()) return;
    
    // Send to Chatbot passing farm details for context-aware agricultural replies
    const answerObj = await askQuestion(queryText, language, activeFarm, computedMetrics);
    
    if (answerObj) {
      const answerSpoken = answerObj[language] || answerObj['en'];
      speak(answerSpoken);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleSendQuery(inputValue);
    setInputValue('');
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const sampleQuestions = {
    en: [
      { label: "Pest control tips", query: "How to control leaf pests organically?" },
      { label: "Fertilizer dosage", query: "What fertilizers are best for loamy soil?" },
      { label: "Water conservation", query: "How to save water during irrigation?" }
    ],
    te: [
      { label: "తెగుళ్ల నివారణ", query: "తెగుళ్లను సహజంగా ఎలా నివారించాలి?" },
      { label: "ఎరువుల యాజమాన్యం", query: "నేల సారవంతం పెంచడానికి ఏ ఎరువులు వాడాలి?" },
      { label: "నీటి పొదుపు", query: "డ్రిప్ సిస్టమ్ వల్ల ఉపయోగాలు ఏంటి?" }
    ],
    hi: [
      { label: "कीट नियंत्रण", query: "जैविक रूप से कीड़ों को कैसे नियंत्रित करें?" },
      { label: "उर्वरक उपयोग", query: "दोमट मिट्टी के लिए कौन सी खाद सर्वोत्तम है?" },
      { label: "जल संरक्षण", query: "सिंचाई में पानी की बचत कैसे करें?" }
    ]
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'w-80 sm:w-96 h-[500px]' : 'w-14 h-14'}`}>
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-farm-500 to-emerald-600 flex items-center justify-center text-white shadow-xl shadow-farm-900/30 hover:scale-105 hover:shadow-glow-green hover:brightness-110 active:scale-95 transition-all duration-300 relative group animate-float-slow"
        >
          {isListening ? (
            <span className="absolute inset-0 rounded-full bg-farm-400/30 animate-ping font-bold"></span>
          ) : null}
          <Bot className="w-6 h-6 animate-pulse-slow" />
          <span className="absolute right-16 px-3 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-[10px] font-bold tracking-wider text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl">
            AI Agri-Chatbot
          </span>
        </button>
      )}

      {/* Redesigned AI Chatbot Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 rounded-3xl bg-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col h-[500px] animate-slide-up relative overflow-hidden">
          
          {/* Backdrop lights */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-farm-500/10 rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />

          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-slate-900/40 relative z-10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-farm-500/10 border border-farm-500/20 flex items-center justify-center text-farm-400">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  AgriTwin AI Chatbot
                </h4>
                <span className="text-[9px] text-farm-400 font-bold block uppercase tracking-widest mt-0.5">
                  Speaking: {language === 'te' ? 'తెలుగు' : (language === 'hi' ? 'हिन्दी' : 'English')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative z-20 pointer-events-auto">
              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-rose-400 transition-colors"
                title="Wipe Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id="chatbot-close-btn"
                onClick={() => {
                  stopListening();
                  setIsOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[10px] tracking-wider uppercase transition-all flex items-center gap-1 active:scale-95 shadow-md pointer-events-auto cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Close
              </button>
            </div>
          </div>

          {/* Message Feed Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              const textContent = msg.text[language] || msg.text['en'];
              return (
                <div key={msg.id} className={`flex items-start gap-2.5 ${!isAi ? 'flex-row-reverse' : ''}`}>
                  
                  {/* Sender Icon */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs
                    ${isAi 
                      ? 'bg-slate-900 border-white/5 text-farm-400' 
                      : 'bg-farm-600 border-farm-500 text-white'
                    }`}
                  >
                    {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  {/* Speech Bubble */}
                  <div className={`max-w-[75%] rounded-2xl p-3.5 text-[11px] font-semibold leading-relaxed shadow-md
                    ${isAi 
                      ? 'bg-slate-900/80 border border-white/5 text-slate-300' 
                      : 'bg-farm-600 text-white rounded-tr-none'
                    }`}
                  >
                    {textContent}
                    
                    {isAi && (
                      <button 
                        type="button"
                        onClick={() => speak(textContent)}
                        className="mt-2 text-farm-400 hover:text-farm-300 flex items-center gap-1 font-bold text-[9px] uppercase tracking-wider block"
                      >
                        <Volume2 className="w-3 h-3" /> Replay Voice
                      </button>
                    )}
                  </div>

                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-farm-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl px-4 py-3 text-[11px] text-slate-500 italic font-semibold">
                  AI is analyzing farming records...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Queries */}
          <div className="p-3 bg-slate-950 border-t border-white/5 relative z-10 shrink-0">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Ask Agricultural Questions
            </span>
            <div className="flex flex-wrap gap-1">
              {(sampleQuestions[language] || sampleQuestions['en']).map((sq, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSendQuery(sq.query)}
                  className="text-[9px] px-2.5 py-1 rounded-full bg-slate-900/60 hover:bg-farm-500/10 hover:text-farm-400 border border-white/5 hover:border-farm-500/20 text-slate-400 transition-colors font-medium cursor-pointer"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Form Input Panel */}
          <form 
            onSubmit={handleFormSubmit}
            className="p-3 bg-slate-900/40 border-t border-white/5 flex items-center gap-2 relative z-10 shrink-0"
          >
            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-2.5 rounded-xl border transition-all shrink-0 active:scale-95 cursor-pointer
                ${isListening 
                  ? 'bg-rose-500 border-rose-600 text-white animate-pulse' 
                  : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'
                }`}
              title="Speak Question"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Input Box */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? "Listening..." : "Ask a farming query..."}
                disabled={isListening}
                className="glass-input w-full pl-3 pr-8 py-2.5 rounded-xl text-xs text-slate-200"
              />
              <CornerDownLeft className="w-3.5 h-3.5 text-slate-600 absolute right-3 top-3" />
            </div>

            {/* Send Submit Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 rounded-xl bg-farm-600 hover:bg-farm-500 disabled:opacity-50 text-white shrink-0 active:scale-95 transition-all shadow-md shadow-farm-950/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};

export default VoiceAssistant;
