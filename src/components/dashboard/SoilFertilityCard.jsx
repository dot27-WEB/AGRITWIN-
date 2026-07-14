import React from 'react';
import { Card } from '../common/Card';
import { useLanguage } from '../../context/LanguageContext';
import { Activity, Thermometer, ShieldCheck } from 'lucide-react';

export const SoilFertilityCard = ({ fertilityScore, nitrogen, phosphorus, potassium, ph, soilType }) => {
  const { t } = useLanguage();

  const getNutrientColor = (level) => {
    switch (level) {
      case 'High': return 'bg-farm-500 text-farm-300';
      case 'Medium': return 'bg-amber-500 text-amber-300';
      case 'Low': return 'bg-rose-500 text-rose-300';
      default: return 'bg-slate-700 text-slate-400';
    }
  };

  const getNutrientProgress = (level) => {
    switch (level) {
      case 'High': return 'w-full';
      case 'Medium': return 'w-2/3';
      case 'Low': return 'w-1/3';
      default: return 'w-0';
    }
  };

  return (
    <Card 
      title={
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400" />
          {t('soilFertilityScore')}
        </span>
      }
      hoverGlow={true}
    >
      <div className="space-y-4">
        
        {/* Core Score Bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Classification</span>
            <span className="text-sm font-extrabold text-white">{soilType} Soil</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Score</span>
            <span className="text-lg font-black text-emerald-400">{fertilityScore} / 100</span>
          </div>
        </div>

        {/* N-P-K Progress list */}
        <div className="space-y-2.5">
          {/* Nitrogen */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mb-1">
              <span className="text-slate-300">NITROGEN (N)</span>
              <span className="text-slate-400">{nitrogen}</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${getNutrientColor(nitrogen)} ${getNutrientProgress(nitrogen)}`} />
            </div>
          </div>

          {/* Phosphorus */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mb-1">
              <span className="text-slate-300">PHOSPHORUS (P)</span>
              <span className="text-slate-400">{phosphorus}</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${getNutrientColor(phosphorus)} ${getNutrientProgress(phosphorus)}`} />
            </div>
          </div>

          {/* Potassium */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mb-1">
              <span className="text-slate-300">POTASSIUM (K)</span>
              <span className="text-slate-400">{potassium}</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${getNutrientColor(potassium)} ${getNutrientProgress(potassium)}`} />
            </div>
          </div>
        </div>

        {/* Soil pH value badge */}
        <div className="flex items-center justify-between mt-4 bg-slate-950/40 border border-white/5 rounded-xl p-3">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Acidity Level (pH)</span>
          <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">{ph} pH</span>
        </div>

      </div>
    </Card>
  );
};

export default SoilFertilityCard;
