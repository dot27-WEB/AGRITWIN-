/**
 * Analyzes crop sequence (current, previous, 2nd previous) to evaluate soil fatigue.
 * Returns a sustainability score and localized advice comments.
 */
export const calculateCropRotation = (current, previous, secondPrevious) => {
  let score = 100;
  let advice = {
    en: "Active rotation. Soil nutrients are balanced.",
    te: "చురుకైన పంట మార్పిడి. నేల పోషకాలు సమతుల్యంగా ఉన్నాయి.",
    hi: "सक्रिय फसल चक्र। मिट्टी के पोषक तत्व संतुलित हैं।"
  };

  const curr = current?.toLowerCase();
  const prev = previous?.toLowerCase();
  const prev2 = secondPrevious?.toLowerCase();

  if (!curr || !prev) {
    return {
      score: 80,
      advice: {
        en: "Establish a diverse 3-crop history to get full rotation insights.",
        te: "పూర్తి పంట మార్పిడి విశ్లేషణ కోసం 3 పంటల చరిత్రను అందించండి.",
        hi: "पूर्ण फसल चक्र विश्लेषण के लिए 3 फसलों का इतिहास दर्ज करें।"
      }
    };
  }

  // Check monoculture (all same)
  if (curr === prev && (!prev2 || curr === prev2)) {
    score = 30;
    advice = {
      en: "Alert: Severe monoculture detected. Planting the same crop repeatedly leads to high pest nesting and severe nutrient exhaustion.",
      te: "హెచ్చరిక: ఒకే రకమైన పంటను వరుసగా వేయడం వల్ల తెగుళ్లు ఎక్కువగా వస్తాయి మరియు నేల సారం క్షీణిస్తుంది.",
      hi: "चेतावनी: गंभीर एकफसल (monoculture)। एक ही फसल बार-बार उगाने से कीट प्रकोप बढ़ता है और मिट्टी अनुपजाऊ होती है।"
    };
  } else if (curr === prev) {
    score = 50;
    advice = {
      en: "Consecutive crop warning. Rotating crops next season is strongly recommended to break pest life cycles.",
      te: "వరుసగా ఒకే పంట వేయవద్దు. తెగుళ్ల నివారణకు వచ్చే సీజన్‌లో పంట మార్పిడి చేయండి.",
      hi: "लगातार फसल चेतावनी। कीट चक्र को तोड़ने के लिए अगले सीजन में फसल बदलना बहुत जरूरी है।"
    };
  } else {
    // Healthy rotations
    const isLegume = (c) => ["groundnut", "soybean"].includes(c);
    const isHeavyFeeder = (c) => ["rice", "maize", "cotton"].includes(c);

    if (isLegume(prev) && isHeavyFeeder(curr)) {
      score = 95;
      advice = {
        en: "Excellent cropping pattern. Heavy feeding crop is leveraging nitrogen naturally left by the previous leguminous crop.",
        te: "అద్భుతమైన పంట మార్పిడి. గత పంట (చిక్కుడు జాతి) అందించిన నత్రజనిని ఈ పంట చక్కగా వాడుకుంటుంది.",
        hi: "उत्कृष्ट फसल चक्र। भारी पोषक तत्व लेने वाली फसल, पिछली फलीदार फसल द्वारा छोड़े गए नाइट्रोजन का लाभ ले रही है।"
      };
    } else if (isHeavyFeeder(prev) && isLegume(curr)) {
      score = 90;
      advice = {
        en: "Highly sustainable. Legume crop is restoring nitrogen reserves depleted by last season's heavy feeder.",
        te: "చాలా మంచి పద్ధతి. గత పంట వల్ల కోల్పోయిన నత్రజనిని ఈ చిక్కుడు పంట తిరిగి భర్తీ చేస్తుంది.",
        hi: "अत्यधिक टिकाऊ। फलीदार फसल पिछली भारी फसल द्वारा शोषित नाइट्रोजन को बहाल कर रही है।"
      };
    } else {
      score = 85;
      advice = {
        en: "Standard rotation is active. Keep changing crop families (grains, oilseeds, vegetables).",
        te: "సాధారణ పంట మార్పిడి అమలవుతోంది. పంట రకాలను మారుస్తూ ఉండండి.",
        hi: "सामान्य फसल चक्र सक्रिय है। फसलों के परिवारों (अनाज, तिलहन, सब्जियां) को बदलते रहें।"
      };
    }
  }

  // Determine next crop recommendation
  let recommendedNextCropId = "groundnut"; // default fallback
  if (["rice", "wheat", "maize"].includes(curr)) {
    recommendedNextCropId = "groundnut"; // suggest nitrogen fixer
  } else if (["cotton"].includes(curr)) {
    recommendedNextCropId = "soybean";
  } else if (["groundnut", "soybean"].includes(curr)) {
    recommendedNextCropId = "wheat"; // follow nitrogen fixer with heavy feeder grain
  } else if (["tomato"].includes(curr)) {
    recommendedNextCropId = "maize";
  }

  return {
    score,
    advice,
    recommendedNextCropId
  };
};
