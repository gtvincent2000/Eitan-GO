import React, { useState } from "react";
import * as wanakana from "wanakana";

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
            onClick={() => onWordClick(word)}
            className="cursor-pointer px-1 py-0.5 rounded hover:bg-blue-100 transition"
          >
            <ruby>
              {word}
              {containsKanji(word) && (
                <rt className="text-xs text-gray-500">
                  {wanakana.toHiragana(romajiWords[index])}
                </rt>
              )}
            </ruby>
          </span>
        ))}
      </div>

      {/* Romaji line Below (toggleable) */}
      {showRomaji && (
        <div className="flex flex-wrap gap-1 text-sm text-gray-700 mt-1">
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