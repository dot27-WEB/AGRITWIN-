import React from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { FarmProvider, useFarm } from "./context/FarmContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { CreateFarmTwinPage } from "./pages/CreateFarmTwinPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CropRecommendationPage } from "./pages/CropRecommendationPage";
import { DiseaseDetectionPage } from "./pages/DiseaseDetectionPage";
import { IrrigationPage } from "./pages/IrrigationPage";
import { MarketPage } from "./pages/MarketPage";
import { GovernmentSchemesPage } from "./pages/GovernmentSchemesPage";
import { FarmingCalendarPage } from "./pages/FarmingCalendarPage";
import { ProfilePage } from "./pages/ProfilePage";

import { motion, AnimatePresence } from "motion/react";

const AppContent: React.FC = () => {
  const { activePage } = useFarm();

  const renderActivePage = () => {
    switch (activePage) {
      case "landing":
        return <LandingPage />;
      case "login":
        return <LoginPage />;
      case "create-twin":
        return <CreateFarmTwinPage />;
      case "dashboard":
        return <DashboardPage />;
      case "crop-recommendation":
        return <CropRecommendationPage />;
      case "disease-detection":
        return <DiseaseDetectionPage />;
      case "irrigation":
        return <IrrigationPage />;
      case "market":
        return <MarketPage />;
      case "schemes":
        return <GovernmentSchemesPage />;
      case "calendar":
        return <FarmingCalendarPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf9] dark:bg-[#050c0a] transition-colors duration-300">
      <Navbar />
      
      {/* Page Content with smooth fade animations */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <FarmProvider>
        <AppContent />
      </FarmProvider>
    </LanguageProvider>
  );
}
