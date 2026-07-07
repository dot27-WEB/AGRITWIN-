import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import cropsData from "../data/crops.json";
import { ArrowLeft, Sprout, TrendingUp, HelpCircle, Droplet, ShieldAlert, CheckCircle } from "lucide-react";

export const CropRecommendationPage: React.FC = () => {
  const { profile, navigateTo, soilMetrics } = useFarm();
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<any>(null);

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">No active farm twin found.</p>
        <Button onClick={() => navigateTo("create-twin")}>Create Farm Twin</Button>
      </div>
    );
  }

  // Filter crops based on suitability
  // If soil type is Black Soil, Cotton & Paddy are perfect.
  // If Sandy, Groundnut is perfect.
  // Let's flag them with a "Match Percentage" based on Soil type suitability
  const scoredCrops = cropsData.map((crop) => {
    let suitability = 70; // baseline
    const cropSoil = crop.soilType.toLowerCase();
    const farmSoil = profile.soilType.toLowerCase().split(" / ")[0];

    if (cropSoil.includes(farmSoil) || farmSoil.includes(cropSoil.split(" / ")[0])) {
      suitability += 20;
    }

    // rotation bonus! If this crop breaks the monoculture of currentCrop
    if (crop.id !== profile.currentCrop.toLowerCase()) {
      suitability += 8;
    }

    // nitrogen fixers get a small visual bonus
    if (crop.id === "groundnut") {
      suitability += 2;
    }

    return {
      ...crop,
      suitabilityScore: Math.min(98, suitability)
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back to Dashboard */}
      <button
        onClick={() => navigateTo("dashboard")}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-emerald-950 dark:text-white flex items-center tracking-tight">
            <Sprout className="w-8 h-8 mr-2 text-emerald-600 dark:text-emerald-400" />
            AI Crop Recommendation Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Intelligent suitability mapping comparing your digital twin soil properties against seasonal crop models.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">
            Recommended Crops for Your Field
          </h2>

          <div className="space-y-4">
            {scoredCrops.map((crop) => (
              <Card
                key={crop.id}
                hoverable
                onClick={() => setSelectedCrop(crop)}
                className={`p-5 transition-all relative overflow-hidden ${
                  selectedCrop?.id === crop.id ? "ring-2 ring-emerald-500 border-emerald-300" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-950 dark:text-white">{crop.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/20">
                        {crop.type} Crop
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 italic">{crop.scientificName}</p>
                    <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs font-semibold text-gray-500 mt-2">
                      <span className="flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        Expected Profit: ₹{crop.expectedProfitPerAcre.toLocaleString()}/Acre
                      </span>
                      <span className="flex items-center">
                        <Droplet className="w-3.5 h-3.5 mr-1 text-blue-500" />
                        Water: {crop.waterRequirement}
                      </span>
                    </div>
                  </div>

                  {/* Suitability score badge gauge */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 font-bold uppercase block">Suitability</span>
                      <span className="text-lg font-black text-emerald-600">{crop.suitabilityScore}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected crop deep simulation info */}
        <div>
          <Card className="p-6 bg-gradient-to-b from-emerald-50/[0.05] to-teal-50/[0.05] border-emerald-500/10 h-full sticky top-24">
            {selectedCrop ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                    Sowing advice profile
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                    {selectedCrop.name} Detail
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    {selectedCrop.scientificName}
                  </p>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  {/* Ideal temp */}
                  <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-800">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Ideal Temperature</span>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {selectedCrop.idealTemp}
                    </p>
                  </div>

                  {/* Water Requirements in MM */}
                  <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-800">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Water Load</span>
                    <p className="text-sm font-extrabold text-blue-600 mt-0.5">
                      ~ {selectedCrop.waterRequirementMm} mm
                    </p>
                  </div>

                  {/* Fertilizer recommendation */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Fertilization Standard</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      {selectedCrop.fertilizerGuide}
                    </p>
                  </div>

                  {/* Disease Risk alerts */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold text-rose-500 flex items-center">
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                      Anticipated Pathogen Threats
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedCrop.diseaseRisks.map((d: string) => (
                        <span key={d} className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/20 text-rose-600 text-[10px]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rotation advice */}
                  <div className="space-y-1 border-t border-gray-100 dark:border-slate-800/80 pt-3">
                    <span className="text-[10px] text-gray-400 uppercase font-bold text-emerald-600 flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Soil Rotational Benefit
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      {selectedCrop.rotationAdvice}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 space-y-4">
                <HelpCircle className="w-12 h-12 text-gray-300" />
                <div className="text-xs">
                  <p className="font-bold text-gray-600 dark:text-gray-400">Select a Crop</p>
                  <p className="text-gray-500 mt-0.5 leading-relaxed font-medium">Click on any crop in the left panel to simulate soil metrics, temperature thresholds, and chemical inputs.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
