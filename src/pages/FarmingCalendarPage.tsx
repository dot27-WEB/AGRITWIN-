import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import calendarData from "../data/farmingCalendar.json";
import { ArrowLeft, Calendar, AlertTriangle, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export const FarmingCalendarPage: React.FC = () => {
  const { profile, navigateTo } = useFarm();
  const { t } = useLanguage();
  
  // Use current crop key or fallback to default
  const getCurrentCropKey = () => {
    if (!profile) return "default";
    const c = profile.currentCrop.toLowerCase();
    if (c.includes("rice") || c.includes("paddy")) return "rice";
    if (c.includes("wheat")) return "wheat";
    if (c.includes("cotton")) return "cotton";
    return "default";
  };

  const [activeTab, setActiveTab] = useState<string>(getCurrentCropKey());

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">No active farm twin found.</p>
        <Button onClick={() => navigateTo("create-twin")}>Create Farm Twin</Button>
      </div>
    );
  }

  const activeTimeline = (calendarData as any)[activeTab] || calendarData.default;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigateTo("dashboard")}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-8 h-8 mr-2 text-emerald-500" />
            AI Farming Calendar Simulator
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Dynamically generated agronomic timeline based on crop gestation periods and seasonal moisture markers.
          </p>
        </div>
      </div>

      {/* Tabs selector */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 border-b border-gray-100 dark:border-slate-800/80">
        <button
          onClick={() => setActiveTab("rice")}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            activeTab === "rice"
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/25"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🌾 Paddy (Rice)
        </button>
        <button
          onClick={() => setActiveTab("wheat")}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            activeTab === "wheat"
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/25"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🌾 Wheat
        </button>
        <button
          onClick={() => setActiveTab("cotton")}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            activeTab === "cotton"
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/25"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🌿 Cotton
        </button>
        <button
          onClick={() => setActiveTab("default")}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            activeTab === "default"
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/25"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🌱 Standard Crop cycle
        </button>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l border-emerald-200/30 dark:border-slate-800 ml-4 md:ml-6 space-y-10 pl-6 md:pl-10 pb-6 pt-2">
        {activeTimeline.map((item: any, idx: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative"
          >
            {/* Timeline Circle Node */}
            <span className="absolute -left-[31px] md:-left-[47px] top-1 w-6 h-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </span>

            {/* Content card */}
            <Card className="p-5 space-y-3 relative overflow-hidden group">
              {/* Background gradient label */}
              <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-emerald-500/[0.01] to-transparent pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">
                  {item.month}
                </span>
                <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200/20">
                  {item.phase}
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                {item.task}
              </p>

              {/* Critical Alert Warnings */}
              {item.criticalAlert && (
                <div className="p-3 bg-rose-500/[0.02] border border-rose-500/15 rounded-xl flex items-start space-x-2 text-xs text-rose-800 dark:text-rose-400 mt-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <p className="font-semibold leading-normal">
                    <span className="font-bold">CRITICAL WARNING: </span>
                    {item.criticalAlert}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
