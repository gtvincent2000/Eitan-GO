"use client";

import { useMemo, useState } from "react";
import Switch from "@/components/ui/Switch";
import {
  KANA_ITEMS,
  ROW_ORDER,
  COL_ORDER,
  YOUON_COL_ORDER,
  DAKUTEN_ROW_ORDER,
  HANDAKUTEN_ROW_ORDER,
} from "@/lib/kana/data";

export default function KanaTable({ script = "hiragana" }) {
  const [showRomaji, setShowRomaji] = useState(true);
  const [showYouon, setShowYouon] = useState(true);
  const [showDakuten, setShowDakuten] = useState(true);

  // Pools by tag
  const poolBasic = useMemo(
    () => KANA_ITEMS.filter((i) => i.script === script && i.tags?.includes("basic")),
    [script]
  );
  const poolYouon = useMemo(
    () => KANA_ITEMS.filter((i) => i.script === script && i.tags?.includes("youon")),
    [script]
  );
  const poolDaku = useMemo(
    () => KANA_ITEMS.filter((i) => i.script === script && (i.tags?.includes("dakuten") || i.tags?.includes("handakuten"))),
    [script]
  );

  return (
    <div className="space-y-4">
      {/* Controls row */}
      <div className="grid grid-cols-3 gap-3">
        <Cardlet title={`${script === "hiragana" ? "Hiragana" : "Katakana"} — Basic gojūon`}>
          <Switch label="Show romaji" checked={showRomaji} onChange={setShowRomaji} />
        </Cardlet>
        <Cardlet title="Youon (ゃ / ゅ / ょ)">
          <Switch label="Show youon" checked={showYouon} onChange={setShowYouon} />
        </Cardlet>
        <Cardlet title="Dakuten & Handakuten">
          <Switch label="Show voiced rows" checked={showDakuten} onChange={setShowDakuten} />
        </Cardlet>
      </div>

      {/* Basic grid */}
      <GridHeader cols={COL_ORDER} />
      {ROW_ORDER.map((row) => (
        <Row key={row} row={row} pool={poolBasic} showRomaji={showRomaji} />
      ))}

      {/* Special ん / ン */}
      <div className="mt-1 text-sm">
        <span style={{ color: "var(--foreground-secondary)" }}>Also:</span>{" "}
        <SpecialN pool={poolBasic} showRomaji={showRomaji} />
      </div>

      {/* Youon */}
      {showYouon && <YouonSection pool={poolYouon} showRomaji={showRomaji} />}

      {/* Dakuten & Handakuten */}
      {showDakuten && (
        <DakutenSection
          pool={poolDaku}
          showRomaji={showRomaji}
        />
      )}
    </div>
  );
}

/* ---------------- UI bits ---------------- */

function Cardlet({ title, children }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--card-bg)", border: `1px solid var(--card-border)` }}>
      <div className="mb-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function GridHeader({ cols }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      <div className="font-semibold" />
      {cols.map((c) => (
        <div
          key={c}
          className="font-semibold text-center uppercase"
          style={{ color: "var(--foreground-secondary)" }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

function Row({ row, pool, showRomaji }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      <div
        className="font-medium uppercase"
        style={{ color: "var(--foreground-secondary)" }}
      >
        {row}
      </div>
      {COL_ORDER.map((col) => (
        <Cell key={col} pool={pool} row={row} col={col} showRomaji={showRomaji} />
      ))}
    </div>
  );
}

function Cell({ pool, row, col, showRomaji }) {
  const item = pool.find((i) => i.row === row && i.col === col);
  if (!item) {
    return (
      <div className="h-12 rounded border" style={{ borderColor: "var(--card-border)" }} />
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
        <div className="text-[10px]" style={{ color: "var(--foreground-secondary)" }}>
          {item.romaji}
        </div>
      )}
    </div>
  );
}

function SpecialN({ pool, showRomaji }) {
  const n = pool.find((i) => i.row === "special" && i.col === "n");
  if (!n) return null;
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded border"
        style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
        title={n.romaji}
      >
        <span className="text-base">{n.kana}</span>
      </span>
      {showRomaji && (
        <span className="text-xs" style={{ color: "var(--foreground-secondary)" }}>
          {n.romaji}
        </span>
      )}
    </span>
  );
}

/* ---------------- Youon section ---------------- */

function YouonSection({ pool, showRomaji }) {
  const groups = groupBy(pool, (i) => i.youonBase);
  const basesInOrder = [
    "き","し","ち","に","ひ","み","り","ぎ","じ","ぢ","び","ぴ",
    "キ","シ","チ","ニ","ヒ","ミ","リ","ギ","ジ","ヂ","ビ","ピ",
  ].filter((b) => groups[b]);

  return (
    <div className="mt-2">
      <div className="mb-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
        Youon combinations
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="font-semibold" />
        {YOUON_COL_ORDER.map((c) => (
          <div
            key={c}
            className="font-semibold text-center uppercase"
            style={{ color: "var(--foreground-secondary)" }}
          >
            {c}
          </div>
        ))}

        {basesInOrder.map((base) => (
          <YouonRow key={base} baseKana={base} items={groups[base]} showRomaji={showRomaji} />
        ))}
      </div>
    </div>
  );
}

function YouonRow({ baseKana, items, showRomaji }) {
  return (
    <>
      <div className="font-medium" style={{ color: "var(--foreground-secondary)" }}>
        {baseKana}
        <span className="opacity-60"> + ゃゅょ</span>
      </div>
      {YOUON_COL_ORDER.map((col) => {
        const item = items.find((i) => i.col === col);
        if (!item) {
          return <div className="h-12 rounded border" style={{ borderColor: "var(--card-border)" }} />;
        }
        return (
          <div
            key={col}
            className="h-12 rounded border flex flex-col items-center justify-center"
            style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
            title={item.romaji}
          >
            <div className="text-lg leading-none">{item.kana}</div>
            {showRomaji && (
              <div className="text-[10px]" style={{ color: "var(--foreground-secondary)" }}>
                {item.romaji}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

/* ---------------- Dakuten & Handakuten section ---------------- */

function DakutenSection({ pool, showRomaji }) {
  // group rows by their row key ("g","z","d","b","p")
  const byRow = groupBy(pool, (i) => i.row);
  const rows = [...DAKUTEN_ROW_ORDER, ...HANDAKUTEN_ROW_ORDER].filter((r) => byRow[r]);

  return (
    <div className="mt-2">
      <div className="mb-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
        Dakuten & Handakuten rows
      </div>

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

        {rows.map((rowKey) => (
          <div key={rowKey} className="contents">
            <div className="font-medium uppercase" style={{ color: "var(--foreground-secondary)" }}>
              {rowKey}
            </div>
            {COL_ORDER.map((col) => {
              const item = byRow[rowKey].find((i) => i.col === col);
              if (!item) {
                return <div className="h-12 rounded border" style={{ borderColor: "var(--card-border)" }} />;
              }
              return (
                <div
                  key={col}
                  className="h-12 rounded border flex flex-col items-center justify-center"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                  title={item.romaji}
                >
                  <div className="text-lg leading-none">{item.kana}</div>
                  {showRomaji && (
                    <div className="text-[10px]" style={{ color: "var(--foreground-secondary)" }}>
                      {item.romaji}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- util ---------------- */

function groupBy(arr, keyFn) {
  const out = {};
  for (const it of arr) {
    const k = keyFn(it);
    (out[k] ??= []).push(it);
  }
  return out;
}
