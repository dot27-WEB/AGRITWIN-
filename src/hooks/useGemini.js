import { useState } from 'react';

const AGRI_KNOWLEDGE = {
  welcome: {
    en: "Hello! I am your AgriTwin AI assistant. I can answer any questions about soil fertility, crop rotation, pest control, irrigation, market rates, or government subsidies. What would you like to know today?",
    te: "నమస్కారం! నేను మీ అగ్రిట్విన్ ఏఐ సహాయకుడిని. నేల సారం, పంట మార్పిడి, తెగుళ్ల నివారణ, నీటి పారుదల, మార్కెట్ ధరలు లేదా ప్రభుత్వ పథకాల గురించి మీ ప్రశ్నలకు నేను సమాధానం ఇవ్వగలను. ఈరోజు మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
    hi: "नमस्कार! मैं आपका एग्रीट्विन एआई सहायक हूँ। मैं मिट्टी की उर्वरता, फसल चक्र, कीट नियंत्रण, सिंचाई, मंडी दरों या सरकारी योजनाओं के बारे में आपके किसी भी प्रश्न का उत्तर दे सकता हूँ। आज आप क्या जानना चाहते हैं?"
  },
  pest: {
    en: "For sustainable pest management, try spraying 3% Neem Oil extract or using yellow sticky traps to capture whiteflies and aphid insects. Keep the bunds clean to break pest nesting. For detailed diagnoses, navigate to our Disease Clinic.",
    te: "తెగుళ్ల నివారణకు 3% వేప నూనె పిచికారీ చేయడం లేదా తెల్లదోమలను ఆకర్షించే పసుపు రంగు జిగురు కార్డులను అమర్చడం మంచిది. పొలంలో కలుపు లేకుండా చూసుకోండి. మరిన్ని వివరాల కోసం మన తెగుళ్ల నివారణ పేజీని చూడండి.",
    hi: "कीट नियंत्रण के लिए, 3% नीम के तेल का छिड़काव करें या सफेद मक्खियों और एफिड्स को पकड़ने के लिए पीले चिपचिपे जाल का उपयोग करें। खेतों को खरपतवार मुक्त रखें। विस्तृत निदान के लिए हमारे रोग निदान केंद्र पर जाएं।"
  },
  fertilizer: {
    en: "Ensure a balanced N-P-K (Nitrogen, Phosphorus, Potassium) application based on your soil type. Add decomposed Farm Yard Manure (compost) at 5 tons/acre to increase soil organic carbon and nutrient retention naturally.",
    te: "మీ నేల స్వభావాన్ని బట్టి నత్రజని, భాస్వరం, పొటాషియం ఎరువులను సమతుల్యంగా వేయండి. ఎకరానికి 5 టన్నుల పశువుల ఎరువును వేయడం వల్ల నేల సారవంతం సహజంగా పెరుగుతుంది.",
    hi: "अपनी मिट्टी के प्रकार के आधार पर संतुलित एन-पी-के (नाइट्रोजन, फास्फोरस, पोटेशियम) का उपयोग करें। मिट्टी में जैविक कार्बन बढ़ाने के लिए 5 टन प्रति एकड़ सड़े हुए गोबर की खाद मिलाएं।"
  },
  water: {
    en: "Micro-irrigation systems (Drip and Sprinklers) reduce water consumption by 30-50% while improving crop yields. Water during early mornings to minimize evaporation losses. Check our Irrigation page for water schedules.",
    te: "సూక్ష్మ నీటి పారుదల పద్ధతులు (డ్రిప్ మరియు స్ప్రింక్లర్లు) 30-50% నీటిని పొదుపు చేస్తాయి. ఆవిరి కాకుండా ఉండటానికి ఉదయాన్నే నీటి తడులు అందించండి. నీటి షెడ్యూల్ కోసం మన నీటి యాజమాన్యం పేజీని చూడండి.",
    hi: "सूक्ष्म सिंचाई प्रणालियां (ड्रिप और स्प्रिंकलर) पानी की खपत को 30-50% तक कम करती हैं और पैदावार बढ़ाती हैं। वाष्पीकरण से बचने के लिए सुबह के समय सिंचाई करें।"
  },
  market: {
    en: "Mandi rates fluctuate based on seasonal supply arrivals. Currently, commercial crops show high price volatility, while grains like rice and wheat are backed by Government Minimum Support Price (MSP) bounds. Check our Market page for forecasts.",
    te: "మార్కెట్ ధరలు సరఫరాను బట్టి మారుతుంటాయి. ప్రస్తుతం పత్తి, టమోటా వంటి పంటలకు హెచ్చుతగ్గులు ఎక్కువగా ఉన్నాయి, కానీ వరి మరియు గోధుమలకు ప్రభుత్వ మద్దతు ధర (MSP) రక్షణ ఉంది. మార్కెట్ ధరల వివరాల కోసం మన మార్కెట్ పేజీని చూడండి.",
    hi: "मंडी दरें मौसमी आपूर्ति के आधार पर बदलती हैं। वर्तमान में कपास और टमाटर में उतार-चढ़ाव अधिक है, जबकि धान और गेहूं जैसी फसलें सरकारी न्यूनतम समर्थन मूल्य (MSP) से सुरक्षित हैं।"
  },
  scheme: {
    en: "The Central Government offers support through PM-KISAN (₹6,000 yearly income support), PM-KUSUM (up to 60% solar pump subsidies), and PM Fasal Bima Yojana (crop insurance against natural calamities). Check our Govt Schemes page for eligibility status.",
    te: "ప్రభుత్వం పీఎం-కిసాన్ ద్వారా ఏడాదికి ₹6,000 సహాయాన్ని, పీఎం-కుసుమ్ ద్వారా సోలార్ పంపులకు 60% సబ్సిడీని మరియు పంట బీమాను అందిస్తోంది. మీ అర్హతలను ప్రభుత్వ పథకాల పేజీలో చెక్ చేసుకోండి.",
    hi: "सरकार पीएम-किसान (₹6,000 वार्षिक सहायता), पीएम-कुसुम (सौर पंप पर 60% तक सब्सिडी) और पीएम फसल बीमा योजना (फसल बीमा) के माध्यम से सहायता प्रदान करती है। पात्रता जांचने के लिए योजनाएं पेज देखें।"
  },
  default: {
    en: "Interesting question! To maximize agricultural yields, ensure proper spacing during sowing, check soil pH bounds regularly, keep fields weed-free, and rotate heavy-feeding grains with legume oilseeds next season to rebuild soil nitrogen.",
    te: "మంచి ప్రశ్న! పంట దిగుబడిని పెంచడానికి విత్తే సమయంలో తగిన దూరం పాటించండి, కలుపు నివారణ చేయండి మరియు నేల సారాన్ని కాపాడటానికి వచ్చే సీజన్‌లో పప్పుధాన్యాలతో పంట మార్పిడి చేయండి.",
    hi: "अच्छा सवाल! पैदावार बढ़ाने के लिए, बुवाई के समय उचित दूरी रखें, खरपतवार नियंत्रण करें और मिट्टी की उर्वरता बनाए रखने के लिए अगले सीजन में फलीदार फसलों के साथ फसल चक्र अपनाएं।"
  }
};

export const useGemini = () => {
  const [messages, setMessages] = useState([
    { 
      id: 'welcome',
      sender: 'ai', 
      text: {
        en: AGRI_KNOWLEDGE.welcome.en,
        te: AGRI_KNOWLEDGE.welcome.te,
        hi: AGRI_KNOWLEDGE.welcome.hi
      },
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const getAIAnswerTranslations = (queryText, farm, metrics) => {
    const q = queryText.toLowerCase();
    const formatRupee = (val) => new Intl.NumberFormat('en-IN').format(val || 0);

    // 1. Context check: health / metrics
    if ((q.includes('health') || q.includes('score') || q.includes('status') || q.includes('ఆరోగ్య') || q.includes('स्थिति') || q.includes('सेहत')) && farm && metrics) {
      return {
        en: `Your active farm twin in ${farm.village} has a Health Score of ${metrics.farmHealthScore}%. The soil fertility is evaluated at ${metrics.soil.fertilityScore}/100 and overall risk is ${metrics.risk.overallRiskLevel}.`,
        te: `మీ పొలం (${farm.village}) ఆరోగ్య స్కోరు ${metrics.farmHealthScore}%. నేల సారం ${metrics.soil.fertilityScore}/100 మరియు నష్ట భయం ${metrics.risk.overallRiskLevel} స్థాయిలో ఉన్నాయి.`,
        hi: `आपके खेत (${farm.village}) का स्वास्थ्य स्कोर ${metrics.farmHealthScore}% है। मिट्टी की उर्वरता ${metrics.soil.fertilityScore}/100 और कुल जोखिम ${metrics.risk.overallRiskLevel} है।`
      };
    }

    // 2. Context check: profit / yield / cost
    if ((q.includes('profit') || q.includes('revenue') || q.includes('cost') || q.includes('money') || q.includes('yield') || q.includes('లాభం') || q.includes('ఆదాయం') || q.includes('लाभ') || q.includes('पैसा') || q.includes('कमाई') || q.includes('पैदावार')) && farm && metrics) {
      return {
        en: `Based on your land size of ${farm.landSize} acres, the expected profit is ₹${formatRupee(metrics.profit.profit)} (Projected Revenue: ₹${formatRupee(metrics.profit.revenue)}, Cost: ₹${formatRupee(metrics.profit.cost)}).`,
        te: `మీ పొలం వైశాల్యం ${farm.landSize} ఎకరాల ఆధారంగా, ఆశించే నికర లాభం ₹${formatRupee(metrics.profit.profit)} (మొత్తం ఆదాయం: ₹${formatRupee(metrics.profit.revenue)}, ఖర్చులు: ₹${formatRupee(metrics.profit.cost)}).`,
        hi: `आपके ${farm.landSize} एकड़ खेत के आधार पर, अपेक्षित लाभ ₹${formatRupee(metrics.profit.profit)} है (अनुमानित राजस्व: ₹${formatRupee(metrics.profit.revenue)}, लागत: ₹${formatRupee(metrics.profit.cost)})।`
      };
    }

    // 3. Context check: recommended crop / rotation
    if ((q.includes('recommend') || q.includes('suggest') || q.includes('grow') || q.includes('rotation') || q.includes('next crop') || q.includes('పంట') || q.includes('మార్పిడి') || q.includes('फसल')) && farm && metrics) {
      const recCrop = metrics.rotation.recommendedNextCropId.toUpperCase();
      return {
        en: `The AI recommends planting ${recCrop} next season. Reason: ${metrics.rotation.advice.en}`,
        te: `తదుపరి పంటగా ${recCrop} వేయాల్సిందిగా సిఫార్సు చేయబడింది. కారణం: ${metrics.rotation.advice.te}`,
        hi: `अगली फसल के रूप में ${recCrop} लगाने की सलाह दी जाती है। कारण: ${metrics.rotation.advice.hi}`
      };
    }

    // 4. Default categories with expanded root word matching
    let key = 'default';
    if (q.includes('pest') || q.includes('disease') || q.includes('bug') || q.includes('insect') || q.includes('sick') || q.includes('spots') || q.includes('blight') || q.includes('रोग') || q.includes('कीड़') || q.includes('कीट') || q.includes('कीड़ा') || q.includes('कीड़ों') || q.includes('తెగులు') || q.includes('ఆకు') || q.includes('రోగం')) {
      key = 'pest';
    } else if (q.includes('fertilizer') || q.includes('soil') || q.includes('fertility') || q.includes('npk') || q.includes('urea') || q.includes('manure') || q.includes('compost') || q.includes('खाद') || q.includes('मिट्टी') || q.includes('उर्वरक') || q.includes('నేల') || q.includes('ఎరువు')) {
      key = 'fertilizer';
    } else if (q.includes('water') || q.includes('irrigate') || q.includes('rain') || q.includes('drip') || q.includes('sprinkler') || q.includes('flood') || q.includes('सिंचाई') || q.includes('पानी') || q.includes('जल') || q.includes('నీరు') || q.includes('తడి') || q.includes('పారుదల')) {
      key = 'water';
    } else if (q.includes('price') || q.includes('market') || q.includes('rates') || q.includes('mandi') || q.includes('sell') || q.includes('cost') || q.includes('दर') || q.includes('भाव') || q.includes('बाजार') || q.includes('మార్కెట్') || q.includes('ధర') || q.includes('ధరలు') || q.includes('మండి')) {
      key = 'market';
    } else if (q.includes('scheme') || q.includes('pm-kisan') || q.includes('kusum') || q.includes('subsidy') || q.includes('grant') || q.includes('subsidies') || q.includes('योजना') || q.includes('सब्सीडी') || q.includes('సబ్సిడీ') || q.includes('పథకం') || q.includes('పథకాలు')) {
      key = 'scheme';
    }

    return AGRI_KNOWLEDGE[key];
  };

  const askQuestion = async (textInput, lang = 'en', farm = null, metrics = null) => {
    if (!textInput.trim()) return null;

    const userMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: { en: textInput, te: textInput, hi: textInput },
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const translationsObj = getAIAnswerTranslations(textInput, farm, metrics);
        const aiMessage = {
          id: 'msg_ai_' + Date.now(),
          sender: 'ai',
          text: translationsObj,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
        resolve(translationsObj);
      }, 1200);
    });
  };

  const clearChat = () => {
    setMessages([
      { 
        id: 'welcome',
        sender: 'ai', 
        text: {
          en: AGRI_KNOWLEDGE.welcome.en,
          te: AGRI_KNOWLEDGE.welcome.te,
          hi: AGRI_KNOWLEDGE.welcome.hi
        },
        timestamp: new Date()
      }
    ]);
  };

  return {
    messages,
    isLoading,
    askQuestion,
    clearChat
  };
};
