import React, { useState } from "react";
import { useFarm, FarmProfile } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Sprout, Save, ArrowLeft, Info, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

export const CreateFarmTwinPage: React.FC = () => {
  const { profile, createOrUpdateProfile, navigateTo } = useFarm();
  const { t } = useLanguage();

  const [form, setForm] = useState<FarmProfile>({
    farmerName: profile?.farmerName || "",
    village: profile?.village || "",
    landSize: profile?.landSize || 5,
    soilType: profile?.soilType || "Black Soil / Clayey",
    waterAvailability: profile?.waterAvailability || "Borewell + Canal",
    currentCrop: profile?.currentCrop || "Paddy (Rice)",
    prevCrop: profile?.prevCrop || "Paddy (Rice)",
    prevPrevCrop: profile?.prevPrevCrop || "Groundnut",
    irrigationMethod: profile?.irrigationMethod || "Flood Irrigation",
    fertilizersUsed: profile?.fertilizersUsed || "NPK Chemical + Urea"
  });

  const soilTypes = ["Black Soil / Clayey", "Loamy / Clay loam", "Alluvial / Sandy loam", "Sandy loam / Red sandy"];
  const waterSources = ["Borewell + Canal", "Rainfed / Dryland", "Canal Water only", "Borewell only"];
  const crops = ["Paddy (Rice)", "Wheat", "Cotton", "Maize (Corn)", "Chilli", "Groundnut"];
  const irrigationMethods = ["Flood Irrigation", "Drip Irrigation", "Sprinkler System", "Rain Guns / Rainfed"];
  const fertilizers = ["NPK Chemical + Urea", "Organic Compost + Manure", "Neem-coated Urea only", "Mixed (Chemical + Organic)", "None / Natural Farming"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "landSize" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateProfile(form);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => navigateTo("dashboard")}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex items-center space-x-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Sprout className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Configure Digital Farm Twin
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Provide precise agricultural parameters to generate high-fidelity virtual simulations of your field.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Fields */}
          <div className="lg:col-span-8">
            <Card className="p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-slate-800 pb-3">
                Field & Farm Parameters
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Farmer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("farmerName")}
                  </label>
                  <input
                    type="text"
                    name="farmerName"
                    required
                    value={form.farmerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                {/* Village / Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("village")}
                  </label>
                  <input
                    type="text"
                    name="village"
                    required
                    value={form.village}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                {/* Land Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("landSize")}
                  </label>
                  <input
                    type="number"
                    name="landSize"
                    step="0.1"
                    min="0.1"
                    required
                    value={form.landSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                {/* Soil Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("soilType")}
                  </label>
                  <select
                    name="soilType"
                    value={form.soilType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {soilTypes.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Water Availability */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("waterAvailability")}
                  </label>
                  <select
                    name="waterAvailability"
                    value={form.waterAvailability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {waterSources.map((ws) => (
                      <option key={ws} value={ws}>{ws}</option>
                    ))}
                  </select>
                </div>

                {/* Irrigation Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("irrigationMethod")}
                  </label>
                  <select
                    name="irrigationMethod"
                    value={form.irrigationMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {irrigationMethods.map((im) => (
                      <option key={im} value={im}>{im}</option>
                    ))}
                  </select>
                </div>

                {/* Current Crop */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("currentCrop")}
                  </label>
                  <select
                    name="currentCrop"
                    value={form.currentCrop}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {crops.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                </div>

                {/* Fertilizers Used */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("fertilizerUsed")}
                  </label>
                  <select
                    name="fertilizersUsed"
                    value={form.fertilizersUsed}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {fertilizers.map((ft) => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-slate-800 pt-4 pb-3">
                Cropping History (Required for Rotation & Fertility)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Prev Crop */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("prevCrop")}
                  </label>
                  <select
                    name="prevCrop"
                    value={form.prevCrop}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="None">None / Fallow</option>
                    {crops.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                </div>

                {/* Prev Prev Crop */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("prevPrevCrop")}
                  </label>
                  <select
                    name="prevPrevCrop"
                    value={form.prevPrevCrop}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="None">None / Fallow</option>
                    {crops.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <Button type="submit" className="px-6 py-3 space-x-1.5 cursor-pointer">
                  <Save className="w-4.5 h-4.5" />
                  <span>{t("save")}</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-100/10 p-5 space-y-4">
              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center">
                <Info className="w-4 h-4 mr-1.5 shrink-0" />
                How AgriTwin Simulation Works
              </h3>
              <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✦</span>
                  <span><strong>Soil Fertility:</strong> Your choice of previous crops adjusts nitrogen (N). Legumes boost it while Paddy depletes it.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✦</span>
                  <span><strong>Farm Risks:</strong> Monoculture (sequentially sowing Paddy after Paddy) spikes pest/disease risks. Shifting irrigation to drip reduces water risk.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✦</span>
                  <span><strong>Estimated Profits:</strong> Higher soil fertility adds up to a 15% yield bonus; high-risk scores invoke a crop loss penalty.</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5 border-dashed border-gray-200 dark:border-slate-800/80 bg-transparent flex items-center space-x-3.5">
              <HelpCircle className="w-10 h-10 text-gray-400 dark:text-gray-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-gray-700 dark:text-gray-300">Need Soil Testing?</p>
                <p className="text-gray-500 mt-0.5 leading-normal font-medium">Link with government soil health card directly via digital twin dashboard APIs.</p>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
