import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import cropsData from '../data/crops.json';
import marketData from '../data/marketData.json';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  Sprout, BrainCircuit, CircleDollarSign, Droplets, ShieldAlert, 
  TrendingUp, RefreshCw, Sparkles, AlertCircle, ArrowLeft, ArrowRight
} from 'lucide-react';
import { calculateExpectedProfit } from '../utils/profitCalculator';

export const CropRecommendationPage = () => {
  const { t, language } = useLanguage();
  const { activeFarm, computedMetrics } = useFarm();

  if (!activeFarm || !computedMetrics) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6">
        <BrainCircuit className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white mb-2">{t('noActiveTwin')}</h3>
        <Link to="/create-twin">
          <Button variant="primary">Create Twin</Button>
        </Link>
      </div>
    );
  }

  // Recommendation engine matching algorithm
  const recommendations = cropsData.map((crop) => {
    // 1. Check Soil Suitability
    const isSoilSuitable = crop.soilSuitability.includes(activeFarm.soilType);
    let soilScore = isSoilSuitable ? 40 : 10;

    // 2. Crop Rotation Compatibility
    let rotationScore = 30;
    let rotationAdvice = "";
    
    const curr = activeFarm.currentCrop?.toLowerCase();
    const prev = activeFarm.previousCrop?.toLowerCase();
    const target = crop.id.toLowerCase();

    const isLegume = (c) => ["groundnut", "soybean"].includes(c);
    const isHeavyFeeder = (c) => ["rice", "maize", "cotton"].includes(c);

    if (target === curr) {
      rotationScore = 5;
      rotationAdvice = "Highly discouraged. planting back-to-back causes nutrient depletion and pest buildup.";
    } else if (target === prev) {
      rotationScore = 15;
      rotationAdvice = "Suboptimal. Crop was harvested two seasons ago, high risk of pathogen nesting.";
    } else if (isLegume(curr) && isHeavyFeeder(target)) {
      rotationScore = 40;
      rotationAdvice = "Best choice! Takes full advantage of Nitrogen fixed by your current leguminous crop.";
    } else if (isHeavyFeeder(curr) && isLegume(target)) {
      rotationScore = 38;
      rotationAdvice = "Excellent rotation. Will restore the nitrogen drained by your current crop.";
    } else {
      rotationScore = 30;
      rotationAdvice = "Safe option. Good structural crop family diversity.";
    }

    // 3. Water Source match
    let waterScore = 20;
    if (crop.waterRequirement === "High" && activeFarm.waterAvailability === "Rainfed") {
      waterScore = 5; // rice on rainfed is bad
    } else if (crop.waterRequirement === "Low" && activeFarm.waterAvailability === "Rainfed") {
      waterScore = 20; // groundnut on rainfed is good
    }

    const totalSuitability = soilScore + rotationScore + waterScore;

    // 4. Profitability
    // Estimate profit using active farm's metrics
    const financial = calculateExpectedProfit(
      activeFarm.landSize,
      crop.id,
      computedMetrics.soil.fertilityScore,
      computedMetrics.risk.waterRisk
    );

    // 5. Market Demand
    const marketInfo = marketData.find(m => m.cropId === crop.id);

    return {
      crop,
      suitabilityScore: totalSuitability,
      rotationAdvice,
      financial,
      marketInfo,
      isSoilSuitable
    };
  })
  .sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const getSuitabilityColor = (score) => {
    if (score >= 80) return 'text-farm-400 bg-farm-500/10 border-farm-500/20';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getSuitabilityLabel = (score) => {
    if (score >= 80) return 'Highly Recommended';
    if (score >= 50) return 'Moderately Suitable';
    return 'Not Recommended';
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
            AI Crop Advisor Engine 🌾
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing crop rotation models for soil category: <strong className="text-slate-200">{activeFarm.soilType}</strong>
          </p>
        </div>
      </div>

      {/* Main Advisory Notice */}
      <div className="bg-slate-900/30 border border-white/5 p-5 rounded-2xl flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-farm-500 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-300">
          <span className="text-white font-bold block mb-1">Rotation Recommendation Rules:</span>
          Crop suitability is calculated dynamically by combining soil chemical bounds, water retention capacities, and crop family rotation history. We cross-reference your history of **{cropsData.find(c => c.id === activeFarm.currentCrop)?.name[language] || activeFarm.currentCrop}** and **{cropsData.find(c => c.id === activeFarm.previousCrop)?.name[language] || activeFarm.previousCrop}** to predict target yields.
        </div>
      </div>

      {/* Recommendation Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map(({ crop, suitabilityScore, rotationAdvice, financial, marketInfo, isSoilSuitable }) => {
          const cropName = crop.name[language] || crop.name['en'];
          return (
            <Card 
              key={crop.id}
              hoverGlow={true}
              variant={suitabilityScore >= 80 ? "green" : "standard"}
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-farm-400" />
                    {cropName}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-widest ${getSuitabilityColor(suitabilityScore)}`}>
                    {getSuitabilityLabel(suitabilityScore)} ({suitabilityScore}%)
                  </span>
                </div>
              }
            >
              <div className="space-y-4">
                
                {/* Financial projections */}
                <div className="grid grid-cols-3 gap-3 bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
                  <div>
                    <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider mb-0.5">Est. Profit</span>
                    <span className="text-xs font-black text-amber-400">
                      ₹{new Intl.NumberFormat('en-IN').format(financial.profit)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider mb-0.5">Yield/Acre</span>
                    <span className="text-xs font-bold text-slate-200">{financial.yieldAcre} Qtl</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider mb-0.5">Soil Match</span>
                    <span className={`text-xs font-bold ${isSoilSuitable ? 'text-farm-400' : 'text-rose-400'}`}>
                      {isSoilSuitable ? 'Suitable' : 'Poor'}
                    </span>
                  </div>
                </div>

                {/* Water and disease specs */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" /> Water Need:
                    </span>
                    <span className="text-slate-300 font-bold">{crop.waterRequirement}</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Pest Risk:
                    </span>
                    <span className="text-slate-300 font-bold">{crop.pestRisk}</span>
                  </div>
                </div>

                {/* Market info */}
                {marketInfo && (
                  <div className="flex items-center justify-between bg-slate-950/20 px-3 py-2 rounded-xl text-[11px] font-semibold">
                    <span className="text-slate-400">Market Rate:</span>
                    <span className="text-slate-200 font-bold">₹{marketInfo.currentPrice} / Qtl</span>
                    <span className={`flex items-center gap-0.5 font-bold ${marketInfo.priceTrend === 'up' ? 'text-farm-400' : 'text-rose-400'}`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      {marketInfo.demandStatus} Demand
                    </span>
                  </div>
                )}

                {/* Rotation advice */}
                <div className="p-3.5 bg-farm-950/10 border border-farm-500/10 rounded-xl">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 text-farm-400" />
                    Crop Rotation Advice
                  </span>
                  <p className="text-[10px] text-slate-300 leading-relaxed font-semibold italic">
                    "{rotationAdvice}"
                  </p>
                </div>

                {/* Action button */}
                <div className="flex items-center justify-end border-t border-white/5 pt-3">
                  <Link to="/calendar">
                    <Button variant="secondary" size="sm" icon={ArrowRight}>
                      View Planting Timeline
                    </Button>
                  </Link>
                </div>

              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default CropRecommendationPage;
