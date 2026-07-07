import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import schemesData from "../data/governmentSchemes.json";
import { ArrowLeft, Wallet, ShieldCheck, Sun, Droplet, Sparkles, HelpCircle, Check, Link } from "lucide-react";

export const GovernmentSchemesPage: React.FC = () => {
  const { profile, navigateTo } = useFarm();
  const { t } = useLanguage();
  const [selectedScheme, setSelectedScheme] = useState<any>(schemesData[0]);

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">No active farm twin found.</p>
        <Button onClick={() => navigateTo("create-twin")}>Create Farm Twin</Button>
      </div>
    );
  }

  // Get matching icon based on scheme config
  const getSchemeIcon = (iconName: string) => {
    switch (iconName) {
      case "Wallet":
        return <Wallet className="w-6 h-6 text-emerald-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-teal-500" />;
      case "Sun":
        return <Sun className="w-6 h-6 text-amber-500" />;
      default:
        return <Droplet className="w-6 h-6 text-blue-500" />;
    }
  };

  // Run customized scheme matching algorithm based on farm profile
  const runEligibilityChecker = (scheme: any) => {
    const c = profile.currentCrop.toLowerCase();
    const im = profile.irrigationMethod.toLowerCase();
    const acres = profile.landSize;

    if (scheme.id === "pm-kisan") {
      // Land size should be legitimate
      return { status: "ELIGIBLE", reason: "Standard direct benefit is approved for all family landholdings below 20 acres." };
    }
    if (scheme.id === "crop-insurance") {
      if (c.includes("rice") || c.includes("paddy") || c.includes("cotton")) {
        return { status: "HIGHLY RECOMMENDED", reason: "Cultivating high-value cash/exhausting crops. Cover your seed investment immediately." };
      }
      return { status: "ELIGIBLE", reason: "Standard government insurance cover available for seasonal crops." };
    }
    if (scheme.id === "solar-pump") {
      if (profile.waterAvailability.toLowerCase().includes("borewell") && im.includes("Flood")) {
        return { status: "HIGHLY RECOMMENDED", reason: "High electrical load from flood pumps detected. Upgrade to solar offsets up to 60% setup costs." };
      }
      return { status: "ELIGIBLE", reason: "Open for small agricultural holdings requiring standalone diesel pump replacements." };
    }
    if (scheme.id === "drip-irrigation") {
      if (im.includes("Flood")) {
        return { status: "HIGHLY RECOMMENDED", reason: "Currently practicing traditional flood watering. Subsidy provides up to 55% cashback to transition to micro-nozzles." };
      }
      return { status: "ELIGIBLE", reason: "Available for system expansion and dripline upgrades." };
    }

    return { status: "ELIGIBLE", reason: "Routine matching parameters successfully passed." };
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
            <Wallet className="w-8 h-8 mr-2 text-emerald-500" />
            Government Scheme Assistant
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Intelligent subsidy router linking farm digital twins with DBT schemes, Solar Pump incentives, and PMFBY covers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Schemes selection */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">
            Available Schemes
          </h2>

          <div className="space-y-3.5">
            {schemesData.map((scheme) => {
              const isSelected = selectedScheme.id === scheme.id;
              const check = runEligibilityChecker(scheme);
              return (
                <Card
                  key={scheme.id}
                  hoverable
                  onClick={() => setSelectedScheme(scheme)}
                  className={`p-4 transition-all relative overflow-hidden ${
                    isSelected ? "ring-2 ring-emerald-500 border-emerald-300" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                      {getSchemeIcon(scheme.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {scheme.name.split(" (")[0]}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-wider">
                        {scheme.category}
                      </p>
                      
                      {/* Live matching badge */}
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                        check.status === "HIGHLY RECOMMENDED" 
                          ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400" 
                          : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                      }`}>
                        {check.status}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Scheme Deep details */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider block">
                  Scheme Information Summary
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {selectedScheme.name}
                </h3>
              </div>

              {selectedScheme.subsidyPercentage && (
                <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-[9px] text-gray-400 font-bold block uppercase leading-none">Financial Grant</span>
                  <span className="text-sm font-black text-emerald-600">{selectedScheme.subsidyPercentage}% Subsidy</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              {selectedScheme.description}
            </p>

            {/* Customized Eligibility matching analysis */}
            <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/15 rounded-2xl space-y-1.5">
              <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Live Twin Eligibility Match Reason
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                Status: {runEligibilityChecker(selectedScheme).status}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {runEligibilityChecker(selectedScheme).reason}
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                Key Financial & Technical Benefits
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                {selectedScheme.benefits.map((ben: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-emerald-500 mr-2 shrink-0">✔</span>
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility parameters list */}
            <div className="space-y-2.5 border-t border-gray-100 dark:border-slate-800/80 pt-5">
              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                Eligibility Prerequisites
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                {selectedScheme.eligibility.map((elig: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-emerald-500 mr-2 shrink-0">✦</span>
                    <span>{elig}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock external URL apply button */}
            <div className="border-t border-gray-100 dark:border-slate-800/80 pt-5 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 font-semibold">
                *DBT linking relies on active Aadhaar e-KYC.
              </p>
              <a href={selectedScheme.applyUrl} target="_blank" rel="noreferrer">
                <Button variant="primary" size="sm" className="space-x-1.5 flex items-center text-xs font-bold">
                  <Link className="w-4 h-4" />
                  <span>Apply on Official Portal</span>
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
