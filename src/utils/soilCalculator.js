/**
 * Calculates soil fertility metrics based on farm configurations.
 */
export const calculateSoilHealth = (soilType, previousCrop, fertilizers = []) => {
  // Base fertility by soil type
  let baseFertility = 50;
  let ph = "6.5";
  let nitrogen = "Medium";
  let phosphorus = "Medium";
  let potassium = "Medium";

  switch (soilType) {
    case "Clayey":
      baseFertility = 70;
      ph = "7.2";
      nitrogen = "Medium";
      phosphorus = "High";
      potassium = "Medium";
      break;
    case "Loamy":
      baseFertility = 85;
      ph = "6.5";
      nitrogen = "High";
      phosphorus = "Medium";
      potassium = "Medium";
      break;
    case "Sandy":
      baseFertility = 40;
      ph = "5.8";
      nitrogen = "Low";
      phosphorus = "Low";
      potassium = "Low";
      break;
    case "Black":
      baseFertility = 80;
      ph = "7.8";
      nitrogen = "Medium";
      phosphorus = "Medium";
      potassium = "High";
      break;
    case "Red":
      baseFertility = 55;
      ph = "6.2";
      nitrogen = "Low";
      phosphorus = "Medium";
      potassium = "Medium";
      break;
    default:
      baseFertility = 50;
      ph = "6.5";
  }

  // Agronomic rules: Leguminous crops enrich nitrogen
  const legumeCrops = ["groundnut", "soybean"];
  if (legumeCrops.includes(previousCrop?.toLowerCase())) {
    baseFertility += 15;
    nitrogen = "High";
  }

  // Fertilizer impacts
  const fertList = Array.isArray(fertilizers) 
    ? fertilizers.map(f => f.toLowerCase()) 
    : [];

  if (fertList.includes("manure") || fertList.includes("compost")) {
    baseFertility += 10;
  }
  if (fertList.includes("urea")) {
    nitrogen = "High";
    // Over-usage of chemical Urea without organic compost slightly decreases soil health over time
    if (!fertList.includes("manure") && !fertList.includes("compost")) {
      baseFertility -= 5;
    }
  }
  if (fertList.includes("npk")) {
    phosphorus = "High";
    potassium = "High";
  }
  if (fertList.includes("potash")) {
    potassium = "High";
  }

  // Clamp fertility score
  const fertilityScore = Math.min(Math.max(baseFertility, 10), 100);

  return {
    fertilityScore,
    ph,
    nitrogen,
    phosphorus,
    potassium
  };
};
