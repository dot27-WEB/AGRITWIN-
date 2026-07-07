import React from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { ArrowLeft, User, MapPin, Edit3, LogOut, Layers, ShieldCheck, Mail } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { profile, logout, navigateTo } = useFarm();
  const { t } = useLanguage();

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">No active farm twin found.</p>
        <Button onClick={() => navigateTo("create-twin")}>Create Farm Twin</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigateTo("dashboard")}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight font-sans">
              {profile.farmerName}
            </h1>
            <p className="text-xs text-gray-500 flex items-center font-semibold mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              {profile.village}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigateTo("create-twin")}
            className="flex items-center space-x-1.5 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Core details */}
        <div className="md:col-span-8">
          <Card className="p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-slate-800 pb-3">
              Field Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
              <div className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-xl">
                <span className="text-gray-400 block uppercase font-bold text-[10px]">Landholding Acreage</span>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                  {profile.landSize} Acres
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-xl">
                <span className="text-gray-400 block uppercase font-bold text-[10px]">Soil Twin Properties</span>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                  {profile.soilType}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-xl">
                <span className="text-gray-400 block uppercase font-bold text-[10px]">Water Supply Source</span>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                  {profile.waterAvailability}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-xl">
                <span className="text-gray-400 block uppercase font-bold text-[10px]">Irrigation Delivery</span>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                  {profile.irrigationMethod}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-xl">
                <span className="text-gray-400 block uppercase font-bold text-[10px]">Current Sowing</span>
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {profile.currentCrop}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-xl">
                <span className="text-gray-400 block uppercase font-bold text-[10px]">Fertilizer System</span>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                  {profile.fertilizersUsed}
                </p>
              </div>
            </div>

            <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-slate-800 pt-4 pb-3">
              Agricultural Crop History
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[10px]">Previous Crop (Season-1)</span>
                <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
                  {profile.prevCrop}
                </p>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[10px]">Second Previous Crop (Season-2)</span>
                <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
                  {profile.prevPrevCrop}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar credentials */}
        <div className="md:col-span-4 space-y-6">
          <Card className="p-5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 mb-3 shrink-0">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Verified Twin Credential</p>
            <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-normal">
              Credential issued by AgriTwin decentralized AI on Guntur Local Server Node.
            </p>
            <span className="mt-4 text-[9px] font-mono uppercase bg-gray-100 dark:bg-slate-900 px-2.5 py-1 rounded-full text-gray-500 font-bold block select-all">
              TWIN-ID: {profile.farmerName.replace(/\s+/g, "").slice(0, 6).toUpperCase()}-{profile.village.replace(/\s+/g, "").slice(0, 3).toUpperCase()}
            </span>
          </Card>

          <Card className="p-5 bg-gradient-to-tr from-emerald-500/[0.01] to-teal-500/[0.01] border-emerald-500/10 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 mb-3 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Need Live Expert Help?</p>
            <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-normal">
              Connect your active virtual twin report directly with district krishi vigyan kendra (KVK) officers.
            </p>
            <Button variant="secondary" size="sm" className="w-full text-xs font-bold mt-4">
              Connect KVK Expert
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
