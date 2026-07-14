import cropsData from '../data/crops.json';

/**
 * Calculates expected profit, revenues, and cost breakdowns based on farm attributes.
 */
export const calculateExpectedProfit = (landSize, cropId, soilFertility, waterRisk) => {
  const crop = cropsData.find(c => c.id === cropId);
  if (!crop) {
    return {
      revenue: 0,
      cost: 0,
      profit: 0,
      yieldAcre: 0
    };
  }

  // Base parameters
  const size = parseFloat(landSize) || 1;
  const baseYield = crop.expectedYieldPerAcre;
  const pricePerQuintal = crop.averagePricePerQuintal;

  // Cost estimate per acre by crop category
  let costPerAcre = 15000; // default standard
  if (crop.category === "Commercial") {
    costPerAcre = 24000;
  } else if (crop.category === "Vegetable") {
    costPerAcre = 45000;
  } else if (crop.category === "Oilseed") {
    costPerAcre = 16000;
  } else if (crop.category === "Grain") {
    costPerAcre = 18000;
  }

  // Adjust yield based on soil fertility and water risk
  let yieldMultiplier = 1.0;

  // High soil fertility boosts yield (up to +20%)
  if (soilFertility > 80) {
    yieldMultiplier += 0.2;
  } else if (soilFertility < 50) {
    yieldMultiplier -= 0.15;
  }

  // High water risk reduces yield (up to -30%)
  if (waterRisk > 70) {
    yieldMultiplier -= 0.3;
  } else if (waterRisk > 40) {
    yieldMultiplier -= 0.1;
  }

  // Ensure multiplier doesn't fall below a crop failure threshold
  yieldMultiplier = Math.max(yieldMultiplier, 0.3);

  const finalYieldPerAcre = baseYield * yieldMultiplier;
  const totalYield = finalYieldPerAcre * size;
  
  const totalRevenue = totalYield * pricePerQuintal;
  const totalCost = costPerAcre * size;
  const expectedProfit = totalRevenue - totalCost;

  return {
    revenue: Math.round(totalRevenue),
    cost: Math.round(totalCost),
    profit: Math.round(expectedProfit),
    yieldAcre: parseFloat(finalYieldPerAcre.toFixed(1))
  };
};
