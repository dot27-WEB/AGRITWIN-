import React from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Sprout, ShieldCheck, HelpCircle, ArrowRight, Activity, Award, Users, CloudRain, Star } from "lucide-react";
import { motion } from "motion/react";

export const LandingPage: React.FC = () => {
  const { isAuthenticated, navigateTo } = useFarm();
  const { t } = useLanguage();

  const handleStart = () => {
    if (isAuthenticated) {
      navigateTo("dashboard");
    } else {
      navigateTo("login");
    }
  };

  const stats = [
    { value: "480K+", label: "Farms Twin Mapped", icon: Sprout },
    { value: "95.4%", label: "Yield AI Accuracy", icon: Award },
    { value: "35%", label: "Water Resource Saved", icon: CloudRain },
    { value: "4.8/5", label: "Farmer Satisfaction", icon: Star }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8faf9] dark:bg-[#050c0a]">
      {/* Absolute Decorative ambient background blur or bubbles */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-teal-500/5 dark:bg-teal-500/5 blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-100/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
            >
              <span>🌾 National Agriculture Hackathon Winner</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-emerald-950 dark:text-white leading-tight font-display"
            >
              {t("landingTitle")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl"
            >
              {t("landingSubtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button variant="primary" size="lg" onClick={handleStart} className="flex items-center space-x-2 cursor-pointer">
                <span>{t("getStarted")}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigateTo("login")} className="flex items-center space-x-2">
                <span>{t("login")}</span>
              </Button>
            </motion.div>
          </div>

          {/* Hero Right Visuals (Digital Twin Simulation Render card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Glassmorphic digital twin card mock */}
            <div className="relative rounded-3xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 backdrop-blur-xl border border-emerald-200/20 dark:border-slate-800 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest">
                    Digital Twin Node
                  </span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Grid with visual mock twin parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-white/60 dark:bg-black/20 rounded-2xl border border-white/20">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Soil Fertility</span>
                  <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">88%</p>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="w-[88%] h-full bg-emerald-500" />
                  </div>
                </div>
                <div className="p-3.5 bg-white/60 dark:bg-black/20 rounded-2xl border border-white/20">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Irrigation Need</span>
                  <p className="text-xl font-extrabold text-teal-600 mt-0.5">In 3 Days</p>
                  <p className="text-[9px] text-gray-400 font-medium">Weather reasoning applied</p>
                </div>
                <div className="p-3.5 bg-white/60 dark:bg-black/20 rounded-2xl border border-white/20">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Optimal Rotation</span>
                  <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">Groundnut</p>
                  <p className="text-[9px] text-gray-400 font-medium">Nitrogen-fixing nodes</p>
                </div>
                <div className="p-3.5 bg-white/60 dark:bg-black/20 rounded-2xl border border-white/20">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Expected Profit</span>
                  <p className="text-xl font-extrabold text-emerald-600 mt-0.5">₹2.4L</p>
                  <p className="text-[9px] text-gray-400 font-medium">Guntur Mandi index rate</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/25 border border-emerald-900/30 rounded-2xl flex items-center space-x-3 text-xs text-emerald-100">
                <span>🌾</span>
                <p className="leading-relaxed font-medium">
                  "Soil fertility is depleting due to consecutive Paddy. Sowing Groundnut will boost Soil N levels by 30%."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Board */}
      <section className="bg-emerald-600/5 dark:bg-slate-900/40 border-y border-emerald-100/10 dark:border-slate-800/20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2.5">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                    {st.value}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why AgriTwin Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("whyAgriTwin")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            {t("whyAgriTwinDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Card hoverable className="flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("feature1Name")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 font-medium">
              {t("feature1Desc")}
            </p>
          </Card>

          {/* Feature 2 */}
          <Card hoverable className="flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("feature2Name")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 font-medium">
              {t("feature2Desc")}
            </p>
          </Card>

          {/* Feature 3 */}
          <Card hoverable className="flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("feature3Name")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 font-medium">
              {t("feature3Desc")}
            </p>
          </Card>

          {/* Feature 4 */}
          <Card hoverable className="flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("feature4Name")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 font-medium">
              {t("feature4Desc")}
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};
