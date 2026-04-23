import { useState } from "react";
import { getDiseaseSuggestions } from "../utils/riskInsights";
import "../styles/ChatBot.css";

const buildBotReply = (input, latestPrediction) => {
  const text = input.toLowerCase().trim();

  if (!text) {
    return "Ask me about diabetes, thyroid, PCOS, or how to read your results.";
  }

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! I can explain your risk levels, suggestions, and the PDF report.";
  }

  if (text.includes("report") || text.includes("download")) {
    return latestPrediction
      ? "Use the Download PDF Report button in the results section to save your report."
      : "Run a prediction first, then I can guide you through downloading the report.";
  }

  if (text.includes("suggestion") || text.includes("advice")) {
    if (!latestPrediction) {
      return "Run a prediction first so I can give suggestions based on your current risk levels.";
    }

    const suggestions = [];
    Object.entries(latestPrediction.results).forEach(([key, value]) => {
      if (value) {
        suggestions.push(
          `${key.toUpperCase()}: ${getDiseaseSuggestions(key, value.risk)[0]}`
        );
      }
    });
    return suggestions.join(" ");
  }

  if (text.includes("diabetes") || text.includes("thyroid") || text.includes("pcos")) {
    const disease = text.includes("diabetes")
      ? "diabetes"
      : text.includes("thyroid")
        ? "thyroid"
        : "pcos";

    if (!latestPrediction?.results?.[disease]) {
      return `I do not have a recent ${disease.toUpperCase()} result yet. Run a prediction and I will explain it.`;
    }

    const result = latestPrediction.results[disease];
    const firstSuggestion = getDiseaseSuggestions(disease, result.risk)[0];
    return `${disease.toUpperCase()} risk is ${result.risk} at ${result.probability}%. Suggestion: ${firstSuggestion}`;
  }

  if (text.includes("risk") || text.includes("result")) {
    if (!latestPrediction) {
      return "No recent result is loaded yet. Run a prediction and I will summarize it for you.";
    }

    return Object.entries(latestPrediction.results)
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => `${key.toUpperCase()}: ${value.probability}% ${value.risk}`)
      .join(" | ");
  }

  return "I can help explain risk levels, disease suggestions, or the PDF report after prediction.";
};

const ChatBot = ({ latestPrediction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "I am your HormoAI assistant. Ask about your results, risk levels, or suggestions.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) {
      return;
    }

    const userMessage = { role: "user", text: input.trim() };
    const botMessage = {
      role: "bot",
      text: buildBotReply(input, latestPrediction),
    };

    setMessages((current) => [...current, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="chatbot-shell">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <h3>HormoAI Chat</h3>
            <button type="button" onClick={() => setIsOpen(false)}>x</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chatbot-message ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Ask about your result"
            />
            <button type="button" onClick={handleSend}>Send</button>
          </div>
        </div>
      )}

      <button type="button" className="chatbot-toggle" onClick={() => setIsOpen((value) => !value)}>
        Chat
      </button>
    </div>
  );
};

export default ChatBot;
