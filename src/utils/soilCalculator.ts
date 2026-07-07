export interface SoilReport {
  fertilityScore: number;
  healthScore: number;
  nitrogen: { value: number; status: "Low" | "Medium" | "High"; recommend: string };
  phosphorus: { value: number; status: "Low" | "Medium" | "High"; recommend: string };
  potassium: { value: number; status: "Low" | "Medium" | "High"; recommend: string };
  moistureRetention: "Low" | "Medium" | "High";
  organicCarbon: number; // percentage, e.g. 0.45%
}

export function calculateSoilMetrics(
  soilType: string,
  prevCrop: string,
  prevPrevCrop: string,
  fertilizers: string
): SoilReport {
  // Baselines based on soil type
  let baseFertility = 50;
  let baseMoisture: "Low" | "Medium" | "High" = "Medium";
  let nVal = 40;
  let pVal = 45;
  let kVal = 50;

  switch (soilType.toLowerCase()) {
    case "black soil / clayey":
    case "black soil":
    case "clayey":
    case "clayey / clayey-loam":
      baseFertility = 65;
      baseMoisture = "High";
      nVal = 55;
      pVal = 50;
      kVal = 70;
      break;
    case "loamy / clay loam":
    case "loamy":
    case "alluvial / sandy loam":
    case "alluvial":
      baseFertility = 70;
      baseMoisture = "Medium";
      nVal = 60;
      pVal = 55;
      kVal = 55;
      break;
    case "sandy loam / red sandy":
    case "sandy loam":
    case "red soil":
    case "sandy":
      baseFertility = 40;
      baseMoisture = "Low";
      nVal = 35;
      pVal = 30;
      kVal = 40;
      break;
    default:
      baseFertility = 50;
      baseMoisture = "Medium";
  }

  // Adjustments based on crop history
  // Groundnut / Legumes FIX nitrogen!
  const isLegume = (crop: string) => {
    const c = crop.toLowerCase();
    return c.includes("groundnut") || c.includes("gram") || c.includes("legume") || c.includes("pulse") || c.includes("soybean");
  };

  const isExhaustive = (crop: string) => {
    const c = crop.toLowerCase();
    return c.includes("rice") || c.includes("paddy") || c.includes("cotton") || c.includes("sugarcane") || c.includes("chilli");
  };

  if (isLegume(prevCrop)) {
    baseFertility += 15;
    nVal += 25;
  } else if (isExhaustive(prevCrop)) {
    baseFertility -= 10;
    nVal -= 15;
    pVal -= 10;
  }

  if (isLegume(prevPrevCrop)) {
    baseFertility += 8;
    nVal += 12;
  } else if (isExhaustive(prevPrevCrop)) {
    baseFertility -= 8;
    nVal -= 10;
    kVal -= 10;
  }

  // Mono-cropping penalty! Back to back identical crops
  if (prevCrop && prevCrop.toLowerCase() === prevPrevCrop.toLowerCase() && prevCrop !== "none") {
    baseFertility -= 15;
    nVal -= 10;
    pVal -= 10;
    kVal -= 10;
  }

  // Adjustments based on fertilizers
  const fert = fertilizers.toLowerCase();
  if (fert.includes("npk") || fert.includes("urea") || fert.includes("chemical")) {
    nVal += 15;
    pVal += 10;
    kVal += 10;
    baseFertility -= 5; // long term chemical drop
  }
  if (fert.includes("manure") || fert.includes("compost") || fert.includes("organic") || fert.includes("vermicompost")) {
    baseFertility += 12;
    nVal += 10;
    pVal += 10;
    kVal += 15;
  }

  // Clamp values
  const clamp = (val: number, min: number = 10, max: number = 99) => Math.max(min, Math.min(max, val));

  const finalNFert = clamp(nVal);
  const finalPFert = clamp(pVal);
  const finalKFert = clamp(kVal);
  const finalFertility = clamp(baseFertility, 20, 95);

  // Calculate Farm Health Score (combination of fertility, sustainable history, and organic fertilizers)
  let healthScore = finalFertility;
  if (isLegume(prevCrop) || isLegume(prevPrevCrop)) {
    healthScore += 5;
  }
  if (fert.includes("organic") || fert.includes("manure")) {
    healthScore += 8;
  }
  if (prevCrop === prevPrevCrop && prevCrop !== "none" && isExhaustive(prevCrop)) {
    healthScore -= 12; // back-to-back paddy/cotton ruins health
  }
  healthScore = clamp(healthScore, 15, 98);

  const getStatus = (val: number): "Low" | "Medium" | "High" => {
    if (val < 40) return "Low";
    if (val < 70) return "Medium";
    return "High";
  };

  const getRecommendation = (nutrient: string, status: "Low" | "Medium" | "High"): string => {
    if (status === "Low") {
      if (nutrient === "N") return "Apply Neem-coated Urea split-dose, or incorporate Green Manure (Dhaincha) immediately.";
      if (nutrient === "P") return "Apply Single Super Phosphate (SSP) or Rock Phosphate to boost root anchorage.";
      return "Apply Muriate of Potash (MOP) @ 40 kg/acre, or add wood ash to enhance pest resistance.";
    }
    if (status === "Medium") {
      if (nutrient === "N") return "Supplement with Vermicompost @ 2 tons/acre to maintain nitrogen level naturally.";
      if (nutrient === "P") return "Apply Diammonium Phosphate (DAP) during early sowing phase.";
      return "Spray 1% Potassium Nitrate solution during active flowering stage.";
    }
    // High status
    if (nutrient === "N") return "Nitrogen level is healthy. Avoid over-applying Urea to prevent pest attraction.";
    if (nutrient === "P") return "Phosphorus is sufficient. Maintain routine crop rotation to keep it available.";
    return "Potassium level is rich. It provides excellent immunity against drought and fungal blast.";
  };

  const organicCarbon = Number((0.3 + (finalFertility / 200) + (fert.includes("manure") ? 0.15 : 0)).toFixed(2));

  return {
    fertilityScore: finalFertility,
    healthScore: healthScore,
    nitrogen: {
      value: finalNFert,
      status: getStatus(finalNFert),
      recommend: getRecommendation("N", getStatus(finalNFert))
    },
    phosphorus: {
      value: finalPFert,
      status: getStatus(finalPFert),
      recommend: getRecommendation("P", getStatus(finalPFert))
    },
    potassium: {
      value: finalKFert,
      status: getStatus(finalKFert),
      recommend: getRecommendation("K", getStatus(finalKFert))
    },
    moistureRetention: baseMoisture,
    organicCarbon: organicCarbon
  };
}
