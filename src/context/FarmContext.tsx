import React, { createContext, useContext, useState, useEffect } from "react";
import { calculateSoilMetrics, SoilReport } from "../utils/soilCalculator";
import { calculateFarmRisks, RiskReport } from "../utils/riskCalculator";
import { calculateExpectedProfit, ProfitReport } from "../utils/profitCalculator";
import { getCropRotationAdvice, CropRotationRecommendation } from "../utils/cropRotation";

export interface FarmProfile {
  farmerName: string;
  village: string;
  landSize: number;
  soilType: string;
  waterAvailability: string;
  currentCrop: string;
  prevCrop: string;
  prevPrevCrop: string;
  irrigationMethod: string;
  fertilizersUsed: string;
}

interface FarmContextType {
  profile: FarmProfile | null;
  isAuthenticated: boolean;
  login: (name: string, village: string) => void;
  logout: () => void;
  createOrUpdateProfile: (newProfile: FarmProfile) => void;
  
  // Calculated Digital Twin Metrics
  soilMetrics: SoilReport | null;
  riskMetrics: RiskReport | null;
  profitMetrics: ProfitReport | null;
  rotationMetrics: CropRotationRecommendation | null;
  isCalculating: boolean;

  // State-based Routing
  activePage: string;
  navigateTo: (page: string) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

const DEFAULT_PROFILE: FarmProfile = {
  farmerName: "Vardhan Rao",
  village: "Guntur, Andhra Pradesh",
  landSize: 5,
  soilType: "Black Soil / Clayey",
  waterAvailability: "Borewell + Canal",
  currentCrop: "Paddy (Rice)",
  prevCrop: "Paddy (Rice)",
  prevPrevCrop: "Groundnut",
  irrigationMethod: "Flood Irrigation",
  fertilizersUsed: "NPK Chemical + Urea"
};

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<FarmProfile | null>(() => {
    const saved = localStorage.getItem("agritwin_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    // Return default pre-filled farm for instant hackathon demonstration!
    return DEFAULT_PROFILE;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("agritwin_auth") === "true" || !!profile;
  });

  const [soilMetrics, setSoilMetrics] = useState<SoilReport | null>(null);
  const [riskMetrics, setRiskMetrics] = useState<RiskReport | null>(null);
  const [profitMetrics, setProfitMetrics] = useState<ProfitReport | null>(null);
  const [rotationMetrics, setRotationMetrics] = useState<CropRotationRecommendation | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Recalculate twin properties whenever profile changes
  useEffect(() => {
    if (!profile) {
      setSoilMetrics(null);
      setRiskMetrics(null);
      setProfitMetrics(null);
      setRotationMetrics(null);
      return;
    }

    setIsCalculating(true);
    // Simulate a minor professional AI calculation delay
    const timer = setTimeout(() => {
      const soil = calculateSoilMetrics(
        profile.soilType,
        profile.prevCrop,
        profile.prevPrevCrop,
        profile.fertilizersUsed
      );

      const risks = calculateFarmRisks(
        profile.currentCrop,
        profile.prevCrop,
        profile.waterAvailability,
        profile.irrigationMethod,
        profile.soilType
      );

      const profits = calculateExpectedProfit(
        profile.currentCrop,
        profile.landSize,
        soil.fertilityScore,
        risks.overallRiskScore
      );

      const rotation = getCropRotationAdvice(profile.currentCrop, profile.soilType);

      setSoilMetrics(soil);
      setRiskMetrics(risks);
      setProfitMetrics(profits);
      setRotationMetrics(rotation);
      setIsCalculating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [profile]);

  const [activePage, setActivePage] = useState<string>("landing");

  const navigateTo = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const login = (name: string, village: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("agritwin_auth", "true");
    
    // Create basic default profile under this name if none exists
    const current = profile || DEFAULT_PROFILE;
    const updated = { ...current, farmerName: name, village: village };
    setProfile(updated);
    localStorage.setItem("agritwin_profile", JSON.stringify(updated));
    navigateTo("dashboard");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("agritwin_auth");
    navigateTo("landing");
  };

  const createOrUpdateProfile = (newProfile: FarmProfile) => {
    setProfile(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem("agritwin_auth", "true");
    localStorage.setItem("agritwin_profile", JSON.stringify(newProfile));
    navigateTo("dashboard");
  };

  return (
    <FarmContext.Provider
      value={{
        profile,
        isAuthenticated,
        login,
        logout,
        createOrUpdateProfile,
        soilMetrics,
        riskMetrics,
        profitMetrics,
        rotationMetrics,
        isCalculating,
        activePage,
        navigateTo
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error("useFarm must be used within a FarmProvider");
  }
  return context;
};
