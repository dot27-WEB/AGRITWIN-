import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFarm } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { 
  analyzeCropImageApi, getGeminiApiKey, compressImage 
} from "../services/aiVision";
import { 
  ArrowLeft, Upload, Camera, Trash2, RefreshCw, Loader2, CheckCircle2,
  AlertCircle, ShieldAlert, Sparkles, FileText, CheckCircle, Info, HeartPulse, 
  Video, Printer, Share2, Download, PlusCircle, Check
} from "lucide-react";

export const DiseaseDetectionPage = () => {
  const navigate = useNavigate();
  const { profile, activeFarm } = useFarm();
  const { language, t } = useLanguage();

  // Selected crop ID or default fallback for analysis
  const currentCropId = activeFarm?.currentCrop || profile?.currentCrop || "rice";

  // Upload/capture state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Scanning/Simulation states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  // History state
  const [historyReports, setHistoryReports] = useState([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("agritwin_disease_history");
    if (saved) {
      try {
        setHistoryReports(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse disease history:", err);
      }
    }
  }, []);

  // Validate uploaded files
  const validateAndProcessFile = (file) => {
    const validExtensions = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    if (!validExtensions.includes(fileExtension)) {
      setValidationError("Unsupported file type. Please upload JPG, JPEG, PNG, or WEBP crop images.");
      setUploadedImage(null);
      setImageFile(null);
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setValidationError("File is too large. Please upload an image smaller than 10MB.");
      setUploadedImage(null);
      setImageFile(null);
      return;
    }

    setValidationError(null);
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setShowResult(false);
    setDiagnosisResult(null);
  };

  const handleCustomUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // Webcam Capture controllers
  const startCamera = async () => {
    setValidationError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error(err);
      setValidationError("Camera permission was denied. Please upload an image instead.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setUploadedImage(dataUrl);
        
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "captured_specimen.jpg", { type: "image/jpeg" });
            setImageFile(file);
          });
      }
      stopCamera();
      setShowResult(false);
      setDiagnosisResult(null);
    }
  };

  // Reset specimens
  const handleReset = () => {
    setUploadedImage(null);
    setImageFile(null);
    setValidationError(null);
    setIsScanning(false);
    setScanStep(0);
    setShowResult(false);
    setDiagnosisResult(null);
    stopCamera();
  };

  // Analyze speciment using live Gemini Vision API call
  const handleAnalyzeDisease = async () => {
    if (!imageFile) {
      setValidationError("Please select or capture a crop leaf image first.");
      return;
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      setValidationError("AI Disease Detection is temporarily unavailable. Please try again later.");
      return;
    }

    setIsScanning(true);
    setScanStep(1); // Uploading Image...

    const transitionTimer = (step, delay) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setScanStep(step);
          resolve();
        }, delay);
      });
    };

    try {
      await transitionTimer(2, 600); // AI Analyzing Leaf...
      await transitionTimer(3, 600); // Detecting Disease...
      await transitionTimer(4, 600); // Generating Treatment...

      // Run live model API query
      const report = await analyzeCropImageApi(imageFile);

      await transitionTimer(5, 400); // Preparing Report...

      const fullReport = {
        id: "rep_" + Date.now(),
        cropName: report.cropName || "Unknown Crop",
        diseaseName: report.diseaseName || "Uncertain",
        confidenceScore: report.confidenceScore || "N/A",
        severity: report.severity || "medium",
        symptoms: report.symptoms || [],
        possibleCause: report.possibleCause || "N/A",
        organicTreatment: report.organicTreatment || "N/A",
        chemicalTreatment: report.chemicalTreatment || "N/A",
        preventionTips: report.preventionTips || [],
        recoveryTime: report.recoveryTime || "N/A",
        advice: report.advice || "N/A",
        whyObserved: report.whyObserved || [],
        imageUrl: uploadedImage || "",
        date: new Date().toLocaleDateString()
      };

      setDiagnosisResult(fullReport);
      setIsScanning(false);
      setScanStep(0);
      setShowResult(true);

      // Save to local diagnosis history
      const updatedHistory = [fullReport, ...historyReports.slice(0, 9)];
      setHistoryReports(updatedHistory);
      localStorage.setItem("agritwin_disease_history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
      setIsScanning(false);
      setScanStep(0);
      setValidationError(err.message || "The AI service is temporarily unavailable. Please try again later.");
    }
  };

  // Reopen report from history
  const handleReopenReport = (report) => {
    setUploadedImage(report.imageUrl);
    setDiagnosisResult(report);
    setShowResult(true);
    setValidationError(null);
  };

  // Print diagnostic report template
  const handlePrint = () => {
    if (!diagnosisResult) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>AgriTwin AI - Crop Diagnosis Report</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 26px; font-weight: 900; color: #064e3b; }
            .meta { font-size: 13px; color: #64748b; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .card { padding: 15px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; }
            .label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748b; tracking-wider; }
            .value { font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 4px; }
            .section-title { font-size: 16px; font-weight: 800; color: #064e3b; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 30px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            p { font-size: 13px; color: #334155; line-height: 1.6; margin: 0 0 10px 0; }
            ul { padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.6; }
            li { margin-bottom: 6px; }
            .disclaimer { margin-top: 50px; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">🔬 AgriTwin AI Crop Health Report</div>
              <div style="font-size: 13px; color: #10b981; font-weight: bold; margin-top: 4px;">Verified Neural Vision Diagnosis</div>
            </div>
            <div class="meta">Date: ${diagnosisResult.date}</div>
          </div>
          <div class="grid">
            <div class="card"><div class="label">Target Crop</div><div class="value">${diagnosisResult.cropName}</div></div>
            <div class="card"><div class="label">Identified Infection</div><div class="value">${diagnosisResult.diseaseName}</div></div>
            <div class="card"><div class="label">Confidence Score</div><div class="value">${diagnosisResult.confidenceScore}</div></div>
            <div class="card"><div class="label">Severity Level</div><div class="value">${diagnosisResult.severity.toUpperCase()}</div></div>
          </div>
          <div class="section-title">Symptoms & Observations</div>
          <ul>${diagnosisResult.symptoms.map(s => `<li>${s}</li>`).join("")}</ul>
          <div class="section-title">Organic Solution</div>
          <p>${diagnosisResult.organicTreatment}</p>
          <div class="section-title">Chemical Intervention</div>
          <p>${diagnosisResult.chemicalTreatment}</p>
          <div class="section-title">Long-Term Prevention Tips</div>
          <ul>${diagnosisResult.preventionTips.map(tip => `<li>${tip}</li>`).join("")}</ul>
          <div class="section-title">Farming Advice</div>
          <p>${diagnosisResult.advice}</p>
          <div class="disclaimer">Disclaimer: This analysis is for demonstration purposes. Farmers should consult local agricultural experts before applying treatments.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Share diagnostic results summary
  const handleShare = () => {
    if (!diagnosisResult) return;
    const text = `AgriTwin AI Plant Pathology Scan\nCrop: ${diagnosisResult.cropName}\nDisease: ${diagnosisResult.diseaseName}\nSeverity: ${diagnosisResult.severity.toUpperCase()}\nConfidence: ${diagnosisResult.confidenceScore}`;
    if (navigator.share) {
      navigator.share({
        title: "AgriTwin AI Specimen Scan",
        text: text,
        url: window.location.href
      }).catch(err => console.warn(err));
    } else {
      navigator.clipboard.writeText(text);
      alert("Report details copied to clipboard!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative text-left">

      {/* Return to Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm cursor-pointer select-none"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToDashboard") || "Back to Dashboard"}
      </button>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>🔬</span> Crop Disease AI Clinic
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Run live AI vision scans on affected leaf cells to recommend treatment solutions.
        </p>
      </div>

      {/* Validation alert banner */}
      {validationError && (
        <div className="mb-6 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input viewport */}
        <div className="md:col-span-5 space-y-6">
          
          <Card hoverable={false} className="border border-white/10 bg-slate-950/40 p-6 rounded-2xl backdrop-blur-xl relative overflow-hidden shadow-xl shadow-black/40">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />
            
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2.5 uppercase tracking-widest">
              <span>📷</span> Image Capture & Upload
            </h3>

            {/* Drag & Drop viewfinder frame */}
            <div className="border-2 border-dashed border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 transition-all bg-slate-900/40 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[220px]">
              
              {/* Media stream camera viewer */}
              {isCameraActive && (
                <div className="absolute inset-0 w-full h-full bg-black z-20 flex flex-col justify-between">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                    <Button
                      onClick={capturePhoto}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Take Snapshot
                    </Button>
                    <Button
                      onClick={stopCamera}
                      className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Uploaded specimen image preview */}
              {uploadedImage && !isCameraActive && (
                <div className="absolute inset-0 w-full h-full z-10">
                  <img
                    src={uploadedImage}
                    alt="Uploaded leaf specimen"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
                </div>
              )}

              {/* Upload prompt default state */}
              {!isCameraActive && (
                <div className="relative z-10 flex flex-col items-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-white">
                    {uploadedImage ? "Specimen Loaded" : "Upload Crop Leaf Image"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal font-medium">
                    Drag and drop file or select from folder. Supports JPG, JPEG, PNG, WEBP.
                  </p>
                  
                  {/* File dialog activation input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              )}

            </div>

            {/* Action buttons */}
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={startCamera}
                  disabled={isCameraActive || isScanning}
                  className="w-full py-2.5 bg-slate-900 border border-white/5 hover:border-emerald-500/20 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-emerald-400" />
                  Capture Photo
                </Button>
                
                <Button
                  onClick={handleReset}
                  disabled={isScanning || (!uploadedImage && !isCameraActive)}
                  className="w-full py-2.5 bg-slate-900 border border-white/5 hover:border-rose-500/20 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  Reset Specimen
                </Button>
              </div>

              <Button
                onClick={handleAnalyzeDisease}
                disabled={!uploadedImage || isScanning || isCameraActive}
                className="w-full py-3.5 bg-gradient-to-br from-farm-600 to-emerald-600 hover:from-farm-500 hover:to-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase active:scale-95 shadow-xl shadow-farm-950/20 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/20"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Scanning Specimen...
                  </>
                ) : (
                  "Analyze Disease"
                )}
              </Button>
            </div>
          </Card>

          {/* History: Recent reports list */}
          {historyReports.length > 0 && (
            <Card hoverable={false} className="border border-white/10 bg-slate-950/40 p-5 rounded-2xl shadow-xl shadow-black/40">
              <h4 className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block mb-3">
                Recent Disease Reports
              </h4>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {historyReports.map((rep) => (
                  <button
                    key={rep.id}
                    onClick={() => handleReopenReport(rep)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl border border-white/5 bg-slate-900/30 hover:bg-emerald-950/20 text-left transition-all cursor-pointer"
                  >
                    <img
                      src={rep.imageUrl}
                      alt={rep.cropName}
                      className="w-9 h-9 rounded-lg object-cover border border-white/5 shrink-0"
                    />
                    <div className="overflow-hidden flex-1">
                      <div className="flex justify-between items-center text-[9px] text-slate-500 font-semibold mb-0.5">
                        <span>{rep.cropName}</span>
                        <span>{rep.date}</span>
                      </div>
                      <span className="text-[11px] font-bold text-white block truncate">
                        {rep.diseaseName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

        </div>

        {/* RIGHT COLUMN: Diagnostic report details */}
        <div className="md:col-span-7 space-y-6">
          
          {/* State A: Loading Experience */}
          {isScanning && (
            <Card hoverable={false} className="border border-white/10 bg-slate-950/40 p-8 rounded-2xl backdrop-blur-xl flex flex-col justify-center min-h-[400px] shadow-lg shadow-black/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-farm-500 via-emerald-500 to-farm-500 animate-pulse" />
              
              <div className="max-w-sm mx-auto w-full space-y-6">
                <div className="flex items-center justify-center mb-2">
                  <Loader2 className="w-10 h-10 text-farm-500 animate-spin" />
                </div>
                
                <h4 className="text-white font-black text-center text-sm uppercase tracking-widest">
                  Running Neural Vision Scan...
                </h4>

                {/* Step-by-Step Checklist Loader */}
                <div className="space-y-3.5 bg-slate-900/60 p-5 rounded-2xl border border-white/5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className={scanStep >= 1 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                      1. Uploading Image to Vision Buffer...
                    </span>
                    {scanStep === 1 ? <Loader2 className="w-3.5 h-3.5 text-farm-400 animate-spin" /> : scanStep > 1 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={scanStep >= 2 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                      2. AI Analyzing Leaf Surface Tissue...
                    </span>
                    {scanStep === 2 ? <Loader2 className="w-3.5 h-3.5 text-farm-400 animate-spin" /> : scanStep > 2 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={scanStep >= 3 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                      3. Detecting Disease Spore Formations...
                    </span>
                    {scanStep === 3 ? <Loader2 className="w-3.5 h-3.5 text-farm-400 animate-spin" /> : scanStep > 3 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={scanStep >= 4 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                      4. Generating Treatment Interventions...
                    </span>
                    {scanStep === 4 ? <Loader2 className="w-3.5 h-3.5 text-farm-400 animate-spin" /> : scanStep > 4 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={scanStep >= 5 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                      5. Preparing AI Pathological Report...
                    </span>
                    {scanStep === 5 ? <Loader2 className="w-3.5 h-3.5 text-farm-400 animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* State B: Empty state */}
          {!isScanning && !showResult && (
            <Card hoverable={false} className="border border-dashed border-white/10 bg-slate-950/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px]">
              
              <svg className="w-32 h-32 mb-6 text-emerald-500/25" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                <path d="M70 100C85 80 115 80 130 100" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                <circle cx="100" cy="100" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="M100 70V130" stroke="currentColor" strokeWidth="1.5" />
              </svg>

              <h4 className="text-white font-extrabold text-base tracking-wide">
                AI Visual Tissue Diagnostics
              </h4>
              <p className="text-slate-400 text-xs max-w-sm mt-2 leading-relaxed">
                Upload leaf images or select sample crops on the left, then click "Analyze Disease" to generate reports.
              </p>
            </Card>
          )}

          {/* State C: Uncertainty Handling display */}
          {!isScanning && showResult && diagnosisResult && (diagnosisResult.diseaseName === "Uncertain" || diagnosisResult.diseaseName === "unknown") && (
            <Card hoverable={false} className="border border-white/10 bg-slate-950/40 p-8 rounded-2xl backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[400px] shadow-lg">
              <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
              <h4 className="text-white font-extrabold text-base">Inconclusive Diagnosis</h4>
              <p className="text-slate-400 text-xs max-w-sm mt-2 leading-relaxed">
                Unable to confidently identify the disease. Please upload a clearer image showing the affected leaves.
              </p>
              <Button
                onClick={handleReset}
                className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                Upload New Image
              </Button>
            </Card>
          )}

          {/* State D: Normal Diagnostic Report Card */}
          {!isScanning && showResult && diagnosisResult && diagnosisResult.diseaseName !== "Uncertain" && diagnosisResult.diseaseName !== "unknown" && (
            <div className="space-y-6 animate-fade-in text-slate-300">
              
              {/* 1. Result summary card */}
              <div className="border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-emerald-950/20 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                
                {/* Export utility buttons */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Print report"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Share report"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Download report PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3.5 mb-5 mt-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-400 font-extrabold block uppercase tracking-widest">Identified Infection</span>
                    <h4 className="text-base font-black text-white tracking-wide mt-0.5 leading-normal">
                      {diagnosisResult.diseaseName}
                    </h4>
                  </div>
                </div>

                {/* Metric grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5 pt-4 text-xs font-semibold">
                  <div>
                    <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Affected Crop</span>
                    <span className="text-white font-bold block mt-1">{diagnosisResult.cropName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Severity Level</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border inline-block mt-1 ${
                      diagnosisResult.severity === "high" 
                        ? "text-rose-400 bg-rose-500/10 border-rose-500/20" 
                        : diagnosisResult.severity === "medium" 
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/20" 
                        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    }`}>
                      {diagnosisResult.severity === "high" ? "🔴 High" : diagnosisResult.severity === "medium" ? "🟡 Medium" : "🟢 Low"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Confidence Score</span>
                    <span className="text-emerald-400 font-bold block mt-1">{diagnosisResult.confidenceScore}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Recovery Time</span>
                    <span className="text-white font-bold block mt-1">{diagnosisResult.recoveryTime}</span>
                  </div>
                </div>
              </div>

              {/* 2. Symptoms list */}
              <Card hoverable={false} className="border border-white/10 bg-slate-950/40 p-5 rounded-2xl shadow-lg">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Identified Leaf Symptoms
                </h4>
                <ul className="space-y-2 text-xs leading-relaxed text-slate-300 font-medium">
                  {diagnosisResult.symptoms.map((sym, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-emerald-400">✦</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* 3. Treatment interventions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Organic */}
                <Card hoverable={false} className="border border-white/10 bg-slate-950/40 p-5 rounded-xl shadow-md">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Recommended Organic Treatment
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-300 font-medium">
                    {diagnosisResult.organicTreatment}
                  </p>
                </Card>

                {/* Chemical */}
                <Card hoverable={false} className="border border-white/10 bg-slate-950/40 p-5 rounded-xl shadow-md">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Recommended Chemical Treatment
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-300 font-medium">
                    {diagnosisResult.chemicalTreatment}
                  </p>
                </Card>

              </div>

              {/* 4. Why This Disease? (Expandable section) */}
              <Card hoverable={false} className="border border-white/10 bg-slate-950/40 p-5 rounded-2xl shadow-lg">
                <details className="group outline-none">
                  <summary className="text-xs font-bold text-white uppercase tracking-widest flex items-center justify-between cursor-pointer list-none select-none">
                    <span className="flex items-center gap-1.5">
                      <Info className="w-4.5 h-4.5 text-emerald-400" />
                      Why was this disease detected?
                    </span>
                    <span className="transition-transform group-open:rotate-180 text-slate-400">
                      ▼
                    </span>
                  </summary>
                  <div className="mt-4 border-t border-white/5 pt-4 text-xs leading-relaxed text-slate-300 font-medium space-y-3">
                    <p>The AI identified this disease because it observed:</p>
                    <ul className="space-y-1.5 pl-4 list-disc">
                      {diagnosisResult.whyObserved.map((obs, i) => (
                        <li key={i}>{obs}</li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-slate-500 mt-2 font-medium">
                      <strong>Possible Cause:</strong> {diagnosisResult.possibleCause}
                    </p>
                  </div>
                </details>
              </Card>

              {/* 5. AI Recommendation (Farming advice) */}
              <Card hoverable={false} className="border border-white/10 bg-slate-950/40 p-5 rounded-2xl shadow-lg">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <HeartPulse className="w-4.5 h-4.5 text-emerald-400" />
                  AI Farming Recommendation
                </h4>
                <p className="text-xs leading-relaxed text-slate-300 font-medium">
                  {diagnosisResult.advice}
                </p>
              </Card>

              {/* 6. Prevention Tips */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  Long-Term Prevention Tips
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {diagnosisResult.preventionTips.map((tip, index) => (
                    <div key={index} className="p-3 bg-slate-950/20 border border-white/5 rounded-xl text-xs flex gap-2">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✔</span>
                      <p className="text-slate-300 leading-normal font-medium">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Disclaimer Card */}
              <div className="p-4 rounded-xl border border-white/5 bg-slate-950/60 text-[10px] text-slate-400 flex items-start gap-2.5 leading-relaxed">
                <Info className="w-4.5 h-4.5 text-slate-500 shrink-0 mt-0.5" />
                <p>
                  This analysis is for demonstration purposes. Farmers should consult local agricultural experts before applying treatments.
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DiseaseDetectionPage;
