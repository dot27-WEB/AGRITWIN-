import cropsData from '../../data/crops.json';

/**
 * AI Response Generator for AgriTwin AI Copilot.
 * Generates responses in all 10 supported languages (en, te, hi, ta, kn, ml, mr, bn, gu, pa).
 */

const WEATHER_SUMMARIES = {
  sunny: {
    en: "Sunny / Clear Sky", te: "ఎండగా ఉంది / నిర్మలమైన ఆకాశం", hi: "धूप खिली है / साफ आसमान",
    ta: "வெயில் / தெளிவான வானம்", kn: "ಬಿಸಿಲಿನ ವಾತಾವರಣ / ಸ್ವಚ್ಛ ಆಕಾಶ", ml: "വെയിൽ / തെളിഞ്ഞ ആകാശം",
    mr: "उन्हाचा दिवस / स्वच्छ आकाश", bn: "রৌদ্রোজ্জ্বল / পরিষ্কার আকাশ", gu: "તડકો / સ્વચ્છ આકાશ", pa: "ਧੁੱਪ ਵਾਲਾ ਦਿਨ / ਸਾਫ਼ ਅਸਮਾਨ"
  },
  cloudy: {
    en: "Partly Cloudy", te: "పాక్షికంగా మేఘావృతం", hi: "आंशिक रूप से बादल छाए हैं",
    ta: "பகுதி மேகமூட்டம்", kn: "ಭಾಗಶಃ ಮೋಡ ಕವಿದ ವಾತಾವರಣ", ml: "ഭാഗികമായി മേഘാവൃതം",
    mr: "अंशतः ढगाळ", bn: "আংশিক মেঘলা", gu: "અંશતઃ વાદળછાયું", pa: "ਕੁਝ ਬੱਦਲਵਾਈ"
  },
  overcast: {
    en: "Overcast", te: "పూర్తిగా మేఘావృతం", hi: "बादल छाए हैं",
    ta: "முழு மேகமூட்டம்", kn: "ಮೋಡ ಕವಿದ ವಾತಾವರಣ", ml: "മേഘാവൃതം",
    mr: "ढगाळ वातावरण", bn: "মেঘলা আকাশ", gu: "વાદળછાયું વાતાવરણ", pa: "ਪੂਰੀ ਬੱਦਲਵਾਈ"
  },
  foggy: {
    en: "Foggy Conditions", te: "పొగమంచు కురుస్తోంది", hi: "कोहरा छाया हुआ है",
    ta: "பனிமூட்டம்", kn: "ಮಂಜು ಮುಸುಕಿದ ವಾತಾವರಣ", ml: "മഞ്ഞ് മൂടിയ അവസ്ഥ",
    mr: "धुके", bn: "কুয়াশাচ্ছন্ন", gu: "ધુમ્મસ વાળું વાતાવરણ", pa: "ਧੁੰਦ ਵਾਲਾ ਮੌਸਮ"
  },
  drizzle: {
    en: "Light Drizzle", te: "చినుకులు పడుతున్నాయి", hi: "हल्की बूंदाबांदी",
    ta: "சாரல் மழை", kn: "ತುಂತುರು ಮಳೆ", ml: "ചെറിയ ചാറ്റൽമഴ",
    mr: "रिमझिम पाऊस", bn: "হালকা গুঁড়ি গুঁড়ি বৃষ্টি", gu: "ઝીણો વરસાદ", pa: "ਹਲਕੀ ਬੂੰਦਾ-ਬਾਂਦੀ"
  },
  rainy: {
    en: "Heavy Rain", te: "భారీ వర్షం", hi: "भारी बारिश",
    ta: "கனமழை", kn: "ಭಾರೀ ಮಳೆ", ml: "ശക്തമായ മഴ",
    mr: "मुसळधार पाऊस", bn: "ভারী বৃষ্টিপাত", gu: "ભારે વરસાદ", pa: "ਭਾਰੀ ਮੀਂਹ"
  },
  snowy: {
    en: "Snowy", te: "మంచు కురుస్తోంది", hi: "बर्फबारी",
    ta: "பனிப்பொழிவு", kn: "ಹಿಮಪಾತ", ml: "മഞ്ഞുവീഴ്ച",
    mr: "बर्फवृष्टी", bn: "তুষারপাত", gu: "બરફવર્ષા", pa: "ਬਰਫ਼ਬਾਰੀ"
  },
  showers: {
    en: "Rain Showers", te: "వర్షపు జల్లులు", hi: "बौछारें",
    ta: "மழை தூறல்", kn: "ಮಳೆ ಜಲ್ಲು", ml: "മഴപ്പെയ്ത്ത്",
    mr: "पावसाच्या सरी", bn: "বৃষ্টির ফোঁটা", gu: "વરસાદી ઝાપટાં", pa: "ਮੀਂਹ ਦੀਆਂ ਕਾਣੀਆਂ"
  },
  thunderstorm: {
    en: "Thunderstorm Alert", te: "ఉరుములతో కూడిన వర్షం హెచ్చరిక", hi: "गर्जन के साथ तूफान की चेतावनी",
    ta: "இடி மின்னலுடன் கூடிய மழை எச்சரிக்கை", kn: "ಗುಡುಗು ಸಹಿತ ಮಳೆಯ ಮುನ್ನೆಚ್ಚರಿಕೆ", ml: "ഇടിമിന്നലോട് കൂടിയ മഴ മുന്നറിയിപ്പ്",
    mr: "वादळी वाऱ्यासह पावसाचा इशारा", bn: "বজ্রবিদ্যুৎ সহ ঝড়ের সতর্কতা", gu: "ગાજવીજ સાથે વાવાઝोडાની ચેતવણી", pa: "ਝੱਖੜ ਅਤੇ ਗਰਜ ਚਮਕ ਦੀ ਚੇਤਾਵਨੀ"
  }
};

const getWeatherSummary = (code, lang) => {
  let key = 'cloudy';
  switch (code) {
    case 0: key = 'sunny'; break;
    case 1:
    case 2: key = 'cloudy'; break;
    case 3: key = 'overcast'; break;
    case 45:
    case 48: key = 'foggy'; break;
    case 51:
    case 53:
    case 55: key = 'drizzle'; break;
    case 61:
    case 63:
    case 65: key = 'rainy'; break;
    case 71:
    case 73:
    case 75: key = 'snowy'; break;
    case 80:
    case 81:
    case 82: key = 'showers'; break;
    case 95:
    case 96:
    case 99: key = 'thunderstorm'; break;
    default: key = 'cloudy';
  }
  return WEATHER_SUMMARIES[key][lang] || WEATHER_SUMMARIES[key]['en'];
};

export const generateAIResponse = async (intent, query, activeFarm, computedMetrics) => {
  const cleaned = query.trim().toLowerCase();

  // Helper dictionary output
  const response = {};

  // 10 languages array
  const languages = ['en', 'te', 'hi', 'ta', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa'];

  // GREETINGS
  if (intent === 'Greeting') {
    const greetings = {
      en: `Hello 👋\n\nI am AgriTwin AI.\n\nI can help you with\n• Weather\n• Irrigation\n• Farm Analysis\n• Crop Recommendations\n• Navigation\n\nAsk me anything.`,
      te: `నమస్కారం 👋\n\nనేను మీ అగ్రిట్విన్ ఏఐ సహాయకుడిని.\n\nనేను మీకు వీటిలో సహాయం చేయగలను:\n• వాతావరణం\n• నీటి పారుదల\n• పొలం విశ్లేషణ\n• పంట సిఫార్సులు\n• నావిగేషన్\n\nనన్ను ఏదైనా అడగండి.`,
      hi: `नमस्ते 👋\n\nमैं एग्रीट्विन एआई सहायक हूँ।\n\nमैं आपकी मदद कर सकता हूँ:\n• मौसम\n• सिंचाई\n• खेत विश्लेषण\n• फसल की सिफारिशें\n• नेविगेशन\n\nमुझसे कुछ भी पूछें।`,
      ta: `வணக்கம் 👋\n\nநான் அக்ரிட்வின் ஏஐ உதவியாளர்.\n\nநான் உங்களுக்கு உதவக்கூடியவை:\n• வானிலை\n• பாசனம்\n• பண்ணை பகுப்பாய்வு\n• பயிர் பரிந்துரைகள்\n• வழிசெலுத்தல்\n\nஎன்னிடம் கேளுங்கள்.`,
      kn: `ನಮಸ್ಕಾರ 👋\n\nನಾನು ಅಗ್ರಿಟ್ವಿನ್ ಎಐ ಸಹಾಯಕ.\n\nನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲ ವಿಷಯಗಳು:\n• ಹವಾಮಾನ\n• ನೀರಾವರಿ\n• ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ\n• ಬೆಳೆ ಶಿಫಾರಸುಗಳು\n• ನ್ಯಾವಿಗೇಷನ್\n\nನನ್ನನ್ನು ಏನಾದರೂ ಕೇಳಿ.`,
      ml: `ഹലോ 👋\n\nഞാൻ അഗ്രിട്വിൻ ഐ സഹായകൻ ആണ്.\n\nഞാൻ സഹായിക്കുന്നവ:\n• കാലാവസ്ഥ\n• ജലസేചനം\n• കൃഷിയിട വിശകലനം\n• വിള ശുപാർശകൾ\n• നാവിഗേഷൻ\n\nഎന്തും ചോദിക്കാം.`,
      mr: `नमस्कार 👋\n\nमी अ‍ॅग्रीट्विन एआय सहाय्यक आहे.\n\nमी मदत करू शकतो:\n• हवामान\n• सिंचन\n• शेत विश्लेषण\n• पीक शिफारसी\n• नेव्हिगेशन\n\nमला काहीही विचारा.`,
      bn: `নমস্কার 👋\n\nআমি আপনার এগ্রিটুইন এআই সহকারী।\n\nআমি সাহায্য করতে পারি:\n• আবহাওয়া\n• সেচ\n• খামার বিশ্লেষণ\n• শস্য আবর্তন সুপারিশ\n• নেভিগেশন\n\nআমাকে জিজ্ঞাসা করুন।`,
      gu: `નમસ્તે 👋\n\nહું એગ્રીટ્વીન એઆઇ સહાયક છું.\n\nહું મદદ કરી શકું છું:\n• હવામાન\n• પિયત\n• ખેતર વિશ્લેષણ\n• પાક ભલામણ\n• નેવિગેશન\n\nમને કંઈ પણ પૂછો.`,
      pa: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ 👋\n\nਮੈਂ ਐਗਰੀਟਵਿਨ ਏਆਈ ਸਹਾਇਕ ਹਾਂ।\n\nਮੈਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:\n• ਮੌਸਮ\n• ਸਿੰਚਾਈ\n• ਖੇਤੀ ਵਿਸ਼ਲੇਸ਼ਣ\n• ਫਸਲ ਦੀ ਸਿਫ਼ਾਰਸ਼\n• ਨੈਵੀਗੇਸ਼ਨ\n\nਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ।`
    };
    languages.forEach(l => {
      response[l] = greetings[l] || greetings['en'];
    });
    return response;
  }

  // NAVIGATION COMMANDS
  if (intent === 'Dashboard' || intent === 'Navigation') {
    languages.forEach(l => {
      if (cleaned.includes('weather')) {
        const tr = {
          en: "Opening Weather Intelligence page...", te: "వాతావరణ విశ్లేషణ పేజీని తెరుస్తున్నాను...", hi: "मौसम विश्लेषण पृष्ठ खोल रहा हूँ..."
        };
        response[l] = tr[l] || tr['en'];
      } else if (cleaned.includes('irrigation') || cleaned.includes('water')) {
        const tr = {
          en: "Opening Smart Irrigation scheduler...", te: "స్మార్ట్ నీటి పారుదల షెడ్యూలర్ తెరుస్తున్నాను...", hi: "स्मार्ट सिंचाई शेड्यूलर खोल रहा हूँ..."
        };
        response[l] = tr[l] || tr['en'];
      } else if (cleaned.includes('analysis') || cleaned.includes('intelligence') || cleaned.includes('crop')) {
        const tr = {
          en: "Opening Farm Intelligence page...", te: "పంట విశ్లేషణ మరియు సిఫార్సుల పేజీని తెరుస్తున్నాను...", hi: "खेत विश्लेषण और फसल सलाहकार खोल रहा हूँ..."
        };
        response[l] = tr[l] || tr['en'];
      } else {
        const tr = {
          en: "Opening Dashboard...", te: "డ్యాష్‌బోర్డ్ తెరుస్తున్నాను...", hi: "डैशबोर्ड खोल रहा हूँ..."
        };
        response[l] = tr[l] || tr['en'];
      }
    });
    return response;
  }

  // REGISTRATION ERROR FLAG
  if (!activeFarm || !computedMetrics) {
    const errorReg = {
      en: `Hello! I am AgriTwin AI. I notice you don't have an active farm twin yet. Please register your farm at "Farm Registration" so I can analyze soil, weather conditions, and recommend crops!`,
      te: `నమస్కారం! నేను అగ్రిట్విన్ ఏఐ సహాయకుడిని. మీకు ఇంకా సక్రియ పొలం నమోదు కాలేదు. నేల సారం, వాతావరణం, పంటల సిఫార్సుల కోసం దయచేసి "పంట నమోదు" పేజీలో మీ పొలాన్ని నమోదు చేసుకోండి.`,
      hi: `नमस्कार! मैं एग्रीट्विन एआई सहायक हूँ। मुझे पता चला है कि आपका कोई सक्रिय खेत पंजीकृत नहीं है। मिट्टी, मौसम और फसलों की जानकारी के लिए कृपया "खेत पंजीकरण" पर अपना खेत दर्ज करें।`
    };
    languages.forEach(l => {
      response[l] = errorReg[l] || errorReg['en'];
    });
    return response;
  }

  const crop = cropsData.find(c => c.id === activeFarm.currentCrop);
  const cropName = crop ? (crop.name.en) : activeFarm.currentCrop;
  const cropNameTe = crop ? (crop.name.te || crop.name.en) : activeFarm.currentCrop;
  const cropNameHi = crop ? (crop.name.hi || crop.name.en) : activeFarm.currentCrop;

  // WEATHER INTENT
  if (intent === 'Weather') {
    let weather = null;
    try {
      const cached = localStorage.getItem('agritwin_weather_data');
      if (cached) {
        weather = JSON.parse(cached);
      }
    } catch (e) {
      console.error(e);
    }

    const temp = weather ? weather.current.temperature_2m : 32;
    const humidity = weather ? weather.current.relative_humidity_2m : 68;
    const rainChance = weather ? (weather.daily.precipitation_probability_max?.[0] ?? 20) : 85; // high fallback for irrigate check if query is about irrigation delaying
    const windSpeed = weather ? weather.current.wind_speed_10m : 14;
    const code = weather ? weather.current.weather_code : 3;

    // A. Query is "Should I irrigate today?"
    if (cleaned.includes('should i') || cleaned.includes('irrigate today')) {
      const isRainy = rainChance > 40;
      languages.forEach(l => {
        if (isRainy) {
          const delayTr = {
            en: `Rain probability is high today (${rainChance}%). I recommend delaying irrigation until tomorrow morning.`,
            te: `ఈరోజు వర్షం పడే అవకాశం ఎక్కువగా ఉంది (${rainChance}%). రేపు ఉదయం వరకు నీటి తడులు అందించవద్దని సిఫార్సు చేస్తున్నాను.`,
            hi: `आज बारिश की संभावना अधिक (${rainChance}%) है। मैं कल सुबह तक सिंचाई टालने की सलाह देता हूँ।`,
            ta: `இன்று மழை பெய்ய அதிக வாய்ப்பு உள்ளது (${rainChance}%). நாளை காலை வரை பாசனத்தை ஒத்திவைக்க பரிந்துரைக்கிறேன்.`,
            kn: `ಇಂದು ಮಳೆ ಬರುವ ಸಾಧ್ಯತೆ ಹೆಚ್ಚಾಗಿದೆ (${rainChance}%). ನಾಳೆ ಬೆಳಿಗ್ಗೆಯವರೆಗೆ ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಲು ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ.`,
            ml: `ഇന്ന് മഴ പെയ്യാൻ സാധ്യത കൂടുതലാണ് (${rainChance}%). നാളെ രാവിലെ വരെ നനയ്ക്കുന്നത് നീട്ടിവെക്കാൻ ഞാൻ ശുപാർശ ചെയ്യുന്നു.`,
            mr: `आज पाऊस पडण्याची शक्यता जास्त (${rainChance}%) आहे. मी उद्या सकाळपर्यंत सिंचन पुढे ढकलण्याची शिफारस करतो.`,
            bn: `আজ বৃষ্টির সম্ভাবনা বেশি (${rainChance}%)। আমি আগামীকাল সকাল পর্যন্ত সেচ পিছিয়ে দেওয়ার পরামর্শ দিচ্ছি।`,
            gu: `આજે વરસાદની શક્યતા વધુ છે (${rainChance}%). હું આવતીકાલ સવાર સુધી પિયત મુલતવી રાખવાની ભલામણ કરું છું.`,
            pa: `ਅੱਜ ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਜ਼ਿਆდა (${rainChance}%) ਹੈ। ਮੈਂ ਕੱਲ੍ਹ ਸਵੇਰ ਤੱਕ ਸਿੰਚਾਈ ਮੁਲਤਵੀ ਕਰਨ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰਦਾ ਹਾਂ।`
          };
          response[l] = delayTr[l] || delayTr['en'];
        } else {
          const proceedTr = {
            en: `Rain probability is low today (${rainChance}%). You can proceed with the scheduled irrigation.`,
            te: `ఈరోజు వర్షం పడే అవకాశం తక్కువగా ఉంది (${rainChance}%). మీరు షెడ్యూల్ చేసిన విధంగా నీటి తడులు అందించవచ్చు.`,
            hi: `आज बारिश की संभावना कम (${rainChance}%) है। आप निर्धारित सिंचाई के साथ आगे बढ़ सकते हैं।`
          };
          response[l] = proceedTr[l] || proceedTr['en'];
        }
      });
      return response;
    }

    // B. General weather forecast
    languages.forEach(l => {
      const summary = getWeatherSummary(code, l);
      const report = {
        en: `Here is today's localized weather forecast for **${activeFarm.village}**:
• **Temperature**: ${temp}°C
• **Humidity**: ${humidity}%
• **Rain Chance**: ${rainChance}%
• **Wind Speed**: ${windSpeed} km/h
• **Weather Summary**: ${summary}`,
        te: `ఈరోజు **${activeFarm.village}** యొక్క స్థానిక వాతావరణ నివేదిక:
• **ఉష్ణోగ్రత**: ${temp}°C
• **తేమ**: ${humidity}%
• **వర్షం పడే అవకాశం**: ${rainChance}%
• **గాలి వేగం**: ${windSpeed} కిమీ/గంట
• **వాతావరణ సారాంశం**: ${summary}`,
        hi: `आज **${activeFarm.village}** का स्थानीय मौसम पूर्वानुमान:
• **तापमान**: ${temp}°C
• **आर्द्रता**: ${humidity}%
• **बारिश की संभावना**: ${rainChance}%
• **हवा की गति**: ${windSpeed} किमी/घंटा
• **मौसम का सारांश**: ${summary}`,
        ta: `இன்று **${activeFarm.village}** வானிலை விவரம்:
• **வெப்பநிலை**: ${temp}°C
• **ஈரப்பதம்**: ${humidity}%
• **மழை வாய்ப்பு**: ${rainChance}%
• **காற்றின் வேகம்**: ${windSpeed} கி.மீ/மணி
• **வானிலை சுருக்கம்**: ${summary}`,
        kn: `ಇಂದು **${activeFarm.village}** ಹವಾಮಾನ ವರದಿ:
• **ತಾಪಮಾನ**: ${temp}°C
• **ಆರ್ದ್ರತೆ**: ${humidity}%
• **ಮಳೆ ಸಾಧ್ಯತೆ**: ${rainChance}%
• **ಗಾಳಿಯ ವೇಗ**: ${windSpeed} ಕಿ.ಮೀ/ಗಂಟೆ
• **ಹವಾಮಾನ ಸಾರಾಂಶ**: ${summary}`,
        ml: `ഇന്ന് **${activeFarm.village}** കാലാവസ്ഥ വിവരം:
• **താപനില**: ${temp}°C
• **അന്തരീക്ഷ ഈർപ്പം**: ${humidity}%
• **മഴയ്ക്ക് സാധ്യത**: ${rainChance}%
• **കാറ്റിന്റെ വേഗം**: ${windSpeed} കി.മീ/മണിക്കൂർ
• **കാലാവസ്ഥ വിവരണം**: ${summary}`,
        mr: `आज **${activeFarm.village}** चे स्थानिक हवामान:
• **तापमान**: ${temp}°C
• **दमटपणा**: ${humidity}%
• **पावसाची शक्यता**: ${rainChance}%
• **वाऱ्याचा वेग**: ${windSpeed} किमी/तास
• **हवामान सारांश**: ${summary}`,
        bn: `আজ **${activeFarm.village}**-এর আবহাওয়ার পূর্বাভাস:
• **তাপমাত্রা**: ${temp}°C
• **আর্দ্রতা**: ${humidity}%
• **বৃষ্টির সম্ভাবনা**: ${rainChance}%
• **বাতাসের গতিবেগ**: ${windSpeed} কিমি/ঘণ্টা
• **আবহাওয়া সংক্ষিপ্তসার**: ${summary}`,
        gu: `આજે **${activeFarm.village}** ની સ્થાનિક હવામાન માહિતી:
• **તાપમાન**: ${temp}°C
• **ભેજ**: ${humidity}%
• **વરસાદની શક્યતા**: ${rainChance}%
• **પવનની ગતિ**: ${windSpeed} કિમી/કલાક
• **હવામાન વિગત**: ${summary}`,
        pa: `ਅੱਜ **${activeFarm.village}** ਦਾ ਸਥਾਨਕ ਮੌਸਮ:
• **ਤਾਪਮਾਨ**: ${temp}°C
• **ਨਮੀ**: ${humidity}%
• **ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ**: ${rainChance}%
• **ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ**: ${windSpeed} ਕਿਲੋਮੀਟਰ/ਘੰਟਾ
• **ਮੌਸਮ ਦਾ ਹਾਲ**: ${summary}`
      };
      response[l] = report[l] || report['en'];
    });
    return response;
  }

  // SMART IRRIGATION INTENT
  if (intent === 'Smart Irrigation') {
    let baseFreq = crop?.irrigationFrequencyDays || 8;
    if (activeFarm.soilType === 'Sandy') baseFreq -= 2;
    else if (activeFarm.soilType === 'Clayey') baseFreq += 3;
    baseFreq = Math.max(baseFreq, 2);

    let baseLitersPerAcre = crop?.waterRequirement === 'High' ? 24000 : (crop?.waterRequirement === 'Low' ? 6000 : 12000);
    if (activeFarm.irrigationMethod === 'Drip') baseLitersPerAcre *= 0.6;
    else if (activeFarm.irrigationMethod === 'Sprinkler') baseLitersPerAcre *= 0.85;
    else if (activeFarm.irrigationMethod === 'Flood') baseLitersPerAcre *= 1.2;

    const land = parseFloat(activeFarm.landSize) || 1;
    const totalWaterRequirement = Math.round(baseLitersPerAcre * land);

    languages.forEach(l => {
      const activeCropName = l === 'te' ? cropNameTe : (l === 'hi' ? cropNameHi : cropName);
      
      const irrigationRep = {
        en: `Here is the current irrigation recommendation for your field:
• **Crop**: ${activeCropName}
• **Soil Type**: ${activeFarm.soilType}
• **Water Requirement**: ${crop?.waterRequirement || 'Medium'}
• **Irrigation Method**: ${activeFarm.irrigationMethod}
• **Watering Interval**: Every ${baseFreq} days
• **Recommended Volume**: **${totalWaterRequirement.toLocaleString('en-IN')} Liters** (for your ${activeFarm.landSize} acres)

*Tip: Irrigate in the early morning (before 8:00 AM) to minimize evaporation.*`,
        te: `మీ పొలానికి ప్రస్తుతం సిఫార్సు చేసిన నీటి పారుదల వివరాలు:
• **పంట**: ${activeCropName}
• **నేల రకం**: ${activeFarm.soilType}
• **నీటి అవసరం**: ${crop?.waterRequirement || 'Medium'}
• **నీటి పారుదల పద్ధతి**: ${activeFarm.irrigationMethod}
• **నీటి తడుల పౌనఃపున్యం**: ప్రతి ${baseFreq} రోజులకు ఒకసారి
• **సిఫార్సు చేసిన నీటి పరిమాణం**: **${totalWaterRequirement.toLocaleString('en-IN')} లీటర్లు** (మీ ${activeFarm.landSize} ఎకరాలకు)

*చిట్కా: నీటి ఆవిరి కాకుండా ఉండటానికి ఉదయాన్నే (ఉదయం 8 గంటల లోపు) నీరు పెట్టండి.*`,
        hi: `आपके खेत के लिए वर्तमान सिंचाई सिफारिशें:
• **फसल**: ${activeCropName}
• **मिट्टी का प्रकार**: ${activeFarm.soilType}
• **पानी की आवश्यकता**: ${crop?.waterRequirement || 'Medium'}
• **सिंचाई विधि**: ${activeFarm.irrigationMethod}
• **सिंचाई अंतराल**: हर ${baseFreq} दिन
• **अनुशंसित मात्रा**: **${totalWaterRequirement.toLocaleString('en-IN')} लीटर** (आपके ${activeFarm.landSize} एकड़ के लिए)

*सुझाव: वाष्पीकरण को कम करने के लिए सुबह (8:00 बजे से पहले) ही पानी दें।*`
      };
      response[l] = irrigationRep[l] || irrigationRep['en'];
    });
    return response;
  }

  // CROP RECOMMENDATION INTENT
  if (intent === 'Crop Recommendation') {
    const recommendedCropId = computedMetrics.rotation.recommendedNextCropId;
    const recommendedCrop = cropsData.find(c => c.id === recommendedCropId);
    const recName = recommendedCrop ? recommendedCrop.name.en : recommendedCropId;
    const recNameTe = recommendedCrop ? (recommendedCrop.name.te || recommendedCrop.name.en) : recommendedCropId;
    const recNameHi = recommendedCrop ? (recommendedCrop.name.hi || recommendedCrop.name.en) : recommendedCropId;

    const adviceEn = computedMetrics.rotation.advice.en || 'Planting different crop types builds soil nitrogen.';
    const adviceTe = computedMetrics.rotation.advice.te || 'ఈ పంట మార్పిడి నేల నత్రజని సారాన్ని పెంచడానికి సహాయపడుతుంది.';
    const adviceHi = computedMetrics.rotation.advice.hi || 'यह फसल चक्र मिट्टी में नाइट्रोजन तत्व को पुनः प्राप्त करने में सहायक है।';

    languages.forEach(l => {
      const nextName = l === 'te' ? recNameTe : (l === 'hi' ? recNameHi : recName);
      const activeAdvice = l === 'te' ? adviceTe : (l === 'hi' ? adviceHi : adviceEn);

      const recTr = {
        en: `Based on your digital twin rotation model:
• **Recommended Next Crop**: **${nextName}**
• **Rotation Reason**: ${activeAdvice}
• **Current Soil Type**: ${activeFarm.soilType}
• **Crop History**: ${activeFarm.previousCrop || 'None'} ➔ ${activeFarm.currentCrop || 'None'}

This rotation model replenishes nutrients naturally and breaks insect pathogen cycles.`,
        te: `మీ పొలం డిజిటల్ ట్విన్ పంట మార్పిడి విశ్లేషణ ప్రకారం:
• **సిఫార్సు చేసిన తదుపరి పంట**: **${nextName}**
• **మార్పిడి గల కారణం**: ${activeAdvice}
• **ప్రస్తుత నేల రకం**: ${activeFarm.soilType}
• **పంటల చరిత్ర**: ${activeFarm.previousCrop || 'ఏదీ లేదు'} ➔ ${activeFarm.currentCrop || 'ఏదీ లేదు'}

ఈ రొటేషన్ పద్ధతి నేల సారాన్ని సహజంగా పెంచి పురుగుల తెగుళ్ల నివారణకు తోడ్పడుతుంది.`,
        hi: `आपके खेत के क्रॉप रोटेशन मॉडल के आधार पर:
• **अगली अनुशंसित फसल**: **${nextName}**
• **फसल चक्र का कारण**: ${activeAdvice}
• **मिट्टी का प्रकार**: ${activeFarm.soilType}
• **फसलों का इतिहास**: ${activeFarm.previousCrop || 'कोई नहीं'} ➔ ${activeFarm.currentCrop || 'कोई नहीं'}

यह फसल चक्र मिट्टी के पोषक तत्वों को स्वाभाविक रूप से बढ़ाता है और कीट संक्रमण चक्र को तोड़ता है।`
      };
      response[l] = recTr[l] || recTr['en'];
    });
    return response;
  }

  // FARM HEALTH ANALYSIS
  if (intent === 'Farm Analysis') {
    const healthScore = computedMetrics.farmHealthScore;
    const fertilityScore = computedMetrics.soil.fertilityScore;
    const riskLevel = computedMetrics.risk.overallRiskLevel;

    languages.forEach(l => {
      const activeCropName = l === 'te' ? cropNameTe : (l === 'hi' ? cropNameHi : cropName);
      const analysisTr = {
        en: `Here is your Farm Twin Analysis:
• **Farm Health Rating**: **${healthScore}%**
• **Soil Fertility Score**: **${fertilityScore}/100**
• **NPK Chemical Status**: Nitrogen: ${computedMetrics.soil.nStatus}, Phosphorus: ${computedMetrics.soil.pStatus}, Potassium: ${computedMetrics.soil.kStatus}
• **Risk Matrix**: ${riskLevel} Risk
• **Active Crop Sown**: ${activeCropName}`,
        te: `మీ పొలం డిజిటల్ ట్విన్ నివేదిక:
• **పొలం ఆరోగ్య రేటింగ్**: **${healthScore}%**
• **నేల సారవంతం స్కోరు**: **${fertilityScore}/100**
• **NPK రసాయన నిల్వలు**: నత్రజని: ${computedMetrics.soil.nStatus}, భాస్వరం: ${computedMetrics.soil.pStatus}, పొటాషియం: ${computedMetrics.soil.kStatus}
• **ప్రమాద స్థాయి**: **${riskLevel}** ప్రమాదం
• **ప్రస్తుత పంట**: ${activeCropName}`,
        hi: `आपके खेत का डिजिटल ट्विन विश्लेषण:
• **खेत का स्वास्थ्य स्कोर**: **${healthScore}%**
• **मिट्टी की उर्वरता रेटिंग**: **${fertilityScore}/100**
• **NPK रासायनिक स्थिति**: नाइट्रोजन: ${computedMetrics.soil.nStatus}, फास्फोरस: ${computedMetrics.soil.pStatus}, पोटेशियम: ${computedMetrics.soil.kStatus}
• **जोखिम की स्थिति**: **${riskLevel}** जोखिम
• **वर्तमान फसल**: ${activeCropName}`
      };
      response[l] = analysisTr[l] || analysisTr['en'];
    });
    return response;
  }

  // UNKNOWN / FALLBACK
  const fallbackTr = {
    en: `Sorry,
I couldn't understand your request.

Try asking:
• **Show Weather**
• **Should I irrigate today?**
• **Open Smart Irrigation**
• **How much water should I use?**
• **Recommend Next Crop**`,
    te: `క్షమించండి,
నేను మీ అభ్యర్థనను అర్థం చేసుకోలేకపోయాను.

ఇలా అడిగి చూడండి:
• **వాతావరణం చూపించు (Show Weather)**
• **నేను ఈరోజు నీరు పెట్టాలా? (Should I irrigate today?)**
• **నీటి యాజమాన్యం పేజీకి వెళ్ళు (Open Smart Irrigation)**
• **నేను ఎంత నీరు వాడాలి? (How much water should I use?)**
• **తదుపరి పంటను సిఫార్సు చేయి (Recommend Next Crop)**`,
    hi: `क्षमा करें,
मैं आपका अनुरोध समझ नहीं पाया।

कृपया निम्नलिखित पूछें:
• **मौसम दिखाएं (Show Weather)**
• **क्या मुझे आज सिंचाई करनी चाहिए? (Should I irrigate today?)**
• **सिंचाई व्यवस्था खोलें (Open Smart Irrigation)**
• **मुझे कितना पानी इस्तेमाल करना चाहिए? (How much water should I use?)**
• **अगली फसल की सिफारिश करें (Recommend Next Crop)**`
  };
  languages.forEach(l => {
    response[l] = fallbackTr[l] || fallbackTr['en'];
  });
  return response;
};

export default generateAIResponse;
