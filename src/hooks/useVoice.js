import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useVoice = (language) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    
    // Adjust speech language based on app settings
    if (language === 'te') rec.lang = 'te-IN';
    else if (language === 'hi') rec.lang = 'hi-IN';
    else rec.lang = 'en-IN';

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

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    // Cancel any active speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate voice/pitch for Indian locales
    if (language === 'te') {
      utterance.lang = 'te-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
    setVoiceResponse(text);
  };

  const processCommand = (commandText) => {
    const text = commandText.toLowerCase();

    // 1. Dashboard Page triggers
    const dashboardKeywords = ['dashboard', 'virtual twin', 'twin', 'clone', 'overview', 'health score', 'डैशबोर्ड', 'డ్యాష్‌బోర్డ్', 'పొలం ఆరోగ్యం', 'मुख्य पृष्ठ'];
    // 2. Crop Recommendations triggers
    const cropKeywords = ['crop', 'advisor', 'recommend', 'suggest', 'what to grow', 'planting', 'rotation', 'फसल', 'పంట', 'సూచన', 'సలహా', 'బోధన'];
    // 3. Disease diagnostics triggers
    const diseaseKeywords = ['disease', 'blight', 'sick', 'infection', 'pathogen', 'diagnose', 'leaf', 'scan', 'pests', 'rust', 'spot', 'रोग', 'बीमारी', 'ఆకు', 'రోగం', 'తెగులు', 'ఇన్ఫెక్షన్'];
    // 4. Irrigation schedule triggers
    const irrigationKeywords = ['irrigation', 'water', 'watering', 'moisture', 'humidity', 'drip', 'sprinkler', 'flood', 'सिंचाई', 'నీరు', 'తడి', 'నీటి పారుదల', 'पानी'];
    // 5. Market pricing triggers
    const marketKeywords = ['market', 'price', 'rates', 'rate', 'mandi', 'cost', 'sell', 'revenue', 'profit', 'msp', 'दर', 'भाव', 'मार्केट', 'మార్కెట్', 'ధర', 'ధరలు', 'మండి', 'లాభం', 'విక్రయం'];
    // 6. Govt scheme matching triggers
    const schemeKeywords = ['scheme', 'schemes', 'government', 'pm-kisan', 'kusum', 'subsidy', 'subsidies', 'grants', 'insurance', 'pmfby', 'योजना', 'సబ్సిడీ', 'పథకాలు', 'పథకం', 'బీమా'];
    // 7. Farming calendar triggers
    const calendarKeywords = ['calendar', 'milestone', 'timeline', 'schedule', 'dates', 'operations', 'tasks', 'months', 'క్యాలెండర్', 'కార్యకలాపాలు', 'समय सारणी', 'कैलेंडर'];
    // 8. Settings & Profile triggers
    const profileKeywords = ['profile', 'setting', 'settings', 'account', 'farmer details', 'my info', 'switch farm', 'change farm', 'ప్రొఫైల్', 'खाता', 'प्रोफ़ाइल'];

    const matches = (keywords) => keywords.some(k => text.includes(k));

    if (matches(dashboardKeywords)) {
      speak("Opening your farm twin dashboard.");
      setTimeout(() => navigate('/dashboard'), 1500);
    } 
    else if (matches(cropKeywords)) {
      speak("Navigating to crop recommendations.");
      setTimeout(() => navigate('/crops'), 1500);
    } 
    else if (matches(diseaseKeywords)) {
      speak("Opening disease diagnostics clinic.");
      setTimeout(() => navigate('/disease'), 1500);
    } 
    else if (matches(irrigationKeywords)) {
      speak("Checking smart irrigation schedule.");
      setTimeout(() => navigate('/irrigation'), 1500);
    } 
    else if (matches(marketKeywords)) {
      speak("Opening market intelligence reports.");
      setTimeout(() => navigate('/market'), 1500);
    } 
    else if (matches(schemeKeywords)) {
      speak("Loading eligible government schemes.");
      setTimeout(() => navigate('/schemes'), 1500);
    } 
    else if (matches(calendarKeywords)) {
      speak("Opening farming activity calendar.");
      setTimeout(() => navigate('/calendar'), 1500);
    } 
    else if (matches(profileKeywords)) {
      speak("Viewing profile and active farm twins.");
      setTimeout(() => navigate('/profile'), 1500);
    }
    else {
      speak("Command not recognized. Try saying: go to dashboard, what to grow, scan leaf, or mandi rates.");
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

  // Allow simulated command inputs for demo testing on unsupported devices/sandboxes
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
    speak
  };
};
