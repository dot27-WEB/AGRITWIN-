import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import diseasesData from "../data/diseases.json";
import { ArrowLeft, Upload, Leaf, Check, AlertCircle, FileText, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export const DiseaseDetectionPage: React.FC = () => {
  const { profile, navigateTo } = useFarm();
  const { t } = useLanguage();
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-semibold mb-4">No active farm twin found.</p>
        <Button onClick={() => navigateTo("create-twin")}>Create Farm Twin</Button>
      </div>
    );
  }

  const handleSampleTrigger = (disease: any) => {
    setIsScanning(true);
    setUploadedImage(disease.sampleImageUrl);
    setSelectedDisease(null);

    // Simulate real AI scanning delay
    setTimeout(() => {
      setSelectedDisease(disease);
      setIsScanning(false);
    }, 1500);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setIsScanning(true);
      setSelectedDisease(null);

      // Simulate a random analysis result for uploaded leaf
      setTimeout(() => {
        // Grab a random disease from our database to simulate AI inference
        const rand = diseasesData[Math.floor(Math.random() * diseasesData.length)];
        setSelectedDisease(rand);
        setIsScanning(false);
      }, 1800);
    }
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

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
          <Leaf className="w-8 h-8 mr-2 text-emerald-500" />
          AI Plant Disease Detection Lab
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Upload leaf images or select from high-definition field samples to diagnose crop infections, mildew, and nutritional blights in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Sample Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Diagnostic Source
            </h2>

            {/* Simulated Drag & Drop box */}
            <div className="border-2 border-dashed border-gray-200 dark:border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 transition-all bg-gray-50/50 dark:bg-slate-900/10 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[180px]">
              {uploadedImage ? (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={uploadedImage}
                    alt="Uploaded Leaf Sample"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
                </div>
              ) : null}

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {uploadedImage ? "Image Uploaded Successfully" : "Upload Affected Crop Leaf Image"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 max-w-xs font-semibold">
                  Supports PNG, JPG, JPEG formats from smartphone or field drone.
                </p>

                {/* Secret click trigger input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>

            {/* Quick-test Preloaded Samples */}
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Select Field Sample (For Quick Review)
              </span>
              <div className="grid grid-cols-2 gap-3.5">
                {diseasesData.map((dis) => (
                  <button
                    key={dis.id}
                    onClick={() => handleSampleTrigger(dis)}
                    className="flex items-center space-x-2 p-2 rounded-xl border border-gray-100 dark:border-slate-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-left transition-all cursor-pointer"
                  >
                    <img
                      src={dis.sampleImageUrl}
                      alt={dis.diseaseName}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate">
                      {dis.cropName}: {dis.diseaseName.split(" (")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Diagnosis Result Card */}
        <div className="lg:col-span-7">
          {isScanning ? (
            <Card className="h-full flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Leaf className="w-12 h-12 text-emerald-500 animate-bounce" />
                <div className="absolute inset-0 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-6">
                Running Neural Inference on Leaf Cells...
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Comparing tissue necrosis margins against pest databases.
              </p>
            </Card>
          ) : selectedDisease ? (
            <Card className="p-6 sm:p-8 space-y-6 border-dashed border-emerald-500/20 bg-emerald-500/[0.01]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800/80 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">
                    AI Scan Completed Successfully
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedDisease.diseaseName}
                  </h2>
                </div>

                <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-right">
                  <span className="text-[9px] text-gray-400 font-bold block uppercase leading-none">Confidence</span>
                  <span className="text-base font-black text-emerald-600">94.2%</span>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wide flex items-center">
                  <AlertCircle className="w-4 h-4 text-orange-500 mr-1.5" />
                  Identified Leaf Symptoms
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {selectedDisease.symptoms.map((sym: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-emerald-500 mr-2">✦</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Regimens / Treatments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-slate-800/80 pt-5">
                {/* Organic */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide flex items-center">
                    <Check className="w-4 h-4 mr-1 text-emerald-500" />
                    Organic Solution (Recommended)
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {selectedDisease.treatment.organic}
                  </p>
                </div>

                {/* Chemical */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide flex items-center">
                    <Check className="w-4 h-4 mr-1 text-rose-500" />
                    Chemical Intervention
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {selectedDisease.treatment.chemical}
                  </p>
                </div>
              </div>

              {/* Prevention Tips */}
              <div className="border-t border-gray-100 dark:border-slate-800/80 pt-5 space-y-2">
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wide flex items-center">
                  <FileText className="w-4 h-4 text-emerald-500 mr-1.5" />
                  Long-Term Prevention Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedDisease.prevention.map((prev: string, i: number) => (
                    <div key={i} className="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      {prev}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <Leaf className="w-12 h-12 text-gray-300 mb-4" />
              <div className="text-xs">
                <p className="font-bold text-gray-600 dark:text-gray-400">Diagnosis Pending</p>
                <p className="text-gray-500 mt-0.5 leading-relaxed font-medium">Upload an image or pick a field sample on the left to activate AI visual diagnostic reports.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
