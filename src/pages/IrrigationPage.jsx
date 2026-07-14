import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import cropsData from '../data/crops.json';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  Droplets, CalendarDays, CloudSun, Sparkles, ShieldAlert, 
  ArrowLeft, CheckSquare, BrainCircuit, RefreshCw 
} from 'lucide-react';

export const IrrigationPage = () => {
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

  const crop = cropsData.find(c => c.id === activeFarm.currentCrop);
  const cropName = crop ? (crop.name[language] || crop.name['en']) : activeFarm.currentCrop;

  // 1. Calculate Irrigation Frequency based on crop and soil
  let baseFreq = crop?.irrigationFrequencyDays || 8;
  
  if (activeFarm.soilType === "Sandy") {
    baseFreq -= 2; // sandy soils drain fast
  } else if (activeFarm.soilType === "Clayey") {
    baseFreq += 3; // clayey soils hold moisture
  }

  // Ensure minimum frequency bounds
  baseFreq = Math.max(baseFreq, 2);

  // 2. Next Irrigation Date
  const currentDate = new Date();
  const nextDate = new Date();
  nextDate.setDate(currentDate.getDate() + baseFreq);

  const formattedNextDate = nextDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 3. Water volume requirement calculation
  let baseLitersPerAcre = 12000; // default standard
  if (crop?.waterRequirement === "High") {
    baseLitersPerAcre = 24000;
  } else if (crop?.waterRequirement === "Low") {
    baseLitersPerAcre = 6000;
  }

  // Drip irrigation saves 40% water
  if (activeFarm.irrigationMethod === "Drip") {
    baseLitersPerAcre = baseLitersPerAcre * 0.6;
  } else if (activeFarm.irrigationMethod === "Sprinkler") {
    baseLitersPerAcre = baseLitersPerAcre * 0.85;
  } else if (activeFarm.irrigationMethod === "Flood") {
    baseLitersPerAcre = baseLitersPerAcre * 1.2; // waste factor
  }

  const land = parseFloat(activeFarm.landSize) || 1;
  const totalWaterRequirement = Math.round(baseLitersPerAcre * land);

  // Weather variables (Simulated based on early July monsoon seasons in India)
  const temperature = "32°C";
  const humidity = "68%";
  const forecast = "Partly Cloudy - 20% Precipitation expected";

  // Dynamic Weather Reasoning
  let weatherReasoning = "";
  if (crop?.waterRequirement === "High") {
    weatherReasoning = `Paddy requires high root saturation. With current temperatures at ${temperature} and high humidity, soil is transpirating moderately. Due to Clayey/Black soils holding moisture, you can schedule irrigation every ${baseFreq} days.`;
  } else {
    weatherReasoning = `${cropName} is drought-resilient. Current weather shows ${temperature} with ${forecast}. Given your ${activeFarm.soilType} soil drainage profile and ${activeFarm.irrigationMethod} system, watering is scheduled every ${baseFreq} days to maintain optimal moisture.`;
  }

  const conservationTips = [
    {
      title: "Mulching Soils",
      desc: "Apply organic mulch (straw/husks) to reduce surface soil evaporation by up to 35%."
    },
    {
      title: "Early Morning Watering",
      desc: "Water crops before 8:00 AM. High winds and afternoon heat cause up to 25% water loss due to evaporation."
    },
    {
      title: "Sensor Integrations (Future Scope)",
      desc: "Integrate soil moisture sensors to automatically pause irrigation during wet humidity phases."
    },
    {
      title: "System Maintenance",
      desc: "Routinely flush drip pipes and inspect sprinkler nozzles for blockages, ensuring uniform water delivery."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          Smart Irrigation Assistant 💧
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Predict irrigation thresholds and water requirements using crop factors and soil coefficients.
        </p>
      </div>

      {/* Scheduler Dashboard Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Watering Date Card */}
        <Card 
          title="Scheduled Irrigation"
          hoverGlow={true}
          variant="green"
        >
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 animate-bounce">
              <CalendarDays className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Target Date</span>
            <span className="text-sm font-extrabold text-white leading-tight px-4 mb-2">
              {formattedNextDate}
            </span>
            <span className="text-[10px] font-bold text-farm-400 uppercase tracking-widest bg-farm-500/10 border border-farm-500/20 px-2.5 py-0.5 rounded-lg">
              In {baseFreq} Days
            </span>
          </div>
        </Card>

        {/* Water Requirement Card */}
        <Card 
          title="Water Volume Calculations"
          hoverGlow={true}
          variant="green"
        >
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Estimated Demand</span>
            <span className="text-2xl font-black text-cyan-400 tracking-tight block">
              {new Intl.NumberFormat('en-IN').format(totalWaterRequirement)} Liters
            </span>
            <span className="text-[9px] text-slate-400 font-medium mt-2">
              Scaled for {land} Acres using **{activeFarm.irrigationMethod}**
            </span>
          </div>
        </Card>

        {/* Weather Forecast Card */}
        <Card 
          title="Local Ambient Forecast"
          hoverGlow={true}
          variant="standard"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-slate-950/40 border border-white/5 rounded-xl p-3">
              <CloudSun className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Current Weather</span>
                <span className="text-xs font-bold text-white">{temperature} • {humidity} Humidity</span>
              </div>
            </div>
            <div className="bg-slate-950/20 rounded-xl p-3 border border-white/5 text-[10px] font-semibold text-slate-300">
              <span className="text-amber-400 block font-bold uppercase mb-0.5">Forecast</span>
              {forecast}
            </div>
          </div>
        </Card>

      </div>

      {/* WEATHER REASONING */}
      <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <CloudSun className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase mb-1">
              AI Scheduling Diagnostics
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              {weatherReasoning}
            </p>
          </div>
        </div>
      </div>

      {/* CONSERVATION TIPS */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Water Conservation Advisory
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conservationTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
              <CheckSquare className="w-5 h-5 text-farm-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-white tracking-wide">{tip.title}</h5>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium mt-1">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default IrrigationPage;
