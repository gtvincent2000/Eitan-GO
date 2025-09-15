import { useState } from "react";
import { KANA_ITEMS, ROW_ORDER, COL_ORDER } from "@/lib/kana/data";

export default function KanaTable({ script = "hiragana" }) {
  const [showRomaji, setShowRomaji] = useState(true);
  const pool = KANA_ITEMS.filter(
    (i) => i.script === script && i.tags?.includes("basic")
  );

  return (
    <div>
      {/* toggle control */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
          Show Romaji
        </span>
        <button
          onClick={() => setShowRomaji(!showRomaji)}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
            showRomaji ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
              showRomaji ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* existing table */}
      <div className="grid grid-cols-6 gap-2">
        <div className="font-semibold" />
        {COL_ORDER.map((c) => (
          <div
            key={c}
            className="font-semibold text-center uppercase"
            style={{ color: "var(--foreground-secondary)" }}
          >
            {c}
          </div>
        ))}
        {ROW_ORDER.map((row) => (
          <Row key={row} row={row} pool={pool} showRomaji={showRomaji} />
        ))}
      </div>
    </div>
  );
}

function Row({ row, pool, showRomaji }) {
  return (
    <>
      <div
        className="font-medium uppercase"
        style={{ color: "var(--foreground-secondary)" }}
      >
        {row}
      </div>
      {COL_ORDER.map((col) => (
        <Cell key={col} pool={pool} row={row} col={col} showRomaji={showRomaji} />
      ))}
    </>
  );
}

function Cell({ pool, row, col, showRomaji }) {
  const item = pool.find((i) => i.row === row && i.col === col);
  if (!item) {
    return (
      <div
        className="h-12 rounded border"
        style={{ borderColor: "var(--card-border)" }}
      />
    );
  }
  return (
    <div
      className="h-12 rounded border flex flex-col items-center justify-center"
      style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
      title={item.romaji}
    >
      <div className="text-lg leading-none">{item.kana}</div>
      {showRomaji && (
        <div
          className="text-[10px]"
          style={{ color: "var(--foreground-secondary)" }}
        >
          {item.romaji}
        </div>
      )}
    </div>
  );
}
