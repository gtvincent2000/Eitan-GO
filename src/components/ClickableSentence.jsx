import React, { useState } from "react";
import * as wanakana from "wanakana";
import { theme } from "../../tailwind.config";

const containsKanji = (text) => /[\u4e00-\u9faf]/.test(text);

export default function ClickableSentence({ kanaWords, romajiWords, onWordClick, showRomaji }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="flex flex-wrap justify-center gap-2 text-center">
      {kanaWords.map((word, index) => (
        <div key={index} className="flex flex-col items-center">
          {/* Kanji + Furigana */}
          <span
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={(e) => onWordClick(word, e)}
            className="cursor-pointer px-1 py-0.5 rounded transition-colors duration-200"
            style={{
              background: hoveredIndex === index ? "var(--clickable-hover)" : "var(--clickable-bg)",
              color: "var(--foreground)",
            }}
          >
            <ruby>
              {word}
              {containsKanji(word) && (
                <rt
                  className="text-xs"
                  style={{ color: "var(--foreground-secondary)" }}
                >
                  {wanakana.toHiragana(romajiWords[index])}
                </rt>
              )}
            </ruby>
          </span>

          {/* Romaji Below (conditionally) */}
          {showRomaji && (
            <span className="text-xs mt-1" style={{ color: "var(--foreground-secondary)" }}>
              {romajiWords[index]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
