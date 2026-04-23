import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import "../styles/Results.css";
import { downloadPdfReport } from "../utils/pdfReport";

const resultLabels = {
  diabetes: "Diabetes",
  thyroid: "Thyroid",
  pcos: "PCOS",
};

const riskChartDataFromResults = (results) =>
  Object.entries(results || {})
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => ({
      disease: resultLabels[key],
      risk: value.probability,
      level: value.risk,
    }));

const Results = ({ latestPrediction }) => {
  if (!latestPrediction) {
    return (
      <div className="results-page">
        <div className="results-empty">
          <h1>No Prediction Yet</h1>
          <p>Run a prediction first to view your graphical analysis and download the report.</p>
          <Link className="results-back-btn" to="/predict">Go To Prediction Form</Link>
        </div>
      </div>
    );
  }

  const riskChartData = riskChartDataFromResults(latestPrediction.results);

  return (
    <div className="results-page">
      <section className="results-hero">
        <div>
          <p className="results-kicker">Graphical Analysis Dashboard</p>
          <h1>Prediction Insights</h1>
          <p>
            Review your disease risks, compare the entered feature values, and export
            a styled PDF report from one place.
          </p>
        </div>

        <div className="results-actions">
          <button
            type="button"
            className="results-download-btn"
            onClick={() => downloadPdfReport(latestPrediction)}
          >
            Download Styled PDF
          </button>
          <Link className="results-back-btn" to="/predict">Edit Inputs</Link>
        </div>
      </section>

      <section className="results-risk-grid">
        {Object.entries(latestPrediction.results).map(([key, value]) => (
          value ? (
            <article key={key} className="risk-summary-card">
              <h3>{resultLabels[key]}</h3>
              <div className="risk-ring">
                <div className="risk-ring-inner">
                  <span>{value.probability}%</span>
                  <small>{value.risk}</small>
                </div>
              </div>
              <ul>
                {latestPrediction.suggestions[key].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null
        ))}
      </section>

      <section className="results-chart-grid">
        <article className="results-chart-card">
          <h3>Risk Comparison</h3>
          <div className="results-chart-wrap">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={riskChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#efbfd2" />
                <XAxis dataKey="disease" tick={{ fill: "#7a294d" }} />
                <YAxis tick={{ fill: "#7a294d" }} />
                <Tooltip />
                <Bar dataKey="risk" fill="#db5f93" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="results-chart-card">
          <h3>Risk Radar</h3>
          <div className="results-chart-wrap">
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart outerRadius="70%" data={riskChartData}>
                <PolarGrid stroke="#efbfd2" />
                <PolarAngleAxis dataKey="disease" tick={{ fill: "#7a294d", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#a45c7a", fontSize: 10 }} />
                <Radar
                  name="Risk"
                  dataKey="risk"
                  stroke="#bf3d75"
                  fill="#e78ab0"
                  fillOpacity={0.55}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="results-chart-card feature-analysis-card">
        <h3>Feature-Based Analysis</h3>
        <p>
          This graph shows the numeric inputs that shaped the prediction output.
        </p>
        <div className="results-chart-wrap feature-chart">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={latestPrediction.featureChartData} margin={{ top: 16, right: 20, left: 10, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efbfd2" />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={110}
                tick={{ fill: "#7a294d", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "#7a294d", fontSize: 12 }} />
              <Tooltip
                formatter={(value, _name, item) => [value, `${item.payload.name} (${item.payload.range})`]}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid rgba(191, 95, 136, 0.18)",
                  background: "#fff7fb",
                }}
              />
              <Bar dataKey="value" fill="#cf5d8d" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

    </div>
  );
};

export default Results;
