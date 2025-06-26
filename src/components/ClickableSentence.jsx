import React, { useState } from "react";

export default function ClickableSentence({ kanaWords, romajiWords, onWordClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {kanaWords.map((kana, index) => (
        <div
          key={index}
          className="flex flex-col items-center cursor-pointer"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onWordClick(kana)}
        >
          <span className="text-lg hover:text-blue-600 transition">{kana}</span>
          <span
            className={`text-sm italic transition ${
              hoveredIndex === index ? "bg-yellow-200 rounded px-1" : ""
            }`}
          >
            {romajiWords[index] || ""}
          </span>
        </div>
      ))}
    </div>
  );
}