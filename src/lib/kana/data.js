export const COL_ORDER = ["a", "i", "u", "e", "o"];
export const ROW_ORDER = ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"];

/** Base tables: blanks ("") represent non-existent cells (we'll skip them) */
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
  special: ["ん"], // outside grid
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

/** Romaji lookup by row+col for the basic grid */
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

/** Helper: expand one script's table to items */
function expandBaseToItems(script, table) {
  const items = [];

  // grid rows
  for (const row of ROW_ORDER) {
    const kanaRow = table[row];
    const romajiRow = ROMAJI_TABLE[row];
    if (!kanaRow || !romajiRow) continue;

    for (let c = 0; c < COL_ORDER.length; c++) {
      const kana = kanaRow[c];
      const romaji = romajiRow[c];
      if (!kana || !romaji) continue; // skip blanks

      items.push({
        kana,
        romaji,
        script,                 // "hiragana" | "katakana"
        row,                    // e.g., "k"
        col: COL_ORDER[c],      // "a" | "i" | "u" | "e" | "o"
        tags: ["basic"],
      });
    }
  }

  // special: ん / ン
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

const HIRA_ITEMS = expandBaseToItems("hiragana", HIRA_TABLE);
const KATA_ITEMS = expandBaseToItems("katakana", KATA_TABLE);

/** Export the full basic set; dakuten/youon will be appended in a later step */
export const KANA_ITEMS = [...HIRA_ITEMS, ...KATA_ITEMS];
