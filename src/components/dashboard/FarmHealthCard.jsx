import React from 'react';
import { Card } from '../common/Card';
import { useLanguage } from '../../context/LanguageContext';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

export const FarmHealthCard = ({ healthScore, currentCropName, village, landSize }) => {
  const { t } = useLanguage();

  // Circular progress math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (healthScore / 100) * circumference;

  return (
    <Card 
      title={
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Activity className="w-4 h-4 text-farm-500" />
          {t('farmHealthScore')}
        </span>
      }
      hoverGlow={true}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2 relative">
        
        {/* Virtual Twin Circular Display */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          
          {/* Radial animated backlights */}
          <div className="absolute inset-4 rounded-full bg-farm-500/5 animate-pulse-slow filter blur-sm" />

          {/* SVG Progress Gauge */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-slate-900 fill-none"
              strokeWidth="10"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-farm-500 fill-none transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>

          {/* Value Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white tracking-tighter">
              {healthScore}%
            </span>
            <span className="text-[9px] font-bold text-farm-400 uppercase tracking-widest flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              Optimal
            </span>
          </div>
        </div>

        {/* Informative Stats */}
        <div className="flex-1 space-y-3 w-full">
          <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider mb-0.5">Active Twin Profile</span>
            <span className="text-sm font-extrabold text-white">{village}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-0.5">{t('currentCrop')}</span>
              <span className="text-xs font-bold text-farm-400">{currentCropName}</span>
            </div>
            
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-0.5">Farm Size</span>
              <span className="text-xs font-bold text-slate-200">{landSize} Acres</span>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default FarmHealthCard;
