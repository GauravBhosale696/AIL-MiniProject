import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import Home from "./pages/Home";
import Input from "./pages/Input";
import Results from "./pages/Results";

function App() {
  const [latestPrediction, setLatestPrediction] = useState(null);

  return (
    <Router>
      <div className="app">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/predict"
              element={<Input onPrediction={setLatestPrediction} />}
            />
            <Route
              path="/results"
              element={<Results latestPrediction={latestPrediction} />}
            />
          </Routes>
        </main>

        <ChatBot latestPrediction={latestPrediction} />
      </div>
    </Router>
  );
}

export default App;
