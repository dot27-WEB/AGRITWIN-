import React from "react";
import { Card } from "../common/Card";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface RiskMeterProps {
  score: number;
  overall: "Low" | "Moderate" | "High" | "Critical";
  disease: number;
  water: number;
  market: number;
  pest: number;
  isCalculating?: boolean;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score = 45,
  overall = "Moderate",
  disease = 30,
  water = 65,
  market = 40,
  pest = 35,
  isCalculating = false
}) => {
  const getOverallColor = (o: string) => {
    switch (o) {
      case "Critical":
        return "text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-200/30";
      case "High":
        return "text-orange-600 bg-orange-50 dark:bg-orange-950/20 border-orange-200/30";
      case "Moderate":
        return "text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200/30";
      default:
        return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/30";
    }
  };

  const getRiskColorBar = (val: number) => {
    if (val > 75) return "bg-rose-500";
    if (val > 50) return "bg-orange-500";
    if (val > 30) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <Card className="flex flex-col h-full group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-300 font-sans">Farm Risk Meter</span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getOverallColor(overall)}`}>
          {overall} Risk ({isCalculating ? "--" : `${score}%`})
        </span>
      </div>

      <div className="space-y-3.5 flex-1 py-1">
        {/* Overall scale gauge line */}
        <div>
          <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
            {/* Color divisions representing scale */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 opacity-20" />
            {/* Active pointer bar */}
            <div
              style={{ width: `${score}%` }}
              className={`h-full rounded-full transition-all duration-1000 ${getRiskColorBar(score)}`}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold uppercase mt-1">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Critical</span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Disease Risk */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-gray-600 dark:text-gray-400">
              <span>Disease Outbreak</span>
              <span>{disease}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div style={{ width: `${disease}%` }} className={`h-full ${getRiskColorBar(disease)}`} />
            </div>
          </div>

          {/* Water Stress Risk */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-gray-600 dark:text-gray-400">
              <span>Water Deficit</span>
              <span>{water}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div style={{ width: `${water}%` }} className={`h-full ${getRiskColorBar(water)}`} />
            </div>
          </div>

          {/* Market Price Volatility Risk */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-gray-600 dark:text-gray-400">
              <span>Market Drop</span>
              <span>{market}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div style={{ width: `${market}%` }} className={`h-full ${getRiskColorBar(market)}`} />
            </div>
          </div>

          {/* Pest Invasions */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-gray-600 dark:text-gray-400">
              <span>Pest Risk</span>
              <span>{pest}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div style={{ width: `${pest}%` }} className={`h-full ${getRiskColorBar(pest)}`} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
