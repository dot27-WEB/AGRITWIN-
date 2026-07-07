import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import marketData from "../data/marketData.json";
import { ArrowLeft, TrendingUp, TrendingDown, Landmark, MapPin, Sparkles, HelpCircle, AlertCircle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const MarketPage: React.FC = () => {
  const { profile, navigateTo } = useFarm();
  const { t } = useLanguage();
  const [selectedCropMarket, setSelectedCropMarket] = useState<any>(marketData.cropMarkets[0]);

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">No active farm twin found.</p>
        <Button onClick={() => navigateTo("create-twin")}>Create Farm Twin</Button>
      </div>
    );
  }

  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case "SELL":
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/20";
      case "HOLD":
        return "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/20";
      default:
        return "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/20";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation breadcrumb */}
      <button
        onClick={() => navigateTo("dashboard")}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="w-8 h-8 mr-2 text-emerald-500" />
            AI Market Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time mandi indices compiled via AGMARKNET and eNAM portals. Simulated AI sell/hold recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mandi Crops listing */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">
            Live Mandi Price Indexes
          </h2>

          <div className="space-y-3.5">
            {marketData.cropMarkets.map((cm) => {
              const isSelected = selectedCropMarket.cropId === cm.cropId;
              return (
                <Card
                  key={cm.cropId}
                  hoverable
                  onClick={() => setSelectedCropMarket(cm)}
                  className={`p-4 transition-all relative overflow-hidden ${
                    isSelected ? "ring-2 ring-emerald-500 border-emerald-300" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {cm.cropName}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        Price per {cm.priceUnit}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                        ₹{cm.currentPrice.toLocaleString()}
                      </span>
                      <span
                        className={`text-[10px] font-bold flex items-center justify-end mt-0.5 ${
                          cm.changePercentage >= 0 ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {cm.changePercentage >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-0.5" />
                        )}
                        {cm.changePercentage >= 0 ? `+${cm.changePercentage}%` : `${cm.changePercentage}%`}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Crop details, Recharts chart & nearby mandis */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider block">
                  Crop Intelligence Analysis
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {selectedCropMarket.cropName} Trends
                </h3>
              </div>

              {/* Recommendation badge */}
              <div className={`px-3 py-1.5 rounded-2xl border text-center font-bold ${getRecommendationStyle(selectedCropMarket.aiRecommendation)}`}>
                <span className="text-[9px] text-gray-400 block uppercase leading-none">AI Advisory</span>
                <span className="text-xs font-extrabold uppercase mt-1 block">
                  {selectedCropMarket.aiRecommendation.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Recharts chart representation */}
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide block">
                6-Month Price Index History (₹ per Quintal)
              </span>
              <div className="h-44 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={selectedCropMarket.historicalData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.08)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "12px", fontSize: "11px", color: "#fff" }} />
                    <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Recommendation details */}
            <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/15 rounded-2xl space-y-1">
              <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                AI Recommendation reasoning
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {selectedCropMarket.aiRecommendationReason}
              </p>
            </div>

            {/* Mandi comparison rates */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide block">
                Nearby physical Mandi rates comparison
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selectedCropMarket.mandiPrices.map((m: any, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
                    <span className="text-[10px] text-gray-400 font-bold block">{m.mandi}</span>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                      ₹{m.price.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-gray-400 font-semibold mt-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-0.5 text-emerald-500" />
                      {m.distanceKm} km away
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
