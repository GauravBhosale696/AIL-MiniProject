export const FEATURE_METADATA = {
  Age: { label: "Age", range: "10 - 100" },
  Pregnancies: { label: "Pregnancies", range: "0 - 15" },
  Glucose: { label: "Glucose", range: "70 - 140" },
  BloodPressure: { label: "Blood Pressure", range: "60 - 140" },
  Insulin: { label: "Insulin", range: "15 - 276" },
  BMI: { label: "BMI", range: "10 - 60" },
  folR: { label: "Fol R", range: "0 - 30" },
  folL: { label: "Fol L", range: "0 - 30" },
  skin: { label: "Skin Darkening", range: "0 - 1" },
  hair: { label: "Hair Growth", range: "0 - 1" },
  weight: { label: "Weight Gain", range: "0 - 1" },
  amh: { label: "AMH", range: "1 - 10" },
  cycle: { label: "Cycle", range: "0 = Regular, 1 = Irregular" },
  ratio: { label: "FSH/LH", range: "1 - 3" },
  lh: { label: "LH", range: "1 - 20" },
  fastfood: { label: "Fast Food", range: "0 - 1" },
  TSH: { label: "TSH", range: "0.27 - 4.2 uIU/mL" },
  TT4: { label: "TT4", range: "57 - 148 nmol/L" },
  T4U: { label: "T4U", range: "0.8 - 1.3 TBI" },
  FTI: { label: "FTI", range: "4.8 - 12.7" },
};

export const buildInputSummary = (formData) =>
  Object.entries(FEATURE_METADATA)
    .map(([key, meta]) => {
      const rawValue = formData[key];
      const femaleOnlyFields = ["folR", "folL", "skin", "hair", "weight", "amh", "cycle", "ratio", "lh", "fastfood"];
      const applicable = !(femaleOnlyFields.includes(key) && formData.gender !== "female")
        && !(key === "Pregnancies" && formData.gender !== "female");

      return {
        key,
        label: meta.label,
        value: applicable && rawValue !== "" ? rawValue : "N.A",
        range: meta.range,
        numericValue:
          applicable && rawValue !== "" && !Number.isNaN(Number(rawValue))
            ? Number(rawValue)
            : null,
      };
    });

export const buildFeatureChartData = (inputSummary) =>
  inputSummary
    .filter((item) => item.numericValue !== null)
    .map((item) => ({
      name: item.label,
      value: item.numericValue,
      range: item.range,
    }));
