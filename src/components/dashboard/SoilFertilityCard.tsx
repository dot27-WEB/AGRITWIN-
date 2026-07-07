import React from "react";
import { Card } from "../common/Card";
import { ThermometerSun, Leaf } from "lucide-react";

interface Nutrient {
  value: number;
  status: string;
  recommend: string;
}

interface SoilFertilityCardProps {
  score: number;
  nitrogen: Nutrient;
  phosphorus: Nutrient;
  potassium: Nutrient;
  moisture: string;
  carbon: number;
  isCalculating?: boolean;
}

export const SoilFertilityCard: React.FC<SoilFertilityCardProps> = ({
  score = 68,
  nitrogen = { value: 55, status: "Medium", recommend: "" },
  phosphorus = { value: 45, status: "Medium", recommend: "" },
  potassium = { value: 72, status: "High", recommend: "" },
  moisture = "Medium",
  carbon = 0.55,
  isCalculating = false
}) => {
  const getProgressColor = (status: string) => {
    if (status === "High") return "bg-emerald-500";
    if (status === "Medium") return "bg-amber-500";
    return "bg-rose-500";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      High: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/20",
      Medium: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/20",
      Low: "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200/20"
    };
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[status] || styles["Low"]}`}>{status}</span>;
  };

  return (
    <Card className="flex flex-col h-full group relative overflow-hidden">
      {/* Background visual element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-300">Soil Nutrients & Fertility</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
            Fertility: {isCalculating ? "--" : `${score}%`}
          </span>
        </div>
      </div>

      {/* Nutrient meters */}
      <div className="space-y-4 flex-1 py-1">
        {/* Nitrogen */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-gray-700 dark:text-gray-300">Nitrogen (N)</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-500">{nitrogen.value} kg/ha</span>
              {getStatusBadge(nitrogen.status)}
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${nitrogen.value}%` }}
              className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(nitrogen.status)}`}
            />
          </div>
        </div>

        {/* Phosphorus */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-gray-700 dark:text-gray-300">Phosphorus (P)</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-500">{phosphorus.value} kg/ha</span>
              {getStatusBadge(phosphorus.status)}
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${phosphorus.value}%` }}
              className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(phosphorus.status)}`}
            />
          </div>
        </div>

        {/* Potassium */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-gray-700 dark:text-gray-300">Potassium (K)</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-500">{potassium.value} kg/ha</span>
              {getStatusBadge(potassium.status)}
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${potassium.value}%` }}
              className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(potassium.status)}`}
            />
          </div>
        </div>
      </div>

      {/* Trace details footer row */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800/80 mt-4 text-center">
        <div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">
            Moisture Retention
          </span>
          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
            {moisture}
          </p>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">
            Organic Carbon
          </span>
          <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {carbon}%
          </p>
        </div>
      </div>
    </Card>
  );
};
