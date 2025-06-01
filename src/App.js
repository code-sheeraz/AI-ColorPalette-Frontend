import React, { useState } from "react";
import axios from "axios";
import { FaCopy, FaCheck } from "react-icons/fa";
import "./App.css"; // ⬅️ Import the CSS file

function App() {
  const [prompt, setPrompt] = useState("");
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setCopiedIndex(null);
    try {
      const response = await axios.post("https://ai-colorpalette-backend.onrender.com/generate-colors", {
  prompt,
});
      setColors(response.data.colors);
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
    navigator.clipboard.writeText(colors.join(", "));
    alert("Palette copied to clipboard!");
  };

  return (
    <div className="container">
      <h1>🎨 AI Color Palette Generator</h1>
      <p>
        Enter a theme (e.g., <i>sunset beach, neon cyberpunk</i>) and let AI craft a stunning
        5-color palette for you!
      </p>

      <div>
        <input
          type="text"
          placeholder="e.g., sunset beach, neon cyberpunk..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleGenerate} disabled={loading || prompt.trim() === ""}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      <div className="palette">
        {colors.map((color, i) => (
          <div
            key={i}
            className="color-box"
            style={{ backgroundColor: color }}
            onClick={() => handleCopyColor(color, i)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleCopyColor(color, i)}
          >
            <div className="color-label">
              {copiedIndex === i ? (
                <div className="copy-confirm">
                  <FaCheck size={14} />
                  Copied!
                </div>
              ) : (
                <>
                  <FaCopy size={12} style={{ marginRight: "6px" }} />
                  {color}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {colors.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <button onClick={handleCopyAll}>Copy All HEX Codes</button>
        </div>
      )}
    </div>
  );
}

export default App;
