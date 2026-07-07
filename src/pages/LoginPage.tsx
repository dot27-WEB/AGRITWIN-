import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { User, MapPin, Sprout, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const LoginPage: React.FC = () => {
  const { login } = useFarm();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!village.trim()) {
      setError("Please enter your village/location");
      return;
    }
    setError("");
    login(name, village);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-emerald-50/10 via-white to-emerald-50/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Absolute Decorative bubbles */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl relative overflow-hidden group">
          {/* Logo element header */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-300">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to AgriTwin AI
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                Log in or register your physical land to begin mapping your real-time virtual digital twin.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 border border-rose-200/20 p-2.5 rounded-xl">
                ⚠️ {error}
              </p>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {t("farmerName")}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="e.g. Vardhan Rao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {t("village")}
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="e.g. Guntur, Andhra Pradesh"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-3 mt-4 flex items-center justify-center space-x-2 cursor-pointer">
              <span>Access Your Farm Twin</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Prompt info */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-4 border-t border-gray-100 dark:border-slate-800/80">
            🌾 <span className="font-bold">AgriTwin Tip:</span> Registering establishes a secure profile in local storage, which we use to generate soil, profit, and risk twins immediately.
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
