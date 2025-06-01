import React, { useState } from "react";
import axios from "axios";
import { FaCopy, FaCheck } from "react-icons/fa";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerate = async (inputPrompt) => {
    const query = inputPrompt ?? prompt;
    if (!query.trim()) return;

    setLoading(true);
    setCopiedIndex(null);
    setResult(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/generate-colors`, { prompt: query });
      setResult(response.data);
    } catch (error) {
      console.error("Error generating colors:", error);
      alert("Failed to generate colors. Please try again.");
    }
    setLoading(false);
  };

  const handleCopyColor = (color, index) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (result?.colors) {
      navigator.clipboard.writeText(result.colors.join(", "));
      alert("Palette copied to clipboard!");
    }
  };

  return (
    <div className="container">
      <h1>🎨 AI Color Palette Generator</h1>
      <p>
        Enter a theme (e.g., <i>sunset beach, neon cyberpunk</i>) and let AI craft a stunning
        5-color palette for you!
      </p>

      <div className="input-row">
        <input
          type="text"
          placeholder="e.g., sunset beach, neon cyberpunk..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
        <button onClick={() => handleGenerate()} disabled={loading || prompt.trim() === ""}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {result && (
        <div className="chat-window">
          {/* AI Palette Name Bubble */}
          <div className="chat-bubble ai-bubble palette-name">
            <strong>{result.palette_name || "Color Palette"}</strong>
          </div>

          {/* AI Palette Description Bubble */}
          <div className="chat-bubble ai-bubble palette-description">
            {result.description || "Here's a beautiful 5-color HEX palette for you."}
          </div>

          {/* Color Palette as Chat Bubbles */}
          <div className="palette-chat">
            {result.colors.map((color, i) => (
              <div
                key={i}
                className="chat-bubble color-bubble"
                style={{ backgroundColor: color, color: getContrastYIQ(color) }}
                onClick={() => handleCopyColor(color, i)}
                title="Click to copy hex code"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && handleCopyColor(color, i)}
              >
                {copiedIndex === i ? (
                  <span className="copy-confirm">
                    <FaCheck /> Copied!
                  </span>
                ) : (
                  color
                )}
              </div>
            ))}
          </div>

          <button className="copy-all-btn" onClick={handleCopyAll}>
            Copy All HEX Codes
          </button>

          {/* Suggested Prompts as chat buttons */}
          <div className="suggestions-container">
            <p><strong>Try these prompts:</strong></p>
            <div className="suggestions-list">
              {result.suggestions.map((sugg, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn"
                  onClick={() => {
                    setPrompt(sugg);
                    handleGenerate(sugg);
                  }}
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility to get readable text color based on background
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? "#000" : "#fff";
}

export default App;
