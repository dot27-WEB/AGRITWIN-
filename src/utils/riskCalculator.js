/**
 * Computes individual risks (Disease, Water, Market) and overall profitability.
 */
export const calculateFarmRisks = ({
  soilType,
  waterAvailability,
  irrigationMethod,
  currentCrop,
  rotationScore,
  fertilizers = []
}) => {
  // 1. Water Risk
  let waterRisk = 50;
  
  if (waterAvailability === "Rainfed") {
    waterRisk = 80;
  } else if (waterAvailability === "Canal") {
    waterRisk = 45;
  } else if (waterAvailability === "Borewell" || waterAvailability === "Well") {
    waterRisk = 30;
  } else {
    waterRisk = 25; // River / piping
  }

  // Adjust for irrigation efficiency
  if (irrigationMethod === "Drip") {
    waterRisk -= 20;
  } else if (irrigationMethod === "Sprinkler") {
    waterRisk -= 10;
  } else if (irrigationMethod === "Flood") {
    waterRisk += 15;
  }

  // Crop water demands (high water crops on rainfed = extreme risk)
  const highWaterCrops = ["rice", "maize"];
  if (highWaterCrops.includes(currentCrop?.toLowerCase())) {
    waterRisk += 15;
  } else if (["groundnut"].includes(currentCrop?.toLowerCase())) {
    waterRisk -= 10; // drought resistant
  }

  waterRisk = Math.min(Math.max(waterRisk, 10), 95);

  // 2. Disease Risk
  let diseaseRisk = 40;
  const pestSensitiveCrops = ["tomato", "rice", "cotton"];
  
  if (pestSensitiveCrops.includes(currentCrop?.toLowerCase())) {
    diseaseRisk = 65;
  }

  // Monoculture increases pest pressure
  if (rotationScore < 60) {
    diseaseRisk += 25;
  } else if (rotationScore > 85) {
    diseaseRisk -= 10;
  }

  // Organic amendments boost resistance
  const fertList = Array.isArray(fertilizers) 
    ? fertilizers.map(f => f.toLowerCase()) 
    : [];
  if (fertList.includes("manure") || fertList.includes("compost")) {
    diseaseRisk -= 10;
  }

  diseaseRisk = Math.min(Math.max(diseaseRisk, 15), 95);

  // 3. Market Risk
  let marketRisk = 50;
  const cropId = currentCrop?.toLowerCase();
  
  if (["rice", "wheat"].includes(cropId)) {
    // Government MSP backed grains
    marketRisk = 25;
  } else if (["cotton", "soybean"].includes(cropId)) {
    // Volatile cash/oilseed crops
    marketRisk = 55;
  } else if (["tomato"].includes(cropId)) {
    // Highly perishable vegetable
    marketRisk = 80;
  }

  marketRisk = Math.min(Math.max(marketRisk, 15), 95);

  // 4. Overall Risk Level
  const avgRisk = (waterRisk + diseaseRisk + marketRisk) / 3;
  let overallRiskLevel = "Low";
  if (avgRisk > 65) {
    overallRiskLevel = "High";
  } else if (avgRisk > 35) {
    overallRiskLevel = "Medium";
  }

  // 5. Profitability Score
  // High soil fertility boosts profit; high water/pest risks drag it down.
  let profitabilityScore = 75;
  profitabilityScore = profitabilityScore - (avgRisk * 0.4);
  
  if (rotationScore > 80) profitabilityScore += 10;
  if (fertList.includes("manure")) profitabilityScore += 5;

  profitabilityScore = Math.min(Math.max(Math.round(profitabilityScore), 20), 98);

  return {
    waterRisk: Math.round(waterRisk),
    diseaseRisk: Math.round(diseaseRisk),
    marketRisk: Math.round(marketRisk),
    profitabilityScore,
    overallRiskLevel
  };
};
