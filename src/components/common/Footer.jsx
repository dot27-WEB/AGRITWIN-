import React from 'react';
import { Sprout } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarm } from '../../context/FarmContext';

export const Footer = () => {
  const { t } = useLanguage();
  const { activeFarm, computedMetrics } = useFarm();

  return (
    <footer className="mt-auto border-t border-white/5 bg-[#030712] py-8 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-farm-500" />
          <span className="text-xs text-slate-400">
            © {new Date().getFullYear()} <span className="text-slate-200 font-semibold">AgriTwin AI</span>.
            Designed for smart farming.
          </span>
        </div>

        {/* Digital Twin Status Indicator */}
        {activeFarm && computedMetrics && (
          <div className="flex items-center gap-3 bg-slate-900/40 border border-white/5 px-4 py-2 rounded-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-farm-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-farm-500"></span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Twin Profile: <span className="text-farm-400 font-bold">{activeFarm.farmerName}'s Farm</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Health: {computedMetrics.farmHealthScore}%
            </span>
          </div>
        )}

        {/* Quick Links */}
        <div className="flex items-center gap-6 text-[11px] text-slate-400">
          <a href="#" className="hover:text-farm-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-farm-400 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-farm-400 transition-colors">Support Helpline</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
