import { useState } from 'react';

const AGRI_KNOWLEDGE = {
  welcome: {
    en: "Hello! I am your AgriTwin AI assistant. I can answer any questions about soil fertility, crop rotation, pest control, irrigation, market rates, or government subsidies. What would you like to know today?",
    te: "నమస్కారం! నేను మీ అగ్రిట్విన్ ఏఐ సహాయకుడిని. నేల సారం, పంట మార్పిడి, తెగుళ్ల నివారణ, నీటి పారుదల, మార్కెట్ ధరలు లేదా ప్రభుత్వ పథకాల గురించి మీ ప్రశ్నలకు నేను సమాధానం ఇవ్వగలను. ఈరోజు మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
    hi: "नमस्कार! मैं आपका एग्रीट्विन एआई सहायक हूँ। मैं मिट्टी की उर्वरता, फसल चक्र, कीट नियंत्रण, सिंचाई, मंडी दरों या सरकारी योजनाओं के बारे में आपके किसी भी प्रश्न का उत्तर दे सकता हूँ। आज आप क्या जानना चाहते हैं?",
    ta: "வணக்கம்! நான் உங்கள் அக்ரிட்வின் ஏஐ உதவியாளர். மண் வளம், பயிர் சுழற்சி, பூச்சி கட்டுப்பாடு, பாசனம், சந்தை விலைகள் அல்லது அரசு மானியங்கள் குறித்த உங்கள் கேள்விகளுக்கு என்னால் பதிலளிக்க முடியும். இன்று நீங்கள் என்ன அறிய விரும்புகிறீர்கள்?",
    kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿಟ್ವಿನ್ ಎಐ ಸಹಾಯಕ. ಮಣ್ಣಿನ ಫಲವತ್ತತೆ, ಬೆಳೆ ಸರದೂಗಿಸುವಿಕೆ, ಕೀಟ ನಿಯಂತ್ರಣ, ನೀರಾವರಿ, ಮಾರುಕಟ್ಟೆ ದರಗಳು ಅಥವಾ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಾನು ಉತ್ತರಿಸಬಲ್ಲೆ. ಇಂದು ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?",
    ml: "ഹലോ! ഞാൻ നിങ്ങളുടെ അഗ്രിട്വിൻ ഐ സഹായകൻ ആണ്. മൺഫലഭൂയിഷ്ഠത, വിളമാറ്റം, കീട നിയന്ത്രണം, ജലസേചനം, വിപണി നിരക്കുകൾ, സർക്കാർ സബ്‌സിഡികൾ എന്നിവയെക്കുറിച്ചുള്ള നിങ്ങളുടെ സംശയങ്ങൾക്ക് എനിക്ക് മറുപടി നൽകാനാകും. ഇന്ന് നിങ്ങൾക്ക് എന്താണ് അറിയേണ്ടത്?",
    mr: "नमस्कार! मी आपला अ‍ॅग्रीट्विन एआय सहाय्यक आहे. मी जमिनीची सुपीकता, पीक फेरपालट, कीड नियंत्रण, जलसिंचन, बाजार भाव किंवा सरकारी योजनांबद्दलच्या आपल्या शंकांचे निरसन करू शकतो. आज आपल्याला काय जाणून घ्यायचे आहे?",
    bn: "নমস্কার! আমি আপনার এগ্রিটুইন এআই সহকারী। আমি মাটির উর্বরতা, শস্য আবর্তন, কীটপতঙ্গ নিয়ন্ত্রণ, সেচ, বাজারের হার বা সরকারি ভর্তুকি সংক্রান্ত আপনার প্রশ্নের উত্তর দিতে পারি। আজ আপনি কী জানতে চান?",
    gu: "નમસ્તે! હું તમારો એગ્રીટ્વીન એઆઇ સહાયક છું. હું જમીનની ફળદ્રુપતા, પાકની ફેરબદલી, જંતુ નિયંત્રણ, સિંચાઈ, બજારના ભાવો અથવા સરકારી સબસિડી વિશેના તમારા પ્રશ્નોના ઉત્તર આપી શકું છું. આજે તમે શું જાણવા માંગો છો?",
    pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀਟਵਿਨ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਮਿੱਟੀ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ, ਫਸਲੀ ਚੱਕਰ, ਕੀੜੇ-ਮਕੌੜਿਆਂ ਦੀ ਰੋਕਥਾਮ, ਸਿੰਚਾਈ, ਮੰਡੀ ਦੇ ਭਾਅ ਜਾਂ ਸਰਕਾਰੀ ਸਬਸਿਡੀਆਂ ਬਾਰੇ ਤੁਹਾਡੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?"
  },
  pest: {
    en: "For sustainable pest management, try spraying 3% Neem Oil extract or using yellow sticky traps to capture whiteflies and aphid insects. Keep the bunds clean to break pest nesting. For detailed diagnoses, navigate to our Disease Clinic.",
    te: "తెగుళ్ల నివారణకు 3% వేప నూనె పిచికారీ చేయడం లేదా తెల్లదోమలను ఆకర్షించే పసుపు రంగు జిగురు కార్డులను అమర్చడం మంచిది. పొలంలో కలుపు లేకుండా చూసుకోండి. మరిన్ని వివరాల కోసం మన తెగుళ్ల నివారణ పేజీని చూడండి.",
    hi: "कीट नियंत्रण के लिए, 3% नीम के तेल का छिड़काव करें या सफेद मक्खियों और एफिड्स को पकड़ने के लिए पीले चिपचिपे जाल का उपयोग करें। खेतों को खरपतवार मुक्त रखें। विस्तृत निदान के लिए हमारे रोग निदान केंद्र पर जाएं।",
    ta: "பூச்சிகளை கட்டுப்படுத்த, 3% வேப்ப எண்ணெயை தெளிக்கவும் அல்லது வெள்ளை ஈக்களை கவர மஞ்சள் ஒட்டும் பொறிகளைப் பயன்படுத்தவும். வரப்புகளை சுத்தமாக வைத்திருங்கள்.",
    kn: "ಕೀಟ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ, 3% ಬೇವಿನ ಎಣ್ಣೆಯನ್ನು ಸಿಂಪಡಿಸಿ ಅಥವಾ ಬಿಳಿ ನೊಣಗಳನ್ನು ಹಿಡಿಯಲು ಹಳದಿ ಅಂಟಿಕೊಳ್ಳುವ ಬಲೆಗಳನ್ನು ಬಳಸಿ. ಬದುಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ.",
    ml: "കീട നിയന്ത്രണത്തിനായി, 3% വേപ്പെണ്ണ തളിക്കുക അല്ലെങ്കിൽ വെളുത്ത ഈച്ചകളെ ആകർഷിക്കാൻ മഞ്ഞ പശ കാർഡുകൾ ഉപയോഗിക്കുക. പറമ്പ് വൃത്തിയായി സൂക്ഷിക്കുക.",
    mr: "कीड नियंत्रणासाठी, ३% लिंबोळी तेलाची फवारणी करा किंवा पांढऱ्या माश्यांसाठी पिवळे चिकट सापळे वापरा. शेताचे बाध स्वच्छ ठेवा.",
    bn: "পোকামাকড় নিয়ন্ত্রণের জন্য, ৩% নিম তেলের স্প্রে করুন বা সাদা মাছি ধরার জন্য হলুদ আঠালো ফাঁদ ব্যবহার করুন। আইল পরিষ্কার রাখুন।",
    gu: "જંતુ નિયંત્રણ માટે, ૩% લીમડાના તેલનો છંટકાવ કરો અથવા સફેદ માખીઓ પકડવા પીળા સ્ટીકી ટ્રેપનો ઉપયોગ કરો. સેઢા સાફ રાખો.",
    pa: "ਕੀੜਿਆਂ ਦੀ ਰੋਕਥਾਮ ਲਈ, 3% ਨਿੰਮ ਦੇ ਤੇਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ ਜਾਂ ਚਿੱਟੀ ਮੱਖੀ ਨੂੰ ਫੜਨ ਲਈ ਪੀਲੇ ਚਿਪਕਵੇਂ ਜਾਲ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਵੱਟਾਂ ਨੂੰ ਸਾਫ਼ ਰੱਖੋ।"
  },
  fertilizer: {
    en: "Ensure a balanced N-P-K (Nitrogen, Phosphorus, Potassium) application based on your soil type. Add decomposed Farm Yard Manure (compost) at 5 tons/acre to increase soil organic carbon and nutrient retention naturally.",
    te: "మీ నేల స్వభావాన్ని బట్టి నత్రజని, భాస్వరం, పొటాషియం ఎరువులను సమతుల్యంగా వేయండి. ఎకరానికి 5 టన్నుల పశువుల ఎరువును వేయడం వల్ల నేల సారవంతం సహజంగా పెరుగుతుంది.",
    hi: "अपनी मिट्टी के प्रकार के आधार पर संतुलित एन-पी-के (नाइट्रोजन, फास्फोरस, पोटेशियम) का उपयोग करें। मिट्टी में जैविक कार्बन बढ़ाने के लिए 5 टन प्रति एकड़ सड़े हुए गोबर की खाद मिलाएं।",
    ta: "மண் வகையின் அடிப்படையில் சமநிலையான N-P-K உரங்களைப் பயன்படுத்துங்கள். கரிம கார்பனை அதிகரிக்க ஏக்கருக்கு 5 டன் மக்கிய தொழு உரத்தைச் சேர்க்கவும்.",
    kn: "ಮಣ್ಣಿನ ವಿಧಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಸಮತೋಲಿತ N-P-K ರಸಗೊಬ್ಬರಗಳನ್ನು ಬಳಸಿ. ಸಾವಯವ ಇಂಗಾಲ ಹೆಚ್ಚಿಸಲು ಎಕರೆಗೆ 5 ಟನ್ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಸೇರಿಸಿ.",
    ml: "മണ്ണിന്റെ തരം അനുസരിച്ച് സമീകൃതമായ N-P-K വളങ്ങൾ പ്രയോഗിക്കുക. ജൈവ കാർബൺ വർദ്ധിപ്പിക്കാൻ ഏക്കറിന് 5 ടൺ കാലിവളം ചേർക്കുക.",
    mr: "मातीच्या प्रकारानुसार संतुलित N-P-K खतांचा वापर करा. सेंद्रिय कर्ब वाढवण्यासाठी एकरी ५ टन कुजलेले शेणखत टाका.",
    bn: "আপনার মাটির প্রকারের উপর ভিত্তি করে সুষম N-P-K সার প্রয়োগ নিশ্চিত করুন। মাটির জৈব উপাদান বাড়াতে প্রতি একরে ৫ টন গোবর সার দিন।",
    gu: "જમીનના પ્રકાર પ્રમાણે સંતુલિત N-P-K ખાતરનો ઉપયોગ કરો. જમીનનું સેન્દ્રિય તત્વ વધારવા એકરે ૫ ટન છાણિયું ખાતર ઉમેરો.",
    pa: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਦੇ ਅਧਾਰ ਤੇ ਸੰਤੁਲਿਤ N-P-K ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਜੈਵਿਕ ਮਾਦਾ ਵਧਾਉਣ ਲਈ ਪ੍ਰਤੀ ਏਕੜ 5 ਟਨ ਰੂੜੀ ਦੀ ਖਾਦ ਪਾਓ।"
  },
  water: {
    en: "Micro-irrigation systems (Drip and Sprinklers) reduce water consumption by 30-50% while improving crop yields. Water during early mornings to minimize evaporation losses. Check our Irrigation page for water schedules.",
    te: "సూక్ష్మ నీటి పారుదల పద్ధతులు (డ్రిప్ మరియు స్ప్రింక్లర్లు) 30-50% నీటిని పొదుపు చేస్తాయి. ఆవిరి కాకుండా ఉండటానికి ఉదయాన్నే నీటి తడులు అందించండి. నీటి షెడ్యూల్ కోసం మన నీటి యాజమాన్యం పేజీని చూడండి.",
    hi: "सूक्ष्म सिंचाई प्रणालियां (ड्रिप और स्प्रिंकलर) पानी की खपत को 30-50% तक कम करती हैं और पैदावार बढ़ाती हैं। वाष्पीकरण से बचने के लिए सुबह के समय सिंचाई करें।",
    ta: "நுண்ணீர் பாசன முறைகள் (சொட்டுநீர்/தெளிப்பான்) 30-50% நீர் நுகர்வைக் குறைக்கின்றன. நீர் ஆவியாவதைத் தடுக்க அதிகாலையில் பாசனம் செய்யுங்கள்.",
    kn: "ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ಪದ್ಧತಿಗಳು (ಹನಿ ಮತ್ತು ಸಿಂಪರಣೆ) ಶೇ. 30-50 ರಷ್ಟು ನೀರನ್ನು ಉಳಿಸುತ್ತವೆ. ಬಾಷ್ಪೀಕರಣ ತಡೆಯಲು ಮುಂಜಾನೆ ನೀರು ಹಾಯಿಸಿ.",
    ml: "സൂക്ഷ്മ ജലസേചന രീതികൾ (ഡ്രിപ്പ്, സ്പ്രിൻക്ലർ) ജല ഉപഭോഗം 30-50% കുറയ്ക്കുന്നു. ബാഷ്പീകരണം തടയാൻ അതിരാവിലെ നനയ്ക്കുക.",
    mr: "ठिबक आणि तुषार सिंचन पद्धतींमुळे ३०-५०% पाण्याची बचत होते. बाष्पीभवन टाळण्यासाठी पहाटेच्या वेळी पाणी द्या.",
    bn: "ক্ষুদ্র-সেচ ব্যবস্থা (ড্রিপ এবং স্প্রিঙ্কলার) পানির ব্যবহার ৩০-৫০% কমায়। বাষ্পীভবন কমাতে ভোরে সেচ দিন।",
    gu: "સુક્ષ્મ સિંચાઈ પદ્ધતિઓ (ટપક અને ફુવારા) ૩૦-૫૦% પાણીનો બચાવ કરે છે. બાષ્પીભવન અટકાવવા વહેલી સવારે પિયત આપો.",
    pa: "ਸੂਖਮ ਸਿੰਚਾਈ ਪ੍ਰਣਾਲੀਆਂ (ਤੁਪਕਾ ਤੇ ਫੁਹਾਰਾ) 30-50% ਪਾਣੀ ਦੀ ਬਚਤ ਕਰਦੀਆਂ ਹਨ। ਵਾਸ਼ਪੀਕਰਨ ਤੋਂ ਬਚਣ ਲਈ ਸਵੇਰੇ ਸਿੰਚਾਈ ਕਰੋ।"
  },
  market: {
    en: "Mandi rates fluctuate based on seasonal supply arrivals. Currently, commercial crops show high price volatility, while grains like rice and wheat are backed by Government Minimum Support Price (MSP) bounds. Check our Market page for forecasts.",
    te: "మార్కెట్ ధరలు సరఫరాను బట్టి మారుతుంటాయి. ప్రస్తుతం పత్తి, టమోటా వంటి పంటలకు హెచ్చుతగ్గులు ఎక్కువగా ఉన్నాయి, కానీ వరి మరియు గోధుమలకు ప్రభుత్వ మద్దతు ధర (MSP) రక్షణ ఉంది. మార్కెట్ ధరల వివరాల కోసం మన మార్కెట్ పేజీని చూడండి.",
    hi: "मंडी दरें मौसमी आपूर्ति के आधार पर बदलती हैं। वर्तमान में कपास और टमाटर में उतार-चढ़ाव अधिक है, जबकि धान और गेहूं जैसी फसलें सरकारी न्यूनतम समर्थन मूल्य (MSP) से सुरक्षित हैं।",
    ta: "மண்டி விலைகள் பருவகால வரத்தின் அடிப்படையில் மாறுகின்றன. நெல் மற்றும் கோதுமைக்கு அரசு குறைந்தபட்ச ஆதரவு விலை (MSP) வழங்குகிறது.",
    kn: "ಮಾರುಕಟ್ಟೆ ದರಗಳು ಆಯಾ ಹಂಗಾಮಿನ ಆಧಾರದ ಮೇಲೆ ಬದಲಾಗುತ್ತವೆ. ಭತ್ತ ಮತ್ತು ಗೋಧಿಗೆ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ (MSP) ರಕ್ಷಣೆ ಇರುತ್ತದೆ.",
    ml: "സീസണൽ വരവ് അനുസരിച്ച് മണ്ടി നിരക്കുകൾ വ്യത്യാസപ്പെടുന്നു. നെല്ല്, ഗോതമ്പ് എന്നിവയ്ക്ക് സർക്കാർ കുറഞ്ഞ പിന്തുണ വില (MSP) നൽകുന്നുണ്ട്.",
    mr: "बाजार भाव हंगामी आवकवर अवलंबून असतात. सध्या कापूस व टोमॅटोमध्ये चढ-उतार आहेत, तर धान व गव्हाला शासकीय हमीभाव (MSP) आहे.",
    bn: "বাজারে ফসলের আমদানির ওপর ভিত্তি করে দর ওঠানামা করে। ধান এবং গম সরকারি ন্যূনতম সমর্থন মূল্য (MSP) দ্বারা সুরক্ষিত।",
    gu: "બજારના ભાવો મોસમી આવક પર આધાર રાખે છે. ડાંગર અને ઘઉં જેવી જણસો માટે સરકારના લઘુત્તમ ટેકાના ભાવ (MSP) લાગુ પડે છે.",
    pa: "ਮੰਡੀ ਦੇ ਭਾਅ ਫਸਲ ਦੀ ਆਮਦ ਮੁਤਾਬਕ ਬਦਲਦੇ ਰਹਿੰਦੇ ਹਨ। ਝੋਨੇ ਤੇ ਕਣਕ ਨੂੰ ਸਰਕਾਰੀ ਘੱਟੋ-ਘੱਟ ਸਮਰਥਨ ਮੁੱਲ (MSP) ਦਾ ਸਮਰਥਨ ਪ੍ਰਾਪਤ ਹੈ।"
  },
  scheme: {
    en: "The Central Government offers support through PM-KISAN (₹6,000 yearly income support), PM-KUSUM (up to 60% solar pump subsidies), and PM Fasal Bima Yojana (crop insurance against natural calamities). Check our Govt Schemes page for eligibility status.",
    te: "ప్రభుత్వం పీఎం-కిసాన్ ద్వారా ఏడాదికి ₹6,000 సహాయాన్ని, పీఎం-కుసుమ్ ద్వారా సోలార్ పంపులకు 60% సబ్సిడీని మరియు పంట బీమాను అందిస్తోంది. మీ అర్హతలను ప్రభుత్వ పథకాల పేజీలో చెక్ చేసుకోండి.",
    hi: "सरकार पीएम-किसान (₹6,000 वार्षिक सहायता), पीएम-कुसुम (सौर पंप पर 60% तक सब्सिडी) और पीएम फसल बीमा योजना (फसल बीमा) के माध्यम से सहायता प्रदान करती है। पात्रता जांचने के लिए योजनाएं पेज देखें।",
    ta: "மத்திய அரசு பிஎம்-கிசான் (₹6,000 ஆண்டு உதவி), பிஎம்-குசும் (60% சோலார் பம்ப் மானியம்) மற்றும் பயிர் காப்பீட்டு திட்டங்களை வழங்குகிறது.",
    kn: "ಸರ್ಕಾರವು ಪಿಎಂ-ಕಿಸಾನ್ (₹6,000 ವಾರ್ಷಿಕ ನೆರವು), ಪಿಎಂ-ಕುಸುಮ್ (ಶೇ. 60 ಸೋಲಾರ್ ಪಂಪ್ ಸಬ್ಸಿಡಿ) ಮತ್ತು ಬೆಳೆ ವಿಮೆ ಯೋಜನೆಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
    ml: "പിഎം-കിസാൻ (പ്രതിവർഷം ₹6,000), പിഎം-കുസും (സോളാർ പമ്പുകൾക്ക് 60% സബ്‌സിഡി), വിള ഇൻഷുറൻസ് എന്നിവയിലൂടെ സർക്കാർ സഹായം നൽകുന്നു.",
    mr: "केंद्र सरकार पीएम-किसान (₹६,००० वार्षिक), पीएम-कुसुम (सौर पंपावर ६०% सबसिडी) आणि पीक विमा योजनांद्वारे मदत पुरवते.",
    bn: "সরকার পিএম-কিসান (বার্ষিক ₹৬,০০০ সহায়তা), পিएम-কুসুম (সৌর পাম্পে ৬০% ভর্তুকি) এবং ফসল বীমা যোজনার মাধ্যমে সহায়তা প্রদান করে।",
    gu: "સરકાર પીએમ-કિસાન (₹૬,૦૦૦ વાર્ષિક સહાય), પીએમ-કુસુમ (સોલર પંપ પર ૬૦% સુધી સબસિડી) અને પાક વીમા યોજના દ્વારા મદદ કરે છે.",
    pa: "ਸਰਕਾਰ ਪੀਐਮ-ਕਿਸਾਨ (ਸਾਲਾਨਾ ₹6,000), ਪੀਐਮ-ਕੁਸੁਮ (ਸੋਲਰ ਪੰਪ 'ਤੇ 60% ਸਬਸਿਡੀ) ਅਤੇ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ ਰਾਹੀਂ ਸਹਾਇਤਾ ਦਿੰਦੀ ਹੈ।"
  },
  default: {
    en: "Interesting question! To maximize agricultural yields, ensure proper spacing during sowing, check soil pH bounds regularly, keep fields weed-free, and rotate heavy-feeding grains with legume oilseeds next season to rebuild soil nitrogen.",
    te: "మంచి ప్రశ్న! పంట దిగుబడిని పెంచడానికి విత్తే సమయంలో తగిన దూరం పాటించండి, కలుపు నివారణ చేయండి మరియు నేల సారాన్ని కాపాడటానికి వచ్చే సీజన్‌లో పప్పుధాన్యాలతో పంట మార్పిడి చేయండి.",
    hi: "अच्छा सवाल! पैदावार बढ़ाने के लिए, बुवाई के समय उचित दूरी रखें, खरपतवार नियंत्रण करें और मिट्टी की उर्वरता बनाए रखने के लिए अगले सीजन में फलीदार फसलों के साथ फसल चक्र अपनाएं।",
    ta: "நல்ல கேள்வி! மகசூலை அதிகரிக்க, பயிர்களுக்கு இடையே சரியான இடைவெளி விடவும், களைகளை நீக்கவும், பயிர் சுழற்சி முறையை கடைபிடிக்கவும்.",
    kn: "ಉತ್ತಮ ಪ್ರಶ್ನೆ! ಇಳುವರಿ ಹೆಚ್ಚಿಸಲು ಬಿತ್ತನೆ ನಡುವೆ ಸರಿಯಾದ ಅಂತರ ಕಾಯ್ದುಕೊಳ್ಳಿ, ಕಳೆ ನಿಯಂತ್ರಣ ಮಾಡಿ ಮತ್ತು ಬೆಳೆ ಸರದೂಗಿಸುವಿಕೆ ಅಳವಡಿಸಿಕೊಳ್ಳಿ.",
    ml: "നല്ല ചോദ്യം! വിളവ് കൂട്ടാൻ കൃത്യമായ അകലം പാലിക്കുക, കളകൾ നിയന്ത്രിക്കുക, മണ്ണിലെ നൈട്രജൻ കൂട്ടാൻ പയറുവർഗ്ഗങ്ങളുമായി വിളമാറ്റം നടത്തുക.",
    mr: "चांगला प्रश्न! उत्पादन वाढवण्यासाठी योग्य अंतरावर पेरणी करा, तण नियंत्रण करा आणि जमिनीचा कस टिकवण्यासाठी पीक फेरपालट करा.",
    bn: "চমৎকার প্রশ্ন! ফলন বাড়াতে বপনের সময় সঠিক দূরত্ব বজায় রাখুন, আগাছা পরিষ্কার রাখুন এবং শস্য আবর্তন অনুসরণ করুন।",
    gu: "સરસ પ્રશ્ન! ગુણવત્તાયુક્ત ઉત્પાદન માટે વાવણી વખતે યોગ્ય અંતર રાખો, નીંદણ નિયંત્રણ કરો અને પાકની ફેરબદલી અપનાવો.",
    pa: "ਵਧੀਆ ਸਵਾਲ! ਝਾੜ ਵਧਾਉਣ ਲਈ ਬਿਜਾਈ ਸਮੇਂ ਸਹੀ ਦੂਰੀ ਰੱਖੋ, ਨਦੀਨਾਂ ਦੀ ਰੋਕਥਾਮ ਕਰੋ ਅਤੇ ਫਸਲੀ ਚੱਕਰ ਅਪਣਾਓ।"
  }
};

export const detectLanguage = (text) => {
  if (!text) return 'en';
  
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
  if (/[\u0900-\u097F]/.test(text)) {            // Devanagari (Hindi / Marathi)
    if (/[\u0933]|आहे|नाही|करणे|पाहिजे|भाजी/.test(text)) {
      return 'mr'; // Marathi
    }
    return 'hi'; // Hindi
  }
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam
  if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Punjabi
  
  return 'en';
};

export const useGemini = () => {
  const [messages, setMessages] = useState([
    { 
      id: 'welcome',
      sender: 'ai', 
      text: {
        en: AGRI_KNOWLEDGE.welcome.en,
        te: AGRI_KNOWLEDGE.welcome.te,
        hi: AGRI_KNOWLEDGE.welcome.hi,
        ta: AGRI_KNOWLEDGE.welcome.ta,
        kn: AGRI_KNOWLEDGE.welcome.kn,
        ml: AGRI_KNOWLEDGE.welcome.ml,
        mr: AGRI_KNOWLEDGE.welcome.mr,
        bn: AGRI_KNOWLEDGE.welcome.bn,
        gu: AGRI_KNOWLEDGE.welcome.gu,
        pa: AGRI_KNOWLEDGE.welcome.pa
      },
      resolvedLang: 'en',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const getAIAnswerTranslations = (queryText, farm, metrics) => {
    const q = queryText.toLowerCase();
    const formatRupee = (val) => new Intl.NumberFormat('en-IN').format(val || 0);

    // 1. Context check: health / metrics
    if ((q.includes('health') || q.includes('score') || q.includes('status') || q.includes('ఆరోగ్య') || q.includes('स्थिति') || q.includes('सेहत') || q.includes('சுகாதாரம்') || q.includes('ಆರೋಗ್ಯ') || q.includes('ആരോഗ്യം') || q.includes('স্বাস্থ্যের') || q.includes('તબિયત') || q.includes('ਸਿਹਤ')) && farm && metrics) {
      return {
        en: `Your active farm twin in ${farm.village} has a Health Score of ${metrics.farmHealthScore}%. The soil fertility is evaluated at ${metrics.soil.fertilityScore}/100 and overall risk is ${metrics.risk.overallRiskLevel}.`,
        te: `మీ పొలం (${farm.village}) ఆరోగ్య స్కోరు ${metrics.farmHealthScore}%. నేల సారం ${metrics.soil.fertilityScore}/100 మరియు నష్ట భయం ${metrics.risk.overallRiskLevel} స్థాయిలో ఉన్నాయి.`,
        hi: `आपके खेत (${farm.village}) का स्वास्थ्य स्कोर ${metrics.farmHealthScore}% है। मिट्टी की उर्वरता ${metrics.soil.fertilityScore}/100 और कुल जोखिम ${metrics.risk.overallRiskLevel} है।`,
        ta: `${farm.village}-ல் உள்ள உங்கள் பண்ணையின் சுகாதார மதிப்பு ${metrics.farmHealthScore}% ஆகும். மண் வளம் ${metrics.soil.fertilityScore}/100 மற்றும் ஒட்டுமொத்த ஆபத்து ${metrics.risk.overallRiskLevel} ஆகும்.`,
        kn: `${farm.village} ನಲ್ಲಿರುವ ನಿಮ್ಮ ಬೆಳೆ ಆರೋಗ್ಯ ಸ್ಕೋರ್ ${metrics.farmHealthScore}% ಆಗಿದೆ. ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ${metrics.soil.fertilityScore}/100 ಮತ್ತು ಒಟ್ಟಾರೆ ಅಪಾಯ ${metrics.risk.overallRiskLevel} ಆಗಿದೆ.`,
        ml: `${farm.village}-ലെ നിങ്ങളുടെ കൃഷിയിടത്തിന്റെ ആരോഗ്യ സ്കോർ ${metrics.farmHealthScore}% ആണ്. മൺഫലഭൂയിഷ്ഠത ${metrics.soil.fertilityScore}/100 ഉം അപകട സാധ്യത ${metrics.risk.overallRiskLevel} ഉം ആണ്.`,
        mr: `${farm.village} मधील आपल्या शेताचा आरोग्य स्कोर ${metrics.farmHealthScore}% आहे. जमिनीची सुपीकता ${metrics.soil.fertilityScore}/100 आणि एकूण जोखीम ${metrics.risk.overallRiskLevel} आहे.`,
        bn: `${farm.village}-এ আপনার সক্রিয় খামারের স্বাস্থ্য স্কোর হল ${metrics.farmHealthScore}%। মাটির উর্বরতা মূল্যায়ন ${metrics.soil.fertilityScore}/100 এবং সামগ্রিক ঝুঁকি হল ${metrics.risk.overallRiskLevel}।`,
        gu: `${farm.village} માં તમારા સક્રિય ખેતરનો હેલ્થ સ્કોર ${metrics.farmHealthScore}% છે. જમીનની ફળદ્રુપતા ${metrics.soil.fertilityScore}/100 અને કુલ જોખમ ${metrics.risk.overallRiskLevel} છે.`,
        pa: `${farm.village} ਵਿੱਚ ਤੁਹਾਡੇ ਖੇਤ ਦਾ ਸਿਹਤ ਸਕੋਰ ${metrics.farmHealthScore}% ਹੈ। ਮਿੱਟੀ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ${metrics.soil.fertilityScore}/100 ਅਤੇ ਕੁੱਲ ਜੋਖਮ ${metrics.risk.overallRiskLevel} ਹੈ।`
      };
    }

    // 2. Context check: profit / yield / cost
    if ((q.includes('profit') || q.includes('revenue') || q.includes('cost') || q.includes('money') || q.includes('yield') || q.includes('లాభం') || q.includes('ఆదాయం') || q.includes('लाभ') || q.includes('पैसा') || q.includes('कमाई') || q.includes('पैदावार') || q.includes('லாபம்') || q.includes('வருவாய்') || q.includes('ಲಾಭ') || q.includes('ಆದಾಯ') || q.includes('ലാഭം') || q.includes('വരുമാനം') || q.includes('नफा') || q.includes('खर्च') || q.includes('লাভ') || q.includes('નફો') || q.includes('ਬਚਤ') || q.includes('ਖਰਚਾ')) && farm && metrics) {
      return {
        en: `Based on your land size of ${farm.landSize} acres, the expected profit is ₹${formatRupee(metrics.profit.profit)} (Projected Revenue: ₹${formatRupee(metrics.profit.revenue)}, Cost: ₹${formatRupee(metrics.profit.cost)}).`,
        te: `మీ పొలం వైశాల్యం ${farm.landSize} ఎకరాల ఆధారంగా, ఆశించే నికర లాభం ₹${formatRupee(metrics.profit.profit)} (మొత్తం ఆదాయం: ₹${formatRupee(metrics.profit.revenue)}, ఖర్చులు: ₹${formatRupee(metrics.profit.cost)}).`,
        hi: `आपके ${farm.landSize} एकड़ खेत के आधार पर, अपेक्षित लाभ ₹${formatRupee(metrics.profit.profit)} है (अनुमानित राजस्व: ₹${formatRupee(metrics.profit.revenue)}, लागत: ₹${formatRupee(metrics.profit.cost)})।`,
        ta: `உங்கள் ${farm.landSize} ஏக்கர் நிலத்தின் அடிப்படையில், எதிர்பார்க்கப்படும் லாபம் ₹${formatRupee(metrics.profit.profit)} (வருவாய்: ₹${formatRupee(metrics.profit.revenue)}, செலவு: ₹${formatRupee(metrics.profit.cost)}) ஆகும்.`,
        kn: `ನಿಮ್ಮ ${farm.landSize} ಎಕರೆ ಭೂಮಿಯ ಆಧಾರದ ಮೇಲೆ, ನಿರೀಕ್ಷಿತ ಲಾಭ ₹${formatRupee(metrics.profit.profit)} (ಆದಾಯ: ₹${formatRupee(metrics.profit.revenue)}, ವೆಚ್ಚ: ₹${formatRupee(metrics.profit.cost)}).`,
        ml: `നിങ്ങളുടെ ${farm.landSize} ഏക്കർ സ്ഥലത്തിന്റെ അടിസ്ഥാനത്തിൽ, പ്രതീക്ഷിക്കുന്ന ലാഭം ₹${formatRupee(metrics.profit.profit)} (വരുമാനം: ₹${formatRupee(metrics.profit.revenue)}, ചിലവ്: ₹${formatRupee(metrics.profit.cost)}) ആണ്.`,
        mr: `आपल्या ${farm.landSize} एकर शेतीनुसार, अपेक्षित नफा ₹${formatRupee(metrics.profit.profit)} आहे (एकूण महसूल: ₹${formatRupee(metrics.profit.revenue)}, खर्च: ₹${formatRupee(metrics.profit.cost)}).`,
        bn: `আপনার ${farm.landSize} একর জমির আকারের ভিত্তিতে, প্রত্যাশিত লাভ হল ₹${formatRupee(metrics.profit.profit)} (রাজস্ব: ₹${formatRupee(metrics.profit.revenue)}, খরচ: ₹${formatRupee(metrics.profit.cost)})।`,
        gu: `તમારા ${farm.landSize} એકર જમીનના કદના આધારે, અપેક્ષિત નફો ₹${formatRupee(metrics.profit.profit)} છે (મહેસૂલ: ₹${formatRupee(metrics.profit.revenue)}, ખર્ચ: ₹${formatRupee(metrics.profit.cost)}).`,
        pa: `ਤੁਹਾਡੀ ${farm.landSize} ਏਕੜ ਜ਼ਮੀਨ ਦੇ ਅਧਾਰ ਤੇ, ਉਮੀਦ ਕੀਤੀ ਬਚਤ ₹${formatRupee(metrics.profit.profit)} ਹੈ (ਆਮਦਨ: ₹${formatRupee(metrics.profit.revenue)}, ਖਰਚਾ: ₹${formatRupee(metrics.profit.cost)})।`
      };
    }

    // 3. Context check: recommended crop / rotation
    if ((q.includes('recommend') || q.includes('suggest') || q.includes('grow') || q.includes('rotation') || q.includes('next crop') || q.includes('పంట') || q.includes('మార్పిడి') || q.includes('फसल') || q.includes('பயிர்') || q.includes('ಬೆಳೆ') || q.includes('വിള') || q.includes('ਪੰਗਾ')) && farm && metrics) {
      const recCrop = metrics.rotation.recommendedNextCropId.toUpperCase();
      return {
        en: `The AI recommends planting ${recCrop} next season. Reason: ${metrics.rotation.advice.en}`,
        te: `తదుపరి పంటగా ${recCrop} వేయాల్సిందిగా సిఫార్సు చేయబడింది. కారణం: ${metrics.rotation.advice.te}`,
        hi: `अगली फसल के रूप में ${recCrop} लगाने की सलाह दी जाती है। कारण: ${metrics.rotation.advice.hi}`,
        ta: `அடுத்த பருவத்தில் ${recCrop} பயிரிட ஏஐ பரிந்துரைக்கிறது. காரணம்: ${metrics.rotation.advice.en}`,
        kn: `ಮುಂದಿನ ಹಂಗಾಮಿನಲ್ಲಿ ${recCrop} ಬೆಳೆಯಲು ಎಐ ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ. ಕಾರಣ: ${metrics.rotation.advice.en}`,
        ml: `അടുത്ത സീസണിൽ ${recCrop} നടാൻ ഐ ശുപാർശ ചെയ്യുന്നു. കാരണം: ${metrics.rotation.advice.en}`,
        mr: `पुढील हंगामात ${recCrop} लागवड करण्याची शिफारस एआय करते. कारण: ${metrics.rotation.advice.hi}`,
        bn: `এআই পরবর্তী মৌসুমে ${recCrop} রোপণের পরামর্শ দিচ্ছে। কারণ: ${metrics.rotation.advice.en}`,
        gu: `એઆઈ આગામી સીઝનમાં ${recCrop} વાવવાની ભલામण કરે છે. કારણ: ${metrics.rotation.advice.en}`,
        pa: `ਏਆਈ ਅਗਲੇ ਸੀਜ਼ਨ ਵਿੱਚ ${recCrop} ਬੀਜਣ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰਦਾ ਹੈ। ਕਾਰਨ: ${metrics.rotation.advice.en}`
      };
    }

    // 4. Default categories with expanded root word matching
    let key = 'default';
    if (q.includes('pest') || q.includes('disease') || q.includes('bug') || q.includes('insect') || q.includes('sick') || q.includes('spots') || q.includes('blight') || q.includes('रोग') || q.includes('कीड़') || q.includes('कीट') || q.includes('తెగులు') || q.includes('ఆకు') || q.includes('రోగం') || q.includes('பூச்சி') || q.includes('நோய்') || q.includes('ಕೀಟ') || q.includes('ರೋಗ') || q.includes('കീടം') || q.includes('രോഗം') || q.includes('পোকা') || q.includes('রোগ') || q.includes('જંતુ') || q.includes('રોગ') || q.includes('ਕੀੜੇ')) {
      key = 'pest';
    } else if (q.includes('fertilizer') || q.includes('soil') || q.includes('fertility') || q.includes('npk') || q.includes('urea') || q.includes('manure') || q.includes('compost') || q.includes('खाद') || q.includes('मिट्टी') || q.includes('नेल') || q.includes('ఎరువు') || q.includes('உரம்') || q.includes('மண்') || q.includes('ಗೊಬ್ಬರ') || q.includes('ಮಣ್ಣು') || q.includes('വളം') || q.includes('മണ്ണ്') || q.includes('खत') || q.includes('माती') || q.includes('সার') || q.includes('মাটি') || q.includes('ખાતર') || q.includes('જમીન') || q.includes('ਖਾਦ') || q.includes('ਮਿੱਟੀ')) {
      key = 'fertilizer';
    } else if (q.includes('water') || q.includes('irrigate') || q.includes('rain') || q.includes('drip') || q.includes('sprinkler') || q.includes('flood') || q.includes('सिंचाई') || q.includes('पानी') || q.includes('जल') || q.includes('నీరు') || q.includes('తడి') || q.includes('పాసనం') || q.includes('தண்ணீர்') || q.includes('ನೀರಾವರಿ') || q.includes('ನೀರು') || q.includes('നന') || q.includes('വെള്ളം') || q.includes('पाणी') || q.includes('जलसिंचन') || q.includes('সেচ') || q.includes('জল') || q.includes('પિયત') || q.includes('પાણી') || q.includes('ਸਿੰਚਾਈ') || q.includes('ਪਾਣੀ')) {
      key = 'water';
    } else if (q.includes('price') || q.includes('market') || q.includes('rates') || q.includes('mandi') || q.includes('sell') || q.includes('cost') || q.includes('दर') || q.includes('भाव') || q.includes('మార్కెట్') || q.includes('ధర') || q.includes('சந்தை') || q.includes('விலை') || q.includes('ಮಾರುಕಟ್ಟೆ') || q.includes('ದರ') || q.includes('വിപണി') || q.includes('വില') || q.includes('बाजार') || q.includes('दर') || q.includes('বাজার') || q.includes('দাম') || q.includes('બજાર') || q.includes('ભાવ') || q.includes('ਮੰਡੀ') || q.includes('ਭਾਅ')) {
      key = 'market';
    } else if (q.includes('scheme') || q.includes('pm-kisan') || q.includes('kusum') || q.includes('subsidy') || q.includes('grant') || q.includes('योजना') || q.includes('సబ్సిడీ') || q.includes('పథకం') || q.includes('திட்டம்') || q.includes('மானிய') || q.includes('ಯೋಜನೆ') || q.includes('ಸಬ್ಸಿಡಿ') || q.includes('പദ്ധതി') || q.includes('സബ്‌സിഡി') || q.includes('योजना') || q.includes('भत्त्या') || q.includes('ভর্তুকি') || q.includes('পরিকল্পনা') || q.includes('યોજના') || q.includes('સબસિડી') || q.includes('ਯੋਜਨਾ') || q.includes('ਸਬਸਿਡੀ')) {
      key = 'scheme';
    }

    return AGRI_KNOWLEDGE[key];
  };

  const askQuestion = async (textInput, lang = 'auto', farm = null, metrics = null) => {
    if (!textInput.trim()) return null;

    // Resolve current language context
    const resolved = lang === 'auto' ? detectLanguage(textInput) : lang;

    const userMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: {
        en: textInput, te: textInput, hi: textInput, ta: textInput,
        kn: textInput, ml: textInput, mr: textInput, bn: textInput,
        gu: textInput, pa: textInput
      },
      resolvedLang: resolved,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textInput,
          language: resolved,
          farmData: { farm, metrics }
        })
      });

      if (!response.ok) {
        throw new Error("Backend chat service returned an error status");
      }

      const data = await response.json();
      const aiMessageText = data.text || "I'm sorry, I could not generate a response.";
      
      const translationsObj = {
        en: aiMessageText, te: aiMessageText, hi: aiMessageText, ta: aiMessageText,
        kn: aiMessageText, ml: aiMessageText, mr: aiMessageText, bn: aiMessageText,
        gu: aiMessageText, pa: aiMessageText
      };

      const aiMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: translationsObj,
        resolvedLang: resolved,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      return translationsObj;
    } catch (err) {
      console.warn("Backend copilot chat failed. Falling back to local rules:", err);
      // Local fallback simulation
      return new Promise((resolve) => {
        setTimeout(() => {
          const translationsObj = getAIAnswerTranslations(textInput, farm, metrics);
          const aiMessage = {
            id: 'msg_ai_' + Date.now(),
            sender: 'ai',
            text: translationsObj,
            resolvedLang: resolved,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsLoading(false);
          resolve(translationsObj);
        }, 1200);
      });
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        id: 'welcome',
        sender: 'ai', 
        text: {
          en: AGRI_KNOWLEDGE.welcome.en,
          te: AGRI_KNOWLEDGE.welcome.te,
          hi: AGRI_KNOWLEDGE.welcome.hi,
          ta: AGRI_KNOWLEDGE.welcome.ta,
          kn: AGRI_KNOWLEDGE.welcome.kn,
          ml: AGRI_KNOWLEDGE.welcome.ml,
          mr: AGRI_KNOWLEDGE.welcome.mr,
          bn: AGRI_KNOWLEDGE.welcome.bn,
          gu: AGRI_KNOWLEDGE.welcome.gu,
          pa: AGRI_KNOWLEDGE.welcome.pa
        },
        resolvedLang: 'en',
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
