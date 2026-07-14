import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import diseasesData from '../data/diseases.json';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  HeartPulse, Upload, FileImage, ShieldAlert, Cpu, 
  Sparkles, CheckSquare, ArrowLeft, RefreshCw, Eye
} from 'lucide-react';

export const DiseaseDetectionPage = () => {
  const { t, language } = useLanguage();
  const { activeFarm } = useFarm();
  
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Pre-selected leaf samples to test the prototype without needing real files
  const sampleLeaves = [
    { id: "rice_blast", label: "Rice Blast (Paddy Leaf)", color: "border-farm-500/30 text-farm-400 bg-farm-950/20" },
    { id: "tomato_late_blight", label: "Tomato Late Blight", color: "border-rose-500/30 text-rose-400 bg-rose-950/20" },
    { id: "cotton_leaf_curl", label: "Cotton Leaf Curl Virus", color: "border-amber-500/30 text-amber-400 bg-amber-950/20" },
    { id: "wheat_rust", label: "Wheat Stripe Rust", color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20" }
  ];

  const handleSelectSample = (diseaseId) => {
    setIsScanning(true);
    setSelectedDisease(null);

    // Simulate AI scanning animation for 1.8 seconds
    setTimeout(() => {
      const match = diseasesData.find(d => d.id === diseaseId);
      setSelectedDisease(match);
      setIsScanning(false);
    }, 1800);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // For any arbitrary file upload, trigger a simulated Tomato Late Blight or Rice Blast diagnosis
      const mockIds = ["tomato_late_blight", "rice_blast", "cotton_leaf_curl", "wheat_rust"];
      const randomId = mockIds[Math.floor(Math.random() * mockIds.length)];
      handleSelectSample(randomId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          AI Plant Disease Clinic 🔬
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Scan leaf structures to diagnose pathogens, calculate confidences, and match cures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Column (Left) */}
        <div className="lg:col-span-1 space-y-6">
          <Card 
            title="Upload Crop Leaf Scan"
            subtitle="Drag & drop images or click file upload to analyze leaf twins."
            hoverGlow={false}
          >
            <div className="space-y-4">
              
              {/* File Drag Box */}
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 relative
                  ${dragActive ? 'border-farm-500 bg-farm-950/15' : 'border-white/10 bg-slate-950/40 hover:border-white/20'}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFileUpload(e); }}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                />
                <div className="flex flex-col items-center justify-center space-y-3 py-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-300">
                    Drag and drop leaf image or <span className="text-farm-400 hover:underline">browse</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">
                    Supports JPG, PNG (Max 5MB)
                  </span>
                </div>
              </div>

              {/* Sample Selector Chips */}
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-3 text-center lg:text-left">
                  Demo Samples (Click to test diagnostics)
                </span>
                
                <div className="grid grid-cols-1 gap-2">
                  {sampleLeaves.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample.id)}
                      disabled={isScanning}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-[11px] font-bold text-left transition-all hover:-translate-y-0.5
                        ${sample.color} border-white/5 hover:border-white/20 active:scale-95`}
                    >
                      <span className="flex items-center gap-2">
                        <FileImage className="w-4 h-4 shrink-0" />
                        {sample.label}
                      </span>
                      <Eye className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* Diagnostic Results Column (Right) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Load scan animation */}
          {isScanning && (
            <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-slate-900/30 border border-white/5 rounded-3xl backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-slate-950 border border-farm-500/20 flex items-center justify-center text-farm-400 mb-6 shadow-xl relative animate-pulse-slow">
                <Cpu className="w-8 h-8 animate-spin-slow" />
                <span className="absolute inset-0 rounded-full border border-farm-500 animate-ping"></span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-1">
                AI Diagnostic Running
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Aligning cellular leaf structure with virtual digital twins...
              </p>
            </div>
          )}

          {/* Result Card display */}
          {!isScanning && selectedDisease && (
            <div className="animate-fade-in">
              <Card 
                hoverGlow={true}
                variant="green"
                title={
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-rose-400" />
                      {selectedDisease.name[language] || selectedDisease.name['en']}
                    </span>
                    <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                      Confidence: {selectedDisease.confidenceRange}
                    </span>
                  </div>
                }
              >
                <div className="space-y-6">
                  
                  {/* Diagnostic details */}
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Pathological Diagnosis</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      {selectedDisease.description[language] || selectedDisease.description['en']}
                    </p>
                  </div>

                  {/* Treatments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Organic Treatment */}
                    <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl">
                      <span className="text-[9px] text-farm-400 font-bold block uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-farm-400" />
                        Organic Controls
                      </span>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                        {selectedDisease.organicTreatment[language] || selectedDisease.organicTreatment['en']}
                      </p>
                    </div>

                    {/* Chemical Treatment */}
                    <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl">
                      <span className="text-[9px] text-rose-400 font-bold block uppercase tracking-wider mb-2 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        Chemical Prescriptions
                      </span>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                        {selectedDisease.chemicalTreatment[language] || selectedDisease.chemicalTreatment['en']}
                      </p>
                    </div>

                  </div>

                  {/* Prevention Checklist */}
                  <div className="border-t border-white/5 pt-4">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider mb-3">
                      Prevention Tips & Agronomic Prophylactics
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {(selectedDisease.preventionTips[language] || selectedDisease.preventionTips['en']).map((tip, index) => (
                        <div key={index} className="flex items-start gap-2 text-[10px] font-semibold text-slate-300 bg-slate-950/40 border border-white/5 rounded-xl p-3">
                          <CheckSquare className="w-4 h-4 text-farm-500 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset analysis button */}
                  <div className="flex items-center justify-end border-t border-white/5 pt-3">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => setSelectedDisease(null)}
                      icon={RefreshCw}
                    >
                      Scan Another Leaf
                    </Button>
                  </div>

                </div>
              </Card>
            </div>
          )}

          {/* Idle/Welcome Screen if no result */}
          {!isScanning && !selectedDisease && (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-slate-900/10 border border-dashed border-white/10 rounded-3xl text-center">
              <HeartPulse className="w-12 h-12 text-slate-600 mb-4 animate-pulse-slow" />
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">
                Scan Terminal Ready
              </h4>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Drag a crop leaf image into the upload bay or select one of the demo samples on the left to review the AI diagnostics engine output.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default DiseaseDetectionPage;
