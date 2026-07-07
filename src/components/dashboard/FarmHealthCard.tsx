import React from "react";
import { Card } from "../common/Card";
import { Activity, ShieldCheck, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface FarmHealthCardProps {
  score: number;
  isCalculating?: boolean;
}

export const FarmHealthCard: React.FC<FarmHealthCardProps> = ({ score = 75, isCalculating = false }) => {
  // SVG Circular parameters
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-500 stroke-emerald-500";
    if (s >= 55) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getScoreGrade = (s: number) => {
    if (s >= 80) return { title: "Excellent Health", desc: "Sustainable rotation, balanced fertilizers, and resilient moisture nodes." };
    if (s >= 55) return { title: "Moderate Health", desc: "Exhaustive crop patterns or elevated chemical reliance detected." };
    return { title: "Degraded Health", desc: "Monoculture sequential crop history. Immediate crop rotation advised." };
  };

  const grade = getScoreGrade(score);

  return (
    <Card className="flex flex-col h-full relative overflow-hidden group">
      {/* Visual background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-300">Farm Health Twin</span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
          Realtime Simulation
        </span>
      </div>

      <div className="flex items-center justify-around py-4 flex-1">
        {/* Radial Progress Gauge */}
        <div className="relative flex items-center justify-center">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="rotate-[-90deg] transition-all duration-1000"
          >
            {/* Background track circle */}
            <circle
              stroke="rgba(16, 185, 129, 0.08)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Active circle with transition */}
            <motion.circle
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              fill="transparent"
              className={`transition-all duration-1000 ease-out ${getScoreColor(score).split(" ")[1]}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">
              {isCalculating ? "--" : score}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mt-0.5">
              SCORE
            </span>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="max-w-[180px] space-y-1.5">
          <p className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center">
            {score >= 55 ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-500 mr-1 shrink-0" />
            )}
            {grade.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            {grade.desc}
          </p>
        </div>
      </div>
    </Card>
  );
};
