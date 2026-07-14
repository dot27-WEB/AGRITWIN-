import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../hooks/useVoice';
import { useGemini, detectLanguage } from '../../hooks/useGemini';
import { useFarm } from '../../context/FarmContext';
import { 
  Mic, MicOff, X, Send, Trash2, Bot, User, 
  HelpCircle, Volume2, VolumeX, Globe, ArrowRight, CornerDownLeft 
} from 'lucide-react';

export const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [copilotLang, setCopilotLang] = useState('auto');
  const { language, t } = useLanguage();
  const { activeFarm, computedMetrics } = useFarm();
  const messagesEndRef = useRef(null);

  // Load the AI chatbot state
  const { messages, isLoading, askQuestion, clearChat } = useGemini();

  // Load speech hooks passing selected language
  const {
    isListening,
    transcript,
    recognitionSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  } = useVoice(copilotLang);

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
      // Check if it was a page navigation command
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
    
    // Resolve the query language
    const resolved = copilotLang === 'auto' ? detectLanguage(queryText) : copilotLang;
    
    // Send to Chatbot passing resolved language and farm context
    const answerObj = await askQuestion(queryText, resolved, activeFarm, computedMetrics);
    
    if (answerObj) {
      const answerSpoken = answerObj[resolved] || answerObj['en'];
      speak(answerSpoken, resolved);
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
    ],
    ta: [
      { label: "பூச்சி கட்டுப்பாடு", query: "பூச்சிகளை எவ்வாறு கட்டுப்படுத்துவது?" },
      { label: "உர மேலாண்மை", query: "மண் வளத்திற்கு என்ன உரம் பயன்படுத்த வேண்டும்?" },
      { label: "நீர் சேமிப்பு", query: "நீர் பாசனத்தை எவ்வாறு சேமிப்பது?" }
    ],
    kn: [
      { label: "ಕೀಟ ನಿಯಂತ್ರಣ", query: "ಕೀಟಗಳನ್ನು ಹೇಗೆ ನಿಯಂತ್ರಿಸುವುದು?" },
      { label: "ಗೊಬ್ಬರ ಬಳಕೆ", query: "ಮಣ್ಣಿನ ಫಲವತ್ತತೆಗೆ ಯಾವ ಗೊಬ್ಬರ ಬಳಸಬೇಕು?" },
      { label: "ನೀರು ಉಳಿತಾಯ", query: "ನೀರಾವರಿಯಲ್ಲಿ ನೀರು ಉಳಿಸುವುದು ಹೇಗೆ?" }
    ],
    ml: [
      { label: "കീട നിയന്ത്രണം", query: "കീടങ്ങളെ എങ്ങനെ നിയന്ത്രിക്കാം?" },
      { label: "വളപ്രയോഗം", query: "മൺഫലഭൂയിഷ്ഠതയ്ക്ക് ഏത് വളമാണ് നല്ലത്?" },
      { label: "ജല സംരക്ഷണം", query: "നനയ്ക്കുമ്പോൾ വെള്ളം എങ്ങനെ ലാഭിക്കാം?" }
    ],
    mr: [
      { label: "कीड नियंत्रण", query: "कीड नियंत्रण कसे करावे?" },
      { label: "खत व्यवस्थापन", query: "जमिनीची सुपीकता वाढवण्यासाठी कोणते खत वापरावे?" },
      { label: "पाणी बचत", query: "सिंचनामध्ये पाण्याची बचत कशी करावी?" }
    ],
    bn: [
      { label: "পোকামাকড় দমন", query: "জৈব উপায়ে কীভাবে পোকা দমন করা যায়?" },
      { label: "সার প্রয়োগ", query: "মাটির উর্বরতা বাড়াতে কী সার দেব?" },
      { label: "পানি সাশ্রয়", query: "সেচ কাজে পানি সাশ্রয় কীভাবে করব?" }
    ],
    gu: [
      { label: "જંતુ નિયંત્રણ", query: "જંતુ નિયંત્રણ કેવી રીતે કરવું?" },
      { label: "ખાતર વ્યવસ્થાપન", query: "જમીનની ફળદ્રુપતા માટે કયું ખાતર વાપરવું?" },
      { label: "પાણી બચત", query: "સિંચાઈમાં પાણીની બચત કેવી રીતે કરવી?" }
    ],
    pa: [
      { label: "ਕੀਟ ਰੋਕਥਾਮ", query: "ਕੀੜਿਆਂ ਦੀ ਰੋਕਥਾਮ ਕਿਵੇਂ ਕਰੀਏ?" },
      { label: "ਖਾਦ ਪ੍ਰਬੰਧਨ", query: "ਮਿੱਟੀ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਲਈ ਕਿਹੜੀ ਖਾਦ ਪਾਈਏ?" },
      { label: "ਪਾਣੀ ਦੀ ਬਚਤ", query: "ਸਿੰਚਾਈ ਦੌਰਾਨ ਪਾਣੀ ਦੀ ਬਚਤ ਕਿਵੇਂ ਕਰੀਏ?" }
    ]
  };

  const activeFaqLang = copilotLang === 'auto' ? language : copilotLang;

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
        <div className="w-80 sm:w-96 rounded-3xl bg-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col h-[500px] animate-slide-up relative overflow-hidden text-left">
          
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
                  Multilingual Copilot
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative z-20 pointer-events-auto">
              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Wipe Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id="chatbot-close-btn"
                onClick={() => {
                  stopSpeaking();
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

          {/* Language Selector Bar */}
          <div className="bg-slate-950/80 border-b border-white/5 px-4 py-2 flex items-center justify-between relative z-10 shrink-0 text-[10px]">
            <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 text-farm-500" /> Language:
            </span>
            <select
              value={copilotLang}
              onChange={(e) => {
                setCopilotLang(e.target.value);
              }}
              className="bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-slate-300 font-bold tracking-wide focus:outline-none focus:ring-1 focus:ring-farm-500 cursor-pointer"
            >
              <option value="auto">🌐 Auto Detect</option>
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>

          {/* Message Feed Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              // Fallback lookup language
              const activeMsgLang = msg.resolvedLang || language || 'en';
              const textContent = msg.text[activeMsgLang] || msg.text['en'] || '';

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
                  <div className={`max-w-[75%] rounded-2xl p-3.5 text-[11px] font-semibold leading-relaxed shadow-md text-left
                    ${isAi 
                      ? 'bg-slate-900/80 border border-white/5 text-slate-300' 
                      : 'bg-farm-600 text-white rounded-tr-none'
                    }`}
                  >
                    {textContent}
                    
                    {isAi && (
                      <div className="mt-2.5 flex items-center gap-3 border-t border-white/5 pt-2">
                        <button 
                          type="button"
                          onClick={() => speak(textContent, activeMsgLang)}
                          className="text-farm-400 hover:text-farm-300 flex items-center gap-1 font-bold text-[9px] uppercase tracking-wider cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> Listen
                        </button>
                        <button 
                          type="button"
                          onClick={stopSpeaking}
                          className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold text-[9px] uppercase tracking-wider cursor-pointer"
                        >
                          <VolumeX className="w-3.5 h-3.5" /> Stop
                        </button>
                      </div>
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
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl px-4 py-3 text-[11px] text-slate-500 italic font-semibold text-left">
                  AI is analyzing farming records...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Queries */}
          <div className="p-3 bg-slate-950 border-t border-white/5 relative z-10 shrink-0 text-left">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Ask Agricultural Questions
            </span>
            <div className="flex flex-wrap gap-1">
              {(sampleQuestions[activeFaqLang] || sampleQuestions['en']).map((sq, idx) => (
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
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
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
