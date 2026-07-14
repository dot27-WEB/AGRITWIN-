import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  Sprout, Cpu, HeartPulse, Droplets, TrendingUp, Landmark, 
  ChevronRight, Languages, Mic, ArrowRight, UserCheck
} from 'lucide-react';
import '../styles/landing.css';

export const LandingPage = () => {
  const { t, language } = useLanguage();
  const { profile, activeFarm } = useFarm();

  const features = [
    {
      icon: Cpu,
      title: { en: "AI Digital Twin", te: "ఏఐ డిజిటల్ ట్విన్", hi: "एआई डिजिटल ट्विन" },
      desc: { 
        en: "Generates a virtual clone of your farm to analyze fertility, health, and risk parameters.",
        te: "నేల సారం, పొలం ఆరోగ్యం మరియు నష్ట భయాలను అంచనా వేసే వర్చువల్ మోడల్.",
        hi: "खेत की उर्वरता, स्वास्थ्य और जोखिम मापदंडों का विश्लेषण करने के लिए एक वर्चुअल मॉडल।"
      },
      color: "text-farm-400"
    },
    {
      icon: Sprout,
      title: { en: "Crop Rotation Engine", te: "పంటల సలహాదారు", hi: "फसल चक्र इंजन" },
      desc: { 
        en: "Intelligent crop recommendations based on historical cropping patterns and soil depletion rates.",
        te: "గత పంటల చరిత్ర మరియు నేల స్వభావాన్ని బట్టి అనువైన పంటలను సిఫార్సు చేస్తుంది.",
        hi: "फसल के इतिहास और मिट्टी की कमी के आधार पर फसलों की बुद्धिमान सिफारिशें।"
      },
      color: "text-emerald-400"
    },
    {
      icon: HeartPulse,
      title: { en: "Disease Clinic", te: "తెగుళ్ల నివారణ", hi: "रोग निदान केंद्र" },
      desc: { 
        en: "Scan plant leaves to detect infections instantly and receive treatment guidelines.",
        te: "ఆకుల ఫోటోలను స్క్యాన్ చేసి తెగుళ్లను గుర్తించడం మరియు మందులను సూచించడం.",
        hi: "संक्रमणों का तुरंत पता लगाने के लिए पौधों की पत्तियों को स्कैन करें और उपचार प्राप्त करें।"
      },
      color: "text-rose-400"
    },
    {
      icon: Droplets,
      title: { en: "Smart Irrigation", te: "నీటి యాజమాన్యం", hi: "सिंचाई सहायक" },
      desc: { 
        en: "Predicts next watering needs using weather variables and drainage capacities.",
        te: "నేల రకం మరియు వాతావరణ సమాచారాన్ని బట్టి తదుపరి తడి అందించాల్సిన తేదీలను లెక్కించడం.",
        hi: "मौसम और मिट्टी की जलधारण क्षमता के आधार पर अगली सिंचाई की तिथि का अनुमान लगाना।"
      },
      color: "text-blue-400"
    },
    {
      icon: TrendingUp,
      title: { en: "Market Intelligence", te: "మార్కెట్ సమాచారం", hi: "बाजार सूचना", },
      desc: { 
        en: "Track local market pricing forecasts, support thresholds, and buy-sell indicators.",
        te: "మార్కెట్ ధరలు, కనీస మద్దతు ధరల ట్రెండ్స్ మరియు అమ్మకాల సలహాలు.",
        hi: "स्थानीय बाजार मूल्य पूर्वानुमान, एमएसपी सीमाएं और खरीद-बिक्री के संकेत ट्रैक करें।"
      },
      color: "text-amber-400"
    },
    {
      icon: Landmark,
      title: { en: "Subsidy Matcher", te: "ప్రభుత్వ పథకాలు", hi: "सरकारी योजनाएं" },
      desc: { 
        en: "Automatically matches eligibility criteria for PM-KISAN, PM-KUSUM, and insurance programs.",
        te: "పీఎం-కిసాన్, కుసుమ్ సోలార్ పంపుల వంటి పథకాలకు మీ అర్హతలను సరిచూడడం.",
        hi: "पीएम-किसान, पीएम-कुसुम और बीमा योजनाओं के लिए योग्यता का मिलान करना।"
      },
      color: "text-teal-400"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-8 pb-16 px-4 md:px-8">
      
      {/* Dynamic background glows */}
      <div className="hero-glow top-12 left-10 md:left-1/4 animate-pulse-slow" />
      <div className="hero-glow-gold bottom-20 right-10 md:right-1/4" />

      {/* Main Grid Graphic Backdrop */}
      <div className="absolute inset-0 feature-grid-bg opacity-30 pointer-events-none" />

      {/* Top Welcome Notification Badge */}
      {profile && (
        <div className="mb-6 relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-farm-950/30 border border-farm-500/20 text-farm-300 text-xs font-semibold">
            <UserCheck className="w-4 h-4 text-farm-400" />
            Active Session: {profile.name}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mt-6 md:mt-12 relative z-10">
        
        {/* Animated Icon badge */}
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-white/10 mb-6 shadow-xl shadow-black/50">
          <Sprout className="w-8 h-8 text-farm-500 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          <span className="text-gradient-green">AgriTwin AI</span>
        </h1>
        
        <p className="text-lg md:text-2xl font-bold text-slate-100 mb-4 tracking-wide max-w-2xl mx-auto px-4">
          "{t('tagline')}"
        </p>

        <p className="text-xs md:text-sm text-slate-400 font-medium mb-10 max-w-xl mx-auto leading-relaxed px-4">
          {t('extendedTagline')}
        </p>

        {/* Action Button Grid */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          {profile ? (
            activeFarm ? (
              <Link to="/dashboard">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Enter Digital Twin Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/create-twin">
                <Button variant="primary" size="lg" icon={Cpu}>
                  {t('buttonCreateTwin')}
                </Button>
              </Link>
            )
          ) : (
            <>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" icon={ChevronRight}>
                  {t('buttonGetStarted')}
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  {t('navLogin')}
                </Button>
              </Link>
            </>
          )}
        </div>

      </div>

      {/* Feature Showcase Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 relative z-10 w-full px-4">
        {features.map((feat, idx) => {
          const IconComp = feat.icon;
          return (
            <Card 
              key={idx} 
              title={
                <span className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                  <IconComp className={`w-5 h-5 ${feat.color}`} />
                  {feat.title[language] || feat.title['en']}
                </span>
              }
              hoverGlow={true}
              variant="green"
              className="group"
            >
              <p className="text-xs text-slate-400 leading-relaxed font-medium mt-1">
                {feat.desc[language] || feat.desc['en']}
              </p>
            </Card>
          );
        })}
      </div>

      {/* AI Voice Assistant Floating Alert Box */}
      <div className="max-w-2xl mx-auto mt-16 p-4 rounded-2xl bg-slate-900/30 border border-white/5 backdrop-blur-md flex items-center gap-4 relative z-10 w-full text-center sm:text-left flex-col sm:flex-row">
        <div className="w-12 h-12 rounded-full bg-farm-500/10 flex items-center justify-center text-farm-400 border border-farm-500/20 shrink-0">
          <Mic className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-white tracking-wider uppercase mb-1">
            Built-in Multilingual Voice Navigation
          </h5>
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            No typing required! Tap the microphone icon in the bottom-right corner at any time and say your commands in **English, Telugu, or Hindi** to control your virtual twin.
          </p>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
