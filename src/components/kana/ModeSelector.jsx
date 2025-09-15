"use client";

import { useState } from "react";
import Switch from "@/components/ui/Switch"; // uses your themed switch

export default function ModeSelector({ onBegin }) {
  // mode toggles
  const [mKanaToRomaji, setMK2R] = useState(true);
  const [mRomajiToKana, setMR2K] = useState(false);
  const [mTyping, setMTyping] = useState(false);

  // script toggles
  const [sHiragana, setSHira] = useState(true);
  const [sKatakana, setSKata] = useState(false);

  // extra filters
  const [includeDakuten, setIncludeDakuten] = useState(false);
  const [includeYouon, setIncludeYouon] = useState(false);

  function getEnabledModes() {
    const modes = [];
    if (mKanaToRomaji) modes.push("kana→romaji");
    if (mRomajiToKana) modes.push("romaji→kana");
    if (mTyping) modes.push("typing");
    return modes;
  }

  function getEnabledScripts() {
    const scripts = [];
    if (sHiragana) scripts.push("hiragana");
    if (sKatakana) scripts.push("katakana");
    return scripts;
  }

  const handleBegin = () => {
    const modes = getEnabledModes();
    const scripts = getEnabledScripts();
    if (modes.length === 0) {
      alert("Select at least one mode.");
      return;
    }
    if (scripts.length === 0) {
      alert("Select at least one script (hiragana or katakana).");
      return;
    }
    onBegin?.({
      modes,
      scripts,
      includeDakuten,
      includeYouon,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <Section title="Modes">
        <Switch label="kana → romaji" checked={mKanaToRomaji} onChange={setMK2R} />
        <Switch label="romaji → kana" checked={mRomajiToKana} onChange={setMR2K} />
        <Switch label="typing" checked={mTyping} onChange={setMTyping} />
      </Section>

      <Section title="Scripts">
        <Switch label="hiragana" checked={sHiragana} onChange={setSHira} />
        <Switch label="katakana" checked={sKatakana} onChange={setSKata} />
      </Section>

      <Section title="Extras">
        <Switch
          label="Include dakuten / handakuten"
          checked={includeDakuten}
          onChange={setIncludeDakuten}
        />
        <Switch
          label="Include youon digraphs"
          checked={includeYouon}
          onChange={setIncludeYouon}
        />
      </Section>

      <button onClick={handleBegin} className="rounded px-4 py-2 transition button-theme">
        Begin
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: "var(--card-bg)",
        border: `1px solid var(--card-border)`,
      }}
    >
      <div
        className="mb-2 text-sm"
        style={{ color: "var(--foreground-secondary)" }}
      >
        {title}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
