import React from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { ArrowLeft, Droplet, Sun, CloudRain, Wind, AlertCircle, Calendar, Sparkles } from "lucide-react";

export const IrrigationPage: React.FC = () => {
  const { profile, navigateTo, soilMetrics } = useFarm();
  const { t } = useLanguage();

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">No active farm twin found.</p>
        <Button onClick={() => navigateTo("create-twin")}>Create Farm Twin</Button>
      </div>
    );
  }

  // Calculate watering cycle based on crop & irrigation method
  const getIrrigationSchedule = () => {
    const c = profile.currentCrop.toLowerCase();
    const im = profile.irrigationMethod.toLowerCase();
    
    let nextDate = "July 08, 2026";
    let waterQty = "22,000 Liters / Acre";
    let reasoning = "Average temperature is 32°C. Relative humidity is moderate (65%). Clayey soil retains water longer.";
    let tips = [
      "Implement Alternate Wetting and Drying (AWD) to reduce standing water methane emissions and save up to 30% on fuel bills.",
      "Check drip nozzles for mineral salt clogging twice weekly.",
      "Utilize organic straw mulch around crop rows to reduce direct solar evaporation."
    ];

    if (c.includes("cotton")) {
      nextDate = "July 12, 2026";
      waterQty = "15,000 Liters / Acre";
      reasoning = "Deep taproots of Cotton plants extract deeper soil moisture nodes efficiently. Sandy-loam soil retains less, requiring a lighter frequent watering pattern.";
    } else if (c.includes("chilli")) {
      nextDate = "July 09, 2026";
      waterQty = "12,000 Liters / Acre";
      reasoning = "Chilli roots are prone to root rot if water logged. Keep soil moist, never fully flooded. Transition to drip immediately.";
    } else if (c.includes("groundnut")) {
      nextDate = "July 14, 2026";
      waterQty = "8,500 Liters / Acre";
      reasoning = "Groundnuts are highly drought-tolerant. Only light watering is needed during the active pegging stage.";
    }

    // Weather adjustments
    let rainAlert = "Expected light rain (4.2 mm) on July 07. Schedulers have auto-adjusted to delay irrigation by 24 hours.";

    return { nextDate, waterQty, reasoning, tips, rainAlert };
  };

  const schedule = getIrrigationSchedule();

  // Mock weather forecast
  const weatherForecast = [
    { day: "Sun", temp: "34°C", icon: Sun, condition: "Sunny" },
    { day: "Mon", temp: "32°C", icon: CloudRain, condition: "Light Rain" },
    { day: "Tue", temp: "31°C", icon: CloudRain, condition: "Showers" },
    { day: "Wed", temp: "33°C", icon: Sun, condition: "Partly Cloudy" },
    { day: "Thu", temp: "34°C", icon: Sun, condition: "Sunny" },
    { day: "Fri", temp: "35°C", icon: Sun, condition: "Humid" }
  ];

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

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
          <Droplet className="w-8 h-8 mr-2 text-blue-500" />
          Smart Irrigation Assistant
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Advanced localized hydrologic simulations. Calculates soil capillary moisture against 7-day radar forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Irrigation Metrics */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Next Date Card */}
            <Card className="p-6 border-l-4 border-l-blue-500 flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">
                  Next Scheduled Irrigation
                </span>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {schedule.nextDate}
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Auto-aligned with local rain
                </p>
              </div>
            </Card>

            {/* Qty Card */}
            <Card className="p-6 border-l-4 border-l-teal-500 flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                <Droplet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">
                  Est. Water Requirement
                </span>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {schedule.waterQty}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mt-1">
                  Based on {profile.landSize} total field acres
                </p>
              </div>
            </Card>
          </div>

          {/* Weather reasoning card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              AI Weather Reasoning & CAP Calculations
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {schedule.reasoning}
            </p>

            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/25 rounded-2xl flex items-start space-x-3 text-xs text-blue-800 dark:text-blue-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
              <p className="font-semibold leading-relaxed">
                {schedule.rainAlert}
              </p>
            </div>
          </Card>

          {/* Water Conservation tips */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Water Conservation Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {schedule.tips.map((tip, idx) => (
                <Card key={idx} className="p-4 flex flex-col justify-between">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {tip}
                  </p>
                  <span className="text-[9px] font-extrabold uppercase text-emerald-600 mt-4 block">
                    GUIDELINE #{idx + 1}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Local Microclimate forecasts */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Field Microclimate Radar
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {weatherForecast.map((w, index) => {
                const WeatherIcon = w.icon;
                return (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">{w.day}</span>
                    <WeatherIcon className="w-5 h-5 my-2.5 text-blue-500" />
                    <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">{w.temp}</span>
                    <span className="text-[8px] text-gray-400 font-semibold truncate w-full mt-0.5">{w.condition}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800/80 pt-4 space-y-3 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-400">Relative Humidity:</span>
                <span className="text-slate-800 dark:text-slate-300">64%</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-400">Wind Velocity:</span>
                <span className="text-slate-800 dark:text-slate-300">14.5 km/h</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-400">Solar Evaporation Rate:</span>
                <span className="text-slate-800 dark:text-slate-300">5.2 mm / day</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
