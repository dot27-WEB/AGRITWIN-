import React from 'react';
import { Card } from '../common/Card';
import { useLanguage } from '../../context/LanguageContext';
import { CircleDollarSign, TrendingUp, Sparkles } from 'lucide-react';

export const ProfitCard = ({ profit, revenue, cost, yieldAcre, cropName }) => {
  const { t } = useLanguage();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <Card 
      title={
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <CircleDollarSign className="w-4 h-4 text-amber-400" />
          {t('expectedProfit')}
        </span>
      }
      hoverGlow={true}
      variant="gold"
    >
      <div className="space-y-4">
        
        {/* Large Currency Display */}
        <div className="border-b border-white/5 pb-2">
          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Projected Surplus (INR)</span>
          <span className="text-2xl font-black text-amber-400 tracking-tight block mt-0.5">
            {formatCurrency(profit)}
          </span>
        </div>

        {/* Breakdown details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-slate-400">Estimated Revenue</span>
            <span className="text-emerald-400">{formatCurrency(revenue)}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold border-b border-white/5 pb-2">
            <span className="text-slate-400">Production Costs</span>
            <span className="text-rose-400">-{formatCurrency(cost)}</span>
          </div>

          {/* Expected Yield */}
          <div className="flex items-center justify-between text-[11px] font-semibold pt-1">
            <div className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Projected Yield / Acre</span>
            </div>
            <span className="text-slate-200 font-bold">{yieldAcre} Qtl</span>
          </div>
        </div>

        {/* Small Action Prompt Tag */}
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-2.5 flex items-center justify-between text-[9px] font-bold text-amber-400 uppercase tracking-widest mt-2">
          <span>Target Crop: {cropName}</span>
          <span className="flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            Lucrative
          </span>
        </div>

      </div>
    </Card>
  );
};

export default ProfitCard;
