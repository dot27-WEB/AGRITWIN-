import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

const SUGGESTIONS = {
  en: [
    "Should I irrigate today?",
    "Show today's weather",
    "Recommend next crop",
    "Tell me about organic fertilizers",
    "How to manage pest attacks?"
  ],
  te: [
    "నేడు నేను నీరు పెట్టాలా?",
    "ఈ రోజు వాతావరణం చూపించు",
    "తదుపరి పంటను సిఫార్సు చేయి",
    "సేంద్రీయ ఎరువుల గురించి చెప్పు",
    "తెగుళ్ళ నివారణ ఎలా?"
  ],
  hi: [
    "क्या मुझे आज सिंचाई करनी चाहिए?",
    "आज का मौसम दिखाएं",
    "अगली फसल की सिफारिश करें",
    "जैविक खाद के बारे में बताएं",
    "कीट हमलों का प्रबंधन कैसे करें?"
  ],
  ta: [
    "நான் இன்று பாசனம் செய்ய வேண்டுமா?",
    "இன்றைய வானிலை காட்டு",
    "அடுத்த பயிரை பரிந்துரைக்கவும்",
    "இயற்கை உரங்கள் பற்றி கூறு",
    "பூச்சி தாக்குதலை தடுப்பது எப்படி?"
  ],
  kn: [
    "ನಾನು ಇಂದು ನೀರುಣಿಸಬೇಕೇ?",
    "ಇಂದಿನ ಹವಾಮಾನ ತೋರಿಸು",
    "ಮುಂದಿನ ಬೆಳೆ ಶಿಫಾರಸು ಮಾಡಿ",
    "ಸಾವಯವ ಗೊಬ್ಬರಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ",
    "ಕೀಟ ಬಾಧೆ ತಡೆಗಟ್ಟುವುದು ಹೇಗೆ?"
  ],
  ml: [
    "ഞാൻ ഇന്ന് നനയ്ക്കണമോ?",
    "ഇന്നത്തെ കാലാവസ്ഥ കാണിക്കുക",
    "അടുത്ത വിള ശുപാർശ ചെയ്യുക",
    "ജൈവവളങ്ങളെക്കുറിച്ച് പറയുക",
    "കീടനാശിനി പ്രയോഗം എങ്ങനെ?"
  ]
};

export const ChatInput = ({ onSend, selectedLanguage, isLoading }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue('');
  };

  const chips = SUGGESTIONS[selectedLanguage] || SUGGESTIONS.en;

  return (
    <div className="flex flex-col bg-slate-950/90 border-t border-white/5 relative z-10 shrink-0">
      
      {/* Suggestions Slider */}
      <div className="p-3 border-b border-white/5">
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
          Suggestions
        </span>
        <div className="flex flex-wrap gap-1.5 pr-1 max-h-[85px] overflow-y-auto custom-scrollbar">
          {chips.map((chip, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setValue(chip)}
              className="text-[10px] px-3 py-1.5 rounded-full bg-slate-900/60 hover:bg-emerald-500/10 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/20 text-slate-300 transition-all font-semibold cursor-pointer active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input panel */}
      <form 
        onSubmit={handleSubmit}
        className="p-3.5 bg-slate-900/20 flex items-center gap-2"
      >
        <button
          type="button"
          disabled
          className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 text-slate-700 cursor-not-allowed transition-all flex items-center justify-center shrink-0"
          title="Attachment (Disabled)"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask anything about your farm..."
            disabled={isLoading}
            className="w-full pl-3 pr-3 py-2.5 rounded-xl text-xs text-slate-200 bg-slate-950/60 border border-white/5 focus:border-emerald-500/50 focus:bg-slate-950/80 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] outline-none transition-all disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-40 disabled:pointer-events-none text-white shrink-0 active:scale-95 transition-all shadow-md shadow-emerald-950/20 cursor-pointer flex items-center justify-center border border-white/10"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
