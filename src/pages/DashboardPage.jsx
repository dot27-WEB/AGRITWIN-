import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import cropsData from '../data/crops.json';
import { FarmHealthCard } from '../components/dashboard/FarmHealthCard';
import { SoilFertilityCard } from '../components/dashboard/SoilFertilityCard';
import { RiskMeter } from '../components/dashboard/RiskMeter';
import { ProfitCard } from '../components/dashboard/ProfitCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  Sprout, HeartPulse, Droplets, TrendingUp, Landmark, CalendarDays, 
  PlusCircle, BrainCircuit, RefreshCw, Layers, MapPin, Sparkles, ChevronRight
} from 'lucide-react';
import '../styles/dashboard.css';

export const DashboardPage = () => {
  const { t, language } = useLanguage();
  const { 
    farms, 
    activeFarm, 
    computedMetrics, 
    setActiveFarmId,
    profile
  } = useFarm();
  const navigate = useNavigate();

  // If no session exists, prompt login
  if (!profile) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6">
        <BrainCircuit className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white mb-2">Verification Session Required</h3>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          Please log in first using mobile verification to access your virtual twin profiles.
        </p>
        <Link to="/login">
          <Button variant="primary">Go to Login</Button>
        </Link>
      </div>
    );
  }

  // If no farm twin exists, prompt creation
  if (!activeFarm || !computedMetrics) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-farm-500 mb-6 shadow-xl">
          <BrainCircuit className="w-8 h-8 animate-pulse-slow" />
        </div>
        <h3 className="text-xl font-extrabold text-white mb-2 tracking-wide">
          {t('noActiveTwin')}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-8 leading-relaxed">
          Create a virtual profile of your field to analyze soil, track risk variables, and forecast profits.
        </p>
        <Link to="/create-twin">
          <Button variant="primary" size="lg" icon={PlusCircle}>
            {t('buttonCreateTwin')}
          </Button>
        </Link>
      </div>
    );
  }

  const currentCrop = cropsData.find(c => c.id === activeFarm.currentCrop);
  const currentCropName = currentCrop ? (currentCrop.name[language] || currentCrop.name['en']) : activeFarm.currentCrop;

  const recommendedCrop = cropsData.find(c => c.id === computedMetrics.rotation.recommendedNextCropId);
  const recommendedCropName = recommendedCrop ? (recommendedCrop.name[language] || recommendedCrop.name['en']) : computedMetrics.rotation.recommendedNextCropId;

  // Feature menu items for navigation
  const featureMenuItems = [
    {
      title: t('navCrops'),
      desc: "Get intelligent crop recommendation lists based on rotation and soil analysis.",
      path: "/crops",
      icon: Sprout,
      color: "text-farm-400",
      bgGlow: "bg-farm-500/5",
      borderGlow: "hover:border-farm-500/30"
    },
    {
      title: t('navDisease'),
      desc: "Upload or click sample crop leaves to diagnose infections and review treatments.",
      path: "/disease",
      icon: HeartPulse,
      color: "text-rose-400",
      bgGlow: "bg-rose-500/5",
      borderGlow: "hover:border-rose-500/30"
    },
    {
      title: t('navIrrigation'),
      desc: "View weather-informed irrigation dates and estimated water counts.",
      path: "/irrigation",
      icon: Droplets,
      color: "text-blue-400",
      bgGlow: "bg-blue-500/5",
      borderGlow: "hover:border-blue-500/30"
    },
    {
      title: t('navMarket'),
      desc: "View crop mandi prices, trends, AI selling guidelines and profits.",
      path: "/market",
      icon: TrendingUp,
      color: "text-amber-400",
      bgGlow: "bg-amber-500/5",
      borderGlow: "hover:border-amber-500/30"
    },
    {
      title: t('navSchemes'),
      desc: "Check grant eligibility for PM-KISAN, solar pumps, and crop insurance.",
      path: "/schemes",
      icon: Landmark,
      color: "text-teal-400",
      bgGlow: "bg-teal-500/5",
      borderGlow: "hover:border-teal-500/30"
    },
    {
      title: t('navCalendar'),
      desc: "Track scheduled crop phase operations from sowing to harvests.",
      path: "/calendar",
      icon: CalendarDays,
      color: "text-emerald-400",
      bgGlow: "bg-emerald-500/5",
      borderGlow: "hover:border-emerald-500/30"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in">
      
      {/* Top Banner Header with Farm Selector switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-farm-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 animate-pulse" />
            Digital Farm Twin Active
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
            {activeFarm.farmerName}'s Farm Twin 🌾
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <MapPin className="w-3.5 h-3.5 text-farm-500" />
            <span>{activeFarm.village} • {activeFarm.landSize} Acres</span>
          </div>
        </div>

        {/* Farm Switcher and Add Button */}
        <div className="flex items-center gap-3">
          {farms.length > 1 && (
            <select
              value={activeFarm.id}
              onChange={(e) => setActiveFarmId(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-farm-500"
            >
              {farms.map((f, i) => (
                <option key={f.id} value={f.id}>
                  Twin #{i + 1} ({f.village})
                </option>
              ))}
            </select>
          )}
          <Link to="/create-twin">
            <Button variant="secondary" size="md" icon={PlusCircle}>
              Add Twin
            </Button>
          </Link>
        </div>
      </div>

      {/* CORE KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Farm Health Score */}
        <FarmHealthCard 
          healthScore={computedMetrics.farmHealthScore}
          currentCropName={currentCropName}
          village={activeFarm.village}
          landSize={activeFarm.landSize}
        />

        {/* Card 2: Soil Fertility Score & NPK */}
        <SoilFertilityCard 
          fertilityScore={computedMetrics.soil.fertilityScore}
          nitrogen={computedMetrics.soil.nitrogen}
          phosphorus={computedMetrics.soil.phosphorus}
          potassium={computedMetrics.soil.potassium}
          ph={computedMetrics.soil.ph}
          soilType={activeFarm.soilType}
        />

        {/* Card 3: Risk Meter */}
        <RiskMeter 
          diseaseRisk={computedMetrics.risk.diseaseRisk}
          waterRisk={computedMetrics.risk.waterRisk}
          marketRisk={computedMetrics.risk.marketRisk}
          profitabilityScore={computedMetrics.risk.profitabilityScore}
          overallRiskLevel={computedMetrics.risk.overallRiskLevel}
        />

        {/* Card 4: Profit Card */}
        <ProfitCard 
          profit={computedMetrics.profit.profit}
          revenue={computedMetrics.profit.revenue}
          cost={computedMetrics.profit.cost}
          yieldAcre={computedMetrics.profit.yieldAcre}
          cropName={currentCropName}
        />

      </div>

      {/* AI ROTATION ADVISORY BANNER */}
      <div className="bg-gradient-to-r from-farm-950/40 via-emerald-950/20 to-slate-950 border border-farm-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Decorative backdrop light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-farm-500/5 rounded-full filter blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-farm-500/10 border border-farm-500/20 flex items-center justify-center text-farm-400 shrink-0">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI Rotational Insights
            </h4>
            <p className="text-xs text-slate-300 font-semibold mb-1">
              {computedMetrics.rotation.advice[language] || computedMetrics.rotation.advice['en']}
            </p>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Based on two previous crop seasons (**{cropsData.find(c => c.id === activeFarm.previousCrop)?.name[language] || activeFarm.previousCrop}** and **{cropsData.find(c => c.id === activeFarm.prev2Crop)?.name[language] || activeFarm.prev2Crop}**), the model evaluates soil depletion risks and suggests balanced rotations.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 text-center shrink-0 w-full md:w-56">
          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">{t('recommendedCrop')}</span>
          <span className="text-lg font-black text-amber-400 block tracking-wide">{recommendedCropName}</span>
          <Link to="/crops">
            <span className="text-[10px] text-farm-400 font-bold flex items-center justify-center gap-0.5 hover:underline cursor-pointer mt-2">
              View recommendations <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* CORE MODULES MENU GRID */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Layers className="w-4 h-4 text-farm-500" />
          Twin Management Services
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureMenuItems.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <Link key={idx} to={item.path} className="block">
                <Card 
                  hoverGlow={true}
                  className={`group h-full flex flex-col justify-between ${item.borderGlow}`}
                >
                  <div>
                    {/* Glowing background bubble */}
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${item.color} ${item.bgGlow}`} />

                    <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                      <div className={`p-2.5 rounded-xl bg-slate-950 border border-white/5 group-hover:scale-105 transition-transform duration-300 ${item.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-farm-400 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium mt-1">
                      {item.desc}
                    </p>
                  </div>
                  
                  <span className="text-[10px] text-farm-400 font-bold flex items-center gap-0.5 hover:underline cursor-pointer mt-4 self-end group-hover:translate-x-1 transition-transform">
                    Access page <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
