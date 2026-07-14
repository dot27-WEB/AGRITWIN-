import React, { createContext, useContext, useState, useEffect } from 'react';
import * as farmStorage from '../localStorage/farmStorage';
import { calculateSoilHealth } from '../utils/soilCalculator';
import { calculateCropRotation } from '../utils/cropRotation';
import { calculateFarmRisks } from '../utils/riskCalculator';
import { calculateExpectedProfit } from '../utils/profitCalculator';

const FarmContext = createContext();

export const FarmProvider = ({ children }) => {
  const [farms, setFarms] = useState(() => farmStorage.getFarmsFromStorage());
  const [activeFarmId, setActiveFarmId] = useState(() => farmStorage.getActiveFarmIdFromStorage());
  const [profile, setProfileState] = useState(() => farmStorage.getFarmerProfileFromStorage());

  useEffect(() => {
    farmStorage.saveFarmsToStorage(farms);
  }, [farms]);

  useEffect(() => {
    farmStorage.saveActiveFarmIdToStorage(activeFarmId);
  }, [activeFarmId]);

  useEffect(() => {
    if (profile) {
      farmStorage.saveFarmerProfileToStorage(profile);
    } else {
      localStorage.removeItem('agritwin_profile');
    }
  }, [profile]);

  const activeFarm = farms.find(f => f.id === activeFarmId) || null;

  // Live computed metrics for the virtual farm twin
  let computedMetrics = null;
  if (activeFarm) {
    const soil = calculateSoilHealth(
      activeFarm.soilType, 
      activeFarm.previousCrop, 
      activeFarm.fertilizersUsed
    );
    const rotation = calculateCropRotation(
      activeFarm.currentCrop, 
      activeFarm.previousCrop, 
      activeFarm.prev2Crop
    );
    const risk = calculateFarmRisks({
      soilType: activeFarm.soilType,
      waterAvailability: activeFarm.waterAvailability,
      irrigationMethod: activeFarm.irrigationMethod,
      currentCrop: activeFarm.currentCrop,
      rotationScore: rotation.score,
      fertilizers: activeFarm.fertilizersUsed
    });
    const profit = calculateExpectedProfit(
      activeFarm.landSize, 
      activeFarm.currentCrop, 
      soil.fertilityScore, 
      risk.waterRisk
    );

    // Calculate dynamic farm health score based on soil, rotation, and risk
    const avgRisk = (risk.waterRisk + risk.diseaseRisk + risk.marketRisk) / 3;
    const farmHealthScore = Math.round(
      (soil.fertilityScore * 0.4) + 
      (rotation.score * 0.3) + 
      ((100 - avgRisk) * 0.3)
    );

    computedMetrics = {
      soil,
      rotation,
      risk,
      profit,
      farmHealthScore: Math.min(Math.max(farmHealthScore, 10), 100)
    };
  }

  const addFarm = (farmData) => {
    const newId = 'farm_' + Date.now();
    const newFarm = {
      id: newId,
      createdAt: new Date().toISOString(),
      calendarCompletedTasks: [],
      ...farmData
    };
    setFarms(prev => [...prev, newFarm]);
    setActiveFarmId(newId);
    return newFarm;
  };

  const updateFarm = (id, farmData) => {
    setFarms(prev => prev.map(f => f.id === id ? { ...f, ...farmData } : f));
  };

  const deleteFarm = (id) => {
    setFarms(prev => {
      const filtered = prev.filter(f => f.id !== id);
      if (activeFarmId === id) {
        setActiveFarmId(filtered.length > 0 ? filtered[0].id : '');
      }
      return filtered;
    });
  };

  const toggleCalendarTask = (farmId, taskId) => {
    setFarms(prev => prev.map(f => {
      if (f.id === farmId) {
        const tasks = f.calendarCompletedTasks || [];
        const updatedTasks = tasks.includes(taskId)
          ? tasks.filter(tId => tId !== taskId)
          : [...tasks, taskId];
        return { ...f, calendarCompletedTasks: updatedTasks };
      }
      return f;
    }));
  };

  const loginFarmer = (farmerProfile) => {
    setProfileState(farmerProfile);
  };

  const logoutFarmer = () => {
    setProfileState(null);
    setActiveFarmId('');
    setFarms([]);
    localStorage.removeItem('agritwin_farms');
    localStorage.removeItem('agritwin_active_farm_id');
  };

  return (
    <FarmContext.Provider value={{
      farms,
      activeFarmId,
      activeFarm,
      computedMetrics,
      profile,
      addFarm,
      updateFarm,
      deleteFarm,
      toggleCalendarTask,
      loginFarmer,
      logoutFarmer,
      setActiveFarmId
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
