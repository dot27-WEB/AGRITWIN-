export interface RiskReport {
  overallRisk: "Low" | "Moderate" | "High" | "Critical";
  overallRiskScore: number; // 0 - 100
  diseaseRisk: number; // 0 - 100
  waterRisk: number; // 0 - 100
  marketRisk: number; // 0 - 100
  pestRisk: number; // 0 - 100
  reasons: string[];
}

export function calculateFarmRisks(
  crop: string,
  prevCrop: string,
  waterSource: string,
  irrigationMethod: string,
  soilType: string
): RiskReport {
  const c = crop ? crop.toLowerCase() : "";
  const pc = prevCrop ? prevCrop.toLowerCase() : "";
  const ws = waterSource ? waterSource.toLowerCase() : "";
  const im = irrigationMethod ? irrigationMethod.toLowerCase() : "";

  let diseaseRisk = 30;
  let waterRisk = 40;
  let marketRisk = 35;
  let pestRisk = 25;
  let reasons: string[] = [];

  // Monoculture elevates disease & pest risks!
  if (c && pc && c === pc) {
    diseaseRisk += 35;
    pestRisk += 30;
    reasons.push("Monoculture crop patterns detected: Planting same crop sequentially elevates fungal and pest spore levels.");
  }

  // Crop-specific disease baselines
  if (c.includes("rice") || c.includes("paddy")) {
    diseaseRisk += 10;
    pestRisk += 15;
  } else if (c.includes("cotton")) {
    diseaseRisk += 15;
    pestRisk += 25;
  } else if (c.includes("chilli")) {
    diseaseRisk += 25;
    pestRisk += 15;
  }

  // Water source + water requirement analysis
  const highWaterCrops = ["rice", "paddy", "sugarcane", "cotton"];
  const isHighWater = highWaterCrops.some(h => c.includes(h));

  if (ws.includes("rainfed")) {
    waterRisk += 25;
    reasons.push("Rainfed agriculture relies on seasonal monsoons. Climate delay would trigger immediate drought stress.");
    if (isHighWater) {
      waterRisk += 20;
      reasons.push("CRITICAL mismatch: High-water crop cultivated on purely rainfed acreage without backup borewells.");
    }
  } else if (ws.includes("borewell") || ws.includes("canal")) {
    waterRisk -= 10;
  }

  // Irrigation system modifier
  if (im.includes("flood")) {
    waterRisk += 15;
    reasons.push("Traditional flood irrigation exhibits low water-use efficiency, leading to deep percolation losses.");
  } else if (im.includes("drip") || im.includes("sprinkler")) {
    waterRisk -= 25;
  }

  // Market risk based on crop volatility
  if (c.includes("chilli") || c.includes("onion")) {
    marketRisk += 30;
    reasons.push("High volatility crop choice: Price fluctuations are historically frequent and severe.");
  } else if (c.includes("rice") || c.includes("wheat")) {
    marketRisk -= 15;
    reasons.push("Low market risk: Price heavily cushioned by Government minimum support prices (MSP).");
  }

  // Clamp risks
  const clamp = (v: number) => Math.max(5, Math.min(95, v));
  diseaseRisk = clamp(diseaseRisk);
  waterRisk = clamp(waterRisk);
  marketRisk = clamp(marketRisk);
  pestRisk = clamp(pestRisk);

  // Calculate overall risk
  const overallRiskScore = Math.round((diseaseRisk * 0.3) + (waterRisk * 0.3) + (marketRisk * 0.2) + (pestRisk * 0.2));

  let overallRisk: "Low" | "Moderate" | "High" | "Critical" = "Low";
  if (overallRiskScore > 75) {
    overallRisk = "Critical";
  } else if (overallRiskScore > 50) {
    overallRisk = "High";
  } else if (overallRiskScore > 30) {
    overallRisk = "Moderate";
  }

  if (reasons.length === 0) {
    reasons.push("Crop operations are well-balanced with sufficient backup irrigation and rotating schedules.");
  }

  return {
    overallRisk,
    overallRiskScore,
    diseaseRisk,
    waterRisk,
    marketRisk,
    pestRisk,
    reasons
  };
}
