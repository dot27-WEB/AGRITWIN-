import React from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { FarmHealthCard } from "../components/dashboard/FarmHealthCard";
import { SoilFertilityCard } from "../components/dashboard/SoilFertilityCard";
import { RiskMeter } from "../components/dashboard/RiskMeter";
import { ProfitCard } from "../components/dashboard/ProfitCard";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import {
  MapPin,
  Calendar,
  Layers,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Droplet,
  Award,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Settings
} from "lucide-react";
import { motion } from "motion/react";

export const DashboardPage: React.FC = () => {
  const {
    profile,
    soilMetrics,
    riskMetrics,
    profitMetrics,
    rotationMetrics,
    isCalculating,
    navigateTo
  } = useFarm();
  const { t } = useLanguage();

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">No active farm twin found.</p>
        <Button onClick={() => navigateTo("create-twin")}>Create Farm Twin</Button>
      </div>
    );
  }

  // Quick navigation cards list for launcher
  const quickLaunchers = [
    { page: "crop-recommendation", label: t("recommendation"), desc: "Rotate to maximize soil N", icon: Sprout, color: "text-emerald-500 bg-emerald-500/10" },
    { page: "disease-detection", label: t("disease"), desc: "Scans plant pathogens in real-time", icon: Award, color: "text-orange-500 bg-orange-500/10" },
    { page: "irrigation", label: t("irrigation"), desc: "Weather-based water savings", icon: Droplet, color: "text-blue-500 bg-blue-500/10" },
    { page: "market", label: t("market"), desc: "Price indexes & eNAM rates", icon: TrendingUp, color: "text-teal-500 bg-teal-500/10" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome header row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#0a110f] p-6 rounded-3xl border border-emerald-100/80 dark:border-emerald-950/40 shadow-[--shadow-minimal]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950 dark:text-white font-display tracking-tight">
              Namaste, {profile.farmerName} 👋
            </h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            >
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            </motion.div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
              {profile.village}
            </span>
            <span className="flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
              {profile.landSize} Acres
            </span>
            <span className="flex items-center">
              🌾 {profile.soilType}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo("create-twin")}
            className="flex items-center space-x-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Manage Twin Config</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigateTo("create-twin")}
            className="flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isCalculating ? "animate-spin" : ""}`} />
            <span>Recalculate Twin</span>
          </Button>
        </div>
      </div>

      {/* Main Digital Twin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FarmHealthCard score={soilMetrics?.healthScore || 70} isCalculating={isCalculating} />
        <SoilFertilityCard
          score={soilMetrics?.fertilityScore || 65}
          nitrogen={soilMetrics?.nitrogen || { value: 45, status: "Medium", recommend: "" }}
          phosphorus={soilMetrics?.phosphorus || { value: 45, status: "Medium", recommend: "" }}
          potassium={soilMetrics?.potassium || { value: 60, status: "High", recommend: "" }}
          moisture={soilMetrics?.moistureRetention || "Medium"}
          carbon={soilMetrics?.organicCarbon || 0.45}
          isCalculating={isCalculating}
        />
        <RiskMeter
          score={riskMetrics?.overallRiskScore || 45}
          overall={riskMetrics?.overallRisk || "Moderate"}
          disease={riskMetrics?.diseaseRisk || 30}
          water={riskMetrics?.waterRisk || 50}
          market={riskMetrics?.marketRisk || 40}
          pest={riskMetrics?.pestRisk || 30}
          isCalculating={isCalculating}
        />
        <ProfitCard
          gross={profitMetrics?.grossRevenue || 180000}
          cost={profitMetrics?.costOfCultivation || 60000}
          net={profitMetrics?.expectedNetProfit || 120000}
          yieldPerAcre={profitMetrics?.yieldPerAcreQty || 20}
          yieldUnit={profitMetrics?.yieldUnit || "Quintals"}
          pricePerUnit={profitMetrics?.pricePerUnit || 2350}
          soilBonus={profitMetrics?.soilBonusPercentage || 5}
          riskDeduction={profitMetrics?.riskDeductionPercentage || 10}
          isCalculating={isCalculating}
        />
      </div>

      {/* Launcher row of service features */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Smart Digital Twin Diagnostic Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickLaunchers.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                hoverable
                onClick={() => navigateTo(item.page)}
                className="flex items-center justify-between p-5 relative overflow-hidden"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.label}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-700" />
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Dynamic Soil Recommendations / Insights */}
      {soilMetrics && riskMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Actionable Insights */}
          <div className="lg:col-span-8">
            <Card className="p-6 sm:p-8 space-y-6 h-full border-dashed border-emerald-500/20 bg-emerald-500/[0.01]">
              <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-slate-800/80 pb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Active Virtual Twin recommendations
                </h3>
              </div>

              <div className="space-y-4">
                {/* Soil N recommendation */}
                <div className="flex items-start space-x-3.5">
                  <span className="text-lg shrink-0">🌱</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wide">
                      Nitrogen Node Advice
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed font-medium">
                      {soilMetrics.nitrogen.recommend}
                    </p>
                  </div>
                </div>

                {/* Risk mitigation recommendations */}
                <div className="flex items-start space-x-3.5">
                  <span className="text-lg shrink-0">⚠️</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wide">
                      Pest & Rotations Advice
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed font-medium">
                      {riskMetrics.reasons[0]}
                    </p>
                  </div>
                </div>

                {/* Irrigation recommendations */}
                <div className="flex items-start space-x-3.5">
                  <span className="text-lg shrink-0">💧</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wide">
                      Irrigation Efficiency
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed font-medium">
                      {profile.irrigationMethod.includes("Flood")
                        ? "Transitioning from flood to sprinkler irrigation will lower water risk by 20% and save approximately 4,000 liters of diesel pump fuel."
                        : "Your active micro-irrigation layout is highly sustainable. Maintain drip lines twice a month to clear salt precipitation."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Govt Assistant launcher */}
          <div className="lg:col-span-4">
            <Card className="p-6 bg-gradient-to-br from-indigo-900/5 to-purple-900/5 border-indigo-500/10 dark:border-indigo-500/5 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-100/10">
                  Govt Schemes Matches
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-2">
                  Drip Irrigation Subsidy
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Because you are categorized as a small farm holder in AP, you are highly eligible for a **55% financial subsidy** on modern drip irrigation hardware.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo("schemes")}
                className="w-full text-xs font-bold mt-6 flex items-center justify-center space-x-1.5"
              >
                <span>Check Subsidies eligibility</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
