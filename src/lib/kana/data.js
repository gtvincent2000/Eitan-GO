/**
 * Canonical kana data for both scripts.
 * - Base gojūon grid (tags: ["basic"])
 * - Dakuten rows: g/z/d/b (tags: ["dakuten"])
 * - Handakuten row: p (tags: ["handakuten"])
 * - Youon (digraphs) (tags: ["youon"])
 */

export const COL_ORDER = ["a", "i", "u", "e", "o"];
export const ROW_ORDER = ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"];
export const YOUON_COL_ORDER = ["ya", "yu", "yo"];
export const DAKUTEN_ROW_ORDER = ["g", "z", "d", "b"]; // voiced rows
export const HANDAKUTEN_ROW_ORDER = ["p"];             // semi-voiced row

/* ---------------- Base tables ---------------- */

const HIRA_TABLE = {
  vowel: ["あ", "い", "う", "え", "お"],
  k:     ["か", "き", "く", "け", "こ"],
  s:     ["さ", "し", "す", "せ", "そ"],
  t:     ["た", "ち", "つ", "て", "と"],
  n:     ["な", "に", "ぬ", "ね", "の"],
  h:     ["は", "ひ", "ふ", "へ", "ほ"],
  m:     ["ま", "み", "む", "め", "も"],
  y:     ["や", "",  "ゆ", "",  "よ"],
  r:     ["ら", "り", "る", "れ", "ろ"],
  w:     ["わ", "",  "",  "",   "を"],
  special: ["ん"],
};

const KATA_TABLE = {
  vowel: ["ア", "イ", "ウ", "エ", "オ"],
  k:     ["カ", "キ", "ク", "ケ", "コ"],
  s:     ["サ", "シ", "ス", "セ", "ソ"],
  t:     ["タ", "チ", "ツ", "テ", "ト"],
  n:     ["ナ", "ニ", "ヌ", "ネ", "ノ"],
  h:     ["ハ", "ヒ", "フ", "ヘ", "ホ"],
  m:     ["マ", "ミ", "ム", "メ", "モ"],
  y:     ["ヤ", "",  "ユ", "",  "ヨ"],
  r:     ["ラ", "リ", "ル", "レ", "ロ"],
  w:     ["ワ", "",  "",  "",   "ヲ"],
  special: ["ン"],
};

/* ---------------- Romaji for base rows ---------------- */

const ROMAJI_TABLE = {
  vowel: ["a", "i", "u", "e", "o"],
  k:     ["ka", "ki", "ku", "ke", "ko"],
  s:     ["sa", "shi", "su", "se", "so"],
  t:     ["ta", "chi", "tsu", "te", "to"],
  n:     ["na", "ni", "nu", "ne", "no"],
  h:     ["ha", "hi", "fu", "he", "ho"],
  m:     ["ma", "mi", "mu", "me", "mo"],
  y:     ["ya", "",   "yu", "",   "yo"],
  r:     ["ra", "ri", "ru", "re", "ro"],
  w:     ["wa", "",   "",   "",    "wo"],
  special: ["n"],
};

/* ---------------- Dakuten / Handakuten rows ----------------
   Define the kana explicitly; romaji are derived below. */

const HIRA_DAKUTEN = {
  g: ["が", "ぎ", "ぐ", "げ", "ご"],
  z: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  d: ["だ", "ぢ", "づ", "で", "ど"],
  b: ["ば", "び", "ぶ", "べ", "ぼ"],
};
const HIRA_HANDAKUTEN = {
  p: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
};

const KATA_DAKUTEN = {
  g: ["ガ", "ギ", "グ", "ゲ", "ゴ"],
  z: ["ザ", "ジ", "ズ", "ゼ", "ゾ"],
  d: ["ダ", "ヂ", "ヅ", "デ", "ド"],
  b: ["バ", "ビ", "ブ", "ベ", "ボ"],
};
const KATA_HANDAKUTEN = {
  p: ["パ", "ピ", "プ", "ペ", "ポ"],
};

/* Romaji rows for voiced/semi-voiced lines */
const ROMAJI_DAKUTEN = {
  g: ["ga", "gi", "gu", "ge", "go"],
  z: ["za", "ji", "zu", "ze", "zo"],   // じ = ji
  d: ["da", "ji", "zu", "de", "do"],   // ぢ/ヂ, づ/ヅ commonly pronounced like ji/zu
  b: ["ba", "bi", "bu", "be", "bo"],
};
const ROMAJI_HANDAKUTEN = {
  p: ["pa", "pi", "pu", "pe", "po"],
};

/* ---------------- Expand helpers ---------------- */

function expandBaseToItems(script, table) {
  const items = [];

  for (const row of ROW_ORDER) {
    const kanaRow = table[row];
    const romajiRow = ROMAJI_TABLE[row];
    if (!kanaRow || !romajiRow) continue;

    for (let c = 0; c < COL_ORDER.length; c++) {
      const kana = kanaRow[c];
      const romaji = romajiRow[c];
      if (!kana || !romaji) continue;

      items.push({
        kana,
        romaji,
        script,
        row,
        col: COL_ORDER[c],
        tags: ["basic"],
      });
    }
  }

  const specialKana = table.special?.[0];
  const specialRomaji = ROMAJI_TABLE.special?.[0];
  if (specialKana && specialRomaji) {
    items.push({
      kana: specialKana,
      romaji: specialRomaji,
      script,
      row: "special",
      col: "n",
      tags: ["basic", "special"],
    });
  }

  return items;
}

function expandVoiced(script, kanaRows, romajiRows, tag) {
  const items = [];
  const rowKeys = Object.keys(kanaRows);
  for (const row of rowKeys) {
    const kanaRow = kanaRows[row];
    const romaRow = romajiRows[row];
    for (let c = 0; c < COL_ORDER.length; c++) {
      const kana = kanaRow[c];
      const romaji = romaRow[c];
      if (!kana || !romaji) continue;
      items.push({
        kana,
        romaji,
        script,
        row,                // "g" | "z" | "d" | "b" | "p"
        col: COL_ORDER[c],
        tags: [tag],        // "dakuten" | "handakuten"
      });
    }
  }
  return items;
}

/* ---------------- Youon (digraphs) ---------------- */

const YOUON_BASES = [
  { row: "k",  baseH: "き", baseK: "キ", stem: "ky"  },
  { row: "s",  baseH: "し", baseK: "シ", stem: "sh"  },
  { row: "t",  baseH: "ち", baseK: "チ", stem: "ch"  },
  { row: "n",  baseH: "に", baseK: "ニ", stem: "ny"  },
  { row: "h",  baseH: "ひ", baseK: "ヒ", stem: "hy"  },
  { row: "m",  baseH: "み", baseK: "ミ", stem: "my"  },
  { row: "r",  baseH: "り", baseK: "リ", stem: "ry"  },
  { row: "g",  baseH: "ぎ", baseK: "ギ", stem: "gy"  },
  { row: "z",  baseH: "じ", baseK: "ジ", stem: "j"   },
  { row: "d",  baseH: "ぢ", baseK: "ヂ", stem: "j"   },
  { row: "b",  baseH: "び", baseK: "ビ", stem: "by"  },
  { row: "p",  baseH: "ぴ", baseK: "ピ", stem: "py"  },
];

const SMALL_H = { ya: "ゃ", yu: "ゅ", yo: "ょ" };
const SMALL_K = { ya: "ャ", yu: "ュ", yo: "ョ" };

function expandYouon(script) {
  const items = [];
  const small = script === "hiragana" ? SMALL_H : SMALL_K;

  for (const b of YOUON_BASES) {
    const baseKana = script === "hiragana" ? b.baseH : b.baseK;
    for (const col of YOUON_COL_ORDER) {
      const kana = baseKana + small[col];
      const vowel = col === "ya" ? "a" : col === "yu" ? "u" : "o";
      const romaji =
        b.stem === "sh" ? `sh${vowel}` :
        b.stem === "ch" ? `ch${vowel}` :
        b.stem === "j"  ? `j${vowel}`  :
        `${b.stem}${vowel}`;
      items.push({
        kana,
        romaji,
        script,
        row: "youon",
        col,
        youonBase: baseKana,
        tags: ["youon"],
      });
    }
  }
  return items;
}

/* ---------------- Build all items ---------------- */

const HIRA_ITEMS = expandBaseToItems("hiragana", HIRA_TABLE);
const KATA_ITEMS = expandBaseToItems("katakana", KATA_TABLE);

const HIRA_DAKU_ITEMS = expandVoiced("hiragana", HIRA_DAKUTEN, ROMAJI_DAKUTEN, "dakuten");
const HIRA_HANDAKU_ITEMS = expandVoiced("hiragana", HIRA_HANDAKUTEN, ROMAJI_HANDAKUTEN, "handakuten");

const KATA_DAKU_ITEMS = expandVoiced("katakana", KATA_DAKUTEN, ROMAJI_DAKUTEN, "dakuten");
const KATA_HANDAKU_ITEMS = expandVoiced("katakana", KATA_HANDAKUTEN, ROMAJI_HANDAKUTEN, "handakuten");

const HIRA_YOUON = expandYouon("hiragana");
const KATA_YOUON = expandYouon("katakana");

/** Export the full dataset */
export const KANA_ITEMS = [
  ...HIRA_ITEMS,
  ...KATA_ITEMS,
  ...HIRA_DAKU_ITEMS,
  ...HIRA_HANDAKU_ITEMS,
  ...KATA_DAKU_ITEMS,
  ...KATA_HANDAKU_ITEMS,
  ...HIRA_YOUON,
  ...KATA_YOUON,
];
