export interface ProfitReport {
  grossRevenue: number;
  costOfCultivation: number;
  expectedNetProfit: number;
  yieldPerAcreQty: number; // e.g. 24 Quintals
  yieldUnit: string;
  pricePerUnit: number;
  soilBonusPercentage: number;
  riskDeductionPercentage: number;
}

export function calculateExpectedProfit(
  cropName: string,
  landSizeAcres: number,
  soilFertilityScore: number,
  overallRiskScore: number
): ProfitReport {
  const acres = landSizeAcres || 1;
  const cn = cropName ? cropName.toLowerCase() : "";

  // Base configurations per acre
  let baseYieldPerAcre = 20; // in Quintals
  let yieldUnit = "Quintals";
  let avgPricePerUnit = 2200; // Rs. per Quintal
  let costOfCultivationPerAcre = 12000;

  if (cn.includes("rice") || cn.includes("paddy")) {
    baseYieldPerAcre = 24;
    avgPricePerUnit = 2350;
    costOfCultivationPerAcre = 16000;
  } else if (cn.includes("wheat")) {
    baseYieldPerAcre = 20;
    avgPricePerUnit = 2450;
    costOfCultivationPerAcre = 14000;
  } else if (cn.includes("cotton")) {
    baseYieldPerAcre = 10;
    avgPricePerUnit = 7200;
    costOfCultivationPerAcre = 22000;
  } else if (cn.includes("chilli")) {
    baseYieldPerAcre = 15;
    avgPricePerUnit = 18500;
    costOfCultivationPerAcre = 40000;
  } else if (cn.includes("groundnut")) {
    baseYieldPerAcre = 12;
    avgPricePerUnit = 6400;
    costOfCultivationPerAcre = 18000;
  } else if (cn.includes("maize")) {
    baseYieldPerAcre = 28;
    avgPricePerUnit = 2100;
    costOfCultivationPerAcre = 13500;
  } else {
    // default crop mock config
    baseYieldPerAcre = 15;
    avgPricePerUnit = 3000;
    costOfCultivationPerAcre = 15000;
  }

  // Adjustments based on soil fertility (bonus up to +15% yield)
  // 50 is base. score > 50 gives bonus. score < 50 reduces yield.
  const fertilityFactor = (soilFertilityScore - 50) / 3.33; // range approx -15% to +15%
  const soilBonusPercentage = Math.round(Math.max(-25, Math.min(15, fertilityFactor)));

  // Adjustments based on risk (penalty up to -30% yield due to potential loss)
  // riskScore 0 is perfect. high risk causes loss.
  const riskDeductionPercentage = Math.round(Math.max(0, Math.min(35, (overallRiskScore / 3))));

  // Adjusted Yield
  const finalYieldPerAcre = baseYieldPerAcre * (1 + (soilBonusPercentage - riskDeductionPercentage) / 100);
  
  const grossRevenue = Math.round(finalYieldPerAcre * avgPricePerUnit * acres);
  const totalCost = Math.round(costOfCultivationPerAcre * acres);
  const expectedNetProfit = Math.max(2000 * acres, grossRevenue - totalCost); // Ensure a floor return representing base salvage value

  return {
    grossRevenue,
    costOfCultivation: totalCost,
    expectedNetProfit,
    yieldPerAcreQty: Number(finalYieldPerAcre.toFixed(1)),
    yieldUnit,
    pricePerUnit: avgPricePerUnit,
    soilBonusPercentage,
    riskDeductionPercentage
  };
}
