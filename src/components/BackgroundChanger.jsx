import { useState } from "react";

import frozenKingdom from '../assets/frozen-kingdom.jpg'
import spiderMan from '../assets/spider-man.jpg'
import marvel from '../assets/modern-avengers.jpg'

export default function BackgroundChanger({ setBackground }) {
  const [customUrl, setCustomUrl] = useState("");

  const changeBackground = (url) => {
    if (url.startsWith("http") || url.startsWith("/")) {
      setBackground(url);
    } else {
      alert("Invalid URL");
    }
  };
  return (
    <div className="background-changer">
    <button
      onClick={() => changeBackground(frozenKingdom)}
      className="bg-button"
    >
      Frozen Kingdom
    </button>
    <button
          onClick={() => changeBackground(spiderMan)}
          className="bg-button"
        >
          Spider Man
        </button>
        <button
          onClick={() => changeBackground(marvel)}
          className="bg-button"
        >
          Marvel
        </button>
        <button onClick={() => changeBackground(customUrl)} className="bg-button custom-bg-button">
            Apply Custom Background
          </button>
        <div>
          <input
            type="text"
            placeholder="Enter custom URL"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="bg-input"
          />
        </div>
    </div>
  );
}
