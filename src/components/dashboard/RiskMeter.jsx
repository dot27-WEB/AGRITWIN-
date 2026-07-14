import React from 'react';
import { Card } from '../common/Card';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert, AlertCircle } from 'lucide-react';

export const RiskMeter = ({ diseaseRisk, waterRisk, marketRisk, profitabilityScore, overallRiskLevel }) => {
  const { t } = useLanguage();

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-farm-400 bg-farm-500/10 border-farm-500/20';
      default: return 'text-slate-400 bg-slate-900/50 border-white/5';
    }
  };

  const getProgressBarColor = (val) => {
    if (val > 70) return 'bg-gradient-to-r from-rose-600 to-red-500';
    if (val > 45) return 'bg-gradient-to-r from-amber-600 to-yellow-500';
    return 'bg-gradient-to-r from-farm-600 to-emerald-500';
  };

  return (
    <Card 
      title={
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          {t('riskLevel')}
        </span>
      }
      hoverGlow={true}
      variant="green"
    >
      <div className="space-y-4">
        
        {/* Overall Status Pill */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Overall Appraisal</span>
          <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${getRiskColor(overallRiskLevel)}`}>
            {overallRiskLevel} Risk
          </span>
        </div>

        {/* Dynamic Risk Bars */}
        <div className="space-y-3">
          
          {/* Disease Risk */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mb-1">
              <span className="text-slate-300">{t('diseaseRisk')}</span>
              <span className={diseaseRisk > 60 ? 'text-rose-400' : 'text-slate-400'}>{diseaseRisk}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(diseaseRisk)}`} 
                style={{ width: `${diseaseRisk}%` }} 
              />
            </div>
          </div>

          {/* Water Risk */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mb-1">
              <span className="text-slate-300">{t('waterRisk')}</span>
              <span className={waterRisk > 60 ? 'text-rose-400' : 'text-slate-400'}>{waterRisk}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(waterRisk)}`} 
                style={{ width: `${waterRisk}%` }} 
              />
            </div>
          </div>

          {/* Market Risk */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mb-1">
              <span className="text-slate-300">{t('marketRisk')}</span>
              <span className={marketRisk > 60 ? 'text-rose-400' : 'text-slate-400'}>{marketRisk}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(marketRisk)}`} 
                style={{ width: `${marketRisk}%` }} 
              />
            </div>
          </div>

        </div>

        {/* Profitability Rating Card */}
        <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-farm-500" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t('profitabilityScore')}</span>
          </div>
          <span className="text-sm font-black text-farm-400">{profitabilityScore} / 100</span>
        </div>

      </div>
    </Card>
  );
};

export default RiskMeter;
