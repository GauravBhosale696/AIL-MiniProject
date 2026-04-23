from flask import Flask, request, jsonify
from flask_cors import CORS

from services.prediction_service import (
    predict_diabetes,
    predict_pcos,
    predict_thyroid,
)


app = Flask(__name__)
CORS(app)


def get_risk_level(prob):
    if prob < 0.3:
        return "Low"
    if prob < 0.7:
        return "Moderate"
    return "High"


@app.route("/")
def home():
    return "API is running successfully"


@app.route("/predict_all", methods=["POST"])
def predict_all():
    data = request.json

    if not data:
        return jsonify({"error": "No input data"}), 400

    try:
        gender = data.get("gender", "male").lower()

        diabetes_prob = predict_diabetes(data)
        thyroid_prob = max(predict_thyroid(data), 0.05)

        result = {
            "diabetes": {
                "probability": round(diabetes_prob * 100, 2),
                "risk": get_risk_level(diabetes_prob),
            },
            "thyroid": {
                "probability": round(thyroid_prob * 100, 2),
                "risk": get_risk_level(thyroid_prob),
            },
        }

        if gender == "female":
            pcos_prob = predict_pcos(data)
            result["pcos"] = {
                "probability": round(pcos_prob * 100, 2),
                "risk": get_risk_level(pcos_prob),
            }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
