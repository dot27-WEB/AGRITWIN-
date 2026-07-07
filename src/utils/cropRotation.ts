export interface CropRotationRecommendation {
  recommendedCrops: string[];
  reasons: string[];
  scientificJustification: string;
}

export function getCropRotationAdvice(prevCrop: string, soilType: string): CropRotationRecommendation {
  const pc = prevCrop ? prevCrop.toLowerCase() : "";
  const st = soilType ? soilType.toLowerCase() : "";

  let recommendedCrops: string[] = ["Groundnut", "Maize (Corn)", "Wheat"];
  let reasons: string[] = [
    "Breaks the monoculture weed cycle.",
    "Balances macro-nutrients naturally inside the crop canopy root zone.",
    "Enhances soil biological health and beneficial microbial fauna."
  ];
  let scientificJustification = "Crop rotation is crucial to disrupt the host-pest cycle. Alternating exhaustive crops with nitrogen-fixing leguminous plants keeps soil resilient and high-yielding.";

  if (pc.includes("paddy") || pc.includes("rice")) {
    recommendedCrops = ["Groundnut", "Chilli", "Gram/Chickpea"];
    reasons = [
      "Paddy depletes nitrogen heavily; Groundnut (legume) will naturally fix nitrogen back into the soil nodes.",
      "Requires significantly less standing water than Paddy, allowing water tables to replenish.",
      "Reduces the carryover spore count of Rice Blast fungus in the field."
    ];
    scientificJustification = "After an anaerobic water-logged crop like Paddy, planting a legume or deep-rooted dicot helps aerate the soil and restructure pore spaces for better water-holding capacity.";
  } else if (pc.includes("cotton")) {
    recommendedCrops = ["Wheat", "Groundnut", "Maize (Corn)"];
    reasons = [
      "Cotton is a heavy potassium feeder; Groundnut or Maize helps restore balanced mineral uptake.",
      "Wheat provides organic carbon cover, preventing soil erosion from bare winter cotton rows.",
      "Interrupts the overwintering pupae cycle of the devastating Pink Bollworm pest."
    ];
    scientificJustification = "Cotton roots secrete specific exudates that attract Fusarium species. Rotating with cereals like Wheat or Maize prevents pathogen accumulation and utilizes deep residual soil moisture.";
  } else if (pc.includes("chilli")) {
    recommendedCrops = ["Maize (Corn)", "Paddy (Rice)", "Wheat"];
    reasons = [
      "Chilli is highly susceptible to nematodes; Maize acts as a non-host crop, reducing nematode infestation.",
      "Breaks the Dieback/Anthracnose spore cycle completely.",
      "Improves soil organic structure after intensive chilli weeding practices."
    ];
    scientificJustification = "Solanaceous crops like chilli leave soil exhausted of specific trace minerals. Rotating with graminaceous crops like Maize or Wheat restores balanced macro-nutrient structures.";
  } else if (pc.includes("groundnut")) {
    recommendedCrops = ["Paddy (Rice)", "Cotton", "Chilli"];
    reasons = [
      "Utilizes the abundant Nitrogen fixed in root nodules by the preceding Groundnut crop, reducing urea cost.",
      "Excellent preceding crop for high-yield Cotton, raising boll size by up to 15%.",
      "Increases soil humus layer, which improves moisture uptake of subsequent commercial crops."
    ];
    scientificJustification = "Groundnut roots house Rhizobium bacteria that enrich soil nitrogen tables. Follow-on exhausting crops like Cotton or Rice will absorb this natural fertilizer efficiently.";
  }

  return {
    recommendedCrops,
    reasons,
    scientificJustification
  };
}
