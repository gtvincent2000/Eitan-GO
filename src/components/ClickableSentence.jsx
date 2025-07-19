import React, { useState } from "react";
import * as wanakana from "wanakana";
import { theme } from "../../tailwind.config";

const containsKanji = (text) => /[\u4e00-\u9faf]/.test(text);

export default function ClickableSentence({ kanaWords, romajiWords, onWordClick, showRomaji }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="flex flex-col items-start gap-1">
      {/* Kanji + furigana line */}
      <div className="flex flex-wrap gap-1">
        {kanaWords.map((word, index) => (
          <span
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={(e) => onWordClick(word, e)}
            className="
              cursor-pointer 
              px-1 py-0.5 
              rounded 
              transition-colors duration-200
            "
            style={{
              background: hoveredIndex === index ? "var(--clickable-hover)" : "var(--clickable-bg)",
              color: "var(--foreground)"
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
        ))}
      </div>

      {/* Romaji line Below (toggleable) */}
      {showRomaji && (
        <div
          className="flex flex-wrap gap-1 text-sm mt-1"
          style={{ color: "var(--foreground-secondary)" }}
        >
          {romajiWords.map((word, index) => (
            <span key={index} className="px-1">
              {word}
            </span>
          ))}
        </div>
      )}
  </div>
  );
}
