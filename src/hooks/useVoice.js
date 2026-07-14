import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useVoice = (language) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const localeMap = {
    en: 'en-IN',
    te: 'te-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    pa: 'pa-IN'
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    
    // Set appropriate STT recognition locale
    const activeLang = language === 'auto' ? 'en' : language;
    rec.lang = localeMap[activeLang] || 'en-IN';

    rec.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setVoiceResponse('');
    };

    rec.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      processCommand(result);
    };

    rec.onerror = (e) => {
      console.warn("Speech recognition error: ", e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
  }, [language]);

  const speak = (text, customLang = null) => {
    if (!window.speechSynthesis) return;
    // Cancel any active speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const activeLang = customLang || (language === 'auto' ? 'en' : language);
    utterance.lang = localeMap[activeLang] || 'en-IN';
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
    setVoiceResponse(text);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const processCommand = (commandText) => {
    const text = commandText.toLowerCase();

    // Navigation triggers in common Indian languages
    const dashboardKeywords = ['dashboard', 'overview', 'डैशबोर्ड', 'డ్యాష్‌బోర్డ్', 'मुख्य पृष्ठ', 'வரலாறு'];
    const cropKeywords = ['crop', 'advisor', 'recommend', 'ਫਸਲ', 'పంట', 'फसल', 'பயிர்', 'ಬೆಳೆ', 'വിള'];
    const diseaseKeywords = ['disease', 'sick', 'diagnose', 'रोग', 'ఆకు', 'తెగులు', 'நோய்', 'ರೋಗ', 'രോഗം'];
    const irrigationKeywords = ['irrigation', 'water', 'సిंचाई', 'నీరు', 'சிंचाई', 'பாசனம்', 'ನೀರಾವರಿ', 'നന'];
    const marketKeywords = ['market', 'price', 'rates', 'mandi', 'दर', 'ధర', 'சந்தை', 'ಮಾರುಕಟ್ಟೆ', 'വിപണി'];
    const schemeKeywords = ['scheme', 'government', 'योजना', 'పథకాలు', 'திட்டம்', 'ಯೋಜನೆ', 'പദ്ധതി'];
    const calendarKeywords = ['calendar', 'timeline', 'క్యాలెండర్', 'कैलेंडर', 'காலண்டர்', 'ಕ್ಯಾಲೆಂಡರ್'];
    const profileKeywords = ['profile', 'account', 'ప్రొఫైల్', 'प्रोफ़ाइल', 'சுயவிவரம்', 'ಪ್ರೊಫೈಲ್'];

    const matches = (keywords) => keywords.some(k => text.includes(k));

    if (matches(dashboardKeywords)) {
      speak("Opening dashboard.", language);
      setTimeout(() => navigate('/dashboard'), 1200);
    } 
    else if (matches(cropKeywords)) {
      speak("Opening crop advisor.", language);
      setTimeout(() => navigate('/crops'), 1200);
    } 
    else if (matches(diseaseKeywords)) {
      speak("Opening disease clinic.", language);
      setTimeout(() => navigate('/disease'), 1200);
    } 
    else if (matches(irrigationKeywords)) {
      speak("Checking irrigation schedules.", language);
      setTimeout(() => navigate('/irrigation'), 1200);
    } 
    else if (matches(marketKeywords)) {
      speak("Opening market prices.", language);
      setTimeout(() => navigate('/market'), 1200);
    } 
    else if (matches(schemeKeywords)) {
      speak("Loading government schemes.", language);
      setTimeout(() => navigate('/schemes'), 1200);
    } 
    else if (matches(calendarKeywords)) {
      speak("Opening farming calendar.", language);
      setTimeout(() => navigate('/calendar'), 1200);
    } 
    else if (matches(profileKeywords)) {
      speak("Opening settings profile.", language);
      setTimeout(() => navigate('/profile'), 1200);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const simulateCommand = (cmdText) => {
    setTranscript(cmdText);
    processCommand(cmdText);
  };

  return {
    isListening,
    transcript,
    voiceResponse,
    recognitionSupported,
    startListening,
    stopListening,
    simulateCommand,
    speak,
    stopSpeaking
  };
};
