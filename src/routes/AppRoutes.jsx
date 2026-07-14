import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import CreateFarmTwinPage from '../pages/CreateFarmTwinPage';
import DashboardPage from '../pages/DashboardPage';
import CropRecommendationPage from '../pages/CropRecommendationPage';
import DiseaseDetectionPage from '../pages/DiseaseDetectionPage';
import IrrigationPage from '../pages/IrrigationPage';
import MarketPage from '../pages/MarketPage';
import GovernmentSchemesPage from '../pages/GovernmentSchemesPage';
import FarmingCalendarPage from '../pages/FarmingCalendarPage';
import ProfilePage from '../pages/ProfilePage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-twin" element={<CreateFarmTwinPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/crops" element={<CropRecommendationPage />} />
      <Route path="/disease" element={<DiseaseDetectionPage />} />
      <Route path="/irrigation" element={<IrrigationPage />} />
      <Route path="/market" element={<MarketPage />} />
      <Route path="/schemes" element={<GovernmentSchemesPage />} />
      <Route path="/calendar" element={<FarmingCalendarPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
