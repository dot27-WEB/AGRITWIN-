import schemesData from '../data/governmentSchemes.json';

/**
 * Checks which schemes the farm is eligible for.
 * Returns an array of schemes combined with eligibility results.
 */
export const checkSchemeEligibility = (farm) => {
  if (!farm) return [];

  return schemesData.map(scheme => {
    let eligible = false;
    let reason = {
      en: "Evaluating eligibility parameters...",
      te: "అర్హతను పరిశీలిస్తున్నాము...",
      hi: "पात्रता मापदंडों का मूल्यांकन..."
    };
    let estimatedBenefit = "";

    const land = parseFloat(farm.landSize) || 0;
    const water = farm.waterAvailability;
    const method = farm.irrigationMethod;

    switch (scheme.id) {
      case "pm_kisan":
        if (land > 0 && land <= scheme.maxLandSizeAcres) {
          eligible = true;
          reason = {
            en: `Eligible! Your land size of ${land} acres is within the marginal limit (<= 5 acres).`,
            te: `అర్హులు! మీ భూమి పరిమాణం (${land} ఎకరాలు) పరిమితి లోపలే ఉంది.`,
            hi: `योग्य! आपकी भूमि का आकार ${land} एकड़ सीमा (<= 5 एकड़) के भीतर है।`
          };
          estimatedBenefit = "₹6,000 / year";
        } else {
          eligible = false;
          reason = {
            en: `Ineligible: Land size of ${land} acres exceeds the marginal limit of 5 acres.`,
            te: `అనర్హులు: మీ భూమి పరిమాణం 5 ఎకరాల కంటే ఎక్కువ ఉంది.`,
            hi: `अयोग्य: भूमि का आकार 5 एकड़ की सीमा से अधिक है।`
          };
          estimatedBenefit = "₹0";
        }
        break;

      case "pm_fasal_bima":
        eligible = true; // active for all registered crops
        reason = {
          en: `Eligible! Standard coverage is active for your current crop: ${farm.currentCrop || 'Selected Crop'}.`,
          te: `అర్హులు! మీ ప్రస్తుత పంటకు బీమా సౌకర్యం అందుబాటులో ఉంది.`,
          hi: `योग्य! आपकी वर्तमान फसल के लिए मानक बीमा कवरेज सक्रिय है।`
        };
        estimatedBenefit = "Up to 98% Crop Coverage";
        break;

      case "pm_kusum":
        if (water === "Borewell" || water === "Well" || water === "Canal") {
          eligible = true;
          reason = {
            en: "Eligible! Active surface or underground water source detected, ideal for solar pump integration.",
            te: "అర్హులు! పొలంలో నీటి పారుదల వనరు ఉంది, సోలార్ పంపు అమర్చడానికి అనువైనది.",
            hi: "योग्य! भूमिगत या सतही जल स्रोत उपलब्ध है, सौर पंप लगाने के लिए आदर्श है।"
          };
          estimatedBenefit = "60% Subsidy on Pump Cost";
        } else {
          eligible = false;
          reason = {
            en: "Ineligible: Solar pumps require an active borewell, canal, or well source.",
            te: "అనర్హులు: సోలార్ పంపుల ఏర్పాటుకు బోరుబావి లేదా బావి నీరు అవసరం.",
            hi: "अयोग्य: सौर पंप के लिए बोरवेल, नहर या कुएं का सक्रिय जल स्रोत होना आवश्यक है।"
          };
          estimatedBenefit = "₹0";
        }
        break;

      case "drip_irrigation_subsidy":
        if (method !== "Drip") {
          eligible = true;
          reason = {
            en: `Eligible! Apply to upgrade your current ${method} irrigation system to Drip under government micro-irrigation guidelines.`,
            te: `అర్హులు! మీ నీటి పారుదల పద్ధతిని డ్రిప్ సిస్టమ్‌గా మార్చుకోవడానికి సబ్సిడీ లభిస్తుంది.`,
            hi: `योग्य! सरकारी सूक्ष्म-सिंचाई दिशानिर्देशों के तहत ड्रिप सिंचाई प्रणाली में अपग्रेड करने के लिए आवेदन करें।`
          };
          estimatedBenefit = land <= 5 ? "90% Cost Subsidy" : "50% Cost Subsidy";
        } else {
          eligible = false;
          reason = {
            en: "Ineligible: Drip system is already installed in this farm twin.",
            te: "అనర్హులు: మీ పొలంలో ఇప్పటికే డ్రిప్ సిస్టమ్ అమర్చబడి ఉంది.",
            hi: "अयोग्य: इस खेत में ड्रिप सिस्टम पहले से ही स्थापित है।"
          };
          estimatedBenefit = "Fully Setup";
        }
        break;

      default:
        eligible = false;
    }

    return {
      ...scheme,
      eligible,
      reason,
      estimatedBenefit
    };
  });
};
