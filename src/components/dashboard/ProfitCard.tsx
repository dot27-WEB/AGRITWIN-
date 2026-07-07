import React from "react";
import { Card } from "../common/Card";
import { Landmark, TrendingUp, DollarSign } from "lucide-react";

interface ProfitCardProps {
  gross: number;
  cost: number;
  net: number;
  yieldPerAcre: number;
  yieldUnit: string;
  pricePerUnit: number;
  soilBonus: number;
  riskDeduction: number;
  isCalculating?: boolean;
}

export const ProfitCard: React.FC<ProfitCardProps> = ({
  gross = 180000,
  cost = 60000,
  net = 120000,
  yieldPerAcre = 24.5,
  yieldUnit = "Quintals",
  pricePerUnit = 2350,
  soilBonus = 8,
  riskDeduction = 12,
  isCalculating = false
}) => {
  // Simple Indian Rupees formatting
  const formatRupees = (num: number) => {
    return "₹" + Math.round(num).toLocaleString("en-IN");
  };

  return (
    <Card className="flex flex-col h-full group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-300">Expected Profit Forecast</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400">
          Seasonal Estimate
        </span>
      </div>

      <div className="space-y-4 flex-1 py-1">
        {/* Net Profit Display */}
        <div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Estimated Net Profit</span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-3xl font-bold font-display text-emerald-800 dark:text-emerald-400 tracking-tight">
              {isCalculating ? "₹ --,---" : formatRupees(net)}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              Active Yield
            </span>
          </div>
        </div>

        {/* Detailed factors */}
        <div className="space-y-2 border-t border-gray-100 dark:border-slate-800/80 pt-3 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Estimated Yield:</span>
            <span className="font-extrabold text-gray-800 dark:text-gray-200">
              {yieldPerAcre} {yieldUnit} / Acre
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Avg Market Price:</span>
            <span className="font-extrabold text-gray-800 dark:text-gray-200">
              {formatRupees(pricePerUnit)} / {yieldUnit.slice(0, -1) || "Unit"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Cost of Cultivation:</span>
            <span className="font-bold text-rose-500">
              {formatRupees(cost)}
            </span>
          </div>
        </div>

        {/* Factors list */}
        <div className="flex items-center gap-2 pt-2 text-[10px] font-bold">
          <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">
            Soil: {soilBonus >= 0 ? `+${soilBonus}%` : `${soilBonus}%`} Yield
          </span>
          <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded">
            Risk Penalty: -{riskDeduction}%
          </span>
        </div>
      </div>
    </Card>
  );
};
