import React, { useState, useEffect } from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { 
  ArrowLeft, Sprout, Droplets, TrendingUp, Sparkles, 
  Activity, ShieldAlert, Award, Loader2, CheckCircle2
} from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs text-left">
        <p className="font-bold text-white mb-1.5 border-b border-white/5 pb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-400">{entry.name}:</span>
              <span className="font-bold text-white">
                {entry.value.toLocaleString()} L
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const formatYAxis = (tickItem: number): string => {
  if (tickItem >= 1000) {
    return `${(tickItem / 1000).toFixed(0)}k`;
  }
  return tickItem.toString();
};

interface Nutrient {
  value: string;
  status: string;
}

interface CropHistoryItem {
  season: string;
  crop: string;
  nutrientImpact: string;
}

interface NextCropRec {
  cropName: string;
  confidence: number;
  expectedYield: string;
  expectedProfit: string;
  reason: string;
}

interface WaterUsageWeek {
  week: string;
  usage: number;
  average: number;
}

interface WaterUsageData {
  totalWaterUsed: string;
  waterSaved: string;
  irrigationEfficiency: string;
  history: WaterUsageWeek[];
}

interface YieldData {
  expectedYield: string;
  confidence: number;
  riskLevel: string;
}

interface AnalysisReport {
  healthScore: number;
  soilFertility: {
    nitrogen: Nutrient;
    phosphorus: Nutrient;
    potassium: Nutrient;
    pH: Nutrient;
    organicMatter: Nutrient;
  };
  cropHistory: CropHistoryItem[];
  nextCropRecommendation: NextCropRec;
  waterUsage: WaterUsageData;
  yieldPrediction: YieldData;
  insights: string[];
  actionPlan: string[];
}

export const AnalysisDashboardPage: React.FC = () => {
  const { navigateTo, profile } = useFarm() as any;
  const { t } = useLanguage();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || "";
      const response = await fetch(`${API_BASE}/api/analysis/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile || {})
      });

      if (!response.ok) {
        throw new Error("Unable to fetch farm analysis report.");
      }

      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while compiling your report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [profile]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-farm-500 animate-spin" />
        <h2 className="text-xl font-bold text-white tracking-tight">Compiling AI Farm Twin Report...</h2>
        <p className="text-xs text-slate-500">Analyzing soil nutrients, weather logs, water requirements, and crop history.</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="border border-rose-500/20 bg-rose-500/10 p-8 rounded-3xl space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Analysis Temporarily Unavailable</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{error || "Could not resolve AI insights."}</p>
          <Button variant="primary" onClick={fetchReport} className="mt-2">
            Retry Compilation
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "good": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "moderate": return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "poor": return "bg-rose-500/10 border-rose-500/20 text-rose-400";
      default: return "bg-slate-500/10 border-slate-500/20 text-slate-400";
    }
  };

  const score = report.healthScore || 75;
  const strokeDashoffset = 251.2 - (score / 100) * 251.2;

  // Resolve Farm Profile properties dynamically with safe fallbacks
  const landSize = parseFloat(profile?.landSize || 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative text-left space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigateTo("dashboard")}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm cursor-pointer select-none"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>📊</span> AI Farm Analysis Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            End-of-cycle agricultural audit and rotation diagnostics
          </p>
        </div>
        <Button variant="primary" onClick={fetchReport} className="flex items-center gap-1.5 self-start">
          <Activity className="w-4 h-4" />
          <span>Refresh Analysis</span>
        </Button>
      </div>

      {/* Main Grid: Health Score Circular & Soil Fertility & Yield prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Farm Health Circular Gauge Card */}
        <Card className="border border-emerald-500/10 bg-slate-900/10 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Overall Farm Health</h3>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="40"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8" fill="none"
              />
              <circle
                cx="50" cy="50" r="40"
                stroke="url(#healthGrad)"
                strokeWidth="8" fill="none"
                strokeDasharray="251.2"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <span className="text-4xl font-black text-white tracking-tight">{score}%</span>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-widest mt-1">Health Score</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 leading-relaxed px-4">
              Calculated using local weather, irrigation logs, NPK levels, vegetation health, and crop infection index.
            </p>
          </div>
        </Card>

        {/* Soil Fertility Card */}
        <Card className="border border-emerald-500/10 bg-slate-900/10 flex flex-col justify-between p-6">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-emerald-400" />
              Soil Nutrient Profile
            </h3>
            <div className="space-y-3.5">
              {Object.entries(report.soilFertility || {}).map(([key, nutrient]) => (
                <div key={key} className="flex items-center justify-between border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-xs font-bold text-slate-400 capitalize">{key.replace("organicMatter", "Organic Matter")}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-white">{nutrient.value}</span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${getStatusColor(nutrient.status)}`}>
                      {nutrient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Yield Prediction & Risk Audit */}
        <Card className="border border-emerald-500/10 bg-slate-900/10 flex flex-col justify-between p-6">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-farm-400" />
              Yield Prediction & Risk
            </h3>
            <div className="space-y-5 my-auto">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Expected Yield</span>
                  <span className="text-lg font-black text-white">{report.yieldPrediction?.expectedYield}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-farm-500/10 border border-farm-500/20 text-farm-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Confidence</span>
                  <span className="text-sm font-extrabold text-emerald-400">{report.yieldPrediction?.confidence}%</span>
                </div>
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Risk Level</span>
                  <span className={`text-sm font-extrabold ${report.yieldPrediction?.riskLevel?.toLowerCase().includes("low") ? "text-emerald-400" : "text-rose-400"}`}>
                    {report.yieldPrediction?.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center font-medium mt-4">
            *Yield predictions are based on microclimate projection models.
          </div>
        </Card>
      </div>

      {/* Row 2: Crop History & AI Crop Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Previous Crop History Nutrient Depletion */}
        <Card className="border border-emerald-500/10 bg-slate-900/10 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
            <Award className="w-4.5 h-4.5 text-blue-400" />
            Previous Crop Cycle Nutrient Log
          </h3>
          <div className="space-y-4">
            {(report.cropHistory || []).map((history, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <span className="text-xs font-black">S{idx + 1}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{history.season}</span>
                    <span className="text-xs font-extrabold text-white capitalize">{history.crop}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {history.nutrientImpact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Next Crop Recommendation */}
        <Card className="border border-amber-500/10 bg-slate-900/10 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="w-4.5 h-4.5 text-amber-400" />
              AI Rotational Recommendations
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Recommended Crop</span>
                <span className="text-lg font-black text-gradient-green flex items-center gap-1.5">
                  <Sprout className="w-5 h-5 text-farm-400" />
                  {report.nextCropRecommendation?.cropName}
                </span>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">AI Confidence</span>
                <span className="text-lg font-black text-emerald-400">
                  {report.nextCropRecommendation?.confidence}%
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
              {report.nextCropRecommendation?.reason}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-white/5">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Expected Yield</span>
              <span className="text-xs font-bold text-white">{report.nextCropRecommendation?.expectedYield}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Expected Net profit</span>
              <span className="text-xs font-extrabold text-emerald-400">{report.nextCropRecommendation?.expectedProfit}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 3: Water Usage Analysis with SVG chart */}
      <Card className="border border-emerald-500/10 bg-slate-900/10 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Water Usage Analysis</h3>
              <p className="text-xs text-slate-500">Irrigation logs and precision schedule performance</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-extrabold">
            <div className="bg-white/5 px-3.5 py-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-bold">Total Used</span>
              <span className="text-white">{report.waterUsage?.totalWaterUsed}</span>
            </div>
            <div className="bg-white/5 px-3.5 py-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-bold">Water Saved</span>
              <span className="text-emerald-400">{report.waterUsage?.waterSaved}</span>
            </div>
            <div className="bg-white/5 px-3.5 py-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-bold">Efficiency</span>
              <span className="text-emerald-400">{report.waterUsage?.irrigationEfficiency}</span>
            </div>
          </div>
        </div>

        {/* Weekly Water Usage Chart Recharts */}
        <div className="w-full h-56 bg-slate-950/20 rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
            Water Usage (Liters)
          </div>
          <div className="w-full flex-grow relative min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={report.waterUsage?.history || []}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis 
                  dataKey="week" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="700"
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="600"
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  iconSize={10}
                  iconType="rect"
                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', paddingBottom: '15px' }}
                />
                <Bar 
                  name="Active Usage" 
                  dataKey="usage" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={18} 
                />
                <Bar 
                  name="Standard Average" 
                  dataKey="average" 
                  fill="#64748b" 
                  radius={[4, 4, 0, 0]} 
                  barSize={18} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* AI Insights & Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* AI Insights Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-farm-500" />
            AI Soil & crop Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(report.insights || []).map((insight, idx) => (
              <Card key={idx} className="border border-white/5 bg-slate-900/10 p-4 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-emerald-500" />
                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                  {insight}
                </p>
                <span className="text-[9px] text-slate-500 font-bold block mt-3 self-end">Insight resolved ✔</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Plan Tasks */}
        <Card className="border border-emerald-500/10 bg-slate-900/10 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-farm-400" />
            Field Action Plan Recommendations
          </h3>
          <div className="space-y-3">
            {(report.actionPlan || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="w-5.5 h-5.5 rounded-full bg-farm-500/10 border border-farm-500/20 text-farm-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-slate-200 leading-normal">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisDashboardPage;
