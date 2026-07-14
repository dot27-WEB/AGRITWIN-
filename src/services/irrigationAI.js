/**
 * Simulates smart irrigation assistant scheduling metrics.
 */
export const calculateIrrigationTimeline = (crop, soilType, landSize, method) => {
  let baseFreq = crop?.irrigationFrequencyDays || 8;
  
  if (soilType === "Sandy") baseFreq -= 2;
  else if (soilType === "Clayey") baseFreq += 3;
  
  baseFreq = Math.max(baseFreq, 2);

  let baseLitersPerAcre = crop?.waterRequirement === "High" ? 24000 : (crop?.waterRequirement === "Low" ? 6000 : 12000);

  if (method === "Drip") baseLitersPerAcre *= 0.6;
  else if (method === "Sprinkler") baseLitersPerAcre *= 0.85;
  else if (method === "Flood") baseLitersPerAcre *= 1.2;

  const totalWaterRequirement = Math.round(baseLitersPerAcre * (parseFloat(landSize) || 1));

  return {
    nextWateringDays: baseFreq,
    litersNeeded: totalWaterRequirement
  };
};
