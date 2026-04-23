export const getDiseaseSuggestions = (disease, risk) => {
  const normalizedDisease = disease.toLowerCase();
  const normalizedRisk = (risk || "Low").toLowerCase();

  const suggestions = {
    diabetes: {
      low: [
        "Maintain balanced meals with controlled sugar intake.",
        "Stay physically active for at least 30 minutes most days.",
        "Track glucose-related symptoms and repeat screening regularly.",
      ],
      moderate: [
        "Reduce refined sugar and processed snacks.",
        "Monitor weight, hydration, and daily activity more closely.",
        "Schedule a clinical check for glucose and HbA1c review.",
      ],
      high: [
        "Consult a doctor soon for confirmatory diabetic testing.",
        "Start a strict low-sugar meal plan and avoid sugary drinks.",
        "Watch for frequent urination, fatigue, blurred vision, or slow healing.",
      ],
    },
    thyroid: {
      low: [
        "Maintain routine health checkups and a nutrient-rich diet.",
        "Track fatigue, mood, and weight changes over time.",
        "Keep sleep and stress levels under control.",
      ],
      moderate: [
        "Review thyroid function with a clinician if symptoms persist.",
        "Monitor energy, hair fall, and unexplained weight change.",
        "Support thyroid health with consistent meals and sleep.",
      ],
      high: [
        "Consult an endocrinologist or physician for thyroid evaluation.",
        "Get thyroid hormone tests reviewed as soon as possible.",
        "Seek care if you notice persistent fatigue, swelling, or rapid weight shifts.",
      ],
    },
    pcos: {
      low: [
        "Keep a healthy exercise routine and balanced eating plan.",
        "Monitor cycle regularity and skin or hair changes.",
        "Repeat screening if symptoms begin to increase.",
      ],
      moderate: [
        "Track menstrual irregularity, acne, and weight changes carefully.",
        "Reduce ultra-processed food and stay active consistently.",
        "Discuss hormone evaluation with a gynecologist if symptoms continue.",
      ],
      high: [
        "Book a gynecology consultation for further hormonal evaluation.",
        "Track periods, weight gain, hair growth, and skin darkening patterns.",
        "Prioritize lifestyle changes that support insulin sensitivity and weight control.",
      ],
    },
  };

  return suggestions[normalizedDisease]?.[normalizedRisk] || [
    "Discuss these results with a healthcare professional for guidance.",
  ];
};

export const buildSuggestionMap = (results) => {
  const suggestionMap = {};

  Object.entries(results || {}).forEach(([key, value]) => {
    if (value) {
      suggestionMap[key] = getDiseaseSuggestions(key, value.risk);
    }
  });

  return suggestionMap;
};
