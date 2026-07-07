import React, { useState } from "react";
import { useFarm } from "../../context/FarmContext";
import { useLanguage, Language } from "../../context/LanguageContext";
import { Button } from "./Button";
import { Sprout, Mic, Languages, Menu, X, LogIn, LogOut, User, LayoutDashboard, Calendar, HelpCircle, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Navbar: React.FC = () => {
  const { profile, isAuthenticated, logout, activePage, navigateTo } = useFarm();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [voiceResponse, setVoiceResponse] = useState("");

  const languageLabels: Record<Language, string> = {
    en: "English",
    te: "తెలుగు",
    hi: "हिंदी"
  };

  const menuItems = [
    { page: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { page: "calendar", label: t("calendar"), icon: Calendar },
    { page: "profile", label: t("profile"), icon: User }
  ];

  const handleVoiceTrigger = () => {
    setIsVoiceOpen(true);
    setVoiceQuery("");
    setVoiceResponse("");
  };

  const startVoiceSimulation = () => {
    setIsListening(true);
    setVoiceResponse("");
    
    // Stage 1: simulate listening
    setTimeout(() => {
      setIsListening(false);
      // Pick a random smart farmer query
      const queries = [
        "What crop is best for rotation after my Rice harvest?",
        "Is my farm risk high right now?",
        "How can I save water on my Guntur clayey soil?",
        "Show me subsidies for solar water pumps"
      ];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      setVoiceQuery(`"${randomQuery}"`);

      // Stage 2: simulate thinking and responding
      setTimeout(() => {
        if (randomQuery.includes("rotation")) {
          setVoiceResponse("Based on your double Paddy cultivation, AgriTwin AI recommends sowing Groundnut immediately. Legumes fix nitrogen and will restore your soil health by 25%.");
        } else if (randomQuery.includes("risk")) {
          setVoiceResponse("Your farm risk is currently Moderate/High due to sequential Rice planting. Rotating crops and shifting to drip irrigation will lower your water risk score significantly.");
        } else if (randomQuery.includes("water")) {
          setVoiceResponse("For Clayey soil in Guntur, water retention is high. Shift to laser land leveling and alternate wetting & drying (AWD) to cut water costs by 35%.");
        } else {
          setVoiceResponse("You are highly eligible for the PM-KUSUM solar pump subsidy, which covers up to 60% of setup costs. Visit the Government Schemes page to apply directly.");
        }
      }, 1500);
    }, 2500);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#060c0a]/90 backdrop-blur-md border-b border-emerald-100/50 dark:border-emerald-950/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              onClick={() => navigateTo("landing")} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-950 dark:bg-emerald-400 flex items-center justify-center text-white dark:text-emerald-950 font-bold group-hover:scale-105 transition-all duration-300">
                <Sprout className="w-5 h-5 text-emerald-400 dark:text-emerald-950" />
              </div>
              <div>
                <span className="text-xl font-bold font-display text-emerald-950 dark:text-white tracking-tight">
                  AgriTwin AI
                </span>
                <p className="text-[10px] text-emerald-700/60 dark:text-emerald-400/60 font-mono tracking-wider uppercase -mt-1">
                  Digital Twin Engine
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated && profile && (
                <div className="flex items-center space-x-1.5 mr-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-100/30">
                    Twin Active: {profile.farmerName}
                  </span>
                </div>
              )}

              {/* Navigation Links */}
              {isAuthenticated && (
                <div className="flex items-center space-x-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.page;
                    return (
                      <button
                        key={item.page}
                        onClick={() => navigateTo(item.page)}
                        className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                          isActive
                            ? "bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40 font-semibold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 border-transparent"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Voice button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleVoiceTrigger}
                className="flex items-center space-x-1.5"
              >
                <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300">{t("voiceCommand")}</span>
              </Button>

              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-gray-200/60 dark:border-slate-800/80 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900 font-medium cursor-pointer">
                  <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{languageLabels[language]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1.5 w-32 origin-top-right rounded-2xl bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-900 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="p-1.5 space-y-1">
                    {(Object.keys(languageLabels) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                          language === lang
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        {languageLabels[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auth Button */}
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-1.5">
                  <LogOut className="w-4 h-4" />
                  <span>{t("logout")}</span>
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => navigateTo("login")} className="flex items-center space-x-1.5">
                  <LogIn className="w-4 h-4" />
                  <span>{t("login")}</span>
                </Button>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="flex md:hidden items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleVoiceTrigger}
                className="p-2"
              >
                <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </Button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800 cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-950 overflow-hidden"
            >
              <div className="px-4 pt-3 pb-6 space-y-3">
                {isAuthenticated && (
                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/30">
                    <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                      Active Twin: {profile?.farmerName} ({profile?.village})
                    </p>
                  </div>
                )}

                {/* Nav Links */}
                {isAuthenticated && (
                  <div className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.page}
                          onClick={() => {
                            navigateTo(item.page);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900 cursor-pointer"
                        >
                          <Icon className="w-4 h-4 text-emerald-500" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Languages Mobile Selection */}
                <div className="p-3 bg-gray-50 dark:bg-slate-900/40 rounded-2xl">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <Languages className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    Select Language / భాష ఎంచుకోండి
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(languageLabels) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                        }}
                        className={`py-1.5 px-1 rounded-xl text-xs font-semibold text-center border cursor-pointer ${
                          language === lang
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200"
                            : "border-gray-200 text-gray-700 bg-white dark:bg-slate-950 hover:bg-gray-100"
                        }`}
                      >
                        {languageLabels[lang]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auth Button */}
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("logout")}</span>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => {
                      navigateTo("login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t("login")}</span>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Floating Voice Assistant Modal */}
      <AnimatePresence>
        {isVoiceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVoiceOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-950 border border-emerald-100/30 dark:border-slate-900/60 shadow-2xl p-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsVoiceOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {t("voiceCommand")}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    AI Multilingual Farmer Assistant
                  </p>
                </div>
              </div>

              {/* Central Mic Button */}
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  {/* Glowing Animated Waves */}
                  <AnimatePresence>
                    {isListening && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-emerald-500"
                      />
                    )}
                  </AnimatePresence>

                  <button
                    onClick={startVoiceSimulation}
                    disabled={isListening}
                    className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                      isListening
                        ? "bg-emerald-500 text-white scale-110"
                        : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-200/50 hover:bg-emerald-100/60"
                    }`}
                  >
                    <Mic className={`w-10 h-10 ${isListening ? "animate-pulse" : ""}`} />
                  </button>
                </div>

                <p className="text-xs font-semibold text-center mt-6 text-gray-500 dark:text-gray-400 max-w-xs">
                  {isListening ? t("listening") : t("voiceInstruction")}
                </p>

                {/* Animated Equalizer while listening */}
                {isListening && (
                  <div className="flex items-center space-x-1.5 h-6 mt-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, 24, 8] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.12,
                          ease: "easeInOut"
                        }}
                        className="w-1.5 rounded-full bg-emerald-500"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Responses */}
              {(voiceQuery || voiceResponse) && (
                <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-900/50 mt-2 max-h-[160px] overflow-y-auto">
                  {voiceQuery && (
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        You Asked
                      </p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 italic">
                        {voiceQuery}
                      </p>
                    </div>
                  )}

                  {voiceResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-t border-gray-100 dark:border-slate-800/80 pt-2"
                    >
                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1.5 animate-pulse" />
                        AgriTwin Response
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                        {voiceResponse}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
