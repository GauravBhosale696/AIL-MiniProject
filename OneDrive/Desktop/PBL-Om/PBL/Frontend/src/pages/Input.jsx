import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Input.css";
import { buildSuggestionMap } from "../utils/riskInsights";
import { buildFeatureChartData, buildInputSummary } from "../utils/reportMetadata";

const Input = ({ onPrediction }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: "male",
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    Insulin: "",
    BMI: "",
    Age: "",
    folR: "",
    folL: "",
    skin: "",
    hair: "",
    weight: "",
    amh: "",
    cycle: "",
    ratio: "",
    lh: "",
    fastfood: "",
    TSH: "",
    TT4: "",
    T4U: "",
    FTI: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((current) => ({ ...current, [e.target.id]: e.target.value }));
  };

  const showPcosInputs = formData.gender === "female";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const payload = {
        gender: formData.gender,
        Pregnancies: parseFloat(formData.Pregnancies) || 0,
        Glucose: parseFloat(formData.Glucose) || 0,
        BloodPressure: parseFloat(formData.BloodPressure) || 0,
        SkinThickness: 20,
        Insulin: parseFloat(formData.Insulin) || 0,
        BMI: parseFloat(formData.BMI) || 0,
        Age: parseFloat(formData.Age) || 0,
        "Follicle No. (R)": showPcosInputs ? parseFloat(formData.folR) || 0 : 0,
        "Follicle No. (L)": showPcosInputs ? parseFloat(formData.folL) || 0 : 0,
        "Skin darkening (Y/N)": showPcosInputs ? parseFloat(formData.skin) || 0 : 0,
        "hair growth(Y/N)": showPcosInputs ? parseFloat(formData.hair) || 0 : 0,
        "Weight gain(Y/N)": showPcosInputs ? parseFloat(formData.weight) || 0 : 0,
        "AMH(ng/mL)": showPcosInputs ? parseFloat(formData.amh) || 0 : 0,
        "Cycle(R/I)": showPcosInputs ? parseFloat(formData.cycle) || 0 : 0,
        "FSH/LH": showPcosInputs ? parseFloat(formData.ratio) || 0 : 0,
        "LH(mIU/mL)": showPcosInputs ? parseFloat(formData.lh) || 0 : 0,
        "Fast food (Y/N)": showPcosInputs ? parseFloat(formData.fastfood) || 0 : 0,
        age: parseFloat(formData.Age) || 0,
        sex: formData.gender === "male" ? 1 : 0,
        TSH: parseFloat(formData.TSH) || 0,
        TT4: parseFloat(formData.TT4) || 0,
        T4U: parseFloat(formData.T4U) || 0,
        FTI: parseFloat(formData.FTI) || 0,
      };

      const response = await fetch("http://127.0.0.1:5000/predict_all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const prediction = await response.json();
      if (!response.ok) {
        throw new Error(prediction.error || "Prediction failed");
      }

      const normalizedResult = {
        diabetes: prediction.diabetes || null,
        thyroid: prediction.thyroid || null,
        pcos: showPcosInputs ? prediction.pcos || null : null,
      };

      const suggestions = buildSuggestionMap(normalizedResult);
      const inputSummary = buildInputSummary(formData);
      const featureChartData = buildFeatureChartData(inputSummary);
      const reportData = {
        gender: formData.gender,
        results: normalizedResult,
        suggestions,
        inputSummary,
        featureChartData,
      };

      onPrediction?.(reportData);
      navigate("/results");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Server error!");
      onPrediction?.(null);
    }
  };

  return (
    <div className="input-container">
      <div className="form-card">
        <div className="dashboard-flower" aria-hidden="true">
          <span className="petal petal-a" />
          <span className="petal petal-b" />
          <span className="petal petal-c" />
          <span className="petal petal-d" />
          <span className="flower-core" />
        </div>

        <h1 className="title">Hormonal Health Risk Predictor</h1>

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h3>Basic Information</h3>
            <div className="grid">
              <div className="field">
                <label>Gender</label>
                <select id="gender" value={formData.gender} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="field">
                <label>Age</label>
                <input
                  type="number"
                  step="any"
                  id="Age"
                  value={formData.Age}
                  placeholder="10 - 100"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Diabetes Inputs</h3>
            <div className="grid">
              <div className="field">
                <label>Pregnancies</label>
                <select id="Pregnancies" value={formData.Pregnancies} onChange={handleChange} disabled={formData.gender !== "female"}>
                  <option value="">Select</option>
                  {[...Array(16).keys()].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Glucose</label>
                <input type="number" step="any" id="Glucose" value={formData.Glucose} placeholder="70 - 140 mg/dL" onChange={handleChange} />
              </div>

              <div className="field">
                <label>Blood Pressure</label>
                <input type="number" step="any" id="BloodPressure" value={formData.BloodPressure} placeholder="60 - 140 mmHg" onChange={handleChange} />
              </div>

              <div className="field">
                <label>Insulin</label>
                <input type="number" step="any" id="Insulin" value={formData.Insulin} placeholder="15 - 276" onChange={handleChange} />
              </div>

              <div className="field">
                <label>BMI</label>
                <input type="number" step="any" id="BMI" value={formData.BMI} placeholder="10 - 60" onChange={handleChange} />
              </div>
            </div>
          </div>

          {showPcosInputs && (
            <div className="section">
              <h3>PCOS Inputs</h3>
              <div className="grid">
                <div className="field">
                  <label>Follicle (R)</label>
                  <input type="number" step="any" id="folR" value={formData.folR} placeholder="0 - 30" onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Follicle (L)</label>
                  <input type="number" step="any" id="folL" value={formData.folL} placeholder="0 - 30" onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Skin Darkening</label>
                  <select id="skin" value={formData.skin} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>

                <div className="field">
                  <label>Hair Growth</label>
                  <select id="hair" value={formData.hair} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>

                <div className="field">
                  <label>Weight Gain</label>
                  <select id="weight" value={formData.weight} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>

                <div className="field">
                  <label>AMH</label>
                  <input type="number" step="any" id="amh" value={formData.amh} placeholder="1 - 10" onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Cycle</label>
                  <select id="cycle" value={formData.cycle} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="0">Regular</option>
                    <option value="1">Irregular</option>
                  </select>
                </div>

                <div className="field">
                  <label>FSH/LH Ratio</label>
                  <input type="number" step="any" id="ratio" value={formData.ratio} placeholder="1 - 3" onChange={handleChange} />
                </div>

                <div className="field">
                  <label>LH</label>
                  <input type="number" step="any" id="lh" value={formData.lh} placeholder="1 - 20" onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Fast Food</label>
                  <select id="fastfood" value={formData.fastfood} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="section">
            <h3>Thyroid Inputs</h3>
            <div className="grid">
              <div className="field">
                <label>TSH</label>
                <input type="number" step="any" id="TSH" value={formData.TSH} placeholder="0.27 - 4.2 uIU/mL" onChange={handleChange} />
              </div>

              <div className="field">
                <label>TT4</label>
                <input type="number" step="any" id="TT4" value={formData.TT4} placeholder="57 - 148 nmol/L" onChange={handleChange} />
              </div>

              <div className="field">
                <label>T4U</label>
                <input type="number" step="any" id="T4U" value={formData.T4U} placeholder="0.8 - 1.3 TBI" onChange={handleChange} />
              </div>

              <div className="field">
                <label>FTI</label>
                <input type="number" step="any" id="FTI" value={formData.FTI} placeholder="4.8 - 12.7" onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Predict
          </button>
        </form>

        {errorMessage && <div className="result-box error-box">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Input;
