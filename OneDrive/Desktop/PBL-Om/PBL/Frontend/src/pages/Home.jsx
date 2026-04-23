import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "../styles/Home.css";
import {
  diabetesPrevalence,
  thyroidPrevalence,
  pcosPrevalence,
} from "../utils/universalStats";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-bloom" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <p className="hero-kicker">Early screening support for hormonal health</p>
        <h1 className="hero-text">
          AI Powered <span>Hormonal Disease Detection</span>
        </h1>
        <p className="hero-subtext">
          Explore early screening insights for diabetes, thyroid disorders, and PCOS
          in a soft, guided space designed to feel approachable.
        </p>

        <div className="hero-actions">
          <button className="start-btn" onClick={() => navigate("/predict")}>
            Start Prediction
          </button>
          <button className="secondary-btn" onClick={() => navigate("/predict")}>
            Open Predict Dashboard
          </button>
        </div>
      </section>

      <section className="symptom-panel">
        <h2 className="symptoms">Key Symptoms</h2>
        <div className="cards-section">
          <div className="card">
            <h2>PCOS</h2>
            <div className="tags">
              <span>Irregular periods</span>
              <span>Facial hair</span>
              <span>Acne</span>
              <span>Weight gain</span>
            </div>
          </div>

          <div className="card">
            <h2>Thyroid Disorder</h2>
            <div className="tags">
              <span>Fatigue</span>
              <span>Weight changes</span>
              <span>Hair thinning</span>
              <span>Mood swings</span>
            </div>
          </div>

          <div className="card">
            <h2>Diabetes</h2>
            <div className="tags">
              <span>Frequent urination</span>
              <span>High thirst</span>
              <span>Weight loss</span>
              <span>Slow healing</span>
            </div>
          </div>
        </div>
      </section>

      <section className="universal-panel">
        <h2 className="symptoms">Universal Disease Trends</h2>
        <p className="universal-copy">
          These charts show population-level prevalence percentages by age group and sex.
        </p>

        <div className="universal-grid">
          <article className="universal-card">
            <h3>Diabetes By Age And Sex</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={diabetesPrevalence}>
                <CartesianGrid strokeDasharray="3 3" stroke="#efbfd2" />
                <XAxis dataKey="age" tick={{ fill: "#7a294d" }} />
                <YAxis tick={{ fill: "#7a294d" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="male" fill="#8a5de8" radius={[10, 10, 0, 0]} />
                <Bar dataKey="female" fill="#db5f93" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </article>

          <article className="universal-card">
            <h3>Thyroid Disease By Age And Sex</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={thyroidPrevalence}>
                <CartesianGrid strokeDasharray="3 3" stroke="#efbfd2" />
                <XAxis dataKey="age" tick={{ fill: "#7a294d" }} />
                <YAxis tick={{ fill: "#7a294d" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="male" fill="#8a5de8" radius={[10, 10, 0, 0]} />
                <Bar dataKey="female" fill="#db5f93" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </article>

          <article className="universal-card universal-card-wide">
            <h3>PCOS By Female Age Group</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={pcosPrevalence}>
                <CartesianGrid strokeDasharray="3 3" stroke="#efbfd2" />
                <XAxis dataKey="age" tick={{ fill: "#7a294d" }} />
                <YAxis tick={{ fill: "#7a294d" }} />
                <Tooltip />
                <Bar dataKey="female" fill="#db5f93" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>HormoAI</h3>
            <p>Guided screening support for diabetes, thyroid imbalance, and PCOS risk awareness.</p>
          </div>

          <div className="footer-section">
            <h4>Explore</h4>
            <ul>
              <li>Home</li>
              <li>Predict</li>
              <li>Risk Insights</li>
              <li>Health Report</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <p>Email: support@hormoai.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>For informational use only. Please confirm risks with a medical professional.</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 HormoAI. Screening insights for awareness, not a medical diagnosis.
        </div>
      </footer>
    </div>
  );
};

export default Home;
