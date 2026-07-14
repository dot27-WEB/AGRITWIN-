import React, { useState, useEffect } from "react";
import { useFarm, FarmProfile } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { 
  ArrowLeft, Droplet, Sun, CloudRain, Wind, AlertCircle, Calendar, Sparkles,
  Cloud, CloudLightning, CloudDrizzle, CloudFog, Snowflake, AlertTriangle,
  Thermometer, Sunrise, Sunset, Eye, Compass, Navigation
} from "lucide-react";

interface WeatherCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  visibility: number;
  time: string;
}

interface WeatherHourly {
  temperature_2m: number[];
  relative_humidity_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

interface WeatherDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_probability_max: number[];
}

interface WeatherData {
  current: WeatherCurrent;
  hourly: WeatherHourly;
  daily: WeatherDaily;
}

const getWeatherInfo = (code: number) => {
  switch (code) {
    case 0:
      return { text: "Sunny", icon: Sun, color: "text-amber-400" };
    case 1:
    case 2:
      return { text: "Partly Cloudy", icon: CloudSun, color: "text-slate-300" };
    case 3:
      return { text: "Overcast", icon: Cloud, color: "text-slate-400" };
    case 45:
    case 48:
      return { text: "Foggy", icon: CloudFog, color: "text-slate-400" };
    case 51:
    case 53:
    case 55:
      return { text: "Drizzle", icon: CloudDrizzle, color: "text-blue-300" };
    case 61:
    case 63:
    case 65:
      return { text: "Rainy", icon: CloudRain, color: "text-blue-500" };
    case 71:
    case 73:
    case 75:
      return { text: "Snowy", icon: Snowflake, color: "text-sky-300" };
    case 80:
    case 81:
    case 82:
      return { text: "Rain Showers", icon: CloudRain, color: "text-blue-400" };
    case 95:
    case 96:
    case 99:
      return { text: "Thunderstorm", icon: CloudLightning, color: "text-purple-400" };
    default:
      return { text: "Partly Cloudy", icon: Cloud, color: "text-slate-300" };
  }
};

const formatTime = (isoString: string) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "N/A";
  }
};

export const IrrigationPage: React.FC = () => {
  const { profile, navigateTo } = useFarm();
  const { t } = useLanguage();

  // Tab state
  const queryParams = new URLSearchParams(window.location.search);
  const initialTab = queryParams.get("tab") === "weather" ? "weather" : "irrigation";
  const [activeTab, setActiveTab] = useState<"weather" | "irrigation">(initialTab as "weather" | "irrigation");

  // Weather states
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadWeather = async () => {
      if (!profile) return;
      setWeatherLoading(true);
      setWeatherError(null);
      
      try {
        let lat = profile.latitude;
        let lon = profile.longitude;
        
        if (!lat || !lon) {
          const searchName = `${profile.village || ""} ${profile.district || ""} ${profile.state || ""}`.trim();
          if (searchName) {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchName)}&format=json&limit=1`,
              { headers: { "Accept-Language": "en" } }
            );
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              if (geoData && geoData.length > 0) {
                lat = parseFloat(geoData[0].lat);
                lon = parseFloat(geoData[0].lon);
              }
            }
          }
        }
        
        if (!lat || !lon) {
          lat = 16.3067;
          lon = 80.4365;
        }

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,pressure_msl,surface_pressure,wind_speed_10m,visibility&hourly=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`,
          { headers: { "Accept-Language": "en" } }
        );
        
        if (!weatherRes.ok) throw new Error("Failed to load weather forecast parameters.");
        
        const data = await weatherRes.json();
        if (active) {
          setWeatherData(data);
        }
      } catch (err: any) {
        console.error(err);
        if (active) {
          setWeatherError(err.message || "Failed to retrieve local weather data.");
        }
      } finally {
        if (active) {
          setWeatherLoading(false);
        }
      }
    };

    loadWeather();
    return () => {
      active = false;
    };
  }, [profile]);

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">No active farm twin found.</p>
        <Button onClick={() => navigateTo("create-twin")}>Create Farm Twin</Button>
      </div>
    );
  }

  // Original Irrigation Logic
  const getIrrigationSchedule = () => {
    const c = profile.currentCrop.toLowerCase();
    
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

    let rainAlert = "Expected light rain (4.2 mm) on July 07. Schedulers have auto-adjusted to delay irrigation by 24 hours.";
    return { nextDate, waterQty, reasoning, tips, rainAlert };
  };

  const schedule = getIrrigationSchedule();

  // Dynamic Weather Logic
  const alerts = weatherData ? (() => {
    const list = [];
    const temp = weatherData.current.temperature_2m;
    const wind = weatherData.current.wind_speed_10m;
    const code = weatherData.current.weather_code;
    const rainChance = weatherData.daily.precipitation_probability_max?.[0] || 0;
    
    if (temp >= 38) {
      list.push({
        type: "danger",
        title: "Heatwave Alert",
        message: "Extreme temperature detected. Crops are susceptible to heat stress and rapid moisture depletion. Irrigate generously."
      });
    }
    if (wind >= 25) {
      list.push({
        type: "warning",
        title: "Strong Wind Warning",
        message: `High wind velocities of ${wind} km/h detected. Secure tall plants, polytunnels, and avoid pesticide spraying.`
      });
    }
    if ([95, 96, 99].includes(code)) {
      list.push({
        type: "danger",
        title: "Thunderstorm Alert",
        message: "Severe thunderstorms and lightning expected. Field activities should be paused immediately. Take shelter."
      });
    } else if (rainChance > 75 && weatherData.current.precipitation > 2) {
      list.push({
        type: "warning",
        title: "Heavy Rain Expected",
        message: `High likelihood (${rainChance}%) of continuous heavy rain. Avoid waterlogging by clearing field drain channels.`
      });
    }
    return list;
  })() : [];

  const aiRec = weatherData ? (() => {
    const rainChance = weatherData.daily.precipitation_probability_max?.[0] || 0;
    const code = weatherData.current.weather_code;
    if (rainChance > 40 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
      return {
        icon: "🌧",
        title: "Rain expected today.",
        bullets: [
          "Delay irrigation cycles to prevent waterlogging and conserve water resource budgets.",
          "Avoid applying fertilizers or pesticide sprays today, as rain will wash away active chemicals.",
          "Soil moisture is expected to increase naturally. Observe drainage paths to avoid crop root suffocation."
        ]
      };
    } else {
      return {
        icon: "☀",
        title: "Sunny and clear weather today.",
        bullets: [
          "Recommended irrigation between 6:00 AM and 8:00 AM to reduce evaporative losses.",
          "Atmospheric conditions are safe and highly optimal for fertilizer and weeding application.",
          "Soil moisture depletion is high. Ensure active root zones remain adequately moist."
        ]
      };
    }
  })() : null;

  const aiInsights = weatherData ? (() => {
    const rainChance = weatherData.daily.precipitation_probability_max?.[0] || 0;
    const humidity = weatherData.current.relative_humidity_2m;
    const temp = weatherData.current.temperature_2m;

    return [
      { label: "Best irrigation time", value: rainChance > 50 ? "Suspended (Rain expected)" : "6:00 AM - 8:00 AM", icon: Sun, color: "text-amber-400" },
      { label: "Evaporation Rate", value: temp > 32 ? "High evaporation expected" : "Normal / Stable", icon: Wind, color: temp > 32 ? "text-orange-400" : "text-slate-400" },
      { label: "Fertilizer Suitability", value: rainChance < 30 ? "Highly Suitable Day" : "Avoid Application (Rain risk)", icon: Sparkles, color: rainChance < 30 ? "text-emerald-400" : "text-rose-400" },
      { label: "Fungal Disease Risk", value: (humidity > 80 && temp > 25) ? "High Risk (Warm & Humid)" : "Low Risk", icon: AlertCircle, color: (humidity > 80 && temp > 25) ? "text-rose-400" : "text-emerald-400" },
      { label: "Harvesting Conditions", value: rainChance < 20 ? "Optimal / Dry" : "Suboptimal (Wet fields)", icon: Sun, color: rainChance < 20 ? "text-amber-400" : "text-slate-400" }
    ];
  })() : [];

  const timeline = weatherData ? (() => {
    const times = [6, 9, 12, 15, 18, 21];
    return times.map(tIndex => {
      const temp = Math.round(weatherData.hourly.temperature_2m[tIndex]);
      const code = weatherData.hourly.weather_code[tIndex];
      const { text, icon: Icon, color } = getWeatherInfo(code);
      return {
        label: tIndex >= 12 ? `${tIndex === 12 ? 12 : tIndex - 12} PM` : `${tIndex} AM`,
        temp: `${temp}°C`,
        text,
        Icon,
        color
      };
    });
  })() : [];

  const fiveDayForecast = weatherData ? (() => {
    const forecast = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 1; i <= 5; i++) {
      const dateString = weatherData.daily.time[i];
      const date = new Date(dateString);
      const dayName = days[date.getDay()];
      const minTemp = Math.round(weatherData.daily.temperature_2m_min[i]);
      const maxTemp = Math.round(weatherData.daily.temperature_2m_max[i]);
      const code = weatherData.daily.weather_code[i];
      const rainProb = weatherData.daily.precipitation_probability_max[i] || 0;
      const { icon: Icon, color } = getWeatherInfo(code);
      forecast.push({
        day: dayName,
        minTemp: `${minTemp}°C`,
        maxTemp: `${maxTemp}°C`,
        rainProb: `${rainProb}%`,
        Icon,
        color
      });
    }
    return forecast;
  })() : [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in text-left">
      
      {/* Header */}
      <div>
        <button
          onClick={() => navigateTo("dashboard")}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          Field Operations Hub 🌾
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor microclimates and schedule optimal field treatments based on real-time soil factors and meteorology.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-white/5 pb-px gap-2">
        <button
          onClick={() => setActiveTab("weather")}
          className={`px-5 py-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all cursor-pointer flex items-center gap-2
            ${activeTab === "weather"
              ? "border-farm-500 text-farm-400 bg-farm-500/5"
              : "border-transparent text-slate-400 hover:text-white"
            }`}
        >
          <Sun className="w-4.5 h-4.5" />
          <span>Weather Intelligence</span>
        </button>
        <button
          onClick={() => setActiveTab("irrigation")}
          className={`px-5 py-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all cursor-pointer flex items-center gap-2
            ${activeTab === "irrigation"
              ? "border-farm-500 text-farm-400 bg-farm-500/5"
              : "border-transparent text-slate-400 hover:text-white"
            }`}
        >
          <Droplet className="w-4.5 h-4.5" />
          <span>Irrigation Assistant</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "weather" ? (
        // WEATHER INTELLIGENCE MODULE
        <div className="space-y-6">
          {/* Alerts Banner */}
          {alerts.length > 0 && (
            <div className="space-y-2.5">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border flex items-start gap-3 text-xs font-semibold
                  ${alert.type === "danger"
                    ? "bg-rose-950/20 border-rose-500/20 text-rose-300"
                    : "bg-amber-950/20 border-amber-500/20 text-amber-300"
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${alert.type === "danger" ? "text-rose-400" : "text-amber-400"}`} />
                  <div>
                    <h5 className="font-bold text-sm tracking-wide mb-0.5">{alert.title}</h5>
                    <p className="leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {weatherLoading ? (
            // Loading Skeletons
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 rounded-3xl p-6 h-64"></div>
                <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 rounded-3xl p-6 h-64"></div>
              </div>
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 h-48"></div>
            </div>
          ) : weatherError ? (
            // Error State
            <div className="bg-rose-950/25 border border-rose-500/20 p-6 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
              <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
              <h4 className="text-white font-bold text-lg">Unable to load weather forecast</h4>
              <p className="text-slate-400 text-xs">{weatherError}</p>
              <Button onClick={() => window.location.reload()} variant="primary">Retry Connection</Button>
            </div>
          ) : (
            // Weather Dashboard Grid
            <div className="space-y-6">
              
              {/* Top Section Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* AI Weather Recommendation Card */}
                <div className="lg:col-span-8">
                  {aiRec && (
                    <Card className="bg-gradient-to-br from-emerald-950/40 to-teal-950/20 border-emerald-500/10 p-6 sm:p-8 space-y-4 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{aiRec.icon}</span>
                        <div>
                          <span className="text-[10px] text-emerald-400/80 font-bold block uppercase tracking-wider">AI Farm Advisor</span>
                          <h4 className="text-lg font-bold text-white tracking-wide">{aiRec.title}</h4>
                        </div>
                      </div>
                      <div className="border-t border-emerald-500/10 pt-4 space-y-3">
                        {aiRec.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-emerald-200/90 font-medium">
                            <span className="text-emerald-400 mt-0.5">✦</span>
                            <p className="leading-relaxed">{bullet}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                {/* Weather Summary Card */}
                <div className="lg:col-span-4">
                  <Card className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between border-b border-white/5 pb-3">
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Current Forecast</span>
                          <h4 className="text-2xl font-black text-white mt-0.5">
                            {weatherData ? Math.round(weatherData.current.temperature_2m) : 0}°C
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 block">
                            {weatherData ? getWeatherInfo(weatherData.current.weather_code).text : ""}
                          </span>
                          <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">
                            Feels like {weatherData ? Math.round(weatherData.current.apparent_temperature) : 0}°C
                          </span>
                        </div>
                      </div>
                      
                      {weatherData && (
                        <div className="py-4 space-y-2.5 text-xs font-semibold">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Relative Humidity</span>
                            <span className="text-white">{weatherData.current.relative_humidity_2m}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rain Chance</span>
                            <span className="text-white">{weatherData.daily.precipitation_probability_max[0]}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Wind Velocity</span>
                            <span className="text-white">{weatherData.current.wind_speed_10m} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">UV Index</span>
                            <span className="text-white">{weatherData.daily.uv_index_max[0]} (Max)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Air Quality</span>
                            <span className="text-emerald-400">Good (AQI 38)</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {weatherData && (
                      <div className="text-[9px] text-slate-500 font-bold text-right pt-2 border-t border-white/5 uppercase">
                        Updated: {new Date(weatherData.current.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </Card>
                </div>
              </div>

              {/* Middle Section: Dashboard parameters and timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Weather Dashboard Card */}
                <div className="lg:col-span-7">
                  {weatherData && (
                    <Card className="p-6 space-y-4">
                      <h4 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2">
                        Live Field Dashboard
                      </h4>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center gap-3">
                          <Thermometer className="w-5 h-5 text-rose-400" />
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Feels Like</span>
                            <span className="text-sm font-extrabold text-white">{Math.round(weatherData.current.apparent_temperature)}°C</span>
                          </div>
                        </div>
                        <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center gap-3">
                          <Droplet className="w-5 h-5 text-blue-400" />
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Humidity</span>
                            <span className="text-sm font-extrabold text-white">{weatherData.current.relative_humidity_2m}%</span>
                          </div>
                        </div>
                        <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center gap-3">
                          <Wind className="w-5 h-5 text-sky-400" />
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Wind speed</span>
                            <span className="text-sm font-extrabold text-white">{weatherData.current.wind_speed_10m} km/h</span>
                          </div>
                        </div>
                        <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center gap-3">
                          <Compass className="w-5 h-5 text-teal-400" />
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Atm. Pressure</span>
                            <span className="text-sm font-extrabold text-white">{weatherData.current.pressure_msl} hPa</span>
                          </div>
                        </div>
                        <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center gap-3">
                          <Eye className="w-5 h-5 text-amber-400" />
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Visibility</span>
                            <span className="text-sm font-extrabold text-white">{Math.round(weatherData.current.visibility / 1000)} km</span>
                          </div>
                        </div>
                        <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center gap-3">
                          <Sun className="w-5 h-5 text-yellow-400" />
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">UV Max</span>
                            <span className="text-sm font-extrabold text-white">{weatherData.daily.uv_index_max[0]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-xs font-semibold text-slate-400">
                        <div className="flex items-center gap-2">
                          <Sunrise className="w-4 h-4 text-yellow-500 shrink-0" />
                          <span>Sunrise: <strong className="text-white">{formatTime(weatherData.daily.sunrise[0])}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sunset className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>Sunset: <strong className="text-white">{formatTime(weatherData.daily.sunset[0])}</strong></span>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Weather Timeline Hourly Forecast */}
                <div className="lg:col-span-5">
                  <Card className="p-6 space-y-4 h-full flex flex-col justify-between">
                    <h4 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2">
                      Today's Ambient Timeline
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {timeline.map((hour, idx) => {
                        const IconComponent = hour.Icon;
                        return (
                          <div key={idx} className="p-3 bg-slate-900/30 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-slate-500 font-bold block uppercase">{hour.label}</span>
                            <IconComponent className={`w-5 h-5 my-2 ${hour.color}`} />
                            <span className="text-xs font-bold text-white">{hour.temp}</span>
                            <span className="text-[8px] text-slate-400 font-semibold truncate w-full mt-0.5">{hour.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

              </div>

              {/* Bottom Section: 5-Day forecast and AI insights list */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 5-Day Forecast Panel */}
                <div className="lg:col-span-7">
                  <Card className="p-6 space-y-4">
                    <h4 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2">
                      5-Day Weather Horizon
                    </h4>
                    
                    <div className="divide-y divide-white/5">
                      {fiveDayForecast.map((day, idx) => {
                        const IconComponent = day.Icon;
                        return (
                          <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-xs">
                            <span className="font-bold text-white w-12">{day.day}</span>
                            <div className="flex items-center gap-1.5 w-28">
                              <IconComponent className={`w-4.5 h-4.5 shrink-0 ${day.color}`} />
                              <span className="text-slate-400 font-semibold truncate">
                                {weatherData ? getWeatherInfo(weatherData.daily.weather_code[idx + 1]).text : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-medium text-[10px]">Rain: {day.rainProb}</span>
                              <div className="w-16 text-right font-bold text-white">
                                {day.minTemp} / {day.maxTemp}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* AI Insights Card */}
                <div className="lg:col-span-5">
                  <Card className="p-6 space-y-4">
                    <h4 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>AgriTwin AI Analytics</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {aiInsights.map((insight, idx) => {
                        const IconComponent = insight.icon;
                        return (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-900/30 border border-white/5 rounded-xl text-xs">
                            <span className="text-slate-400 font-bold">{insight.label}</span>
                            <div className="flex items-center gap-1.5">
                              <IconComponent className={`w-4 h-4 shrink-0 ${insight.color}`} />
                              <span className="text-white font-semibold">{insight.value}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

              </div>

            </div>
          )}
        </div>
      ) : (
        // ORIGINAL IRRIGATION ASSISTANT PANEL
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Next Watering Date Card */}
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
      )}

    </div>
  );
};

export default IrrigationPage;
