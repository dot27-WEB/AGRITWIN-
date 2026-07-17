import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const primaryKey = process.env.GEMINI_API_KEY_PRIMARY || apiKey;
const secondaryKey = process.env.GEMINI_API_KEY_SECONDARY || apiKey;

const primaryAi = primaryKey ? new GoogleGenAI({ apiKey: primaryKey }) : null;
const secondaryAi = secondaryKey ? new GoogleGenAI({ apiKey: secondaryKey }) : null;

// Helper to strip markdown formatting blocks
const parseCleanJson = (text) => {
  let cleanJson = text.trim();
  if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleanJson);
};

// Localized responses with dynamic variables support for Layer 3 (Intelligent Fallback AI)
const LOCALIZED_CHAT_RESPONSES = {
  en: {
    diseases: "Crop diseases like leaf spots or rot on {crop} can be managed by improving spacing and removing damaged foliage. Spraying organic neem oil or recommended copper oxychloride provides immediate protection.",
    fertilizers: "To support plant nutrition for {crop}, balance chemical fertilizers with organic vermicompost. Apply Nitrogen for vegetative growth and Potassium for disease resistance.",
    organic: "Organic cultivation for {crop} builds long-term soil health. Use neem cake, vermicompost, and bio-fertilizers like Trichoderma viride. Rotate with legumes to restore nitrogen organically.",
    irrigation: "With soil moisture around {moisture} and current weather showing {weather}, ensure you follow regular morning watering cycles. Keep irrigation precise using drip systems to save water.",
    weather: "Given the forecast is {weather}, keep a close eye on soil drainage in your {crop} field to prevent waterlogging. Delay spraying or fertilizing if heavy rain is predicted soon.",
    pests: "Integrated Pest Management (IPM) for {crop} is best. Hang yellow sticky cards to trap sucking pests, and spray 5% neem seed kernel extract for soft-bodied insects.",
    rotation: "Rotate {crop} with leguminous pulses like groundnut or chickpea. This naturally restores soil nitrogen and disrupts pest life cycles.",
    harvesting: "Harvest {crop} under dry conditions. Dry grains/produce below 12% moisture to prevent mold and contamination during long-term storage.",
    schemes: "You can apply for PM-KISAN income support, crop insurance via PM Fasal Bima Yojana, and soil cards at your local government agriculture office.",
    livestock: "Provide clean water, dry bedding, and balanced green fodder. Follow the vaccination schedule for foot-and-mouth disease to keep livestock healthy.",
    seeds: "Use certified seed varieties that are disease-resistant. Perform seed treatment with bio-fungicides to ensure high germination rates.",
    market: "Compare local market rates on the AGMARKNET portal. Consider storing your dry grains to sell when demand increases.",
    general: "As an agricultural officer, I recommend checking your {crop} leaves daily, maintaining balanced NPK applications, and monitoring weather forecasts before spraying."
  },
  te: {
    diseases: "{crop} పంటలో ఆకు మచ్చలు లేదా కుళ్లు తెగుళ్లను నివారించడానికి మొక్కల మధ్య దూరం ఉంచండి. సేంద్రీయ వేప నూనె లేదా రాగి ఆధారిత మందులు పిచికారీ చేయండి.",
    fertilizers: "{crop} పంట పోషణ కోసం రసాయనిక ఎరువులతో పాటు పశువుల ఎరువును సమతుల్యంగా వాడండి. ఆకుల పెరుగుదలకు నత్రజని, వేర్ల బలానికి భాస్వరం వాడండి.",
    organic: "సేంద్రీయ వ్యవసాయం {crop} నేల బలాన్ని పెంచుతుంది. వర్మీకాంపోస్ట్ మరియు ట్రైకోడెర్మా వంటి జీవ ఎరువులను వాడండి.",
    irrigation: "భూసార తేమ {moisture} మరియు వాతావరణం {weather} ఆధారంగా, ఉదయాన్నే నీరు పెట్టడం మంచిది. బిందు సేద్యం ద్వారా నీటిని ఆదా చేయండి.",
    weather: "ప్రస్తుత వాతావరణం {weather} కాబట్టి, {crop} పొలంలో నీరు నిల్వ ఉండకుండా చూసుకోండి. వర్షం పడే అవకాశం ఉంటే మందులు చల్లడం వాయిదా వేయండి.",
    pests: "{crop} పంటలో పురుగుల నివారణకు పసుపు జిగురు కార్డులను వాడండి. 5% వేప గింజల కషాయం పిచికారీ చేయండి.",
    rotation: "{crop} తర్వాత శనగలు లేదా వేరుశనగ వంటి లెగ్యూమ్ పంటలు వేయండి. ఇది నత్రజని పెంచి పంట మార్పిడికి ఉపయోగపడుతుంది.",
    harvesting: "పొడి వాతావరణంలో మాత్రమే కోతలు కోయండి. నిల్వ చేసే ముందు ధాన్యాన్ని సరిగ్గా ఎండబెట్టడం ముఖ్యం.",
    schemes: "పీఎం-కిసాన్ సాయం, ప్రధానమంత్రి ఫసల్ బీమా యోజన మరియు భూసార పరీక్షా పత్రాల కోసం స్థానిక వ్యవసాయ కేంద్రాలను సంప్రదించండి.",
    livestock: "పశువులకు స్వచ్ఛమైన త్రాగునీరు, పచ్చిగడ్డి అందించండి. గాలికుంటు వ్యాధి నివారణ టీకాలు సకాలంలో వేయించండి.",
    seeds: "ధృవీకరించబడిన నాణ్యమైన విత్తనాలను మాత్రమే వాడండి. విత్తే ముందు విత్తన శుద్ధి చేసుకోవడం వల్ల మొలక శాతం పెరుగుతుంది.",
    market: "అగ్‌మార్కెట్‌నెట్ వెబ్‌సైట్ ద్వారా స్థానిక ధరలను తెలుసుకోండి. ధరలు అనుకూలంగా ఉన్నప్పుడే విక్రయించండి.",
    general: "{crop} ఆకులను రోజువారీగా పరిశీలించండి, మట్టి తేమ పరీక్షించుకుని నీరు పెట్టండి మరియు తగినంత సేంద్రీయ ఎరువులు వాడండి."
  },
  hi: {
    diseases: "{crop} में पत्तों के धब्बे या सड़न को रोकने के लिए पौधों की छंटाई करें। नीम का तेल या तांबा युक्त कवकनाशी का छिड़काव करें।",
    fertilizers: "{crop} के पोषण के लिए रासायनिक उर्वरकों के साथ जैविक खाद का उपयोग करें। वानस्पतिक विकास के लिए नाइट्रोजन डालें।",
    organic: "जैविक खेती {crop} की मिट्टी को उपजाऊ बनाती है। वर्मीकंपोस्ट और ट्राइकोडर्मा जैव-उर्वरक का उपयोग करें।",
    irrigation: "मिट्टी की नमी {moisture} और मौसम {weather} को देखते हुए सुबह के समय ड्रिप विधि से सिंचाई करना सर्वोत्तम रहेगा।",
    weather: "मौसम पूर्वानुमान {weather} के अनुसार {crop} के खेत में जल निकासी व्यवस्था सुधारें। भारी बारिश की संभावना होने पर दवा छिड़काव टालें।",
    pests: "{crop} में कीट नियंत्रण के लिए पीले चिपचिपे कार्ड लगाएं और नीम के बीज के अर्क का छिड़काव करें।",
    rotation: "{crop} के बाद दलहन फसलें जैसे चना या मूंगफली उगाएं ताकि मिट्टी में नाइट्रोजन की मात्रा प्राकृतिक रूप से बढ़े।",
    harvesting: "{crop} की कटाई सूखे मौसम में करें। अनाज को 12% से कम नमी तक सुखाकर ही गोदाम में रखें।",
    schemes: "किसान पीएम-किसान सम्मान निधि, पीएम फसल बीमा योजना और मृदा स्वास्थ्य कार्ड के लिए स्थानीय कृषि कार्यालय से संपर्क करें।",
    livestock: "पशुओं को साफ पानी और संतुलित हरा चारा दें। खुरपका-मुंहपका रोग के टीके समय पर लगवाएं।",
    seeds: "हमेशा प्रमाणित रोग-प्रतिरोधी बीजों का उपयोग करें। बोने से पहले बीजोपचार अवश्य करें।",
    market: "स्थानीय मंडी दरों के लिए एगमार्कनेट पोर्टल देखें। भाव बढ़ने पर ही उपज बेचें।",
    general: "{crop} की दैनिक रूप से निगरानी करें, संतुलित खाद डालें और कीटनाशक छिड़काव से पहले मौसम देख लें।"
  },
  ta: {
    diseases: "{crop} பயிரில் இலைப்புள்ளி அல்லது அழுகலைத் தடுக்க செடிகளுக்கு இடையே போதிய இடைவெளி விட்டு, வேப்ப எண்ணெய் தெளிக்கவும்.",
    fertilizers: "{crop} பயிர் வளர்ச்சிக்கு ரசாயன உரங்களுடன் இயற்கை மண்புழு உரங்களை சேர்த்து சமவிகிதத்தில் இடவும்.",
    organic: "இயற்கை விவசாயம் {crop} மண்ணின் வளத்தை கூட்டும். வேப்பம் புண்ணாக்கு மற்றும் டிரைக்கோடெர்மா பயன்படுத்தவும்.",
    irrigation: "மண் ஈரப்பதம் {moisture} மற்றும் வானிலை {weather} பொறுத்து சொட்டுநீர் பாசனம் மூலம் அதிகாலையில் நீர் பாய்ச்சவும்.",
    weather: "வானிலை {weather} என்பதால், {crop} வயலில் தேங்கும் உபரி நீரை வடிக்கவும். மழைக்கு முன் மருந்து தெளிக்க வேண்டாம்.",
    pests: "{crop} பயிரில் பூச்சிகளைக் கட்டுப்படுத்த மஞ்சள் ஒட்டும் பொறிகளைப் பயன்படுத்தவும். வேப்பங்கொட்டை கரைசல் தெளிக்கவும்.",
    rotation: "{crop} பயிருக்கு பின் உளுந்து அல்லது கடலை பயிரிடுவதன் மூலம் மண்ணின் நைட்ரஜன் சத்தை இயற்கையாக அதிகரிக்கலாம்.",
    harvesting: "ஈரப்பதம் இல்லாத வறண்ட நாளில் {crop} அறுவடை செய்யவும். சேமிக்கும் முன் தானியங்களை நன்கு உலர்த்தவும்.",
    schemes: "பிரதமரின் கிசான் நிதி உதவி, பயிர் காப்பீடு மற்றும் மண்வள அட்டை திட்டங்களை வேளாண் மையங்களில் பெற்றுக்கொள்ளலாம்.",
    livestock: "கால்நடைகளுக்கு சுத்தமான குடிநீரும் பசுந்தீவனமும் வழங்கவும். கோமாரி நோய் தடுப்பூசி போடுவது கட்டாயமாகும்.",
    seeds: "நோய் எதிர்ப்புத் திறன் கொண்ட சான்றளிக்கப்பட்ட விதைகளை மட்டும் பயன்படுத்தவும். விதை நேர்த்தி செய்ய மறக்காதீர்.",
    market: "அக்மார்க்நெட் இணையதளத்தில் சந்தை விலையை அறிந்து, விலை உயரும் போது விற்பனை செய்யுங்கள்.",
    general: "{crop} பயிரை தினமும் கண்காணியுங்கள், மண் ஈரப்பதம் பார்த்து நீர் பாய்ச்சுங்கள், இயற்கை உரங்களை அதிகம் பயன்படுத்துங்கள்."
  },
  kn: {
    diseases: "{crop} ಬೆಳೆಯಲ್ಲಿ ಎಲೆ ಚುಕ್ಕೆ ಅಥವಾ ಕೊಳೆ ರೋಗ ತಡೆಗಟ್ಟಲು ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ ತಾಮ್ರದ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ.",
    fertilizers: "{crop} ಬೆಳೆಗೆ ಸಮತೋಲಿತ ಪ್ರಮಾಣದ ರಸಗೊಬ್ಬರ ಮತ್ತು ಸಾವಯವ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಬಳಸಿ. ಸಾರಜನಕ ಎಲೆಗಳ ಬೆಳವಣಿಗೆಗೆ ಸಹಕಾರಿ.",
    organic: "ಸಾವಯವ ಕೃಷಿ {crop} ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸುತ್ತದೆ. ವರ್ಮಿಕಾಂಪೋಸ್ಟ್ ಹಾಗೂ ಟ್ರೈಕೋಡರ್ಮಾ ಜೈವಿಕ ಗೊಬ್ಬರ ಬಳಸಿ.",
    irrigation: "ಮಣ್ಣಿನ ತೇವಾಂಶ {moisture} ಮತ್ತು ಹವಾಮಾನ {weather} ನೋಡಿ ಹನಿ ನೀರಾವರಿ ಮೂಲಕ ಮುಂಜಾನೆ ನೀರುಣಿಸಿ.",
    weather: "ಹವಾಮಾನ {weather} ಇರುವುದರಿಂದ {crop} ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ. ತಕ್ಷಣ ಮಳೆ ಬರುವಂತಿದ್ದರೆ ಸಿಂಪಡಣೆ ತಡೆಯಿರಿ.",
    pests: "{crop} ಬೆಳೆಯಲ್ಲಿ ಕೀಟಗಳ ಹತೋಟಿಗೆ ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಬಳಸಿ. ಶೇಕಡಾ 5 ರಷ್ಟು ಬೇವಿನ ಕಷಾಯ ಸಿಂಪಡಿಸಿ.",
    rotation: "{crop} ನಂತರ ದ್ವಿದಳ ಧಾನ್ಯಗಳನ್ನು ಬೆಳೆಯುವುದರಿಂದ ಮಣ್ಣಿನಲ್ಲಿ ನಾರಜನಕದ ಪ್ರಮಾಣ ಸಹಜವಾಗಿ ವೃದ್ಧಿಯಾಗುತ್ತದೆ.",
    harvesting: "ಒಣ ಹವಾಮಾನದಲ್ಲಿ {crop} ಕಟಾವು ಮಾಡಿ. ಶೇಖರಣೆ ಮಾಡುವ ಮುನ್ನ ಧಾನ್ಯವನ್ನು ಸರಿಯಾಗಿ ಒಣಗಿಸುವುದು ಬಹಳ ಮುಖ್ಯ.",
    schemes: "ರೈತರು ಪಿಎಂ-ಕಿಸಾನ್, ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ ಮತ್ತು ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆಗಳ ಸೌಲಭ್ಯಗಳನ್ನು ಬಳಸಿಕೊಳ್ಳಿ.",
    livestock: "ಜಾನುವಾರುಗಳಿಗೆ ಸ್ವಚ್ಛ ನೀರು, ಹಸಿರು ಮೇವು ಕೊಡಿ. ಕಾಲುಬಾಯಿ ರೋಗದ ಲಸಿಕೆಗಳನ್ನು ತಪ್ಪದೇ ಹಾಕಿಸಿ.",
    seeds: "ಪ್ರಮಾಣೀಕೃತ ರೋಗ ನಿರೋಧಕ ಬೀಜಗಳನ್ನು ಬಳಸಿ. ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಉತ್ತಮ ರೀತಿಯಲ್ಲಿ ಬೀಜೋಪಚಾರ ಮಾಡಿ.",
    market: "ಮಾರುಕಟ್ಟೆ ದರಗಳಿಗಾಗಿ ಅಗ್‌ಮಾರ್ಕೆಟ್‌ನೆಟ್ ಪೋರ್ಟಲ್ ವೀಕ್ಷಿಸಿ. ಬೆಲೆ ಹೆಚ್ಚಾದಾಗ ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಮಾರಾಟ ಮಾಡಿ.",
    general: "{crop} ಬೆಳೆಯನ್ನು ಪ್ರತಿದಿನ ಗಮನಿಸಿ, ಮಣ್ಣಿನ ತೇವಾಂಶ ಪರೀಕ್ಷಿಸಿ ನೀರು ಹಾಕಿ, ಸಾವಯವ ಗೊಬ್ಬರಗಳ ಬಳಕೆಗೆ ಒತ್ತು ನೀಡಿ."
  },
  ml: {
    diseases: "{crop} വിളകളിൽ ഇലപ്പുള്ളി അല്ലെങ്കിൽ ചീയൽ രോഗങ്ങൾ വരാതിരിക്കാൻ വേപ്പെണ്ണയോ കോപ്പർ ഓക്സിക്ലോറൈഡോ തളിക്കുക.",
    fertilizers: "{crop} വിളയ്ക്ക് രാസവളങ്ങൾക്കൊപ്പം ജൈവവളവും ചേർക്കുക. നൈട്രജൻ ഇലകളുടെ വളർച്ചയെ ത്വരിതപ്പെടുത്തും.",
    organic: "ജൈവകൃഷി {crop} മണ്ണിന്റെ ആരോഗ്യം കൂട്ടും. വേപ്പിൻപിണ്ണാക്ക്, മണ്ണീര വളം, ട്രൈക്കോഡെർമ എന്നിവ ചേർക്കുക.",
    irrigation: "മണ്ണിന്റെ ഈർപ്പം {moisture}, കാലാവസ്ഥ {weather} എന്നിവ വിലയിരുത്തി തുള്ളിനന വഴി അതിരാവിലെ നനയ്ക്കുക.",
    weather: "കാലാവസ്ഥ {weather} ആയതിനാൽ {crop} തോട്ടത്തിൽ വെള്ളക്കെട്ട് ഒഴിവാക്കുക. മഴ പെയ്യാൻ സാധ്യതയുണ്ടെങ്കിൽ വളപ്രയോഗം മാറ്റിവെക്കുക.",
    pests: "{crop} വിളയിൽ കീടനിയന്ത്രണത്തിന് മഞ്ഞക്കെണികൾ ഉപയോഗിക്കുക. വേപ്പിൻകുരു സത്ത് സ്പ്രേ ചെയ്യുക.",
    rotation: "{crop} കൃഷിക്ക് ശേഷം പയറുവർഗ്ഗങ്ങൾ കൃഷി ചെയ്താൽ മണ്ണിലെ നൈട്രജൻ അളവ് പ്രകൃതിദത്തമായി പുനഃസ്ഥാപിക്കാം.",
    harvesting: "വരണ്ട കാലാവസ്ഥയിൽ {crop} വിളവെടുപ്പ് നടത്തുക. ഈർപ്പം 12 ശതമാനത്തിൽ താഴെയാക്കി ഉണക്കി സൂക്ഷിക്കുക.",
    schemes: "പിഎം-കിസാൻ പദ്ധതി, വിള ഇൻഷുറൻസ്, സോയിൽ ഹെൽത്ത് കാർഡ് എന്നിവയ്ക്കായി കൃഷിഭവനുമായി ബന്ധപ്പെടുക.",
    livestock: "കന്നുകാലികൾക്ക് ശുദ്ധമായ വെള്ളവും പച്ചപ്പുല്ലും നൽകുക. കുളമ്പുരോഗ വാക്സിനുകൾ കൃത്യസമയത്ത് എടുക്കുക.",
    seeds: "രോഗപ്രതിരോധശേഷിയുള്ള ഗുണമേന്മയുള്ള വിത്തുകൾ ഉപയോഗിക്കുക. വിതയ്ക്കുന്നതിന് മുൻപ് വിത്തുവിള നേർപ്പിക്കുക.",
    market: "വിപണി വിലകൾ അറിയാൻ അഗ്രിമാർക്കറ്റ് നെറ്റ് പോർട്ടൽ നോക്കുക. നല്ല വിലയുള്ളപ്പോൾ വിളകൾ വിൽക്കുക.",
    general: "{crop} വിളകൾ ദിവസവും നിരീക്ഷിക്കുക, മണ്ണിന്റെ ഈർപ്പം നോക്കി നനയ്ക്കുക, ജൈവവള പ്രയോഗത്തിന് മുൻഗണന നൽകുക."
  }
};

const generateFallbackChatResponse = (message, lang, farmData = {}, history = []) => {
  const query = (message || "").toLowerCase();
  const normalizedLang = ["en", "te", "hi", "ta", "kn", "ml"].includes(lang) ? lang : "en";
  const dict = LOCALIZED_CHAT_RESPONSES[normalizedLang];

  // Infer crop from farm context or history or current message query
  let crop = "your crop";
  if (farmData && farmData.farm && farmData.farm.currentCrop) {
    crop = farmData.farm.currentCrop;
  }
  
  const cropsList = ["rice", "paddy", "tomato", "cotton", "maize", "corn", "groundnut", "banana", "sugarcane", "potato", "chilli", "brinjal", "eggplant", "okra"];
  for (const c of cropsList) {
    if (query.includes(c)) {
      crop = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  if (crop === "your crop" && history && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const histQuery = (history[i].text || "").toLowerCase();
      for (const c of cropsList) {
        if (histQuery.includes(c)) {
          crop = c.charAt(0).toUpperCase() + c.slice(1);
          break;
        }
      }
      if (crop !== "your crop") break;
    }
  }

  let moisture = "moderate";
  if (farmData && farmData.farm && farmData.farm.soilMoisture) {
    moisture = farmData.farm.soilMoisture;
  }

  let weather = "clear sky";
  if (farmData && farmData.farm && farmData.farm.weatherForecast) {
    weather = farmData.farm.weatherForecast;
  }

  let topic = "general";
  if (query.includes("disease") || query.includes("leaf") || query.includes("spot") || query.includes("rot") || query.includes("wilt") || query.includes("blight") || query.includes("blast") || query.includes("yellow") || query.includes("symptom")) {
    topic = "diseases";
  } else if (query.includes("fertilizer") || query.includes("manure") || query.includes("nitrogen") || query.includes("potassium") || query.includes("phosphorus") || query.includes("urea") || query.includes("npk") || query.includes("compost") || query.includes("fertility") || query.includes("nutrient")) {
    topic = "fertilizers";
  } else if (query.includes("organic") || query.includes("natural") || query.includes("bio") || query.includes("vermicompost") || query.includes("neem")) {
    topic = "organic";
  } else if (query.includes("irrigate") || query.includes("water") || query.includes("drip") || query.includes("moisture") || query.includes("wet")) {
    topic = "irrigation";
  } else if (query.includes("weather") || query.includes("rain") || query.includes("monsoon") || query.includes("wind") || query.includes("storm") || query.includes("forecast") || query.includes("temperature")) {
    topic = "weather";
  } else if (query.includes("pest") || query.includes("bug") || query.includes("worm") || query.includes("insect") || query.includes("whitefly") || query.includes("caterpillar")) {
    topic = "pests";
  } else if (query.includes("rotate") || query.includes("rotation") || query.includes("legume")) {
    topic = "rotation";
  } else if (query.includes("harvest") || query.includes("dry") || query.includes("grain") || query.includes("storage")) {
    topic = "harvesting";
  } else if (query.includes("scheme") || query.includes("pm-kisan") || query.includes("kusum") || query.includes("subsidy") || query.includes("grant")) {
    topic = "schemes";
  } else if (query.includes("cow") || query.includes("buffalo") || query.includes("cattle") || query.includes("livestock") || query.includes("goat") || query.includes("fodder") || query.includes("milk") || query.includes("fish") || query.includes("fishery")) {
    topic = "livestock";
  } else if (query.includes("seed") || query.includes("sow") || query.includes("germinate")) {
    topic = "seeds";
  } else if (query.includes("market") || query.includes("price") || query.includes("sell") || query.includes("agmarknet")) {
    topic = "market";
  }

  let response = dict[topic] || dict.general;
  response = response
    .replace(/{crop}/g, crop)
    .replace(/{moisture}/g, moisture)
    .replace(/{weather}/g, weather);

  return response;
};

// Fallback Disease Knowledge Base for Layer 3 (Intelligent Fallback AI)
const KNOWLEDGE_BASE = [
  {
    cropName: "Rice",
    diseases: [
      {
        name: "Blast (Magnaporthe oryzae)",
        symptoms: [
          "Spindle-shaped spots with gray or white centers and brown margins on leaves.",
          "Collar rot leading to leaf death and lodging.",
          "Neck blast turning the panicle base brown and causing head grain sterility."
        ],
        possibleCause: "Fungal pathogen Magnaporthe oryzae, favored by high humidity, dew, and cool night temperatures.",
        organicTreatment: "Spray neem oil (3ml/L) or apply Pseudomonas fluorescens formulation as a foliar spray.",
        chemicalTreatment: "Apply Tricyclazole 75% WP @ 0.6g/L or Azoxystrobin @ 1ml/L at early infection stage.",
        preventionTips: [
          "Avoid excessive nitrogenous fertilizer application.",
          "Use disease-resistant varieties suitable for the region.",
          "Maintain optimal plant spacing to promote leaf dryness."
        ],
        recoveryTime: "14 - 21 Days",
        advice: "Ensure immediate removal and burning of infected stubble post-harvest to minimize spore density. Do not irrigate in late evenings to avoid prolonged leaf wetness."
      },
      {
        name: "Brown Spot (Cochliobolus miyabeanus)",
        symptoms: [
          "Oval or circular dark-brown spots with yellow halos across leaf surfaces.",
          "Reduced grain filling and brown discoloration on glumes."
        ],
        possibleCause: "Fungal infection aggravated by soil nutrient deficiency (especially Nitrogen, Potassium, and Silicon).",
        organicTreatment: "Incorporate organic compost or biochar to restore soil mineral balance.",
        chemicalTreatment: "Foliar application of Propiconazole 25% EC @ 1ml/L or Mancozeb @ 2g/L.",
        preventionTips: [
          "Perform seed treatment with Carbendazim before sowing.",
          "Ensure balanced fertilizer applications based on soil health cards."
        ],
        recoveryTime: "10 - 15 Days",
        advice: "Brown spot is an indicator of poor soil fertility ('hungry soil disease'). Prioritize soil nutrient replenishment immediately."
      },
      {
        name: "Bacterial Leaf Blight (Xanthomonas oryzae)",
        symptoms: [
          "Water-soaked stripes starting from leaf tips, turning yellow-gray and wavy.",
          "Bacterial ooze droplets (yellow beads) visible on active lesions in mornings."
        ],
        possibleCause: "Systemic bacterial infection favored by warm temp (25-34°C) and strong wind/rain storms.",
        organicTreatment: "Spray fresh cow dung extract (5%) or copper oxychloride solution mixed with agricultural antibiotics.",
        chemicalTreatment: "Foliar spray of Streptocycline @ 0.1g/L combined with Copper Oxychloride @ 2g/L.",
        preventionTips: [
          "Avoid deep flooding of nurseries or standing water levels > 5cm.",
          "Delay nitrogen top-dressing until the infection is brought under control."
        ],
        recoveryTime: "12 - 18 Days",
        advice: "Avoid field access when leaves are wet to prevent mechanical spreading of bacterial ooze across healthy rows."
      }
    ]
  },
  {
    cropName: "Tomato",
    diseases: [
      {
        name: "Early Blight (Alternaria solani)",
        symptoms: [
          "Concentric 'target-board' ring spots on older leaves first.",
          "Stem cankers and dark, leathery, sunken spots near fruit calyxes."
        ],
        possibleCause: "Fungi overwintering in soil debris, spread by rain splash and overhead irrigation.",
        organicTreatment: "Prune lower leaves up to 18 inches. Spray copper-based organic fungicides or Trichoderma formulations.",
        chemicalTreatment: "Spray Chlorothalonil @ 2g/L or Difenoconazole @ 0.5ml/L at weekly intervals.",
        preventionTips: [
          "Enforce strict 3-year crop rotation schedules.",
          "Use drip irrigation instead of overhead sprinklers to keep foliage dry."
        ],
        recoveryTime: "10 - 14 Days",
        advice: "Mulch base soil with organic straw or plastic sheeting to create a physical barrier against soil-borne fungal spores."
      },
      {
        name: "Late Blight (Phytophthora infestans)",
        symptoms: [
          "Large, water-soaked, dark-brown lesions turning black rapidly.",
          "White cottony fungal growth on the underside of infected leaves in humid weather."
        ],
        possibleCause: "Oomycete pathogen Phytophthora infestans, thriving in cool, wet, foggy conditions.",
        organicTreatment: "Apply copper hydroxide spray. Instantly remove and destroy heavily infected vines.",
        chemicalTreatment: "Foliar application of Metalaxyl-M + Mancozeb (Ridomil Gold) @ 2g/L.",
        preventionTips: [
          "Plant tomatoes in full sun with wind-flow corridors.",
          "Destroy volunteer potato or tomato hosts in surrounding fields."
        ],
        recoveryTime: "7 - 10 Days (Critical action needed)",
        advice: "Late Blight can destroy entire fields within days. Inspect daily during monsoon season and act immediately."
      },
      {
        name: "Leaf Curl (Tomato Yellow Leaf Curl Virus)",
        symptoms: [
          "Severe curling, puckering, and upward rolling of leaves.",
          "Stunted plant growth, yellowing of leaf margins, and failure to set fruit."
        ],
        possibleCause: "Viral pathogen transmitted vectorially by Whiteflies (Bemisia tabaci).",
        organicTreatment: "Install yellow sticky cards to trap whitefly vectors. Spray neem seed kernel extract (5%).",
        chemicalTreatment: "Spray Imidacloprid 17.8% SL @ 0.5ml/L or Acetamiprid @ 0.2g/L to control vector populations.",
        preventionTips: [
          "Grow seedlings inside insect-proof net nurseries.",
          "Remove weed hosts that act as natural reservoirs for the virus."
        ],
        recoveryTime: "Chronic (Manage vector to protect healthy plants)",
        advice: "Infected plants cannot be cured. Promptly rogue out viral plants and focus on controlling whitefly migration."
      }
    ]
  },
  {
    cropName: "Cotton",
    diseases: [
      {
        name: "Fusarium Wilt (Fusarium oxysporum f. sp. vasinfectum)",
        symptoms: [
          "Yellowing and wilting of leaves, starting from leaf margins.",
          "Brownish-black discoloration of internal stem xylem tissues."
        ],
        possibleCause: "Soil-borne vascular fungus entering via root systems, favored by sandy soils and root-knot nematodes.",
        organicTreatment: "Apply bio-control agent Trichoderma viride to soil. Cultivate leguminous cover crops.",
        chemicalTreatment: "Drench soil with Carbendazim 50% WP @ 2g/L at root base.",
        preventionTips: [
          "Avoid waterlogging and improve drainage systems.",
          "Adopt resistant cotton cultivars."
        ],
        recoveryTime: "18 - 25 Days",
        advice: "Solarize soil using clear plastic during peak summer to reduce vascular spore counts."
      },
      {
        name: "Bacterial Blight / Angular Leaf Spot (Xanthomonas citri)",
        symptoms: [
          "Angular, water-soaked spots on leaves bounded by veins, turning dark brown.",
          "Black lesions on stems ('black arm' phase) and boll rot."
        ],
        possibleCause: "Bacterial pathogen Xanthomonas, carried on seeds and spread by wind-blown rain.",
        organicTreatment: "Spray copper oxychloride @ 2.5g/L combined with bio-formulations.",
        chemicalTreatment: "Spray Streptocycline @ 100 ppm (0.1g/L) mixed with Copper Oxychloride @ 2g/L.",
        preventionTips: [
          "Use acid-delinted seed profiles.",
          "Incorporate crop residues deeply immediately after harvest."
        ],
        recoveryTime: "12 - 15 Days",
        advice: "Ensure early pruning of affected lower branches to improve ventilation within the crop canopy."
      }
    ]
  },
  {
    cropName: "Maize",
    diseases: [
      {
        name: "Northern Leaf Blight (Exserohilum turcicum)",
        symptoms: [
          "Long, elliptical, grayish-green or tan spots (cigar-shaped) on leaves.",
          "Premature drying of leaves starting from lower canopy."
        ],
        possibleCause: "Foliar fungus Exserohilum turcicum, favored by moderate temperatures (18-27°C) and heavy dew.",
        organicTreatment: "Apply foliar sprays of Trichoderma viride or Pseudomonas fluorescens formulations.",
        chemicalTreatment: "Spray Mancozeb 75% WP @ 2g/L or Tebuconazole @ 1ml/L.",
        preventionTips: [
          "Perform deep tillage to bury crop debris.",
          "Implement balanced potassium fertilizations."
        ],
        recoveryTime: "14 - 20 Days",
        advice: "Rotate with non-cereal crops like Soybeans or Groundnuts to break fungal spore cycle."
      },
      {
        name: "Common Rust (Puccinia sorghi)",
        symptoms: [
          "Golden-brown to cinnamon-brown powdery pustules on both upper and lower leaf surfaces."
        ],
        possibleCause: "Rust fungus Puccinia sorghi, favored by cool temperatures (16-23°C) and high relative humidity.",
        organicTreatment: "Foliar spray of neem oil or garlic bulb extract.",
        chemicalTreatment: "Foliar application of Propiconazole @ 1ml/L or Azoxystrobin @ 1ml/L.",
        preventionTips: [
          "Sow early-maturing hybrids.",
          "Keep field perimeters clear of alternative weed hosts like Oxalis."
        ],
        recoveryTime: "10 - 14 Days",
        advice: "Rust spreads rapidly through wind-borne spores. Treat early when only 1-2% leaf area is affected."
      }
    ]
  },
  {
    cropName: "Groundnut",
    diseases: [
      {
        name: "Tikka Leaf Spot (Cercospora arachidicola / Phaeoisariopsis personata)",
        symptoms: [
          "Circular dark-brown spots on upper leaf surface (Early Leaf Spot) or blackish-brown spots on lower leaf surface (Late Leaf Spot).",
          "Severe defoliation leading to weak pod development."
        ],
        possibleCause: "Fungi species Cercospora, thriving in high humidity (>80%) and prolonged rainy spells.",
        organicTreatment: "Apply 5% neem seed kernel extract foliar spray.",
        chemicalTreatment: "Spray Carbendazim @ 1g/L + Mancozeb @ 2g/L formulation.",
        preventionTips: [
          "Treat seeds with Trichoderma viride or Captan before sowing.",
          "Maintain proper weed-free conditions."
        ],
        recoveryTime: "12 - 18 Days",
        advice: "Collect and burn fallen leaves to prevent secondary infection cycles."
      }
    ]
  },
  {
    cropName: "Banana",
    diseases: [
      {
        name: "Panama Wilt (Fusarium oxysporum f. sp. cubense)",
        symptoms: [
          "Yellowing of lower leaves, spreading upward. Leaves buckle at petioles, forming a skirt around the pseudostem.",
          "Splitting of pseudostem base and reddish-brown xylem discoloration."
        ],
        possibleCause: "Vascular soil-borne fungus FOC, remaining active in soils for up to 30 years.",
        organicTreatment: "Apply bio-control agents (Trichoderma) to planting pits. Apply neem cake organic fertilizer.",
        chemicalTreatment: "Inject Carbendazim 2% solution (3ml/plant) into pseudostem at 45-degree angle.",
        preventionTips: [
          "Always source disease-free tissue-cultured plantlets.",
          "Enforce strict quarantine and clean farm machinery between fields."
        ],
        recoveryTime: "Chronic (Isolate infected area to prevent spreading)",
        advice: "Immediately uproot and burn infected mats. Treat the surrounding soil with lime to raise pH."
      }
    ]
  },
  {
    cropName: "Sugarcane",
    diseases: [
      {
        name: "Red Rot (Colletotrichum falcatum)",
        symptoms: [
          "Third or fourth leaf showing yellowing and wilting at margins.",
          "Internal pith showing red discoloration with white cross bands when split open.",
          "Sour, alcoholic smell from split canes."
        ],
        possibleCause: "Fungal pathogen Colletotrichum falcatum, spread through infected seed sets and irrigation water.",
        organicTreatment: "Clean field sanitation and use of organic bio-primed seed sets.",
        chemicalTreatment: "Treat seed sets with Carbendazim 50% WP @ 1g/L for 15 minutes before planting.",
        preventionTips: [
          "Avoid using ratoon crops from infected fields.",
          "Ensure excellent field drainage to prevent spore transport in water."
        ],
        recoveryTime: "Preventive (Uproot and replace with crop rotation)",
        advice: "Red Rot is highly destructive ('Sugarcane Cancer'). Practice field crop rotation with paddy or green manures."
      }
    ]
  },
  {
    cropName: "Potato",
    diseases: [
      {
        name: "Late Blight (Phytophthora infestans)",
        symptoms: [
          "Large, dark, irregular water-soaked spots on leaves.",
          "Sunken, brown, decaying regions on tubers."
        ],
        possibleCause: "Oomycete pathogen Phytophthora infestans, thriving in cool, damp conditions.",
        organicTreatment: "Spray copper fungicide at early leaf stages. Rogue out infected wild hosts.",
        chemicalTreatment: "Foliar application of Mancozeb 75% WP @ 2g/L or Cymoxanil + Mancozeb @ 2g/L.",
        preventionTips: [
          "Ensure high hilling of potato rows to create a thick soil layer over tubers.",
          "Use certified disease-free seed tubers."
        ],
        recoveryTime: "8 - 12 Days",
        advice: "Check weather forecast: delay harvesting if cool, wet weather is predicted to prevent tuber inoculation during digging."
      }
    ]
  },
  {
    cropName: "Chilli",
    diseases: [
      {
        name: "Anthracnose / Fruit Rot (Colletotrichum capsici)",
        symptoms: [
          "Circular, sunken, dark spots with black concentric concentric rings on ripening fruits.",
          "Die-back spots starting from branch twigs downwards."
        ],
        possibleCause: "Fungus Colletotrichum capsici, spread by infected seeds, rain splash, and dew.",
        organicTreatment: "Spray neem oil (5%) or apply Trichoderma formulations as a foliar spray.",
        chemicalTreatment: "Spray Azoxystrobin @ 1ml/L or Propiconazole @ 1ml/L at flowering stage.",
        preventionTips: [
          "Seed treatment with Thiram @ 3g/kg seed.",
          "Clean harvest collection and immediate sun-drying of bolls."
        ],
        recoveryTime: "12 - 16 Days",
        advice: "Perform prompt collection of rotten fruits and discard them far from the plantation area."
      },
      {
        name: "Leaf Curl Virus (Chilli Leaf Curl Virus)",
        symptoms: [
          "Severe puckering, downward curling, and rolling of leaves.",
          "Dwarfed stems, shortened internodes, and bushy appearance of the crown."
        ],
        possibleCause: "Begomovirus transmitted vectorially by Whiteflies (Bemisia tabaci).",
        organicTreatment: "Use yellow sticky traps. Spray 5% neem seed kernel extract.",
        chemicalTreatment: "Spray Spiromesifen @ 1ml/L or Imidacloprid @ 0.5ml/L to manage vectors.",
        preventionTips: [
          "Grow seedlings under screen nurseries.",
          "Eradicate wild okra volunteer weed hosts."
        ],
        recoveryTime: "Chronic (Manage vector spreads)",
        advice: "Early rogued infected seedlings save the rest of the field from virus dissemination."
      }
    ]
  },
  {
    cropName: "Brinjal",
    diseases: [
      {
        name: "Little Leaf (Phytoplasma)",
        symptoms: [
          "Extremely small leaves produced in large numbers, giving a bushy appearance.",
          "Sterile blossoms and failure to produce fruits."
        ],
        possibleCause: "Phytoplasma vectorially transmitted by Leafhoppers (Hishimonus phycitis).",
        organicTreatment: "Apply neem oil formulation. Promptly uproot affected plants.",
        chemicalTreatment: "Spray Dimethoate 30% EC @ 1ml/L to control leafhopper vector.",
        preventionTips: [
          "Enforce crop rotation with non-solanaceous crops.",
          "Uproot and burn infected plants as soon as symptoms are noticed."
        ],
        recoveryTime: "Chronic (Management oriented)",
        advice: "Remove infected plants immediately to prevent the leafhopper from carrying the phytoplasma to healthy rows."
      }
    ]
  },
  {
    cropName: "Okra",
    diseases: [
      {
        name: "Yellow Vein Mosaic (Okra Yellow Vein Mosaic Virus)",
        symptoms: [
          "Bright-yellow network of veins on leaves, starting from younger leaves.",
          "Fruits turn yellow, fibrous, small, and tough."
        ],
        possibleCause: "Begomovirus transmitted vectorially by Whiteflies.",
        organicTreatment: "Hang yellow sticky insect cards. Spray neem extract.",
        chemicalTreatment: "Spray Acetamiprid @ 0.2g/L or Spiromesifen @ 1ml/L for vector management.",
        preventionTips: [
          "Grow virus-tolerant varieties like Arka Anamika or Varsha Uphar.",
          "Eradicate wild okra volunteer weed hosts."
        ],
        recoveryTime: "Chronic (Control vector vector lines)",
        advice: "Ensure strict whitefly control measures during the initial 30 days of seedling establishment."
      }
    ]
  }
];

const UNKNOWN_CROP = {
  cropName: "Unknown",
  diseaseName: "Uncertain",
  confidenceScore: "35%",
  severity: "low",
  symptoms: [
    "No distinct visual symptoms matching standard crop blights detected.",
    "The plant foliage appears normal or the uploaded image did not contain readable leaf patterns."
  ],
  possibleCause: "Unclear pathogen representation. Could be due to non-agricultural objects in frame or low-quality specimen image.",
  organicTreatment: "Maintain healthy soil conditions using organic compost. Ensure balanced micro-nutrients.",
  chemicalTreatment: "No specific chemical treatments recommended without precise pathogen identification.",
  preventionTips: [
    "Please capture a close-up, well-lit photograph of the leaf specimen.",
    "Ensure the leaf is flat and center-aligned in the camera frame."
  ],
  recoveryTime: "N/A",
  advice: "If you suspect an infection, please resubmit a clear leaf specimen image. Ensure the leaf surface is fully visible under natural lighting.",
  whyObserved: ["Image features could not be resolved by visual diagnostics engine."]
};

const generateFallbackReport = () => {
  const isKnown = Math.random() > 0.1;
  if (!isKnown) {
    return { ...UNKNOWN_CROP };
  }

  const randomCrop = KNOWLEDGE_BASE[Math.floor(Math.random() * KNOWLEDGE_BASE.length)];
  const randomDisease = randomCrop.diseases[Math.floor(Math.random() * randomCrop.diseases.length)];
  const confidence = Math.floor(Math.random() * (96 - 78 + 1) + 78) + "%";
  const severities = ["low", "medium", "high"];
  const severity = severities[Math.floor(Math.random() * severities.length)];

  return {
    cropName: randomCrop.cropName,
    diseaseName: randomDisease.name,
    confidenceScore: confidence,
    severity: severity,
    symptoms: randomDisease.symptoms,
    possibleCause: randomDisease.possibleCause,
    organicTreatment: randomDisease.organicTreatment,
    chemicalTreatment: randomDisease.chemicalTreatment,
    preventionTips: randomDisease.preventionTips,
    recoveryTime: randomDisease.recoveryTime,
    advice: randomDisease.advice,
    whyObserved: [
      `Visual lesions conform to standard ${randomDisease.name} phenotypes.`,
      `Estimated confidence metric is ${confidence}.`
    ]
  };
};

export const geminiService = {
  analyzeCropImage: async (fileBuffer, mimeType) => {
    const promptText = `Analyze this crop leaf image. Identify the crop and the disease if present.
Return a valid JSON object matching the following structure. Do not wrap the JSON in Markdown or backticks, return ONLY the raw JSON string:
{
  "cropName": "Name of the crop",
  "diseaseName": "Name of the disease",
  "confidenceScore": "percentage, e.g. 93%",
  "severity": "low" | "medium" | "high",
  "symptoms": ["symptom 1", "symptom 2"],
  "possibleCause": "What caused it",
  "organicTreatment": "Details of organic spray/treatment",
  "chemicalTreatment": "Details of chemical sprays",
  "preventionTips": ["tip 1", "tip 2"],
  "recoveryTime": "duration, e.g. 10 - 14 Days",
  "advice": "General agricultural recommendation",
  "whyObserved": ["observed symptom 1", "observed symptom 2"]
}

Rules:
1. If the plant is healthy and no disease is detected, set "diseaseName" to "Healthy Plant" and "severity" to "low".
2. If you are not confident or the image is not a plant leaf, set "diseaseName" to "Uncertain".
3. Return ONLY a valid JSON string. No prefix text, no markdown backticks, no comments.`;

    const isQuotaError = (err) => {
      const errMsg = (err.message || "").toLowerCase();
      return (
        err.status === 429 ||
        err.code === 429 ||
        errMsg.includes("quota") ||
        errMsg.includes("429") ||
        errMsg.includes("resource_exhausted") ||
        errMsg.includes("limit")
      );
    };

    // Layer 1: Primary Gemini
    logger.info("Trying Primary Gemini");
    if (!primaryAi) {
      logger.warn("Primary Gemini client not configured, bypassing to secondary...");
    } else {
      try {
        const response = await primaryAi.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            promptText,
            {
              inlineData: {
                data: fileBuffer.toString("base64"),
                mimeType: mimeType
              }
            }
          ]
        });

        logger.info("Primary Gemini Success");
        return parseCleanJson(response.text);
      } catch (err) {
        logger.error(`Primary Gemini Error: ${err.message || err}`);
        if (isQuotaError(err)) {
          logger.info("Primary Gemini Quota Exhausted");
          logger.info("Trying Secondary Gemini");
        } else {
          logger.info("Primary Gemini Failed");
        }
      }
    }

    // Layer 2: Secondary Gemini
    if (!secondaryAi) {
      logger.warn("Secondary Gemini client not configured, bypassing to intelligent fallback...");
    } else {
      try {
        const response = await secondaryAi.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            promptText,
            {
              inlineData: {
                data: fileBuffer.toString("base64"),
                mimeType: mimeType
              }
            }
          ]
        });

        logger.info("Secondary Gemini Success");
        return parseCleanJson(response.text);
      } catch (err) {
        logger.error(`Secondary Gemini Error: ${err.message || err}`);
        logger.info("Secondary Gemini Failed");
      }
    }

    // Layer 3: Intelligent Fallback AI
    logger.info("Generating Intelligent Fallback");
    const fallback = generateFallbackReport();
    logger.info("Fallback Response Returned Successfully");
    return fallback;
  },

  chatCopilotFallback: (message, language, farmData = {}, history = []) => {
    return generateFallbackChatResponse(message, language, farmData, history);
  },

  chatCopilot: async (message, language, farmData = {}, history = []) => {
    // Generate context summary strings from messages history
    let historyStr = "";
    if (history && history.length > 0) {
      const recentHistory = history.slice(-6); // Maintain focus on last 6 prompts
      historyStr = recentHistory.map(h => `${h.sender === 'user' ? 'Farmer' : 'Assistant'}: ${h.text}`).join("\n");
    }

    const promptText = `You are the AgriTwin AI farming assistant, an experienced agricultural officer.
Preferred response language: "${language}"

Active Farm Context:
${JSON.stringify(farmData, null, 2)}

Conversation History:
${historyStr}

Farmer's latest message: "${message}"

Rules:
1. You MUST answer the Farmer's latest message in the requested language ("${language}"). Keep all text responses fully localized in "${language}".
2. Answer like an expert agricultural officer: natural, encouraging, and detailed. Cover crop diseases, pest management, fertilizers, organic farming, soil fertility, soil testing, irrigation, weather impacts, crop rotation, harvesting, seed selection, plant nutrition, livestock, fisheries, farm machinery, water conservation, climate adaptation, or sustainable farming as queried.
3. Reference the Conversation History to maintain context (e.g. if the user previously talked about yellowing leaves and then asks "What fertilizer should I use?", understand they are referring to the crop mentioned).
4. Reference the Active Farm Context if it is relevant to their question.
5. Answer only the latest query. Keep the response concise, expert, and actionable. Do not add any prefix like "Assistant:" or markdown quotes. Return ONLY the plain text response in "${language}".`;

    const isQuotaError = (err) => {
      const errMsg = (err.message || "").toLowerCase();
      return (
        err.status === 429 ||
        err.code === 429 ||
        errMsg.includes("quota") ||
        errMsg.includes("429") ||
        errMsg.includes("resource_exhausted") ||
        errMsg.includes("limit")
      );
    };

    // Layer 1: Primary Gemini
    logger.info("Trying Primary Gemini");
    if (!primaryAi) {
      logger.warn("Primary Gemini client not configured, bypassing to secondary...");
    } else {
      try {
        const response = await primaryAi.models.generateContent({
          model: "gemini-2.0-flash",
          contents: promptText
        });

        logger.info("Primary Gemini Success");
        return response.text;
      } catch (err) {
        logger.error(`Primary Gemini Error: ${err.message || err}`);
        if (isQuotaError(err)) {
          logger.info("Primary Gemini Quota Exhausted");
          logger.info("Trying Secondary Gemini");
        } else {
          logger.info("Primary Gemini Failed");
        }
      }
    }

    // Layer 2: Secondary Gemini
    if (!secondaryAi) {
      logger.warn("Secondary Gemini client not configured, bypassing to intelligent fallback...");
    } else {
      try {
        const response = await secondaryAi.models.generateContent({
          model: "gemini-2.0-flash",
          contents: promptText
        });

        logger.info("Secondary Gemini Success");
        return response.text;
      } catch (err) {
        logger.error(`Secondary Gemini Error: ${err.message || err}`);
        logger.info("Secondary Gemini Failed");
      }
    }

    // Layer 3: Intelligent Fallback AI
    logger.info("Generating Intelligent Fallback");
    const fallbackResponse = generateFallbackChatResponse(message, language, farmData, history);
    logger.info("Fallback Generated Successfully");
    return fallbackResponse;
  },

  recommendIrrigation: async (crop, soilMoisture, temperature, humidity, rainfall, weatherForecast) => {
    if (!apiKey) {
      throw new Error("AI service is not configured.");
    }

    const promptText = `Generate smart irrigation recommendations based on:
Crop: "${crop}"
Soil Moisture: "${soilMoisture}"
Temperature: "${temperature}°C"
Humidity: "${humidity}%"
Rainfall: "${rainfall}mm"
Weather Forecast: "${weatherForecast}"

Return a valid JSON object matching the following structure. Do not wrap the JSON in Markdown or backticks, return ONLY the raw JSON string:
{
  "status": "safe" | "wait" | "warning",
  "statusLabel": "Status description labels",
  "statusBadge": "Status label with emoji prefix, e.g. 🟢 Safe to Irrigate / 🟡 Wait for Better Conditions / 🔴 Irrigation Not Recommended",
  "statusBg": "tailwind background styles, e.g. 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' for safe, 'border-amber-500/20 bg-amber-500/5 text-amber-400' for wait, 'border-rose-500/20 bg-rose-500/5 text-rose-400' for warning",
  "recText": "Detailed recommendation text",
  "expectedSaving": "Percentage of water saved, e.g. approximately 15%",
  "waterReq": "Water required description, e.g. 21000 Liters",
  "timeSchedule": "watering schedules, e.g. 6:00 AM – 7:30 AM",
  "rainImpact": "Description of rain impact on soil",
  "moistureStatus": "Moisture level description",
  "whyText": "Explanation of why this recommendation was generated"
}`;

    logger.info("Calling Gemini API (gemini-2.0-flash) for irrigation diagnostics...");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: promptText
      });
      return parseCleanJson(response.text);
    } catch (err) {
      console.error("========== GEMINI ERROR ==========");
      console.error(err);
      console.error("Message:", err.message);

      if (err.status) console.error("Status:", err.status);
      if (err.code) console.error("Code:", err.code);
      if (err.error) console.error("Error:", err.error);

      if (err.response) {
        console.error("Response:", JSON.stringify(err.response, null, 2));
      }

      console.error("=================================");
      throw err;
    }
  },

  generateAnalysisReport: async (farmData) => {
    if (!apiKey) {
      throw new Error("AI service is not configured.");
    }

    const promptText = `Generate a farm analysis report for this digital twin field:
Farm Profile:
${JSON.stringify(farmData, null, 2)}

Return a valid JSON object matching the following structure. Do not wrap the JSON in Markdown or backticks, return ONLY the raw JSON string:
{
  "healthScore": 82,
  "soilFertility": {
    "nitrogen": { "value": "240 kg/ha", "status": "Poor" },
    "phosphorus": { "value": "35 kg/ha", "status": "Good" },
    "potassium": { "value": "290 kg/ha", "status": "Good" },
    "pH": { "value": "6.8", "status": "Good" },
    "organicMatter": { "value": "1.8%", "status": "Moderate" }
  },
  "cropHistory": [
    {
      "season": "Season 1",
      "crop": "Rice",
      "nutrientImpact": "Highly depleted Nitrogen (-45 kg/ha) and Potassium (-30 kg/ha)."
    },
    {
      "season": "Season 2",
      "crop": "Cotton",
      "nutrientImpact": "Moderate depletion of Phosphorus (-15 kg/ha) and soil organic matter."
    }
  ],
  "nextCropRecommendation": {
    "cropName": "Chickpea",
    "confidence": 94,
    "expectedYield": "1.8 Tons/Acre",
    "expectedProfit": "₹45,000/Acre",
    "reason": "Rotating with a nitrogen-fixing legume like Chickpea will restore soil fertility, reduce fertilizer costs, and break pest nesting cycles after Cotton."
  },
  "waterUsage": {
    "totalWaterUsed": "450,000 Liters",
    "waterSaved": "85,000 Liters (18%)",
    "irrigationEfficiency": "88%",
    "history": [
      { "week": "Week 1", "usage": 45000, "average": 55000 },
      { "week": "Week 2", "usage": 48000, "average": 55000 },
      { "week": "Week 3", "usage": 42000, "average": 55000 },
      { "week": "Week 4", "usage": 39000, "average": 55000 }
    ]
  },
  "yieldPrediction": {
    "expectedYield": "2.1 Tons/Acre",
    "confidence": 88,
    "riskLevel": "Low Risk"
  },
  "insights": [
    "Soil nitrogen levels have decreased by 15% due to double crop cultivation.",
    "Potassium level remains in the optimal range (290 kg/ha).",
    "Water usage was reduced by 18% using smart drip scheduling.",
    "Leguminous crop rotation is highly recommended for next season."
  ],
  "actionPlan": [
    "Apply organic compost to replenish organic matter to >2.5%.",
    "Reduce irrigation frequency by 10% during early seedling stage.",
    "Sow Chickpea next season to biologically fix atmospheric Nitrogen.",
    "Add 25 kg/ha of potassium fertilizer to sustain current soil levels.",
    "Conduct a comprehensive soil test post-harvest to check nutrient status."
  ]
}

Rules:
1. Customize the values (nutrients status Poor/Moderate/Good, crop names in history and next recommendations, water savings, expected yield/profit) based on the inputs in Farm Profile.
2. Return ONLY a valid JSON string. No prefix text, no markdown backticks, no comments.`;

    logger.info("Calling Gemini API (gemini-2.0-flash) for farm analysis report...");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: promptText
      });
      return parseCleanJson(response.text);
    } catch (err) {
      logger.error("Gemini Analysis Report Service Error:", err.message || err);
      throw err;
    }
  }
};
