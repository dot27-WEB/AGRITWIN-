import React from "react";
import { Sprout } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Sprout className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                AgriTwin AI 🌾
              </span>
              <p className="text-[10px] text-gray-500">
                A digital twin for every farm, powered by AI.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <p>© 2026 AgriTwin AI. Developed for National Smart Agriculture Hackathon.</p>
            <div className="flex items-center space-x-1.5 bg-emerald-50/50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-100/10">
              <span>Future Scope: AGMARKNET & eNAM Interlinked</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
