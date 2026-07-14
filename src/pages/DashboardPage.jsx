import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import cropsData from '../data/crops.json';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  Sprout, HeartPulse, Droplets, TrendingUp, Landmark, CalendarDays, 
  PlusCircle, BrainCircuit, RefreshCw, Layers, MapPin, Sparkles, ChevronRight,
  CloudSun, Mic, MessageSquare, Send, CheckCircle2, AlertTriangle, Info, ShieldAlert
} from 'lucide-react';
import '../styles/dashboard.css';

export const DashboardPage = () => {
  const { t, language } = useLanguage();
  const { 
    farms, 
    activeFarm, 
    computedMetrics, 
    setActiveFarmId,
    profile
  } = useFarm();
  const navigate = useNavigate();

  // Mock Copilot State
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am AgriTwin AI, your virtual farming assistant. Ask me anything about crop recommendations, disease scans, irrigation schedules, or mandi market rates." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // If no session exists, prompt login
  if (!profile) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6">
        <BrainCircuit className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white mb-2">Verification Session Required</h3>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          Please log in first using mobile verification to access your virtual twin profiles.
        </p>
        <Link to="/login">
          <Button variant="primary">Go to Login</Button>
        </Link>
      </div>
    );
  }

  // If no farm twin exists, prompt creation
  if (!activeFarm || !computedMetrics) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-farm-500 mb-6 shadow-xl">
          <BrainCircuit className="w-8 h-8 animate-pulse-slow" />
        </div>
        <h3 className="text-xl font-extrabold text-white mb-2 tracking-wide">
          {t('noActiveTwin')}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-8 leading-relaxed">
          Create a virtual profile of your field to analyze soil, track risk variables, and forecast profits.
        </p>
        <Link to="/create-twin">
          <Button variant="primary" size="lg" icon={PlusCircle}>
            {t('buttonCreateTwin')}
          </Button>
        </Link>
      </div>
    );
  }

  const currentCrop = cropsData.find(c => c.id === activeFarm.currentCrop);
  const currentCropName = currentCrop ? (currentCrop.name[language] || currentCrop.name['en']) : activeFarm.currentCrop;

  const recommendedCrop = cropsData.find(c => c.id === computedMetrics.rotation.recommendedNextCropId);
  const recommendedCropName = recommendedCrop ? (recommendedCrop.name[language] || recommendedCrop.name['en']) : computedMetrics.rotation.recommendedNextCropId;

  // Weather preview values
  const temperature = "32°C";
  const humidity = "68%";
  const rainProb = "20%";
  const windSpeed = "14 km/h";
  const forecastText = "Partly Cloudy - 20% Precipitation expected";

  // Irrigation variables calculation (preserved from IrrigationPage.jsx)
  let baseFreq = currentCrop?.irrigationFrequencyDays || 8;
  if (activeFarm.soilType === "Sandy") baseFreq -= 2;
  else if (activeFarm.soilType === "Clayey") baseFreq += 3;
  baseFreq = Math.max(baseFreq, 2);

  let baseLitersPerAcre = 12000;
  if (currentCrop?.waterRequirement === "High") baseLitersPerAcre = 24000;
  else if (currentCrop?.waterRequirement === "Low") baseLitersPerAcre = 6000;

  if (activeFarm.irrigationMethod === "Drip") baseLitersPerAcre = Math.round(baseLitersPerAcre * 0.6);
  else if (activeFarm.irrigationMethod === "Sprinkler") baseLitersPerAcre = Math.round(baseLitersPerAcre * 0.85);
  else if (activeFarm.irrigationMethod === "Flood") baseLitersPerAcre = Math.round(baseLitersPerAcre * 1.2);

  const land = parseFloat(activeFarm.landSize) || 1;
  const totalWaterRequirement = Math.round(baseLitersPerAcre * land);

  // Smooth scroll utility
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Mock Copilot Command processing
  const handleCopilotSend = (text) => {
    if (!text.trim()) return;
    
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      const lower = text.toLowerCase();

      if (lower.includes("irrigate") || lower.includes("water") || lower.includes("should i")) {
        replyText = `Based on your crop (${currentCropName}) in ${activeFarm.village}, the soil moisture is currently stable. With a temperature of ${temperature} and rain expected tomorrow, you should delay irrigation until tomorrow morning.`;
      } else if (lower.includes("crop") || lower.includes("recommend") || lower.includes("next crop")) {
        replyText = `Analyzing rotation records for your twin field. Based on your previous crops, the optimal rotation suggestion is ${recommendedCropName}. This helps restore soil fertility and breaks disease vector nesting patterns.`;
      } else if (lower.includes("weather") || lower.includes("forecast") || lower.includes("rain")) {
        replyText = `Today's localized microclimate forecast for ${activeFarm.village} is ${temperature}, ${humidity} humidity, and wind speeds at ${windSpeed}. Forecast details: ${forecastText}.`;
      } else if (lower.includes("disease") || lower.includes("scan") || lower.includes("leaf")) {
        replyText = "To scan crops for infection, navigate to the 'Disease Clinic' page from the main menu, where you can upload leaf photographs to run real-time pathogen recognition models.";
      } else {
        replyText = `Analyzing virtual twin metrics... Currently, your Farm Health is ${computedMetrics.farmHealthScore}%, soil fertility is stable, and irrigation is scheduled in ${baseFreq} days. Let me know if you would like specific optimization guidelines.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
      setIsTyping(false);
    }, 1000);
  };

  // Simulated Voice Activation
  const handleVoiceClick = () => {
    if (isListening) return;
    setIsListening(true);
    setMessages(prev => [...prev, { sender: 'ai', text: "Voice session active. Listening for commands..." }]);

    setTimeout(() => {
      setIsListening(false);
      const randomCommands = [
        "Should I irrigate today?",
        "Recommend next crop",
        "Show today's weather",
        "Open disease detection"
      ];
      const selectedCmd = randomCommands[Math.floor(Math.random() * randomCommands.length)];
      handleCopilotSend(selectedCmd);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-12 dashboard-container">
      
      {/* ========================================================
          SECTION 1 & 3: FARM OVERVIEW (Hero greeting + Farm Summary)
          ======================================================== */}
      <div className="space-y-6">
        {/* Styled Hero Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 hero-glow-card p-6 md:p-8 rounded-3xl backdrop-blur-md relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-farm-500/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-farm-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4 animate-pulse" />
              {t('farmTwin') || 'Farm Twin'} Active
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t('goodMorning') || 'Good Morning'}, <span className="text-gradient-green">{activeFarm.farmerName}</span> 👋
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-farm-500" />
                {activeFarm.village}
              </span>
              <span className="text-slate-700">•</span>
              <span>Active Crop: <strong className="text-slate-200">{currentCropName}</strong></span>
              <span className="text-slate-700">•</span>
              <span>Area: <strong className="text-slate-200">{activeFarm.landSize} Acres</strong></span>
            </div>
          </div>

          {/* Switcher & Create twin action */}
          <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
            {farms.length > 1 && (
              <select
                value={activeFarm.id}
                onChange={(e) => setActiveFarmId(e.target.value)}
                className="bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-farm-500"
              >
                {farms.map((f, i) => (
                  <option key={f.id} value={f.id}>
                    Twin #{i + 1} ({f.village})
                  </option>
                ))}
              </select>
            )}
            <Link to="/create-twin">
              <Button variant="secondary" size="sm" icon={PlusCircle}>
                Add Twin
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 3: Farm Summary Card */}
        <Card hoverGlow={true} className="border border-white/5 bg-slate-900/10" variant="green">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-2">
            
            {/* Health Score Gauge */}
            <div className="flex flex-col items-center text-center space-y-3 shrink-0">
              <div className="relative w-36 h-36 flex items-center justify-center gauge-svg-container">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle 
                    cx="50" cy="50" r="42" 
                    className="gauge-track" 
                    strokeWidth="8" fill="none"
                  />
                  {/* Active Indicator progress */}
                  <circle 
                    cx="50" cy="50" r="42" 
                    stroke="url(#greenGradient)" 
                    strokeWidth="8" fill="none"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - computedMetrics.farmHealthScore / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4ade80" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center Percentage Display */}
                <div className="text-center">
                  <span className="text-3xl font-black text-white tracking-tight">{computedMetrics.farmHealthScore}%</span>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Health</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">{t('farmHealth') || 'Farm Health'} Score</h4>
                <p className="text-[10px] text-slate-500 font-medium">Derived from soil nutrients and risk audits</p>
              </div>
            </div>

            {/* Farm Metrics Divider for Large Screens */}
            <div className="hidden lg:block w-[1px] h-28 bg-white/5" />

            {/* Farm Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t('currentCrop') || 'Current Crop'}</span>
                <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-farm-400" />
                  {currentCropName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t('soilType') || 'Soil Type'}</span>
                <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  {activeFarm.soilType}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t('waterSource') || 'Water Source'}</span>
                <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  {activeFarm.waterAvailability}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t('farmArea') || 'Farm Area'}</span>
                <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  {activeFarm.landSize} Acres
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t('irrigationMethod') || 'Irrigation Method'}</span>
                <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-teal-400" />
                  {activeFarm.irrigationMethod}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Estimated Yield</span>
                <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-farm-400" />
                  {computedMetrics.profit.yieldAcre} Qtl/Acre
                </span>
              </div>
            </div>

          </div>
        </Card>
      </div>

      {/* ========================================================
          SECTION 2 & 4: TODAY'S AI RECOMMENDATIONS (Highlight & Checklist)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        
        {/* Section 1 Recommendation (Highlight Card) - 3/5 width */}
        <div className="lg:col-span-3 flex">
          <div className="recommendation-highlight-card rounded-3xl p-6 md:p-8 flex flex-col justify-between w-full relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h4 className="text-xs font-bold text-farm-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                {t('todaysAIRecommendation') || "Today's AI Recommendation"}
              </h4>
              <span className="px-2.5 py-1 rounded-full bg-farm-500/10 border border-farm-500/20 text-farm-400 text-[10px] font-bold">
                High Priority
              </span>
            </div>

            <div className="space-y-4 my-auto">
              <span className="text-4xl text-farm-500 font-serif leading-none block">“</span>
              <p className="text-lg md:text-xl font-bold text-white tracking-wide leading-relaxed">
                Rain is expected this evening in your area. 
                Delay irrigation schedules until tomorrow morning to conserve water and prevent root congestion.
              </p>
              <div className="text-right">
                <span className="text-4xl text-farm-500 font-serif leading-none block">-</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-farm-400" />
              Generated by AgriTwin Predictive Model • Updated 1h ago
            </div>
          </div>
        </div>

        {/* Section 4: Recommendations List - 2/5 width */}
        <div className="lg:col-span-2 flex">
          <Card hoverGlow={true} className="border border-white/5 bg-slate-900/10 w-full flex flex-col justify-between">
            <div className="border-b border-white/5 pb-3 mb-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-farm-400" />
                {t('todaysAIRecommendations') || "Today's AI Recommendations"}
              </h4>
            </div>

            <div className="space-y-4 flex-grow justify-center flex flex-col">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                  ✔
                </div>
                <div>
                  <span className="text-xs font-bold text-white">Rain expected tomorrow</span>
                  <span className="block text-[10px] text-slate-500">Weather radar projects 85% probability</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                  ✔
                </div>
                <div>
                  <span className="text-xs font-bold text-white">Irrigate tomorrow morning</span>
                  <span className="block text-[10px] text-slate-500">Estimated duration: 45 mins (Drip)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                  ✔
                </div>
                <div>
                  <span className="text-xs font-bold text-white">Soil moisture sufficient</span>
                  <span className="block text-[10px] text-slate-500">Virtual twin sensor audit checks out stable</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                  ✔
                </div>
                <div>
                  <span className="text-xs font-bold text-white">Crop health stable</span>
                  <span className="block text-[10px] text-slate-500">Vegetation index (NDVI) is at 0.78</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                  ✔
                </div>
                <div>
                  <span className="text-xs font-bold text-white">No disease detected</span>
                  <span className="block text-[10px] text-slate-500">Last scanned patch: 3 days ago</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* ========================================================
          SECTION 2: QUICK ACTION LAUNCHERS
          ======================================================== */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Layers className="w-4 h-4 text-farm-500" />
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Weather */}
          <div onClick={() => scrollToSection('weather-preview')} className="cursor-pointer group">
            <Card hoverGlow={true} className="h-full flex flex-col justify-between border border-white/5 bg-slate-900/10 group-hover:border-blue-500/30">
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit group-hover:scale-105 transition-transform">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {t('weather') || 'Weather'}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium mt-1">
                    Check local forecast parameters, rain schedules, and microclimate variables.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-blue-400 font-bold flex items-center gap-0.5 mt-4 self-end group-hover:translate-x-1 transition-transform">
                Preview Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </div>

          {/* Card 2: Smart Irrigation */}
          <div onClick={() => scrollToSection('irrigation-preview')} className="cursor-pointer group">
            <Card hoverGlow={true} className="h-full flex flex-col justify-between border border-white/5 bg-slate-900/10 group-hover:border-farm-500/30">
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-farm-500/10 border border-farm-500/20 text-farm-400 w-fit group-hover:scale-105 transition-transform">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-farm-400 transition-colors">
                    {t('smartIrrigation') || 'Smart Irrigation'}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium mt-1">
                    Optimize water volume requirements, crop hydration dates, and soil absorption metrics.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-farm-400 font-bold flex items-center gap-0.5 mt-4 self-end group-hover:translate-x-1 transition-transform">
                Preview Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </div>

          {/* Card 3: AgriTwin AI Copilot */}
          <div onClick={() => scrollToSection('copilot-card')} className="cursor-pointer group">
            <Card hoverGlow={true} className="h-full flex flex-col justify-between border border-white/5 bg-slate-900/10 group-hover:border-amber-500/30" variant="gold">
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit group-hover:scale-105 transition-transform">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {t('agriTwinAICopilot') || 'AgriTwin AI Copilot'}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium mt-1">
                    Interact directly with your Virtual Assistant. Get real-time, context-aware answers.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 mt-4 self-end group-hover:translate-x-1 transition-transform">
                Access Chat <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </div>

          {/* Card 4: Farm Intelligence */}
          <div onClick={() => scrollToSection('intelligence-preview')} className="cursor-pointer group">
            <Card hoverGlow={true} className="h-full flex flex-col justify-between border border-white/5 bg-slate-900/10 group-hover:border-emerald-500/30">
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit group-hover:scale-105 transition-transform">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {t('farmIntelligence') || 'Farm Intelligence'}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium mt-1">
                    Inspect rotation guidelines, fertility mapping indices, and historical data logs.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-4 self-end group-hover:translate-x-1 transition-transform">
                Preview Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </div>

        </div>
      </div>

      {/* ========================================================
          SECTION 5: WEATHER PREVIEW
          ======================================================== */}
      <div id="weather-preview">
        <Card hoverGlow={true} className="border border-white/5 bg-slate-900/10" variant="green">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4 border-b border-white/5 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('weatherPreview') || 'Weather Preview'}</h3>
                <p className="text-xs text-slate-400">Localized farm microclimate parameters</p>
              </div>
            </div>
            
            <Link to="/irrigation">
              <Button variant="secondary" size="sm" icon={ChevronRight}>
                {t('viewCompleteWeather') || 'View Complete Weather'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Temperature</span>
              <span className="text-2xl font-black text-white">{temperature}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Humidity</span>
              <span className="text-2xl font-black text-white">{humidity}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Rain Probability</span>
              <span className="text-2xl font-black text-blue-400">{rainProb}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Wind Speed</span>
              <span className="text-2xl font-black text-white">{windSpeed}</span>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Forecast</span>
              <span className="text-xs font-bold text-slate-300 block leading-tight">{forecastText}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ========================================================
          SECTION 6: SMART IRRIGATION PREVIEW
          ======================================================== */}
      <div id="irrigation-preview">
        <Card hoverGlow={true} className="border border-white/5 bg-slate-900/10" variant="green">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4 border-b border-white/5 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-farm-500/10 border border-farm-500/20 text-farm-400">
                <Droplets className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('smartIrrigationPreview') || 'Smart Irrigation Preview'}</h3>
                <p className="text-xs text-slate-400">Optimized scheduling based on virtual sensor logs</p>
              </div>
            </div>
            
            <Link to="/irrigation">
              <Button variant="secondary" size="sm" icon={ChevronRight}>
                {t('openSmartIrrigation') || 'Open Smart Irrigation'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Current Status</span>
              <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 glowing-badge" />
                Sufficient Moisture
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Recommended Irrigation Time</span>
              <span className="text-sm font-extrabold text-amber-400">
                Tomorrow Morning, 6:00 AM
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Est. Water Requirement</span>
              <span className="text-sm font-extrabold text-white">
                {totalWaterRequirement.toLocaleString('en-IN')} Liters
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Water Saving Tip</span>
              <span className="text-xs font-semibold text-slate-300 block leading-relaxed">
                {activeFarm.irrigationMethod === "Drip" 
                  ? "Drip irrigation saves 40% water. Inspect pipe filters weekly." 
                  : "Consider upgrading to Drip irrigation to reduce losses by up to 40%."}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* ========================================================
          SECTION 7: FARM INTELLIGENCE PREVIEW
          ======================================================== */}
      <div id="intelligence-preview">
        <Card hoverGlow={true} className="border border-white/5 bg-slate-900/10" variant="green">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4 border-b border-white/5 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('farmIntelligencePreview') || 'Farm Intelligence Preview'}</h3>
                <p className="text-xs text-slate-400">Soil replenishment analysis and growth rotation model</p>
              </div>
            </div>
            
            <Link to="/crops">
              <Button variant="secondary" size="sm" icon={ChevronRight}>
                {t('viewCompleteAnalysis') || 'View Complete Analysis'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Previous Crop</span>
              <span className="text-sm font-extrabold text-white capitalize">
                {cropsData.find(c => c.id === activeFarm.previousCrop)?.name[language] || activeFarm.previousCrop}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Current Crop</span>
              <span className="text-sm font-extrabold text-white">
                {currentCropName}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Est. Soil Condition</span>
              <span className="text-sm font-extrabold text-emerald-400">
                Optimal (pH {computedMetrics.soil.ph})
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Suggested Next Crop</span>
              <span className="text-sm font-extrabold text-amber-400 block">
                {recommendedCropName}
              </span>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Harvest Progress</span>
              <span className="text-xs font-bold text-slate-300 block leading-tight">
                Sowing Phase Complete (80% vegetative phase entry)
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* ========================================================
          SECTION 8: PREMIUM AGRITWIN AI COPILOT CARD (Stateful UI-Only Demo)
          ======================================================== */}
      <div id="copilot-card">
        <Card hoverGlow={true} className="border border-white/5 bg-slate-900/10 p-0 overflow-hidden" variant="gold">
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-slate-950/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <BrainCircuit className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  {t('agriTwinAICopilot') || 'AgriTwin AI Copilot'}
                  <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 glowing-badge" />
                </h3>
                <p className="text-[10px] text-slate-400">🤖 Ask AgriTwin AI anything • Virtual Assistant Demo</p>
              </div>
            </div>

            {/* Listening Indicator wave */}
            {isListening && (
              <div className="voice-wave-container bg-farm-500/10 border border-farm-500/20 px-3 py-1 rounded-xl">
                <span className="text-[9px] font-bold text-farm-400 uppercase tracking-widest mr-1.5">Listening</span>
                <div className="voice-wave-bar" />
                <div className="voice-wave-bar" />
                <div className="voice-wave-bar" />
                <div className="voice-wave-bar" />
                <div className="voice-wave-bar" />
              </div>
            )}
          </div>

          {/* Interactive Chat Board area */}
          <div className="p-6 space-y-4 max-h-60 overflow-y-auto bg-slate-950/10">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm
                  ${msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-farm-600 to-emerald-500 text-white rounded-tr-none' 
                    : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'}`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-slate-900 border border-white/5 text-slate-400 rounded-2xl rounded-tl-none px-4 py-2 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* User Input & Buttons */}
          <div className="p-6 border-t border-white/5 space-y-4 bg-slate-950/20">
            {/* Clickable suggestion pills */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleCopilotSend("Should I irrigate today?")}
                className="suggestion-badge px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                "Should I irrigate today?"
              </button>
              <button 
                onClick={() => handleCopilotSend("Recommend next crop")}
                className="suggestion-badge px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                "Recommend next crop"
              </button>
              <button 
                onClick={() => handleCopilotSend("Show today's weather")}
                className="suggestion-badge px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                "Show today's weather"
              </button>
              <button 
                onClick={() => handleCopilotSend("Open disease detection")}
                className="suggestion-badge px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                "Open disease detection"
              </button>
            </div>

            {/* Input field actions */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCopilotSend(inputValue);
              }}
              className="flex items-center gap-3"
            >
              <div className="flex-grow copilot-input-container flex items-center px-4 py-1">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('askAgriTwin') || "Ask AgriTwin AI anything..."}
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 py-2.5 w-full focus:ring-0"
                />
                
                {/* Voice button */}
                <button
                  type="button"
                  onClick={handleVoiceClick}
                  disabled={isListening}
                  className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer mr-1 shrink-0
                    ${isListening ? 'text-farm-400 bg-farm-500/10' : ''}`}
                  title={t('voiceButton') || 'Voice'}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Button (Submit) */}
              <button
                type="submit"
                className="p-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl hover:brightness-110 shadow-md shadow-yellow-500/10 hover:-translate-y-0.5 transition-all cursor-pointer shrink-0"
                title={t('chatButton') || 'Chat'}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </Card>
      </div>

    </div>
  );
};

export default DashboardPage;
