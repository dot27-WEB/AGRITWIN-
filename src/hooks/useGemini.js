import { useState, useEffect } from 'react';

const FALLBACK_ANSWERS = {
  en: {
    diseases: "To manage crop diseases, ensure healthy plant spacing, remove infected leaves promptly, and apply organic neem oil or recommended copper-based sprays early in the morning.",
    fertilizers: "Apply fertilizers based on soil tests. Nitrogen stimulates leafy growth, Phosphorus supports root development, and Potassium enhances disease resistance. Use organic compost to maintain soil organic matter.",
    organic: "Organic farming builds long-term soil health. Utilize neem cake, vermicompost, and bio-fertilizers like Trichoderma. Adopt crop rotation to prevent pest nesting.",
    irrigation: "Precise irrigation saves water. Monitor soil moisture: irrigate early morning to prevent evapotranspiration. For vegetables, drip irrigation is best; for grains, systematic wetting is recommended.",
    weather: "Ensure drainage channels are clear before high rainfall. Delay spraying pesticides or applying fertilizer if rains are predicted within 24 hours.",
    pests: "Implement Integrated Pest Management (IPM). Use yellow sticky traps for sucking pests like whiteflies. Introduce natural predators or spray neem seed kernel extract (5%).",
    rotation: "Rotate heavy feeders like maize or cotton with nitrogen-fixing legumes like chickpea or groundnut to restore soil nitrogen levels organically.",
    harvesting: "Harvest crop products during dry conditions. Dry grains below 12% moisture level to prevent fungal growth during storage.",
    schemes: "Farmers can access PM-KISAN for income support, PM Fasal Bima Yojana for crop insurance, and soil health card schemes at local Krishi Vigyan Kendras.",
    livestock: "Provide clean water, dry bedding, and balanced green fodder for dairy cattle. Vaccinate regularly against foot-and-mouth disease.",
    seeds: "Always use certified high-yielding and disease-resistant seeds. Prime seeds with bio-inoculants before sowing for better germination rates.",
    market: "Track local market prices on AGMARKNET portal. Store non-perishables during price drops to sell when market demand peaks.",
    general: "As an experienced agricultural officer, I recommend balancing mineral fertilizers with organic manure, checking soil moisture before watering, and inspecting leaves daily for early pest symptoms."
  },
  te: {
    diseases: "పంట తెగుళ్లను నివారించడానికి, మొక్కల మధ్య సరైన దూరం ఉంచండి, సోకిన ఆకులను తొలగించండి మరియు వేప నూనెను పిచికారీ చేయండి.",
    fertilizers: "మట్టి పరీక్ష ఆధారంగా ఎరువులు వేయండి. నత్రజని ఆకుల పెరుగుదలకు, భాస్వరం వేర్ల బలానికి మరియు పొటాషియం తెగుళ్ల నిరోధకతకు సహాయపడతాయి.",
    organic: "సేంద్రీయ వ్యవసాయం మట్టి ఆరోగ్యాన్ని పెంచుతుంది. వర్మీకంపోస్ట్ మరియు ట్రైకోడెర్మా వంటి బయో-ఫెర్టిలైజర్లను వాడండి.",
    irrigation: "బిందు సేద్యం నీటిని ఆదా చేస్తుంది. ఉదయాన్నే నీరు పెట్టడం వల్ల ఆవిరి కాకుండా కాపాడుకోవచ్చు.",
    weather: "వర్షాలు పడే అవకాశం ఉంటే పురుగుమందులు చల్లడం నిలిపివేయండి. పొలంలో నీరు నిల్వ ఉండకుండా చూసుకోండి.",
    pests: "తెగుళ్ల నివారణకు పసుపు రంగు జిగురు కార్డులను వాడండి. 5% వేప గింజల కషాయం పిచికారీ చేయండి.",
    rotation: "నత్రజనిని పెంచడానికి తృణధాన్యాల పంటల తర్వాత శనగలు లేదా వేరుశనగ వంటి లెగ్యూమ్ పంటలను మార్పిడి చేయండి.",
    harvesting: "పొడి వాతావరణంలో పంట కోయండి. నిల్వ ఉంచే ముందు ధాన్యాన్ని బాగా ఎండబెట్టండి.",
    schemes: "రైతులు పీఎం-కిసాన్, పంట బీమా యోజన మరియు భూసార పరీక్షల పథకాలను ఉపయోగించుకోవచ్చు.",
    livestock: "పశువులకు స్వచ్ఛమైన నీరు, పచ్చిగడ్డి అందించండి. గాలికుంటు వ్యాధి నివారణ టీకాలు వేయించండి.",
    seeds: "ధృవీకరించబడిన నాణ్యమైన విత్తనాలను మాత్రమే వాడండి. విత్తే ముందు విత్తన శుద్ధి చేయండి.",
    market: "మార్కెట్ ధరల కొరకు అగ్‌మార్కెట్‌నెట్ పోర్టల్ చూడండి. ధరలు పెరిగినప్పుడు పంటను విక్రయించండి.",
    general: "వ్యవసాయ అధికారిగా నా సలహా ఏమిటంటే, రసాయనిక ఎరువులతో పాటు పశువుల ఎరువును వాడండి, ఆకులను రోజువారీగా గమనించండి."
  },
  hi: {
    diseases: "फसल रोगों के प्रबंधन के लिए, पौधों के बीच पर्याप्त दूरी रखें, प्रभावित पत्तियों को हटाएं और सुबह नीम के तेल का छिड़काव करें.",
    fertilizers: "मिट्टी परीक्षण के आधार पर खाद डालें. नाइट्रोजन पत्तों के विकास के लिए, फास्फोरस जड़ों के लिए और पोटेशियम रोग प्रतिरोधक क्षमता के लिए आवश्यक है.",
    organic: "जैविक खेती से मिट्टी की उर्वरता बढ़ती है. वर्मीकंपोस्ट, नीम की खली और ट्राइकोडर्मा जैसे जैव-उर्वरकों का उपयोग करें.",
    irrigation: "सटीक सिंचाई से पानी की बचत होती है. वाष्पीकरण से बचने के लिए सुबह के समय सिंचाई करें. ड्रिप विधि सबसे सर्वोत्तम है.",
    weather: "भारी बारिश से पहले जल निकासी की व्यवस्था दुरुस्त करें. बारिश की संभावना होने पर कीटनाशकों का छिड़काव टालें.",
    pests: "कीट नियंत्रण के लिए पीले चिपचिपे जाल का उपयोग करें. 5% नीम के बीज के अर्क का छिड़काव करें.",
    rotation: "मिट्टी में नाइट्रोजन बहाल करने के लिए अनाज के बाद दलहन फसलें जैसे चना या मूंगफली उगाएं.",
    harvesting: "शुष्क मौसम में फसल की कटाई करें. भंडारण से पहले अनाज को अच्छी तरह सुखा लें ताकि फफूंद न लगे.",
    schemes: "किसान पीएम-किसान, पीएम फसल बीमा योजना और मृदा स्वास्थ्य कार्ड जैसी सरकारी योजनाओं का लाभ उठा सकते हैं.",
    livestock: "पशुओं को साफ पानी, सूखा बिछावन और संतुलित हरा चारा दें. खुरपका-मुंहपका रोग के टीके नियमित लगवाएं.",
    seeds: "हमेशा प्रमाणित उन्नत और रोग-प्रतिरोधी बीजों का ही उपयोग करें. बोने से पहले बीजोपचार अवश्य करें.",
    market: "एगमार्कनेट पोर्टल पर स्थानीय बाजार दरों को ट्रैक करें. भाव अच्छे होने पर ही उपज बेचें.",
    general: "एक अनुभवी कृषि अधिकारी के रूप में, मैं रासायनिक उर्वरकों के साथ जैविक खाद का उपयोग करने और रोजाना फसलों की निगरानी करने की सलाह ढंग से देने की सलाह दूंगा।"
  },
  ta: {
    diseases: "பயிர் நோய்களைக் கட்டுப்படுத்த, செடிகளுக்கு இடையே போதிய இடைவெளி விட்டு, பாதிக்கப்பட்ட இலைகளை அகற்றி, வேப்ப எண்ணெய் தெளிக்கவும்.",
    fertilizers: "மண் பரிசோதனை செய்து உரமிடுங்கள். தழைச்சத்து இலை வளர்ச்சிக்கும், மணிச்சத்து வேர் வளர்ச்சிக்கும், சாம்பல்சத்து நோய் எதிர்ப்புக்கும் உதவும்.",
    organic: "இயற்கை விவசாயம் மண்ணின் வளத்தை மேம்படுத்தும். மண்புழு உരം, வேப்பம் புண்ணாக்கு மற்றும் டிரைக்கோடெர்மா பயன்படுத்தவும்.",
    irrigation: "சொட்டுநீர் பாசனம் தண்ணீரைச் சேமிக்கும். அதிகாலை வேளையில் நீர் பாய்ச்சுவது நீர் ஆவியாவதைத் தடுக்கும்.",
    weather: "மழை பெய்யும் வாய்ப்பு இருந்தால் பூச்சிக்கொல்லி தெளிப்பதைத் தள்ளிப்போடுங்கள். வடிகால் வசதியைச் சீரமைக்கவும்.",
    pests: "பூச்சிகளைக் கட்டுப்படுத்த மஞ்சள் ஒட்டும் பொறிகளைப் பயன்படுத்தவும். 5% வேப்பங்கொட்டை கரைசல் தெளிக்கவும்.",
    rotation: "மண்ணின் நைட்ரஜன் அளவை அதிகரிக்க சோளம் அல்லது பருத்திக்கு பின் உளுந்து அல்லது நிலக்கடலை பயிரிடவும்.",
    harvesting: "வறண்ட வானிலையில் அறுவடை செய்யுங்கள். தானியங்களை நன்கு உலர்த்திய பின் சேமிக்கவும்.",
    schemes: "விவசாயிகள் பிரதமரின் கிசான் திட்டம், பயிர் காப்பீட்டுத் திட்டம் மற்றும் மண்வள அட்டை திட்டங்களைப் பயன்படுத்தலாம்.",
    livestock: "கால்நடைகளுக்கு தூய்மையான நீர், உலர் படுக்கை மற்றும் பசுந்தீவனம் வழங்கவும். கோமாரி நோய் தடுப்பூസി போடுங்கள்.",
    seeds: "சான்றளிக்கப்பட்ட நோய் எதிர்ப்புத் திறன் கொண்ட விதைகளை மட்டுமே பயன்படுத்தவும். விதை நேர்த்தி செய்வது அவசியம்.",
    market: "அக்மார்க்நெட் இணையதளத்தில் சந்தை விலையை அறிந்து கொள்ளுங்கள். விலை உயரும் போது விற்பனை செய்யுங்கள்.",
    general: "விவசாய அதிகாரியாக எனது அறிவுரை, ரசாயன உரங்களுடன் இயற்கை உரங்களையும் சேர்த்துப் பயன்படுத்துங்கள், பயிர்களை தினமும் கண்காணியுங்கள்."
  },
  kn: {
    diseases: "ಬೆಳೆ ರೋಗಗಳನ್ನು ತಡೆಗಟ್ಟಲು, ಗಿಡಗಳ ನಡುವೆ ಸೂಕ್ತ ಅಂತರವಿಡಿ, ರೋಗಗ್ರಸ್ತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ಮತ್ತು ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ.",
    fertilizers: "ಮಣ್ಣು ಪರೀಕ್ಷೆ ಆಧಾರದ ಮೇಲೆ ರಸಗೊಬ್ಬರ ಬಳಸಿ. ಸಾರಜನಕ ಎಲೆಗಳ ಬೆಳವಣಿಗೆಗೆ, ರಂಜಕ ಬೇರುಗಳ ಬಲವರ್ಧನೆಗೆ ಮತ್ತು ಪೊಟ್ಯಾಶ್ ರೋಗ ನಿರೋಧಕತೆಗೆ ಸಹಕಾರಿ.",
    organic: "ಸಾವಯವ ಕೃಷಿ ಮಣ್ಣಿನ ಆರೋಗ್ಯವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ. ವರ್ಮಿಕಾಂಪೋಸ್ಟ್ ಮತ್ತು ಟ್ರೈಕೋಡರ್ಮಾ ಮುಂತಾದ ಜೈವಿಕ ಗೊಬ್ಬರಗಳನ್ನು ಬಳಸಿ.",
    irrigation: "ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿಯು ನೀರನ್ನು ಉಳಿಸುತ್ತದೆ. ಬೆಳಗಿನ ಸಮಯದಲ್ಲಿ ನೀರುಣಿಸುವುದರಿಂದ ಬಾಷ್ಪೀಕರಣ ತಡೆಯಬಹುದು.",
    weather: "ಮಳೆ ಬರುವ ಸೂಚನೆ ಇದ್ದರೆ ಕ್ರಿಮಿನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ. ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಕಾಲುವೆಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ.",
    pests: "ಕೀಟಗಳ ನಿಯಂತ್ರಣಕ್ಕೆ ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಬಳಸಿ. ಶೇಕಡಾ 5 ರಷ್ಟು ಬೇವಿನ ಕಷಾಯ ಸಿಂಪಡಿಸಿ.",
    rotation: "ಮಣ್ಣಿನಲ್ಲಿ ಸಾರಜನಕ ಮರುಸ್ಥಾಪಿಸಲು ಏಕದಳ ಧಾನ್ಯಗಳ ನಂತರ ಕಡಲೆ ಅಥವಾ ನೆಲಗಡಲೆಯಂತಹ ದ್ವಿದಳ ಧಾನ್ಯಗಳನ್ನು ಬೆಳೆಯಿರಿ.",
    harvesting: "ಒಣ ಹವಾಮಾನದಲ್ಲಿ ಬೆಳೆ ಕಟಾವು ಮಾಡಿ. ಸಂಗ್ರಹಿಸುವ ಮುನ್ನ ಧಾನ್ಯವನ್ನು ಸಂಗ್ರಹಿಸಿ ಒಣಗಿಸಿ.",
    schemes: "ರೈತರು ಪಿಎಂ-ಕಿಸಾನ್, ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ ಮತ್ತು ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆಗಳ ಸೌಲಭ್ಯ ಪಡೆಯಬಹುದು.",
    livestock: "ಜಾನುವಾರುಗಳಿಗೆ ಸ್ವಚ್ಛ ನೀರು, ಹಸಿರು ಮೇವು ನೀಡಿ. ಕಾಲುಬಾಯಿ ರೋಗದ ಲಸಿಕೆಗಳನ್ನು ತಪ್ಪದೇ ಹಾಕಿಸಿ.",
    seeds: "ಯಾವಾಗಲೂ ಪ್ರಮಾಣೀಕೃತ ಗುಣಮಟ್ಟದ ಬೀಜಗಳನ್ನು ಬಳಸಿ. ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಬೀಜೋಪಚಾರ ಮಾಡಿ.",
    market: "ಮಾರುಕಟ್ಟೆ ದರಗಳಿಗಾಗಿ ಅಗ್‌ಮಾರ್ಕೆಟ್ಟನೆಟ್ ಪೋರ್ಟಲ್ ವೀಕ್ಷಿಸಿ. ಬೆಲೆ ಹೆಚ್ಚಾದಾಗ ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಮಾರಾಟ ಮಾಡಿ.",
    general: "ಕೃಷಿ ಅಧಿಕಾರಿಯಾಗಿ ನನ್ನ ಸಲಹೆ ಏನೆಂದರೆ, ರಾಸಾಯನಿಕ ಗೊಬ್ಬರದ ಜೊತೆಗೆ ಸಾವയವ ಗೊಬ್ಬರ ಬಳಸಿ, ದಿನನಿತ್ಯ ಬೆಳೆಗಳನ್ನು ಗಮನಿಸಿ."
  },
  ml: {
    diseases: "വിള രോഗങ്ങൾ നിയന്ത്രിക്കുന്നതിന്, ചെടികൾ തമ്മിൽ കൃത്യമായ അകലം പാലിക്കുക, രോഗം ബാധിച്ച ഇലകൾ നീക്കം ചെയ്യുക, വേപ്പെണ്ണ തളിക്കുക.",
    fertilizers: "മണ്ണു പരിശോധനയുടെ അടിസ്ഥാനത്തിൽ വളപ്രയോഗം നടത്തുക. നൈട്രജൻ ഇലകളുടെ വളർച്ചയ്ക്കും, ഫോസ്ഫറസ് വേരുകളുടെ ബലത്തിനും, പൊട്ടാസ്യം രോഗപ്രതിരോധശേഷിക്കും സഹായിക്കും.",
    organic: "ജൈവകൃഷി മണ്ണിലെ ഫലഭൂയിഷ്ഠത കൂടുന്നു. വേപ്പിൻപിണ്ണാക്ക്, ട്രൈക്കോഡെർമ തുടങ്ങിയ ജൈവവളങ്ങൾ ഉപയോഗിക്കുക.",
    irrigation: "തുള്ളിനന ജലം ലാഭിക്കാൻ സഹായിക്കും. ബാഷ്പീകരണം തടയാൻ അതിരാവിലെ നനയ്ക്കുന്നതാണ് ഉചിതം.",
    weather: "മഴയ്ക്ക് സാധ്യതയുണ്ടെങ്കിൽ കീടനാശിനി പ്രയോഗം ഒഴിവാക്കുക. കൃഷിയിടത്തിൽ വെള്ളക്കെട്ട് ഒഴിവാക്കാൻ ഡ്രെയിനേജ് ഒരുക്കുക.",
    pests: "കീടങ്ങളെ നശിപ്പിക്കാൻ മഞ്ഞ കെണികൾ ഉപയോഗിക്കുക. 5% വേപ്പിൻകുരു ലായനി തളിക്കുക.",
    rotation: "മണ്ണിലെ നൈട്രജൻ നിലനിർത്താൻ ധാന്യവിളകൾക്ക് ശേഷം പയറുവർഗ്ഗങ്ങളോ നിലക്കടലയോ കൃഷി ചെയ്യുക.",
    harvesting: "വരണ്ട കാലാവസ്ഥയിൽ വിളവെടുപ്പ് നടത്തുക. ഈർപ്പം തട്ടാതെ സൂക്ഷിക്കുന്നതിനായി ധാന്യങ്ങൾ നന്നായി ഉണക്കുക.",
    schemes: "കർഷകർക്ക് പിഎം-കിസാൻ, വിള ഇൻഷുറൻസ്, സോയിൽ ഹെൽത്ത് കാർഡ് പദ്ധതികൾ പ്രയോജനപ്പെടുത്താം.",
    livestock: "കന്നുകാലികൾക്ക് ശുദ്ധമായ വെള്ളവും പച്ചപ്പുല്ലും നൽകുക. കുളമ്പുരോഗത്തിനെതിരെയുള്ള വാക്സിനുകൾ എടുക്കുക.",
    seeds: "ഗുണനിലവാരമുള്ള രോഗപ്രതിരോധശേഷിയുള്ള വിത്തുകൾ ഉപയോഗിക്കുക. വിതയ്ക്കുന്നതിന് മുൻപ് വിത്തുഗുണമേന്മ ഉറപ്പാക്കുക.",
    market: "വിപണി വിലകൾ അറിയാൻ അഗ്രിമാർക്കറ്റ് നെറ്റ് പോർട്ടൽ സന്ദർശിക്കുക. നല്ല വിലയുള്ളപ്പോൾ വിളകൾ വിൽക്കുക.",
    general: "ഒരു കാർഷിക ഉദ്യോഗസ്ഥൻ എന്ന നിലയിൽ, രാസവളങ്ങൾക്കൊപ്പം ജൈവവളവും ചേർക്കുക, ദിവസവും വിളകൾ നിരീക്ഷിക്കുക എന്ന് ഞാൻ നിർദ്ദേശിക്കുന്നു."
  }
};

let globalAudioPlayer = null;

export const detectLanguage = (text) => {
  if (!text) return 'en';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
  return 'en';
};

export const stopSpeechPlayback = () => {
  if (globalAudioPlayer) {
    globalAudioPlayer.pause();
    globalAudioPlayer.src = "";
    globalAudioPlayer = null;
  }
};

const playBase64Audio = (base64String) => {
  try {
    stopSpeechPlayback();

    const audioUrl = `data:audio/mp3;base64,${base64String}`;
    globalAudioPlayer = new Audio(audioUrl);
    globalAudioPlayer.play().catch(e => {
      console.warn("Audio auto-playback failed (possibly browser user-interaction rules):", e);
    });
  } catch (err) {
    console.error("Audio player synthesis initialization failed:", err);
  }
};

export const useGemini = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('agritwin_copilot_chat_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'welcome',
        sender: 'ai',
        text: FALLBACK_ANSWERS.en.general,
        resolvedLang: 'en',
        timestamp: new Date().toISOString()
      }
    ];
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('agritwin_copilot_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  const askQuestion = async (textInput, lang = 'auto', farm = null, metrics = null, voiceEnabled = false) => {
    if (!textInput.trim()) return null;

    const resolved = lang === 'auto' ? detectLanguage(textInput) : lang;

    const userMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textInput,
      resolvedLang: resolved,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const fallbackResponse = () => {
      const query = textInput.toLowerCase();
      let topic = 'general';
      if (query.includes('disease') || query.includes('leaf') || query.includes('spot') || query.includes('rot') || query.includes('wilt') || query.includes('blight') || query.includes('blast')) {
        topic = 'diseases';
      } else if (query.includes('fertilizer') || query.includes('manure') || query.includes('nitrogen') || query.includes('potassium') || query.includes('phosphorus') || query.includes('urea') || query.includes('npk') || query.includes('compost') || query.includes('fertility')) {
        topic = 'fertilizers';
      } else if (query.includes('organic') || query.includes('natural') || query.includes('bio') || query.includes('vermicompost') || query.includes('neem')) {
        topic = 'organic';
      } else if (query.includes('irrigate') || query.includes('water') || query.includes('drip') || query.includes('moisture') || query.includes('wet')) {
        topic = 'irrigation';
      } else if (query.includes('weather') || query.includes('rain') || query.includes('monsoon') || query.includes('wind') || query.includes('storm') || query.includes('forecast')) {
        topic = 'weather';
      } else if (query.includes('pest') || query.includes('bug') || query.includes('worm') || query.includes('insect') || query.includes('whitefly') || query.includes('caterpillar')) {
        topic = 'pests';
      } else if (query.includes('rotate') || query.includes('rotation') || query.includes('legume')) {
        topic = 'rotation';
      } else if (query.includes('harvest') || query.includes('dry') || query.includes('grain') || query.includes('storage')) {
        topic = 'harvesting';
      } else if (query.includes('scheme') || query.includes('pm-kisan') || query.includes('kusum') || query.includes('subsidy') || query.includes('grant')) {
        topic = 'schemes';
      } else if (query.includes('cow') || query.includes('buffalo') || query.includes('cattle') || query.includes('livestock') || query.includes('goat') || query.includes('fodder') || query.includes('milk') || query.includes('fish') || query.includes('fishery')) {
        topic = 'livestock';
      } else if (query.includes('seed') || query.includes('sow') || query.includes('germinate')) {
        topic = 'seeds';
      } else if (query.includes('market') || query.includes('price') || query.includes('sell') || query.includes('agmarknet')) {
        topic = 'market';
      }

      const dict = FALLBACK_ANSWERS[resolved] || FALLBACK_ANSWERS.en;
      return dict[topic] || dict.general;
    };

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${API_BASE}/api/copilot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textInput,
          language: resolved,
          farmData: { farm, metrics },
          history: updatedMessages
        })
      });

      if (!response.ok) {
        throw new Error('Backend chat endpoint failed');
      }

      const data = await response.json();
      const aiResponseText = data.text || fallbackResponse();
      const audioBase64 = data.audio;

      const aiMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: aiResponseText,
        resolvedLang: resolved,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);

      if (voiceEnabled && audioBase64) {
        playBase64Audio(audioBase64);
      }
      return aiResponseText;
    } catch (err) {
      console.warn('Backend copilot chat failed. Using client fallback:', err);
      const fallbackText = fallbackResponse();

      const aiMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: fallbackText,
        resolvedLang: resolved,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Client-side fallback does not have backend base64 audio, but we can log it gracefully
      return fallbackText;
    }
  };

  const clearChat = (lang = 'en') => {
    const welcomeText = FALLBACK_ANSWERS[lang]?.general || FALLBACK_ANSWERS.en.general;
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: welcomeText,
        resolvedLang: lang,
        timestamp: new Date().toISOString()
      }
    ]);
    stopSpeechPlayback();
  };

  return {
    messages,
    isLoading,
    askQuestion,
    clearChat,
    stopSpeech: stopSpeechPlayback
  };
};
